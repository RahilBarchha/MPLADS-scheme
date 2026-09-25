/**
 * MPLADS Monitoring & Analytics Platform - In-Memory Persisted Data Store
 * Initialized with official MoSPI MPLADS scheme simulation records.
 */

const fs = require('fs');
const path = require('path');
const { getStateForDistrict } = require('../data/india-districts');

// Registered Officers Persistent JSON Storage
const REGISTERED_OFFICERS_FILE = path.resolve(__dirname, '../data/registered_officers.json');

function loadPersistedRegisteredOfficers() {
    try {
        if (fs.existsSync(REGISTERED_OFFICERS_FILE)) {
            const raw = fs.readFileSync(REGISTERED_OFFICERS_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.warn('[DataStore] Warning: Could not read registered_officers.json:', e.message);
    }
    return [];
}

function savePersistedRegisteredOfficers(officersList) {
    try {
        const dir = path.dirname(REGISTERED_OFFICERS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(REGISTERED_OFFICERS_FILE, JSON.stringify(officersList, null, 2), 'utf8');
    } catch (e) {
        console.error('[DataStore] Error saving to registered_officers.json:', e.message);
    }
}

// Try loading existing mock dataset
let initialData = null;
try {
    const mockPath = path.resolve(__dirname, '../../../website/data/mock-data.js');
    if (fs.existsSync(mockPath)) {
        initialData = require(mockPath);
    }
} catch (e) {
    console.warn('[DataStore] Warning: Could not load mock-data.js directly:', e.message);
}

// Fallback seed data if not loaded
const districts = initialData?.districts || [
    "Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar", "Mirzapur", "Jaunpur"
];

const constituencies = initialData?.constituencies || [
    { id: "PC-77", name: "Varanasi (PC-77)", district: "Varanasi", mp: "Hon. MP (Varanasi)" },
    { id: "PC-64", name: "Gorakhpur (PC-64)", district: "Gorakhpur", mp: "Hon. MP (Gorakhpur)" },
    { id: "PC-52", name: "Prayagraj (PC-52)", district: "Prayagraj", mp: "Hon. MP (Prayagraj)" },
    { id: "PC-35", name: "Lucknow (PC-35)", district: "Lucknow", mp: "Hon. MP (Lucknow)" },
    { id: "PC-54", name: "Ayodhya (PC-54)", district: "Ayodhya", mp: "Hon. MP (Ayodhya)" },
    { id: "PC-43", name: "Kanpur (PC-43)", district: "Kanpur Nagar", mp: "Hon. MP (Kanpur)" },
    { id: "PC-79", name: "Mirzapur (PC-79)", district: "Mirzapur", mp: "Hon. MP (Mirzapur)" },
    { id: "PC-73", name: "Jaunpur (PC-73)", district: "Jaunpur", mp: "Hon. MP (Jaunpur)" }
];

const categories = initialData?.categories || [
    "Drinking Water & Sanitation",
    "Education & Digital Labs",
    "Rural Roads & Bridges",
    "Public Health Infrastructure",
    "Renewable Energy & Lighting",
    "Community Assets & Skills"
];

// Rich Projects registry with GPS coordinates, contractor IDs, panchayat names for duplicate/fraud detection
let works = initialData?.works ? JSON.parse(JSON.stringify(initialData.works)) : [];

// If works don't have geo/contractor attributes, enrich them
works = works.map((w, index) => {
    return {
        ...w,
        panchayat: w.panchayat || `Panchayat Block ${((index % 5) + 1)}`,
        latitude: w.latitude || (25.3176 + (index * 0.015)),
        longitude: w.longitude || (82.9739 + (index * 0.012)),
        contractorName: w.contractorName || (index % 3 === 0 ? "Apex Infrastructure Ltd" : (index % 3 === 1 ? "Purvanchal Nirman Nigam" : "Ganga Buildcon Private Limited")),
        contractorId: w.contractorId || `CONT-00${(index % 4) + 1}`,
        splitTenderGroup: (index === 4 || index === 5) ? "SPLIT-GRP-091" : null,
        physicalInspectionDone: w.completionPct > 50 ? (index % 2 === 0) : false,
        sanctionDate: w.startDate || "2025-06-15"
    };
});

// Ensure we have classic anomaly test cases for live demonstrations:
// 1. Duplicate Work Pair (WRK-2026-UP-001 & WRK-2026-UP-017 in Varanasi)
// 2. Duplicate Work Pair (WRK-2026-UP-003 & WRK-2026-UP-018 in Prayagraj)
// 3. Split Tender Anomaly (WRK-2026-UP-019 & WRK-2026-UP-020: sub-10L contracts to evade e-tendering)

works.push({
    id: "WRK-2026-UP-017",
    name: "Erection of Solar High-Mast Light Systems across 12 Rural Squares",
    district: "Varanasi",
    constituency: "Varanasi (PC-77)",
    mp: "Hon. MP (Varanasi)",
    financialYear: "2025-26",
    category: "Renewable Energy & Lighting",
    approvedAmountLakhs: 47.80,
    releasedAmountLakhs: 47.80,
    expenditureLakhs: 38.20,
    completionPct: 60,
    status: "ONGOING",
    risk: "CRITICAL",
    panchayat: "Panchayat Block 1",
    latitude: 25.3188,
    longitude: 82.9750,
    contractorName: "Apex Infrastructure Ltd",
    contractorId: "CONT-001",
    physicalInspectionDone: false,
    daysDelayed: 45,
    lastUpdated: "2026-09-19",
    startDate: "2025-12-01",
    expectedCompletion: "2026-11-15",
    monitoringObservations: "Suspected duplicate allocation overlapping with WRK-2026-UP-001 in identical panchayat squares.",
    milestones: [{ title: "Foundations", status: "COMPLETED" }, { title: "Erection", status: "ONGOING" }]
});

works.push({
    id: "WRK-2026-UP-018",
    name: "Installation of Deep Tube Wells & Community RO Water Plant",
    district: "Prayagraj",
    constituency: "Prayagraj (PC-52)",
    mp: "Hon. MP (Prayagraj)",
    financialYear: "2025-26",
    category: "Drinking Water & Sanitation",
    approvedAmountLakhs: 31.50,
    releasedAmountLakhs: 31.50,
    expenditureLakhs: 22.00,
    completionPct: 40,
    status: "ONGOING",
    risk: "HIGH",
    panchayat: "Panchayat Block 3",
    latitude: 25.4362,
    longitude: 81.8471,
    contractorName: "Purvanchal Nirman Nigam",
    contractorId: "CONT-002",
    physicalInspectionDone: false,
    daysDelayed: 60,
    lastUpdated: "2026-09-15",
    startDate: "2025-11-15",
    expectedCompletion: "2026-10-30",
    monitoringObservations: "Overlapping scope with WRK-2026-UP-003 in same revenue village.",
    milestones: [{ title: "Borewell Drilling", status: "COMPLETED" }]
});

works.push({
    id: "WRK-2026-UP-019",
    name: "Construction of Model Panchayat Bhavan Boundary Wall (Phase 1)",
    district: "Gorakhpur",
    constituency: "Gorakhpur (PC-64)",
    mp: "Hon. MP (Gorakhpur)",
    financialYear: "2025-26",
    category: "Community Assets & Skills",
    approvedAmountLakhs: 9.80,
    releasedAmountLakhs: 9.80,
    expenditureLakhs: 9.80,
    completionPct: 85,
    status: "ONGOING",
    risk: "HIGH",
    panchayat: "Panchayat Block 2",
    latitude: 26.7610,
    longitude: 83.3740,
    contractorName: "Ganga Buildcon Private Limited",
    contractorId: "CONT-003",
    splitTenderGroup: "SPLIT-GRP-091",
    physicalInspectionDone: false,
    daysDelayed: 20,
    lastUpdated: "2026-09-18",
    monitoringObservations: "Suspected contract slicing under Rule 4.2 to evade open tender ceiling.",
    milestones: [{ title: "Wall Masonry", status: "ONGOING" }]
});

works.push({
    id: "WRK-2026-UP-020",
    name: "Construction of Model Panchayat Bhavan Boundary Wall (Phase 2)",
    district: "Gorakhpur",
    constituency: "Gorakhpur (PC-64)",
    mp: "Hon. MP (Gorakhpur)",
    financialYear: "2025-26",
    category: "Community Assets & Skills",
    approvedAmountLakhs: 9.60,
    releasedAmountLakhs: 9.60,
    expenditureLakhs: 9.60,
    completionPct: 80,
    status: "ONGOING",
    risk: "HIGH",
    panchayat: "Panchayat Block 2",
    latitude: 26.7612,
    longitude: 83.3742,
    contractorName: "Ganga Buildcon Private Limited",
    contractorId: "CONT-003",
    splitTenderGroup: "SPLIT-GRP-091",
    physicalInspectionDone: false,
    daysDelayed: 20,
    lastUpdated: "2026-09-18",
    monitoringObservations: "Twin work sanctioned on same date to identical contractor below ₹10 Lakhs threshold.",
    milestones: [{ title: "Wall Plastering", status: "ONGOING" }]
});

// Alerts registry
let alerts = initialData?.alerts ? JSON.parse(JSON.stringify(initialData.alerts)) : [];

// Financial Transactions
let financialTransactions = initialData?.financialTransactions ? JSON.parse(JSON.stringify(initialData.financialTransactions)) : [];

// Reports Log
let reports = initialData?.reports ? JSON.parse(JSON.stringify(initialData.reports)) : [
    {
        id: "RPT-2026-01",
        type: "Monthly Progress Report (MPR) - Varanasi (FY 2025-26)",
        generatedDate: "2026-09-20 16:30",
        generatedBy: "Dr. R. K. Sharma, IAS",
        district: "Varanasi",
        status: "COMPLETED",
        format: "PDF (2.4 MB)"
    },
    {
        id: "RPT-2026-02",
        type: "Annual Utilization Certificate (UC) - Consolidated",
        generatedDate: "2026-09-18 11:15",
        generatedBy: "System Auditor (Authorized)",
        district: "All Districts",
        status: "COMPLETED",
        format: "PDF (3.8 MB)"
    },
    {
        id: "RPT-2026-03",
        type: "Work Completion Audit & Geo-Tagging Summary - Gorakhpur",
        generatedDate: "2026-09-15 14:45",
        generatedBy: "Krishna Mohan Singh, IAS",
        district: "Gorakhpur",
        status: "COMPLETED",
        format: "PDF (1.9 MB)"
    },
    {
        id: "RPT-2026-04",
        type: "Statutory Scheme Performance & Expenditure Audit",
        generatedDate: "2026-09-10 09:20",
        generatedBy: "MoSPI Scheme Evaluation Officer",
        district: "All Districts",
        status: "COMPLETED",
        format: "PDF (4.1 MB)"
    }
];

// Executive Officer Portrait Pools (Male & Female Diverse Portraits)
const MALE_PORTRAITS = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=160&h=160&q=80"
];

const FEMALE_PORTRAITS = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80"
];

function generateOfficerAvatar(name = '', role = '') {
    const clean = (name || '').trim();
    if (!clean) return MALE_PORTRAITS[0];

    const femaleIndicators = ['smt', 'smt.', 'mrs', 'mrs.', 'ms', 'ms.', 'priyanka', 'sunita', 'vandana', 'rashmi', 'meenakshi', 'neelam', 'anupriya', 'kumari', 'devi', 'kaur', 'begum', 'pooja', 'shweta', 'ananya'];
    const lowerName = clean.toLowerCase();
    const isFemale = femaleIndicators.some(w => lowerName.includes(w));
    const pool = isFemale ? FEMALE_PORTRAITS : MALE_PORTRAITS;

    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
        hash = (hash << 5) - hash + clean.charCodeAt(i);
        hash |= 0;
    }
    const idx = Math.abs(hash) % pool.length;
    return pool[idx];
}

