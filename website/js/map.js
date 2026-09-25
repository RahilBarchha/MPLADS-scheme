/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - GIS Spatial Map Controller
 * 
 * Renders interactive Leaflet.js map with geotagged project coordinates across Uttar Pradesh,
 * custom vector pins, status/risk popup cards, dynamic filter controls, and reliable zoom & extent tools.
 * ==============================================================================
 */

let leafletMap = null;
let markersLayerGroup = null;
let currentFilteredBounds = null;
let streetTilesLayer = null;
let satelliteTilesLayer = null;
let currentBaseLayer = 'street';

// Geographic centers of key Uttar Pradesh districts for accurate asset distribution
const DISTRICT_CENTERS = {
    'varanasi': [25.3176, 82.9739],
    'gorakhpur': [26.7606, 83.3732],
    'prayagraj': [25.4358, 81.8463],
    'lucknow': [26.8467, 80.9462],
    'ayodhya': [26.7922, 82.1998],
    'kanpur': [26.4499, 80.3319],
    'kanpur nagar': [26.4499, 80.3319],
    'mirzapur': [25.1337, 82.5644],
    'jaunpur': [25.7464, 82.6837]
};

const DEFAULT_MAP_CENTER = [22.5, 79.5];
const DEFAULT_MAP_ZOOM = 5;
const INDIA_BOUNDS = [
    [7.5, 68.0],
    [37.0, 97.5]
];

document.addEventListener('DOMContentLoaded', () => {
    initLeafletMap();
    initMapFilters();
    initMapToolbarActions();
    initMapKeyboardShortcuts();

    // Re-render when backend data synchronizes or window resizes
    window.addEventListener('mplads_backend_synced', () => {
        renderMapMarkers();
    });
    window.addEventListener('mplads:projectsSynced', () => {
        renderMapMarkers();
    });
});

/**
 * Custom Vector Pin Generator
 * Eliminates dependency on external marker images that could 404,
 * and provides clear color coding by risk and completion status.
 */
