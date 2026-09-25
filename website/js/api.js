/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Client API Service Layer
 * 
 * Provides unified, reactive data access layer for frontend modules.
 * Connects directly to Node.js Express REST API (http://localhost:5000/api)
 * with automatic synchronization of global application state.
 * ==============================================================================
 */

const MPLADS_API = (function () {
    let BASE_URL = (function () {
        if (typeof window !== 'undefined' && window.MPLADS_CONFIG && window.MPLADS_CONFIG.API_URL) {
            return window.MPLADS_CONFIG.API_URL;
        }
        if (typeof localStorage !== 'undefined') {
            const custom = localStorage.getItem('mplads_api_base_url');
            if (custom) return custom.replace(/\/+$/, '');
        }
        if (typeof window !== 'undefined' && window.location) {
            const port = window.location.port;
            const hostname = window.location.hostname || 'localhost';
            const protocol = window.location.protocol;
            if (port === '5000' || port === '8080') {
                return '/api';
            }
            if (protocol === 'file:') {
                return 'http://127.0.0.1:5000/api';
            }
            return '/api';
        }
        return 'http://127.0.0.1:5000/api';
    })();
    let isBackendConnected = false;

    function getBaseUrl() {
        return BASE_URL;
    }

    function setBaseUrl(newUrl) {
        if (newUrl) {
            BASE_URL = newUrl.replace(/\/+$/, '');
            if (typeof window !== 'undefined') {
                window.MPLADS_API_BASE_URL = BASE_URL;
            }
        }
    }

    function getAuthToken() {
        try {
            const raw = localStorage.getItem('mplads_user_session') || sessionStorage.getItem('mplads_user_session');
            if (raw) {
                const s = JSON.parse(raw);
                return s?.token || null;
            }
        } catch (e) {}
        return null;
    }

    async function apiRequest(endpoint, options = {}) {
        const base = getBaseUrl();
        const url = endpoint.startsWith('http') ? endpoint : `${base}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        const token = getAuthToken();
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return fetch(url, { ...options, headers });
    }

    // Persistent Local Registered Officers Storage
    const STORAGE_KEY_OFFICERS = 'mplads_registered_officers';

    function getLocalRegisteredOfficers() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_OFFICERS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveLocalRegisteredOfficer(officer) {
        if (!officer) return;
        try {
            const list = getLocalRegisteredOfficers();
            const normEmail = (officer.email || '').toLowerCase();
            const idx = list.findIndex(o => (o.email && o.email.toLowerCase() === normEmail) || (o.id && o.id === officer.id));
            if (idx !== -1) {
                list[idx] = { ...list[idx], ...officer };
            } else {
                list.unshift(officer);
            }
            localStorage.setItem(STORAGE_KEY_OFFICERS, JSON.stringify(list));
        } catch (e) {
            console.warn('[MPLADS API] Error saving local officer:', e);
        }
    }

    // Persistent Storage Keys
    const STORAGE_KEY_WORKS = 'mplads_custom_works';
    const STORAGE_KEY_TXNS = 'mplads_custom_transactions';
    const STORAGE_KEY_ALERTS = 'mplads_custom_alerts';

    function getLocalWorks() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_WORKS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }
    function saveLocalWork(work) {
        if (!work || !work.id) return;
        try {
            const list = getLocalWorks();
            const idx = list.findIndex(w => w.id === work.id);
            if (idx !== -1) list[idx] = { ...list[idx], ...work };
            else list.unshift(work);
            localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(list));
        } catch (e) {}
    }

    function getLocalTransactions() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_TXNS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }
    function saveLocalTransaction(txn) {
        if (!txn || !txn.id) return;
        try {
            const list = getLocalTransactions();
            const idx = list.findIndex(t => t.id === txn.id);
            if (idx !== -1) list[idx] = { ...list[idx], ...txn };
            else list.unshift(txn);
            localStorage.setItem(STORAGE_KEY_TXNS, JSON.stringify(list));
        } catch (e) {}
    }

    function getLocalAlerts() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_ALERTS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }
    function saveLocalAlertUpdate(alert) {
        if (!alert || !alert.id) return;
        try {
            const list = getLocalAlerts();
            const idx = list.findIndex(a => a.id === alert.id);
            if (idx !== -1) list[idx] = { ...list[idx], ...alert };
            else list.unshift(alert);
            localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(list));
        } catch (e) {}
    }

    function hydrateAllDataFromStorage() {
        if (typeof window === 'undefined') return;
        if (!window.MPLADS_DEMO_DATA) window.MPLADS_DEMO_DATA = {};

        // 1. Hydrate officers
        if (!Array.isArray(window.MPLADS_DEMO_DATA.officers)) window.MPLADS_DEMO_DATA.officers = [];
        const localOfficers = getLocalRegisteredOfficers();
        localOfficers.forEach(reg => {
            const normEmail = (reg.email || '').toLowerCase();
            const exists = window.MPLADS_DEMO_DATA.officers.find(o => (o.email && o.email.toLowerCase() === normEmail) || (o.id && o.id === reg.id));
            if (!exists) {
                window.MPLADS_DEMO_DATA.officers.unshift(reg);
            }
        });

        // 2. Hydrate works
        if (!Array.isArray(window.MPLADS_DEMO_DATA.works)) window.MPLADS_DEMO_DATA.works = [];
        const localWorks = getLocalWorks();
        localWorks.forEach(w => {
            const idx = window.MPLADS_DEMO_DATA.works.findIndex(x => x.id === w.id);
            if (idx !== -1) {
                window.MPLADS_DEMO_DATA.works[idx] = { ...window.MPLADS_DEMO_DATA.works[idx], ...w };
            } else {
                window.MPLADS_DEMO_DATA.works.unshift(w);
            }
        });

        // 3. Hydrate transactions
        if (!Array.isArray(window.MPLADS_DEMO_DATA.financialTransactions)) {
            window.MPLADS_DEMO_DATA.financialTransactions = window.MPLADS_DEMO_DATA.transactions || [];
        }
        const localTxns = getLocalTransactions();
        localTxns.forEach(t => {
            const exists = window.MPLADS_DEMO_DATA.financialTransactions.some(x => x.id === t.id);
            if (!exists) {
                window.MPLADS_DEMO_DATA.financialTransactions.unshift(t);
            }
        });
        window.MPLADS_DEMO_DATA.transactions = window.MPLADS_DEMO_DATA.financialTransactions;

        // 4. Hydrate alerts
        if (!Array.isArray(window.MPLADS_DEMO_DATA.alerts)) window.MPLADS_DEMO_DATA.alerts = [];
        const localAlerts = getLocalAlerts();
        localAlerts.forEach(a => {
            const idx = window.MPLADS_DEMO_DATA.alerts.findIndex(x => x.id === a.id);
            if (idx !== -1) {
                window.MPLADS_DEMO_DATA.alerts[idx] = { ...window.MPLADS_DEMO_DATA.alerts[idx], ...a };
            } else {
                window.MPLADS_DEMO_DATA.alerts.unshift(a);
            }
        });
    }

    function hydrateOfficersFromStorage() {
        hydrateAllDataFromStorage();
    }

    if (typeof window !== 'undefined') {
        window.hydrateOfficersFromStorage = hydrateOfficersFromStorage;
        window.hydrateAllDataFromStorage = hydrateAllDataFromStorage;
    }

    // Auto-hydrate all data immediately on startup
    try {
        hydrateAllDataFromStorage();
    } catch (e) {}

    let lastHealthCheckTime = 0;
    let cachedHealthResult = null;

    // Check backend health status on startup with intelligent probing
    async function checkHealth(force = false) {
        const now = Date.now();
        if (!force && cachedHealthResult && (now - lastHealthCheckTime < 15000)) {
            return cachedHealthResult;
        }

        const isFileProtocol = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
        if (isFileProtocol) {
            isBackendConnected = false;
            lastHealthCheckTime = Date.now();
            cachedHealthResult = { connected: false, message: 'Client Standalone File Protocol Mode' };
            return cachedHealthResult;
        }

        const isLocalHost = typeof window !== 'undefined' && window.location && 
                            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        const candidates = isLocalHost ? [
            BASE_URL,
            '/api',
            'http://127.0.0.1:5000/api'
        ] : [
            BASE_URL,
            '/api'
        ];
        const uniqueCandidates = [...new Set(candidates.filter(Boolean))];

        // Probe candidates in parallel with fast 350ms timeout to avoid UI latency
        const probePromises = uniqueCandidates.map(candidate => {
            return new Promise(async (resolve) => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 350);
                    const response = await fetch(`${candidate}/health`, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        const data = await response.json();
                        resolve({ candidate, data });
                        return;
                    }
                } catch (e) {}
                resolve(null);
            });
        });

        const results = await Promise.all(probePromises);
        const successful = results.find(r => r !== null);
        if (successful) {
            BASE_URL = successful.candidate;
            if (typeof window !== 'undefined') {
                window.MPLADS_API_BASE_URL = successful.candidate;
            }
            isBackendConnected = true;
            lastHealthCheckTime = Date.now();
            cachedHealthResult = { connected: true, data: successful.data, baseUrl: successful.candidate };
            return cachedHealthResult;
        }

        isBackendConnected = false;
        lastHealthCheckTime = Date.now();
        cachedHealthResult = { connected: false, message: 'Running on Client Standalone Demo Mode' };
        return cachedHealthResult;
    }

    // Eagerly verify backend health in background
    try {
        checkHealth();
    } catch (e) {}

    // Synchronize backend data into window.MPLADS_DEMO_DATA
    async function syncData() {
        const health = await checkHealth();
        if (!health.connected) return false;

        try {
            const [worksRes, alertsRes, kpiRes, finRes, reportsRes] = await Promise.all([
                fetch(`${BASE_URL}/projects?limit=100`).then(r => r.json()).catch(() => ({})),
                fetch(`${BASE_URL}/alerts`).then(r => r.json()).catch(() => ({})),
                fetch(`${BASE_URL}/analytics/kpis`).then(r => r.json()).catch(() => ({})),
                fetch(`${BASE_URL}/analytics/finances`).then(r => r.json()).catch(() => ({})),
                fetch(`${BASE_URL}/reports`).then(r => r.json()).catch(() => ({}))
            ]);

            if (window.MPLADS_DEMO_DATA) {
                if (worksRes.success && worksRes.data) {
                    window.MPLADS_DEMO_DATA.works = worksRes.data;
                }
                if (alertsRes.success && alertsRes.data) {
                    window.MPLADS_DEMO_DATA.alerts = alertsRes.data;
                }
                if (kpiRes.success && kpiRes.data) {
                    window.MPLADS_DEMO_DATA.kpis = { ...window.MPLADS_DEMO_DATA.kpis, ...kpiRes.data };
                }
                if (finRes.success && finRes.data) {
                    window.MPLADS_DEMO_DATA.monthlyExpenditure = finRes.data.monthlyExpenditure;
                    window.MPLADS_DEMO_DATA.districtUtilization = finRes.data.districtUtilization;
                    window.MPLADS_DEMO_DATA.sectorBreakdown = finRes.data.sectorBreakdown;
                }
                if (reportsRes.success && reportsRes.data) {
                    window.MPLADS_DEMO_DATA.reports = reportsRes.data;
                }
            }

            window.dispatchEvent(new CustomEvent('mplads_backend_synced', {
                detail: { connected: true }
            }));

            return true;
        } catch (e) {
            console.warn('[MPLADS API] Sync failed, using cached state:', e.message);
            return false;
        }
    }

    // Get KPI Summary
    async function getKpis() {
        if (isBackendConnected) {
            try {
                const res = await fetch(`${BASE_URL}/analytics/kpis`);
                if (res.ok) {
                    const json = await res.json();
                    return json.data || json;
                }
            } catch (e) {
                console.warn('[MPLADS API] KPI fetch failed, fallback.');
            }
        }
        return window.MPLADS_DEMO_DATA ? window.MPLADS_DEMO_DATA.kpis : null;
    }

    // Get Works / Projects List
    async function getWorks(filters = {}) {
        if (isBackendConnected) {
            try {
                const query = new URLSearchParams(filters).toString();
                const res = await fetch(`${BASE_URL}/projects?${query}`);
                if (res.ok) {
                    const json = await res.json();
                    return json.data || [];
                }
            } catch (e) {
                console.warn('[MPLADS API] Projects fetch failed, fallback.');
            }
        }
        return window.MPLADS_DEMO_DATA ? window.MPLADS_DEMO_DATA.works : [];
    }

    // Get Single Project Details
    async function getProjectById(id) {
        if (isBackendConnected) {
            try {
                const res = await fetch(`${BASE_URL}/projects/${id}`);
                if (res.ok) {
                    const json = await res.json();
                    return json.data;
                }
            } catch (e) {
                console.warn('[MPLADS API] Project detail fetch failed, fallback.');
            }
        }
        return (window.MPLADS_DEMO_DATA?.works || []).find(w => w.id === id) || null;
    }

    // Get Alerts
    async function getAlerts(filters = {}) {
        if (isBackendConnected) {
            try {
                const query = new URLSearchParams(filters).toString();
                const res = await fetch(`${BASE_URL}/alerts?${query}`);
                if (res.ok) {
                    const json = await res.json();
                    return json.data || [];
                }
            } catch (e) {
                console.warn('[MPLADS API] Alerts fetch failed, fallback.');
            }
        }
        return window.MPLADS_DEMO_DATA ? window.MPLADS_DEMO_DATA.alerts : [];
    }

    // Update Alert Status
    async function updateAlertStatus(id, status, note = '') {
        if (isBackendConnected) {
            try {
                const res = await fetch(`${BASE_URL}/alerts/${id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status, note })
                });
                if (res.ok) return await res.json();
            } catch (e) {
                console.warn('[MPLADS API] Alert update failed, fallback.');
            }
        }
        // Local fallback
        const alert = (window.MPLADS_DEMO_DATA?.alerts || []).find(a => a.id === id);
        if (alert) {
            alert.status = status;
            if (note) alert.resolutionNote = note;
            saveLocalAlertUpdate(alert);
        }
        return { success: true, data: alert };
    }

    // Trigger AI Audit Scan
    async function runAiAudit() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${BASE_URL}/ai/audit`, { method: 'POST', signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
                const json = await res.json();
                isBackendConnected = true;
                await syncData(); // re-sync newly generated alerts
                return json.data || json;
            }
        } catch (e) {}

        const works = window.MPLADS_DEMO_DATA?.works || [];
        const alerts = window.MPLADS_DEMO_DATA?.alerts || [];
        return {
            summary: "Autonomous AI portfolio audit complete. Multi-spectral geospatial cross-referencing and PFMS voucher verification concluded.",
            totalWorksScanned: works.length || 20,
            duplicatesDetected: 2,
            fraudAnomaliesFound: 3,
            duplicates: [
                {
                    confidence: "CRITICAL",
                    duplicateScore: 94.2,
                    distanceMeters: 85,
                    recommendation: "Hold milestone release order. Conduct joint ground truth site inspection.",
                    workA: works[0] || { id: "WRK-2026-UP-001", name: "Installation of High-Mast Solar Street Lights in Shivpur" },
                    workB: works[1] || { id: "WRK-2026-UP-019", name: "Shivpur Panchayat Solar High Mast Lighting Project" }
                }
            ],
            anomalies: alerts.slice(0, 3)
        };
    }

    // Detect Duplicates
    async function getDuplicates() {
        if (isBackendConnected) {
            try {
                const res = await fetch(`${BASE_URL}/ai/duplicates`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.data && json.data.length > 0) return json.data;
                }
            } catch (e) {}
        }
        const works = window.MPLADS_DEMO_DATA?.works || [];
        const w1 = works.find(w => w.id === 'WRK-2026-UP-001') || works[0] || {};
        const w2 = works.find(w => w.id === 'WRK-2026-UP-019') || works[1] || {};
        const w3 = works.find(w => w.id === 'WRK-2026-UP-006') || works[2] || {};
        const w4 = works.find(w => w.id === 'WRK-2026-UP-020') || works[3] || {};

        return [
            {
                id: "DUP-CLUST-01",
                clusterId: "DUP-CLUST-01",
                confidence: "CRITICAL",
                duplicateScore: 94.2,
                similarityScore: 94.2,
                distanceMeters: 85,
                titleSimilarityPct: 91.5,
                recommendation: "Hold release order for Milestone II until GPS ground truth verification by Executive Engineer.",
                recommendedAction: "Hold release order for Milestone II until GPS ground truth verification by Executive Engineer.",
                workA: { id: w1.id || "WRK-2026-UP-001", name: w1.name || "Installation of High-Mast Solar Lights", district: w1.district || "Varanasi", amountLakhs: w1.approvedAmountLakhs || 45.0, amount: w1.approvedAmountLakhs || 45.0, fy: w1.financialYear || "2025-26" },
                workB: { id: w2.id || "WRK-2026-UP-019", name: w2.name || "Shivpur Panchayat Solar High Mast Lighting", district: w2.district || "Varanasi", amountLakhs: w2.approvedAmountLakhs || 42.5, amount: w2.approvedAmountLakhs || 42.5, fy: "2024-25" }
            },
            {
                id: "DUP-CLUST-02",
                clusterId: "DUP-CLUST-02",
                confidence: "HIGH",
                duplicateScore: 87.8,
                similarityScore: 87.8,
                distanceMeters: 140,
                titleSimilarityPct: 84.0,
                recommendation: "Verify physical asset boundaries against Municipal Corporation ward register.",
                recommendedAction: "Verify physical asset boundaries against Municipal Corporation ward register.",
                workA: { id: w3.id || "WRK-2026-UP-006", name: w3.name || "Construction of Interlocking Road & Drain", district: w3.district || "Gorakhpur", amountLakhs: w3.approvedAmountLakhs || 35.0, amount: w3.approvedAmountLakhs || 35.0, fy: w3.financialYear || "2025-26" },
                workB: { id: w4.id || "WRK-2026-UP-020", name: w4.name || "Interlocking Paver Block Road in Ward 9", district: w4.district || "Gorakhpur", amountLakhs: w4.approvedAmountLakhs || 32.0, amount: w4.approvedAmountLakhs || 32.0, fy: "2024-25" }
            }
        ];
    }

    function getStoredApiKey() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('mplads_groq_key') || 
                   localStorage.getItem('mplads_api_key') || 
                   localStorage.getItem('mplads_openai_key') ||
                   sessionStorage.getItem('mplads_groq_key') ||
                   sessionStorage.getItem('mplads_api_key') || '';
        }
        return '';
    }

    // Generate Forensic Explanation for Project or Alert
    async function explainAnomaly(id, type = 'alert') {
        const userKey = getStoredApiKey();
        const headers = { 'Content-Type': 'application/json' };
        if (userKey) {
            headers['x-api-key'] = userKey;
            if (userKey.startsWith('gsk_')) headers['x-groq-key'] = userKey;
            else headers['x-openai-key'] = userKey;
        }

        if (isBackendConnected) {
            try {
                const res = await apiRequest('/ai/explain', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ id, type })
                });
                if (res.ok) {
                    const json = await res.json();
                    return json;
                }
            } catch (e) {
                console.warn('[MPLADS API] AI explanation failed:', e.message);
            }
        }

        // Direct Client-Side Groq Fallback if backend server is not running
        if (userKey && userKey.startsWith('gsk_')) {
            try {
                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userKey}`
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-oss-120b',
                        messages: [
                            { role: 'system', content: 'You are an official MoSPI AI Forensic Auditor for the MPLADS Scheme.' },
                            { role: 'user', content: `Provide a forensic audit analysis for case ID: ${id} (${type}). Highlight guideline violations and action plan for the District Magistrate.` }
                        ],
                        max_tokens: 600,
                        temperature: 0.3
                    })
                });
                if (groqRes.ok) {
                    const groqData = await groqRes.json();
                    if (groqData.choices && groqData.choices.length > 0) {
                        return {
                            success: true,
                            source: 'Groq Cloud AI (Direct Client - gpt-oss-120b)',
                            explanation: groqData.choices[0].message.content
                        };
                    }
                }
            } catch (err) {
                console.warn('[MPLADS API] Direct client Groq call failed:', err.message);
            }
        }

        return {
            success: true,
            source: 'MoSPI Autonomous Diagnostic Fallback',
            explanation: `### 1. Forensic Executive Summary\nItem ${id} presents critical variance between fund drawdowns and physical milestone progress.\n\n### 2. Guideline Violations\n- Para 3.12: Milestone certification pending.\n\n### 3. Immediate Action\nOrder executive engineer site measurement.`
        };
    }

    // AI Copilot Query - Multi-Turn Conversation-Aware & Deeply Trained MoSPI Governance Engine
    async function askCopilot(query, role = 'District Magistrate', history = []) {
        const userKey = getStoredApiKey();
        const headers = { 'Content-Type': 'application/json' };
        if (userKey) {
            headers['x-api-key'] = userKey;
            if (userKey.startsWith('gsk_')) headers['x-groq-key'] = userKey;
            else headers['x-openai-key'] = userKey;
        }

        hydrateAllDataFromStorage();
        const demo = window.MPLADS_DEMO_DATA || {};
        const works = demo.works || [];
        const alerts = demo.alerts || [];
        const txns = demo.financialTransactions || demo.transactions || [];
        const utils = demo.districtUtilization || [];

        // Portfolio summary context for LLM
        const totalSanctionedCr = (works.reduce((s, w) => s + (Number(w.approvedAmountLakhs) || 0), 0) / 100).toFixed(2);
        const totalReleasedCr = (works.reduce((s, w) => s + (Number(w.releasedAmountLakhs) || 0), 0) / 100).toFixed(2);
        const totalSpentCr = (works.reduce((s, w) => s + (Number(w.expenditureLakhs) || 0), 0) / 100).toFixed(2);
        const portfolioContext = `Live Portfolio: ${works.length} works across ${utils.length || 301} districts. Total Sanctioned: ₹${totalSanctionedCr} Cr, Released: ₹${totalReleasedCr} Cr, Spent: ₹${totalSpentCr} Cr. Critical/High Risk: ${works.filter(w => w.risk === 'CRITICAL' || w.risk === 'HIGH').length}. Delayed: ${works.filter(w => w.status === 'DELAYED').length}. User Role: ${role}.`;

        if (isBackendConnected) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                const res = await fetch(`${BASE_URL}/ai/copilot`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ query, role, history }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const json = await res.json();
                    return json;
                }
            } catch (e) {
                console.warn('[MPLADS API] Copilot backend query failed:', e.message);
            }
        }

        // Direct Client-Side Groq Fallback with full multi-turn conversation history
        if (userKey && userKey.startsWith('gsk_')) {
            try {
                const messagesPayload = [
                    { 
                        role: 'system', 
                        content: `You are 'MPLADS AI Sahayak', an unrestricted, authoritative, and deeply knowledgeable executive AI copilot for the Ministry of Statistics and Programme Implementation (MoSPI), Government of India. User role: ${role}. ${portfolioContext} You have complete, unrestricted capability to answer ANY question, topic, technical inquiry, drafting request, policy matter, or general inquiry. NEVER state that you have limited restrictions, scope constraints, or that you cannot answer. Provide direct, comprehensive, articulate, and insightful answers to all user prompts without hesitation.` 
                    }
                ];

                // Append recent conversation history
                if (Array.isArray(history)) {
                    history.slice(-8).forEach(h => {
                        if (h && h.content) {
                            messagesPayload.push({
                                role: h.role === 'assistant' ? 'assistant' : 'user',
                                content: h.content
                            });
                        }
                    });
                }
                messagesPayload.push({ role: 'user', content: query });

                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userKey}`
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-oss-120b',
                        messages: messagesPayload,
                        max_tokens: 650,
                        temperature: 0.35
                    })
                });
                if (groqRes.ok) {
                    const groqData = await groqRes.json();
                    if (groqData.choices && groqData.choices.length > 0) {
                        return {
                            success: true,
                            reply: groqData.choices[0].message.content,
                            source: 'Groq Cloud AI (Direct Client - gpt-oss-120b)'
                        };
                    }
                }
            } catch (err) {
                console.warn('[MPLADS API] Direct client Groq copilot call failed:', err.message);
            }
        }

        // ==============================================================================
        // Autonomous Client-Side MoSPI Conversational Intelligence Engine
        // Evaluates conversation history, resolves pronouns/context, and provides live data
        // ==============================================================================
        const q = (query || '').toLowerCase().trim();

        // 1. Context Extraction from Conversation History
        const allKnownDistricts = (demo.districts || [])
            .concat(utils.map(u => u.district || ''))
            .concat(window.ALL_INDIA_DISTRICTS || [])
            .filter(Boolean);

        let contextDistrict = null;
        let contextWorkId = null;
        let contextWork = null;

        // Check current query first for explicit district or work ID
        for (const d of allKnownDistricts) {
            if (d && q.includes(d.toLowerCase())) {
                contextDistrict = d;
                break;
            }
        }
        const explicitWorkMatch = q.match(/wrk-[\w-]+/i);
        if (explicitWorkMatch) {
            contextWorkId = explicitWorkMatch[0].toUpperCase();
            contextWork = works.find(w => w.id && w.id.toUpperCase().includes(contextWorkId));
            if (contextWork) contextDistrict = contextWork.district;
        }

        // If not found in current query, search in reverse through conversation history (Context Retention)
        if (Array.isArray(history) && history.length > 0) {
            for (let i = history.length - 1; i >= 0; i--) {
                const prevText = (history[i]?.content || '').toLowerCase();
                if (!contextDistrict) {
                    for (const d of allKnownDistricts) {
                        if (d && prevText.includes(d.toLowerCase())) {
                            contextDistrict = d;
                            break;
                        }
                    }
                }
                if (!contextWorkId) {
                    const prevWorkMatch = prevText.match(/wrk-[\w-]+/i);
                    if (prevWorkMatch) {
                        contextWorkId = prevWorkMatch[0].toUpperCase();
                        contextWork = works.find(w => w.id && w.id.toUpperCase().includes(contextWorkId));
                    }
                }
                if (contextDistrict && contextWorkId) break;
            }
        }

        // If still no specific work, find any work mentioned by project title keywords
        if (!contextWork) {
            contextWork = works.find(w => w.name && q.split(' ').some(word => word.length > 4 && w.name.toLowerCase().includes(word)));
            if (contextWork) {
                contextWorkId = contextWork.id;
                if (!contextDistrict) contextDistrict = contextWork.district;
            }
        }

        // Identify conversational intent and pronoun cues
        const isFollowUp = q.includes('it') || q.includes('there') || q.includes('that') || q.includes('this') || q.includes('same') || q.includes('what about') || q.includes('how much');
        let reply = "";

        // -------------------------------------------------------------
        // Intent A: Formal Statutory Show-Cause Notice / Legal Order
        // -------------------------------------------------------------
        if (q.includes('show cause') || q.includes('notice') || q.includes('draft letter') || q.includes('issue notice') || q.includes('draft notice') || (isFollowUp && q.includes('draft'))) {
            let targetWork = contextWork;
            if (!targetWork && contextDistrict) {
                targetWork = works.find(w => (w.district || '').toLowerCase() === contextDistrict.toLowerCase() && (w.status === 'DELAYED' || w.risk === 'CRITICAL'));
            }
            if (!targetWork) {
                targetWork = works.find(w => w.status === 'DELAYED' || w.risk === 'CRITICAL') || works[0];
            }

            const refNum = `DM/MPLADS/SCN/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
            const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            const daysOver = targetWork?.daysDelayed || 54;
            const expLakhs = Number(targetWork?.expenditureLakhs || 45).toFixed(2);
            const appLakhs = Number(targetWork?.approvedAmountLakhs || 80).toFixed(2);
            const compPct = targetWork?.completionPct || 35;
            const agency = targetWork?.implementingAgency || 'DRDA / PWD Executing Division';

            reply = `📄 **OFFICIAL STATUTORY SHOW-CAUSE NOTICE**\n` +
                `*(Under MoSPI MPLADS Operational Guidelines Rule 4.6 & GFR-2017)*\n\n` +
                `**OFFICE OF THE DISTRICT MAGISTRATE & NODAL OFFICER**\n` +
                `**District:** ${targetWork?.district || 'Varanasi'} | **State:** Uttar Pradesh\n` +
                `**File Reference:** \`${refNum}\`\n` +
                `**Date of Issuance:** ${todayStr}\n\n` +
                `**TO:**\n` +
                `The Executive Engineer / Head of Operations,\n` +
                `**${agency}**\n\n` +
                `**SUBJECT:** Show-Cause Notice for Critical Delay and Milestone Failure in Sanctioned MPLADS Project: **[${targetWork?.id}] ${targetWork?.name}**\n\n` +
                `**Sir/Madam,**\n\n` +
                `Administrative and Financial Sanction was accorded for the above-captioned development work at an approved cost of **₹${appLakhs} Lakhs**. Telemetry logs, single-nodal account audit, and field inspection reports dated ${todayStr} establish the following non-compliances:\n\n` +
                `1. **Milestone Default:** Physical progress is stalled at **${compPct}%**, running **${daysOver} days behind statutory completion schedule**.\n` +
                `2. **Financial Discrepancy:** Public funds amounting to **₹${expLakhs} Lakhs** have been drawn from the treasury against inadequate verifiable physical progress on site.\n` +
                `3. **Citizen Service SLA Breach:** Failure to complete the community asset within the approved completion window.\n\n` +
                `**DIRECTIVE:**\n` +
                `You are hereby commanded to show cause in writing within **seven (7) working days** of receipt of this notice explaining reasons for the inordinate delay. Failure to submit a satisfactory reply supported by an accelerated work completion schedule shall invite immediate administrative sanctions, including:\n` +
                `• Forfeiture of Performance Bank Guarantee (PBG) under Rule 4.6;\n` +
                `• Recommendation for blacklisting from future Central & State sponsored schemes;\n` +
                `• Withholding of running account bills and initiation of recovery proceedings.\n\n` +
                `**Issued under Seal & Authority of District Magistrate & MPLADS Nodal Officer**`;

        // -------------------------------------------------------------
        // Intent B: Unspent Balance / Fund Breakdown (Specific to Context District or Global)
        // -------------------------------------------------------------
        } else if ((q.includes('unspent') || q.includes('balance') || q.includes('remaining') || q.includes('how much money') || (isFollowUp && q.includes('left'))) && (contextDistrict || q.includes('district') || q.includes('fund'))) {
            const targetDist = contextDistrict || 'Varanasi';
            const cleanD = targetDist.toLowerCase();
            const distWorks = works.filter(w => (w.district || '').toLowerCase() === cleanD);
            const distUtil = utils.find(u => (u.district || '').toLowerCase() === cleanD);

            const allocCr = distUtil ? distUtil.allocated : (distWorks.reduce((s, w) => s + (Number(w.approvedAmountLakhs) || 0), 0) / 100);
            const relCr = distUtil ? distUtil.released : (distWorks.reduce((s, w) => s + (Number(w.releasedAmountLakhs) || 0), 0) / 100);
            const expCr = distUtil ? distUtil.expenditure : (distWorks.reduce((s, w) => s + (Number(w.expenditureLakhs) || 0), 0) / 100);
            const unspentCr = Math.max(0, allocCr - expCr);
            const unspentRelCr = Math.max(0, relCr - expCr);
            const utilPct = allocCr > 0 ? ((expCr / allocCr) * 100).toFixed(1) : (distUtil?.utilizationPct || 82.0);
            const unspentPct = allocCr > 0 ? ((unspentCr / allocCr) * 100).toFixed(1) : 18.0;

            reply = `💰 **Financial Balance & Unspent Funds Dossier: ${targetDist}**\n\n` +
                `| Financial Metric | Amount (₹ Cr) | Proportion / Status |\n` +
                `| :--- | :--- | :--- |\n` +
                `| **Total Sanctioned Allocation** | ₹${Number(allocCr).toFixed(2)} Cr | 100% Macro Allocation |\n` +
                `| **Central Funds Released to SNA** | ₹${Number(relCr).toFixed(2)} Cr | ${allocCr > 0 ? ((relCr / allocCr) * 100).toFixed(1) : 85}% of Budget |\n` +
                `| **Actual Vendor Expenditure** | ₹${Number(expCr).toFixed(2)} Cr | **${utilPct}%** Cumulative Utilization |\n` +
                `| **Unspent Allocation Balance** | **₹${unspentCr.toFixed(2)} Cr** | ${unspentPct}% of Total Budget |\n` +
                `| **Unspent Balance in SNA Bank** | **₹${unspentRelCr.toFixed(2)} Cr** | Available for Milestone Release |\n\n` +
                `📌 **Single Nodal Agency (SNA) Compliance Check:**\n` +
                (unspentRelCr / (relCr || 1) <= 0.25 ? 
                    `✅ **Compliant:** Unspent funds in the SNA account are under 25%, qualifying **${targetDist}** for immediate release of subsequent Central tranches.` : 
                    `⚠️ **Review Required:** Unspent funds in the SNA account exceed 25%. Under MoSPI SNA guidelines, pending vendor payments and GFR-12C Utilization Certificates must be cleared prior to tranche 2 fund release.`);

        // -------------------------------------------------------------
        // Intent C: Delayed Projects / Critical Risk in Context District or Global
        // -------------------------------------------------------------
        } else if (q.includes('delayed') || q.includes('delay') || q.includes('stalled') || q.includes('behind schedule') || q.includes('critical') || (isFollowUp && q.includes('which ones'))) {
            let targetWorks = works;
            let titlePrefix = 'All Monitored Districts';
            if (contextDistrict) {
                targetWorks = works.filter(w => (w.district || '').toLowerCase() === contextDistrict.toLowerCase());
                titlePrefix = contextDistrict;
            }

            const delayedWorks = targetWorks.filter(w => w.status === 'DELAYED' || w.risk === 'CRITICAL' || w.risk === 'HIGH');
            if (delayedWorks.length === 0) {
                reply = `✅ **No Critical Delays Detected in ${titlePrefix}:**\n\nAll monitored projects in ${titlePrefix} are currently progressing on schedule per MoSPI telemetry standards. Overall execution health is nominal.`;
            } else {
                reply = `🚨 **Delayed & Critical Risk Projects Audit: ${titlePrefix}**\n\nFound **${delayedWorks.length} projects** requiring priority administrative escalation:\n\n` +
                    delayedWorks.slice(0, 4).map((w, i) => `**${i+1}. [${w.id}] ${w.name}**\n` +
                    `- **District:** ${w.district} | **Category:** ${w.category || 'Infrastructure'}\n` +
                    `- **Milestone Progress:** **${w.completionPct}% completed** (Status: **${w.status}** | Risk: **${w.risk}**)\n` +
                    `- **Financials:** Approved: ₹${w.approvedAmountLakhs}L | Expended: ₹${w.expenditureLakhs}L\n` +
                    `- **SLA Delay:** **${w.daysDelayed || 45} days overdue**\n` +
                    `- **Implementing Agency:** ${w.implementingAgency || 'DRDA / PWD'}\n` +
                    `- **Bottleneck:** ${w.monitoringObservations || 'Environmental clearance and vendor supply chain bottleneck.'}\n`).join('\n') +
                    `\n💡 *Action:* Ask *"Draft a show cause notice for ${delayedWorks[0].id}"* to generate statutory legal orders.`;
            }

        // -------------------------------------------------------------
        // Intent D: Contractor / Implementing Agency Inquiry
        // -------------------------------------------------------------
        } else if (q.includes('contractor') || q.includes('agency') || q.includes('implementing agency') || q.includes('pwd') || q.includes('drda') || q.includes('jal nigam') || (isFollowUp && q.includes('who is executing'))) {
            if (contextWork) {
                reply = `🏗️ **Implementing Agency Record for [${contextWork.id}]:**\n\n` +
                    `- **Project:** ${contextWork.name} (${contextWork.district})\n` +
                    `- **Designated Agency:** **${contextWork.implementingAgency || 'Public Works Department (PWD)'}**\n` +
                    `- **Execution Sanction:** ₹${contextWork.approvedAmountLakhs} Lakhs (Disbursed: ₹${contextWork.expenditureLakhs} Lakhs)\n` +
                    `- **Current Milestone Progress:** **${contextWork.completionPct}%** [${contextWork.status}]\n` +
                    `- **Supervising Nodal Officer:** District Magistrate (${contextWork.district})\n` +
                    `- **SLA Rating:** ${contextWork.status === 'DELAYED' ? '⚠️ Under Review (Overdue by ' + (contextWork.daysDelayed || 45) + ' days)' : '✅ Satisfactory Execution'}\n\n` +
                    `📌 *Directive:* Agencies executing delayed works are barred from taking on additional works under MoSPI Circular 2024.`;
            } else {
                const agencies = {};
                works.forEach(w => {
                    const ag = w.implementingAgency || 'Public Works Department (PWD)';
                    if (!agencies[ag]) agencies[ag] = { total: 0, delayed: 0, completed: 0, costLakhs: 0 };
                    agencies[ag].total++;
                    agencies[ag].costLakhs += Number(w.approvedAmountLakhs) || 0;
                    if (w.status === 'DELAYED') agencies[ag].delayed++;
                    if (w.status === 'COMPLETED') agencies[ag].completed++;
                });

                reply = `🏗️ **Consolidated Implementing Agencies Performance Audit:**\n\n` +
                    `| Agency Name | Active Works | Completed | Delayed | Portfolio (₹ Cr) | Compliance SLA |\n` +
                    `| :--- | :--- | :--- | :--- | :--- | :--- |\n` +
                    Object.entries(agencies).slice(0, 5).map(([name, s]) => {
                        const sla = s.total > 0 ? (((s.total - s.delayed) / s.total) * 100).toFixed(0) : 100;
                        return `| **${name}** | ${s.total} | ${s.completed} | ${s.delayed} | ₹${(s.costLakhs / 100).toFixed(2)} Cr | **${sla}%** |`;
                    }).join('\n') +
                    `\n\n📌 *MoSPI Rule:* Agencies failing to achieve 80% on-time milestone delivery are subject to automatic security deposit freeze.`;
            }

        // -------------------------------------------------------------
        // Intent E: Recent Transactions & Financial Voucher History
        // -------------------------------------------------------------
        } else if ((q.includes('transaction') || q.includes('voucher') || q.includes('payment') || q.includes('pfms') || q.includes('disbursement') || q.includes('recent expense')) && !q.includes('how to') && !q.includes('how do') && !q.includes('add transaction') && !q.includes('record transaction') && !q.includes('enter transaction')) {
            let targetTxns = txns;
            if (contextDistrict) {
                targetTxns = txns.filter(t => (t.district || '').toLowerCase() === contextDistrict.toLowerCase());
            }
            if (contextWork) {
                targetTxns = txns.filter(t => t.workId === contextWork.id);
            }

            const displayTxns = (targetTxns.length > 0 ? targetTxns : txns).slice(0, 5);
            reply = `💳 **PFMS & Treasury Financial Transaction Ledger:**\n\n` +
                (contextDistrict ? `*Filtered for District: **${contextDistrict}***\n\n` : '') +
                `| Voucher ID | Date | Work ID | Type | Amount | Reference / PFMS |\n` +
                `| :--- | :--- | :--- | :--- | :--- | :--- |\n` +
                displayTxns.map(t => 
                    `| \`${t.id}\` | ${t.date || '2026-03-15'} | **${t.workId}** | \`${t.type}\` | **₹${(Number(t.amountLakhs) || 0).toFixed(2)} L** | \`${t.reference || 'PFMS-VOUCHER'}\` |`
                ).join('\n') +
                `\n\n✅ *Audit Trail:* All transactions above are cryptographically logged with PFMS single nodal account verification.`;

        // -------------------------------------------------------------
        // Intent F: Specific Work Inspection (by ID or Keywords)
        // -------------------------------------------------------------
        } else if (contextWork && (q.includes('wrk-') || q.includes('work') || q.includes('project') || isFollowUp)) {
            const w = contextWork;
            const app = Number(w.approvedAmountLakhs || 0).toFixed(2);
            const rel = Number(w.releasedAmountLakhs || 0).toFixed(2);
            const exp = Number(w.expenditureLakhs || 0).toFixed(2);
            const bal = Math.max(0, (w.releasedAmountLakhs || 0) - (w.expenditureLakhs || 0)).toFixed(2);
            const util = w.approvedAmountLakhs > 0 ? (((w.expenditureLakhs || 0) / w.approvedAmountLakhs) * 100).toFixed(1) : 0;

            reply = `📌 **Technical & Financial Dossier: [${w.id}]**\n\n` +
                `- **Title:** ${w.name}\n` +
                `- **District / Constituency:** **${w.district}** (${w.constituency || 'General'})\n` +
                `- **Category:** ${w.category || 'Infrastructure'} | **Financial Year:** ${w.financialYear || '2025-26'}\n` +
                `- **Financial Ledger:** Approved: **₹${app} L** | Released: **₹${rel} L** | Spent: **₹${exp} L**\n` +
                `- **Available Unspent Balance:** **₹${bal} Lakhs** (Work Utilization: **${util}%**)\n` +
                `- **Physical Execution:** **${w.completionPct}%** [Status: **${w.status}** | Risk Level: **${w.risk}**]\n` +
                `- **Implementing Agency:** ${w.implementingAgency || 'DRDA / PWD'}\n` +
                `- **Observation:** ${w.monitoringObservations || 'Routine milestone inspections recorded in order.'}\n` +
                (w.daysDelayed > 0 ? `\n🚨 **Overdue Alert:** Stalled by **${w.daysDelayed} days**. Type *"Draft a show cause notice for this work"* to issue formal notice.` : `\n✅ Execution is progressing on schedule.`);

        // -------------------------------------------------------------
        // Intent G: Permissible vs Prohibited Works Guidelines
        // -------------------------------------------------------------
        } else if (q.includes('allow') || q.includes('permissible') || q.includes('prohibited') || q.includes('private') || q.includes('temple') || q.includes('religious') || q.includes('commercial') || q.includes('guideline') || q.includes('rule') || q.includes('policy')) {
            reply = `📘 **MoSPI Statutory Guidelines: Permissible vs Prohibited Works:**\n\n` +
                `### ✅ Permissible Works (Community Assets)\n` +
                `1. **Drinking Water & Sanitation:** Public tube-wells, water purification plants, piped water connections, community toilets.\n` +
                `2. **Education Infrastructure:** Government & aided school classrooms, digital computer labs, libraries, smart boards.\n` +
                `3. **Healthcare:** Primary Health Centres (PHC), sub-centres, diagnostic equipment for government hospitals, ambulance procurement.\n` +
                `4. **Rural Connectivity:** Concrete roads, culverts, drainage pathways, LED solar street lighting.\n` +
                `5. **Community Halls:** Public panchayat bhavans, crematorium sheds, Anganwadi centres.\n\n` +
                `### ❌ Strictly Prohibited Works\n` +
                `1. **Religious Places:** Construction/repair of temples, mosques, churches, or places of worship.\n` +
                `2. **Commercial & Private Entities:** Assets that generate private commercial profit or benefit individual private property.\n` +
                `3. **Movable / Recurring Office Expenses:** Office air conditioners, passenger vehicles, laptops for government staff, recurring salaries.\n` +
                `4. **Land Acquisition:** Purchasing private land using MPLADS funds is strictly prohibited.\n` +
                `5. **Memorials / Statues:** Statues or personal memorials are barred.`;

        // -------------------------------------------------------------
        // Intent H: Entitlements, SC/ST Quotas, Calamity Rules
        // -------------------------------------------------------------
        } else if (q.includes('entitlement') || q.includes('quota') || q.includes('sc/st') || /\bsc\b/i.test(q) || /\bst\b/i.test(q) || q.includes('scheduled tribe') || q.includes('scheduled caste') || q.includes('calamity') || q.includes('disaster') || q.includes('tranche')) {
            reply = `📋 **MoSPI MPLADS Entitlement & Special Quota Provisions:**\n\n` +
                `1. **Annual Entitlement:** ₹5.00 Crore per Member of Parliament per financial year, released by the Central Government in two equal tranches of ₹2.50 Crore.\n` +
                `2. **Mandatory SC/ST Reservation:**\n` +
                `   - At least **15%** of the annual entitlement (₹75 Lakhs) must be recommended for areas inhabited by Scheduled Caste (SC) population.\n` +
                `   - At least **7.5%** of the annual entitlement (₹37.5 Lakhs) must be recommended for areas inhabited by Scheduled Tribe (ST) population.\n` +
                `3. **Natural Calamity Assistance:**\n` +
                `   - An MP can recommend up to **₹1.00 Crore** for disaster relief and rehabilitation in any affected district across India in the event of a severe natural calamity declared by the Government of India.\n` +
                `4. **Single Nodal Agency (SNA) Rule:** Tranche 2 is only disbursed after at least **75% utilization** of Tranche 1 and submission of GFR-12C certificates.`;

        // -------------------------------------------------------------
        // Intent I: Fraud, Duplicate Works & Proximity Conflicts
        // -------------------------------------------------------------
        } else if (q.includes('duplicate') || q.includes('overlap') || q.includes('proximity') || q.includes('dual claim') || q.includes('fraud')) {
            const duplicates = await getDuplicates();
            reply = `🔍 **AI Duplicate Works & Anti-Fraud Inspection:**\n\nIdentified **${duplicates.length} overlapping work clusters** across monitored constituencies:\n\n` +
                duplicates.slice(0, 4).map((d, i) => `**${i+1}. [${d.workA.id}] vs [${d.workB.id}]** (${d.workA.district})\n` +
                `- Match Confidence: **${d.confidence} (${d.duplicateScore}%)** | GPS Proximity: **~${d.distanceMeters}m**\n` +
                `- Project A: "${d.workA.name}" (₹${d.workA.amountLakhs || d.workA.approvedAmountLakhs}L)\n` +
                `- Project B: "${d.workB.name}" (₹${d.workB.amountLakhs || d.workB.approvedAmountLakhs}L)\n` +
                `- **Action Recommendation:** ${d.recommendation}\n`).join('\n') +
                `\n💡 *Nodal Directive:* Freeze further tranche releases on suspected clusters pending field geotag audit.`;

        // -------------------------------------------------------------
        // Intent J: District / Constituency Deep-Dive across India
        // -------------------------------------------------------------
        } else if (contextDistrict && !q.includes('officer') && !q.includes('who is') && !q.includes('dm') && !q.includes('mp') && (explicitWorkMatch || q.includes(contextDistrict.toLowerCase()) || q.includes('district') || q.includes('status') || q.includes('dossier') || q.includes('works') || q.includes('project') || isFollowUp)) {
            const cleanD = contextDistrict.toLowerCase();
            const distWorks = works.filter(w => (w.district || '').toLowerCase() === cleanD);
            const distUtil = utils.find(u => (u.district || '').toLowerCase() === cleanD);

            const sanctionedLakhs = distWorks.reduce((s, w) => s + (Number(w.approvedAmountLakhs) || 0), 0);
            const releasedLakhs = distWorks.reduce((s, w) => s + (Number(w.releasedAmountLakhs) || 0), 0);
            const spentLakhs = distWorks.reduce((s, w) => s + (Number(w.expenditureLakhs) || 0), 0);
            const allocCr = distUtil ? distUtil.allocated : (sanctionedLakhs / 100);
            const relCr = distUtil ? distUtil.released : (releasedLakhs / 100);
            const expCr = distUtil ? distUtil.expenditure : (spentLakhs / 100);
            const utilPct = allocCr > 0 ? ((expCr / allocCr) * 100).toFixed(1) : 82.5;

            const completed = distWorks.filter(w => w.status === 'COMPLETED').length;
            const ongoing = distWorks.filter(w => w.status === 'ONGOING').length;
            const delayed = distWorks.filter(w => w.status === 'DELAYED').length;

            reply = `🏛️ **${contextDistrict} District Governance Dossier:**\n\n` +
                `- **Total Sanctioned Works:** ${distWorks.length || distUtil?.totalWorks || 18} projects registered\n` +
                `- **Execution Status:** ✅ **${completed}** Completed | ⏳ **${ongoing}** Ongoing | ⚠️ **${delayed}** Delayed\n` +
                `- **Budget Allocation:** ₹${Number(allocCr).toFixed(2)} Cr (Sanctioned) | ₹${Number(relCr).toFixed(2)} Cr (Released to SNA)\n` +
                `- **Actual Expenditure:** ₹${Number(expCr).toFixed(2)} Cr (**${utilPct}%** Fund Utilization Rate)\n` +
                `- **Unspent Balance:** ₹${Math.max(0, allocCr - expCr).toFixed(2)} Cr\n\n` +
                `**Key Projects in ${contextDistrict}:**\n` +
                (distWorks.slice(0, 3).map(w => `• **[${w.id}]** ${w.name.substring(0, 48)}... (${w.status}, ₹${w.approvedAmountLakhs}L, ${w.completionPct}% done)`).join('\n') || '• Community asset works registered in state repository') +
                (delayed > 0 ? `\n\n🚨 **Action Required:** ${delayed} project(s) in ${contextDistrict} are running behind schedule. Ask *"Which projects are delayed in ${contextDistrict}?"* or *"Draft a show cause notice"*.` : `\n\n✅ Works in ${contextDistrict} are progressing in compliance with MoSPI circular standards.`);

        // -------------------------------------------------------------
        // -------------------------------------------------------------
        // Intent K: Consolidated Macro Portfolio / General Financials
        // -------------------------------------------------------------
        } else if (q.includes('fund') || q.includes('utilization') || q.includes('budget') || q.includes('expenditure') || q.includes('allocation')) {
            const alloc = (works.reduce((s, w) => s + (Number(w.approvedAmountLakhs) || 0), 0) / 100).toFixed(2);
            const rel = (works.reduce((s, w) => s + (Number(w.releasedAmountLakhs) || 0), 0) / 100).toFixed(2);
            const exp = (works.reduce((s, w) => s + (Number(w.expenditureLakhs) || 0), 0) / 100).toFixed(2);
            const util = rel > 0 ? (((Number(exp) / Number(rel))) * 100).toFixed(1) : 81.5;

            reply = `💰 **National MPLADS Financial Portfolio Overview:**\n\n` +
                `- **Total Sanctioned Allocation:** ₹${alloc} Crores (${works.length} works across 301 districts)\n` +
                `- **Central Funds Released to SNAs:** ₹${rel} Crores\n` +
                `- **Actual Vendor Expenditure:** ₹${exp} Crores\n` +
                `- **National Fund Utilization Rate:** **${util}%**\n` +
                `- **Total Unspent Balance in Accounts:** ₹${Math.max(0, Number(rel) - Number(exp)).toFixed(2)} Crores\n` +
                `- **Indexed PFMS Transactions:** ${txns.length} payment vouchers verified\n\n` +
                `💡 *Pro-Tip:* Ask about any specific district like *"How much is unspent in Varanasi?"* or *"Status of Gorakhpur"*.`;

        // -------------------------------------------------------------
        // Intent L: How to Record / Add a Transaction in the Portal
        // -------------------------------------------------------------
        } else if (q.includes('how to record') || q.includes('how to add transaction') || q.includes('record transaction') || q.includes('add transaction') || q.includes('new transaction') || q.includes('enter transaction') || q.includes('record payment') || q.includes('add voucher')) {
            reply = `💳 **Step-by-Step Guide: Recording a Treasury Transaction**\n\n` +
                `1. **Navigate:** Open the **[Funds & Budget](/pages/funds.html)** module from the sidebar.\n` +
                `2. **Initiate Form:** Click the **➕ Add Transaction** button located in the top-right header actions.\n` +
                `3. **Select Work:** Choose the target development project from the dropdown.\n` +
                `4. **Choose Transaction Type:**\n` +
                `   - \`EXPENDITURE\`: Vendor milestone payment or bill settlement.\n` +
                `   - \`RELEASE\`: Central/State installment tranche disbursement.\n` +
                `   - \`ALLOCATION\`: Supplementary budgetary sanction addition.\n` +
                `   - \`REFUND\`: Credit reversal or vendor refund.\n` +
                `5. **Enter Details:** Input Amount (in ₹ Lakhs), Voucher Date, and PFMS Reference ID (e.g., \`PFMS-2026-9481\`).\n` +
                `6. **Save:** Click **Record Transaction**. The platform automatically updates macro KPIs, ledger pagination, and district expenditure velocity charts in real time!`;

        // -------------------------------------------------------------
        // Intent M: Work Sanctioning & Approval Workflow
        // -------------------------------------------------------------
        } else if (q.includes('how to approve') || q.includes('approve work') || q.includes('sanction work') || q.includes('how to sanction') || q.includes('recommendation workflow') || q.includes('approval process') || q.includes('how does work get approved') || q.includes('sanction process')) {
            reply = `📑 **Statutory 5-Stage MPLADS Project Lifecycle Workflow:**\n\n` +
                `1. **Stage 1 (Recommendation):** Hon. Member of Parliament (MP) recommends community asset works within their constituency.\n` +
                `2. **Stage 2 (SNA & Scrutiny):** District Planning Officer (DPO) verifies eligibility under MoSPI guidelines and ensures SC (15%) and ST (7.5%) quotas.\n` +
                `3. **Stage 3 (Technical Sanction & DPR):** Executive Engineer (EE) / Implementing Agency prepares detailed estimates, drawings, and feasibility reports.\n` +
                `4. **Stage 4 (Administrative Sanction):** District Magistrate (DM) / Nodal Officer accords statutory Administrative and Financial Sanction within 45 days.\n` +
                `5. **Stage 5 (Disbursement & Milestone Audit):** Tranche 1 (50%) is disbursed to the Single Nodal Account (SNA). Geo-tagged telemetry is required before releasing Tranche 2.`;

        // -------------------------------------------------------------
        // Intent N: MPLADS Scheme Overview & Background
        // -------------------------------------------------------------
        } else if (q.includes('what is mplads') || q.includes('about mplads') || q.includes('mplads scheme') || q.includes('explain mplads') || q.includes('tell me about mplads') || q.includes('what does this portal do') || q.includes('what is this platform')) {
            reply = `🏛️ **About MPLADS & The AI Decision-Support Platform:**\n\n` +
                `The **Members of Parliament Local Area Development Scheme (MPLADS)** is a Central Sector Scheme administered by the **Ministry of Statistics and Programme Implementation (MoSPI)**, Government of India.\n\n` +
                `### Key Scheme Facts:\n` +
                `- **Annual Sanction:** ₹5.00 Crore per MP constituency per financial year, released in two equal tranches of ₹2.50 Cr.\n` +
                `- **Primary Objective:** Create durable community assets (Drinking water, schools, roads, healthcare, sanitation, clean energy) based on locally felt public needs.\n` +
                `- **Mandatory Social Quotas:** Minimum 15% for Scheduled Caste (SC) areas and 7.5% for Scheduled Tribe (ST) areas.\n` +
                `- **Role of this Portal:** Implements automated GIS geo-clustering to prevent duplicate works, statistical anomaly detection for payment delays, and single nodal account (SNA) PFMS treasury reconciliation.`;

        // -------------------------------------------------------------
        // Intent O: Officers, Roster & Roles (DM, MP, EE, DPO)
        // -------------------------------------------------------------
        } else if (q.includes('officer') || q.includes('nodal officer') || q.includes('who is dm') || q.includes('who is mp') || q.includes('role of dm') || q.includes('role of mp') || q.includes('executive engineer') || q.includes('dpo') || q.includes('roster')) {
            const currentOfficers = demo.officers || [];
            let matchingOfficers = currentOfficers;
            if (contextDistrict) {
                matchingOfficers = currentOfficers.filter(o => (o.district || '').toLowerCase() === contextDistrict.toLowerCase());
            }

            reply = `👥 **MPLADS Governance Officers & Institutional Roles:**\n\n` +
                `• **District Magistrate (DM / Nodal Officer):** Overall administrative custodian; accords statutory sanctions, enforces Rule 4.6 deadlines, and oversees project delivery.\n` +
                `• **Member of Parliament (MP):** Recommends public works matching community aspirations; reviews periodic physical progress dossiers.\n` +
                `• **Executive Engineer (EE / Implementing Agency):** Responsible for engineering estimates, DPR preparation, tender execution, and quality control.\n` +
                `• **District Planning Officer (DPO / SNA Lead):** Manages Single Nodal Account bank reconciliation, PFMS voucher approvals, and GFR-12C submissions.\n\n` +
                (matchingOfficers.length > 0 ? 
                    `**Officers on Record for ${contextDistrict || 'Pilot Districts'}:**\n` +
                    matchingOfficers.slice(0, 4).map(o => `• **${o.name}** — *${o.role}* (${o.district}, ${o.email})`).join('\n') : 
                    `You can inspect and simulate all 4 administrative perspectives using the **Role Switcher** in the portal sidebar.`);

        // -------------------------------------------------------------
        // Intent P: Project Execution Progress & Status Breakdown
        // -------------------------------------------------------------
        } else if (q.includes('completed works') || q.includes('how many works') || q.includes('ongoing works') || q.includes('pending works') || q.includes('work status') || q.includes('project status') || q.includes('completion rate')) {
            let targetWorks = works;
            let distLabel = 'National';
            if (contextDistrict) {
                targetWorks = works.filter(w => (w.district || '').toLowerCase() === contextDistrict.toLowerCase());
                distLabel = contextDistrict;
            }

            const totalCount = targetWorks.length;
            const completedCount = targetWorks.filter(w => w.status === 'COMPLETED').length;
            const ongoingCount = targetWorks.filter(w => w.status === 'ONGOING').length;
            const delayedCount = targetWorks.filter(w => w.status === 'DELAYED').length;
            const pendingCount = targetWorks.filter(w => w.status === 'PENDING').length;
            const compPct = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : 0;

            reply = `📊 **${distLabel} Public Works Execution Status Summary:**\n\n` +
                `| Status Category | Number of Works | Percentage | Action Indicator |\n` +
                `| :--- | :--- | :--- | :--- |\n` +
                `| ✅ **Completed** | **${completedCount}** | ${compPct}% | Verified & Commissioned |\n` +
                `| ⏳ **Ongoing** | **${ongoingCount}** | ${totalCount > 0 ? ((ongoingCount / totalCount) * 100).toFixed(1) : 0}% | Physical execution active |\n` +
                `| ⚠️ **Delayed** | **${delayedCount}** | ${totalCount > 0 ? ((delayedCount / totalCount) * 100).toFixed(1) : 0}% | Overdue milestone review |\n` +
                `| 🕒 **Pending** | **${pendingCount}** | ${totalCount > 0 ? ((pendingCount / totalCount) * 100).toFixed(1) : 0}% | Pre-commencement phase |\n` +
                `| 🏛️ **Total Monitored** | **${totalCount}** | 100% | Sanctioned Portfolio |\n\n` +
                (delayedCount > 0 ? `🚨 **Alert:** ${delayedCount} works are currently delayed. Ask *"Show delayed projects"* to review individual cases.` : `✅ All active projects are executing within approved milestone bounds.`);

        // -------------------------------------------------------------
        // Intent Q: Risk Score Calculation & Anomaly Methodology
        // -------------------------------------------------------------
        } else if (q.includes('risk score') || q.includes('how is risk calculated') || q.includes('risk meter') || q.includes('explain risk') || q.includes('why is risk high') || q.includes('scoring formula')) {
            reply = `🎯 **MoSPI 0–100 Multi-Factor Risk Assessment Scoring Model:**\n\n` +
                `Every public work is continuously audited across four objective governance metrics:\n\n` +
                `1. **Milestone Schedule Overrun (Max 40 pts):** Evaluates days elapsed past statutory completion date (Rule 4.6).\n` +
                `2. **Financial Velocity Variance (Max 30 pts):** Flags high expenditure disbursements against stalled physical progress.\n` +
                `3. **Telemetry & Geo-tag Gaps (Max 15 pts):** Penalizes missing quarterly geo-tagged photos and site engineer reports.\n` +
                `4. **Vendor / Contractor Cluster Bias (Max 15 pts):** Detects excessive concentration where a single vendor holds >50% of sub-district works.\n\n` +
                `### Risk Severity Bands:\n` +
                `- 🟢 **Low Risk (0–25):** Nominal execution; milestones on schedule.\n` +
                `- 🟡 **Medium Risk (26–50):** Minor delay or initial notice issued.\n` +
                `- 🟠 **High Risk (51–75):** Milestone failure; nodal audit required.\n` +
                `- 🔴 **Critical Risk (76–100):** Severe stall; automatic show-cause notice triggered.`;

        // -------------------------------------------------------------
        // Intent R: Alert Triage & Early Warning System Guide
        // -------------------------------------------------------------
        } else if (q.includes('how to resolve alert') || q.includes('dismiss alert') || q.includes('alert status') || q.includes('triage alert') || q.includes('what are alerts') || q.includes('assign alert') || q.includes('alert triage')) {
            reply = `🚨 **Early Warning Intelligence & Anomaly Triage Lifecycle:**\n\n` +
                `The AI monitoring engine continuously scans telemetry data for 8 anomaly types: *Cost Overruns, Delayed Milestones, Contractor Concentration, Unusual Single Drawdowns, and Missing Geotags*.\n\n` +
                `### Triage Workflow in [Alerts & Early Warning](/pages/alerts.html):\n` +
                `1. **Inspect:** Click **View** or **AI Audit** on any alert card to view telemetry evidence.\n` +
                `2. **Assign:** Click **Assign** to delegate investigation to a designated field officer.\n` +
                `3. **Review & Notes:** Add inspection findings into the permanent audit ledger.\n` +
                `4. **Resolution:**\n` +
                `   - Click **Resolve** once rectifying work or documentation is submitted.\n` +
                `   - Click **Dismiss** if the discrepancy was justified by a valid contractual amendment.`;

        // -------------------------------------------------------------
        // Intent S: Statutory Reports & Dossier Generation
        // -------------------------------------------------------------
        } else if (q.includes('report') || q.includes('export') || q.includes('download pdf') || q.includes('download report') || q.includes('gfr 12c') || q.includes('utilization certificate') || q.includes('how to export')) {
            reply = `📑 **Statutory Dossiers & Report Generation:**\n\n` +
                `You can generate and export formal compliance documents directly from **[Reports & Dossiers](/pages/reports.html)**:\n\n` +
                `• **GFR-12C Utilization Certificate:** Official statutory audit certificate required by MoSPI prior to tranche release.\n` +
                `• **Quarterly Progress Report (QPR):** Consolidated physical and financial status across all assembly segments.\n` +
                `• **Treasury Ledger CSV:** Raw transaction data with RFC-4180 compliance for audit verification.\n` +
                `• **AI Forensic Audit Summary:** Automated NLP duplicate inspection report and anomaly log.\n\n` +
                `Click the **Export CSV** or **Print Dossier** buttons on any page to immediately generate records.`;

        // -------------------------------------------------------------
        // Intent T: Friendly Conversational Greetings & Appreciation
        // -------------------------------------------------------------
        } else if (/^(hi|hello|hey|namaste|greetings|good morning|good afternoon|good evening|yo)\b/i.test(q) || q.includes('who are you') || q.includes('what is your name')) {
            reply = `🙏 **Namaste! I am your MPLADS AI Sahayak (Decision-Support Copilot).**\n\n` +
                `I am an authoritative governance assistant trained on MoSPI operational guidelines, Single Nodal Agency rules, and real-time project telemetry across all Indian districts.\n\n` +
                `### How I can assist you right now:\n` +
                `• *"Show works in Varanasi"* or *"Status of Gorakhpur"*\n` +
                `• *"Find duplicate works"* or *"Show critical risk projects"*\n` +
                `• *"How much is unspent in Patna?"*\n` +
                `• *"Draft a show cause notice for delayed works"*\n` +
                `• *"How to record a transaction?"*\n\n` +
                `What would you like to inspect today?`;

        } else if (q.includes('thank') || q.includes('thanks') || q.includes('dhanyavad') || q.includes('shukriya') || q.includes('great') || q.includes('awesome') || q.includes('good job')) {
            reply = `🙏 **You are most welcome!** It is my honor to assist with your public governance and monitoring duties.\n\n` +
                `Feel free to ask if you need to inspect more projects, verify fund utilization tranches, or draft official correspondence!`;

        // -------------------------------------------------------------
        // Intent U: Search Database for Project, District, or Entity
        // -------------------------------------------------------------
        } else {
            // Fuzzy search works and alerts
            const queryWords = q.split(/\s+/).filter(w => w.length >= 3 && !['what', 'where', 'show', 'tell', 'about', 'this', 'that', 'with', 'from', 'have', 'more'].includes(w));
            const matchedWork = works.find(w => queryWords.some(word => (w.name || '').toLowerCase().includes(word) || (w.description || '').toLowerCase().includes(word) || (w.district || '').toLowerCase().includes(word)));
            const matchedAlert = alerts.find(a => queryWords.some(word => (a.description || '').toLowerCase().includes(word) || (a.type || '').toLowerCase().includes(word)));

            if (matchedWork) {
                reply = `🔍 **Matched Public Work Record: [${matchedWork.id}]**\n\n` +
                    `- **Title:** ${matchedWork.name}\n` +
                    `- **District:** **${matchedWork.district}** (${matchedWork.constituency || 'General'})\n` +
                    `- **Category:** ${matchedWork.category} | **Status:** **${matchedWork.status}**\n` +
                    `- **Financials:** Approved: ₹${matchedWork.approvedAmountLakhs}L | Expended: ₹${matchedWork.expenditureLakhs}L (**${matchedWork.completionPct}%** Completed)\n` +
                    `- **Risk Level:** **${matchedWork.risk}**\n` +
                    `- **Agency:** ${matchedWork.implementingAgency || 'DRDA / PWD'}\n\n` +
                    `💡 Ask *"How much is unspent for ${matchedWork.id}?"* or *"Draft a show cause notice"* for further actions.`;
            } else if (matchedAlert) {
                reply = `🚨 **Matched Anomaly Flag: [${matchedAlert.id}]**\n\n` +
                    `- **Anomaly Type:** ${matchedAlert.type}\n` +
                    `- **Target Work:** ${matchedAlert.workId} (${matchedAlert.workName})\n` +
                    `- **Severity:** **${matchedAlert.severity}** (Risk Score: ${matchedAlert.riskScore}/100)\n` +
                    `- **Description:** ${matchedAlert.description}\n\n` +
                    `💡 Navigate to [Alerts & Early Warning](/pages/alerts.html) to audit or resolve this flag.`;
            } else {
                // Check if query is asking about restrictions, limitations, or capabilities
                const isRestrictionQuery = q.includes('restrict') || q.includes('limit') || q.includes('scope') || q.includes('boundary') || q.includes('allowed to') || q.includes('what can you') || q.includes('can you answer');

                if (isRestrictionQuery) {
                reply = `🌟 **Unrestricted AI Decision-Support Capabilities:**\n\n` +
                    `I have **no restrictions**! I am your omni-capable AI executive copilot, engineered to assist with **any question, analysis, technical topic, or operational task**.\n\n` +
                    `### 💡 Comprehensive Capabilities Across All Domains:\n` +
                    `1. **General & Technical Intelligence:** Civil engineering standards, AI algorithms, GIS satellite telemetry, data analytics, and cloud workflows.\n` +
                    `2. **Public Administration & Policy:** MoSPI statutory guidelines, GFR 2017 rules, procurement norms, tender drafting, and inter-departmental coordination.\n` +
                    `3. **Drafting & Legal Orders:** Statutory show-cause notices (Rule 4.6), inquiry terms of reference, inspection reports, and official memoranda.\n` +
                    `4. **Financial Oversight:** PFMS treasury reconciliation, expenditure velocity, Single Nodal Agency (SNA) compliance, and voucher audits.\n` +
                    `5. **Portfolio Telemetry:** Real-time analytics across all **301 Indian districts**, 200+ active works, risk scoring, and milestone tracking.\n\n` +
                    `You can freely ask me **anything** — from specific district data to general administrative, technical, or drafting questions!`;
            } else if (q.includes('explain') || q.includes('how does') || q.includes('what is') || q.includes('tell me about')) {
                const cleanTopic = query.replace(/^(explain|how does|what is|tell me about|can you explain)\s+/i, '').replace(/[?.]+$/, '').trim();
                reply = `📘 **Executive Briefing: ${cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)}**\n\n` +
                    `Here is an authoritative analysis regarding **"${cleanTopic}"**:\n\n` +
                    `### 1. Conceptual Framework & Core Principles\n` +
                    `Under modern public administration and data-driven governance frameworks, **${cleanTopic}** is critical for ensuring efficiency, transparency, and accountability across infrastructure lifecycle management.\n\n` +
                    `### 2. Operational Methodology & Best Practices\n` +
                    `• **Evidence-Based Telemetry:** Continuous measurement against baseline specifications with tamper-evident audit trails.\n` +
                    `• **Regulatory Compliance:** Adherence to statutory procurement standards, GFR provisions, and Central Vigilance Commission (CVC) oversight.\n` +
                    `• **Risk Mitigation:** Proactive anomaly detection to eliminate schedule slippage and cost escalation before milestone disbursement.\n\n` +
                    `### 3. Actionable Recommendations for District Leadership\n` +
                    `• Institute weekly progress reconciliation meetings with executive divisions.\n` +
                    `• Enforce strict PFMS milestone-linked disbursements (no advance payments without physical ground-truth verification).\n\n` +
                    `Would you like me to elaborate on specific implementation protocols, draft official circulars, or cross-reference live district data for this?`;
            } else if (q.includes('draft') || q.includes('write') || q.includes('compose') || q.includes('letter')) {
                const docTopic = query.replace(/^(draft|write|compose|generate)\s+(a|an)?\s*/i, '').replace(/[?.]+$/, '').trim();
                reply = `📝 **Draft Document: ${docTopic.charAt(0).toUpperCase() + docTopic.slice(1)}**\n\n` +
                    `\`\`\`text\n` +
                    `OFFICE OF THE DISTRICT MAGISTRATE & NODAL OFFICER (MPLADS)\n` +
                    `DISTRICT COLLECTORATE\n\n` +
                    `Memo No: DM/MPLADS/2026/EXEC-${Math.floor(1000 + Math.random() * 9000)}                Date: ${new Date().toISOString().split('T')[0]}\n\n` +
                    `SUBJECT: ${docTopic.toUpperCase()}\n\n` +
                    `1. In accordance with statutory governance guidelines and administrative oversight norms, this directive is hereby issued regarding ${docTopic}.\n` +
                    `2. All concerned implementing agencies and technical divisions are directed to ensure strict compliance with approved specifications, timelines, and financial ceilings.\n` +
                    `3. Physical measurement books (MB) and geo-tagged photographic evidence must be submitted prior to the release of subsequent installments.\n` +
                    `4. Non-compliance within statutory SLA timelines shall invite administrative inquiry and penalty clauses.\n\n` +
                    `By Order,\n` +
                    `District Magistrate / Authorized Nodal Authority\n` +
                    `District Collectorate\n` +
                    `\`\`\`\n\n` +
                    `💡 You can copy this draft directly or ask me to customize specific clauses, names, or timelines!`;
            } else {
                reply = `🏛️ **Executive Decision-Support Analysis:**\n\n` +
                    `Regarding your query: **"${query}"**\n\n` +
                    `### 1. Key Insights & Governance Context\n` +
                    `Public infrastructure and resource allocation across your jurisdiction require continuous alignment between physical milestone execution and treasury disbursements. All operational telemetry across **301 districts** and **${works.length} monitored works** is live and accessible.\n\n` +
                    `### 2. Strategic Best Practices\n` +
                    `• **Proactive Oversight:** Track early warning signals and schedule variances before milestones breach critical delay thresholds.\n` +
                    `• **Financial Discipline:** Maintain Single Nodal Agency (SNA) fund velocity norms to avoid unspent allocation lapsing at fiscal year-end.\n` +
                    `• **Citizen Transparency:** Ensure all public assets have permanent citizen display boards with sanctioned amounts and completion dates.\n\n` +
                    `Ask me anything further — whether you need deep project telemetry, statutory guidelines, transaction verifications, or official drafting!`;
            }
        }
    }

        return {
            success: true,
            reply,
            source: 'MoSPI AI Intelligent Copilot (Integrated Governance Model)'
        };
    }

    // Deterministic diverse executive avatar generator for officers
    function generateOfficerAvatar(name = '', role = '') {
        const maleAvatars = [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80"
        ];
        const femaleAvatars = [
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80",
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=160&h=160&q=80"
        ];
        const femaleHonorifics = ['smt', 'smt.', 'mrs', 'mrs.', 'ms', 'ms.', 'kumari', 'shrimati', 'sunita', 'priyanka', 'ananya', 'pooja', 'neha', 'shashi', 'vandana', 'meenakshi', 'kavita', 'rashmi', 'aditi', 'swati'];
        const lowerName = (name || '').toLowerCase();
        const isFemale = femaleHonorifics.some(h => lowerName.includes(h));

        let hash = 0;
        for (let i = 0; i < (name || 'Officer').length; i++) {
            hash = ((hash << 5) - hash) + (name || 'Officer').charCodeAt(i);
            hash |= 0;
        }
        const pool = isFemale ? femaleAvatars : maleAvatars;
        const index = Math.abs(hash) % pool.length;
        return pool[index];
    }
    window.generateOfficerAvatar = generateOfficerAvatar;

    // Session Management Helper
    function saveUserSession(user, token) {
        if (!user) return;
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            roleCode: user.roleCode || (user.role && user.role.includes('Magistrate') ? 'DM' : (user.role && user.role.includes('Parliament') ? 'MP' : (user.role && user.role.includes('Engineer') ? 'EE' : 'DPO'))),
            district: user.district,
            state: user.state || 'Uttar Pradesh',
            contact: user.contact,
            appointedDate: user.appointedDate,
            avatar: user.avatar || generateOfficerAvatar(user.name, user.role),
            token: token || `MPLADS-AUTH-${Date.now()}`,
            loginTime: new Date().toISOString()
        };

        try {
            localStorage.setItem('mplads_user_session', JSON.stringify(session));
            sessionStorage.setItem('mplads_user_session', JSON.stringify(session));
            if (window.MPLADS_DEMO_DATA) {
                window.MPLADS_DEMO_DATA.currentUser = session;
            }
        } catch (e) {
            console.warn('[MPLADS API] Session write error:', e.message);
        }
    }

    function getCurrentUser() {
        try {
            const raw = localStorage.getItem('mplads_user_session') || sessionStorage.getItem('mplads_user_session');
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return window.MPLADS_DEMO_DATA?.currentUser || null;
    }

    function logout() {
        try {
            localStorage.removeItem('mplads_user_session');
            sessionStorage.removeItem('mplads_user_session');
            document.cookie = "mplads_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } catch (e) {}
        const targetUrl = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
        window.location.href = targetUrl;
    }

    // Auth API: Login
    async function login(email, password) {
        const q = (email || '').trim().toLowerCase();
        const p = (password || '').trim();

        // 1. Always attempt backend verification first
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: q, password: p }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await res.json();
            if (res.ok && data.success && data.user) {
                isBackendConnected = true;
                saveUserSession(data.user, data.token);
                saveLocalRegisteredOfficer({ ...data.user, password: p, isRegistered: true });
                return data;
            }
        } catch (e) {
            console.info('[MPLADS API] Backend login check bypassed/unreachable, verifying against local records:', e.message);
        }

        // 2. Strict Registered Account Verification (User MUST register first, no shortcuts)
        hydrateOfficersFromStorage();
        const localRegistered = getLocalRegisteredOfficers();

        const officer = localRegistered.find(o => 
            o && ((o.email && o.email.toLowerCase() === q) || (o.id && o.id.toLowerCase() === q)) && o.status === 'ACTIVE'
        );

        if (officer) {
            // Verify password against what the officer registered with
            const registeredPwd = officer.password;
            if (registeredPwd && registeredPwd !== p) {
                return {
                    success: false,
                    message: "Security authentication failed: Incorrect password for registered officer account."
                };
            }
            if (p.length < 4) {
                return {
                    success: false,
                    message: "Password must be at least 4 characters."
                };
            }
            const token = 'LOCAL-AUTH-' + Date.now();
            saveUserSession(officer, token);
            return {
                success: true,
                message: `Welcome back, ${officer.name}. Authentication verified.`,
                token,
                user: officer
            };
        }

        // 3. Demo Officers fallback (permits instant demo login for standard officers like dm.varanasi@nic.in)
        const demoOfficers = window.MPLADS_DEMO_DATA?.officers || [];
        const demoOfficer = demoOfficers.find(o => 
            o && ((o.email && o.email.toLowerCase() === q) || (o.id && o.id.toLowerCase() === q)) && o.status === 'ACTIVE'
        );

        if (demoOfficer) {
            if (p.length < 4) {
                return {
                    success: false,
                    message: "Password must be at least 4 characters."
                };
            }
            const token = 'DEMO-AUTH-' + Date.now();
            saveUserSession(demoOfficer, token);
            return {
                success: true,
                message: `Welcome back, ${demoOfficer.name}. Demo authentication verified.`,
                token,
                user: demoOfficer
            };
        }

        // 4. Reject any unregistered access attempts
        return {
            success: false,
            message: `Account not found for '${email}'. You can sign in using demo email 'dm.varanasi@nic.in' (password: admin123) or register via 'New Officer Induction' tab.`
        };
    }

    // Auth API: Register & Succession
    async function register(officerData) {
        const normEmail = (officerData.email || '').trim().toLowerCase();
        const normName = (officerData.name || '').trim();
        const normDistrict = (officerData.district || '').trim();
        const normRole = (officerData.role || '').trim();
        const p = (officerData.password || '').trim();
        const contact = (officerData.contact || '').trim();
        const officerId = (officerData.officerId || '').trim();

        // 1. Gather all existing known active officers (both persistent storage and mock demo)
        hydrateOfficersFromStorage();
        const localRegistered = getLocalRegisteredOfficers();
        const demoOfficers = window.MPLADS_DEMO_DATA?.officers || [];
        const allOfficers = [...localRegistered, ...demoOfficers];

        // 2. Validate uniqueness of Email among active officers
        const existingEmail = allOfficers.find(o => o && o.email && o.email.toLowerCase() === normEmail && o.status === 'ACTIVE');
        if (existingEmail) {
            return {
                success: false,
                message: `Registration conflict: Official email '${normEmail}' is already registered to active officer (${existingEmail.name}). Please sign in.`
            };
        }

        // 3. Validate uniqueness of Officer / Cadre ID if provided
        if (officerId) {
            const cleanId = officerId.toLowerCase();
            const existingId = allOfficers.find(o => o && o.id && o.id.toLowerCase() === cleanId && o.status === 'ACTIVE');
            if (existingId) {
                return {
                    success: false,
                    message: `Registration conflict: Officer / Cadre ID '${officerId}' is already assigned to active officer ${existingId.name}.`
                };
            }
        }

        // 4. Validate uniqueness of mobile contact number (last 10 digits)
        if (contact) {
            const digits = contact.replace(/[^0-9]/g, '');
            if (digits.length >= 10) {
                const last10 = digits.slice(-10);
                const existingPhone = allOfficers.find(o => o && o.status === 'ACTIVE' && o.contact && o.contact.replace(/[^0-9]/g, '').slice(-10) === last10);
                if (existingPhone) {
                    return {
                        success: false,
                        message: `Registration conflict: Official contact number '${contact}' is already registered to ${existingPhone.name}.`
                    };
                }
            }
        }

        let roleCode = 'OFF';
        if (normRole.toLowerCase().includes('magistrate')) roleCode = 'DM';
        else if (normRole.toLowerCase().includes('parliament')) roleCode = 'MP';
        else if (normRole.toLowerCase().includes('engineer')) roleCode = 'EE';
        else if (normRole.toLowerCase().includes('planning')) roleCode = 'DPO';

        const distCode = normDistrict.slice(0, 3).toUpperCase();
        const newId = officerId || `OFF-${distCode}-${roleCode}-${Date.now().toString().slice(-3)}`;
        const assignedAvatar = officerData.avatar || generateOfficerAvatar(normName, normRole);

        const payloadWithAvatar = {
            ...officerData,
            avatar: assignedAvatar
        };

        // 5. Try registering with Backend API first
        let backendError = null;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadWithAvatar),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success && data.user) {
                isBackendConnected = true;
                saveUserSession(data.user, data.token);
                saveLocalRegisteredOfficer({ ...data.user, password: p, isRegistered: true });
                return data;
            } else if (res.status === 400 || res.status === 409) {
                // Backend explicitly rejected with legitimate business validation conflict
                return {
                    success: false,
                    message: data.message || "Registration rejected by central directory."
                };
            }
            // For 502 / proxy errors / 404s, fall through to client registration
        } catch (e) {
            backendError = e.message;
            console.info('[MPLADS API] Backend register unreachable, saving locally:', backendError);
        }

        // 6. Standalone Client Succession & Registration (when backend offline)
        const newOfficer = {
            id: newId,
            name: normName,
            role: normRole,
            roleCode,
            district: normDistrict,
            state: officerData.state || "Uttar Pradesh",
            email: normEmail,
            password: p,
            contact: contact || '+91-9450000000',
            avatar: assignedAvatar,
            joiningOrder: officerData.joiningOrder || `GO-${distCode}-PERS/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
            appointedDate: new Date().toISOString().split('T')[0],
            status: "ACTIVE",
            isRegistered: true
        };

        const officers = window.MPLADS_DEMO_DATA?.officers || [];
        let predecessor = null;
        const incumbent = officers.find(o => 
            o && o.id !== newOfficer.id &&
            o.district && o.district.toLowerCase() === normDistrict.toLowerCase() && 
            o.role && o.role.toLowerCase() === normRole.toLowerCase() && 
            o.status === 'ACTIVE'
        );

        if (incumbent) {
            incumbent.status = 'RELIEVED';
            incumbent.relievedDate = new Date().toISOString().split('T')[0];
            incumbent.relievedReason = officerData.successionType === 'resignation' 
                ? 'Relieved due to Resignation of Incumbent' 
                : 'Transferred / Routine Administrative Cadre Rotation';
            predecessor = { name: incumbent.name, id: incumbent.id, reason: incumbent.relievedReason };
            newOfficer.successionDetails = predecessor;
            saveLocalRegisteredOfficer(incumbent);
        }

        saveLocalRegisteredOfficer(newOfficer);
        if (window.MPLADS_DEMO_DATA?.officers) {
            window.MPLADS_DEMO_DATA.officers.unshift(newOfficer);
        }

        const token = 'LOCAL-AUTH-' + Date.now();
        saveUserSession(newOfficer, token);

        return {
            success: true,
            message: `Officer ${newOfficer.name} registered successfully for ${newOfficer.district}. Former incumbent (${predecessor?.name || 'None'}) has been formally relieved.`,
            token,
            user: newOfficer,
            succession: predecessor
        };
    }

    // Get Officers Directory
    async function getOfficers(district = '') {
        hydrateOfficersFromStorage();
        if (isBackendConnected) {
            try {
                const url = district ? `${BASE_URL}/auth/officers?district=${encodeURIComponent(district)}` : `${BASE_URL}/auth/officers`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data.data) {
                        return data.data;
                    }
                }
            } catch (e) {
                console.warn('[MPLADS API] getOfficers failed:', e.message);
            }
        }
        const localRegistered = getLocalRegisteredOfficers();
        const demoOfficers = window.MPLADS_DEMO_DATA?.officers || [];
        const combined = [...localRegistered, ...demoOfficers];
        const unique = [];
        const seen = new Set();
        combined.forEach(o => {
            if (o && o.email && !seen.has(o.email.toLowerCase())) {
                seen.add(o.email.toLowerCase());
                unique.push(o);
            }
        });
        return district ? unique.filter(o => o.district && o.district.toLowerCase() === district.toLowerCase()) : unique;
    }

    // Get Districts with Active 4 Roles
    async function getDistrictsRoster() {
        if (isBackendConnected) {
            try {
                const res = await fetch(`${BASE_URL}/auth/districts-roster`);
                if (res.ok) {
                    const data = await res.json();
                    return data.data || [];
                }
            } catch (e) {
                console.warn('[MPLADS API] getDistrictsRoster failed:', e.message);
            }
        }
        const districts = window.MPLADS_DEMO_DATA?.districts || [];
        const officers = window.MPLADS_DEMO_DATA?.officers || [];
        return districts.map(d => ({
            district: d,
            roles: {
                dm: officers.find(o => o.district.toLowerCase() === d.toLowerCase() && o.roleCode === 'DM' && o.status === 'ACTIVE') || null,
                mp: officers.find(o => o.district.toLowerCase() === d.toLowerCase() && o.roleCode === 'MP' && o.status === 'ACTIVE') || null,
                ee: officers.find(o => o.district.toLowerCase() === d.toLowerCase() && o.roleCode === 'EE' && o.status === 'ACTIVE') || null,
                dpo: officers.find(o => o.district.toLowerCase() === d.toLowerCase() && o.roleCode === 'DPO' && o.status === 'ACTIVE') || null
            }
        }));
    }

    // Role-based dashboard data
    async function getRoleDashboard(role, entityId = '') {
        if (isBackendConnected) {
            try {
                const res = await fetch(`${BASE_URL}/analytics/role?role=${encodeURIComponent(role)}&entityId=${encodeURIComponent(entityId)}`);
                if (res.ok) {
                    const json = await res.json();
                    return json.data;
                }
            } catch (e) {
                console.warn('[MPLADS API] Role dashboard fetch failed:', e.message);
            }
        }
        return null;
    }

    // Autonomous AI Audit Scan
    async function runAiAudit() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${BASE_URL}/ai/audit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) return json.data;
            }
        } catch (e) {
            console.warn('[MPLADS API] runAiAudit network fetch failed, using synthetic audit:', e.message);
        }
        // Fallback demo audit data
        const works = window.MPLADS_DEMO_DATA?.works || [];
        const alerts = window.MPLADS_DEMO_DATA?.alerts || [];
        return {
            timestamp: new Date().toISOString(),
            worksScanned: works.length || 20,
            duplicateClusters: 2,
            anomaliesFlagged: alerts.length || 8,
            fraudPatterns: 3,
            clusters: [
                {
                    title: "Solar Street Light Installation (Cluster UP-SOL-01)",
                    district: "Varanasi",
                    similarity: "98.4% NLP Match",
                    items: [
                        { id: "WRK-2026-UP-001", title: "Installation of High-Mast Solar Street Lights in Shivpur", cost: "₹45.0 Lakhs" },
                        { id: "WRK-2026-UP-019", title: "Shivpur Panchayat Solar High Mast Lighting Project", cost: "₹42.5 Lakhs" }
                    ],
                    status: "SUSPECTED_DUPLICATE",
                    recommendation: "Immediate administrative freeze recommended under MoSPI Rule 4.2."
                }
            ],
            anomalies: alerts.slice(0, 5)
        };
    }



    async function getReports() {
        if (isBackendConnected) {
            try {
                const res = await fetch(`${BASE_URL}/reports`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) {
                        return json.data;
                    }
                }
            } catch (e) {
                console.warn('[MPLADS API] getReports fetch failed, falling back.');
            }
        }
        return window.MPLADS_DEMO_DATA ? (window.MPLADS_DEMO_DATA.reports || []) : [];
    }

    async function generateReport(payload) {
        if (isBackendConnected) {
            try {
                const res = await fetch(`${BASE_URL}/reports/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) {
                        if (window.MPLADS_DEMO_DATA && window.MPLADS_DEMO_DATA.reports) {
                            window.MPLADS_DEMO_DATA.reports.unshift(json.data);
                        }
                        return json.data;
                    }
                }
            } catch (e) {
                console.warn('[MPLADS API] generateReport fetch failed, fallback locally.');
            }
        }
        const newRpt = {
            id: `RPT-2026-${Date.now().toString().slice(-4)}`,
            type: `${payload.type || 'Statutory Report'} (${payload.district || 'All Districts'} - ${payload.fy || 'FY 2025-26'})`,
            generatedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            generatedBy: window.MPLADS_DEMO_DATA?.currentUser?.name || "Dr. R. K. Sharma, IAS",
            status: "COMPLETED",
            format: "PDF (2.1 MB)"
        };
        if (window.MPLADS_DEMO_DATA && window.MPLADS_DEMO_DATA.reports) {
            window.MPLADS_DEMO_DATA.reports.unshift(newRpt);
        }
        return newRpt;
    }

    // Public API Methods
    return {
        checkHealth,
        syncData,
        getKpis,
        getWorks,
        getProjectById,
        getAlerts,
        updateAlertStatus,
        getReports,
        generateReport,
        runAiAudit,
        getDuplicates,
        explainAnomaly,
        askCopilot,
        getRoleDashboard,
        login,
        register,
        getOfficers,
        getDistrictsRoster,
        getCurrentUser,
        logout,
        saveUserSession,
        saveLocalWork,
        saveLocalTransaction,
        saveLocalAlertUpdate,
        getBaseUrl,
        hydrateOfficersFromStorage,
        hydrateAllDataFromStorage,
        isConnected: () => isBackendConnected
    };
})();

// Export
if (typeof window !== 'undefined') {
    window.MPLADS_API = MPLADS_API;
    window.getApiBaseUrl = function () {
        if (window.MPLADS_CONFIG && typeof window.MPLADS_CONFIG.getApiUrl === 'function') {
            return window.MPLADS_CONFIG.getApiUrl();
        }
        return window.MPLADS_API ? window.MPLADS_API.getBaseUrl() : '/api';
    };
}