class DataStore {
    // Works
    static getWorks(filterFn = null) {
        if (!filterFn) return [...works];
        return works.filter(filterFn);
    }

    static getWorkById(id) {
        return works.find(w => w.id === id) || null;
    }

    static addWork(newWork) {
        works.unshift(newWork);
        return newWork;
    }

    static updateWork(id, patch) {
        const idx = works.findIndex(w => w.id === id);
        if (idx !== -1) {
            works[idx] = { ...works[idx], ...patch, lastUpdated: new Date().toISOString().split('T')[0] };
            return works[idx];
        }
        return null;
    }

    // Alerts
    static getAlerts(filterFn = null) {
        if (!filterFn) return [...alerts];
        return alerts.filter(filterFn);
    }

    static getAlertById(id) {
        return alerts.find(a => a.id === id) || null;
    }

    static addAlert(newAlert) {
        // Prevent duplicate alert IDs
        const existing = alerts.find(a => a.id === newAlert.id);
        if (existing) {
            Object.assign(existing, newAlert);
            return existing;
        }
        alerts.unshift(newAlert);
        return newAlert;
    }

    static updateAlert(id, patch) {
        const idx = alerts.findIndex(a => a.id === id);
        if (idx !== -1) {
            alerts[idx] = { ...alerts[idx], ...patch, updatedAt: new Date().toISOString() };
            return alerts[idx];
        }
        return null;
    }

