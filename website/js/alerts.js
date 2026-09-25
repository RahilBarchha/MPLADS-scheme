/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Alerts & Early Warning Controller
 * 
 * Comprehensive Anomaly Intelligence Module:
 * 1. 8 Dynamic Alert KPIs derived from live demo state
 * 2. Neutral monitoring terminology & non-accusatory governance models
 * 3. 4 Chart.js Intelligence Visualizations (Severity, Typology, Status, Trend)
 * 4. Multi-criteria filtering engine, search, and dynamic sorting
 * 5. Professional pagination (10, 25, 50 rows per page)
 * 6. Alert Details Modal with 0-100 visual risk meter & audit evidence
 * 7. Verification Lifecycle: Under Review, Assign Officer, Add Note, Resolve, Dismiss
 * 8. Linked Work Telemetry Inspector
 * 9. Client-side CSV export
 * ==============================================================================
 */

let alertsData = [];
let worksData = [];
let filteredAlerts = [];
let currentPage = 1;
let rowsPerPage = 10;
let currentSort = { column: 'detectedDate', direction: 'desc' };

// Chart instances registry
let alertCharts = {
    severity: null,
    type: null,
    status: null,
    trend: null
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize dataset references
    const demo = window.MPLADS_DEMO_DATA;
    alertsData = [...(demo?.alerts || [])];
    worksData = [...(demo?.works || [])];
    filteredAlerts = [...alertsData];

    // 2. Initialize UI components & charts
    populateAlertsFilterDropdowns();
    updateAlertsSummaryMetrics();
    initAlertsCharts();
    initAlertsEvents();
    sortAndRenderAlertsTable();
});

window.addEventListener('mplads_backend_synced', () => {
    const demo = window.MPLADS_DEMO_DATA;
    alertsData = [...(demo?.alerts || [])];
    worksData = [...(demo?.works || [])];
    filteredAlerts = [...alertsData];
    populateAlertsFilterDropdowns();
    updateAlertsSummaryMetrics();
    initAlertsCharts();
    sortAndRenderAlertsTable();
});

function populateAlertsFilterDropdowns() {
    const distSelect = document.getElementById('alertsFilterDistrict');
    if (!distSelect) return;

    const uniqueDistricts = Array.from(new Set(
        alertsData.map(a => a.district).filter(Boolean)
    )).sort();

    if (uniqueDistricts.length > 0) {
        const curVal = distSelect.value;
        const optionsHtml = uniqueDistricts.map(d => `<option value="${d}">${d}</option>`).join('');
        distSelect.innerHTML = `<option value="ALL">All Districts (${uniqueDistricts.length})</option>${optionsHtml}`;
        if (curVal && (curVal === 'ALL' || uniqueDistricts.includes(curVal))) {
            distSelect.value = curVal;
        }
    }
}

/**
 * ==============================================================================
 * 1. ALERT KPI SUMMARY CALCULATIONS
 * ==============================================================================
 */
function updateAlertsSummaryMetrics() {
    const totalEl = document.getElementById('altKpiTotal');
    const critEl = document.getElementById('altKpiCritical');
    const highEl = document.getElementById('altKpiHigh');
    const medEl = document.getElementById('altKpiMedium');
    const lowEl = document.getElementById('altKpiLow');
    const openEl = document.getElementById('altKpiOpen');
    const revEl = document.getElementById('altKpiReview');
    const resEl = document.getElementById('altKpiResolved');
    const badgeEl = document.getElementById('alertsPageCountBadge');

    const total = alertsData.length;
    const critical = alertsData.filter(a => a.severity === 'CRITICAL' || (a.riskScore && a.riskScore > 75)).length;
    const high = alertsData.filter(a => a.severity === 'HIGH' || (a.riskScore && a.riskScore > 50 && a.riskScore <= 75)).length;
    const medium = alertsData.filter(a => a.severity === 'MEDIUM' || (a.riskScore && a.riskScore > 25 && a.riskScore <= 50)).length;
    const low = alertsData.filter(a => a.severity === 'LOW' || (a.riskScore && a.riskScore <= 25)).length;

    const open = alertsData.filter(a => (a.status || '').toUpperCase() === 'OPEN').length;
    const underReview = alertsData.filter(a => {
        const s = (a.status || '').toUpperCase();
        return s === 'UNDER_REVIEW' || s === 'UNDER REVIEW';
    }).length;
    const resolved = alertsData.filter(a => (a.status || '').toUpperCase() === 'RESOLVED').length;

    if (totalEl) totalEl.textContent = total;
    if (critEl) critEl.textContent = critical;
    if (highEl) highEl.textContent = high;
    if (medEl) medEl.textContent = medium;
    if (lowEl) lowEl.textContent = low;

    if (openEl) openEl.textContent = open;
    if (revEl) revEl.textContent = underReview;
    if (resEl) resEl.textContent = resolved;
    if (badgeEl) badgeEl.textContent = open + underReview;
}

/**
 * ==============================================================================
 * 2. ANOMALY DASHBOARD VISUALIZATIONS (Chart.js)
 * ==============================================================================
 */
