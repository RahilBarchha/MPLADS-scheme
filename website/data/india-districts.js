/**
 * ==============================================================================
 * Pan-India Administrative Division Dataset (All States, UTs & Major Districts)
 * Ministry of Statistics and Programme Implementation (MoSPI), Govt of India
 * ==============================================================================
 */

const INDIA_STATES_DISTRICTS = {
    "Andhra Pradesh": [
        "Visakhapatnam", "NTR (Vijayawada)", "Guntur", "Tirupati", "Kurnool", 
        "Kakinada", "Anantapur", "Nellore", "YSR Kadapa", "Srikakulam", "Chittoor", "Prakasam"
    ],
    "Arunachal Pradesh": [
        "Papum Pare (Itanagar)", "Tawang", "Changlang", "West Kameng", "East Siang (Pasighat)", "Lower Subansiri"
    ],
    "Assam": [
        "Kamrup Metropolitan (Guwahati)", "Dibrugarh", "Cachar (Silchar)", "Jorhat", 
        "Nagaon", "Sonitpur (Tezpur)", "Tinsukia", "Barpeta", "Darrang", "Bongaigaon"
    ],
    "Bihar": [
        "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", 
        "Purnia", "Nalanda (Bihar Sharif)", "Begusarai", "Saran (Chhapra)", "Rohtas (Sasaram)", "Samastipur", "Vaishali"
    ],
    "Chhattisgarh": [
        "Raipur", "Bilaspur", "Durg", "Korba", "Bastar (Jagdalpur)", "Rajnandgaon", "Raigarh", "Surguja"
    ],
    "Delhi (NCT)": [
        "New Delhi", "Central Delhi", "South Delhi", "North Delhi", 
        "West Delhi", "East Delhi", "South West Delhi", "North East Delhi", "Shahdara"
    ],
    "Goa": [
        "North Goa (Panaji)", "South Goa (Margao)"
    ],
    "Gujarat": [
        "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", 
        "Jamnagar", "Gandhinagar", "Junagadh", "Kutch (Bhuj)", "Anand", "Bharuch", "Mehsana"
    ],
    "Haryana": [
        "Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", 
        "Hisar", "Rohtak", "Panchkula", "Sonipat", "Yamunanagar", "Sirsa"
    ],
    "Himachal Pradesh": [
        "Shimla", "Kangra (Dharamshala)", "Mandi", "Kullu", "Solan", "Hamirpur", "Sirmaur", "Chamba"
    ],
    "Jammu & Kashmir": [
        "Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Rajouri", "Kathua", "Pulwama", "Kupwara"
    ],
    "Jharkhand": [
        "Ranchi", "East Singhbhum (Jamshedpur)", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Palamu", "Giridih"
    ],
    "Karnataka": [
        "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Dharwad (Hubballi)", "Belagavi", 
        "Dakshina Kannada (Mangaluru)", "Kalaburagi", "Ballari", "Tumakuru", "Shivamogga", "Udupi", "Hassan"
    ],
    "Kerala": [
        "Thiruvananthapuram", "Ernakulam (Kochi)", "Kozhikode", "Thrissur", "Malappuram", 
        "Kollam", "Palakkad", "Kannur", "Kottayam", "Alappuzha", "Idukki", "Wayanad"
    ],
    "Ladakh": [
        "Leh", "Kargil"
    ],
    "Madhya Pradesh": [
        "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", 
        "Sagar", "Rewa", "Satna", "Ratlam", "Dewas", "Chhindwara", "Shivpuri"
    ],
    "Maharashtra": [
        "Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", 
        "Nashik", "Chhatrapati Sambhajinagar (Aurangabad)", "Solapur", "Kolhapur", "Amravati", "Nanded", "Jalgaon"
    ],
    "Manipur": [
        "Imphal West", "Imphal East", "Churachandpur", "Thoubal", "Bishnupur"
    ],
    "Meghalaya": [
        "East Khasi Hills (Shillong)", "West Garo Hills (Tura)", "Ri-Bhoi", "West Jaintia Hills"
    ],
    "Mizoram": [
        "Aizawl", "Lunglei", "Champhai", "Kolasib"
    ],
    "Nagaland": [
        "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"
    ],
    "Odisha": [
        "Khordha (Bhubaneswar)", "Cuttack", "Ganjam (Berhampur)", "Sundargarh (Rourkela)", 
        "Sambalpur", "Balasore", "Puri", "Mayurbhanj", "Bhadrak", "Koraput"
    ],
    "Punjab": [
        "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", 
        "SAS Nagar (Mohali)", "Hoshiarpur", "Gurdaspur", "Pathankot", "Firozpur"
    ],
    "Rajasthan": [
        "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", 
        "Udaipur", "Bhilwara", "Alwar", "Sikar", "Bharatpur", "Pali", "Ganganagar"
    ],
    "Sikkim": [
        "Gangtok", "Gyalshing", "Namchi", "Mangan"
    ],
    "Tamil Nadu": [
        "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", 
        "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Kanchipuram", "Dindigul", "Tiruppur"
    ],
    "Telangana": [
        "Hyderabad", "Rangareddy", "Medchal-Malkajgiri", "Warangal Urban (Hanamkonda)", 
        "Karimnagar", "Nizamabad", "Khammam", "Nalgonda", "Mahbubnagar", "Sangareddy"
    ],
    "Tripura": [
        "West Tripura (Agartala)", "Gomati (Udaipur)", "South Tripura", "Dhalai"
    ],
    "Uttar Pradesh": [
        "Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", 
        "Kanpur Nagar", "Mirzapur", "Jaunpur", "Agra", "Meerut", 
        "Ghaziabad", "Bareilly", "Aligarh", "Moradabad", "Jhansi", 
        "Saharanpur", "Mathura", "Firozabad", "Basti", "Azamgarh", 
        "Ballia", "Ghazipur", "Deoria", "Sitapur", "Rae Bareli", 
        "Sultanpur", "Pratapgarh", "Gonda", "Bahraich", "Banda"
    ],
    "Uttarakhand": [
        "Dehradun", "Haridwar", "Nainital", "Udham Singh Nagar", "Almora", "Pauri Garhwal", "Chamoli", "Tehri Garhwal"
    ],
    "West Bengal": [
        "Kolkata", "North 24 Parganas", "South 24 Parganas", "Howrah", "Hooghly", 
        "Paschim Medinipur", "Darjeeling", "Jalpaiguri", "Murshidabad", "Malda", "Nadia", "Purba Bardhaman"
    ],
    "Chandigarh": [
        "Chandigarh"
    ],
    "Puducherry": [
        "Puducherry", "Karaikal", "Mahe", "Yanam"
    ],
    "Andaman & Nicobar": [
        "South Andaman (Port Blair)", "North & Middle Andaman", "Nicobar"
    ],
    "Dadra and Nagar Haveli and Daman and Diu": [
        "Daman", "Diu", "Dadra & Nagar Haveli (Silvassa)"
    ],
    "Lakshadweep": [
        "Kavaratti", "Agatti", "Amini"
    ]
};

