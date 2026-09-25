/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Deep Analytics Controller
 * 
 * Orchestrates 6 fully reactive analytics charts (Fund Utilization, Project
 * Completion Lifecycle, District Expenditure Comparison, Sector/Category Allocation,
 * 12-Month Financial Velocity, and Risk Level Portfolio Distribution).
 * Dynamically re-aggregates data on every category, district, status & risk change.
 * ==============================================================================
 */

const analyticsCharts = {
    utilization: null,
    completion: null,
    districtComp: null,
    category: null,
    monthly: null,
    risk: null
};

const ALL_CATEGORIES = [
    "Drinking Water & Sanitation",
    "Education & Digital Labs",
    "Rural Roads & Bridges",
    "Public Health Infrastructure",
    "Renewable Energy & Lighting",
    "Community Assets & Skills"
];

const CATEGORY_COLORS = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Emerald
    'rgba(245, 158, 11, 0.8)',   // Amber
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(14, 165, 233, 0.8)',   // Cyan/Sky
    'rgba(139, 92, 246, 0.8)'    // Purple
];

document.addEventListener('DOMContentLoaded', () => {
    initAnalyticsEvents();
    renderAllAnalyticsCharts();
});

window.addEventListener('mplads_backend_synced', () => {
    renderAllAnalyticsCharts();
});

function initAnalyticsEvents() {
    const applyBtn = document.getElementById('anApplyBtn');
    const resetBtn = document.getElementById('anResetBtn');
    const filterIds = ['anFY', 'anDistrict', 'anCategory', 'anStatus', 'anRisk'];

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const district = document.getElementById('anDistrict')?.value || 'ALL';
            const cat = document.getElementById('anCategory')?.value || 'ALL';
            renderAllAnalyticsCharts();
            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast(`Analytics updated for District: ${district}, Category: ${cat}`, 'info');
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const fy = document.getElementById('anFY');
            const dist = document.getElementById('anDistrict');
            const cat = document.getElementById('anCategory');
            const status = document.getElementById('anStatus');
            const risk = document.getElementById('anRisk');

            if (fy) fy.value = '2025-26';
            if (dist) dist.value = 'ALL';
            if (cat) cat.value = 'ALL';
            if (status) status.value = 'ALL';
            if (risk) risk.value = 'ALL';

            renderAllAnalyticsCharts();
            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast('Analytics filters reset to default overview.', 'info');
            }
        });
    }

    filterIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', renderAllAnalyticsCharts);
        }
    });
}

function getFilteredWorks() {
    const allWorks = window.MPLADS_DEMO_DATA?.works || [];
    const fy = document.getElementById('anFY')?.value || 'ALL';
    const district = document.getElementById('anDistrict')?.value || 'ALL';
    const category = document.getElementById('anCategory')?.value || 'ALL';
    const status = document.getElementById('anStatus')?.value || 'ALL';
    const risk = document.getElementById('anRisk')?.value || 'ALL';

    return allWorks.filter(w => {
        const matchFY = fy === 'ALL' || w.financialYear === fy;
        const matchDist = district === 'ALL' || w.district.toLowerCase() === district.toLowerCase();
        const matchCat = category === 'ALL' || w.category.toLowerCase() === category.toLowerCase();
        const matchStatus = status === 'ALL' || w.status.toUpperCase() === status.toUpperCase();
        const matchRisk = risk === 'ALL' || w.risk.toUpperCase() === risk.toUpperCase();

        return matchFY && matchDist && matchCat && matchStatus && matchRisk;
    });
}