function initAlertsCharts() {
    if (typeof Chart === 'undefined') return;

    // -------------------------------------------------------------
    // Chart A: Alerts by Severity (Doughnut)
    // -------------------------------------------------------------
    const ctxSev = document.getElementById('alertSeverityChart');
    if (ctxSev) {
        if (alertCharts.severity) alertCharts.severity.destroy();

        const critical = alertsData.filter(a => a.severity === 'CRITICAL').length;
        const high = alertsData.filter(a => a.severity === 'HIGH').length;
        const medium = alertsData.filter(a => a.severity === 'MEDIUM').length;
        const low = alertsData.filter(a => a.severity === 'LOW').length;

        alertCharts.severity = new Chart(ctxSev, {
            type: 'doughnut',
            data: {
                labels: ['Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'],
                datasets: [{
                    data: [critical, high, medium, low],
                    backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#10b981'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 8 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                                return ` ${ctx.label}: ${ctx.raw} alerts (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // -------------------------------------------------------------
    // Chart B: Alerts by Anomaly Typology (Horizontal Bar)
    // -------------------------------------------------------------
    const ctxType = document.getElementById('alertTypeChart');
    if (ctxType) {
        if (alertCharts.type) alertCharts.type.destroy();

        const typesMap = {};
        alertsData.forEach(a => {
            const t = a.type || 'General Anomaly';
            typesMap[t] = (typesMap[t] || 0) + 1;
        });

        const labels = Object.keys(typesMap);
        const data = Object.values(typesMap);

        alertCharts.type = new Chart(ctxType, {
            type: 'bar',
            data: {
                labels: labels.map(l => l.length > 20 ? `${l.substring(0, 20)}…` : l),
                datasets: [{
                    label: 'Anomaly Count',
                    data: data,
                    backgroundColor: '#1f6b9c',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: ctx => labels[ctx[0].dataIndex],
                            label: ctx => ` Flagged Occurrences: ${ctx.raw}`
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, font: { family: 'Inter', size: 10 } },
                        grid: { color: '#f1f5f9' }
                    },
                    y: {
                        ticks: { font: { family: 'Inter', size: 10 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // -------------------------------------------------------------
    // Chart C: Alerts by Operational Status (Doughnut)
    // -------------------------------------------------------------
    const ctxStatus = document.getElementById('alertStatusChart');
    if (ctxStatus) {
        if (alertCharts.status) alertCharts.status.destroy();

        const open = alertsData.filter(a => (a.status || '').toUpperCase() === 'OPEN').length;
        const review = alertsData.filter(a => {
            const s = (a.status || '').toUpperCase();
            return s === 'UNDER_REVIEW' || s === 'UNDER REVIEW';
        }).length;
        const resolved = alertsData.filter(a => (a.status || '').toUpperCase() === 'RESOLVED').length;
        const dismissed = alertsData.filter(a => (a.status || '').toUpperCase() === 'DISMISSED').length;

        alertCharts.status = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Open (Action Needed)', 'Under Review (Assigned)', 'Resolved (Verified)', 'Dismissed (Valid)'],
                datasets: [{
                    data: [open, review, resolved, dismissed],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#64748b'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 8 }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // -------------------------------------------------------------
    // Chart D: Anomaly Detection Trend Over Time (Line Chart)
    // -------------------------------------------------------------
    const ctxTrend = document.getElementById('alertTrendChart');
    if (ctxTrend) {
        if (alertCharts.trend) alertCharts.trend.destroy();

        // Sample aggregated chronological timeline
        const timeLabels = ['Aug W1', 'Aug W2', 'Aug W3', 'Aug W4', 'Sep W1', 'Sep W2', 'Sep W3'];
        const trendData = [1, 2, 1, 3, 2, 4, 3];

        alertCharts.trend = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Detected Flags',
                    data: trendData,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.12)',
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#f97316'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` Triggered Flags: ${ctx.raw}`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 10 } } },
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, font: { family: 'Inter', size: 10 } },
                        grid: { color: '#f1f5f9' }
                    }
                }
            }
        });
    }
}

/**
 * ==============================================================================
 * 3. MULTI-FILTERING & SEARCH ENGINE
 * ==============================================================================
 */
function initAlertsEvents() {
    const searchInput = document.getElementById('alertsSearchInput');
    const sevFilter = document.getElementById('alertsFilterSeverity');
    const typeFilter = document.getElementById('alertsFilterType');
    const distFilter = document.getElementById('alertsFilterDistrict');
    const statusFilter = document.getElementById('alertsFilterStatus');
    const dateFrom = document.getElementById('alertsFilterDateFrom');
    const dateTo = document.getElementById('alertsFilterDateTo');

    const applyBtn = document.getElementById('alertsApplyBtn');
    const resetBtn = document.getElementById('alertsResetBtn');
    const rowsPerPageSelect = document.getElementById('alertsRowsPerPage');

    // Dynamic search on input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            applyAlertsFilters();
        });
    }

    // Rows per page
    if (rowsPerPageSelect) {
        rowsPerPageSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            rowsPerPage = val === 'ALL' ? 999999 : (parseInt(val, 10) || 10);
            currentPage = 1;
            sortAndRenderAlertsTable();
        });
    }

    // Filter changes
    [sevFilter, typeFilter, distFilter, statusFilter, dateFrom, dateTo].forEach(el => {
        if (el) {
            el.addEventListener('change', () => {
                currentPage = 1;
                applyAlertsFilters();
            });
        }
    });

    // Apply & Reset
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            currentPage = 1;
            applyAlertsFilters();
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAlertsFilters);
    }

    // Assign Alert Form Submit
    const assignForm = document.getElementById('assignAlertForm');
    if (assignForm) {
        assignForm.addEventListener('submit', handleAssignSubmit);
    }

    // Add Note Form Submit
    const noteForm = document.getElementById('addNoteForm');
    if (noteForm) {
        noteForm.addEventListener('submit', handleAddNoteSubmit);
    }
}

function resetAlertsFilters() {
    const searchInput = document.getElementById('alertsSearchInput');
    const sevFilter = document.getElementById('alertsFilterSeverity');
    const typeFilter = document.getElementById('alertsFilterType');
    const distFilter = document.getElementById('alertsFilterDistrict');
    const statusFilter = document.getElementById('alertsFilterStatus');
    const dateFrom = document.getElementById('alertsFilterDateFrom');
    const dateTo = document.getElementById('alertsFilterDateTo');

    if (searchInput) searchInput.value = '';
    if (sevFilter) sevFilter.value = 'ALL';
    if (typeFilter) typeFilter.value = 'ALL';
    if (distFilter) distFilter.value = 'ALL';
    if (statusFilter) statusFilter.value = 'ALL';
    if (dateFrom) dateFrom.value = '';
    if (dateTo) dateTo.value = '';

    currentPage = 1;
    applyAlertsFilters();
}

function applyAlertsFilters() {
    const search = document.getElementById('alertsSearchInput')?.value.toLowerCase().trim() || '';
    const severity = document.getElementById('alertsFilterSeverity')?.value || 'ALL';
    const type = document.getElementById('alertsFilterType')?.value || 'ALL';
    const district = document.getElementById('alertsFilterDistrict')?.value || 'ALL';
    const status = document.getElementById('alertsFilterStatus')?.value || 'ALL';
    const dateFrom = document.getElementById('alertsFilterDateFrom')?.value || '';
    const dateTo = document.getElementById('alertsFilterDateTo')?.value || '';

    filteredAlerts = alertsData.filter(a => {
        // Multi-field search
        const matchesSearch = !search ||
            (a.id && a.id.toLowerCase().includes(search)) ||
            (a.workId && a.workId.toLowerCase().includes(search)) ||
            (a.workName && a.workName.toLowerCase().includes(search)) ||
            (a.district && a.district.toLowerCase().includes(search)) ||
            (a.type && a.type.toLowerCase().includes(search)) ||
            (a.description && a.description.toLowerCase().includes(search));

        // Filters
        const matchesSev = severity === 'ALL' || a.severity === severity;
        const matchesType = type === 'ALL' || a.type === type;
        const cleanDist = district.trim().toLowerCase();
        const matchesDist = district === 'ALL' || (a.district && a.district.trim().toLowerCase() === cleanDist);

        // Status normalization match
        let matchesStatus = true;
        if (status !== 'ALL') {
            const rawStatus = (a.status || '').toUpperCase();
            if (status === 'OPEN') matchesStatus = rawStatus === 'OPEN';
            else if (status === 'UNDER_REVIEW') matchesStatus = rawStatus === 'UNDER_REVIEW' || rawStatus === 'UNDER REVIEW';
            else if (status === 'RESOLVED') matchesStatus = rawStatus === 'RESOLVED';
            else if (status === 'DISMISSED') matchesStatus = rawStatus === 'DISMISSED';
        }

        // Date range
        let matchesDate = true;
        if (dateFrom && a.detectedDate) {
            matchesDate = matchesDate && (a.detectedDate >= dateFrom);
        }
        if (dateTo && a.detectedDate) {
            matchesDate = matchesDate && (a.detectedDate <= dateTo);
        }

        return matchesSearch && matchesSev && matchesType && matchesDist && matchesStatus && matchesDate;
    });

    sortAndRenderAlertsTable();
}

/**
 * ==============================================================================
 * 4. SORTING & PAGINATION
 * ==============================================================================
 */
window.sortAlerts = function (column) {
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = (column === 'riskScore' || column === 'detectedDate') ? 'desc' : 'asc';
    }

    sortAndRenderAlertsTable();
};

function sortAndRenderAlertsTable() {
    const col = currentSort.column;
    const dir = currentSort.direction === 'asc' ? 1 : -1;

    // Severity order mapping
    const sevWeights = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };

    filteredAlerts.sort((a, b) => {
        let valA = a[col];
        let valB = b[col];

        if (col === 'severity') {
            return ((sevWeights[valA] || 0) - (sevWeights[valB] || 0)) * dir;
        }
        if (col === 'riskScore') {
            return ((Number(valA) || 0) - (Number(valB) || 0)) * dir;
        }
        if (col === 'detectedDate') {
            return (new Date(valA || 0) - new Date(valB || 0)) * dir;
        }

        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();

        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
    });

    // Update sort header indicators
    const sortColumns = ['id', 'type', 'district', 'severity', 'riskScore', 'detectedDate', 'status'];
    sortColumns.forEach(c => {
        const iconEl = document.getElementById(`sort-icon-${c}`);
        const thEl = iconEl?.closest('th');
        if (iconEl && thEl) {
            if (c === currentSort.column) {
                iconEl.textContent = currentSort.direction === 'asc' ? '▲' : '▼';
                thEl.classList.add('sort-active');
            } else {
                iconEl.textContent = '↕';
                thEl.classList.remove('sort-active');
            }
        }
    });

    renderAlertsTable();
}