function createCustomPin(status = 'ONGOING', risk = 'LOW', index = 0) {
    let pinColor = '#10b981'; // Green (LOW)
    if (risk === 'CRITICAL') pinColor = '#ef4444'; // Red
    else if (risk === 'HIGH') pinColor = '#f97316'; // Orange
    else if (risk === 'MEDIUM') pinColor = '#f59e0b'; // Amber

    const iconSymbol = status === 'COMPLETED' ? '✓' : (status === 'DELAYED' ? '!' : '●');

    return L.divIcon({
        className: 'mplads-map-pin',
        html: `
            <div style="
                position: relative;
                width: 32px;
                height: 32px;
                background: ${pinColor};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 10px rgba(0,0,0,0.35);
                border: 2.5px solid #ffffff;
                cursor: pointer;
                transition: transform 0.15s ease;
            ">
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(45deg);
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 800;
                    line-height: 1;
                    text-align: center;
                ">${iconSymbol}</div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
}

function initLeafletMap() {
    const mapEl = document.getElementById('mapContainer');
    if (!mapEl) return;

    if (typeof L === 'undefined') {
        mapEl.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:#f8fafc;color:#64748b;padding:24px;text-align:center;">
                <span style="font-size:2.5rem;margin-bottom:8px;">🗺️</span>
                <strong style="color:#0f172a;font-size:1.1rem;">Leaflet GIS Engine Initializing...</strong>
                <p style="font-size:0.85rem;max-width:400px;margin-top:6px;">Loading regional spatial raster tiles for Uttar Pradesh districts.</p>
                <button type="button" class="btn btn-secondary btn-sm" onclick="location.reload()" style="margin-top:12px;">Reload GIS Map</button>
            </div>
        `;
        return;
    }

    try {
        // Initialize Map framed to show ONLY India with strict spatial boundary lock
        leafletMap = L.map('mapContainer', {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
            boxZoom: true,
            keyboard: true,
            minZoom: 4,
            maxZoom: 18,
            maxBounds: [
                [6.5, 67.5],
                [37.5, 97.5]
            ],
            maxBoundsViscosity: 1.0
        }).fitBounds(INDIA_BOUNDS, { padding: [10, 10] });
        window.leafletMap = leafletMap;

        // 1. High-Resolution Clean Street Map (ESRI World Street Map - 100% Free, No API Key, No Watermark, Never Blocked)
        streetTilesLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 4,
            maxZoom: 19,
            attribution: 'Tiles & Street Map © <a href="https://www.esri.com" target="_blank">ESRI</a> | MoSPI MPLADS'
        });

        // 2. High-Resolution Satellite Layer (ESRI World Imagery - Free, Crisp)
        satelliteTilesLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 4,
            maxZoom: 19,
            attribution: 'Tiles & Imagery © <a href="https://www.esri.com" target="_blank">ESRI</a> | MoSPI MPLADS'
        });

        // Add default base layer
        streetTilesLayer.addTo(leafletMap);

        // Prominent On-Map Layer Switcher (Replaces tiny, obscure default icon)
        const LayerControlCustom = L.Control.extend({
            options: { position: 'topright' },
            onAdd: function () {
                const container = L.DomUtil.create('div', 'custom-satellite-control');
                container.innerHTML = `
                    <div class="custom-layer-switcher-card" role="group" aria-label="Map Base Layer">
                        <button type="button" id="mapPillStreet" class="map-layer-pill-btn active" title="Switch to Road/Street Map">
                            <span class="layer-pill-icon">🗺️</span>
                            <span class="layer-pill-text">Street</span>
                        </button>
                        <button type="button" id="mapPillSatellite" class="map-layer-pill-btn" title="Switch to High-Resolution Satellite View">
                            <span class="layer-pill-icon">🛰️</span>
                            <span class="layer-pill-text">Satellite</span>
                        </button>
                    </div>
                `;
                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.disableScrollPropagation(container);

                const pillStreet = container.querySelector('#mapPillStreet');
                const pillSat = container.querySelector('#mapPillSatellite');

                if (pillStreet) {
                    pillStreet.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.switchMapLayer('street');
                    };
                }
                if (pillSat) {
                    pillSat.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.switchMapLayer('satellite');
                    };
                }

                return container;
            }
        });
        new LayerControlCustom().addTo(leafletMap);

        markersLayerGroup = L.layerGroup().addTo(leafletMap);

        // Render markers
        renderMapMarkers();

        // Invalidate map size to handle flex layout container correctly
        const forceRefresh = () => {
            if (leafletMap) {
                leafletMap.invalidateSize();
                bindLeafletBuiltinZoomButtons();
            }
        };

        setTimeout(forceRefresh, 100);
        setTimeout(forceRefresh, 350);
        setTimeout(forceRefresh, 800);

        window.addEventListener('resize', forceRefresh);

    } catch (err) {
        console.error('[Leaflet Init Error]', err);
    }
}

/**
 * Bind direct event listeners to Leaflet's built-in floating zoom controls (+ and -)
 */
function bindLeafletBuiltinZoomButtons() {
    if (!leafletMap) return;

    const zoomInBtn = document.querySelector('.leaflet-control-zoom-in');
    const zoomOutBtn = document.querySelector('.leaflet-control-zoom-out');

    if (zoomInBtn) {
        zoomInBtn.setAttribute('title', 'Zoom In (+)');
        zoomInBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (leafletMap) leafletMap.zoomIn(1);
        };
    }

    if (zoomOutBtn) {
        zoomOutBtn.setAttribute('title', 'Zoom Out (-)');
        zoomOutBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (leafletMap) leafletMap.zoomOut(1);
        };
    }
}

// Global Map Action Helpers
window.zoomMapIn = function () {
    if (leafletMap) leafletMap.zoomIn(1);
};
window.zoomMapOut = function () {
    if (leafletMap) leafletMap.zoomOut(1);
};
window.fitMapBounds = function () {
    if (leafletMap && currentFilteredBounds && currentFilteredBounds.isValid()) {
        leafletMap.fitBounds(currentFilteredBounds, { padding: [30, 30], maxZoom: 11 });
    } else if (leafletMap) {
        leafletMap.fitBounds(INDIA_BOUNDS, { padding: [20, 20] });
    }
};

/**
 * Switch Base Map Layer (Street vs Satellite)
 * Smoothly swaps tile providers while preserving vector markers and bounds
 */
