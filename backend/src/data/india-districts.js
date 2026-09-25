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

// Active pilot districts with live telemetry & works data
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

if (typeof module !== 'undefined') {
    module.exports = {
        INDIA_STATES_DISTRICTS,
        PILOT_DISTRICTS,
        getStateForDistrict
    };
}
