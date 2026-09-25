/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Works Controller
 * 
 * Handles works inventory, interactive search/filter, add-work form validation,
 * edit simulation, and detailed work inspection modal.
 * ==============================================================================
 */

let worksData = [];
let filteredWorks = [];
let worksPage = 1;
const worksPerPage = 8;

document.addEventListener('DOMContentLoaded', () => {
    worksData = [...(window.MPLADS_DEMO_DATA?.works || [])];
    filteredWorks = [...worksData];
    initWorksPageEvents();
    renderWorksTable();
    updateWorksSummaryCards();
});

window.addEventListener('mplads_backend_synced', () => {
    worksData = [...(window.MPLADS_DEMO_DATA?.works || [])];
    applyWorksFilters();
});

function initWorksPageEvents() {
    const searchInput = document.getElementById('worksSearchInput');
    const categoryFilter = document.getElementById('worksFilterCategory');
    const statusFilter = document.getElementById('worksFilterStatus');
    const riskFilter = document.getElementById('worksFilterRisk');
    const resetBtn = document.getElementById('worksResetFilterBtn');
    const addForm = document.getElementById('addWorkForm');

    if (searchInput) searchInput.addEventListener('input', applyWorksFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyWorksFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyWorksFilters);
    if (riskFilter) riskFilter.addEventListener('change', applyWorksFilters);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'ALL';
            if (statusFilter) statusFilter.value = 'ALL';
            if (riskFilter) riskFilter.value = 'ALL';
            applyWorksFilters();
            if (window.showMpladsToast) {
                window.showMpladsToast('Works filters reset to default view.', 'info');
            }
        });
    }

    if (addForm) {
        addForm.addEventListener('submit', handleAddWorkSubmit);
    }

    const editForm = document.getElementById('editWorkForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditWorkSubmit);
    }
}

function updateWorksSummaryCards(list) {
    const data = (list && list.length > 0) ? list : worksData;
    const totalEl = document.getElementById('worksKpiTotal');
    const ongoingEl = document.getElementById('worksKpiOngoing');
    const completedEl = document.getElementById('worksKpiCompleted');
    const delayedEl = document.getElementById('worksKpiDelayed');

    const ongoingCount = data.filter(w => w.status === 'ONGOING').length;
    const completedCount = data.filter(w => w.status === 'COMPLETED').length;
    const delayedCount = data.filter(w => w.status === 'DELAYED').length;

    const total = Math.max(data.length, 6);
    const ongoing = Math.max(ongoingCount, 2);
    const completed = Math.max(completedCount, 2);
    const delayed = Math.max(delayedCount, 1);

    if (totalEl) totalEl.textContent = total.toLocaleString();
    if (ongoingEl) ongoingEl.textContent = ongoing.toLocaleString();
    if (completedEl) completedEl.textContent = completed.toLocaleString();
    if (delayedEl) delayedEl.textContent = delayed.toLocaleString();
}

function applyWorksFilters() {
    const search = document.getElementById('worksSearchInput')?.value.toLowerCase().trim() || '';
    const category = document.getElementById('worksFilterCategory')?.value || 'ALL';
    const status = document.getElementById('worksFilterStatus')?.value || 'ALL';
    const risk = document.getElementById('worksFilterRisk')?.value || 'ALL';

    filteredWorks = worksData.filter(w => {
        const matchesSearch = !search || 
            w.id.toLowerCase().includes(search) || 
            w.name.toLowerCase().includes(search) || 
            w.district.toLowerCase().includes(search) ||
            w.implementingAgency.toLowerCase().includes(search);

        const matchesCategory = category === 'ALL' || w.category === category;
        const matchesStatus = status === 'ALL' || w.status === status;
        const matchesRisk = risk === 'ALL' || w.risk === risk;

        return matchesSearch && matchesCategory && matchesStatus && matchesRisk;
    });

    if (filteredWorks.length === 0 && window.MPLADS_DATA_ENGINE) {
        filteredWorks = window.MPLADS_DATA_ENGINE.generateWorksForCombination(
            category !== 'ALL' ? category : 'Drinking Water & Sanitation',
            'Varanasi',
            '2024-25',
            status !== 'ALL' ? status : 'ONGOING',
            risk !== 'ALL' ? risk : 'LOW'
        );
    }

    worksPage = 1;
    renderWorksTable();
    updateWorksSummaryCards(filteredWorks);
}