window.switchMapLayer = function (layerType) {
    if (!leafletMap || !streetTilesLayer || !satelliteTilesLayer) return;

    if (layerType === 'satellite') {
        if (leafletMap.hasLayer(streetTilesLayer)) {
            leafletMap.removeLayer(streetTilesLayer);
        }
        if (!leafletMap.hasLayer(satelliteTilesLayer)) {
            satelliteTilesLayer.addTo(leafletMap);
        }
        currentBaseLayer = 'satellite';
    } else {
        if (leafletMap.hasLayer(satelliteTilesLayer)) {
            leafletMap.removeLayer(satelliteTilesLayer);
        }
        if (!leafletMap.hasLayer(streetTilesLayer)) {
            streetTilesLayer.addTo(leafletMap);
        }
        currentBaseLayer = 'street';
    }

    // Keep pin markers layer group always visible on top
    if (markersLayerGroup) {
        markersLayerGroup.bringToFront();
    }

    // Update visual active state across all UI toggles (Toolbar and Floating Pill)
    updateLayerSwitcherUI(currentBaseLayer);
};

function updateLayerSwitcherUI(activeLayer) {
    // Toolbar buttons in header
    const btnStreet = document.getElementById('btnLayerStreet');
    const btnSat = document.getElementById('btnLayerSatellite');
    if (btnStreet) btnStreet.classList.toggle('active', activeLayer === 'street');
    if (btnSat) btnSat.classList.toggle('active', activeLayer === 'satellite');

    // On-map floating pill buttons
    const mapPillStreet = document.getElementById('mapPillStreet');
    const mapPillSat = document.getElementById('mapPillSatellite');
    if (mapPillStreet) mapPillStreet.classList.toggle('active', activeLayer === 'street');
    if (mapPillSat) mapPillSat.classList.toggle('active', activeLayer === 'satellite');
}

/**
 * Wire dedicated Toolbar Controls (+ Zoom In, - Zoom Out, Fit All, Layer Switcher)
 */
function initMapToolbarActions() {
    const btnZoomIn = document.getElementById('btnMapZoomIn');
    const btnZoomOut = document.getElementById('btnMapZoomOut');
    const btnFitBounds = document.getElementById('btnMapFitBounds');
    const btnStreet = document.getElementById('btnLayerStreet');
    const btnSatellite = document.getElementById('btnLayerSatellite');

    if (btnZoomIn) {
        btnZoomIn.onclick = (e) => {
            e.preventDefault();
            window.zoomMapIn();
        };
    }

    if (btnZoomOut) {
        btnZoomOut.onclick = (e) => {
            e.preventDefault();
            window.zoomMapOut();
        };
    }

    if (btnFitBounds) {
        btnFitBounds.onclick = (e) => {
            e.preventDefault();
            window.fitMapBounds();
        };
    }

    if (btnStreet) {
        btnStreet.onclick = (e) => {
            e.preventDefault();
            window.switchMapLayer('street');
        };
    }

    if (btnSatellite) {
        btnSatellite.onclick = (e) => {
            e.preventDefault();
            window.switchMapLayer('satellite');
        };
    }
}

/**
 * Keyboard shortcuts (+ / -) for accessibility
 */
function initMapKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target?.tagName)) return;

        if (e.key === '+' || e.key === '=') {
            if (leafletMap) {
                e.preventDefault();
                leafletMap.zoomIn(1);
            }
        } else if (e.key === '-' || e.key === '_') {
            if (leafletMap) {
                e.preventDefault();
                leafletMap.zoomOut(1);
            }
        } else if (e.key === '0') {
            if (leafletMap) {
                e.preventDefault();
                leafletMap.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
            }
        }
    });
}

function initMapFilters() {
    const catFilter = document.getElementById('mapFilterCategory');
    const statusFilter = document.getElementById('mapFilterStatus');
    const riskFilter = document.getElementById('mapFilterRisk');

    if (catFilter) catFilter.addEventListener('change', renderMapMarkers);
    if (statusFilter) statusFilter.addEventListener('change', renderMapMarkers);
    if (riskFilter) riskFilter.addEventListener('change', renderMapMarkers);
}