function renderAlertsTable() {
    const tbody = document.getElementById('alertsTableBody');
    const badgeEl = document.getElementById('alertsCountBadge');
    if (!tbody) return;

    const total = filteredAlerts.length;
    if (badgeEl) badgeEl.textContent = `${total} Alerts Shown`;

    if (total === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center;padding:45px 20px;color:var(--text-muted);">
                    <div style="font-size:2.2rem;margin-bottom:8px;">🔍</div>
                    <strong style="font-size:1rem;color:var(--text-primary);display:block;margin-bottom:4px;">No anomaly flags match current filters</strong>
                    <span style="font-size:0.85rem;">Try adjusting search keywords or resetting filter controls.</span>
                </td>
            </tr>
        `;
        renderPagination(0, 0, 0);
        return;
    }

    const totalPages = Math.ceil(total / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, total);
    const paged = filteredAlerts.slice(startIndex, endIndex);

    tbody.innerHTML = paged.map(a => {
        const sevClass = `badge-risk-${(a.severity || 'low').toLowerCase()}`;
        const score = Number(a.riskScore) || 20;

        let scoreChipClass = 'low';
        if (score > 75) scoreChipClass = 'critical';
        else if (score > 50) scoreChipClass = 'high';
        else if (score > 25) scoreChipClass = 'medium';

        // Normalized status badge
        const statusRaw = (a.status || 'OPEN').toUpperCase();
        let statusBadgeClass = 'badge-status-open';
        let displayStatus = 'Open';

        if (statusRaw === 'UNDER_REVIEW' || statusRaw === 'UNDER REVIEW') {
            statusBadgeClass = 'badge-status-under_review';
            displayStatus = 'Under Review';
        } else if (statusRaw === 'RESOLVED') {
            statusBadgeClass = 'badge-status-resolved';
            displayStatus = 'Resolved';
        } else if (statusRaw === 'DISMISSED') {
            statusBadgeClass = 'badge-status-dismissed';
            displayStatus = 'Dismissed';
        }

        const workTitle = a.workName || 'Target Public Work';
        const truncatedWork = workTitle.length > 25 ? `${workTitle.substring(0, 25)}…` : workTitle;
        const truncatedDesc = a.description.length > 55 ? `${a.description.substring(0, 55)}…` : a.description;
        const assignedOfficer = a.assignedTo?.officer ? a.assignedTo.officer.split('(')[0].trim() : 'Unassigned';

        return `
            <tr>
                <td><strong>${a.id}</strong></td>
                <td><span class="badge badge-info" style="font-size:0.7rem;">${a.type}</span></td>
                <td>
                    <a href="javascript:void(0)" onclick="viewRelatedWork('${a.workId}')" style="font-weight:600;color:var(--primary-700);text-decoration:none;" title="Inspect ${a.workId}">
                        ${a.workId}
                    </a>
                    <div style="font-size:0.72rem;color:var(--text-muted);" title="${workTitle}">${truncatedWork}</div>
                </td>
                <td><span style="font-size:0.82rem;">${a.district || '—'}</span></td>
                <td><span class="badge ${sevClass}">${a.severity}</span></td>
                <td>
                    <span class="risk-score-chip ${scoreChipClass}">${score}/100</span>
                </td>
                <td><span style="font-size:0.78rem;color:var(--text-secondary);" title="${a.description}">${truncatedDesc}</span></td>
                <td><span style="font-size:0.75rem;color:var(--text-muted);">${a.detectedDate}</span></td>
                <td><span class="badge ${statusBadgeClass}">${displayStatus}</span></td>
                <td><span style="font-size:0.76rem;color:var(--text-secondary);">${assignedOfficer}</span></td>
                <td>
                    <div style="display:flex;gap:4px;">
                        <button class="btn btn-primary btn-sm" onclick="window.openForensicModal('${a.id}', 'alert')" title="Open MoSPI AI Forensic Audit Dossier" style="padding:3px 7px;font-size:0.75rem;background:linear-gradient(135deg,#0284c7,#0369a1);border:none;color:#fff;">
                            🔍 AI Audit
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="viewAlertDetails('${a.id}')" title="Inspect Full Telemetry" style="padding:3px 7px;font-size:0.75rem;">
                            View
                        </button>
                        ${(displayStatus === 'Open' || displayStatus === 'Under Review') ? `
                            <button class="btn btn-secondary btn-sm" onclick="openAssignModal('${a.id}')" title="Assign Officer" style="padding:3px 7px;font-size:0.75rem;">
                                Assign
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    renderPagination(total, startIndex, endIndex);
}

function renderPagination(total, startIndex, endIndex) {
    const infoEl = document.getElementById('alertsPaginationInfo');
    const controlsEl = document.getElementById('alertsPaginationControls');
    if (!infoEl || !controlsEl) return;

    if (total === 0) {
        infoEl.textContent = 'Showing 0 of 0 alerts';
        controlsEl.innerHTML = '';
        return;
    }

    infoEl.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${total} alerts`;

    const totalPages = Math.ceil(total / rowsPerPage) || 1;
    let html = '';

    // First and Previous Buttons
    html += `
        <button class="btn btn-secondary btn-sm" style="padding:4px 8px;font-size:0.78rem;" ${currentPage === 1 ? 'disabled' : ''} onclick="changeAlertsPage(1)" title="First Page">
            « First
        </button>
        <button class="btn btn-secondary btn-sm" style="padding:4px 8px;font-size:0.78rem;" ${currentPage === 1 ? 'disabled' : ''} onclick="changeAlertsPage(${currentPage - 1})" title="Previous Page">
            ‹ Prev
        </button>
    `;

    // Page buttons: if totalPages <= 15, display ALL page buttons so no page is hidden
    if (totalPages <= 15) {
        for (let p = 1; p <= totalPages; p++) {
            const isActive = p === currentPage;
            html += `
                <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm" style="padding:4px 9px;font-size:0.78rem;${isActive ? 'font-weight:700;' : ''}" onclick="changeAlertsPage(${p})">
                    ${p}
                </button>
            `;
        }
    } else {
        // Smart window for large page counts
        const pagesToShow = new Set([1, 2, totalPages - 1, totalPages]);
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pagesToShow.add(i);
        }

        const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);
        let prevPage = 0;
        for (const p of sortedPages) {
            if (prevPage && p - prevPage > 1) {
                html += `<span style="padding:4px 4px;font-size:0.78rem;color:var(--text-muted);">…</span>`;
            }
            const isActive = p === currentPage;
            html += `
                <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm" style="padding:4px 9px;font-size:0.78rem;${isActive ? 'font-weight:700;' : ''}" onclick="changeAlertsPage(${p})">
                    ${p}
                </button>
            `;
            prevPage = p;
        }
    }

    // Next and Last Buttons
    html += `
        <button class="btn btn-secondary btn-sm" style="padding:4px 8px;font-size:0.78rem;" ${currentPage === totalPages ? 'disabled' : ''} onclick="changeAlertsPage(${currentPage + 1})" title="Next Page">
            Next ›
        </button>
        <button class="btn btn-secondary btn-sm" style="padding:4px 8px;font-size:0.78rem;" ${currentPage === totalPages ? 'disabled' : ''} onclick="changeAlertsPage(${totalPages})" title="Last Page">
            Last »
        </button>
    `;

    // Direct Page Jumper Dropdown showing all pages
    if (totalPages > 1) {
        html += `
            <div style="display:inline-flex;align-items:center;gap:4px;margin-left:6px;">
                <span style="font-size:0.75rem;color:var(--text-muted);">Page:</span>
                <select class="form-select" style="padding:2px 6px;font-size:0.78rem;height:28px;width:auto;" onchange="changeAlertsPage(Number(this.value))" title="Jump to any page">
                    ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
                        <option value="${p}" ${p === currentPage ? 'selected' : ''}>${p} of ${totalPages}</option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    controlsEl.innerHTML = html;
}

window.changeAlertsPage = function (page) {
    const totalPages = Math.ceil(filteredAlerts.length / rowsPerPage) || 1;
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderAlertsTable();
    }
};

/**
 * ==============================================================================
 * 5. ALERT DETAILS INSPECTION MODAL (Requirement 8, 12, 13, 14)
 * ==============================================================================
 */
window.viewAlertDetails = function (alertId) {
    const alertItem = alertsData.find(a => a.id === alertId);
    if (!alertItem) return;

    const work = worksData.find(w => w.id === alertItem.workId) || {};
    const modalBody = document.getElementById('alertDetailsModalBody');
    const footerActions = document.getElementById('alertDetailsFooterActions');
    if (!modalBody) return;

    const score = Number(alertItem.riskScore) || 20;
    let scoreClass = 'low';
    let scoreLabel = 'Low Risk Monitoring Level';
    if (score > 75) { scoreClass = 'critical'; scoreLabel = 'Critical Priority Monitoring Level'; }
    else if (score > 50) { scoreClass = 'high'; scoreLabel = 'High Priority Monitoring Level'; }
    else if (score > 25) { scoreClass = 'medium'; scoreLabel = 'Moderate Monitoring Level'; }

    const statusRaw = (alertItem.status || 'OPEN').toUpperCase();
    let statusClass = 'badge-status-open';
    let statusText = 'Open';
    if (statusRaw === 'UNDER_REVIEW' || statusRaw === 'UNDER REVIEW') {
        statusClass = 'badge-status-under_review';
        statusText = 'Under Review';
    } else if (statusRaw === 'RESOLVED') {
        statusClass = 'badge-status-resolved';
        statusText = 'Resolved';
    } else if (statusRaw === 'DISMISSED') {
        statusClass = 'badge-status-dismissed';
        statusText = 'Dismissed';
    }

    // Render Timeline
    const timelineHtml = (alertItem.timeline || [
        { stage: "Detected", date: alertItem.detectedDate, done: true, desc: "Automated statistical detection" },
        { stage: "Reviewed", date: null, done: statusRaw !== 'OPEN', desc: "Preliminary screening" },
        { stage: "Assigned", date: alertItem.assignedTo?.assignedDate || null, done: Boolean(alertItem.assignedTo), desc: "Assigned to officer" },
        { stage: "Investigated", date: null, done: statusRaw === 'RESOLVED' || statusRaw === 'DISMISSED', desc: "Verification documentation" },
        { stage: "Resolved", date: null, done: statusRaw === 'RESOLVED', desc: "Final closure" }
    ]).map(step => `
        <div class="timeline-step-item ${step.done ? 'done' : ''}">
            <div class="timeline-dot"></div>
            <div class="timeline-step-header">
                <span>${step.stage}</span>
                <span style="font-size:0.72rem;color:var(--text-muted);">${step.date || '—'}</span>
            </div>
            <div class="timeline-step-desc">${step.desc}</div>
        </div>
    `).join('');

    // Render Notes
    const notesHtml = (alertItem.notes && alertItem.notes.length > 0) ? alertItem.notes.map(n => `
        <div class="alert-note-item">
            <div class="alert-note-header">
                <span class="alert-note-author">👤 ${n.author}</span>
                <span class="alert-note-date">🕒 ${n.date}</span>
            </div>
            <div class="alert-note-body">${n.note}</div>
        </div>
    `).join('') : `<div style="font-size:0.78rem;color:var(--text-muted);padding:8px;background:var(--bg-surface-raised);border-radius:4px;">No verification notes logged yet.</div>`;

    modalBody.innerHTML = `
        <!-- Top Header Summary -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:12px;border-bottom:1px solid var(--border-color);margin-bottom:14px;">
            <div>
                <span style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);">Anomaly Flag Reference</span>
                <h4 style="font-size:1.15rem;color:var(--primary-900);margin:2px 0;">${alertItem.id} • ${alertItem.type}</h4>
                <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px;">
                    Target Work: <strong>${alertItem.workId}</strong> (${alertItem.district || '—'})
                </div>
            </div>
            <div style="text-align:right;">
                <span class="badge ${statusClass}" style="font-size:0.8rem;padding:4px 10px;">${statusText}</span>
                <div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px;">Detected: <strong>${alertItem.detectedDate}</strong></div>
            </div>
        </div>

        <!-- Risk Score Visual Meter (Requirement 13) -->
        <div style="background:var(--bg-surface-raised);padding:12px 14px;border-radius:8px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <div style="font-size:0.82rem;font-weight:600;color:var(--text-primary);">
                    Statistical Risk Indicator: <span class="risk-score-chip ${scoreClass}" style="margin-left:4px;">${score} / 100 (${alertItem.severity})</span>
                </div>
                <span style="font-size:0.75rem;color:var(--text-secondary);font-weight:500;">${scoreLabel}</span>
            </div>
            <div class="risk-meter-wrap">
                <div class="risk-meter-fill ${scoreClass}" style="width: ${score}%;"></div>
            </div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:6px;line-height:1.3;">
                ℹ️ <em>Statistical risk scores are automated algorithmic monitoring indicators to prioritize administrative verification. They do not constitute proof of irregularity or wrongdoing.</em>
            </div>
        </div>

        <!-- Observation & Reason -->
        <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:16px;">
            <div style="background:#fffbeb;border:1px solid #fde68a;border-left:4px solid #f59e0b;padding:12px;border-radius:6px;font-size:0.82rem;color:#92400e;">
                <strong style="display:block;margin-bottom:4px;">🔍 Technical Observation:</strong>
                ${alertItem.description}
            </div>

            <div style="background:var(--bg-surface-subtle);border:1px solid var(--border-color);padding:12px;border-radius:6px;font-size:0.8rem;">
                <strong style="color:var(--primary-900);display:block;margin-bottom:4px;">📊 Algorithmic Detection Reason:</strong>
                <p style="color:var(--text-secondary);margin-bottom:6px;">${alertItem.reason || 'Statistical variance exceeded standard schedule parameter.'}</p>
                <strong style="color:var(--primary-900);display:block;margin-bottom:2px;">📑 Supporting Quantitative Evidence:</strong>
                <code style="font-size:0.75rem;display:block;padding:6px 8px;background:var(--bg-surface-raised);border-radius:4px;color:var(--text-primary);">
                    ${alertItem.evidence || 'N/A'}
                </code>
            </div>
        </div>

        <!-- Linked Work Telemetry & Financials (Requirement 14) -->
        <div style="background:var(--bg-surface-raised);padding:12px;border-radius:8px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <h5 style="font-size:0.85rem;color:var(--primary-900);">Associated Project Telemetry</h5>
                <button class="btn btn-secondary btn-sm" onclick="viewRelatedWork('${alertItem.workId}')" style="font-size:0.75rem;padding:3px 8px;">
                    🔗 Full Work Details
                </button>
            </div>
            <div style="font-size:0.8rem;font-weight:600;color:var(--text-primary);margin-bottom:6px;">
                ${work.name || alertItem.workName || 'Associated Public Work'}
            </div>
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;font-size:0.75rem;color:var(--text-secondary);border-top:1px solid var(--border-color);padding-top:8px;">
                <div>Approved: <strong>₹${(Number(work.approvedAmountLakhs) || 0).toFixed(2)} L</strong></div>
                <div>Released: <strong>₹${(Number(work.releasedAmountLakhs) || 0).toFixed(2)} L</strong></div>
                <div>Spent: <strong>₹${(Number(work.expenditureLakhs) || 0).toFixed(2)} L</strong></div>
                <div>Progress: <strong>${work.completionPct || 0}%</strong></div>
            </div>
        </div>

        <!-- Verification Timeline & Notes Log -->
        <div style="display:grid;grid-template-columns:1.2fr 1.8fr;gap:16px;margin-bottom:14px;">
            <div>
                <h5 style="font-size:0.85rem;color:var(--primary-900);margin-bottom:10px;">Verification Timeline</h5>
                <div class="alert-timeline">
                    ${timelineHtml}
                </div>
            </div>

            <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <h5 style="font-size:0.85rem;color:var(--primary-900);">Audit & Nodal Notes</h5>
                    <button class="btn btn-secondary btn-sm" onclick="openAddNoteModal('${alertItem.id}')" style="font-size:0.72rem;padding:2px 6px;">
                        ➕ Add Note
                    </button>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:190px;overflow-y:auto;padding-right:4px;">
                    ${notesHtml}
                </div>
            </div>
        </div>
    `;

    // Dynamic Footer Action Buttons (Requirement 9)
    if (footerActions) {
        let actHtml = `<button class="btn btn-primary btn-sm" onclick="window.openForensicModal('${alertItem.id}', 'alert')" style="background:linear-gradient(135deg,#0284c7,#0369a1);border:none;color:#fff;margin-right:auto;">🤖 Run AI Forensic Audit</button>`;
        if (statusRaw === 'OPEN') {
            actHtml += `<button class="btn btn-secondary btn-sm" onclick="markAlertUnderReview('${alertItem.id}')">🔍 Mark Under Review</button>`;
        }
        if (statusRaw !== 'RESOLVED' && statusRaw !== 'DISMISSED') {
            actHtml += `<button class="btn btn-secondary btn-sm" onclick="openAssignModal('${alertItem.id}')">👤 Assign Officer</button>`;
            actHtml += `<button class="btn btn-primary btn-sm" onclick="markAlertResolved('${alertItem.id}')">✓ Resolve Alert</button>`;
            actHtml += `<button class="btn btn-secondary btn-sm" style="color:var(--danger-700);" onclick="markAlertDismissed('${alertItem.id}')">✕ Dismiss</button>`;
        } else {
            actHtml += `<span style="font-size:0.78rem;color:var(--success-700);font-weight:600;padding:6px;">✓ Triage Record Finalized (${statusText})</span>`;
        }
        footerActions.innerHTML = actHtml;
    }

    if (window.openModal) {
        window.openModal('alertDetailsModal');
    }
};

// AI Duplicate Work & Split Tender Inspector Loader
window.loadDuplicateInspector = async function () {
    const container = document.getElementById('duplicateInspectorContainer');
    const listEl = document.getElementById('duplicateCardsList');
    const btn = document.getElementById('btnScanDuplicates');
    if (!container || !listEl) return;

    container.style.display = 'block';
    listEl.innerHTML = `
        <div style="text-align:center;padding:25px;color:#64748b;">
            <div class="spinner" style="display:inline-block;width:24px;height:24px;border:3px solid #0284c7;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
            <p style="margin-top:10px;font-size:0.86rem;">Running NLP string-similarity & Haversine GPS proximity calculations...</p>
        </div>
    `;

    try {
        const duplicates = await window.MPLADS_API.getDuplicates();
        if (!duplicates || duplicates.length === 0) {
            listEl.innerHTML = `
                <div style="padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;color:#166534;font-size:0.85rem;">
                    ✓ <strong>No duplicate clusters detected.</strong> All works in the active portfolio have unique geographic and semantic attributes.
                </div>
            `;
            return;
        }

        listEl.innerHTML = duplicates.map((d, i) => `
            <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:5px solid ${d.confidence === 'CRITICAL' ? '#ef4444' : '#f59e0b'};border-radius:8px;padding:16px;box-shadow:0 2px 6px rgba(0,0,0,0.04);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
                    <div>
                        <span class="badge ${d.confidence === 'CRITICAL' ? 'badge-danger' : 'badge-warning'}" style="font-size:0.75rem;">
                            ${d.confidence} CONFIDENCE (${d.duplicateScore}% MATCH)
                        </span>
                        <span style="font-size:0.8rem;color:#64748b;margin-left:8px;">
                            📍 GPS Distance: <strong>${d.distanceMeters} meters</strong> | Title Match: <strong>${d.titleSimilarityPct}%</strong>
                        </span>
                    </div>
                    <div style="display:flex;gap:6px;">
                        <button class="btn btn-primary btn-sm" onclick="window.openForensicModal('${d.workA.id}', 'work')" style="font-size:0.75rem;padding:4px 8px;background:linear-gradient(135deg,#0284c7,#0369a1);border:none;color:#fff;">
                            🔍 Forensic Audit
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="if(window.showMpladsToast) window.showMpladsToast('Physical joint measurement order dispatched to Executive Engineer for ${d.workA.id} & ${d.workB.id}.', 'info')" style="font-size:0.75rem;padding:4px 8px;">
                            📋 Joint Verification
                        </button>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#f8fafc;padding:12px;border-radius:6px;margin-bottom:10px;">
                    <div style="border-right:1px solid #e2e8f0;padding-right:10px;">
                        <div style="font-size:0.72rem;color:#64748b;font-weight:700;text-transform:uppercase;">Primary Allocation: ${d.workA.id}</div>
                        <div style="font-size:0.85rem;font-weight:600;color:#0f172a;margin-top:2px;">${d.workA.name}</div>
                        <div style="font-size:0.78rem;color:#475569;margin-top:4px;">
                            District: <strong>${d.workA.district}</strong> | Sanctioned: <strong>₹${d.workA.amountLakhs}L</strong> (${d.workA.fy})
                        </div>
                    </div>
                    <div style="padding-left:4px;">
                        <div style="font-size:0.72rem;color:#64748b;font-weight:700;text-transform:uppercase;">Suspected Duplicate: ${d.workB.id}</div>
                        <div style="font-size:0.85rem;font-weight:600;color:#0f172a;margin-top:2px;">${d.workB.name}</div>
                        <div style="font-size:0.78rem;color:#475569;margin-top:4px;">
                            District: <strong>${d.workB.district}</strong> | Sanctioned: <strong>₹${d.workB.amountLakhs}L</strong> (${d.workB.fy})
                        </div>
                    </div>
                </div>

                <div style="font-size:0.78rem;color:#991b1b;background:#fef2f2;padding:8px 12px;border-radius:4px;border:1px solid #fee2e2;">
                    <strong>Detection Basis:</strong> ${d.reasons.join('; ')}.
                    <div style="margin-top:3px;font-style:italic;color:#b91c1c;">Recommendation: ${d.recommendation}</div>
                </div>
            </div>
        `).join('');

        if (btn) btn.textContent = '🔄 Re-scan Duplicates';
    } catch (e) {
        listEl.innerHTML = `<div style="color:#ef4444;padding:12px;">Failed to scan duplicates: ${e.message}</div>`;
    }
};

/**
 * ==============================================================================
 * 6. ALERT ACTIONS & STATE MUTATIONS (Requirement 9)
 * ==============================================================================
 */
window.markAlertUnderReview = function (alertId) {
    const alertItem = alertsData.find(a => a.id === alertId);
    if (!alertItem) return;

    alertItem.status = 'UNDER_REVIEW';

    // Append note & timeline update
    alertItem.notes = alertItem.notes || [];
    alertItem.notes.unshift({
        note: "Status updated to Under Review for administrative verification.",
        author: "Dr. R. K. Sharma, IAS (Nodal Officer)",
        date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    if (alertItem.timeline && alertItem.timeline[1]) {
        alertItem.timeline[1].done = true;
        alertItem.timeline[1].date = new Date().toISOString().slice(0, 10);
    }

    updateAlertsSummaryMetrics();
    initAlertsCharts();
    sortAndRenderAlertsTable();

    // Persist to backend
    const apiBase = typeof window.getApiBaseUrl === 'function' ? window.getApiBaseUrl() : '/api';
    fetch(`${apiBase}/alerts/${encodeURIComponent(alertId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'UNDER_REVIEW' })
    }).catch(err => console.warn('[Alerts] Backend status notice:', err.message));

    // Re-open/refresh details if active
    viewAlertDetails(alertId);

    if (alertItem && window.MPLADS_API && typeof window.MPLADS_API.saveLocalAlertUpdate === 'function') {
        window.MPLADS_API.saveLocalAlertUpdate(alertItem);
    }

    if (window.showMpladsToast) {
        window.showMpladsToast(`✅ Alert ${alertId} marked as 'Under Review'.`, 'info');
    }
};