const ALL_INDIA_DISTRICTS = Object.values(INDIA_STATES_DISTRICTS).flat();

// Primary administrative pilot focus districts
const PILOT_DISTRICTS = [
    "Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar", "Mirzapur", "Jaunpur"
];

// Helper: Lookup state by district name
function getStateForDistrict(districtName) {
    if (!districtName) return "Uttar Pradesh";
    const clean = districtName.trim().toLowerCase();
    for (const [state, dists] of Object.entries(INDIA_STATES_DISTRICTS)) {
        if (dists.some(d => d.toLowerCase() === clean)) {
            return state;
        }
    }
    return "Uttar Pradesh";
}

// Universal District Options Renderer for all filters and dropdowns
function renderDistrictOptions(selectElement, selectedVal = 'ALL', config = {}) {
    const {
        includeAll = true,
        allLabel = 'All Districts',
        allValue = 'ALL',
        promptOption = null
    } = config;

    let html = '';
    if (promptOption) {
        html += `<option value="" ${!selectedVal ? 'selected' : ''}>${promptOption}</option>`;
    } else if (includeAll) {
        html += `<option value="${allValue}" ${selectedVal === allValue ? 'selected' : ''}>${allLabel}</option>`;
    }

    const sortedStates = Object.keys(INDIA_STATES_DISTRICTS).sort();
    sortedStates.forEach(state => {
        const dists = INDIA_STATES_DISTRICTS[state];
        html += `<optgroup label="${state}">`;
        dists.forEach(d => {
            const isSel = selectedVal === d ? 'selected' : '';
            html += `<option value="${d}" ${isSel}>${d}</option>`;
        });
        html += '</optgroup>';
    });

    if (selectElement) {
        selectElement.innerHTML = html;
        if (selectedVal !== undefined && selectedVal !== null) {
            selectElement.value = selectedVal;
        }
    }
    return html;
}