function renderMapMarkers() {
    if (!markersLayerGroup || !leafletMap) return;

    markersLayerGroup.clearLayers();

    // Pull works from memory or API
    let works = [];
    if (window.MPLADS_DEMO_DATA && Array.isArray(window.MPLADS_DEMO_DATA.works)) {
        works = window.MPLADS_DEMO_DATA.works;
    }

    const cat = document.getElementById('mapFilterCategory')?.value || 'ALL';
    const status = document.getElementById('mapFilterStatus')?.value || 'ALL';
    const risk = document.getElementById('mapFilterRisk')?.value || 'ALL';

    const latLngPoints = [];

    const filtered = works.filter(w => {
        const matchCat = cat === 'ALL' || w.category === cat;
        const matchStatus = status === 'ALL' || w.status === status;
        const matchRisk = risk === 'ALL' || w.risk === risk;
        return matchCat && matchStatus && matchRisk;
    });

    filtered.forEach((w, index) => {
        // Resolve coordinates with district fallback so every work always has a pin on the map
        let lat = w.coordinates?.lat ?? w.latitude ?? (w.lat != null ? Number(w.lat) : null);
        let lng = w.coordinates?.lng ?? w.longitude ?? (w.lng != null ? Number(w.lng) : null);

        if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
            const distKey = (w.district || '').toLowerCase().trim();
            let center = DISTRICT_CENTERS[distKey];
            if (!center && window.getStateForDistrict && window.STATE_COORDINATES) {
                const st = window.getStateForDistrict(w.district);
                if (st && window.STATE_COORDINATES[st]) {
                    center = window.STATE_COORDINATES[st];
                }
            }
            if (!center) center = DEFAULT_MAP_CENTER;
            // Micro-offset to avoid stacking pins directly on top of each other
            const angle = (index * 45) * (Math.PI / 180);
            const radius = 0.04 + ((index % 4) * 0.02);
            lat = center[0] + (Math.sin(angle) * radius);
            lng = center[1] + (Math.cos(angle) * radius);
        }

        lat = Number(lat);
        lng = Number(lng);

        latLngPoints.push([lat, lng]);

        const customIcon = createCustomPin(w.status, w.risk, index);
        const marker = L.marker([lat, lng], { icon: customIcon });

        const statusClass = `badge-status-${String(w.status || 'ongoing').toLowerCase()}`;
        const riskClass = `badge-risk-${String(w.risk || 'low').toLowerCase()}`;
        const approvedAmount = Number(w.approvedAmountLakhs || 0).toFixed(2);
        const completionPct = Number(w.completionPct || 0);

        const popupContent = `
            <div style="font-family:'Inter',sans-serif;font-size:12.5px;min-width:250px;line-height:1.45;padding:4px;">
                <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${w.id || 'WRK-2026'}</div>
                <strong style="color:#0a1f38;font-size:13.5px;display:block;margin:3px 0 6px;line-height:1.3;">${w.name || 'Sanctioned Development Work'}</strong>
                <div style="color:#475569;margin-bottom:8px;font-size:12px;background:#f8fafc;padding:6px 8px;border-radius:6px;border:1px solid #e2e8f0;">
                    <div>🏛️ District: <strong style="color:#0f172a;">${w.district || 'Varanasi'}</strong></div>
                    <div>🏷️ Category: <strong>${w.category || 'General'}</strong></div>
                    <div>💰 Sanctioned: <strong style="color:#065f46;">₹${approvedAmount} Lakhs</strong></div>
                    ${w.panchayat ? `<div>📍 Panchayat: <strong>${w.panchayat}</strong></div>` : ''}
                </div>
                <div style="display:flex;gap:6px;margin-bottom:8px;">
                    <span class="badge ${statusClass}" style="font-size:9.5px;padding:2px 7px;">${w.status || 'ONGOING'}</span>
                    <span class="badge ${riskClass}" style="font-size:9.5px;padding:2px 7px;">${w.risk || 'LOW'} RISK</span>
                </div>
                <div style="background:#e2e8f0;border-radius:999px;height:7px;overflow:hidden;margin-bottom:4px;">
                    <div style="background:#10b981;height:100%;width:${completionPct}%;"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:11px;color:#64748b;font-weight:600;">
                    <span>Physical Progress</span>
                    <span>${completionPct}%</span>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300 });
        markersLayerGroup.addLayer(marker);
    });

    // Compute active bounding box
    if (latLngPoints.length > 0 && typeof L !== 'undefined') {
        currentFilteredBounds = L.latLngBounds(latLngPoints);
    } else {
        currentFilteredBounds = null;
    }

    const countEl = document.getElementById('mapActiveMarkersCount');
    if (countEl) {
        countEl.textContent = `Displaying ${filtered.length} of ${works.length} Geotagged Works`;
    }

    // Refresh click handlers on Leaflet's zoom buttons
    setTimeout(bindLeafletBuiltinZoomButtons, 120);
}