    // Transactions
    static getTransactions(filterFn = null) {
        if (!filterFn) return [...financialTransactions];
        return financialTransactions.filter(filterFn);
    }

    static addTransaction(newTxn) {
        financialTransactions.unshift(newTxn);
        return newTxn;
    }

    // Master lookups
    static getDistricts() { return districts; }
    static getConstituencies() { return constituencies; }
    static getCategories() { return categories; }
    static getReports() { return reports; }

    static addReport(report) {
        reports.unshift(report);
        return report;
    }

    // =========================================================================
    // Multi-District Role-Based Access Control & Officer Registry
    // =========================================================================
    static getOfficers(includeRelieved = false) {
        return officers
            .filter(o => includeRelieved ? true : o.status === 'ACTIVE')
            .map(({ password, ...safeOfficer }) => safeOfficer);
    }

    static getOfficerByEmail(email) {
        if (!email) return null;
        const norm = email.trim().toLowerCase();
        return officers.find(o => o.email.toLowerCase() === norm) || null;
    }

    static getOfficerById(id) {
        if (!id) return null;
        return officers.find(o => o.id === id) || null;
    }

    static getActiveIncumbent(district, role) {
        return officers.find(o => 
            o.district.toLowerCase() === district.toLowerCase() && 
            o.role.toLowerCase() === role.toLowerCase() && 
            o.status === 'ACTIVE'
        ) || null;
    }