// ==============================================================================
// Comprehensive Synthetic Data Engine for All Indian Districts
// Generates realistic funds, works, transactions, and alert telemetry for all 301 districts
// ==============================================================================
const STATE_COORDINATES = {
    "Andhra Pradesh": [15.9129, 79.7400], "Arunachal Pradesh": [28.2180, 94.7278], "Assam": [26.2006, 92.9376],
    "Bihar": [25.0961, 85.3131], "Chhattisgarh": [21.2787, 81.8661], "Delhi (NCT)": [28.6139, 77.2090],
    "Goa": [15.2993, 74.1240], "Gujarat": [22.2587, 71.1924], "Haryana": [29.0588, 76.0856],
    "Himachal Pradesh": [31.1048, 77.1734], "Jammu & Kashmir": [33.7782, 76.5762], "Jharkhand": [23.6102, 85.2799],
    "Karnataka": [15.3173, 75.7139], "Kerala": [10.8505, 76.2711], "Ladakh": [34.1526, 77.5771],
    "Madhya Pradesh": [22.9734, 78.6569], "Maharashtra": [19.7515, 75.7139], "Manipur": [24.6637, 93.9063],
    "Meghalaya": [25.4670, 91.3662], "Mizoram": [23.1645, 92.9376], "Nagaland": [26.1584, 94.5624],
    "Odisha": [20.9517, 85.0985], "Punjab": [31.1471, 75.3412], "Rajasthan": [27.0238, 74.2179],
    "Sikkim": [27.5330, 88.5122], "Tamil Nadu": [11.1271, 78.6569], "Telangana": [18.1124, 79.0193],
    "Tripura": [23.9408, 91.9882], "Uttar Pradesh": [26.8467, 80.9462], "Uttarakhand": [30.0668, 79.0193],
    "West Bengal": [22.9868, 87.8550], "Chandigarh": [30.7333, 76.7794], "Puducherry": [11.9416, 79.8083],
    "Andaman & Nicobar": [11.7401, 92.6586], "Dadra and Nagar Haveli and Daman and Diu": [20.4283, 72.8397],
    "Lakshadweep": [10.5667, 72.6417]
};

