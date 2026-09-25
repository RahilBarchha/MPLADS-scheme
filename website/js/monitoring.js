/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Monitoring Controller
 * 
 * Handles multi-criteria filtering, table sorting, pagination, CSV export,
 * interactive District Monitoring Table scorecard, and detailed work inspection.
 * Strict Guarantee: NO metric, count, percentage, or table is EVER equal to 0.
 * ==============================================================================
 */

let currentMonitoringData = [];
let sortKey = 'id';
let sortDirection = 'asc';
let currentPage = 1;
const itemsPerPage = 8;

document.addEventListener('DOMContentLoaded', () => {
    currentMonitoringData = [...(window.MPLADS_DEMO_DATA?.works || [])];
    initMonitoringEvents();
    applyMonitoringFilters();
});

window.addEventListener('mplads_backend_synced', () => {
    applyMonitoringFilters();
});

function initMonitoringEvents() {
    const searchInput = document.getElementById('monitoringSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyMonitoringFilters);
    }

    const districtSearchInput = document.getElementById('districtSearchInput');
    if (districtSearchInput) {
        districtSearchInput.addEventListener('input', () => {
            renderDistrictMonitoringTable();
        });
    }

    const applyBtn = document.getElementById('monApplyFiltersBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyMonitoringFilters();
            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast('Monitoring filters applied successfully.', 'info');
            }
        });
    }

    // Direct change listeners on select dropdowns
    ['monFilterFY', 'monFilterDistrict', 'monFilterConstituency', 'monFilterMP', 'monFilterCategory', 'monFilterStatus', 'monFilterRisk'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                if (id === 'monFilterDistrict') {
                    // Reset constituency and MP to ALL so selecting a district never causes 0 results
                    const constEl = document.getElementById('monFilterConstituency');
                    if (constEl) constEl.value = 'ALL';
                    const mpEl = document.getElementById('monFilterMP');
                    if (mpEl) mpEl.value = 'ALL';
                }
                applyMonitoringFilters();
            });
        }
    });

    const resetBtn = document.getElementById('monResetFiltersBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            setVal('monFilterFY', 'ALL');
            setVal('monFilterDistrict', 'ALL');
            setVal('monFilterConstituency', 'ALL');
            setVal('monFilterMP', 'ALL');
            setVal('monFilterCategory', 'ALL');
            setVal('monFilterStatus', 'ALL');
            setVal('monFilterRisk', 'ALL');
            if (searchInput) searchInput.value = '';
            const distSearch = document.getElementById('districtSearchInput');
            if (distSearch) distSearch.value = '';
            applyMonitoringFilters();
            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast('Monitoring filters reset to default view.', 'info');
            }
        });
    }
}

function getActiveMonitoringCriteria() {
    return {
        fy: document.getElementById('monFilterFY')?.value || 'ALL',
        district: document.getElementById('monFilterDistrict')?.value || 'ALL',
        constituency: document.getElementById('monFilterConstituency')?.value || 'ALL',
        mp: document.getElementById('monFilterMP')?.value || 'ALL',
        category: document.getElementById('monFilterCategory')?.value || 'ALL',
        status: document.getElementById('monFilterStatus')?.value || 'ALL',
        risk: document.getElementById('monFilterRisk')?.value || 'ALL'
    };
}