    static authenticateOfficer(emailOrId, password) {
        if (!emailOrId || !password) return null;
        const q = emailOrId.trim().toLowerCase();
        const officer = officers.find(o => 
            (o.email.toLowerCase() === q || o.id.toLowerCase() === q) && o.status === 'ACTIVE'
        );

        if (!officer) return null;

        // Verify password (matches assigned credential or common demo credentials)
        const isMatch = officer.password === password ||
            password === 'demo1234' ||
            password === 'password123' ||
            password === 'admin123' ||
            password === 'password' ||
            password === '123456' ||
            password.toLowerCase() === `${(officer.district || '').toLowerCase()}@${(officer.roleCode || '').toLowerCase()}2026` ||
            password === `${officer.district}@${officer.roleCode}2026`;

        if (isMatch) {
            const { password: _, ...safeProfile } = officer;
            return safeProfile;
        }

        return null;
    }

    static registerOfficer({ name, email, role, district, state, password, officerId, contact, joiningOrder, successionType, predecessorId, avatar }) {
        const normEmail = (email || '').trim().toLowerCase();
        const normDistrict = (district || '').trim();
        const normRole = (role || '').trim();
        const resolvedState = state || getStateForDistrict(normDistrict);

        // 1. Validate uniqueness of email among active officers
        const existingEmail = officers.find(o => o.email.toLowerCase() === normEmail && o.status === 'ACTIVE');
        if (existingEmail) {
            throw new Error(`Registration conflict: An active officer (${existingEmail.name}) is already registered with email '${email}'. Please sign in.`);
        }

        // 2. Validate uniqueness of Officer ID if specified
        if (officerId && officerId.trim()) {
            const cleanId = officerId.trim().toLowerCase();
            const existingId = officers.find(o => o.id && o.id.toLowerCase() === cleanId && o.status === 'ACTIVE');
            if (existingId) {
                throw new Error(`Registration conflict: Officer / Cadre ID '${officerId}' is already assigned to active officer ${existingId.name}.`);
            }
        }

        // 3. Validate uniqueness of mobile contact number
        if (contact && contact.trim()) {
            const digits = contact.replace(/[^0-9]/g, '');
            if (digits.length >= 10) {
                const last10 = digits.slice(-10);
                const existingPhone = officers.find(o => o.status === 'ACTIVE' && o.contact && o.contact.replace(/[^0-9]/g, '').slice(-10) === last10);
                if (existingPhone) {
                    throw new Error(`Registration conflict: Official contact number '${contact}' is already registered to ${existingPhone.name}.`);
                }
            }
        }

        // Handle Succession: if predecessor resigned or transferred
        let relievedPredecessor = null;
        const currentIncumbent = DataStore.getActiveIncumbent(normDistrict, normRole);
        if (currentIncumbent) {
            currentIncumbent.status = 'RELIEVED';
            currentIncumbent.relievedDate = new Date().toISOString().split('T')[0];
            currentIncumbent.relievedReason = successionType === 'resignation' 
                ? 'Relieved due to Resignation of Incumbent' 
                : 'Transferred / Routine Administrative Cadre Rotation';
            currentIncumbent.succeededBy = name;
            relievedPredecessor = {
                id: currentIncumbent.id,
                name: currentIncumbent.name,
                reason: currentIncumbent.relievedReason
            };
        }

        // Role code mapping
        let roleCode = 'OFF';
        if (normRole.toLowerCase().includes('magistrate')) roleCode = 'DM';
        else if (normRole.toLowerCase().includes('parliament')) roleCode = 'MP';
        else if (normRole.toLowerCase().includes('engineer')) roleCode = 'EE';
        else if (normRole.toLowerCase().includes('planning')) roleCode = 'DPO';

        const distCode = normDistrict.slice(0, 3).toUpperCase();
        const newId = officerId || `OFF-${distCode}-${roleCode}-${Date.now().toString().slice(-3)}`;
        const assignedAvatar = avatar || generateOfficerAvatar(name, normRole);

        const newOfficer = {
            id: newId,
            name: name.trim(),
            role: normRole,
            roleCode,
            district: normDistrict,
            state: resolvedState,
            email: normEmail,
            password: password,
            contact: contact || "+91-9450000000",
            avatar: assignedAvatar,
            joiningOrder: joiningOrder || `GO-${distCode}-PERS/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
            appointedDate: new Date().toISOString().split('T')[0],
            status: "ACTIVE",
            successionDetails: relievedPredecessor ? {
                predecessorName: relievedPredecessor.name,
                predecessorId: relievedPredecessor.id,
                reason: relievedPredecessor.reason
            } : null
        };

        officers.unshift(newOfficer);

        // Persist new officer to disk so they survive backend restarts
        try {
            const persisted = loadPersistedRegisteredOfficers();
            const existingIdx = persisted.findIndex(p => p.email.toLowerCase() === newOfficer.email.toLowerCase() || p.id === newOfficer.id);
            if (existingIdx !== -1) {
                persisted[existingIdx] = newOfficer;
            } else {
                persisted.unshift(newOfficer);
            }
            savePersistedRegisteredOfficers(persisted);
        } catch (e) {
            console.error('[DataStore] Failed writing officer to disk:', e.message);
        }

        const { password: _, ...safeResult } = newOfficer;
        return {
            officer: safeResult,
            relievedPredecessor
        };
    }
}

// -----------------------------------------------------------------------------
// Seed Officers Registry (32 Non-Colliding Officers for 8 Districts + Ministry/SNA)
// -----------------------------------------------------------------------------
let officers = [
    // 1. Varanasi
    { id: "OFF-VNS-DM-01", name: "Dr. R. K. Sharma, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Varanasi", state: "Uttar Pradesh", email: "dm.varanasi@nic.in", password: "Varanasi@DM2026", contact: "+91-9454417501", status: "ACTIVE", appointedDate: "2024-06-15", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-VNS-MP-01", name: "Hon. Rajesh K. Tripathi, MP", role: "Member of Parliament", roleCode: "MP", district: "Varanasi", state: "Uttar Pradesh", email: "mp.varanasi@sansad.nic.in", password: "Varanasi@MP2026", contact: "+91-9415201102", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-VNS-EE-01", name: "Er. Anand Swaroop", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Varanasi", state: "Uttar Pradesh", email: "ee.varanasi@pwd.up.gov.in", password: "Varanasi@EE2026", contact: "+91-9454418203", status: "ACTIVE", appointedDate: "2023-08-10", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-VNS-DPO-01", name: "Smt. Sunita Mishra", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Varanasi", state: "Uttar Pradesh", email: "dpo.varanasi@nic.in", password: "Varanasi@DPO2026", contact: "+91-9454419304", status: "ACTIVE", appointedDate: "2024-01-20", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80" },

    // 2. Gorakhpur
    { id: "OFF-GKP-DM-01", name: "Krishna Mohan Singh, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Gorakhpur", state: "Uttar Pradesh", email: "dm.gorakhpur@nic.in", password: "Gorakhpur@DM2026", contact: "+91-9454417511", status: "ACTIVE", appointedDate: "2024-07-01", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-GKP-MP-01", name: "Hon. Ravi Kant Shukla, MP", role: "Member of Parliament", roleCode: "MP", district: "Gorakhpur", state: "Uttar Pradesh", email: "mp.gorakhpur@sansad.nic.in", password: "Gorakhpur@MP2026", contact: "+91-9415201112", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-GKP-EE-01", name: "Er. Devendra Nath Roy", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Gorakhpur", state: "Uttar Pradesh", email: "ee.gorakhpur@pwd.up.gov.in", password: "Gorakhpur@EE2026", contact: "+91-9454418213", status: "ACTIVE", appointedDate: "2023-11-15", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-GKP-DPO-01", name: "Shri Bipin Bihari Pandey", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Gorakhpur", state: "Uttar Pradesh", email: "dpo.gorakhpur@nic.in", password: "Gorakhpur@DPO2026", contact: "+91-9454419314", status: "ACTIVE", appointedDate: "2023-09-01", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80" },

    // 3. Prayagraj
    { id: "OFF-PRY-DM-01", name: "Smt. Vandana Tripathi, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Prayagraj", state: "Uttar Pradesh", email: "dm.prayagraj@nic.in", password: "Prayagraj@DM2026", contact: "+91-9454417521", status: "ACTIVE", appointedDate: "2024-05-12", avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-PRY-MP-01", name: "Hon. Mahendra Pratap Singh, MP", role: "Member of Parliament", roleCode: "MP", district: "Prayagraj", state: "Uttar Pradesh", email: "mp.prayagraj@sansad.nic.in", password: "Prayagraj@MP2026", contact: "+91-9415201122", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-PRY-EE-01", name: "Er. Rakesh Kumar Verma", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Prayagraj", state: "Uttar Pradesh", email: "ee.prayagraj@pwd.up.gov.in", password: "Prayagraj@EE2026", contact: "+91-9454418223", status: "ACTIVE", appointedDate: "2024-02-14", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-PRY-DPO-01", name: "Shri Alok Nath Srivastava", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Prayagraj", state: "Uttar Pradesh", email: "dpo.prayagraj@nic.in", password: "Prayagraj@DPO2026", contact: "+91-9454419324", status: "ACTIVE", appointedDate: "2023-12-10", avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=160&h=160&q=80" },

    // 4. Lucknow
    { id: "OFF-LKO-DM-01", name: "Shri Surya Pal Gangwar, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Lucknow", state: "Uttar Pradesh", email: "dm.lucknow@nic.in", password: "Lucknow@DM2026", contact: "+91-9454417531", status: "ACTIVE", appointedDate: "2023-04-18", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-LKO-MP-01", name: "Hon. Brajesh Chandra Pathak, MP", role: "Member of Parliament", roleCode: "MP", district: "Lucknow", state: "Uttar Pradesh", email: "mp.lucknow@sansad.nic.in", password: "Lucknow@MP2026", contact: "+91-9415201132", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-LKO-EE-01", name: "Er. Manoj Kumar Saxena", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Lucknow", state: "Uttar Pradesh", email: "ee.lucknow@pwd.up.gov.in", password: "Lucknow@EE2026", contact: "+91-9454418233", status: "ACTIVE", appointedDate: "2023-07-25", avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-LKO-DPO-01", name: "Smt. Rashmi Tiwari", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Lucknow", state: "Uttar Pradesh", email: "dpo.lucknow@nic.in", password: "Lucknow@DPO2026", contact: "+91-9454419334", status: "ACTIVE", appointedDate: "2024-03-01", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=160&h=160&q=80" },

    // 5. Ayodhya
    { id: "OFF-AYD-DM-01", name: "Shri Nitish Kumar Verma, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Ayodhya", state: "Uttar Pradesh", email: "dm.ayodhya@nic.in", password: "Ayodhya@DM2026", contact: "+91-9454417541", status: "ACTIVE", appointedDate: "2023-10-05", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-AYD-MP-01", name: "Hon. Awadhesh Kumar Prasad, MP", role: "Member of Parliament", roleCode: "MP", district: "Ayodhya", state: "Uttar Pradesh", email: "mp.ayodhya@sansad.nic.in", password: "Ayodhya@MP2026", contact: "+91-9415201142", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-AYD-EE-01", name: "Er. Pradeep Kumar Upadhyay", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Ayodhya", state: "Uttar Pradesh", email: "ee.ayodhya@pwd.up.gov.in", password: "Ayodhya@EE2026", contact: "+91-9454418243", status: "ACTIVE", appointedDate: "2024-01-15", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-AYD-DPO-01", name: "Shri Sanjay Kumar Dwivedi", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Ayodhya", state: "Uttar Pradesh", email: "dpo.ayodhya@nic.in", password: "Ayodhya@DPO2026", contact: "+91-9454419344", status: "ACTIVE", appointedDate: "2023-08-20", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80" },

    // 6. Kanpur Nagar
    { id: "OFF-KNP-DM-01", name: "Shri Jitendra Pratap Singh, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Kanpur Nagar", state: "Uttar Pradesh", email: "dm.kanpur@nic.in", password: "Kanpur@DM2026", contact: "+91-9454417551", status: "ACTIVE", appointedDate: "2024-04-10", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-KNP-MP-01", name: "Hon. Ramesh Chandra Awasthi, MP", role: "Member of Parliament", roleCode: "MP", district: "Kanpur Nagar", state: "Uttar Pradesh", email: "mp.kanpur@sansad.nic.in", password: "Kanpur@MP2026", contact: "+91-9415201152", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-KNP-EE-01", name: "Er. Vijay Kumar Bajpai", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Kanpur Nagar", state: "Uttar Pradesh", email: "ee.kanpur@pwd.up.gov.in", password: "Kanpur@EE2026", contact: "+91-9454418253", status: "ACTIVE", appointedDate: "2023-11-30", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-KNP-DPO-01", name: "Smt. Meenakshi Sahu", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Kanpur Nagar", state: "Uttar Pradesh", email: "dpo.kanpur@nic.in", password: "Kanpur@DPO2026", contact: "+91-9454419354", status: "ACTIVE", appointedDate: "2024-02-05", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=160&h=160&q=80" },

    // 7. Mirzapur
    { id: "OFF-MZP-DM-01", name: "Smt. Priyanka Niranjan, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Mirzapur", state: "Uttar Pradesh", email: "dm.mirzapur@nic.in", password: "Mirzapur@DM2026", contact: "+91-9454417561", status: "ACTIVE", appointedDate: "2023-09-14", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-MZP-MP-01", name: "Hon. Smt. Anupriya S. Patel, MP", role: "Member of Parliament", roleCode: "MP", district: "Mirzapur", state: "Uttar Pradesh", email: "mp.mirzapur@sansad.nic.in", password: "Mirzapur@MP2026", contact: "+91-9415201162", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-MZP-EE-01", name: "Er. Ashok Kumar Maurya", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Mirzapur", state: "Uttar Pradesh", email: "ee.mirzapur@pwd.up.gov.in", password: "Mirzapur@EE2026", contact: "+91-9454418263", status: "ACTIVE", appointedDate: "2024-01-08", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-MZP-DPO-01", name: "Shri Tribhuvan Nath Pandey", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Mirzapur", state: "Uttar Pradesh", email: "dpo.mirzapur@nic.in", password: "Mirzapur@DPO2026", contact: "+91-9454419364", status: "ACTIVE", appointedDate: "2023-10-12", avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=160&h=160&q=80" },

    // 8. Jaunpur
    { id: "OFF-JNP-DM-01", name: "Shri Ravindra Kumar Mander, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Jaunpur", state: "Uttar Pradesh", email: "dm.jaunpur@nic.in", password: "Jaunpur@DM2026", contact: "+91-9454417571", status: "ACTIVE", appointedDate: "2024-03-22", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-JNP-MP-01", name: "Hon. Babu Singh Kushwaha, MP", role: "Member of Parliament", roleCode: "MP", district: "Jaunpur", state: "Uttar Pradesh", email: "mp.jaunpur@sansad.nic.in", password: "Jaunpur@MP2026", contact: "+91-9415201172", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-JNP-EE-01", name: "Er. Harish Chandra Yadav", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Jaunpur", state: "Uttar Pradesh", email: "ee.jaunpur@pwd.up.gov.in", password: "Jaunpur@EE2026", contact: "+91-9454418273", status: "ACTIVE", appointedDate: "2023-12-05", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-JNP-DPO-01", name: "Smt. Neelam Singh", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Jaunpur", state: "Uttar Pradesh", email: "dpo.jaunpur@nic.in", password: "Jaunpur@DPO2026", contact: "+91-9454419374", status: "ACTIVE", appointedDate: "2024-01-30", avatar: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=160&h=160&q=80" },

    // Central & State Level
    { id: "OFF-NAT-MIN-01", name: "Dr. Subhash Chandra Garg, IAS", role: "Ministry Central Administrator", roleCode: "MINISTRY", district: "National (All Districts)", state: "Central", email: "admin.mospi@nic.in", password: "MoSPI@Central2026", contact: "+91-11-23382101", status: "ACTIVE", appointedDate: "2022-01-01", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80" },
    { id: "OFF-UP-SNA-01", name: "Shri Deepak Kumar, IAS", role: "State Nodal Authority Officer", roleCode: "SNA", district: "Uttar Pradesh (State)", state: "Uttar Pradesh", email: "sna.planning@up.gov.in", password: "SNA@UP2026", contact: "+91-522-2238102", status: "ACTIVE", appointedDate: "2023-05-15", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&h=160&q=80" }
];

// Hydrate with persisted officers saved on disk
try {
    const persisted = loadPersistedRegisteredOfficers();
    if (Array.isArray(persisted) && persisted.length > 0) {
        persisted.forEach(po => {
            const existingIdx = officers.findIndex(o => o.id === po.id || o.email.toLowerCase() === po.email.toLowerCase());
            if (existingIdx !== -1) {
                officers[existingIdx] = po;
            } else {
                officers.unshift(po);
            }
        });
    }
} catch (e) {
    console.warn('[DataStore] Could not hydrate persisted officers:', e.message);
}

module.exports = DataStore;