function _stringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function _seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function enrichMockDataForAllDistricts(targetData) {
    if (!targetData) {
        if (typeof window !== 'undefined' && window.MPLADS_DEMO_DATA) {
            targetData = window.MPLADS_DEMO_DATA;
        } else {
            return;
        }
    }

    if (targetData._enrichedWithAllDistricts) return;
    targetData._enrichedWithAllDistricts = true;

    if (!Array.isArray(targetData.districtUtilization)) {
        targetData.districtUtilization = [];
    }
    if (!Array.isArray(targetData.works)) {
        targetData.works = [];
    }
    if (!Array.isArray(targetData.alerts)) {
        targetData.alerts = [];
    }
    if (!Array.isArray(targetData.financialTransactions)) {
        targetData.financialTransactions = [];
    }

    const CANONICAL_CONSTITUENCIES = {
        "varanasi": "Varanasi (PC-77)",
        "gorakhpur": "Gorakhpur (PC-64)",
        "prayagraj": "Prayagraj (PC-52)",
        "lucknow": "Lucknow (PC-35)",
        "ayodhya": "Ayodhya (PC-54)",
        "kanpur nagar": "Kanpur (PC-43)",
        "kanpur": "Kanpur (PC-43)",
        "mirzapur": "Mirzapur (PC-79)",
        "jaunpur": "Jaunpur (PC-73)"
    };

    const existingUtilDistricts = new Set(
        targetData.districtUtilization.map(d => (d.district || '').toLowerCase().trim())
    );

    // 1. FAST-PASS: Generate realistic utilization profiles for ALL 301 districts (< 2ms)
    // Ensures KPI cards and district charts never display 0 for any selected district
    for (const [state, dists] of Object.entries(INDIA_STATES_DISTRICTS)) {
        dists.forEach(district => {
            const cleanDist = district.trim();
            const lowerDist = cleanDist.toLowerCase();
            const h = _stringHash(cleanDist + state);
            const rng = _seededRandom(h);

            if (!existingUtilDistricts.has(lowerDist)) {
                const allocated = Math.round((38.0 + rng() * 22.0) * 10) / 10;
                const relRatio = 0.85 + rng() * 0.10;
                const released = Math.round((allocated * relRatio) * 10) / 10;
                const expRatio = 0.78 + rng() * 0.14;
                const expenditure = Math.round((released * expRatio) * 10) / 10;
                const utilizationPct = Math.round((expenditure / released) * 1000) / 10;
                const totalWorks = 18 + Math.floor(rng() * 16);

                const byYear = {
                    '2025-26': {
                        allocated: Math.round(allocated * 0.45 * 10) / 10,
                        released: Math.round(released * 0.44 * 10) / 10,
                        expenditure: Math.round(expenditure * 0.42 * 10) / 10,
                        utilizationPct: Math.round((expenditure * 0.42 / (released * 0.44)) * 1000) / 10,
                        totalWorks: Math.max(3, Math.round(totalWorks * 0.45))
                    },
                    '2024-25': {
                        allocated: Math.round(allocated * 0.35 * 10) / 10,
                        released: Math.round(released * 0.36 * 10) / 10,
                        expenditure: Math.round(expenditure * 0.37 * 10) / 10,
                        utilizationPct: Math.round((expenditure * 0.37 / (released * 0.36)) * 1000) / 10,
                        totalWorks: Math.max(3, Math.round(totalWorks * 0.35))
                    },
                    '2023-24': {
                        allocated: Math.round(allocated * 0.20 * 10) / 10,
                        released: Math.round(released * 0.20 * 10) / 10,
                        expenditure: Math.round(expenditure * 0.21 * 10) / 10,
                        utilizationPct: Math.round((expenditure * 0.21 / (released * 0.20)) * 1000) / 10,
                        totalWorks: Math.max(2, Math.round(totalWorks * 0.20))
                    }
                };

                targetData.districtUtilization.push({
                    district: cleanDist,
                    state: state,
                    allocated: allocated,
                    released: released,
                    expenditure: expenditure,
                    utilizationPct: utilizationPct,
                    totalWorks: totalWorks,
                    byYear: byYear
                });
                existingUtilDistricts.add(lowerDist);
            }
        });
    }

    // 2. Pre-generate works, alerts, and transactions for priority pilot districts (~15 key hubs)
    // This takes only ~8ms while providing instant rich data for default views
    const PRIORITY_STARTUP_DISTRICTS = [
        "Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar", "Mirzapur", "Jaunpur",
        "Patna", "Jaipur", "Bhopal", "Kolkata", "Chennai", "Bengaluru Urban", "Hyderabad", "Mumbai City"
    ];

    PRIORITY_STARTUP_DISTRICTS.forEach(dist => {
        generateWorksForDistrict(targetData, dist);
    });

    // Keep transactions alias updated
    targetData.transactions = targetData.financialTransactions;
}