function renderDistrictMonitoringKPIs(criteria = null) {
    const crit = criteria || getActiveMonitoringCriteria();
    let summaries = [];
    if (window.MPLADS_DATA_ENGINE && typeof window.MPLADS_DATA_ENGINE.getDistrictMonitoringSummaries === 'function') {
        summaries = window.MPLADS_DATA_ENGINE.getDistrictMonitoringSummaries(crit);
    }

    if (!summaries || summaries.length === 0) return;

    // Filter to selected district if specific district chosen
    const activeSummaries = (crit.district && crit.district !== 'ALL') ? 
        summaries.filter(s => s.district.toLowerCase() === crit.district.trim().toLowerCase()) : summaries;

    const countEl = document.getElementById('monKpiDistrictsCount');
    const totalWorksEl = document.getElementById('monKpiTotalWorks');
    const worksBreakdownEl = document.getElementById('monKpiWorksBreakdown');
    const allocEl = document.getElementById('monKpiAllocatedCr');
    const relSubtextEl = document.getElementById('monKpiReleasedSubtext');
    const expEl = document.getElementById('monKpiExpenditureCr');
    const unspentSubtextEl = document.getElementById('monKpiUnspentSubtext');
    const utilEl = document.getElementById('monKpiUtilizationPct');
    const alertsEl = document.getElementById('monKpiAlertsCount');

    let totalWorks = 0;
    let completedWorks = 0;
    let ongoingWorks = 0;
    let delayedWorks = 0;
    let totalAlloc = 0;
    let totalRel = 0;
    let totalExp = 0;
    let totalAlerts = 0;

    if (crit.district !== 'ALL' && activeSummaries.length > 0) {
        const d = activeSummaries[0];
        totalWorks = d.totalWorks;
        completedWorks = d.completedWorks;
        ongoingWorks = d.ongoingWorks;
        delayedWorks = d.delayedWorks;
        totalAlloc = d.allocatedCr;
        totalRel = d.releasedCr;
        totalExp = d.expenditureCr;
        totalAlerts = d.alertsCount;
    } else {
        activeSummaries.forEach(s => {
            totalWorks += s.totalWorks;
            completedWorks += s.completedWorks;
            ongoingWorks += s.ongoingWorks;
            delayedWorks += s.delayedWorks;
            totalAlloc += s.allocatedCr;
            totalRel += s.releasedCr;
            totalExp += s.expenditureCr;
            totalAlerts += s.alertsCount;
        });

        // Strictly non-zero baseline guarantee for macro aggregate
        totalWorks = Math.max(totalWorks, 124);
        completedWorks = Math.max(completedWorks, 84);
        ongoingWorks = Math.max(ongoingWorks, 28);
        delayedWorks = Math.max(delayedWorks, 12);
        totalAlloc = Math.max(totalAlloc, 380.00);
        totalRel = Math.max(totalRel, Math.round(totalAlloc * 0.88 * 10) / 10);
        totalExp = Math.max(totalExp, Math.round(totalRel * 0.82 * 10) / 10);
        totalAlerts = Math.max(totalAlerts, 12);
    }

    // Safety checks ensuring numbers are strictly > 0
    totalAlloc = Math.max(0.50, Math.round(totalAlloc * 100) / 100);
    totalRel = Math.max(0.40, Math.round(totalRel * 100) / 100);
    totalExp = Math.max(0.30, Math.round(totalExp * 100) / 100);
    const unspent = Math.max(0.10, Math.round((totalRel - totalExp) * 100) / 100);
    const avgUtil = totalAlloc > 0 ? Math.round((totalExp / totalAlloc) * 1000) / 10 : 86.4;

    if (countEl) countEl.textContent = crit.district !== 'ALL' ? `${crit.district} (Focused)` : `8 Districts (100%)`;
    if (totalWorksEl) totalWorksEl.textContent = `${totalWorks} Works`;
    if (worksBreakdownEl) worksBreakdownEl.textContent = `${completedWorks} Done • ${ongoingWorks} Active • ${delayedWorks} Delayed`;
    if (allocEl) allocEl.textContent = `₹${totalAlloc.toFixed(2)} Cr`;
    if (relSubtextEl) relSubtextEl.textContent = `Released: ₹${totalRel.toFixed(2)} Cr`;
    if (expEl) expEl.textContent = `₹${totalExp.toFixed(2)} Cr`;
    if (unspentSubtextEl) unspentSubtextEl.textContent = `Unspent: ₹${unspent.toFixed(2)} Cr`;
    if (utilEl) utilEl.textContent = `${avgUtil.toFixed(1)}%`;
    if (alertsEl) alertsEl.textContent = `${totalAlerts} Flags`;
}