window.openAssignModal = function (alertId) {
    const alertItem = alertsData.find(a => a.id === alertId);
    if (!alertItem) return;

    const idInput = document.getElementById('assignAlertId');
    const officerSelect = document.getElementById('assignOfficer');
    const deptSelect = document.getElementById('assignDepartment');
    const commentInput = document.getElementById('assignComment');

    if (idInput) idInput.value = alertId;
    if (officerSelect) officerSelect.value = alertItem.assignedTo?.officer || '';
    if (deptSelect) deptSelect.value = alertItem.assignedTo?.department || 'Technical Quality & Audit Cell';
    if (commentInput) commentInput.value = '';

    if (window.openModal) {
        window.openModal('assignAlertModal');
    }
};

function handleAssignSubmit(e) {
    e.preventDefault();
    const alertId = document.getElementById('assignAlertId')?.value;
    const officer = document.getElementById('assignOfficer')?.value;
    const department = document.getElementById('assignDepartment')?.value;
    const comment = document.getElementById('assignComment')?.value;

    const alertItem = alertsData.find(a => a.id === alertId);
    if (!alertItem) return;

    alertItem.assignedTo = {
        officer: officer,
        department: department,
        assignedDate: new Date().toISOString().slice(0, 10)
    };

    if (alertItem.status === 'OPEN') {
        alertItem.status = 'UNDER_REVIEW';
    }

    // Append note
    alertItem.notes = alertItem.notes || [];
    alertItem.notes.unshift({
        note: `Assigned to ${officer} (${department}). ${comment ? 'Instructions: ' + comment : ''}`,
        author: "Dr. R. K. Sharma, IAS (Nodal Officer)",
        date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    if (alertItem.timeline && alertItem.timeline[2]) {
        alertItem.timeline[2].done = true;
        alertItem.timeline[2].date = new Date().toISOString().slice(0, 10);
        alertItem.timeline[2].desc = `Assigned to ${officer}`;
    }

    if (window.MPLADS_API && typeof window.MPLADS_API.saveLocalAlertUpdate === 'function') {
        window.MPLADS_API.saveLocalAlertUpdate(alertItem);
    }

    updateAlertsSummaryMetrics();
    initAlertsCharts();
    sortAndRenderAlertsTable();

    if (window.closeModal) {
        window.closeModal('assignAlertModal');
    }

    viewAlertDetails(alertId);
    if (window.showMpladsToast) {
        window.showMpladsToast(`✓ Anomaly ${alertId} assigned to ${officer}.`, 'success');
    }
}

window.openAddNoteModal = function (alertId) {
    const idInput = document.getElementById('noteAlertId');
    const dateInput = document.getElementById('addNoteDate');
    const noteInput = document.getElementById('addNoteText');

    if (idInput) idInput.value = alertId;
    if (dateInput) dateInput.value = new Date().toISOString().replace('T', ' ').slice(0, 16);
    if (noteInput) noteInput.value = '';

    if (window.openModal) {
        window.openModal('addNoteModal');
    }
};
window.openNoteModal = window.openAddNoteModal;

function handleAddNoteSubmit(e) {
    e.preventDefault();
    const alertId = document.getElementById('noteAlertId')?.value;
    const author = document.getElementById('addNoteAuthor')?.value || 'Dr. R. K. Sharma, IAS';
    const date = document.getElementById('addNoteDate')?.value;
    const noteText = document.getElementById('addNoteText')?.value;

    const alertItem = alertsData.find(a => a.id === alertId);
    if (!alertItem) return;

    alertItem.notes = alertItem.notes || [];
    alertItem.notes.unshift({
        note: noteText,
        author: author,
        date: date
    });

    if (window.MPLADS_API && typeof window.MPLADS_API.saveLocalAlertUpdate === 'function') {
        window.MPLADS_API.saveLocalAlertUpdate(alertItem);
    }

    if (window.closeModal) {
        window.closeModal('addNoteModal');
    }

    viewAlertDetails(alertId);
    if (window.showMpladsToast) {
        window.showMpladsToast(`✓ Verification note added to Alert ${alertId}`, 'info');
    }
}

window.markAlertResolved = function (alertId) {
    const alertItem = alertsData.find(a => a.id === alertId);
    if (!alertItem) return;

    alertItem.status = 'RESOLVED';
    alertItem.notes = alertItem.notes || [];
    alertItem.notes.unshift({
        note: "Resolution: Site inspection and telemetry verified compliant with sanction.",
        author: "Dr. R. K. Sharma, IAS (Nodal Officer)",
        date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    if (alertItem.timeline) {
        alertItem.timeline.forEach(step => step.done = true);
        if (alertItem.timeline[4]) alertItem.timeline[4].date = new Date().toISOString().slice(0, 10);
    }

    if (window.MPLADS_API && typeof window.MPLADS_API.saveLocalAlertUpdate === 'function') {
        window.MPLADS_API.saveLocalAlertUpdate(alertItem);
    }

    updateAlertsSummaryMetrics();
    initAlertsCharts();
    sortAndRenderAlertsTable();
    viewAlertDetails(alertId);

    // Persist to backend
    const apiBase = typeof window.getApiBaseUrl === 'function' ? window.getApiBaseUrl() : '/api';
    fetch(`${apiBase}/alerts/${encodeURIComponent(alertId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED', note: "Site inspection verified." })
    }).catch(() => {});

    if (window.showMpladsToast) {
        window.showMpladsToast(`✓ Alert ${alertId} marked as RESOLVED and closed.`, 'success');
    }
};

window.markAlertDismissed = function (alertId) {
    const alertItem = alertsData.find(a => a.id === alertId);
    if (!alertItem) return;

    alertItem.status = 'DISMISSED';
    alertItem.notes = alertItem.notes || [];
    alertItem.notes.unshift({
        note: "Dismissal: Flag determined to be standard contract milestone execution upon reconciliation.",
        author: "Dr. R. K. Sharma, IAS (Nodal Officer)",
        date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    if (window.MPLADS_API && typeof window.MPLADS_API.saveLocalAlertUpdate === 'function') {
        window.MPLADS_API.saveLocalAlertUpdate(alertItem);
    }

    updateAlertsSummaryMetrics();
    initAlertsCharts();
    sortAndRenderAlertsTable();
    viewAlertDetails(alertId);

    // Persist to backend
    const apiBase = typeof window.getApiBaseUrl === 'function' ? window.getApiBaseUrl() : '/api';
    fetch(`${apiBase}/alerts/${encodeURIComponent(alertId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DISMISSED', note: "Dismissed upon reconciliation." })
    }).catch(() => {});

    if (window.showMpladsToast) {
        window.showMpladsToast(`✕ Alert ${alertId} marked as DISMISSED.`, 'info');
    }
};

/**
 * ==============================================================================
 * 7. RELATED WORK DETAILS VIEW (Requirement 14)
 * ==============================================================================
 */
window.viewRelatedWork = function (workId) {
    const work = worksData.find(w => w.id === workId);
    const modalBody = document.getElementById('relatedWorkModalBody');
    if (!modalBody) return;

    if (!work) {
        if (window.showMpladsToast) {
            window.showMpladsToast(`Work details for ${workId} could not be retrieved.`, 'warning');
        }
        return;
    }

    const approved = Number(work.approvedAmountLakhs) || 0;
    const released = Number(work.releasedAmountLakhs) || 0;
    const expenditure = Number(work.expenditureLakhs) || 0;
    const completion = Number(work.completionPct) || 0;

    modalBody.innerHTML = `
        <div style="background:var(--bg-surface-raised);padding:14px;border-radius:8px;margin-bottom:14px;">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;">${work.id} • ${work.category}</div>
            <h3 style="color:var(--primary-900);font-size:1.15rem;margin:4px 0;">${work.name}</h3>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">
                District: <strong>${work.district}</strong> | Constituency: <strong>${work.constituency}</strong> | Agency: <strong>${work.implementingAgency || 'N/A'}</strong>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;margin-bottom:16px;">
            <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                <div style="font-size:0.7rem;color:var(--text-muted);">Approved</div>
                <div style="font-size:1rem;font-weight:700;color:var(--primary-900);">₹${approved.toFixed(2)} L</div>
            </div>
            <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                <div style="font-size:0.7rem;color:var(--text-muted);">Released</div>
                <div style="font-size:1rem;font-weight:700;color:var(--info-700);">₹${released.toFixed(2)} L</div>
            </div>
            <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                <div style="font-size:0.7rem;color:var(--text-muted);">Expenditure</div>
                <div style="font-size:1rem;font-weight:700;color:var(--success-700);">₹${expenditure.toFixed(2)} L</div>
            </div>
            <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                <div style="font-size:0.7rem;color:var(--text-muted);">Completion</div>
                <div style="font-size:1rem;font-weight:700;color:var(--primary-800);">${completion}%</div>
            </div>
        </div>

        <div style="margin-bottom:14px;">
            <h5 style="font-size:0.85rem;color:var(--primary-900);margin-bottom:6px;">Milestone Execution Status</h5>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${(work.milestones || []).map(m => `
                    <div style="display:flex;justify-content:space-between;padding:6px 10px;background:var(--bg-surface-raised);border-radius:4px;font-size:0.78rem;">
                        <span>${m.title}</span>
                        <span class="badge ${m.status === 'COMPLETED' ? 'badge-status-completed' : (m.status === 'DELAYED' ? 'badge-status-delayed' : 'badge-neutral')}">${m.status}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="font-size:0.8rem;color:var(--text-secondary);background:#f8fafc;border:1px solid var(--border-color);padding:10px;border-radius:6px;">
            <strong>Observations:</strong> ${work.monitoringObservations || work.description || 'Project undergoing active quarterly telemetry verification.'}
        </div>
    `;

    if (window.openModal) {
        window.openModal('relatedWorkModal');
    }
};

/**
 * ==============================================================================
 * 8. CSV EXPORT
 * ==============================================================================
 */
window.exportAlertsCSV = function () {
    if (filteredAlerts.length === 0) {
        if (typeof window.showMpladsToast === 'function') {
            window.showMpladsToast('No alerts match the current filter to export.', 'info');
        }
        return;
    }

    const headers = [
        "Alert ID",
        "Anomaly Type",
        "Work ID",
        "Work Name",
        "District",
        "Constituency",
        "Severity",
        "Risk Score",
        "Description",
        "Detected Date",
        "Status",
        "Assigned Officer",
        "Assigned Department"
    ];

    const escapeCSV = (str) => {
        if (str === null || str === undefined) return '""';
        const val = String(str).replace(/"/g, '""');
        return `"${val}"`;
    };

    const rows = filteredAlerts.map(a => [
        escapeCSV(a.id),
        escapeCSV(a.type),
        escapeCSV(a.workId),
        escapeCSV(a.workName),
        escapeCSV(a.district),
        escapeCSV(a.constituency),
        escapeCSV(a.severity),
        a.riskScore || 0,
        escapeCSV(a.description),
        escapeCSV(a.detectedDate),
        escapeCSV(a.status),
        escapeCSV(a.assignedTo?.officer || 'Unassigned'),
        escapeCSV(a.assignedTo?.department || 'N/A')
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `MPLADS_Anomaly_Alerts_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (window.showDownloadLocationToast) {
        window.showDownloadLocationToast(fileName, 'Anomaly Alerts Audit CSV');
    }
};