// Work template generator for all 6 categories across years & statuses
function getCategoryWorkTemplates(cleanDist) {
    return [
        {
            cat: "Drinking Water & Sanitation",
            items: [
                { name: `Piped Drinking Water Scheme & Solar RO Plant, ${cleanDist}`, fy: "2025-26", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 68.0, agency: `Jal Nigam Engineering Division (${cleanDist})` },
                { name: `Overhead Water Reservoir & Feeder Pipeline Network in ${cleanDist}`, fy: "2025-26", status: "ONGOING", compPct: 65, risk: "MEDIUM", cost: 84.5, agency: `Rural Water Supply Agency (${cleanDist})` },
                { name: `Deep Tube Wells & Community Filtration Unit at ${cleanDist}`, fy: "2024-25", status: "DELAYED", compPct: 42, risk: "HIGH", delayDays: 85, cost: 58.0, agency: `Jal Nigam Technical Division (${cleanDist})` },
                { name: `Solid & Liquid Waste Bio-Digester Treatment Plant, ${cleanDist}`, fy: "2023-24", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 72.0, agency: `Panchayat Swachhata Mission (${cleanDist})` }
            ]
        },
        {
            cat: "Education & Digital Labs",
            items: [
                { name: `Smart ICT Classroom Computer Labs in 8 Govt Inter Colleges, ${cleanDist}`, fy: "2025-26", status: "ONGOING", compPct: 75, risk: "LOW", cost: 76.0, agency: `State Educational Infra Corp (${cleanDist})` },
                { name: `STEM Innovation & Robotics Laboratory Setup in Model Schools, ${cleanDist}`, fy: "2025-26", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 54.0, agency: `Department of Secondary Education (${cleanDist})` },
                { name: `Girls Higher Secondary School Digital Library & Lab Wing, ${cleanDist}`, fy: "2024-25", status: "DELAYED", compPct: 38, risk: "CRITICAL", delayDays: 120, cost: 65.0, agency: `State Educational Infra Corp (${cleanDist})` },
                { name: `Modern Physics & Chemistry Practical Labs Upgradation, ${cleanDist}`, fy: "2023-24", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 48.0, agency: `District Education Office (${cleanDist})` }
            ]
        },
        {
            cat: "Rural Roads & Bridges",
            items: [
                { name: `All-Weather Bituminous Link Road from Block HQ to Farming Clusters, ${cleanDist}`, fy: "2025-26", status: "ONGOING", compPct: 70, risk: "MEDIUM", cost: 95.0, agency: `PWD Rural Roads Wing (${cleanDist})` },
                { name: `Reinforced Concrete High-Level Culvert & Drainage Overpass in ${cleanDist}`, fy: "2025-26", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 82.0, agency: `Public Works Department (${cleanDist})` },
                { name: `Major Multi-Span Bridge over Regional Drainage Canal, ${cleanDist}`, fy: "2024-25", status: "DELAYED", compPct: 45, risk: "HIGH", delayDays: 98, cost: 115.0, agency: `State Bridge Corporation (${cleanDist})` },
                { name: `Panchayat Inter-Connecting Concrete Roadway & Walkways, ${cleanDist}`, fy: "2023-24", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 62.0, agency: `Rural Engineering Services (${cleanDist})` }
            ]
        },
        {
            cat: "Public Health Infrastructure",
            items: [
                { name: `Primary Health Centre Diagnostic Wing & Tele-Medicine Facility at ${cleanDist}`, fy: "2025-26", status: "ONGOING", compPct: 80, risk: "LOW", cost: 88.0, agency: `Public Works Department (${cleanDist} Health Div)` },
                { name: `Rural Community Health Centre Solar Cold-Chain & Emergency Wing, ${cleanDist}`, fy: "2025-26", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 74.0, agency: `District Health Society (${cleanDist})` },
                { name: `Sub-District Hospital Oxygen Generator & Intensive Neonatal Unit, ${cleanDist}`, fy: "2024-25", status: "DELAYED", compPct: 52, risk: "CRITICAL", delayDays: 110, cost: 92.0, agency: `State Medical Supplies Corp (${cleanDist})` },
                { name: `Maternal & Child Health Care Post Pathology Modernization, ${cleanDist}`, fy: "2023-24", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 58.0, agency: `Chief Medical Office (${cleanDist})` }
            ]
        },
        {
            cat: "Renewable Energy & Lighting",
            items: [
                { name: `Solar High-Mast Street Illumination & Panchayat Power in ${cleanDist}`, fy: "2025-26", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 62.0, agency: `Renewable Energy Development Agency (${cleanDist})` },
                { name: `Rooftop Solar PV Microgrid for 15 Gram Panchayat Bhavans in ${cleanDist}`, fy: "2025-26", status: "ONGOING", compPct: 72, risk: "MEDIUM", cost: 78.0, agency: `State Energy Development Agency (${cleanDist})` },
                { name: `Decentralized Solar Agricultural Feeder Pumping Stations, ${cleanDist}`, fy: "2024-25", status: "DELAYED", compPct: 40, risk: "HIGH", delayDays: 80, cost: 70.0, agency: `Renewable Energy Corporation (${cleanDist})` },
                { name: `Solar LED Street Lighting across 25 Remote Rural Hamlets, ${cleanDist}`, fy: "2023-24", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 52.0, agency: `Rural Electrification Wing (${cleanDist})` }
            ]
        },
        {
            cat: "Community Assets & Skills",
            items: [
                { name: `Skill Development & Multipurpose Vocational Resource Center, ${cleanDist}`, fy: "2025-26", status: "ONGOING", compPct: 68, risk: "MEDIUM", cost: 75.0, agency: `District Rural Development Agency (${cleanDist})` },
                { name: `Farmers Kisan Mandi Multi-Commodity Solar Cold Storage Facility, ${cleanDist}`, fy: "2025-26", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 90.0, agency: `Agriculture Marketing Board (${cleanDist})` },
                { name: `Women Self-Help Group (SHG) Handloom & Craft Production Hub, ${cleanDist}`, fy: "2024-25", status: "DELAYED", compPct: 35, risk: "CRITICAL", delayDays: 140, cost: 64.0, agency: `DRDA Civil Division (${cleanDist})` },
                { name: `Panchayat Multipurpose Community Hall & Disaster Shelter, ${cleanDist}`, fy: "2023-24", status: "COMPLETED", compPct: 100, risk: "LOW", cost: 56.0, agency: `Panchayat Raj Directorate (${cleanDist})` }
            ]
        }
    ];
}