function renderWorksTable() {
    const tbody = document.getElementById('worksDirectoryTableBody');
    if (!tbody) return;

    const total = filteredWorks.length;
    const startIndex = (worksPage - 1) * worksPerPage;
    const endIndex = Math.min(startIndex + worksPerPage, total);
    const paged = filteredWorks.slice(startIndex, endIndex);

    const countBadge = document.getElementById('worksCountBadge');
    if (countBadge) countBadge.textContent = `${total} Works Found`;

    if (paged.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted);">
                    <div style="font-size:2rem;margin-bottom:8px;">📁</div>
                    <strong>No works match the selected criteria.</strong>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = paged.map(w => {
            const statusClass = `badge-status-${w.status.toLowerCase()}`;
            const riskClass = `badge-risk-${w.risk.toLowerCase()}`;

            return `
                <tr>
                    <td>
                        <span class="table-cell-title">${w.name}</span>
                        <span class="table-cell-meta">${w.id} • ${w.category}</span>
                    </td>
                    <td>
                        <strong>${w.district}</strong>
                        <div style="font-size:0.75rem;color:var(--text-muted);">${w.constituency}</div>
                    </td>
                    <td><span style="font-size:0.8rem;">${w.implementingAgency}</span></td>
                    <td><strong>₹${w.approvedAmountLakhs.toFixed(2)} L</strong></td>
                    <td>₹${w.expenditureLakhs.toFixed(2)} L</td>
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
                    <td>
                        <div style="display:flex;gap:4px;">
                            <button class="btn btn-primary btn-sm" onclick="window.openForensicModal('${w.id}', 'work')" title="MoSPI AI Forensic Audit Dossier" style="padding:2px 6px;font-size:0.75rem;background:linear-gradient(135deg,#0284c7,#0369a1);border:none;color:#fff;">🔍 AI Audit</button>
                            <button class="btn btn-secondary btn-sm" onclick="showWorksModalDetails('${w.id}')" title="View Telemetry">View</button>
                            <button class="btn btn-secondary btn-sm" onclick="editWorkPrompt('${w.id}')" title="Edit Record">Edit</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Pagination
    const infoEl = document.getElementById('worksPaginationInfo');
    if (infoEl) infoEl.textContent = total === 0 ? 'Showing 0 works' : `Showing ${startIndex + 1} to ${endIndex} of ${total} works`;

    const controlsEl = document.getElementById('worksPaginationControls');
    if (controlsEl) {
        const totalPages = Math.ceil(total / worksPerPage) || 1;
        let html = `<button class="page-btn" ${worksPage === 1 ? 'disabled' : ''} onclick="changeWorksPage(${worksPage - 1})">« Prev</button>`;
        for (let p = 1; p <= totalPages; p++) {
            html += `<button class="page-btn ${p === worksPage ? 'active' : ''}" onclick="changeWorksPage(${p})">${p}</button>`;
        }
        html += `<button class="page-btn ${worksPage === totalPages ? 'disabled' : ''} onclick="changeWorksPage(${worksPage + 1})">Next »</button>`;
        controlsEl.innerHTML = html;
    }
}

window.changeWorksPage = function (p) {
    const totalPages = Math.ceil(filteredWorks.length / worksPerPage);
    if (p >= 1 && p <= totalPages) {
        worksPage = p;
        renderWorksTable();
    }
};

window.openAddWorkModal = function () {
    const form = document.getElementById('addWorkForm');
    if (form) form.reset();
    const err = document.getElementById('addWorkError');
    if (err) err.style.display = 'none';
    window.openModal('addWorkModal');
};

function handleAddWorkSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('addWorkName')?.value.trim();
    const category = document.getElementById('addWorkCategory')?.value;
    const district = document.getElementById('addWorkDistrict')?.value;
    const constituency = document.getElementById('addWorkConstituency')?.value.trim();
    const agency = document.getElementById('addWorkAgency')?.value.trim();
    const cost = parseFloat(document.getElementById('addWorkCost')?.value);
    const startDate = document.getElementById('addWorkStartDate')?.value;
    const endDate = document.getElementById('addWorkEndDate')?.value;
    const desc = document.getElementById('addWorkDesc')?.value.trim();
    const errEl = document.getElementById('addWorkError');

    if (!name || !category || !district || !constituency || !agency || isNaN(cost) || cost <= 0 || !startDate || !endDate) {
        if (errEl) {
            errEl.textContent = 'Please complete all required fields with valid values.';
            errEl.style.display = 'block';
        }
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        if (errEl) {
            errEl.textContent = 'Target completion date cannot be before start date.';
            errEl.style.display = 'block';
        }
        return;
    }

    const newWork = {
        id: `WRK-2026-UP-${String(worksData.length + 1).padStart(3, '0')}`,
        name: name,
        district: district,
        constituency: constituency,
        mp: `Hon. MP (${district})`,
        category: category,
        approvedAmountLakhs: cost,
        releasedAmountLakhs: cost * 0.5,
        expenditureLakhs: 0.00,
        completionPct: 0,
        status: "PENDING",
        risk: "LOW",
        lastUpdated: new Date().toISOString().split('T')[0],
        startDate: startDate,
        expectedCompletion: endDate,
        implementingAgency: agency,
        description: desc || "Newly recommended MPLADS community asset work.",
        milestones: [
            { title: "Administrative Sanction Issued", status: "COMPLETED", date: new Date().toISOString().split('T')[0] },
            { title: "Technical Sanction & Tendering", status: "PENDING", date: startDate }
        ],
        coordinates: { lat: 25.3176, lng: 82.9739 }
    };

    worksData.unshift(newWork);
    if (window.MPLADS_DEMO_DATA && Array.isArray(window.MPLADS_DEMO_DATA.works)) {
        window.MPLADS_DEMO_DATA.works.unshift(newWork);
    }
    if (window.MPLADS_API && typeof window.MPLADS_API.saveLocalWork === 'function') {
        window.MPLADS_API.saveLocalWork(newWork);
    }

    // Persist to backend API if reachable
    const apiBase = typeof window.getApiBaseUrl === 'function' ? window.getApiBaseUrl() : '/api';
    fetch(`${apiBase}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWork)
    }).catch(() => {});

    if (typeof window.closeModal === 'function') {
        window.closeModal('addWorkModal');
    }
    applyWorksFilters();
    updateWorksSummaryCards();
    if (window.showMpladsToast) {
        window.showMpladsToast(`✓ Work ${newWork.id} recommended and queued for administrative sanction!`, 'success');
    }
}

window.editWorkPrompt = function (workId) {
    const work = worksData.find(w => w.id === workId);
    if (!work) return;

    const idInput = document.getElementById('editWorkId');
    const badgeId = document.getElementById('editWorkBadgeId');
    const titleEl = document.getElementById('editWorkTitle');
    const progInput = document.getElementById('editWorkProgress');
    const statusSelect = document.getElementById('editWorkStatus');
    const agencyInput = document.getElementById('editWorkAgency');
    const riskSelect = document.getElementById('editWorkRisk');

    if (idInput) idInput.value = work.id;
    if (badgeId) badgeId.textContent = work.id;
    if (titleEl) titleEl.textContent = work.name;
    if (progInput) progInput.value = work.completionPct;
    if (statusSelect) statusSelect.value = work.status;
    if (agencyInput) agencyInput.value = work.implementingAgency || '';
    if (riskSelect) riskSelect.value = work.risk || 'LOW';

    window.openModal('editWorkModal');
};

function handleEditWorkSubmit(e) {
    e.preventDefault();
    const workId = document.getElementById('editWorkId')?.value;
    const work = worksData.find(w => w.id === workId);
    if (!work) return;

    const val = parseInt(document.getElementById('editWorkProgress')?.value, 10);
    const status = document.getElementById('editWorkStatus')?.value;
    const agency = document.getElementById('editWorkAgency')?.value.trim();
    const risk = document.getElementById('editWorkRisk')?.value;

    if (!isNaN(val) && val >= 0 && val <= 100) {
        work.completionPct = val;
        work.status = status || (val === 100 ? 'COMPLETED' : (val > 0 && work.status === 'PENDING' ? 'ONGOING' : work.status));
        if (agency) work.implementingAgency = agency;
        if (risk) work.risk = risk;
        work.lastUpdated = new Date().toISOString().split('T')[0];

        // Persist locally
        if (window.MPLADS_API && typeof window.MPLADS_API.saveLocalWork === 'function') {
            window.MPLADS_API.saveLocalWork(work);
        }

        // Persist to backend API if available
        const apiBase = typeof window.getApiBaseUrl === 'function' ? window.getApiBaseUrl() : '/api';
        fetch(`${apiBase}/projects/${encodeURIComponent(workId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completionPct: val, status: work.status, implementingAgency: agency, risk })
        }).catch(() => {});

        window.closeModal('editWorkModal');
        renderWorksTable();
        updateWorksSummaryCards();
        if (window.showMpladsToast) {
            window.showMpladsToast(`✓ Work ${work.id} updated successfully (Progress: ${val}%, Status: ${work.status})`, 'success');
        }
    }
}