function renderAllAnalyticsCharts() {
    if (typeof Chart === 'undefined') return;
    const demo = window.MPLADS_DEMO_DATA;
    if (!demo) return;

    const filteredWorks = getFilteredWorks();
    const selectedCategory = document.getElementById('anCategory')?.value || 'ALL';
    const selectedDistrict = document.getElementById('anDistrict')?.value || 'ALL';

    // -------------------------------------------------------------
    // 1. Fund Utilization Chart (District-wise Released vs Spent)
    // -------------------------------------------------------------
    const ctxUtil = document.getElementById('anFundUtilChart');
    if (ctxUtil) {
        if (analyticsCharts.utilization) analyticsCharts.utilization.destroy();

        // Calculate by district from filtered works
        const districtMap = {};
        const pilotDistricts = window.PILOT_DISTRICTS || [
            "Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar", "Mirzapur", "Jaunpur"
        ];

        pilotDistricts.forEach(d => {
            districtMap[d] = { released: 0, expenditure: 0, count: 0 };
        });

        filteredWorks.forEach(w => {
            if (!districtMap[w.district]) {
                districtMap[w.district] = { released: 0, expenditure: 0, count: 0 };
            }
            districtMap[w.district].released += (w.releasedAmountLakhs || 0) / 100;
            districtMap[w.district].expenditure += (w.expenditureLakhs || 0) / 100;
            districtMap[w.district].count++;
        });

        let displayDistricts = Object.keys(districtMap);
        if (selectedDistrict !== 'ALL') {
            displayDistricts = displayDistricts.filter(d => d.toLowerCase() === selectedDistrict.toLowerCase());
        }
        if (displayDistricts.length === 0) displayDistricts = pilotDistricts.slice(0, 6);

        analyticsCharts.utilization = new Chart(ctxUtil, {
            type: 'bar',
            data: {
                labels: displayDistricts,
                datasets: [
                    {
                        label: 'Released (₹ Cr)',
                        data: displayDistricts.map(d => Number((districtMap[d]?.released || 0).toFixed(2))),
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    },
                    {
                        label: 'Expenditure (₹ Cr)',
                        data: displayDistricts.map(d => Number((districtMap[d]?.expenditure || 0).toFixed(2))),
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.raw} Cr`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Amount (₹ Crore)' }
                    }
                }
            }
        });
    }

    // -------------------------------------------------------------
    // 2. Project Completion Lifecycle (Doughnut)
    // -------------------------------------------------------------
    const ctxComp = document.getElementById('anCompletionChart');
    if (ctxComp) {
        if (analyticsCharts.completion) analyticsCharts.completion.destroy();

        const statusCounts = {
            COMPLETED: 0,
            ONGOING: 0,
            DELAYED: 0,
            PENDING: 0,
            CANCELLED: 0
        };

        filteredWorks.forEach(w => {
            const st = (w.status || 'PENDING').toUpperCase();
            if (statusCounts[st] !== undefined) statusCounts[st]++;
        });

        const statusLabels = ["Completed", "Ongoing", "Delayed", "Pending", "Cancelled"];
        const statusData = [
            statusCounts.COMPLETED,
            statusCounts.ONGOING,
            statusCounts.DELAYED,
            statusCounts.PENDING,
            statusCounts.CANCELLED
        ];

        analyticsCharts.completion = new Chart(ctxComp, {
            type: 'doughnut',
            data: {
                labels: statusLabels,
                datasets: [{
                    data: statusData,
                    backgroundColor: ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#64748b"],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const total = statusData.reduce((a, b) => a + b, 0);
                                const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                                return ` ${ctx.label}: ${ctx.raw} works (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // -------------------------------------------------------------
    // 3. District Expenditure Comparison (Horizontal Bar)
    // -------------------------------------------------------------
    const ctxDist = document.getElementById('anDistrictCompChart');
    if (ctxDist) {
        if (analyticsCharts.districtComp) analyticsCharts.districtComp.destroy();

        const districtExp = {};
        filteredWorks.forEach(w => {
            districtExp[w.district] = (districtExp[w.district] || 0) + ((w.expenditureLakhs || 0) / 100);
        });

        const distLabels = Object.keys(districtExp).length > 0
            ? Object.keys(districtExp).sort((a, b) => districtExp[b] - districtExp[a])
            : (window.PILOT_DISTRICTS || ["Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar"]);

        analyticsCharts.districtComp = new Chart(ctxDist, {
            type: 'bar',
            data: {
                labels: distLabels,
                datasets: [{
                    label: 'Expenditure (₹ Cr)',
                    data: distLabels.map(d => Number((districtExp[d] || 0).toFixed(2))),
                    backgroundColor: '#1e3a8a',
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
                            label: (ctx) => ` Total Expenditure: ₹${ctx.raw} Cr`
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Expenditure (₹ Crore)' }
                    }
                }
            }
        });
    }

    // -------------------------------------------------------------
    // 4. Sector / Category Allocation (Polar Area)
    // -------------------------------------------------------------
    const ctxSector = document.getElementById('anCategoryChart');
    if (ctxSector) {
        if (analyticsCharts.category) analyticsCharts.category.destroy();

        let labels = [];
        let data = [];
        let colors = [];

        if (selectedCategory === 'ALL') {
            // Aggregate all 6 categories from filtered works
            const catMap = {};
            ALL_CATEGORIES.forEach(c => { catMap[c] = 0; });

            filteredWorks.forEach(w => {
                if (catMap[w.category] !== undefined) {
                    catMap[w.category] += (w.approvedAmountLakhs || 0) / 100;
                }
            });

            labels = ALL_CATEGORIES;
            data = ALL_CATEGORIES.map(c => Number(catMap[c].toFixed(2)));
            colors = CATEGORY_COLORS;
        } else {
            // Breakdown of selected category across districts
            const districtInCat = {};
            filteredWorks.forEach(w => {
                districtInCat[w.district] = (districtInCat[w.district] || 0) + ((w.approvedAmountLakhs || 0) / 100);
            });

            labels = Object.keys(districtInCat);
            data = labels.map(d => Number(districtInCat[d].toFixed(2)));
            colors = labels.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]);
        }

        analyticsCharts.category = new Chart(ctxSector, {
            type: 'polarArea',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { boxWidth: 12, font: { size: 10 } } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ₹${ctx.raw} Cr Allocation`
                        }
                    }
                }
            }
        });
    }

    // -------------------------------------------------------------
    // 5. 12-Month Monthly Velocity (Line)
    // -------------------------------------------------------------
    const ctxMonth = document.getElementById('anMonthlyChart');
    if (ctxMonth) {
        if (analyticsCharts.monthly) analyticsCharts.monthly.destroy();

        const baseTrend = demo.monthlyExpenditure || {
            labels: ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"],
            expenditure: [24.5, 26.8, 32.1, 27.4, 29.5, 42.0, 22.1, 27.8, 30.2, 29.1, 28.3, 30.5]
        };

        // Scale expenditure proportional to filtered count vs total count
        const totalWorksCount = demo.works?.length || 1;
        const scaleFactor = Math.max(0.1, filteredWorks.length / totalWorksCount);
        const scaledExpenditure = baseTrend.expenditure.map(v => Number((v * scaleFactor).toFixed(2)));

        analyticsCharts.monthly = new Chart(ctxMonth, {
            type: 'line',
            data: {
                labels: baseTrend.labels,
                datasets: [{
                    label: `Monthly Expenditure (₹ Cr) [${filteredWorks.length} Works]`,
                    data: scaledExpenditure,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` Expenditure: ₹${ctx.raw} Cr`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: '₹ Crore' }
                    }
                }
            }
        });
    }

    // -------------------------------------------------------------
    // 6. Risk Level Portfolio Distribution (Pie)
    // -------------------------------------------------------------
    const ctxRisk = document.getElementById('anRiskChart');
    if (ctxRisk) {
        if (analyticsCharts.risk) analyticsCharts.risk.destroy();

        const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
        filteredWorks.forEach(w => {
            const rk = (w.risk || 'LOW').toUpperCase();
            if (riskCounts[rk] !== undefined) riskCounts[rk]++;
        });

        const riskLabels = ["Low Risk", "Medium Risk", "High Risk", "Critical Risk"];
        const riskData = [riskCounts.LOW, riskCounts.MEDIUM, riskCounts.HIGH, riskCounts.CRITICAL];

        analyticsCharts.risk = new Chart(ctxRisk, {
            type: 'pie',
            data: {
                labels: riskLabels,
                datasets: [{
                    data: riskData,
                    backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const total = riskData.reduce((a, b) => a + b, 0);
                                const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                                return ` ${ctx.label}: ${ctx.raw} works (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}