// Generate works, alerts, and transactions on-demand for any given district (< 0.5ms)
function generateWorksForDistrict(targetData, districtName, stateName) {
    if (!targetData || !districtName || districtName === 'ALL') return;
    const cleanDist = districtName.trim();
    const lowerDist = cleanDist.toLowerCase();
    const state = stateName || getStateForDistrict(cleanDist);
    const baseCoords = STATE_COORDINATES[state] || [23.5, 78.5];
    const stateCode = state.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'IN');
    const h = _stringHash(cleanDist + state);
    const rng = _seededRandom(h);

    if (!Array.isArray(targetData.works)) targetData.works = [];
    if (!Array.isArray(targetData.alerts)) targetData.alerts = [];
    if (!Array.isArray(targetData.financialTransactions)) targetData.financialTransactions = [];

    // Ensure we don't duplicate works for this district
    const alreadyHasWorks = targetData.works.some(w => (w.district || '').toLowerCase().trim() === lowerDist);
    if (alreadyHasWorks) return;

    const CANONICAL_CONSTITUENCIES = {
        "varanasi": "Varanasi (PC-77)",
        "gorakhpur": "Gorakhpur (PC-64)",
        "prayagraj": "Prayagraj (PC-52)",
        "lucknow": "Lucknow (PC-35)",
        "ayodhya": "Ayodhya (PC-54)",
        "kanpur nagar": "Kanpur (PC-43)",
        "kanpur": "Kanpur (PC-43)",
        "mirzapur": "Mirzapur (PC-79)",
        "jaunpur": "Jaunpur (PC-73)"
    };

    const constituencyName = CANONICAL_CONSTITUENCIES[lowerDist] || `${cleanDist} (PC-${10 + (h % 75)})`;
    const mpName = `Hon. MP (${cleanDist})`;

    let workCounter = targetData.works.length + 100;
    let alertCounter = targetData.alerts.length + 500;
    let txCounter = targetData.financialTransactions.length + 5000;

    const templates = getCategoryWorkTemplates(cleanDist);
    templates.forEach(catGroup => {
        catGroup.items.forEach(item => {
            workCounter++;
            const workId = `WRK-2026-${stateCode}-${String(workCounter).padStart(4, '0')}`;
            const cost = Math.round((item.cost + (rng() - 0.5) * 8) * 10) / 10;
            const relAmount = item.status === 'COMPLETED' ? cost : Math.round((cost * (0.85 + rng() * 0.12)) * 10) / 10;
            const expAmount = item.status === 'COMPLETED' ? relAmount : Math.max(8.0, Math.round((relAmount * (item.compPct / 100)) * 10) / 10);
            const isDelayed = item.status === 'DELAYED';
            const delayDays = isDelayed ? (item.delayDays || Math.round(75 + rng() * 80)) : 0;

            const lat = baseCoords[0] + (rng() - 0.5) * 1.4;
            const lng = baseCoords[1] + (rng() - 0.5) * 1.4;

            const newWork = {
                id: workId,
                name: item.name,
                district: cleanDist,
                constituency: constituencyName,
                mp: mpName,
                financialYear: item.fy,
                category: catGroup.cat,
                approvedAmountLakhs: cost,
                releasedAmountLakhs: relAmount,
                expenditureLakhs: expAmount,
                completionPct: item.compPct,
                status: item.status,
                risk: item.risk,
                monitoringStatus: isDelayed ? "Attention Needed" : (item.status === 'ONGOING' ? "Normal" : "Completed"),
                monitoringObservations: isDelayed ?
                    `Physical progress delayed by ${delayDays} days beyond target timeline. Administrative notice expedited.` :
                    `Project execution verified under MoSPI monitoring norms. Physical milestones conform to sanction specifications.`,
                daysDelayed: delayDays,
                lastUpdated: "2026-09-20",
                startDate: item.fy === '2023-24' ? "2023-09-15" : (item.fy === '2024-25' ? "2024-10-10" : "2025-07-20"),
                expectedCompletion: item.status === 'COMPLETED' ? "2026-04-30" : "2026-12-31",
                actualCompletion: item.status === 'COMPLETED' ? "2026-04-15" : null,
                implementingAgency: item.agency,
                description: `${item.name} sanctioned under MPLADS regional developmental quota for ${cleanDist}, ${state}.`,
                milestones: [
                    { title: "Technical Sanction & Geo-Survey", plannedDate: "2025-09-10", actualDate: "2025-09-15", status: "COMPLETED" },
                    { title: "Civil Foundations & Assembly", plannedDate: "2026-02-28", actualDate: item.compPct > 50 ? "2026-03-10" : null, status: item.compPct > 50 ? "COMPLETED" : (isDelayed ? "DELAYED" : "ONGOING") },
                    { title: "Final Commissioning & Audit", plannedDate: "2026-10-31", actualDate: item.status === 'COMPLETED' ? "2026-04-15" : null, status: item.status === 'COMPLETED' ? "COMPLETED" : "PENDING" }
                ],
                timeline: [
                    { event: "Administrative Sanction Issued", date: "2025-07-05", category: "Approval", desc: `Sanction recorded by Nodal Officer (${cleanDist}).` },
                    { event: "Funds Disbursed", date: "2025-07-25", category: "Release", desc: `Installment of ₹${relAmount} Lakhs released.` }
                ],
                coordinates: { lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000 }
            };

            targetData.works.push(newWork);

            if (isDelayed || item.risk === 'CRITICAL' || item.risk === 'HIGH') {
                alertCounter++;
                targetData.alerts.push({
                    id: `ALT-2026-${alertCounter}`,
                    type: isDelayed ? "Delayed Project" : "Anomaly Flag",
                    workId: workId,
                    workName: item.name,
                    district: cleanDist,
                    constituency: constituencyName,
                    category: catGroup.cat,
                    severity: item.risk === 'CRITICAL' ? "CRITICAL" : "HIGH",
                    riskScore: item.risk === 'CRITICAL' ? 88 : 76,
                    detectedDate: "2026-09-12",
                    status: "UNDER_REVIEW",
                    description: isDelayed ?
                        `Target milestone overdue by ${delayDays} days for ${item.name} in ${cleanDist}. Regulatory review initiated.` :
                        `Risk variance identified in execution trajectory for ${item.name} in ${cleanDist}.`,
                    reason: "Procurement clearance bottlenecks and inter-departmental permits.",
                    evidence: `Approved: ₹${cost} L | Spent: ₹${expAmount} L | Physical: ${item.compPct}%`,
                    history: `District Quality Monitor conducted physical inspection in ${cleanDist}.`,
                    assignedTo: { officer: "District Nodal Officer", department: `Collectorate of ${cleanDist}`, assignedDate: "2026-09-14" },
                    timeline: [
                        { stage: "Detected", date: "2026-09-12", done: true, desc: "Telemetry variance detected." },
                        { stage: "Reviewed", date: "2026-09-13", done: true, desc: "Marked Under Review." },
                        { stage: "Assigned", date: "2026-09-14", done: true, desc: "Assigned to Nodal Officer." },
                        { stage: "Investigated", date: null, done: false, desc: "Investigation in progress." },
                        { stage: "Resolved", date: null, done: false, desc: "Pending resolution." }
                    ]
                });
            }

            txCounter++;
            targetData.financialTransactions.push({
                id: `TXN-2026-${txCounter}`,
                workId: workId,
                workName: item.name,
                district: cleanDist,
                constituency: constituencyName,
                category: catGroup.cat,
                financialYear: item.fy,
                type: "ALLOCATION",
                amountLakhs: cost,
                date: item.fy === '2024-25' ? "2024-10-15" : (item.fy === '2023-24' ? "2023-10-15" : "2025-07-05"),
                reference: `SANCTION/${item.fy}/${cleanDist.substring(0, 3).toUpperCase()}-${workCounter}`,
                status: "COMPLETED",
                description: `Approved budget allocation sanction for ${item.name}`
            });

            txCounter++;
            targetData.financialTransactions.push({
                id: `TXN-2026-${txCounter}`,
                workId: workId,
                workName: item.name,
                district: cleanDist,
                constituency: constituencyName,
                category: catGroup.cat,
                financialYear: item.fy,
                type: "RELEASE",
                amountLakhs: relAmount,
                date: item.fy === '2024-25' ? "2024-11-01" : (item.fy === '2023-24' ? "2023-11-01" : "2025-07-25"),
                reference: `TREASURY-REL-${5000 + (h % 4000)}`,
                status: "COMPLETED",
                description: `Grant installment disbursed to executing agency.`
            });

            if (expAmount > 0) {
                txCounter++;
                targetData.financialTransactions.push({
                    id: `TXN-2026-${txCounter}`,
                    workId: workId,
                    workName: item.name,
                    district: cleanDist,
                    constituency: constituencyName,
                    category: catGroup.cat,
                    financialYear: item.fy,
                    type: "EXPENDITURE",
                    amountLakhs: expAmount,
                    date: item.fy === '2024-25' ? "2025-02-18" : (item.fy === '2023-24' ? "2024-02-18" : "2026-03-18"),
                    reference: `PFMS-VOUCHER-${10000 + (h % 9000)}`,
                    status: "COMPLETED",
                    description: `Voucher payment settled for physical infrastructure milestone.`
                });
            }
        });
    });

    targetData.transactions = targetData.financialTransactions;
}