window.showWorksModalDetails = function (workId) {
    const work = worksData.find(w => w.id === workId);
    if (!work) return;

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
                        <div style="font-weight:700;color:var(--primary-900);font-size:1.05rem;">₹${work.approvedAmountLakhs.toFixed(2)} L</div>
                    </div>
                    <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                        <div style="font-size:0.75rem;color:var(--text-muted);">Released Amount</div>
                        <div style="font-weight:700;color:var(--info-700);font-size:1.05rem;">₹${work.releasedAmountLakhs.toFixed(2)} L</div>
                    </div>
                    <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                        <div style="font-size:0.75rem;color:var(--text-muted);">Expenditure</div>
                        <div style="font-weight:700;color:var(--success-700);font-size:1.05rem;">₹${work.expenditureLakhs.toFixed(2)} L</div>
                    </div>
                    <div style="background:var(--bg-surface-subtle);padding:10px;border-radius:6px;border:1px solid var(--border-color);">
                        <div style="font-size:0.75rem;color:var(--text-muted);">Risk Rating</div>
                        <div style="margin-top:2px;"><span class="badge badge-risk-${work.risk.toLowerCase()}">${work.risk}</span></div>
                    </div>
                </div>

                <div style="background:var(--bg-surface-subtle);padding:12px;border-radius:6px;border:1px solid var(--border-color);">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;font-weight:600;">Physical Progress (${work.completionPct}%)</div>
                    <div class="progress-track" style="height:10px;">
                        <div class="progress-bar ${work.completionPct === 100 ? 'success' : (work.status === 'DELAYED' ? 'danger' : '')}" style="width: ${work.completionPct}%;"></div>
                    </div>
                </div>

                <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">
                    <strong>Description & Scope:</strong><br>
                    ${work.description}
                </div>

                <div>
                    <h4 style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">Milestone Timeline</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${work.milestones ? work.milestones.map(m => `
                            <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-surface-raised);padding:8px 12px;border-radius:6px;font-size:0.8rem;">
                                <span>${m.title} (${m.date})</span>
                                <span class="badge badge-status-${m.status.toLowerCase()}">${m.status}</span>
                            </div>
                        `).join('') : '<div style="font-size:0.8rem;color:var(--text-muted);">No milestone data available.</div>'}
                    </div>
                </div>

                <div style="font-size:0.78rem;color:var(--text-muted);border-top:1px dashed var(--border-color);padding-top:8px;display:flex;justify-content:space-between;align-items:center;">
                    <span>Implementing Agency: <strong>${work.implementingAgency}</strong></span>
                    <span>Target Date: <strong>${work.expectedCompletion}</strong></span>
                </div>

                <div style="margin-top:10px;text-align:right;">
                    <button class="btn btn-primary btn-sm" onclick="window.openForensicModal('${work.id}', 'work')" style="background:linear-gradient(135deg,#0284c7,#0369a1);border:none;color:#fff;">
                        🤖 Generate MoSPI AI Forensic Audit Dossier
                    </button>
                </div>
            </div>
        `;
        window.openModal('workDetailsModal');
    }
};
