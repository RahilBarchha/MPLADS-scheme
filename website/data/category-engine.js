/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Dynamic Multi-Category Data Engine
 * 
 * Guarantees that:
 * 1. Every category and filter combination yields distinct, realistic mock data.
 * 2. NO metric, count, percentage, chart, or table is EVER equal to zero (> 0).
 * 3. Scales deterministically across Districts, Financial Years, Statuses, and Risks.
 * 4. Provides unique works, transactions, alerts, and chart distributions for all combinations.
 * ==============================================================================
 */

(function () {
    const CATEGORIES = [
        "Drinking Water & Sanitation",
        "Education & Digital Labs",
        "Rural Roads & Bridges",
        "Public Health Infrastructure",
        "Renewable Energy & Lighting",
        "Community Assets & Skills"
    ];

    const CATEGORY_PROFILES = {
        "Drinking Water & Sanitation": {
            code: "DWS",
            baseAllocCr: 98.50,
            baseRelCr: 88.20,
            baseExpCr: 84.20,
            baseWorks: 340,
            completedRatio: 0.67,
            ongoingRatio: 0.22,
            delayedRatio: 0.08,
            pendingRatio: 0.03,
            alertsCount: 4,
            avgCostLakhs: 72.50,
            monthlyPattern: [6.2, 5.8, 7.1, 8.4, 7.5, 6.9, 8.2, 7.0, 6.5, 7.8, 8.1, 4.7],
            worksTemplates: [
                { title: "Piped Clean Drinking Water Scheme & Solar RO Plant", cost: 78.5, comp: 94, status: "ONGOING", risk: "LOW" },
                { title: "Overhead Reservoir & Multi-Village Distribution Pipeline", cost: 92.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Deep Hydro-Geological Tube Wells & Arsenic Filter Plant", cost: 64.0, comp: 48, status: "DELAYED", risk: "HIGH", days: 88 },
                { title: "Bio-Digester Sanitation & Septage Management Hub", cost: 70.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "High-Capacity Solar Water ATM & Purification Center", cost: 42.0, comp: 82, status: "ONGOING", risk: "MEDIUM" },
                { title: "Panchayat Surface Drainage & Graywater Soak Pit Network", cost: 55.0, comp: 35, status: "DELAYED", risk: "MEDIUM", days: 65 }
            ],
            agencies: [
                "Jal Nigam Engineering Division",
                "Rural Water Supply & Sanitation Mission",
                "State Water Resource Directorate",
                "District Swachhata Task Force"
            ],
            alertTemplates: [
                { type: "Delayed Project", title: "Water Pipeline Pressure Clearance Pending", severity: "HIGH", score: 79, desc: "Hydrostatic pressure testing delayed by 88 days due to canal crossing permissions." },
                { type: "Fund Utilization Anomaly", title: "Interim Milestone Voucher Discrepancy", severity: "MEDIUM", score: 62, desc: "Physical civil completion at 48% against 62% funds drawn by executing agency." },
                { type: "Quality Variance", title: "Filtration Membrane Certification Review", severity: "HIGH", score: 74, desc: "Third-party laboratory water purity compliance report pending submission." }
            ]
        },

        "Education & Digital Labs": {
            code: "EDL",
            baseAllocCr: 115.00,
            baseRelCr: 104.50,
            baseExpCr: 96.50,
            baseWorks: 395,
            completedRatio: 0.70,
            ongoingRatio: 0.21,
            delayedRatio: 0.06,
            pendingRatio: 0.03,
            alertsCount: 5,
            avgCostLakhs: 64.00,
            monthlyPattern: [7.8, 8.2, 9.1, 8.5, 7.2, 6.8, 8.9, 9.4, 8.1, 7.6, 8.7, 6.2],
            worksTemplates: [
                { title: "Smart ICT Interactive Classroom Computer Labs in 8 Schools", cost: 76.0, comp: 85, status: "ONGOING", risk: "LOW" },
                { title: "STEM Robotics & Innovation Science Learning Hub", cost: 58.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Girls Higher Secondary School Digital Library & E-Resource Wing", cost: 65.0, comp: 42, status: "DELAYED", risk: "CRITICAL", days: 112 },
                { title: "Composite Physics & Chemistry Senior Secondary Laboratories", cost: 52.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Virtual Tele-Education Satellite Studio & Audio-Visual Theatre", cost: 62.0, comp: 72, status: "ONGOING", risk: "MEDIUM" },
                { title: "Vocational AI & Coding Workshop for Rural High Schools", cost: 48.0, comp: 38, status: "DELAYED", risk: "HIGH", days: 75 }
            ],
            agencies: [
                "State Educational Infrastructure Corp",
                "Secondary Education Directorate",
                "District Education Council",
                "Samagra Shiksha Abhiyan"
            ],
            alertTemplates: [
                { type: "Delayed Project", title: "Computing Equipment Delivery SLA Breached", severity: "CRITICAL", score: 86, desc: "Vendor hardware delivery delayed by 112 days across secondary school clusters." },
                { type: "Fund Utilization Anomaly", title: "School Power Backup Sanction Unutilized", severity: "MEDIUM", score: 58, desc: "Unspent balance in solar inverter budget line item awaiting installation sign-off." },
                { type: "Compliance Review", title: "Optical Fiber Broadband Handover Variance", severity: "HIGH", score: 71, desc: "Digital lab connectivity awaiting block telecom exchange route commissioning." }
            ]
        },

        "Rural Roads & Bridges": {
            code: "RRB",
            baseAllocCr: 120.50,
            baseRelCr: 108.00,
            baseExpCr: 92.40,
            baseWorks: 360,
            completedRatio: 0.61,
            ongoingRatio: 0.26,
            delayedRatio: 0.09,
            pendingRatio: 0.04,
            alertsCount: 6,
            avgCostLakhs: 94.00,
            monthlyPattern: [5.5, 6.4, 7.8, 8.9, 9.2, 8.1, 6.5, 7.4, 8.6, 9.8, 8.4, 5.8],
            worksTemplates: [
                { title: "All-Weather Bituminous Link Road (4.8 km) from Mandi to NH", cost: 98.0, comp: 76, status: "ONGOING", risk: "MEDIUM" },
                { title: "Reinforced Concrete High-Level Culvert & Drainage Overpass", cost: 84.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Major Multi-Span Submersible Bridge over Regional River Canal", cost: 118.0, comp: 44, status: "DELAYED", risk: "CRITICAL", days: 125 },
                { title: "Panchayat Inter-Connecting Concrete Roadway & Walkways", cost: 65.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Heavy Transport Mandi Access Pavement & Storm Drainage", cost: 92.0, comp: 80, status: "ONGOING", risk: "LOW" },
                { title: "River Embankment Stone Pitching & Causeway Reconstruction", cost: 74.0, comp: 40, status: "DELAYED", risk: "HIGH", days: 95 }
            ],
            agencies: [
                "Public Works Department (PWD Rural Roads)",
                "State Bridge Construction Corporation",
                "Rural Engineering Services (RES)",
                "District Transport Infrastructure Directorate"
            ],
            alertTemplates: [
                { type: "Delayed Project", title: "Canal Bridge Foundation Pier Work Overdue", severity: "CRITICAL", score: 92, desc: "Foundation casting delayed by 125 days due to unseasonal monsoon water discharge." },
                { type: "Quality Variance", title: "Bituminous Compaction Density Flag", severity: "HIGH", score: 81, desc: "Core sample testing indicates sub-base compaction variance under MoRTH standards." },
                { type: "Fund Utilization Anomaly", title: "Contractor Stage Disbursement Reconciliation", severity: "MEDIUM", score: 65, desc: "Milestone payment certificate #4 held for physical layer thickness audit." }
            ]
        },

        "Public Health Infrastructure": {
            code: "PHI",
            baseAllocCr: 72.00,
            baseRelCr: 64.50,
            baseExpCr: 55.20,
            baseWorks: 210,
            completedRatio: 0.65,
            ongoingRatio: 0.24,
            delayedRatio: 0.08,
            pendingRatio: 0.03,
            alertsCount: 3,
            avgCostLakhs: 82.00,
            monthlyPattern: [4.2, 4.8, 5.1, 4.6, 3.9, 4.5, 5.2, 4.7, 5.0, 4.3, 4.8, 4.1],
            worksTemplates: [
                { title: "Primary Health Centre (PHC) Diagnostic & Radiology Special Wing", cost: 88.0, comp: 84, status: "ONGOING", risk: "LOW" },
                { title: "Rural Community Health Centre Solar Cold-Chain & Emergency Post", cost: 74.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Sub-District Hospital Oxygen Plant & Neonatal Critical Care", cost: 96.0, comp: 52, status: "DELAYED", risk: "CRITICAL", days: 105 },
                { title: "Maternal & Child Health Care Modernized Pathology Unit", cost: 60.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Mobile Tele-Medicine Diagnostic Van with Cardiac Telemetry", cost: 48.0, comp: 75, status: "ONGOING", risk: "MEDIUM" },
                { title: "Primary Care Centre Outpatient Renovation & Patient Shelter", cost: 42.0, comp: 35, status: "DELAYED", risk: "HIGH", days: 70 }
            ],
            agencies: [
                "District Health Society & CMO",
                "State Medical Supplies Corporation",
                "Health & Family Welfare Directorate",
                "PWD Health Civil Works Wing"
            ],
            alertTemplates: [
                { type: "Delayed Project", title: "Oxygen Generator Cryogenic Piping Delayed", severity: "CRITICAL", score: 89, desc: "High-pressure piping installation stalled for 105 days awaiting PESO certification." },
                { type: "Fund Utilization Anomaly", title: "Dialysis Equipment Procurement Pacing", severity: "MEDIUM", score: 60, desc: "Capital expenditure release tranche #2 unspent for 60 days at hospital treasury." },
                { type: "Quality Variance", title: "Cold-Chain Temperature Sensor Telemetry Alert", severity: "HIGH", score: 76, desc: "Sensor battery backup failed statutory 72-hour simulated power outage test." }
            ]
        },

        "Renewable Energy & Lighting": {
            code: "REL",
            baseAllocCr: 58.00,
            baseRelCr: 51.50,
            baseExpCr: 46.50,
            baseWorks: 185,
            completedRatio: 0.70,
            ongoingRatio: 0.21,
            delayedRatio: 0.06,
            pendingRatio: 0.03,
            alertsCount: 2,
            avgCostLakhs: 58.00,
            monthlyPattern: [3.5, 3.8, 4.1, 4.6, 4.2, 3.7, 3.9, 4.4, 4.0, 3.6, 3.9, 2.8],
            worksTemplates: [
                { title: "Solar High-Mast Street Illumination & Central Village Grids", cost: 62.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Rooftop Solar PV Microgrid (15 kW) for 12 Gram Panchayat Bhavans", cost: 78.0, comp: 74, status: "ONGOING", risk: "LOW" },
                { title: "Decentralized Solar Agricultural Feeder Pumping Installation", cost: 70.0, comp: 45, status: "DELAYED", risk: "HIGH", days: 82 },
                { title: "Solar LED Streetlighting across 25 Remote Rural Hamlets", cost: 52.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Battery Energy Storage System & Solar Micro-Substation", cost: 65.0, comp: 80, status: "ONGOING", risk: "MEDIUM" },
                { title: "Community Solar Water Heating & Streetlight Hybrid Station", cost: 36.0, comp: 40, status: "DELAYED", risk: "MEDIUM", days: 60 }
            ],
            agencies: [
                "Renewable Energy Development Agency (NEDA)",
                "State Solar Energy Corporation",
                "Rural Electrification Directorate",
                "State Energy Development Agency"
            ],
            alertTemplates: [
                { type: "Delayed Project", title: "Solar Feeder Transformer Grid Interconnection", severity: "HIGH", score: 78, desc: "Discom grid synchronization approval pending for 82 days for feeder pump." },
                { type: "Fund Utilization Anomaly", title: "Inverter Warranty Escrow Verification", severity: "MEDIUM", score: 55, desc: "Extended 5-year AMC deposit audit flagged for administrative validation." }
            ]
        },

        "Community Assets & Skills": {
            code: "CAS",
            baseAllocCr: 44.00,
            baseRelCr: 38.80,
            baseExpCr: 33.70,
            baseWorks: 115,
            completedRatio: 0.69,
            ongoingRatio: 0.22,
            delayedRatio: 0.06,
            pendingRatio: 0.03,
            alertsCount: 2,
            avgCostLakhs: 70.00,
            monthlyPattern: [2.8, 2.9, 3.1, 3.4, 3.0, 2.7, 3.2, 3.3, 2.6, 2.5, 2.8, 1.4],
            worksTemplates: [
                { title: "Multipurpose Skill Development & Rural Vocational Resource Hub", cost: 75.0, comp: 78, status: "ONGOING", risk: "LOW" },
                { title: "Farmers Kisan Mandi Multi-Commodity Solar Cold Storage", cost: 90.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Women Self-Help Group (SHG) Handloom & Craft Production Hub", cost: 64.0, comp: 38, status: "DELAYED", risk: "CRITICAL", days: 135 },
                { title: "Panchayat Multipurpose Assembly Hall & Cyclone/Flood Shelter", cost: 56.0, comp: 100, status: "COMPLETED", risk: "LOW" },
                { title: "Rural Youth Athletics Pavilion & Outdoor Sports Arena", cost: 50.0, comp: 82, status: "ONGOING", risk: "MEDIUM" },
                { title: "Common Service Digital Resource & E-Seva Community Center", cost: 42.0, comp: 32, status: "DELAYED", risk: "HIGH", days: 80 }
            ],
            agencies: [
                "District Rural Development Agency (DRDA)",
                "Agriculture Marketing Board",
                "Panchayati Raj Directorate",
                "State Skill Development Mission"
            ],
            alertTemplates: [
                { type: "Delayed Project", title: "Handloom Workshop Loom Delivery Delayed", severity: "CRITICAL", score: 85, desc: "Handloom machinery import shipment overdue by 135 days beyond contractual SLA." },
                { type: "Fund Utilization Anomaly", title: "Vocational Center Equipment Advance Settle", severity: "MEDIUM", score: 58, desc: "Equipment procurement advance awaiting physical asset register tagging." }
            ]
        }
    };

    // Realistic Proportional Weights for Districts (Normalized)
    const DISTRICT_WEIGHTS = {
        "Varanasi": 0.185,
        "Gorakhpur": 0.142,
        "Prayagraj": 0.155,
        "Lucknow": 0.170,
        "Ayodhya": 0.115,
        "Kanpur Nagar": 0.160,
        "Mirzapur": 0.092,
        "Jaunpur": 0.104
    };

    // Proportional Weights for Financial Years
    const FY_WEIGHTS = {
        "2025-26": 0.465,
        "2024-25": 0.345,
        "2023-24": 0.190
    };

    // Hash helper for deterministic random generation for unseen combinations
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    /**
     * Core Engine: Computes completely distinct, realistic data for ANY combination of filters.
     * Guaranteed strictly non-zero (> 0) on every field.
     */
    function calculateDataForCombination(criteria = {}) {
        const fy = criteria.fy && criteria.fy !== 'ALL' ? criteria.fy : 'ALL';
        const district = criteria.district && criteria.district !== 'ALL' ? criteria.district : 'ALL';
        const constituency = criteria.constituency && criteria.constituency !== 'ALL' ? criteria.constituency : 'ALL';
        const category = criteria.category && criteria.category !== 'ALL' ? criteria.category : 'ALL';
        const status = criteria.status && criteria.status !== 'ALL' ? criteria.status : 'ALL';
        const risk = criteria.risk && criteria.risk !== 'ALL' ? criteria.risk : 'ALL';

        // 1. Base Numbers Determination
        let allocCr = 0;
        let relCr = 0;
        let expCr = 0;
        let worksCount = 0;
        let alertsCount = 0;
        let compRatio = 0.67;
        let ongRatio = 0.22;
        let delRatio = 0.08;
        let pendRatio = 0.03;
        let monthlyCurve = [28.4, 29.8, 33.5, 36.2, 34.0, 31.8, 34.5, 33.2, 31.0, 32.5, 33.8, 22.0];

        if (category !== 'ALL' && CATEGORY_PROFILES[category]) {
            const prof = CATEGORY_PROFILES[category];
            allocCr = prof.baseAllocCr;
            relCr = prof.baseRelCr;
            expCr = prof.baseExpCr;
            worksCount = prof.baseWorks;
            alertsCount = prof.alertsCount;
            compRatio = prof.completedRatio;
            ongRatio = prof.ongoingRatio;
            delRatio = prof.delayedRatio;
            pendRatio = prof.pendingRatio;
            monthlyCurve = [...prof.monthlyPattern];
        } else {
            // Aggregate all categories for ALL
            Object.values(CATEGORY_PROFILES).forEach(prof => {
                allocCr += prof.baseAllocCr;
                relCr += prof.baseRelCr;
                expCr += prof.baseExpCr;
                worksCount += prof.baseWorks;
                alertsCount += prof.alertsCount;
            });
        }

        // 2. Apply District Scaling
        let distFactor = 1.0;
        if (district !== 'ALL') {
            const cleanD = district.trim();
            if (DISTRICT_WEIGHTS[cleanD]) {
                distFactor = DISTRICT_WEIGHTS[cleanD];
            } else {
                const h = hashString(cleanD);
                distFactor = 0.08 + (h % 10) * 0.01;
            }
            allocCr *= distFactor;
            relCr *= distFactor;
            expCr *= distFactor;
            worksCount = Math.round(worksCount * distFactor);
            alertsCount = Math.max(1, Math.round(alertsCount * distFactor * 1.5));
            monthlyCurve = monthlyCurve.map(v => Math.round(v * distFactor * 10) / 10);
        }

        // 3. Apply Financial Year Scaling
        let fyFactor = 1.0;
        if (fy !== 'ALL') {
            fyFactor = FY_WEIGHTS[fy] || 0.35;
            allocCr *= fyFactor;
            relCr *= fyFactor;
            expCr *= fyFactor;
            worksCount = Math.round(worksCount * fyFactor);
            alertsCount = Math.max(1, Math.round(alertsCount * fyFactor * 1.2));
            monthlyCurve = monthlyCurve.map(v => Math.round(v * fyFactor * 10) / 10);
        }

        // 4. Status Filtering Adjustments
        let completed = Math.round(worksCount * compRatio);
        let ongoing = Math.round(worksCount * ongRatio);
        let delayed = Math.round(worksCount * delRatio);
        let pending = Math.max(1, worksCount - completed - ongoing - delayed);

        if (status === 'COMPLETED') {
            completed = Math.max(3, Math.round(worksCount * 0.88));
            ongoing = 1;
            delayed = 1;
            pending = 1;
            worksCount = completed + ongoing + delayed + pending;
            expCr = relCr * 0.94; // Higher expenditure for completed filter
        } else if (status === 'ONGOING') {
            ongoing = Math.max(3, Math.round(worksCount * 0.72));
            completed = Math.max(1, Math.round(worksCount * 0.18));
            delayed = 1;
            pending = 1;
            worksCount = ongoing + completed + delayed + pending;
            expCr = relCr * 0.76;
        } else if (status === 'DELAYED') {
            delayed = Math.max(2, Math.round(worksCount * 0.65));
            ongoing = Math.max(1, Math.round(worksCount * 0.20));
            completed = Math.max(1, Math.round(worksCount * 0.12));
            pending = 1;
            worksCount = delayed + ongoing + completed + pending;
            expCr = relCr * 0.58;
            alertsCount = Math.max(alertsCount, delayed + 1);
        } else if (status === 'PENDING') {
            pending = Math.max(2, Math.round(worksCount * 0.60));
            ongoing = 2;
            completed = 1;
            delayed = 1;
            worksCount = pending + ongoing + completed + delayed;
            expCr = relCr * 0.42;
        }

        // 5. Risk Filtering Adjustments
        if (risk === 'HIGH' || risk === 'CRITICAL') {
            delayed = Math.max(delayed, 3);
            alertsCount = Math.max(alertsCount, 3);
        }

        // 6. Hard Guarantees - Strictly Non-Zero Baseline
        allocCr = Math.max(Math.round(allocCr * 100) / 100, 1.45);
        relCr = Math.max(Math.round(relCr * 100) / 100, Math.round(allocCr * 0.85 * 100) / 100);
        if (relCr > allocCr) relCr = Math.round(allocCr * 0.92 * 100) / 100;
        relCr = Math.max(relCr, 1.20);

        expCr = Math.max(Math.round(expCr * 100) / 100, Math.round(relCr * 0.78 * 100) / 100);
        if (expCr > relCr) expCr = Math.round(relCr * 0.88 * 100) / 100;
        expCr = Math.max(expCr, 0.95);

        const availableBalCr = Math.max(Math.round((allocCr - expCr) * 100) / 100, 0.25);
        const utilizationRate = Math.min(99.5, Math.max(54.2, Math.round((expCr / relCr) * 1000) / 10));

        worksCount = Math.max(worksCount, 4);
        completed = Math.max(completed, 1);
        ongoing = Math.max(ongoing, 1);
        delayed = Math.max(delayed, 1);
        pending = Math.max(pending, 1);
        alertsCount = Math.max(alertsCount, 1);

        const transactionsCount = Math.max(3, Math.round(worksCount * 0.85 + 4));

        // Ensure monthly curve has strictly positive numbers
        monthlyCurve = monthlyCurve.map(v => Math.max(0.45, Math.round((Number(v) || 1.2) * 10) / 10));

        // 7. District distribution for grouped and horizontal bar charts
        const targetDistricts = ["Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar", "Mirzapur", "Jaunpur"];
        const districtDistributions = targetDistricts.map(dName => {
            const w = DISTRICT_WEIGHTS[dName] || 0.12;
            const normW = w / 0.185; // relative to Varanasi
            const dAlloc = Math.max(0.65, Math.round(allocCr * (w / 1.0) * 4.5 * 10) / 10);
            const dRel = Math.max(0.55, Math.round(dAlloc * 0.88 * 10) / 10);
            const dExp = Math.max(0.45, Math.round(dRel * (utilizationRate / 100) * 10) / 10);
            const dUtil = Math.min(98.5, Math.max(58.0, Math.round((dExp / dRel) * 1000) / 10));
            return {
                district: dName,
                allocated: dAlloc,
                released: dRel,
                expenditure: dExp,
                utilizationPct: dUtil
            };
        });

        // 8. Sector breakdown distribution
        const sectorBreakdown = CATEGORIES.map(cName => {
            const prof = CATEGORY_PROFILES[cName];
            let sAlloc = prof.baseAllocCr * distFactor * fyFactor;
            let sExp = prof.baseExpCr * distFactor * fyFactor;
            sAlloc = Math.max(0.40, Math.round(sAlloc * 10) / 10);
            sExp = Math.max(0.30, Math.round(sExp * 10) / 10);
            return {
                sector: cName,
                allocationCr: sAlloc,
                expenditureCr: sExp,
                count: Math.max(2, Math.round(prof.baseWorks * distFactor * fyFactor))
            };
        });

        return {
            totalAllocationCr: allocCr,
            fundsReleasedCr: relCr,
            totalExpenditureCr: expCr,
            availableBalanceCr: availableBalCr,
            utilizationRatePct: utilizationRate,
            totalWorks: worksCount,
            completedWorks: completed,
            ongoingWorks: ongoing,
            delayedWorks: delayed,
            pendingWorks: pending,
            activeAlerts: alertsCount,
            transactionsCount: transactionsCount,
            monthlyCurve: monthlyCurve,
            districtDistributions: districtDistributions,
            sectorBreakdown: sectorBreakdown
        };
    }

    /**
     * Generates rich, distinct works customized to ANY filter criteria.
     * Guaranteed strictly non-zero amounts and positive progress.
     * Supports both criteria object { category, district, ... } and individual positional arguments.
     */
    function generateWorksForCombination(criteria = {}, optDistrict, optFy, optStatus, optRisk) {
        let opts = {};
        if (typeof criteria === 'string') {
            opts = {
                category: criteria,
                district: optDistrict || 'Varanasi',
                fy: optFy || '2025-26',
                status: optStatus || 'ALL',
                risk: optRisk || 'ALL'
            };
        } else {
            opts = criteria || {};
        }

        const fy = opts.fy && opts.fy !== 'ALL' ? opts.fy : '2025-26';
        const district = opts.district && opts.district !== 'ALL' ? opts.district : 'Varanasi';
        const constituency = opts.constituency && opts.constituency !== 'ALL' ? opts.constituency : `${district} (PC-77)`;
        const category = opts.category && opts.category !== 'ALL' ? opts.category : 'ALL';
        const status = opts.status && opts.status !== 'ALL' ? opts.status : 'ALL';
        const risk = opts.risk && opts.risk !== 'ALL' ? opts.risk : 'ALL';

        const catsToGenerate = category !== 'ALL' ? [category] : CATEGORIES;
        const results = [];

        catsToGenerate.forEach((catName, catIdx) => {
            const prof = CATEGORY_PROFILES[catName] || CATEGORY_PROFILES["Drinking Water & Sanitation"];
            const templates = prof.worksTemplates;

            // Generate at least 2 works per category when ALL (total 12 works), or all templates when specific category
            const countToTake = category === 'ALL' ? 2 : templates.length;
            templates.slice(0, countToTake).forEach((tmpl, idx) => {
                let itemStatus = tmpl.status;
                if (status !== 'ALL') {
                    itemStatus = status;
                }
                let itemRisk = tmpl.risk;
                if (risk !== 'ALL') {
                    itemRisk = risk;
                }

                const isDel = itemStatus === 'DELAYED';
                const isComp = itemStatus === 'COMPLETED';
                let compPct = isComp ? 100 : (itemStatus === 'ONGOING' ? Math.max(55, tmpl.comp) : (isDel ? Math.max(30, tmpl.comp) : 25));

                // Dynamic district multiplier & deterministic variance so every district shows distinct amounts
                const distMult = (DISTRICT_WEIGHTS[district] || 0.14) / 0.185;
                const variance = ((hashString(district + catName + idx) % 15) - 7) * 0.8;
                const baseCost = tmpl.cost * (0.80 + distMult * 0.32) + (idx * 5.2) + variance;
                const approved = Math.max(32.5, Math.round(baseCost * 10) / 10);
                const released = isComp ? approved : Math.max(26.0, Math.round(approved * (0.84 + distMult * 0.05) * 10) / 10);
                const spent = isComp ? released : Math.max(20.0, Math.round(released * (compPct / 100) * 10) / 10);
                const delayDays = isDel ? (tmpl.days || (75 + idx * 15)) : 0;
                const agency = prof.agencies[idx % prof.agencies.length] + ` (${district})`;

                const workId = `WRK-2026-${prof.code}-${district.substring(0, 3).toUpperCase()}-${String(100 + catIdx * 10 + idx).padStart(3, '0')}`;

                results.push({
                    id: workId,
                    name: `${tmpl.title}, ${district}`,
                    district: district,
                    constituency: constituency,
                    mp: `Hon. MP (${district})`,
                    financialYear: fy,
                    category: catName,
                    approvedAmountLakhs: approved,
                    releasedAmountLakhs: released,
                    expenditureLakhs: spent,
                    completionPct: compPct,
                    status: itemStatus,
                    risk: itemRisk,
                    monitoringStatus: isDel ? "Attention Needed" : (itemStatus === 'ONGOING' ? "Normal" : "Completed"),
                    monitoringObservations: isDel ?
                        `Milestone delivery overdue by ${delayDays} days. Formal compliance directive dispatched to ${agency}.` :
                        `Physical execution compliant with MoSPI technical norms. Statutory inspection cleared.`,
                    daysDelayed: delayDays,
                    lastUpdated: "2026-09-22",
                    startDate: fy === '2023-24' ? "2023-09-15" : (fy === '2024-25' ? "2024-10-10" : "2025-07-15"),
                    expectedCompletion: isComp ? "2026-04-30" : "2026-12-31",
                    actualCompletion: isComp ? "2026-04-15" : null,
                    implementingAgency: agency,
                    description: `${tmpl.title} sanctioned under MPLADS priority allocation for ${district} (${constituency}).`,
                    milestones: [
                        { title: "Technical Sanction & Geo-Survey", plannedDate: "2025-08-10", actualDate: "2025-08-15", status: "COMPLETED" },
                        { title: "Civil Foundations & Assembly", plannedDate: "2026-02-28", actualDate: compPct > 50 ? "2026-03-05" : null, status: compPct > 50 ? "COMPLETED" : (isDel ? "DELAYED" : "ONGOING") },
                        { title: "Final Commissioning & Audit", plannedDate: "2026-10-31", actualDate: isComp ? "2026-04-15" : null, status: isComp ? "COMPLETED" : "PENDING" }
                    ],
                    timeline: [
                        { event: "Administrative Sanction Issued", date: "2025-07-05", category: "Approval", desc: `Sanction recorded by Nodal Officer (${district}).` },
                        { event: "First Installment Disbursed", date: "2025-07-28", category: "Release", desc: `Disbursed ₹${released} Lakhs via PFMS SNA gateway.` }
                    ],
                    coordinates: { lat: 25.32 + (idx * 0.05), lng: 82.98 + (idx * 0.05) }
                });
            });
        });

        return results;
    }

    /**
     * Generates rich, distinct transactions customized to ANY filter criteria.
     */
    function generateTransactionsForCombination(criteria = {}) {
        const works = generateWorksForCombination(criteria);
        const fy = criteria.fy && criteria.fy !== 'ALL' ? criteria.fy : '2025-26';
        const district = criteria.district && criteria.district !== 'ALL' ? criteria.district : 'Varanasi';
        const category = criteria.category && criteria.category !== 'ALL' ? criteria.category : 'Drinking Water & Sanitation';
        const type = criteria.type && criteria.type !== 'ALL' ? criteria.type : 'ALL';

        const txns = [];
        let txCount = 100;

        works.forEach((w, idx) => {
            txCount++;
            if (type === 'ALL' || type === 'ALLOCATION') {
                txns.push({
                    id: `TXN-2026-ALC-${txCount}`,
                    workId: w.id,
                    workName: w.name,
                    district: w.district,
                    constituency: w.constituency,
                    category: w.category,
                    financialYear: fy,
                    type: "ALLOCATION",
                    amountLakhs: w.approvedAmountLakhs,
                    date: "2025-07-05",
                    reference: `SANCTION/${fy}/${district.substring(0, 3).toUpperCase()}-${100 + idx}`,
                    status: "COMPLETED",
                    description: `Approved budget allocation sanction for ${w.name}`
                });
            }

            txCount++;
            if (type === 'ALL' || type === 'RELEASE') {
                txns.push({
                    id: `TXN-2026-REL-${txCount}`,
                    workId: w.id,
                    workName: w.name,
                    district: w.district,
                    constituency: w.constituency,
                    category: w.category,
                    financialYear: fy,
                    type: "RELEASE",
                    amountLakhs: w.releasedAmountLakhs,
                    date: "2025-07-28",
                    reference: `TREASURY-REL-${7000 + idx * 45}`,
                    status: "COMPLETED",
                    description: `Grant installment disbursed to ${w.implementingAgency}`
                });
            }

            txCount++;
            if (type === 'ALL' || type === 'EXPENDITURE') {
                txns.push({
                    id: `TXN-2026-EXP-${txCount}`,
                    workId: w.id,
                    workName: w.name,
                    district: w.district,
                    constituency: w.constituency,
                    category: w.category,
                    financialYear: fy,
                    type: "EXPENDITURE",
                    amountLakhs: w.expenditureLakhs,
                    date: "2026-02-18",
                    reference: `PFMS-VOUCHER-${12000 + idx * 65}`,
                    status: "COMPLETED",
                    description: `Physical milestone voucher payment settled for ${w.name}`
                });
            }
        });

        return txns;
    }

    /**
     * Generates rich, category-specific alerts for the dashboard and alerts pages.
     */
    function generateAlertsForCombination(criteria = {}) {
        const district = criteria.district && criteria.district !== 'ALL' ? criteria.district : 'Varanasi';
        const category = criteria.category && criteria.category !== 'ALL' ? criteria.category : 'Drinking Water & Sanitation';
        const risk = criteria.risk && criteria.risk !== 'ALL' ? criteria.risk : 'ALL';

        const prof = CATEGORY_PROFILES[category] || CATEGORY_PROFILES["Drinking Water & Sanitation"];
        const alerts = [];

        prof.alertTemplates.forEach((tmpl, idx) => {
            const sev = risk !== 'ALL' ? risk : tmpl.severity;
            alerts.push({
                id: `ALT-2026-${prof.code}-${101 + idx}`,
                type: tmpl.type,
                workId: `WRK-2026-${prof.code}-${district.substring(0, 3).toUpperCase()}-10${idx + 1}`,
                workName: `${tmpl.title} (${district})`,
                district: district,
                constituency: `${district} (PC-77)`,
                category: category,
                severity: sev,
                riskScore: sev === 'CRITICAL' ? 88 : (sev === 'HIGH' ? 76 : 58),
                detectedDate: "2026-09-15",
                status: "UNDER_REVIEW",
                description: `${tmpl.desc} Flagged in ${district} by automated MoSPI telemetry.`,
                reason: "Contractor supply chain coordination and local technical clearance backlog.",
                evidence: `Approved: ₹${75.0 + idx * 10} L | Expenditure: ₹${48.0 + idx * 8} L | Monitored Progress: ${45 + idx * 10}%`,
                history: `Nodal Quality Inspector conducted site inspection on 2026-09-18 in ${district}.`,
                assignedTo: { officer: "District Nodal Officer", department: `Collectorate of ${district}`, assignedDate: "2026-09-16" }
            });
        });

        return alerts;
    }

    const DISTRICT_METADATA = {
        "Varanasi": { nodalOfficer: "Dr. R. K. Sharma, IAS", hq: "Collectorate Varanasi", constituency: "Varanasi (PC-77)", grade: "Grade A+", inspection: "2026-09-22" },
        "Gorakhpur": { nodalOfficer: "Shri Manoj Kumar, IAS", hq: "Vikas Bhawan Gorakhpur", constituency: "Gorakhpur (PC-64)", grade: "Grade A", inspection: "2026-09-20" },
        "Prayagraj": { nodalOfficer: "Smt. Ananya Singh, IAS", hq: "Sangam Collectorate", constituency: "Prayagraj (PC-52)", grade: "Grade A+", inspection: "2026-09-21" },
        "Lucknow": { nodalOfficer: "Dr. Surya Pal Gangwar, IAS", hq: "Qaiserbagh Collectorate", constituency: "Lucknow (PC-35)", grade: "Grade A+", inspection: "2026-09-23" },
        "Ayodhya": { nodalOfficer: "Shri Nitish Kumar, IAS", hq: "Civil Lines Collectorate", constituency: "Ayodhya (PC-54)", grade: "Grade A", inspection: "2026-09-19" },
        "Kanpur Nagar": { nodalOfficer: "Shri Rakesh Singh, IAS", hq: "VIP Road Collectorate", constituency: "Kanpur (PC-43)", grade: "Grade A", inspection: "2026-09-18" },
        "Mirzapur": { nodalOfficer: "Smt. Divya Mittal, IAS", hq: "Mirzapur District HQ", constituency: "Mirzapur (PC-79)", grade: "Satisfactory", inspection: "2026-09-17" },
        "Jaunpur": { nodalOfficer: "Shri Ravindra Kumar, IAS", hq: "Collectorate Jaunpur", constituency: "Jaunpur (PC-73)", grade: "Satisfactory", inspection: "2026-09-16" }
    };

    /**
     * Aggregates real-time monitoring scorecards for EVERY individual district.
     * Guaranteed strictly non-zero (> 0) on every single metric and count.
     */
    function getDistrictMonitoringSummaries(criteria = {}) {
        const districtList = Object.keys(DISTRICT_WEIGHTS);
        const fy = criteria.fy && criteria.fy !== 'ALL' ? criteria.fy : 'ALL';
        const category = criteria.category && criteria.category !== 'ALL' ? criteria.category : 'ALL';
        const status = criteria.status && criteria.status !== 'ALL' ? criteria.status : 'ALL';
        const risk = criteria.risk && criteria.risk !== 'ALL' ? criteria.risk : 'ALL';

        return districtList.map(districtName => {
            const meta = DISTRICT_METADATA[districtName] || {
                nodalOfficer: "District Magistrate",
                hq: `${districtName} Collectorate`,
                constituency: `${districtName} (PC-General)`,
                grade: "Grade A",
                inspection: "2026-09-15"
            };

            const dData = calculateDataForCombination({
                district: districtName,
                fy: fy,
                category: category,
                status: status,
                risk: risk
            });

            const totalWorks = Math.max(dData.totalWorks, 8);
            const completedWorks = Math.max(dData.completedWorks, 4);
            const ongoingWorks = Math.max(dData.ongoingWorks, 3);
            const delayedWorks = Math.max(dData.delayedWorks, 1);
            const utilizationPct = dData.utilizationRatePct || 86.4;
            const physicalProgressPct = Math.min(99, Math.max(68, Math.round(utilizationPct * 0.94 + 5)));

            return {
                district: districtName,
                nodalOfficer: meta.nodalOfficer,
                hq: meta.hq,
                constituency: meta.constituency,
                totalWorks: totalWorks,
                completedWorks: completedWorks,
                ongoingWorks: ongoingWorks,
                delayedWorks: delayedWorks,
                allocatedCr: dData.totalAllocationCr,
                releasedCr: dData.fundsReleasedCr,
                expenditureCr: dData.totalExpenditureCr,
                unspentBalanceCr: dData.availableBalanceCr,
                utilizationPct: utilizationPct,
                physicalProgressPct: physicalProgressPct,
                alertsCount: Math.max(dData.activeAlerts, 1),
                riskLevel: dData.delayedWorks > 3 ? 'HIGH' : 'LOW',
                complianceGrade: meta.grade,
                lastInspection: meta.inspection,
                statusSummary: `${completedWorks} Done • ${ongoingWorks} Active • ${delayedWorks} Delayed`
            };
        });
    }

    /**
     * Incrementally increases the specific category's allocation/release/expenditure
     * whenever a user records a transaction!
     */
    function recordCategoryTransaction(category, type, amountLakhs) {
        const amount = Number(amountLakhs) || 0;
        if (amount <= 0) return null;
        const amountCr = Math.round((amount / 100) * 1000) / 1000;
        const cat = CATEGORY_PROFILES[category] ? category : "Drinking Water & Sanitation";
        const prof = CATEGORY_PROFILES[cat];

        if (type === 'ALLOCATION') {
            prof.baseAllocCr = Math.round((prof.baseAllocCr + amountCr) * 100) / 100;
        } else if (type === 'RELEASE') {
            prof.baseRelCr = Math.round((prof.baseRelCr + amountCr) * 100) / 100;
            if (prof.baseRelCr > prof.baseAllocCr) {
                prof.baseAllocCr = prof.baseRelCr;
            }
        } else if (type === 'EXPENDITURE') {
            prof.baseExpCr = Math.round((prof.baseExpCr + amountCr) * 100) / 100;
            if (prof.baseExpCr > prof.baseRelCr) {
                prof.baseRelCr = prof.baseExpCr;
            }
            if (prof.baseRelCr > prof.baseAllocCr) {
                prof.baseAllocCr = prof.baseRelCr;
            }
        } else if (type === 'REFUND') {
            prof.baseExpCr = Math.max(0.95, Math.round((prof.baseExpCr - amountCr) * 100) / 100);
        }

        return {
            category: cat,
            type: type,
            amountAddedLakhs: amount,
            amountAddedCr: amountCr,
            newAllocCr: prof.baseAllocCr,
            newRelCr: prof.baseRelCr,
            newExpCr: prof.baseExpCr
        };
    }

    // Expose engine to global window and module exports
    const MPLADS_DATA_ENGINE = {
        CATEGORIES,
        CATEGORY_PROFILES,
        DISTRICT_WEIGHTS,
        DISTRICT_METADATA,
        FY_WEIGHTS,
        calculateDataForCombination,
        generateWorksForCombination,
        generateTransactionsForCombination,
        generateAlertsForCombination,
        getDistrictMonitoringSummaries,
        recordCategoryTransaction
    };

    if (typeof window !== 'undefined') {
        window.MPLADS_DATA_ENGINE = MPLADS_DATA_ENGINE;
    }

    if (typeof module !== 'undefined') {
        module.exports = MPLADS_DATA_ENGINE;
    }
})();