// On-demand enrichment helper called when any district is filtered or selected
function ensureDistrictWorksEnriched(targetData, districtName) {
    if (!targetData) {
        if (typeof window !== 'undefined' && window.MPLADS_DEMO_DATA) {
            targetData = window.MPLADS_DEMO_DATA;
        } else {
            return;
        }
    }
    if (!districtName || districtName === 'ALL') return;
    const cleanDist = districtName.trim();
    const lowerDist = cleanDist.toLowerCase();
    const alreadyHas = (targetData.works || []).some(w => (w.district || '').toLowerCase().trim() === lowerDist);
    if (!alreadyHas) {
        generateWorksForDistrict(targetData, cleanDist);
    }
}

// Auto-run if MPLADS_DEMO_DATA is already present in window
if (typeof window !== 'undefined' && window.MPLADS_DEMO_DATA) {
    enrichMockDataForAllDistricts(window.MPLADS_DEMO_DATA);
}

if (typeof module !== 'undefined') {
    module.exports = {
        INDIA_STATES_DISTRICTS,
        ALL_INDIA_DISTRICTS,
        PILOT_DISTRICTS,
        getStateForDistrict,
        renderDistrictOptions,
        enrichMockDataForAllDistricts,
        ensureDistrictWorksEnriched,
        generateWorksForDistrict
    };
}

if (typeof window !== 'undefined') {
    window.INDIA_STATES_DISTRICTS = INDIA_STATES_DISTRICTS;
    window.ALL_INDIA_DISTRICTS = ALL_INDIA_DISTRICTS;
    window.PILOT_DISTRICTS = PILOT_DISTRICTS;
    window.getStateForDistrict = getStateForDistrict;
    window.renderDistrictOptions = renderDistrictOptions;
    window.enrichMockDataForAllDistricts = enrichMockDataForAllDistricts;
    window.ensureDistrictWorksEnriched = ensureDistrictWorksEnriched;
    window.generateWorksForDistrict = generateWorksForDistrict;
}