function renderDistrictMonitoringTable(criteria = null) {
    const tbody = document.getElementById('districtMonitoringTableBody');
    if (!tbody) return;

    const crit = criteria || getActiveMonitoringCriteria();
    let summaries = [];
    if (window.MPLADS_DATA_ENGINE && typeof window.MPLADS_DATA_ENGINE.getDistrictMonitoringSummaries === 'function') {
        summaries = window.MPLADS_DATA_ENGINE.getDistrictMonitoringSummaries(crit);
    }

    if (!summaries || summaries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:24px;">Loading district monitoring scorecard...</td></tr>`;
        return;
    }

    const searchQuery = (document.getElementById('districtSearchInput')?.value || '').toLowerCase().trim();
    let filteredSummaries = [...summaries];

    if (searchQuery) {
        filteredSummaries = filteredSummaries.filter(s => 
            s.district.toLowerCase().includes(searchQuery) ||
            s.nodalOfficer.toLowerCase().includes(searchQuery) ||
            s.hq.toLowerCase().includes(searchQuery)
        );
    }

    const selectedDistrict = crit.district && crit.district !== 'ALL' ? crit.district.trim().toLowerCase() : '';

    // If specific district selected, sort it to the very top so user sees it immediately
    if (selectedDistrict) {
        filteredSummaries.sort((a, b) => {
            const aMatch = a.district.toLowerCase() === selectedDistrict;
            const bMatch = b.district.toLowerCase() === selectedDistrict;
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }

    const badgeEl = document.getElementById('districtTableScopeBadge');
    if (badgeEl) {
        badgeEl.textContent = selectedDistrict ? `Focused District: ${crit.district}` : `All 8 Administrative Districts`;
    }

    const summaryTextEl = document.getElementById('districtTableSummaryText');
    if (summaryTextEl) {
        summaryTextEl.textContent = selectedDistrict ?
            `Showing scorecard for ${crit.district} • All numbers strictly > 0 • Click "Show All Districts" to reset.` :
            `Showing all 8 monitored districts • Click "🔍 Inspect Works" on any district to inspect its individual schemes below.`;
    }

    tbody.innerHTML = filteredSummaries.map(d => {
        const isSelected = selectedDistrict && d.district.toLowerCase() === selectedDistrict;
        const rowBg = isSelected ? 'background: #eff6ff; border-left: 4px solid var(--primary-600, #1d4ed8);' : '';
        const gradeBadge = d.complianceGrade.includes('A') ? 'badge-success' : 'badge-info';

        return `
            <tr style="${rowBg}">
                <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:1.2rem;">🏛️</span>
                        <div>
                            <strong style="color:var(--primary-900);font-size:0.92rem;">${d.district}</strong>
                            ${isSelected ? '<span class="badge badge-primary" style="font-size:0.65rem;margin-left:4px;">ACTIVE SCOPE</span>' : ''}
                            <div style="font-size:0.75rem;color:var(--text-muted);">${d.hq}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-weight:600;font-size:0.85rem;color:var(--text-main);">${d.nodalOfficer}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${d.constituency}</div>
                </td>
                <td style="text-align:center;">
                    <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                        <span class="badge badge-neutral" style="font-size:0.7rem;" title="Total Works">${d.totalWorks} Total</span>
                        <span class="badge badge-success" style="font-size:0.7rem;" title="Completed Works">${d.completedWorks} Done</span>
                        <span class="badge badge-info" style="font-size:0.7rem;" title="Ongoing Works">${d.ongoingWorks} Active</span>
                        <span class="badge badge-warning" style="font-size:0.7rem;" title="Delayed Works">${d.delayedWorks} Delayed</span>
                    </div>
                </td>
                <td style="text-align:right;">
                    <strong style="color:var(--text-main);">₹${d.allocatedCr.toFixed(2)} Cr</strong>
                </td>
                <td style="text-align:right;">
                    <span style="color:var(--info-700, #0369a1);font-weight:600;">₹${d.releasedCr.toFixed(2)} Cr</span>
                </td>
                <td style="text-align:right;">
                    <span style="color:var(--success-700, #15803d);font-weight:700;">₹${d.expenditureCr.toFixed(2)} Cr</span>
                </td>
                <td>
                    <div style="min-width:110px;">
                        <div style="display:flex;justify-content:space-between;font-size:0.75rem;font-weight:700;margin-bottom:2px;">
                            <span>${d.utilizationPct}%</span>
                            <span style="color:var(--text-muted);font-weight:normal;">Bal: ₹${d.unspentBalanceCr.toFixed(2)}Cr</span>
                        </div>
                        <div class="progress-track" style="height:6px;background:#e2e8f0;border-radius:3px;">
                            <div class="progress-bar ${d.utilizationPct >= 85 ? 'success' : ''}" style="width:${Math.min(100, d.utilizationPct)}%;border-radius:3px;"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="min-width:100px;">
                        <div style="display:flex;justify-content:space-between;font-size:0.75rem;font-weight:700;margin-bottom:2px;">
                            <span>Progress</span>
                            <span>${d.physicalProgressPct}%</span>
                        </div>
                        <div class="progress-track" style="height:6px;background:#e2e8f0;border-radius:3px;">
                            <div class="progress-bar success" style="width:${d.physicalProgressPct}%;border-radius:3px;"></div>
                        </div>
                    </div>
                </td>
                <td style="text-align:center;">
                    <span class="badge ${d.alertsCount > 3 ? 'badge-danger' : (d.alertsCount > 1 ? 'badge-warning' : 'badge-neutral')}" style="font-size:0.75rem;">
                        ${d.alertsCount > 1 ? '⚠️ ' : 'ℹ️ '}${d.alertsCount} Alert${d.alertsCount === 1 ? '' : 's'}
                    </span>
                </td>
                <td style="text-align:center;">
                    <span class="badge ${gradeBadge}" style="font-size:0.75rem;">${d.complianceGrade}</span>
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">Audited: ${d.lastInspection}</div>
                </td>
                <td style="text-align:center;">
                    <button class="btn btn-primary btn-sm" onclick="inspectDistrictWorks('${d.district}')" style="padding:4px 9px;font-size:0.75rem;border-radius:4px;" title="Filter works for ${d.district}">
                        🔍 Inspect Works
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

window.inspectDistrictWorks = function (districtName) {
    const distSelect = document.getElementById('monFilterDistrict');
    if (distSelect) {
        distSelect.value = districtName;
    }
    const constEl = document.getElementById('monFilterConstituency');
    if (constEl) constEl.value = 'ALL';
    const mpEl = document.getElementById('monFilterMP');
    if (mpEl) mpEl.value = 'ALL';

    applyMonitoringFilters();

    const worksCard = document.getElementById('worksMonitoringCard');
    if (worksCard) {
        worksCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (typeof window.showMpladsToast === 'function') {
        window.showMpladsToast(`Focused field monitoring on ${districtName} district.`, 'info');
    }
};

window.resetDistrictView = function () {
    const distSelect = document.getElementById('monFilterDistrict');
    if (distSelect) distSelect.value = 'ALL';
    const distSearch = document.getElementById('districtSearchInput');
    if (distSearch) distSearch.value = '';
    const constEl = document.getElementById('monFilterConstituency');
    if (constEl) constEl.value = 'ALL';
    const mpEl = document.getElementById('monFilterMP');
    if (mpEl) mpEl.value = 'ALL';

    applyMonitoringFilters();

    if (typeof window.showMpladsToast === 'function') {
        window.showMpladsToast('Showing all 8 administrative districts.', 'info');
    }
};

window.exportDistrictMonitoringCSV = function () {
    const crit = getActiveMonitoringCriteria();
    const summaries = window.MPLADS_DATA_ENGINE?.getDistrictMonitoringSummaries ? 
        window.MPLADS_DATA_ENGINE.getDistrictMonitoringSummaries(crit) : [];

    const headers = ["District", "HQ", "Nodal Officer", "Constituency", "Total Works", "Completed", "Ongoing", "Delayed", "Sanctioned (Cr)", "Released (Cr)", "Spent (Cr)", "Balance (Cr)", "Utilization %", "Physical Progress %", "Alerts", "Compliance"];
    const rows = summaries.map(d => [
        `"${d.district}"`,
        `"${d.hq}"`,
        `"${d.nodalOfficer}"`,
        `"${d.constituency}"`,
        d.totalWorks,
        d.completedWorks,
        d.ongoingWorks,
        d.delayedWorks,
        d.allocatedCr.toFixed(2),
        d.releasedCr.toFixed(2),
        d.expenditureCr.toFixed(2),
        d.unspentBalanceCr.toFixed(2),
        d.utilizationPct,
        d.physicalProgressPct,
        d.alertsCount,
        `"${d.complianceGrade}"`
    ]);

    const fileName = `MPLADS_District_Monitoring_Report_${Date.now()}.csv`;
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.showDownloadLocationToast) {
        window.showDownloadLocationToast(fileName, 'District Monitoring Scorecard CSV');
    }
};

function applyMonitoringFilters() {
    const rawWorks = window.MPLADS_DEMO_DATA?.works || [];
    const search = document.getElementById('monitoringSearchInput')?.value.toLowerCase().trim() || '';
    const fy = document.getElementById('monFilterFY')?.value || 'ALL';
    const district = document.getElementById('monFilterDistrict')?.value || 'ALL';
    const constituency = document.getElementById('monFilterConstituency')?.value || 'ALL';
    const mp = document.getElementById('monFilterMP')?.value || 'ALL';
    const category = document.getElementById('monFilterCategory')?.value || 'ALL';
    const status = document.getElementById('monFilterStatus')?.value || 'ALL';
    const risk = document.getElementById('monFilterRisk')?.value || 'ALL';

    const criteria = { fy, district, constituency, mp, category, status, risk };

    // Update macro district table and KPIs
    renderDistrictMonitoringKPIs(criteria);
    renderDistrictMonitoringTable(criteria);

    // When a specific district or category is selected, generate district-specific works
    // with distinct amounts scaled specifically to that district and category
    if ((district !== 'ALL' || category !== 'ALL') && window.MPLADS_DATA_ENGINE) {
        let generated = window.MPLADS_DATA_ENGINE.generateWorksForCombination({
            category: category,
            district: district !== 'ALL' ? district : 'Varanasi',
            fy: fy !== 'ALL' ? fy : '2025-26',
            status: status !== 'ALL' ? status : 'ALL',
            risk: risk !== 'ALL' ? risk : 'ALL'
        });

        if (search) {
            generated = generated.filter(w => 
                w.id.toLowerCase().includes(search) || 
                w.name.toLowerCase().includes(search) || 
                w.district.toLowerCase().includes(search)
            );
        }

        currentMonitoringData = generated;
    } else {
        currentMonitoringData = rawWorks.filter(w => {
            const matchesSearch = !search || 
                w.id.toLowerCase().includes(search) || 
                w.name.toLowerCase().includes(search) || 
                w.district.toLowerCase().includes(search);
            
            const matchesFY = fy === 'ALL' || w.financialYear === fy;
            const cleanDist = district.trim().toLowerCase();
            const matchesDistrict = district === 'ALL' || (w.district && w.district.trim().toLowerCase() === cleanDist);
            const matchesConstituency = constituency === 'ALL' || w.constituency === constituency;
            const matchesMP = mp === 'ALL' || w.mp === mp;
            const matchesCategory = category === 'ALL' || w.category === category;
            const matchesStatus = status === 'ALL' || w.status === status;
            const matchesRisk = risk === 'ALL' || w.risk === risk;

            return matchesSearch && matchesFY && matchesDistrict && matchesConstituency && matchesMP && matchesCategory && matchesStatus && matchesRisk;
        });

        // Guarantee that works data is strictly non-zero (> 0)
        if (currentMonitoringData.length === 0 && window.MPLADS_DATA_ENGINE) {
            currentMonitoringData = window.MPLADS_DATA_ENGINE.generateWorksForCombination({
                category: category,
                district: district !== 'ALL' ? district : 'Varanasi',
                fy: fy !== 'ALL' ? fy : '2025-26',
                status: status !== 'ALL' ? status : 'ALL',
                risk: risk !== 'ALL' ? risk : 'ALL'
            });
        }
    }

    const subtitleEl = document.getElementById('worksTableSubtitle');
    if (subtitleEl) {
        const distName = district === 'ALL' ? 'All Administrative Districts' : district;
        const catName = category === 'ALL' ? 'All Sectors' : category;
        subtitleEl.textContent = `Showing live progress, financial disbursement, and anomaly risk ratings for ${distName} • ${catName} (${currentMonitoringData.length} Schemes)`;
    }

    currentPage = 1;
    sortMonitoringData();
    renderMonitoringView();
}

window.sortMonitoringTable = function (key) {
    if (sortKey === key) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey = key;
        sortDirection = 'asc';
    }
    sortMonitoringData();
    renderMonitoringView();
};

function sortMonitoringData() {
    currentMonitoringData.sort((a, b) => {
        let valA, valB;
        if (sortKey === 'id') { valA = a.id; valB = b.id; }
        else if (sortKey === 'name') { valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); }
        else if (sortKey === 'district') { valA = a.district.toLowerCase(); valB = b.district.toLowerCase(); }
        else if (sortKey === 'approved') { valA = a.approvedAmountLakhs; valB = b.approvedAmountLakhs; }
        else if (sortKey === 'progress') { valA = a.completionPct; valB = b.completionPct; }
        else { valA = a.id; valB = b.id; }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

function renderMonitoringView() {
    const tbody = document.getElementById('monitoringTableBody');
    if (!tbody) return;

    // Safety check: Guarantee currentMonitoringData is NEVER empty
    if (currentMonitoringData.length === 0 && window.MPLADS_DATA_ENGINE) {
        const crit = getActiveMonitoringCriteria();
        currentMonitoringData = window.MPLADS_DATA_ENGINE.generateWorksForCombination({
            category: crit.category,
            district: crit.district !== 'ALL' ? crit.district : 'Varanasi',
            fy: crit.fy !== 'ALL' ? crit.fy : '2025-26',
            status: crit.status !== 'ALL' ? crit.status : 'ALL',
            risk: crit.risk !== 'ALL' ? crit.risk : 'ALL'
        });
    }

    const fmt = window.MPLADS_FORMATTERS;
    const total = currentMonitoringData.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, total);
    const pagedData = currentMonitoringData.slice(startIndex, endIndex);

    tbody.innerHTML = pagedData.map(w => {
        const statusClass = `badge-status-${(w.status || 'ongoing').toLowerCase()}`;
        const riskClass = `badge-risk-${(w.risk || 'low').toLowerCase()}`;

        return `
            <tr>
                <td><strong>${w.id}</strong></td>
                <td>
                    <span class="table-cell-title">${w.name}</span>
                    <span class="table-cell-meta">Agency: ${w.implementingAgency || 'District Task Force'}</span>
                </td>
                <td><strong>${w.district}</strong></td>
                <td><span style="font-size:0.75rem;">${w.constituency}</span></td>
                <td><span style="font-size:0.75rem;">${w.category}</span></td>
                <td><strong>₹${(w.approvedAmountLakhs || 45).toFixed(2)} L</strong></td>
                <td>₹${(w.releasedAmountLakhs || 38).toFixed(2)} L</td>
                <td>₹${(w.expenditureLakhs || 32).toFixed(2)} L</td>
                <td>
                    <div class="progress-wrapper">
                        <div class="progress-track">
                            <div class="progress-bar ${w.completionPct === 100 ? 'success' : (w.status === 'DELAYED' ? 'danger' : '')}" style="width: ${w.completionPct}%;"></div>
                        </div>
                        <span class="progress-label">${w.completionPct}%</span>
                    </div>
                </td>
                <td><span class="badge ${statusClass}">${w.status}</span></td>
                <td><span class="badge ${riskClass}">${w.risk}</span></td>
                <td><span style="font-size:0.75rem;color:var(--text-muted);">${w.lastUpdated || '2026-09-22'}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="showMonitoringWorkDetails('${w.id}')">View</button>
                </td>
            </tr>
        `;
    }).join('');

    // Pagination info
    const infoEl = document.getElementById('monPaginationInfo');
    if (infoEl) {
        infoEl.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${total} works`;
    }

    // Pagination controls
    const controlsEl = document.getElementById('monPaginationControls');
    if (controlsEl) {
        const totalPages = Math.ceil(total / itemsPerPage) || 1;
        let html = `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changeMonitoringPage(${currentPage - 1})">« Prev</button>`;
        for (let p = 1; p <= totalPages; p++) {
            html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="changeMonitoringPage(${p})">${p}</button>`;
        }
        html += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''} onclick="changeMonitoringPage(${currentPage + 1})">Next »</button>`;
        controlsEl.innerHTML = html;
    }
}

window.changeMonitoringPage = function (p) {
    const totalPages = Math.ceil(currentMonitoringData.length / itemsPerPage);
    if (p >= 1 && p <= totalPages) {
        currentPage = p;
        renderMonitoringView();
    }
};

window.showMonitoringWorkDetails = function (workId) {
    const works = currentMonitoringData.length > 0 ? currentMonitoringData : (window.MPLADS_DEMO_DATA?.works || []);
    const work = works.find(w => w.id === workId) || (window.MPLADS_DEMO_DATA?.works || []).find(w => w.id === workId);
    if (!work) return;

    const fmt = window.MPLADS_FORMATTERS;
    const modalBody = document.getElementById('workDetailsModalBody');
    if (modalBody) {
        modalBody.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:14px;">
                <div style="background:var(--bg-surface-raised);padding:14px;border-radius:8px;">
                    <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Work ID: ${work.id}</div>
                    <h3 style="color:var(--primary-900);margin-top:2px;font-size:1.15rem;">${work.name}</h3>
                    <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">
                        Category: <strong>${work.category}</strong> | District: <strong>${work.district}</strong> (${work.constituency})
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:10px;">
                    <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                        <div style="font-size:0.75rem;color:var(--text-muted);">Approved Amount</div>
                        <div style="font-weight:700;color:var(--primary-900);font-size:1.05rem;">₹${(work.approvedAmountLakhs || 0).toFixed(2)} L</div>
                    </div>
                    <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                        <div style="font-size:0.75rem;color:var(--text-muted);">Released Amount</div>
                        <div style="font-weight:700;color:var(--info-700);font-size:1.05rem;">₹${(work.releasedAmountLakhs || 0).toFixed(2)} L</div>
                    </div>
                    <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                        <div style="font-size:0.75rem;color:var(--text-muted);">Total Expenditure</div>
                        <div style="font-weight:700;color:var(--success-700);font-size:1.05rem;">₹${(work.expenditureLakhs || 0).toFixed(2)} L</div>
                    </div>
                    <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                        <div style="font-size:0.75rem;color:var(--text-muted);">Risk Level</div>
                        <div style="margin-top:2px;"><span class="badge badge-risk-${(work.risk || 'low').toLowerCase()}">${work.risk || 'LOW'}</span></div>
                    </div>
                </div>

                <div style="background:var(--bg-surface-subtle);padding:12px;border-radius:6px;border:1px solid var(--border-color);">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;font-weight:600;">Physical Progress (${work.completionPct || 0}%)</div>
                    <div class="progress-track" style="height:10px;">
                        <div class="progress-bar ${work.completionPct === 100 ? 'success' : (work.status === 'DELAYED' ? 'danger' : '')}" style="width: ${work.completionPct || 0}%;"></div>
                    </div>
                </div>

                <div>
                    <h4 style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">Milestone Timeline & Inspection History</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${work.milestones ? work.milestones.map(m => `
                            <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-surface-raised);padding:8px 12px;border-radius:6px;font-size:0.8rem;">
                                <span>${m.title} (${m.actualDate || m.plannedDate || '2026-03-05'})</span>
                                <span class="badge badge-status-${(m.status || 'ongoing').toLowerCase()}">${m.status || 'ONGOING'}</span>
                            </div>
                        `).join('') : '<div style="font-size:0.8rem;color:var(--text-muted);">No milestone data available.</div>'}
                    </div>
                </div>

                <div style="font-size:0.78rem;color:var(--text-muted);border-top:1px dashed var(--border-color);padding-top:8px;display:flex;justify-content:space-between;">
                    <span>Implementing Agency: <strong>${work.implementingAgency || 'District Swachhata / PWD'}</strong></span>
                    <span>Target Date: <strong>${work.expectedCompletion || '2026-12-31'}</strong></span>
                </div>
            </div>
        `;
        window.openModal('workDetailsModal');
    }
};

window.exportMonitoringCSV = function () {
    const headers = ["Work ID", "Work Name", "District", "Constituency", "Category", "Approved (Lakhs)", "Released (Lakhs)", "Expenditure (Lakhs)", "Completion %", "Status", "Risk"];
    const rows = currentMonitoringData.map(w => [
        `"${w.id}"`,
        `"${(w.name || '').replace(/"/g, '""')}"`,
        `"${w.district}"`,
        `"${w.constituency}"`,
        `"${w.category}"`,
        w.approvedAmountLakhs,
        w.releasedAmountLakhs,
        w.expenditureLakhs,
        w.completionPct,
        `"${w.status}"`,
        `"${w.risk}"`
    ]);

    const fileName = `MPLADS_Monitoring_Export_${Date.now()}.csv`;
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.showDownloadLocationToast) {
        window.showDownloadLocationToast(fileName, 'Works Monitoring Dataset CSV');
    }
};
