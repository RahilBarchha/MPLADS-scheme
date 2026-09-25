/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Centralized Synthetic Demo Dataset
 * 
 * NOTICE:
 * THIS IS SYNTHETIC DEMONSTRATION DATA FOR UI PROTOTYPING AND TESTING.
 * NOT REAL GOVERNMENT STATISTICS OR PERSONAL IDENTIFIABLE INFORMATION.
 * ==============================================================================
 */

const MPLADS_DEMO_DATA = {
    metadata: {
        isDemoData: true,
        generatedDate: "2026-09-21",
        version: "3.0.0-demo",
        disclaimer: "SYNTHETIC DEMO DATA: Numbers, works, and allocations are generated for system demonstration."
    },
    
    // Logged in user profile
    currentUser: {
        id: "OFF-VNS-DM-01",
        name: "Dr. R. K. Sharma, IAS",
        role: "District Magistrate & Nodal Officer",
        roleCode: "DM",
        district: "Varanasi",
        state: "Uttar Pradesh",
        email: "dm.varanasi@nic.in",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80"
    },

    // Multi-District Governance Officers Roster (4 Unique Roles per District)
    officers: [
        // Varanasi
        { id: "OFF-VNS-DM-01", name: "Dr. R. K. Sharma, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Varanasi", state: "Uttar Pradesh", email: "dm.varanasi@nic.in", contact: "+91-9454417501", status: "ACTIVE", appointedDate: "2024-06-15", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-VNS-MP-01", name: "Hon. Rajesh K. Tripathi, MP", role: "Member of Parliament", roleCode: "MP", district: "Varanasi", state: "Uttar Pradesh", email: "mp.varanasi@sansad.nic.in", contact: "+91-9415201102", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-VNS-EE-01", name: "Er. Anand Swaroop", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Varanasi", state: "Uttar Pradesh", email: "ee.varanasi@pwd.up.gov.in", contact: "+91-9454418203", status: "ACTIVE", appointedDate: "2023-08-10", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-VNS-DPO-01", name: "Smt. Sunita Mishra", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Varanasi", state: "Uttar Pradesh", email: "dpo.varanasi@nic.in", contact: "+91-9454419304", status: "ACTIVE", appointedDate: "2024-01-20", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80" },

        // Gorakhpur
        { id: "OFF-GKP-DM-01", name: "Krishna Mohan Singh, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Gorakhpur", state: "Uttar Pradesh", email: "dm.gorakhpur@nic.in", contact: "+91-9454417511", status: "ACTIVE", appointedDate: "2024-07-01", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-GKP-MP-01", name: "Hon. Ravi Kant Shukla, MP", role: "Member of Parliament", roleCode: "MP", district: "Gorakhpur", state: "Uttar Pradesh", email: "mp.gorakhpur@sansad.nic.in", contact: "+91-9415201112", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-GKP-EE-01", name: "Er. Devendra Nath Roy", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Gorakhpur", state: "Uttar Pradesh", email: "ee.gorakhpur@pwd.up.gov.in", contact: "+91-9454418213", status: "ACTIVE", appointedDate: "2023-11-15", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-GKP-DPO-01", name: "Shri Bipin Bihari Pandey", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Gorakhpur", state: "Uttar Pradesh", email: "dpo.gorakhpur@nic.in", contact: "+91-9454419314", status: "ACTIVE", appointedDate: "2023-09-01", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80" },

        // Prayagraj
        { id: "OFF-PRY-DM-01", name: "Smt. Vandana Tripathi, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Prayagraj", state: "Uttar Pradesh", email: "dm.prayagraj@nic.in", contact: "+91-9454417521", status: "ACTIVE", appointedDate: "2024-05-12", avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-PRY-MP-01", name: "Hon. Mahendra Pratap Singh, MP", role: "Member of Parliament", roleCode: "MP", district: "Prayagraj", state: "Uttar Pradesh", email: "mp.prayagraj@sansad.nic.in", contact: "+91-9415201122", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-PRY-EE-01", name: "Er. Rakesh Kumar Verma", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Prayagraj", state: "Uttar Pradesh", email: "ee.prayagraj@pwd.up.gov.in", contact: "+91-9454418223", status: "ACTIVE", appointedDate: "2024-02-14", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-PRY-DPO-01", name: "Shri Alok Nath Srivastava", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Prayagraj", state: "Uttar Pradesh", email: "dpo.prayagraj@nic.in", contact: "+91-9454419324", status: "ACTIVE", appointedDate: "2023-12-10", avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=160&h=160&q=80" },

        // Lucknow
        { id: "OFF-LKO-DM-01", name: "Shri Surya Pal Gangwar, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Lucknow", state: "Uttar Pradesh", email: "dm.lucknow@nic.in", contact: "+91-9454417531", status: "ACTIVE", appointedDate: "2023-04-18", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-LKO-MP-01", name: "Hon. Brajesh Chandra Pathak, MP", role: "Member of Parliament", roleCode: "MP", district: "Lucknow", state: "Uttar Pradesh", email: "mp.lucknow@sansad.nic.in", contact: "+91-9415201132", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-LKO-EE-01", name: "Er. Manoj Kumar Saxena", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Lucknow", state: "Uttar Pradesh", email: "ee.lucknow@pwd.up.gov.in", contact: "+91-9454418233", status: "ACTIVE", appointedDate: "2023-07-25", avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-LKO-DPO-01", name: "Smt. Rashmi Tiwari", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Lucknow", state: "Uttar Pradesh", email: "dpo.lucknow@nic.in", contact: "+91-9454419334", status: "ACTIVE", appointedDate: "2024-03-01", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=160&h=160&q=80" },

        // Ayodhya
        { id: "OFF-AYD-DM-01", name: "Shri Nitish Kumar Verma, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Ayodhya", state: "Uttar Pradesh", email: "dm.ayodhya@nic.in", contact: "+91-9454417541", status: "ACTIVE", appointedDate: "2023-10-05", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-AYD-MP-01", name: "Hon. Awadhesh Kumar Prasad, MP", role: "Member of Parliament", roleCode: "MP", district: "Ayodhya", state: "Uttar Pradesh", email: "mp.ayodhya@sansad.nic.in", contact: "+91-9415201142", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-AYD-EE-01", name: "Er. Pradeep Kumar Upadhyay", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Ayodhya", state: "Uttar Pradesh", email: "ee.ayodhya@pwd.up.gov.in", contact: "+91-9454418243", status: "ACTIVE", appointedDate: "2024-01-15", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-AYD-DPO-01", name: "Shri Sanjay Kumar Dwivedi", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Ayodhya", state: "Uttar Pradesh", email: "dpo.ayodhya@nic.in", contact: "+91-9454419344", status: "ACTIVE", appointedDate: "2023-08-20", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80" },

        // Kanpur Nagar
        { id: "OFF-KNP-DM-01", name: "Shri Jitendra Pratap Singh, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Kanpur Nagar", state: "Uttar Pradesh", email: "dm.kanpur@nic.in", contact: "+91-9454417551", status: "ACTIVE", appointedDate: "2024-04-10", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-KNP-MP-01", name: "Hon. Ramesh Chandra Awasthi, MP", role: "Member of Parliament", roleCode: "MP", district: "Kanpur Nagar", state: "Uttar Pradesh", email: "mp.kanpur@sansad.nic.in", contact: "+91-9415201152", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-KNP-EE-01", name: "Er. Vijay Kumar Bajpai", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Kanpur Nagar", state: "Uttar Pradesh", email: "ee.kanpur@pwd.up.gov.in", contact: "+91-9454418253", status: "ACTIVE", appointedDate: "2023-11-30", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-KNP-DPO-01", name: "Smt. Meenakshi Sahu", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Kanpur Nagar", state: "Uttar Pradesh", email: "dpo.kanpur@nic.in", contact: "+91-9454419354", status: "ACTIVE", appointedDate: "2024-02-05", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=160&h=160&q=80" },

        // Mirzapur
        { id: "OFF-MZP-DM-01", name: "Smt. Priyanka Niranjan, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Mirzapur", state: "Uttar Pradesh", email: "dm.mirzapur@nic.in", contact: "+91-9454417561", status: "ACTIVE", appointedDate: "2023-09-14", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-MZP-MP-01", name: "Hon. Smt. Anupriya S. Patel, MP", role: "Member of Parliament", roleCode: "MP", district: "Mirzapur", state: "Uttar Pradesh", email: "mp.mirzapur@sansad.nic.in", contact: "+91-9415201162", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-MZP-EE-01", name: "Er. Ashok Kumar Maurya", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Mirzapur", state: "Uttar Pradesh", email: "ee.mirzapur@pwd.up.gov.in", contact: "+91-9454418263", status: "ACTIVE", appointedDate: "2024-01-08", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-MZP-DPO-01", name: "Shri Tribhuvan Nath Pandey", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Mirzapur", state: "Uttar Pradesh", email: "dpo.mirzapur@nic.in", contact: "+91-9454419364", status: "ACTIVE", appointedDate: "2023-10-12", avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=160&h=160&q=80" },

        // Jaunpur
        { id: "OFF-JNP-DM-01", name: "Shri Ravindra Kumar Mander, IAS", role: "District Magistrate & Nodal Officer", roleCode: "DM", district: "Jaunpur", state: "Uttar Pradesh", email: "dm.jaunpur@nic.in", contact: "+91-9454417571", status: "ACTIVE", appointedDate: "2024-03-22", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-JNP-MP-01", name: "Hon. Babu Singh Kushwaha, MP", role: "Member of Parliament", roleCode: "MP", district: "Jaunpur", state: "Uttar Pradesh", email: "mp.jaunpur@sansad.nic.in", contact: "+91-9415201172", status: "ACTIVE", appointedDate: "2024-06-04", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-JNP-EE-01", name: "Er. Harish Chandra Yadav", role: "Executive Engineer & Implementing Agency", roleCode: "EE", district: "Jaunpur", state: "Uttar Pradesh", email: "ee.jaunpur@pwd.up.gov.in", contact: "+91-9454418273", status: "ACTIVE", appointedDate: "2023-12-05", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-JNP-DPO-01", name: "Smt. Neelam Singh", role: "District Planning Officer & SNA Lead", roleCode: "DPO", district: "Jaunpur", state: "Uttar Pradesh", email: "dpo.jaunpur@nic.in", contact: "+91-9454419374", status: "ACTIVE", appointedDate: "2024-01-30", avatar: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=160&h=160&q=80" },

        // Central & State
        { id: "OFF-NAT-MIN-01", name: "Dr. Subhash Chandra Garg, IAS", role: "Ministry Central Administrator", roleCode: "MINISTRY", district: "National (All Districts)", state: "Central", email: "admin.mospi@nic.in", contact: "+91-11-23382101", status: "ACTIVE", appointedDate: "2022-01-01", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80" },
        { id: "OFF-UP-SNA-01", name: "Shri Deepak Kumar, IAS", role: "State Nodal Authority Officer", roleCode: "SNA", district: "Uttar Pradesh (State)", state: "Uttar Pradesh", email: "sna.planning@up.gov.in", contact: "+91-522-2238102", status: "ACTIVE", appointedDate: "2023-05-15", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&h=160&q=80" }
    ],

    // Master Reference Lookups
    districts: [
        "Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar", "Mirzapur", "Jaunpur"
    ],

    constituencies: [
        { id: "PC-77", name: "Varanasi (PC-77)", district: "Varanasi", mp: "Hon. MP (Varanasi)" },
        { id: "PC-64", name: "Gorakhpur (PC-64)", district: "Gorakhpur", mp: "Hon. MP (Gorakhpur)" },
        { id: "PC-52", name: "Prayagraj (PC-52)", district: "Prayagraj", mp: "Hon. MP (Prayagraj)" },
        { id: "PC-35", name: "Lucknow (PC-35)", district: "Lucknow", mp: "Hon. MP (Lucknow)" },
        { id: "PC-54", name: "Ayodhya (PC-54)", district: "Ayodhya", mp: "Hon. MP (Ayodhya)" },
        { id: "PC-43", name: "Kanpur (PC-43)", district: "Kanpur Nagar", mp: "Hon. MP (Kanpur)" },
        { id: "PC-79", name: "Mirzapur (PC-79)", district: "Mirzapur", mp: "Hon. MP (Mirzapur)" },
        { id: "PC-73", name: "Jaunpur (PC-73)", district: "Jaunpur", mp: "Hon. MP (Jaunpur)" }
    ],

    categories: [
        "Drinking Water & Sanitation",
        "Education & Digital Labs",
        "Rural Roads & Bridges",
        "Public Health Infrastructure",
        "Renewable Energy & Lighting",
        "Community Assets & Skills"
    ],

    workStatuses: ["PENDING", "ONGOING", "COMPLETED", "DELAYED", "CANCELLED"],
    riskLevels: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    financialYears: ["2025-26", "2024-25", "2023-24"],

    // Core Summary Aggregations
    kpis: {
        totalAllocationCr: 450.00,
        fundsReleasedCr: 385.50,
        totalExpenditureCr: 312.80,
        availableBalanceCr: 72.70,
        utilizationRatePct: 81.14,
        totalWorks: 1420,
        completedWorks: 948,
        ongoingWorks: 352,
        delayedWorks: 120,
        activeAlerts: 18,
        activeMPs: 38,
        byYear: {
            '2025-26': {
                totalAllocationCr: 215.00,
                fundsReleasedCr: 188.50,
                totalExpenditureCr: 148.60,
                availableBalanceCr: 66.40,
                utilizationRatePct: 78.83,
                totalWorks: 680,
                completedWorks: 390,
                ongoingWorks: 220,
                delayedWorks: 70,
                activeAlerts: 11
            },
            '2024-25': {
                totalAllocationCr: 155.00,
                fundsReleasedCr: 138.20,
                totalExpenditureCr: 118.50,
                availableBalanceCr: 36.50,
                utilizationRatePct: 85.75,
                totalWorks: 510,
                completedWorks: 410,
                ongoingWorks: 85,
                delayedWorks: 15,
                activeAlerts: 5
            },
            '2023-24': {
                totalAllocationCr: 80.00,
                fundsReleasedCr: 58.80,
                totalExpenditureCr: 45.70,
                availableBalanceCr: 34.30,
                utilizationRatePct: 77.72,
                totalWorks: 230,
                completedWorks: 148,
                ongoingWorks: 47,
                delayedWorks: 35,
                activeAlerts: 2
            }
        }
    },

    // 12-Month Historical Financial Trend (₹ Crore)
    monthlyExpenditure: {
        labels: ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"],
        allocated: [35.0, 35.0, 40.0, 35.0, 35.0, 50.0, 30.0, 35.0, 40.0, 38.0, 36.0, 36.5],
        released: [30.0, 32.5, 38.0, 31.0, 34.0, 48.0, 28.0, 31.0, 36.0, 35.0, 33.0, 35.0],
        expenditure: [24.5, 26.8, 32.1, 27.4, 29.5, 42.0, 22.1, 27.8, 30.2, 29.1, 28.3, 30.5],
        byYear: {
            '2025-26': {
                labels: ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"],
                expenditure: [8.5, 9.8, 11.2, 10.4, 12.5, 14.0, 12.2, 13.5, 15.4, 14.1, 15.0, 16.0]
            },
            '2024-25': {
                labels: ["Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"],
                expenditure: [7.2, 8.5, 9.0, 9.6, 10.2, 11.8, 10.5, 11.2, 12.0, 12.5, 12.8, 13.2]
            },
            '2023-24': {
                labels: ["Apr 2023", "May 2023", "Jun 2023", "Jul 2023", "Aug 2023", "Sep 2023", "Oct 2023", "Nov 2023", "Dec 2023", "Jan 2024", "Feb 2024", "Mar 2024"],
                expenditure: [3.5, 3.8, 4.0, 4.2, 4.5, 5.0, 4.8, 5.1, 5.4, 5.5, 5.7, 6.2]
            }
        }
    },

    // Work Status Breakdown
    workStatusDistribution: {
        labels: ["Completed", "Ongoing", "Delayed", "Pending", "Cancelled"],
        counts: [948, 352, 120, 118, 14],
        colors: ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#64748b"]
    },

    // Risk Portfolio Breakdown
    riskDistribution: {
        labels: ["Low Risk", "Medium Risk", "High Risk", "Critical Risk"],
        counts: [980, 280, 110, 50],
        colors: ["#10b981", "#f59e0b", "#f97316", "#ef4444"]
    },

    // District-wise Utilization & Works Aggregation
    districtUtilization: [
        {
            district: "Varanasi", allocated: 50.0, released: 48.0, expenditure: 44.2, utilizationPct: 88.4, totalWorks: 165,
            byYear: {
                '2025-26': { allocated: 22.5, released: 21.6, expenditure: 19.5, utilizationPct: 90.3, totalWorks: 75 },
                '2024-25': { allocated: 17.5, released: 16.8, expenditure: 15.2, utilizationPct: 90.5, totalWorks: 55 },
                '2023-24': { allocated: 10.0, released: 9.6, expenditure: 9.5, utilizationPct: 99.0, totalWorks: 35 }
            }
        },
        {
            district: "Gorakhpur", allocated: 45.0, released: 42.0, expenditure: 39.1, utilizationPct: 86.8, totalWorks: 142,
            byYear: {
                '2025-26': { allocated: 20.0, released: 18.9, expenditure: 17.2, utilizationPct: 91.0, totalWorks: 64 },
                '2024-25': { allocated: 16.0, released: 14.8, expenditure: 13.9, utilizationPct: 93.9, totalWorks: 48 },
                '2023-24': { allocated: 9.0, released: 8.3, expenditure: 8.0, utilizationPct: 96.4, totalWorks: 30 }
            }
        },
        {
            district: "Prayagraj", allocated: 48.0, released: 45.0, expenditure: 39.8, utilizationPct: 82.9, totalWorks: 158,
            byYear: {
                '2025-26': { allocated: 21.5, released: 20.0, expenditure: 17.5, utilizationPct: 87.5, totalWorks: 70 },
                '2024-25': { allocated: 17.0, released: 16.0, expenditure: 14.3, utilizationPct: 89.4, totalWorks: 53 },
                '2023-24': { allocated: 9.5, released: 9.0, expenditure: 8.0, utilizationPct: 88.9, totalWorks: 35 }
            }
        },
        {
            district: "Lucknow", allocated: 55.0, released: 50.0, expenditure: 45.0, utilizationPct: 81.8, totalWorks: 180,
            byYear: {
                '2025-26': { allocated: 25.0, released: 22.5, expenditure: 19.8, utilizationPct: 88.0, totalWorks: 82 },
                '2024-25': { allocated: 19.0, released: 17.5, expenditure: 15.8, utilizationPct: 90.3, totalWorks: 60 },
                '2023-24': { allocated: 11.0, released: 10.0, expenditure: 9.4, utilizationPct: 94.0, totalWorks: 38 }
            }
        },
        {
            district: "Kanpur Nagar", allocated: 50.0, released: 46.0, expenditure: 39.2, utilizationPct: 78.4, totalWorks: 149,
            byYear: {
                '2025-26': { allocated: 22.5, released: 20.5, expenditure: 17.2, utilizationPct: 83.9, totalWorks: 68 },
                '2024-25': { allocated: 17.5, released: 16.0, expenditure: 13.8, utilizationPct: 86.3, totalWorks: 50 },
                '2023-24': { allocated: 10.0, released: 9.5, expenditure: 8.2, utilizationPct: 86.3, totalWorks: 31 }
            }
        },
        {
            district: "Ayodhya", allocated: 42.0, released: 38.0, expenditure: 32.5, utilizationPct: 77.3, totalWorks: 135,
            byYear: {
                '2025-26': { allocated: 19.0, released: 17.0, expenditure: 14.2, utilizationPct: 83.5, totalWorks: 60 },
                '2024-25': { allocated: 14.5, released: 13.2, expenditure: 11.5, utilizationPct: 87.1, totalWorks: 45 },
                '2023-24': { allocated: 8.5, released: 7.8, expenditure: 6.8, utilizationPct: 87.2, totalWorks: 30 }
            }
        },
        {
            district: "Mirzapur", allocated: 38.0, released: 32.0, expenditure: 27.6, utilizationPct: 72.6, totalWorks: 110,
            byYear: {
                '2025-26': { allocated: 17.0, released: 14.2, expenditure: 12.0, utilizationPct: 84.5, totalWorks: 49 },
                '2024-25': { allocated: 13.0, released: 11.2, expenditure: 9.8, utilizationPct: 87.5, totalWorks: 37 },
                '2023-24': { allocated: 8.0, released: 6.6, expenditure: 5.8, utilizationPct: 87.9, totalWorks: 24 }
            }
        },
        {
            district: "Jaunpur", allocated: 40.0, released: 34.0, expenditure: 28.0, utilizationPct: 70.0, totalWorks: 122,
            byYear: {
                '2025-26': { allocated: 18.0, released: 15.2, expenditure: 12.2, utilizationPct: 80.3, totalWorks: 55 },
                '2024-25': { allocated: 14.0, released: 12.0, expenditure: 10.0, utilizationPct: 83.3, totalWorks: 41 },
                '2023-24': { allocated: 8.0, released: 6.8, expenditure: 5.8, utilizationPct: 85.3, totalWorks: 26 }
            }
        }
    ],

    // Sectoral Budget Breakdown
    sectorBreakdown: [
        { sector: "Drinking Water & Sanitation", allocationCr: 98.5, expenditureCr: 84.2, count: 340 },
        { sector: "Education & Digital Labs", allocationCr: 115.0, expenditureCr: 96.5, count: 395 },
        { sector: "Rural Roads & Bridges", allocationCr: 120.5, expenditureCr: 92.4, count: 360 },
        { sector: "Public Health Infrastructure", allocationCr: 72.0, expenditureCr: 55.2, count: 210 },
        { sector: "Renewable Energy & Lighting", allocationCr: 58.0, expenditureCr: 46.5, count: 185 },
        { sector: "Community Assets & Skills", allocationCr: 44.0, expenditureCr: 33.7, count: 115 }
    ],

    // Primary Development Works Dataset
    works: [
        {
            id: "WRK-2026-UP-001",
            name: "Installation of Solar High-Mast Lights in 12 Village Squares",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            mp: "Hon. MP (Varanasi)",
            financialYear: "2025-26",
            category: "Renewable Energy & Lighting",
            approvedAmountLakhs: 48.50,
            releasedAmountLakhs: 48.50,
            expenditureLakhs: 44.60,
            completionPct: 92,
            status: "ONGOING",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Physical erection completed across all 12 target sites. Awaiting final third-party illumination audit and grid sync verification.",
            daysDelayed: 0,
            lastUpdated: "2026-09-18",
            startDate: "2025-11-10",
            expectedCompletion: "2026-10-15",
            actualCompletion: null,
            implementingAgency: "District Rural Development Agency (DRDA)",
            description: "Deployment of 12 standalone high-mast solar lighting poles across major public intersections and panchayat bhavans.",
            milestones: [
                { title: "Foundation & Civil Works", plannedDate: "2025-12-15", actualDate: "2025-12-20", status: "COMPLETED" },
                { title: "Solar Mast Erection & Panels", plannedDate: "2026-03-30", actualDate: "2026-04-10", status: "COMPLETED" },
                { title: "Grid Sync & Battery Testing", plannedDate: "2026-09-30", actualDate: null, status: "ONGOING" }
            ],
            timeline: [
                { event: "Administrative Sanction Issued", date: "2025-10-15", category: "Approval", desc: "Sanction order #DRDA/2025/401 approved by Nodal Officer." },
                { event: "First Installment Released", date: "2025-11-01", category: "Release", desc: "Treasury released ₹24.25 Lakhs (50%) to DRDA." },
                { event: "Civil Foundations Completed", date: "2025-12-20", category: "Milestone", desc: "All 12 reinforced foundation bases certified by Junior Engineer." },
                { event: "Second Installment Released", date: "2026-03-15", category: "Release", desc: "Second tranche of ₹24.25 Lakhs disbursed after voucher review." },
                { event: "Site Telemetry Inspection", date: "2026-08-10", category: "Inspection", desc: "District Quality Monitor verified physical deployment on site." }
            ],
            coordinates: { lat: 25.3176, lng: 82.9739 }
        },
        {
            id: "WRK-2026-UP-002",
            name: "Construction of Primary Health Centre Diagnostic Wing",
            district: "Gorakhpur",
            constituency: "Gorakhpur (PC-64)",
            mp: "Hon. MP (Gorakhpur)",
            financialYear: "2025-26",
            category: "Public Health Infrastructure",
            approvedAmountLakhs: 85.00,
            releasedAmountLakhs: 85.00,
            expenditureLakhs: 72.20,
            completionPct: 85,
            status: "ONGOING",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Structural construction completed; biomedical calibration ongoing. Work progressing within acceptable schedule parameters.",
            daysDelayed: 0,
            lastUpdated: "2026-09-15",
            startDate: "2025-08-01",
            expectedCompletion: "2026-11-30",
            actualCompletion: null,
            implementingAgency: "Public Works Department (PWD)",
            description: "Two-story diagnostic and pathology laboratory expansion for rural primary health center.",
            milestones: [
                { title: "Structural Shell & RCC", plannedDate: "2025-11-20", actualDate: "2025-11-30", status: "COMPLETED" },
                { title: "Internal Electrical & Plumbing", plannedDate: "2026-04-30", actualDate: "2026-05-15", status: "COMPLETED" },
                { title: "Medical Equipment Fitment", plannedDate: "2026-10-31", actualDate: null, status: "ONGOING" }
            ],
            timeline: [
                { event: "Sanction Accorded", date: "2025-07-10", category: "Approval", desc: "Administrative approval accorded by District Magistrate." },
                { event: "Work Order Issued to PWD", date: "2025-07-25", category: "Sanction", desc: "Tender finalized and contract assigned to executing division." },
                { event: "Full Funds Released", date: "2025-08-05", category: "Release", desc: "Total sanctioned amount of ₹85.00 Lakhs released." },
                { event: "Mid-Term Structural Audit", date: "2026-06-18", category: "Inspection", desc: "Structural safety certificate countersigned by Chief Medical Officer." }
            ],
            coordinates: { lat: 26.7606, lng: 83.3732 }
        },
        {
            id: "WRK-2026-UP-003",
            name: "Deep Tube Wells & Water Purification RO Plant Setup",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            mp: "Hon. MP (Prayagraj)",
            financialYear: "2024-25",
            category: "Drinking Water & Sanitation",
            approvedAmountLakhs: 62.00,
            releasedAmountLakhs: 62.00,
            expenditureLakhs: 62.00,
            completionPct: 100,
            status: "COMPLETED",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Project fully commissioned and operational. Utilization certificate GFR-12C submitted and verified by finance section.",
            daysDelayed: 0,
            lastUpdated: "2026-08-20",
            startDate: "2025-06-15",
            expectedCompletion: "2026-05-20",
            actualCompletion: "2026-05-18",
            implementingAgency: "Jal Nigam Technical Division",
            description: "Deep bore-well installation with 10,000 LPH community RO purification unit for 4 adjacent hamlets.",
            milestones: [
                { title: "Deep Drilling & Boring", plannedDate: "2025-08-30", actualDate: "2025-09-10", status: "COMPLETED" },
                { title: "RO Plant Machinery Setup", plannedDate: "2026-01-31", actualDate: "2026-02-14", status: "COMPLETED" },
                { title: "Water Quality Testing & Handover", plannedDate: "2026-05-15", actualDate: "2026-05-18", status: "COMPLETED" }
            ],
            timeline: [
                { event: "Project Sanctioned", date: "2025-05-20", category: "Approval", desc: "Project sanction approved under drinking water priority." },
                { event: "Funds Disbursed to Jal Nigam", date: "2025-06-01", category: "Release", desc: "Sanctioned allocation of ₹62.00 Lakhs transferred." },
                { event: "Laboratory Water Quality Clearance", date: "2026-04-28", category: "Inspection", desc: "Water purity parameters meet BIS IS 10500 standards." },
                { event: "Formal Asset Handover to Panchayat", date: "2026-05-18", category: "Milestone", desc: "Operational management handed over to Village Water & Sanitation Committee." }
            ],
            coordinates: { lat: 25.4358, lng: 81.8463 }
        },
        {
            id: "WRK-2026-UP-004",
            name: "Smart Classroom Digital Labs in 10 Govt Inter Colleges",
            district: "Lucknow",
            constituency: "Lucknow (PC-35)",
            mp: "Hon. MP (Lucknow)",
            financialYear: "2025-26",
            category: "Education & Digital Labs",
            approvedAmountLakhs: 75.00,
            releasedAmountLakhs: 75.00,
            expenditureLakhs: 30.00,
            completionPct: 40,
            status: "DELAYED",
            risk: "HIGH",
            monitoringStatus: "Attention Needed",
            monitoringObservations: "Progress is below expected delivery schedule by 174 days due to hardware supply bottlenecks. Agency expedited for delivery timelines.",
            daysDelayed: 174,
            lastUpdated: "2026-09-20",
            startDate: "2025-07-12",
            expectedCompletion: "2026-03-31",
            actualCompletion: null,
            implementingAgency: "State Educational Infra Corp",
            description: "Interactive smart panels, computer systems, and UPS backups across 10 government secondary colleges.",
            milestones: [
                { title: "Classroom Electrification", plannedDate: "2025-09-30", actualDate: "2025-10-15", status: "COMPLETED" },
                { title: "Hardware Procurement", plannedDate: "2025-12-15", actualDate: null, status: "DELAYED" },
                { title: "Software & Fiber Setup", plannedDate: "2026-03-15", actualDate: null, status: "PENDING" }
            ],
            timeline: [
                { event: "Scheme Sanction", date: "2025-06-25", category: "Approval", desc: "Administrative sanction recorded for 10 institutional campuses." },
                { event: "Funds Released", date: "2025-07-05", category: "Release", desc: "Initial funding transfer completed." },
                { event: "SLA Warning Issued", date: "2026-04-10", category: "Inspection", desc: "Nodal notice sent to vendor regarding delayed hardware shipment." },
                { event: "Physical Verification Conducted", date: "2026-09-02", category: "Inspection", desc: "Field officer verified electrical cabling readiness at 10 sites." }
            ],
            coordinates: { lat: 26.8467, lng: 80.9462 }
        },
        {
            id: "WRK-2026-UP-005",
            name: "All-Weather Link Road from NH-28 to Rampur Village (3.4 km)",
            district: "Ayodhya",
            constituency: "Ayodhya (PC-54)",
            mp: "Hon. MP (Ayodhya)",
            financialYear: "2025-26",
            category: "Rural Roads & Bridges",
            approvedAmountLakhs: 110.00,
            releasedAmountLakhs: 110.00,
            expenditureLakhs: 88.00,
            completionPct: 78,
            status: "ONGOING",
            risk: "MEDIUM",
            monitoringStatus: "Requires Review",
            monitoringObservations: "Expenditure pattern requires review against recent bituminous layer measurements. Quality testing scheduled for upcoming fortnight.",
            daysDelayed: 0,
            lastUpdated: "2026-09-12",
            startDate: "2025-09-01",
            expectedCompletion: "2026-12-15",
            actualCompletion: null,
            implementingAgency: "PWD Rural Roads Wing",
            description: "Bituminous blacktop road construction with concrete side drains connecting remote rural farming cluster to NH-28.",
            milestones: [
                { title: "Earthwork & Sub-base", plannedDate: "2025-11-30", actualDate: "2025-12-10", status: "COMPLETED" },
                { title: "Bitumen Layer Paving", plannedDate: "2026-06-30", actualDate: null, status: "ONGOING" },
                { title: "Signage & Drainage Finishing", plannedDate: "2026-11-30", actualDate: null, status: "PENDING" }
            ],
            timeline: [
                { event: "Technical Clearance Received", date: "2025-08-15", category: "Approval", desc: "PWD Superintending Engineer cleared alignment design." },
                { event: "First Installment Released", date: "2025-09-05", category: "Release", desc: "Treasury released ₹55.00 Lakhs." },
                { event: "Second Installment Released", date: "2026-02-20", category: "Release", desc: "Second installment of ₹55.00 Lakhs released." },
                { event: "Field Compaction Test", date: "2026-07-15", category: "Inspection", desc: "Core sample density verified by State Testing Laboratory." }
            ],
            coordinates: { lat: 26.7922, lng: 82.1998 }
        },
        {
            id: "WRK-2026-UP-006",
            name: "Community Multipurpose Hall for Skill Development",
            district: "Mirzapur",
            constituency: "Mirzapur (PC-79)",
            mp: "Hon. MP (Mirzapur)",
            financialYear: "2025-26",
            category: "Community Assets & Skills",
            approvedAmountLakhs: 55.00,
            releasedAmountLakhs: 55.00,
            expenditureLakhs: 15.00,
            completionPct: 25,
            status: "DELAYED",
            risk: "CRITICAL",
            monitoringStatus: "Attention Needed",
            monitoringObservations: "Target milestone overdue by 205 days with 25% physical progress. Comprehensive nodal review meeting convened.",
            daysDelayed: 205,
            lastUpdated: "2026-09-19",
            startDate: "2025-05-10",
            expectedCompletion: "2026-02-28",
            actualCompletion: null,
            implementingAgency: "DRDA Civil Division",
            description: "Community hall for rural handicrafts, weaving vocational training and panchayat assembly.",
            milestones: [
                { title: "Land Clearing & Plinth", plannedDate: "2025-07-31", actualDate: "2025-08-30", status: "COMPLETED" },
                { title: "Masonry & Roof Truss", plannedDate: "2025-11-30", actualDate: null, status: "DELAYED" },
                { title: "Finishing & Electricals", plannedDate: "2026-02-15", actualDate: null, status: "PENDING" }
            ],
            timeline: [
                { event: "Administrative Approval", date: "2025-04-20", category: "Approval", desc: "Recommended under tribal development quota." },
                { event: "Funds Released", date: "2025-05-01", category: "Release", desc: "Full sanctioned amount credited to executing agency." },
                { event: "Site Stoppage Report", date: "2026-01-10", category: "Inspection", desc: "Contractor cited material transport challenges." },
                { event: "Show-Cause Notice Issued", date: "2026-08-25", category: "Inspection", desc: "District Magistrate directed immediate resumption." }
            ],
            coordinates: { lat: 25.1337, lng: 82.5644 }
        },
        {
            id: "WRK-2026-UP-007",
            name: "Solar Powered Cold Storage Facility for Vegetable Farmers",
            district: "Kanpur Nagar",
            constituency: "Kanpur (PC-43)",
            mp: "Hon. MP (Kanpur)",
            financialYear: "2025-26",
            category: "Community Assets & Skills",
            approvedAmountLakhs: 90.00,
            releasedAmountLakhs: 90.00,
            expenditureLakhs: 82.00,
            completionPct: 95,
            status: "ONGOING",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Trial refrigeration run completed successfully. Final joint inspection scheduled with Agriculture Department.",
            daysDelayed: 0,
            lastUpdated: "2026-09-17",
            startDate: "2025-08-15",
            expectedCompletion: "2026-10-31",
            actualCompletion: null,
            implementingAgency: "UP Agro Industrial Corp",
            description: "50-metric ton solar cold room at sub-district vegetable mandi to minimize post-harvest perishability.",
            milestones: [
                { title: "Civil Structure & Insulation", plannedDate: "2025-11-30", actualDate: "2025-12-10", status: "COMPLETED" },
                { title: "Refrigeration Unit Installation", plannedDate: "2026-05-31", actualDate: "2026-06-15", status: "COMPLETED" },
                { title: "Solar Inverter Array Calibration", plannedDate: "2026-09-30", actualDate: null, status: "ONGOING" }
            ],
            timeline: [
                { event: "Sanction Finalized", date: "2025-07-28", category: "Approval", desc: "Approved with technical vetting from UP Agro." },
                { event: "Funds Released", date: "2025-08-10", category: "Release", desc: "Complete allocation of ₹90.00 Lakhs released." },
                { event: "Thermal Insulation Verified", date: "2026-05-20", category: "Inspection", desc: "Temperature retention certified by Technical Officer." }
            ],
            coordinates: { lat: 26.4499, lng: 80.3319 }
        },
        {
            id: "WRK-2026-UP-008",
            name: "Overhead Water Tank & Feeder Pipeline (50,000 Ltr)",
            district: "Jaunpur",
            constituency: "Jaunpur (PC-73)",
            mp: "Hon. MP (Jaunpur)",
            financialYear: "2025-26",
            category: "Drinking Water & Sanitation",
            approvedAmountLakhs: 68.00,
            releasedAmountLakhs: 68.00,
            expenditureLakhs: 35.00,
            completionPct: 52,
            status: "DELAYED",
            risk: "HIGH",
            monitoringStatus: "Requires Review",
            monitoringObservations: "Pipeline trenching delayed due to right-of-way permissions across state highway. Inter-departmental coordination underway.",
            daysDelayed: 144,
            lastUpdated: "2026-09-14",
            startDate: "2025-07-01",
            expectedCompletion: "2026-04-30",
            actualCompletion: null,
            implementingAgency: "Jal Nigam Engineering Div",
            description: "Staged overhead storage tank and 4 km distribution pipeline supplying potable water.",
            milestones: [
                { title: "Foundation & Staging", plannedDate: "2025-10-31", actualDate: "2025-11-20", status: "COMPLETED" },
                { title: "Tank Casting & Pipeline Trenching", plannedDate: "2026-02-28", actualDate: null, status: "DELAYED" },
                { title: "Pressure Testing & Distribution", plannedDate: "2026-04-15", actualDate: null, status: "PENDING" }
            ],
            timeline: [
                { event: "Sanction Granted", date: "2025-06-12", category: "Approval", desc: "Approved for drought-prone rural cluster." },
                { event: "Funds Disbursed", date: "2025-06-25", category: "Release", desc: "₹68.00 Lakhs released." },
                { event: "Right of Way Review", date: "2026-05-12", category: "Inspection", desc: "Meeting held with NHAI for pipe crossing permission." }
            ],
            coordinates: { lat: 25.7464, lng: 82.6837 }
        },
        {
            id: "WRK-2026-UP-009",
            name: "Solid Waste Processing & Segregation Facility",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            mp: "Hon. MP (Varanasi)",
            financialYear: "2025-26",
            category: "Drinking Water & Sanitation",
            approvedAmountLakhs: 72.00,
            releasedAmountLakhs: 36.00,
            expenditureLakhs: 10.00,
            completionPct: 15,
            status: "PENDING",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Initial civil foundation works in progress following site clearance. First installment expenditure voucher under review.",
            daysDelayed: 0,
            lastUpdated: "2026-09-05",
            startDate: "2026-08-01",
            expectedCompletion: "2027-03-31",
            actualCompletion: null,
            implementingAgency: "Municipal Corporation",
            description: "Decentralized dry & wet waste bio-methanation and shredding facility for peri-urban wards.",
            milestones: [
                { title: "Site Clearance & Tender Finalization", plannedDate: "2026-08-15", actualDate: "2026-08-20", status: "COMPLETED" },
                { title: "Civil Base Construction", plannedDate: "2026-11-30", actualDate: null, status: "PENDING" },
                { title: "Machine Installation", plannedDate: "2027-02-15", actualDate: null, status: "PENDING" }
            ],
            timeline: [
                { event: "Project Sanctioned", date: "2026-07-15", category: "Approval", desc: "Sanctioned under urban environmental sanitation." },
                { event: "First Tranche Released", date: "2026-07-30", category: "Release", desc: "Advance release of ₹36.00 Lakhs (50%)." },
                { event: "Site Groundbreaking", date: "2026-08-20", category: "Milestone", desc: "Boundary demarcated and soil tests completed." }
            ],
            coordinates: { lat: 25.3350, lng: 82.9900 }
        },
        {
            id: "WRK-2026-UP-010",
            name: "Pedestrian Overbridge & Footpath Modernization",
            district: "Lucknow",
            constituency: "Lucknow (PC-35)",
            mp: "Hon. MP (Lucknow)",
            financialYear: "2024-25",
            category: "Rural Roads & Bridges",
            approvedAmountLakhs: 40.00,
            releasedAmountLakhs: 0.00,
            expenditureLakhs: 0.00,
            completionPct: 0,
            status: "CANCELLED",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Project cancelled by administrative authority due to state metro alignment overlap. Funds de-allocated and returned to reserve.",
            daysDelayed: 0,
            lastUpdated: "2026-08-10",
            startDate: "2025-10-01",
            expectedCompletion: "2026-06-30",
            actualCompletion: null,
            implementingAgency: "Urban Development Agency",
            description: "Proposed overbridge dropped due to alignment conflict with state metro corridor expansion.",
            milestones: [
                { title: "Feasibility Survey", plannedDate: "2025-10-15", actualDate: "2025-10-20", status: "COMPLETED" },
                { title: "Project Cancelled by Authority", plannedDate: "2026-08-01", actualDate: "2026-08-01", status: "CANCELLED" }
            ],
            timeline: [
                { event: "Initial Proposal", date: "2025-09-10", category: "Approval", desc: "Recommended by Hon. MP." },
                { event: "Survey Findings Submitted", date: "2025-10-20", category: "Inspection", desc: "Structural conflict identified with metro line pillars." },
                { event: "Formal De-allocation Order", date: "2026-08-01", category: "Approval", desc: "Nodal Authority approved cancellation and fund preservation." }
            ],
            coordinates: { lat: 26.8500, lng: 80.9300 }
        },
        {
            id: "WRK-2026-UP-011",
            name: "Science & Robotics Innovation Lab in District Model School",
            district: "Gorakhpur",
            constituency: "Gorakhpur (PC-64)",
            mp: "Hon. MP (Gorakhpur)",
            financialYear: "2024-25",
            category: "Education & Digital Labs",
            approvedAmountLakhs: 50.00,
            releasedAmountLakhs: 50.00,
            expenditureLakhs: 50.00,
            completionPct: 100,
            status: "COMPLETED",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Facility inaugurated and fully functional. Over 800 rural students actively utilizing STEM robotics kits.",
            daysDelayed: 0,
            lastUpdated: "2026-08-30",
            startDate: "2025-05-15",
            expectedCompletion: "2026-03-31",
            actualCompletion: "2026-03-25",
            implementingAgency: "Secondary Education Department",
            description: "Advanced STEM laboratory with 3D printers, IoT kits, and robotics prototyping benches for government school students.",
            milestones: [
                { title: "Lab Hall Renovation & Power", plannedDate: "2025-07-31", actualDate: "2025-08-10", status: "COMPLETED" },
                { title: "Equipment Procurement & Delivery", plannedDate: "2025-11-30", actualDate: "2025-12-05", status: "COMPLETED" },
                { title: "Teacher Training & Commissioning", plannedDate: "2026-03-30", actualDate: "2026-03-25", status: "COMPLETED" }
            ],
            timeline: [
                { event: "Proposal Sanctioned", date: "2025-04-18", category: "Approval", desc: "Approved under education excellence initiative." },
                { event: "Funds Disbursed", date: "2025-05-02", category: "Release", desc: "₹50.00 Lakhs transferred to executing agency." },
                { event: "Inspection by Education Officer", date: "2026-03-20", category: "Inspection", desc: "Inspection confirmed completion of all deliverables." }
            ],
            coordinates: { lat: 26.7580, lng: 83.3750 }
        },
        {
            id: "WRK-2026-UP-012",
            name: "Construction of Multi-Span Bridge across Sasur Khaderi River",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            mp: "Hon. MP (Prayagraj)",
            financialYear: "2025-26",
            category: "Rural Roads & Bridges",
            approvedAmountLakhs: 145.00,
            releasedAmountLakhs: 145.00,
            expenditureLakhs: 110.50,
            completionPct: 80,
            status: "ONGOING",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Piers and deck slabs cast. Approach road embankment work progressing smoothly toward winter completion target.",
            daysDelayed: 0,
            lastUpdated: "2026-09-16",
            startDate: "2025-06-01",
            expectedCompletion: "2026-12-31",
            actualCompletion: null,
            implementingAgency: "UP State Bridge Corporation",
            description: "RCC girder bridge of 72m span providing direct connectivity to 14 flood-isolated riverine villages.",
            milestones: [
                { title: "Sub-structure & Well Sinking", plannedDate: "2025-10-31", actualDate: "2025-11-15", status: "COMPLETED" },
                { title: "Super-structure Deck Slabs", plannedDate: "2026-05-31", actualDate: "2026-06-10", status: "COMPLETED" },
                { title: "Approach Roads & Railing", plannedDate: "2026-12-15", actualDate: null, status: "ONGOING" }
            ],
            timeline: [
                { event: "Scheme Sanction", date: "2025-05-10", category: "Approval", desc: "High-priority flood resilience sanction." },
                { event: "Funds Released", date: "2025-05-25", category: "Release", desc: "₹145.00 Lakhs sanctioned allocation released." },
                { event: "Load Bearing Test Passed", date: "2026-08-04", category: "Inspection", desc: "Structural integrity verified under standard design axle load." }
            ],
            coordinates: { lat: 25.4200, lng: 81.8200 }
        },
        {
            id: "WRK-2026-UP-013",
            name: "Community Health & Telemedicine Centre Building",
            district: "Ayodhya",
            constituency: "Ayodhya (PC-54)",
            mp: "Hon. MP (Ayodhya)",
            financialYear: "2025-26",
            category: "Public Health Infrastructure",
            approvedAmountLakhs: 65.00,
            releasedAmountLakhs: 65.00,
            expenditureLakhs: 65.00,
            completionPct: 100,
            status: "COMPLETED",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Telemedicine high-speed link operational with SGPGIMS Lucknow specialists. Daily OPD average exceeds 65 patients.",
            daysDelayed: 0,
            lastUpdated: "2026-08-25",
            startDate: "2025-06-10",
            expectedCompletion: "2026-06-30",
            actualCompletion: "2026-06-28",
            implementingAgency: "Public Works Department (PWD)",
            description: "Construction of telemedicine consultation suite, emergency stabilization room, and drug dispensary.",
            milestones: [
                { title: "Building Civil Envelope", plannedDate: "2025-10-31", actualDate: "2025-10-25", status: "COMPLETED" },
                { title: "Tele-Health Networking & UPS", plannedDate: "2026-02-28", actualDate: "2026-03-10", status: "COMPLETED" },
                { title: "Health Dept Handover", plannedDate: "2026-06-30", actualDate: "2026-06-28", status: "COMPLETED" }
            ],
            timeline: [
                { event: "Project Sanctioned", date: "2025-05-28", category: "Approval", desc: "Sanctioned under rural healthcare mission." },
                { event: "Funds Disbursed", date: "2025-06-05", category: "Release", desc: "₹65.00 Lakhs credited to executing division." },
                { event: "Final Audit & Handover", date: "2026-06-28", category: "Milestone", desc: "Joint inspection completed by CMO Ayodhya." }
            ],
            coordinates: { lat: 26.7850, lng: 82.1850 }
        },
        {
            id: "WRK-2026-UP-014",
            name: "Rooftop Solar Electrification for 20 Panchayat Bhavans",
            district: "Mirzapur",
            constituency: "Mirzapur (PC-79)",
            mp: "Hon. MP (Mirzapur)",
            financialYear: "2025-26",
            category: "Renewable Energy & Lighting",
            approvedAmountLakhs: 58.00,
            releasedAmountLakhs: 58.00,
            expenditureLakhs: 52.20,
            completionPct: 90,
            status: "ONGOING",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "18 out of 20 Panchayat Bhavans energized with 5kW solar hybrid systems. Remaining 2 scheduled for completion next week.",
            daysDelayed: 0,
            lastUpdated: "2026-09-17",
            startDate: "2025-09-15",
            expectedCompletion: "2026-10-31",
            actualCompletion: null,
            implementingAgency: "UP Non-Conventional Energy Development Agency (UPNEDA)",
            description: "5kW solar hybrid rooftop kits with lithium battery storage for 20 gram panchayat administrative secretariats.",
            milestones: [
                { title: "Structural Roof Audits", plannedDate: "2025-10-31", actualDate: "2025-11-05", status: "COMPLETED" },
                { title: "Solar Module Deployment", plannedDate: "2026-04-30", actualDate: "2026-05-15", status: "COMPLETED" },
                { title: "Inverter Commissioning (20 Sites)", plannedDate: "2026-10-15", actualDate: null, status: "ONGOING" }
            ],
            timeline: [
                { event: "Administrative Sanction", date: "2025-08-20", category: "Approval", desc: "Approved under renewable rural infrastructure scheme." },
                { event: "Funds Disbursed", date: "2025-09-02", category: "Release", desc: "Total sanctioned amount of ₹58.00 Lakhs released." },
                { event: "Progress Telemetry Verified", date: "2026-08-18", category: "Inspection", desc: "UPNEDA Project Officer confirmed active generation at 18 sites." }
            ],
            coordinates: { lat: 25.1400, lng: 82.5700 }
        },
        {
            id: "WRK-2026-UP-015",
            name: "Skill Development & Handloom Weaving Cluster Common Facility",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            mp: "Hon. MP (Varanasi)",
            financialYear: "2024-25",
            category: "Community Assets & Skills",
            approvedAmountLakhs: 80.00,
            releasedAmountLakhs: 80.00,
            expenditureLakhs: 80.00,
            completionPct: 100,
            status: "COMPLETED",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Common Facility Centre running at capacity with modern jacquard looms and yarn dyeing sheds.",
            daysDelayed: 0,
            lastUpdated: "2026-07-20",
            startDate: "2024-11-01",
            expectedCompletion: "2025-12-31",
            actualCompletion: "2025-12-20",
            implementingAgency: "Handlooms & Textiles Directorate",
            description: "Common facility centre equipped with modern jacquard looms, computerized design workstations, and solar drying yards.",
            milestones: [
                { title: "Weaving Shed Civil Works", plannedDate: "2025-04-30", actualDate: "2025-05-10", status: "COMPLETED" },
                { title: "Jacquard Machinery Installation", plannedDate: "2025-09-30", actualDate: "2025-10-05", status: "COMPLETED" },
                { title: "Master Artisan Training & Handover", plannedDate: "2025-12-31", actualDate: "2025-12-20", status: "COMPLETED" }
            ],
            timeline: [
                { event: "Scheme Sanctioned", date: "2024-10-15", category: "Approval", desc: "Sanctioned under artisan livelihood fund." },
                { event: "Funds Released", date: "2024-10-28", category: "Release", desc: "₹80.00 Lakhs released." },
                { event: "Final Operational Clearance", date: "2025-12-20", category: "Milestone", desc: "Weavers cooperative society commenced active production." }
            ],
            coordinates: { lat: 25.3200, lng: 82.9800 }
        },
        {
            id: "WRK-2026-UP-016",
            name: "Modern Cattle Shelter (Gaushala) with Bio-Gas Energy Plant",
            district: "Kanpur Nagar",
            constituency: "Kanpur (PC-43)",
            mp: "Hon. MP (Kanpur)",
            financialYear: "2025-26",
            category: "Community Assets & Skills",
            approvedAmountLakhs: 42.00,
            releasedAmountLakhs: 21.00,
            expenditureLakhs: 6.00,
            completionPct: 20,
            status: "PENDING",
            risk: "LOW",
            monitoringStatus: "Normal",
            monitoringObservations: "Boundary wall and drainage trenches completed. Bio-digester equipment procurement initiated.",
            daysDelayed: 0,
            lastUpdated: "2026-09-10",
            startDate: "2026-07-01",
            expectedCompletion: "2027-02-28",
            actualCompletion: null,
            implementingAgency: "Animal Husbandry Department",
            description: "Community animal welfare shelter with 15 cubic-meter bio-methanation energy generation facility for rural street lighting.",
            milestones: [
                { title: "Perimeter Boundary & Shed Plinth", plannedDate: "2026-09-30", actualDate: "2026-09-08", status: "COMPLETED" },
                { title: "Bio-Digester Tank Construction", plannedDate: "2026-11-30", actualDate: null, status: "PENDING" },
                { title: "Bio-Gas Generator & Shed Fitment", plannedDate: "2027-02-15", actualDate: null, status: "PENDING" }
            ],
            timeline: [
                { event: "Sanction Granted", date: "2026-06-15", category: "Approval", desc: "Sanctioned under rural animal husbandry scheme." },
                { event: "First Tranche Released", date: "2026-06-28", category: "Release", desc: "₹21.00 Lakhs (50%) advance released." },
                { event: "Site Demarcation Finalized", date: "2026-07-10", category: "Milestone", desc: "Gram Panchayat land certified and cleared." }
            ],
            coordinates: { lat: 26.4600, lng: 80.3200 }
        }
    ],

    // System Early Warning Intelligence Alerts
    alerts: [
        {
            id: "ALT-2026-801",
            type: "Unusual Expenditure",
            workId: "WRK-2026-UP-004",
            workName: "Smart Classroom Digital Labs in 10 Govt Inter Colleges",
            district: "Lucknow",
            constituency: "Lucknow (PC-35)",
            severity: "HIGH",
            riskScore: 72,
            detectedDate: "2026-09-20",
            status: "OPEN",
            description: "Potential anomaly detected: Zero financial disbursement recorded for 142 consecutive days despite fund sanctions. Physical progress stalled at 40%.",
            reason: "Disbursement velocity dropped >85% below average cluster rate for digital lab procurement.",
            evidence: "Released: ₹75.00 L | Expenditure: ₹30.00 L | Inactivity Interval: 142 days | Expected Progress: 85%",
            history: "Administrative sanction 2025-06-25. Vendor procurement milestone delayed by 174 days due to supply bottlenecks.",
            assignedTo: { officer: "Er. A. K. Verma", department: "Technical Quality & Audit Cell", assignedDate: "2026-09-20" },
            notes: [
                { note: "System algorithmic batch run flagged zero financial movement for >120 days.", author: "AI Early Warning Service", date: "2026-09-20 04:30" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-09-20", done: true, desc: "Statistical velocity monitor triggered high risk flag." },
                { stage: "Reviewed", date: null, done: false, desc: "Pending preliminary nodal screening." },
                { stage: "Assigned", date: "2026-09-20", done: true, desc: "Assigned to Technical Quality & Audit Cell." },
                { stage: "Investigated", date: null, done: false, desc: "Awaiting vendor SLA response." },
                { stage: "Resolved", date: null, done: false, desc: "Pending resolution." }
            ]
        },
        {
            id: "ALT-2026-802",
            type: "Delayed Project",
            workId: "WRK-2026-UP-006",
            workName: "Community Multipurpose Hall for Skill Development",
            district: "Mirzapur",
            constituency: "Mirzapur (PC-79)",
            severity: "CRITICAL",
            riskScore: 91,
            detectedDate: "2026-09-19",
            status: "OPEN",
            description: "Unusual pattern identified: Target SLA milestone overdue by 205 days with only 25% physical progress achieved. Comprehensive nodal review recommended.",
            reason: "Target completion date (2026-02-28) passed with 75% unbuilt superstructure.",
            evidence: "Target Date: 2026-02-28 | Actual Days Overdue: 205 | Physical Completion: 25% | Fund Expended: ₹15.00 L / ₹55.00 L",
            history: "Land cleared 2025-08-30. Contractor halted work citing raw material logistics challenges in remote tribal block.",
            assignedTo: { officer: "Shri Rajeshwar Singh, PCS", department: "District Nodal Cell Mirzapur", assignedDate: "2026-09-19" },
            notes: [
                { note: "Field visit scheduled by Sub-Divisional Magistrate for on-site inspection.", author: "Shri Rajeshwar Singh, PCS", date: "2026-09-19 14:15" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-09-19", done: true, desc: "SLA milestone threshold violation identified." },
                { stage: "Reviewed", date: null, done: false, desc: "Under review by Nodal Officer." },
                { stage: "Assigned", date: "2026-09-19", done: true, desc: "Assigned to District Nodal Cell." },
                { stage: "Investigated", date: null, done: false, desc: "Site visit pending." },
                { stage: "Resolved", date: null, done: false, desc: "Pending resolution." }
            ]
        },
        {
            id: "ALT-2026-803",
            type: "Fund Utilization Anomaly",
            workId: "WRK-2026-UP-008",
            workName: "Overhead Water Tank & Feeder Pipeline (50,000 Ltr)",
            district: "Jaunpur",
            constituency: "Jaunpur (PC-73)",
            severity: "HIGH",
            riskScore: 78,
            detectedDate: "2026-09-18",
            status: "UNDER_REVIEW",
            description: "Potential anomaly detected: High variance between released installment funds (100%) and verified utilization voucher submissions (51.4%).",
            reason: "Full grant released 14 months ago with ₹33.00 Lakhs remaining unspent in executing agency bank ledger.",
            evidence: "Released: ₹68.00 L (100%) | Voucher Expenditure: ₹35.00 L (51.4%) | Stagnant Treasury Float: ₹33.00 L",
            history: "Staging columns built; pipeline laying halted pending state highway crossing right-of-way permission.",
            assignedTo: { officer: "Smt. Vandana Yadav", department: "Jal Nigam Engineering Div & Treasury", assignedDate: "2026-09-18" },
            notes: [
                { note: "Treasury reconciliation report requested from Jal Nigam Executive Engineer.", author: "Smt. Vandana Yadav", date: "2026-09-18 16:20" },
                { note: "Inter-departmental coordination meeting held with NHAI Project Director.", author: "District Collectorate", date: "2026-09-19 11:00" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-09-18", done: true, desc: "Float variance ratio detected by Financial Ledger Analyzer." },
                { stage: "Reviewed", date: "2026-09-18", done: true, desc: "Marked Under Review by Nodal Officer." },
                { stage: "Assigned", date: "2026-09-18", done: true, desc: "Assigned to Jal Nigam Division." },
                { stage: "Investigated", date: null, done: false, desc: "Highway crossing clearance in progress." },
                { stage: "Resolved", date: null, done: false, desc: "Pending settlement." }
            ]
        },
        {
            id: "ALT-2026-804",
            type: "Cost Anomaly",
            workId: "WRK-2026-UP-005",
            workName: "All-Weather Link Road from NH-28 to Rampur Village (3.4 km)",
            district: "Ayodhya",
            constituency: "Ayodhya (PC-54)",
            severity: "MEDIUM",
            riskScore: 48,
            detectedDate: "2026-09-15",
            status: "UNDER_REVIEW",
            description: "Unusual pattern identified: Per-kilometer road laying expense estimate deviates by +22% from standard state schedule of rates (SoR).",
            reason: "Estimated rate ₹32.35 L/km vs regional benchmark ₹26.50 L/km for rural single-lane bituminous pavement.",
            evidence: "Approved: ₹110.00 L / 3.4 km = ₹32.35 L/km | Benchmark SoR: ₹26.50 L/km | Variance: +22.07%",
            history: "Technical clearance accorded by PWD Superintending Engineer noting marshy sub-grade soil requiring extra granular sub-base.",
            assignedTo: { officer: "Er. Manoj Tiwari", department: "PWD Technical Vetting Division", assignedDate: "2026-09-16" },
            notes: [
                { note: "Superintending Engineer verified that swampy terrain required specialized geotextile underlay.", author: "Er. Manoj Tiwari", date: "2026-09-17 10:45" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-09-15", done: true, desc: "Cost rate variance detected vs PWD SoR matrix." },
                { stage: "Reviewed", date: "2026-09-16", done: true, desc: "Technical justification provided by executing division." },
                { stage: "Assigned", date: "2026-09-16", done: true, desc: "Assigned to PWD Technical Vetting." },
                { stage: "Investigated", date: null, done: false, desc: "Soil core testing documentation under audit." },
                { stage: "Resolved", date: null, done: false, desc: "Pending sign-off." }
            ]
        },
        {
            id: "ALT-2026-805",
            type: "Possible Duplicate Work",
            workId: "WRK-2026-UP-001",
            workName: "Installation of Solar High-Mast Lights in 12 Village Squares",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            severity: "LOW",
            riskScore: 18,
            detectedDate: "2026-09-10",
            status: "RESOLVED",
            description: "Requires review: Geolocation proximity match (<100m) with state rural electrification scheme; verified distinct upon joint site inspection.",
            reason: "Automated GIS spatial buffer identified neighboring state renewable lighting asset within 85m radius.",
            evidence: "Proximity: 85 meters from State Scheme Pole #UP-REV-109 | Distinct Beneficiary Square: Ward 4 vs Ward 6",
            history: "Junior Engineer conducted joint site verification on 2026-09-12 confirming distinct installation chowks.",
            assignedTo: { officer: "Shri D. P. Singh", department: "DRDA Varanasi", assignedDate: "2026-09-10" },
            notes: [
                { note: "Physical inspection confirmed that MPLADS solar mast serves community haat, while state light serves temple gate.", author: "Shri D. P. Singh", date: "2026-09-12 15:30" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-09-10", done: true, desc: "GIS radius proximity trigger matched state scheme coordinates." },
                { stage: "Reviewed", date: "2026-09-11", done: true, desc: "Nodal officer assigned physical verification." },
                { stage: "Assigned", date: "2026-09-10", done: true, desc: "Assigned to DRDA Field Engineer." },
                { stage: "Investigated", date: "2026-09-12", done: true, desc: "Joint field report submitted with geo-tagged photographs." },
                { stage: "Resolved", date: "2026-09-13", done: true, desc: "Verified non-overlapping and closed by Nodal Officer." }
            ]
        },
        {
            id: "ALT-2026-806",
            type: "Missing Milestone",
            workId: "WRK-2026-UP-002",
            workName: "Construction of Primary Health Centre Diagnostic Wing",
            district: "Gorakhpur",
            constituency: "Gorakhpur (PC-64)",
            severity: "MEDIUM",
            riskScore: 35,
            detectedDate: "2026-09-08",
            status: "RESOLVED",
            description: "Potential anomaly detected: Quarterly geo-tagged progress telemetry log missing for Q2; updated following nodal inspection.",
            reason: "Q2 mobile telemetry upload omitted during monsoon administrative transition.",
            evidence: "Missing Log: Q2 FY 2025-26 physical telemetry submission deadline passed on 2026-06-30.",
            history: "Executive Engineer uploaded retrospective geo-tagged photos and structural stability certificate on 2026-09-11.",
            assignedTo: { officer: "Dr. Alok Srivastava", department: "Chief Medical Office Gorakhpur", assignedDate: "2026-09-08" },
            notes: [
                { note: "Full photographic inspection dossier and certificate received and verified.", author: "Dr. Alok Srivastava", date: "2026-09-11 17:00" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-09-08", done: true, desc: "Telemetry ingestion gap detected for Q2." },
                { stage: "Reviewed", date: "2026-09-09", done: true, desc: "Notice issued to Executing Division." },
                { stage: "Assigned", date: "2026-09-08", done: true, desc: "Assigned to CMO Gorakhpur." },
                { stage: "Investigated", date: "2026-09-11", done: true, desc: "All 18 geo-tagged high-res photos verified." },
                { stage: "Resolved", date: "2026-09-12", done: true, desc: "Telemetry updated in portal; flag resolved." }
            ]
        },
        {
            id: "ALT-2026-807",
            type: "Contractor Concentration",
            workId: "WRK-2026-UP-007",
            workName: "Solar Powered Cold Storage Facility for Vegetable Farmers",
            district: "Kanpur Nagar",
            constituency: "Kanpur (PC-43)",
            severity: "LOW",
            riskScore: 24,
            detectedDate: "2026-09-04",
            status: "OPEN",
            description: "Unusual pattern identified: Implementing contractor awarded >4 concurrent rural cold storage projects within same sub-division.",
            reason: "High vendor share (68%) across refrigerated warehouse sub-schemes in district cluster.",
            evidence: "Vendor: M/s Agri-Cool Systems Ltd | Active Contracts: 4 / 6 in Kanpur sub-district | Value: ₹3.60 Cr",
            history: "Tender was awarded through open e-procurement portal with 3 qualified technical bids.",
            assignedTo: { officer: "Shri K. L. Meena", department: "District Procurement Oversight Cell", assignedDate: "2026-09-05" },
            notes: [
                { note: "Tender evaluation committee minutes summoned for standard procedural validation.", author: "Shri K. L. Meena", date: "2026-09-06 12:10" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-09-04", done: true, desc: "Vendor concentration threshold exceeded 50% in cluster." },
                { stage: "Reviewed", date: null, done: false, desc: "Pending procurement cell audit." },
                { stage: "Assigned", date: "2026-09-05", done: true, desc: "Assigned to Procurement Cell." },
                { stage: "Investigated", date: null, done: false, desc: "Bidding records under review." },
                { stage: "Resolved", date: null, done: false, desc: "Pending resolution." }
            ]
        },
        {
            id: "ALT-2026-808",
            type: "Geographic Anomaly",
            workId: "WRK-2026-UP-003",
            workName: "Deep Tube Wells & Water Purification RO Plant Setup",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            severity: "LOW",
            riskScore: 12,
            detectedDate: "2026-08-28",
            status: "RESOLVED",
            description: "Requires review: GPS marker drift outside registered village boundary corrected to validated panchayat coordinates.",
            reason: "Initial surveyor mobile GPS sensor showed 140m variance during cloud cover.",
            evidence: "Initial Lat/Lng: 25.4380, 81.8490 | Validated Lat/Lng: 25.4358, 81.8463 | Deviation: 142m",
            history: "Revenue Inspector surveyed the deep borewell site and re-anchored landmark telemetry on 2026-08-30.",
            assignedTo: { officer: "Shri R. N. Pathak", department: "Revenue & Land Records Division", assignedDate: "2026-08-28" },
            notes: [
                { note: "Corrected GPS coordinates updated in GIS map database.", author: "Shri R. N. Pathak", date: "2026-08-30 16:00" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-08-28", done: true, desc: "GIS polygon mismatch triggered boundary alert." },
                { stage: "Reviewed", date: "2026-08-29", done: true, desc: "Revenue Inspector dispatched for re-calibration." },
                { stage: "Assigned", date: "2026-08-28", done: true, desc: "Assigned to Revenue Division." },
                { stage: "Investigated", date: "2026-08-30", done: true, desc: "Differential GPS fix verified on-site." },
                { stage: "Resolved", date: "2026-08-31", done: true, desc: "Map marker updated and flag closed." }
            ]
        },
        {
            id: "ALT-2026-809",
            type: "Unusual Expenditure",
            workId: "WRK-2026-UP-012",
            workName: "Construction of Multi-Span Bridge across Sasur Khaderi River",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            severity: "MEDIUM",
            riskScore: 42,
            detectedDate: "2026-08-20",
            status: "DISMISSED",
            description: "Data inconsistency detected: Rapid single-tranche disbursement (₹110.50 L) recorded following deck slab completion.",
            reason: "Single voucher disbursement represented 76% of total approved scheme cost.",
            evidence: "Disbursement: ₹110.50 L on 2026-08-10 | Pre-disbursement Inspection: Structural Load Test passed on 2026-08-04.",
            history: "Contract terms specified consolidated super-structure milestone billing upon formal load test certification.",
            assignedTo: { officer: "Er. Sanjay Kumar", department: "UP State Bridge Corporation", assignedDate: "2026-08-21" },
            notes: [
                { note: "Contract agreement verified: Clause 14 permits consolidated super-structure payment upon certified load test.", author: "Er. Sanjay Kumar", date: "2026-08-22 11:30" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-08-20", done: true, desc: "Lump-sum expenditure velocity trigger fired." },
                { stage: "Reviewed", date: "2026-08-21", done: true, desc: "Contract billing schedule reviewed." },
                { stage: "Assigned", date: "2026-08-21", done: true, desc: "Assigned to Bridge Corp Audit Cell." },
                { stage: "Investigated", date: "2026-08-22", done: true, desc: "Load test certificate and billing terms reconciled." },
                { stage: "Resolved", date: "2026-08-23", done: true, desc: "Dismissed: Valid contract milestone execution." }
            ]
        },
        {
            id: "ALT-2026-810",
            type: "Delayed Project",
            workId: "WRK-2026-UP-008",
            workName: "Overhead Water Tank & Feeder Pipeline (50,000 Ltr)",
            district: "Jaunpur",
            constituency: "Jaunpur (PC-73)",
            severity: "HIGH",
            riskScore: 74,
            detectedDate: "2026-08-15",
            status: "UNDER_REVIEW",
            description: "Potential anomaly detected: Overdue by 144 days beyond target completion date (2026-04-30). Trenching progress constrained.",
            reason: "Delay caused by utility alignment coordination and road permit approvals.",
            evidence: "Planned End: 2026-04-30 | Delay: 144 days | Physical Progress: 52%",
            history: "Overhead tank structure built; 2.2 km pipeline trenching remaining.",
            assignedTo: { officer: "Shri Vinay Verma", department: "Jal Nigam Jaunpur", assignedDate: "2026-08-16" },
            notes: [
                { note: "Special coordination meeting held with State Highway Authority.", author: "Shri Vinay Verma", date: "2026-08-18 14:00" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-08-15", done: true, desc: "SLA schedule overrun detected." },
                { stage: "Reviewed", date: "2026-08-16", done: true, desc: "Marked Under Review." },
                { stage: "Assigned", date: "2026-08-16", done: true, desc: "Assigned to Jal Nigam." },
                { stage: "Investigated", date: null, done: false, desc: "Permit resolution pending." },
                { stage: "Resolved", date: null, done: false, desc: "Pending completion." }
            ]
        },
        {
            id: "ALT-2026-811",
            type: "Fund Utilization Anomaly",
            workId: "WRK-2026-UP-009",
            workName: "Solid Waste Processing & Segregation Facility",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            severity: "LOW",
            riskScore: 22,
            detectedDate: "2026-08-12",
            status: "OPEN",
            description: "Requires review: Initial advance release (₹36.00 L) shows 27.7% voucher submission rate within initial 45-day cycle.",
            reason: "Normal procurement lead-time for mechanical shredder units under tender process.",
            evidence: "Released: ₹36.00 L | Spent: ₹10.00 L | Remaining Advance: ₹26.00 L",
            history: "Project sanctioned 2026-07-15; site groundbreaking completed 2026-08-20.",
            assignedTo: { officer: "Shri Sandeep Gaur", department: "Varanasi Municipal Corporation", assignedDate: "2026-08-13" },
            notes: [
                { note: "Municipal Corp notified that machinery tender opens next week.", author: "Shri Sandeep Gaur", date: "2026-08-14 10:30" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-08-12", done: true, desc: "First trimester utilization metric flagged." },
                { stage: "Reviewed", date: null, done: false, desc: "Pending preliminary review." },
                { stage: "Assigned", date: "2026-08-13", done: true, desc: "Assigned to Municipal Corporation." },
                { stage: "Investigated", date: null, done: false, desc: "Tender evaluation ongoing." },
                { stage: "Resolved", date: null, done: false, desc: "Pending resolution." }
            ]
        },
        {
            id: "ALT-2026-812",
            type: "Cost Anomaly",
            workId: "WRK-2026-UP-014",
            workName: "Rooftop Solar Electrification for 20 Panchayat Bhavans",
            district: "Mirzapur",
            constituency: "Mirzapur (PC-79)",
            severity: "LOW",
            riskScore: 16,
            detectedDate: "2026-08-08",
            status: "RESOLVED",
            description: "Data inconsistency detected: Per-KW solar panel fitment rate deviates by -12% compared to standard state benchmark.",
            reason: "Favorable bulk rate achieved through combined 20-panchayat consolidated procurement.",
            evidence: "Achieved Cost: ₹58,000 / kW | Benchmark: ₹66,000 / kW | Savings: ₹8,000 / kW",
            history: "UPNEDA confirmed bulk tender discount resulting in public savings.",
            assignedTo: { officer: "Er. Neeraj Saxena", department: "UPNEDA Mirzapur", assignedDate: "2026-08-08" },
            notes: [
                { note: "Bulk procurement discount certified; verified compliant with MNRE specifications.", author: "Er. Neeraj Saxena", date: "2026-08-10 15:45" }
            ],
            timeline: [
                { stage: "Detected", date: "2026-08-08", done: true, desc: "Rate variance detected below regional mean." },
                { stage: "Reviewed", date: "2026-08-09", done: true, desc: "Reviewed by UPNEDA Project Officer." },
                { stage: "Assigned", date: "2026-08-08", done: true, desc: "Assigned to UPNEDA." },
                { stage: "Investigated", date: "2026-08-10", done: true, desc: "Technical specifications verified." },
                { stage: "Resolved", date: "2026-08-11", done: true, desc: "Closed: Verified genuine public savings." }
            ]
        }
    ],

    // Financial Transactions Ledger
    financialTransactions: [
        {
            id: "TXN-2026-9001",
            workId: "WRK-2026-UP-001",

            workName: "Installation of Solar High-Mast Lights in 12 Village Squares",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            category: "Renewable Energy & Lighting",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 48.50,
            date: "2025-10-15",
            reference: "SANCTION/2025/UP-001",
            status: "COMPLETED",
            description: "Administrative budget sanction for 12 village high-mast solar lighting systems."
        },
        {
            id: "TXN-2026-9002",
            workId: "WRK-2026-UP-001",
            workName: "Installation of Solar High-Mast Lights in 12 Village Squares",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            category: "Renewable Energy & Lighting",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 24.25,
            date: "2025-11-01",
            reference: "TREASURY-REL-4102",
            status: "COMPLETED",
            description: "First installment tranche (50%) released to DRDA Varanasi."
        },
        {
            id: "TXN-2026-9003",
            workId: "WRK-2026-UP-001",
            workName: "Installation of Solar High-Mast Lights in 12 Village Squares",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            category: "Renewable Energy & Lighting",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 24.25,
            date: "2026-03-15",
            reference: "TREASURY-REL-4589",
            status: "COMPLETED",
            description: "Second installment tranche (50%) disbursed upon milestone certification."
        },
        {
            id: "TXN-2026-9004",
            workId: "WRK-2026-UP-001",
            workName: "Installation of Solar High-Mast Lights in 12 Village Squares",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            category: "Renewable Energy & Lighting",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 22.30,
            date: "2026-04-20",
            reference: "PFMS-VOUCHER-8812",
            status: "COMPLETED",
            description: "Disbursement to vendor for solar panels, mounting poles, and civil foundation."
        },
        {
            id: "TXN-2026-9005",
            workId: "WRK-2026-UP-001",
            workName: "Installation of Solar High-Mast Lights in 12 Village Squares",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            category: "Renewable Energy & Lighting",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 22.30,
            date: "2026-09-16",
            reference: "PFMS-VOUCHER-8940",
            status: "COMPLETED",
            description: "Settlement of luminaire fitment, lithium batteries, and telemetry setup."
        },
        {
            id: "TXN-2026-9006",
            workId: "WRK-2026-UP-002",
            workName: "Construction of Primary Health Centre Diagnostic Wing",
            district: "Gorakhpur",
            constituency: "Gorakhpur (PC-64)",
            category: "Public Health Infrastructure",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 85.00,
            date: "2025-07-10",
            reference: "SANCTION/2025/UP-002",
            status: "COMPLETED",
            description: "Approved budget sanction for PHC diagnostic & lab expansion wing."
        },
        {
            id: "TXN-2026-9007",
            workId: "WRK-2026-UP-002",
            workName: "Construction of Primary Health Centre Diagnostic Wing",
            district: "Gorakhpur",
            constituency: "Gorakhpur (PC-64)",
            category: "Public Health Infrastructure",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 85.00,
            date: "2025-08-05",
            reference: "TREASURY-REL-4210",
            status: "COMPLETED",
            description: "Full approved funds disbursed to Public Works Department."
        },
        {
            id: "TXN-2026-9008",
            workId: "WRK-2026-UP-002",
            workName: "Construction of Primary Health Centre Diagnostic Wing",
            district: "Gorakhpur",
            constituency: "Gorakhpur (PC-64)",
            category: "Public Health Infrastructure",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 36.10,
            date: "2025-12-15",
            reference: "PFMS-VOUCHER-8804",
            status: "COMPLETED",
            description: "Civil structural envelope and reinforced concrete works payment."
        },
        {
            id: "TXN-2026-9009",
            workId: "WRK-2026-UP-002",
            workName: "Construction of Primary Health Centre Diagnostic Wing",
            district: "Gorakhpur",
            constituency: "Gorakhpur (PC-64)",
            category: "Public Health Infrastructure",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 36.10,
            date: "2026-09-12",
            reference: "PFMS-VOUCHER-9102",
            status: "COMPLETED",
            description: "Internal sanitary fittings, pathology lab counters, and electrical wiring settlement."
        },
        {
            id: "TXN-2026-9010",
            workId: "WRK-2026-UP-003",
            workName: "Deep Tube Wells & Water Purification RO Plant Setup",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            category: "Drinking Water & Sanitation",
            financialYear: "2024-25",
            type: "ALLOCATION",
            amountLakhs: 62.00,
            date: "2025-05-20",
            reference: "SANCTION/2024/UP-003",
            status: "COMPLETED",
            description: "Approved sanction for 4 rural community RO water filtration stations."
        },
        {
            id: "TXN-2026-9011",
            workId: "WRK-2026-UP-003",
            workName: "Deep Tube Wells & Water Purification RO Plant Setup",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            category: "Drinking Water & Sanitation",
            financialYear: "2024-25",
            type: "RELEASE",
            amountLakhs: 62.00,
            date: "2025-06-01",
            reference: "TREASURY-REL-3904",
            status: "COMPLETED",
            description: "Grant transfer to Jal Nigam Technical Division."
        },
        {
            id: "TXN-2026-9012",
            workId: "WRK-2026-UP-003",
            workName: "Deep Tube Wells & Water Purification RO Plant Setup",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            category: "Drinking Water & Sanitation",
            financialYear: "2024-25",
            type: "EXPENDITURE",
            amountLakhs: 62.00,
            date: "2026-05-18",
            reference: "PFMS-VOUCHER-8650",
            status: "COMPLETED",
            description: "Final project settlement and commissioning voucher against Form GFR-12C."
        },
        {
            id: "TXN-2026-9013",
            workId: "WRK-2026-UP-004",
            workName: "Smart Classroom Digital Labs in 10 Govt Inter Colleges",
            district: "Lucknow",
            constituency: "Lucknow (PC-35)",
            category: "Education & Digital Labs",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 75.00,
            date: "2025-06-25",
            reference: "SANCTION/2025/UP-004",
            status: "COMPLETED",
            description: "Allocation for 10 high-school interactive digital learning centers."
        },
        {
            id: "TXN-2026-9014",
            workId: "WRK-2026-UP-004",
            workName: "Smart Classroom Digital Labs in 10 Govt Inter Colleges",
            district: "Lucknow",
            constituency: "Lucknow (PC-35)",
            category: "Education & Digital Labs",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 75.00,
            date: "2025-07-05",
            reference: "TREASURY-REL-4180",
            status: "COMPLETED",
            description: "Full allocation transferred to State Educational Infra Corp."
        },
        {
            id: "TXN-2026-9015",
            workId: "WRK-2026-UP-004",
            workName: "Smart Classroom Digital Labs in 10 Govt Inter Colleges",
            district: "Lucknow",
            constituency: "Lucknow (PC-35)",
            category: "Education & Digital Labs",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 30.00,
            date: "2025-10-20",
            reference: "PFMS-VOUCHER-8745",
            status: "COMPLETED",
            description: "Phase-1 classroom electrification and networking infrastructure voucher."
        },
        {
            id: "TXN-2026-9016",
            workId: "WRK-2026-UP-005",
            workName: "All-Weather Link Road from NH-28 to Rampur Village (3.4 km)",
            district: "Ayodhya",
            constituency: "Ayodhya (PC-54)",
            category: "Rural Roads & Bridges",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 110.00,
            date: "2025-08-15",
            reference: "SANCTION/2025/UP-005",
            status: "COMPLETED",
            description: "Sanction order for 3.4 km bituminous rural link roadway."
        },
        {
            id: "TXN-2026-9017",
            workId: "WRK-2026-UP-005",
            workName: "All-Weather Link Road from NH-28 to Rampur Village (3.4 km)",
            district: "Ayodhya",
            constituency: "Ayodhya (PC-54)",
            category: "Rural Roads & Bridges",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 55.00,
            date: "2025-09-05",
            reference: "TREASURY-REL-4310",
            status: "COMPLETED",
            description: "First tranche release for sub-grade earthworks and culvert construction."
        },
        {
            id: "TXN-2026-9018",
            workId: "WRK-2026-UP-005",
            workName: "All-Weather Link Road from NH-28 to Rampur Village (3.4 km)",
            district: "Ayodhya",
            constituency: "Ayodhya (PC-54)",
            category: "Rural Roads & Bridges",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 55.00,
            date: "2026-02-20",
            reference: "TREASURY-REL-4600",
            status: "COMPLETED",
            description: "Second tranche release for bituminous surfacing and drains."
        },
        {
            id: "TXN-2026-9019",
            workId: "WRK-2026-UP-005",
            workName: "All-Weather Link Road from NH-28 to Rampur Village (3.4 km)",
            district: "Ayodhya",
            constituency: "Ayodhya (PC-54)",
            category: "Rural Roads & Bridges",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 88.00,
            date: "2026-09-08",
            reference: "PFMS-VOUCHER-9050",
            status: "COMPLETED",
            description: "Contractor progress voucher verified by PWD Superintending Engineer."
        },
        {
            id: "TXN-2026-9020",
            workId: "WRK-2026-UP-006",
            workName: "Community Multipurpose Hall for Skill Development",
            district: "Mirzapur",
            constituency: "Mirzapur (PC-79)",
            category: "Community Assets & Skills",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 55.00,
            date: "2025-04-20",
            reference: "SANCTION/2025/UP-006",
            status: "COMPLETED",
            description: "Sanction under tribal artisan livelihood support fund."
        },
        {
            id: "TXN-2026-9021",
            workId: "WRK-2026-UP-006",
            workName: "Community Multipurpose Hall for Skill Development",
            district: "Mirzapur",
            constituency: "Mirzapur (PC-79)",
            category: "Community Assets & Skills",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 55.00,
            date: "2025-05-01",
            reference: "TREASURY-REL-3850",
            status: "COMPLETED",
            description: "Total project fund released to DRDA Mirzapur."
        },
        {
            id: "TXN-2026-9022",
            workId: "WRK-2026-UP-006",
            workName: "Community Multipurpose Hall for Skill Development",
            district: "Mirzapur",
            constituency: "Mirzapur (PC-79)",
            category: "Community Assets & Skills",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 15.00,
            date: "2025-08-30",
            reference: "PFMS-VOUCHER-8720",
            status: "COMPLETED",
            description: "Foundation excavation, boundary demarcation, and plinth slab payment."
        },
        {
            id: "TXN-2026-9023",
            workId: "WRK-2026-UP-007",
            workName: "Solar Powered Cold Storage Facility for Vegetable Farmers",
            district: "Kanpur Nagar",
            constituency: "Kanpur (PC-43)",
            category: "Community Assets & Skills",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 90.00,
            date: "2025-07-28",
            reference: "SANCTION/2025/UP-007",
            status: "COMPLETED",
            description: "Approved sanction for 50-MT cold room at rural farmers mandi."
        },
        {
            id: "TXN-2026-9024",
            workId: "WRK-2026-UP-007",
            workName: "Solar Powered Cold Storage Facility for Vegetable Farmers",
            district: "Kanpur Nagar",
            constituency: "Kanpur (PC-43)",
            category: "Community Assets & Skills",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 90.00,
            date: "2025-08-10",
            reference: "TREASURY-REL-4250",
            status: "COMPLETED",
            description: "Full sanction released to UP Agro Industrial Corp."
        },
        {
            id: "TXN-2026-9025",
            workId: "WRK-2026-UP-007",
            workName: "Solar Powered Cold Storage Facility for Vegetable Farmers",
            district: "Kanpur Nagar",
            constituency: "Kanpur (PC-43)",
            category: "Community Assets & Skills",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 41.00,
            date: "2026-01-15",
            reference: "PFMS-VOUCHER-8791",
            status: "COMPLETED",
            description: "Insulated PUF panel cold room civil construction voucher."
        },
        {
            id: "TXN-2026-9026",
            workId: "WRK-2026-UP-007",
            workName: "Solar Powered Cold Storage Facility for Vegetable Farmers",
            district: "Kanpur Nagar",
            constituency: "Kanpur (PC-43)",
            category: "Community Assets & Skills",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 41.00,
            date: "2026-08-29",
            reference: "PFMS-VOUCHER-8998",
            status: "COMPLETED",
            description: "Solar PV panels, compressor unit, and refrigerant charging settlement."
        },
        {
            id: "TXN-2026-9027",
            workId: "WRK-2026-UP-008",
            workName: "Overhead Water Tank & Feeder Pipeline (50,000 Ltr)",
            district: "Jaunpur",
            constituency: "Jaunpur (PC-73)",
            category: "Drinking Water & Sanitation",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 68.00,
            date: "2025-06-12",
            reference: "SANCTION/2025/UP-008",
            status: "COMPLETED",
            description: "Sanction for RCC staging overhead reservoir and distribution pipes."
        },
        {
            id: "TXN-2026-9028",
            workId: "WRK-2026-UP-008",
            workName: "Overhead Water Tank & Feeder Pipeline (50,000 Ltr)",
            district: "Jaunpur",
            constituency: "Jaunpur (PC-73)",
            category: "Drinking Water & Sanitation",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 68.00,
            date: "2025-06-25",
            reference: "TREASURY-REL-4140",
            status: "COMPLETED",
            description: "Fund disbursement to Jal Nigam Jaunpur division."
        },
        {
            id: "TXN-2026-9029",
            workId: "WRK-2026-UP-008",
            workName: "Overhead Water Tank & Feeder Pipeline (50,000 Ltr)",
            district: "Jaunpur",
            constituency: "Jaunpur (PC-73)",
            category: "Drinking Water & Sanitation",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 35.00,
            date: "2025-11-25",
            reference: "PFMS-VOUCHER-8780",
            status: "COMPLETED",
            description: "RCC staging columns and base ring beam completion disbursement."
        },
        {
            id: "TXN-2026-9030",
            workId: "WRK-2026-UP-009",
            workName: "Solid Waste Processing & Segregation Facility",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            category: "Drinking Water & Sanitation",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 72.00,
            date: "2026-07-15",
            reference: "SANCTION/2026/UP-009",
            status: "COMPLETED",
            description: "Sanction for solid waste composting and segregation facility."
        },
        {
            id: "TXN-2026-9031",
            workId: "WRK-2026-UP-009",
            workName: "Solid Waste Processing & Segregation Facility",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            category: "Drinking Water & Sanitation",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 36.00,
            date: "2026-07-30",
            reference: "TREASURY-REL-4990",
            status: "COMPLETED",
            description: "Initial 50% advance release for boundary and site leveling."
        },
        {
            id: "TXN-2026-9032",
            workId: "WRK-2026-UP-009",
            workName: "Solid Waste Processing & Segregation Facility",
            district: "Varanasi",
            constituency: "Varanasi (PC-77)",
            category: "Drinking Water & Sanitation",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 10.00,
            date: "2026-08-28",
            reference: "PFMS-VOUCHER-9140",
            status: "COMPLETED",
            description: "Land demarcation, boundary wall, and drainage trench settlement."
        },
        {
            id: "TXN-2026-9033",
            workId: "WRK-2026-UP-010",
            workName: "Pedestrian Overbridge & Footpath Modernization",
            district: "Lucknow",
            constituency: "Lucknow (PC-35)",
            category: "Rural Roads & Bridges",
            financialYear: "2024-25",
            type: "ALLOCATION",
            amountLakhs: 40.00,
            date: "2025-09-10",
            reference: "SANCTION/2024/UP-010",
            status: "COMPLETED",
            description: "Initial sanction record for pedestrian walkway project."
        },
        {
            id: "TXN-2026-9034",
            workId: "WRK-2026-UP-010",
            workName: "Pedestrian Overbridge & Footpath Modernization",
            district: "Lucknow",
            constituency: "Lucknow (PC-35)",
            category: "Rural Roads & Bridges",
            financialYear: "2024-25",
            type: "REFUND",
            amountLakhs: 40.00,
            date: "2026-08-05",
            reference: "TREASURY-REF-104",
            status: "COMPLETED",
            description: "Fund de-allocation and return to central treasury due to metro alignment overlap."
        },
        {
            id: "TXN-2026-9035",
            workId: "WRK-2026-UP-012",
            workName: "Construction of Multi-Span Bridge across Sasur Khaderi River",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            category: "Rural Roads & Bridges",
            financialYear: "2025-26",
            type: "ALLOCATION",
            amountLakhs: 145.00,
            date: "2025-05-10",
            reference: "SANCTION/2025/UP-012",
            status: "COMPLETED",
            description: "Sanction for 72m span RCC bridge across flood-isolated villages."
        },
        {
            id: "TXN-2026-9036",
            workId: "WRK-2026-UP-012",
            workName: "Construction of Multi-Span Bridge across Sasur Khaderi River",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            category: "Rural Roads & Bridges",
            financialYear: "2025-26",
            type: "RELEASE",
            amountLakhs: 145.00,
            date: "2025-05-25",
            reference: "TREASURY-REL-3920",
            status: "COMPLETED",
            description: "Disbursement to UP State Bridge Corporation."
        },
        {
            id: "TXN-2026-9037",
            workId: "WRK-2026-UP-012",
            workName: "Construction of Multi-Span Bridge across Sasur Khaderi River",
            district: "Prayagraj",
            constituency: "Prayagraj (PC-52)",
            category: "Rural Roads & Bridges",
            financialYear: "2025-26",
            type: "EXPENDITURE",
            amountLakhs: 110.50,
            date: "2026-08-10",
            reference: "PFMS-VOUCHER-9010",
            status: "COMPLETED",
            description: "Superstructure deck slabs, pier caps, and load-test settlement voucher."
        },
        {
            id: "TXN-2026-9038",
            workId: "WRK-2026-UP-014",
            workName: "Rooftop Solar Electrification for 20 Panchayat Bhavans",
            district: "Mirzapur",
            constituency: "Mirzapur (PC-79)",
            category: "Renewable Energy & Lighting",
            financialYear: "2025-26",
            type: "ADJUSTMENT",
            amountLakhs: 2.20,
            date: "2026-09-01",
            reference: "TREASURY-ADJ-204",
            status: "COMPLETED",
            description: "Quarterly interest accrual adjustment credited to scheme account."
        }
    ],

    // Generated Reports Log
    reports: [
        {
            id: "RPT-2026-01",
            type: "Monthly Progress Report (MPR)",
            generatedDate: "2026-09-20 18:30",
            generatedBy: "System Automated Scheduler",
            status: "COMPLETED",
            format: "PDF (2.4 MB)"
        },
        {
            id: "RPT-2026-02",
            type: "Utilization Certificate (Form GFR-12C)",
            generatedDate: "2026-09-18 11:15",
            generatedBy: "Dr. R. K. Sharma, IAS",
            status: "COMPLETED",
            format: "PDF (1.1 MB)"
        },
        {
            id: "RPT-2026-03",
            type: "Sectoral Fund Audit Packet",
            generatedDate: "2026-09-15 16:45",
            generatedBy: "Central Finance Auditor",
            status: "COMPLETED",
            format: "XLSX (4.8 MB)"
        },
        {
            id: "RPT-2026-04",
            type: "Delayed Projects & SLA Escalation Dossier",
            generatedDate: "2026-09-10 09:00",
            generatedBy: "AI Early Warning Service",
            status: "COMPLETED",
            format: "PDF (1.8 MB)"
        }
    ]
};

// Aliases for seamless access
MPLADS_DEMO_DATA.transactions = MPLADS_DEMO_DATA.financialTransactions;

// Export
if (typeof module !== 'undefined' && module.exports) {
    try {
        const { enrichMockDataForAllDistricts } = require('./india-districts.js');
        if (typeof enrichMockDataForAllDistricts === 'function') {
            enrichMockDataForAllDistricts(MPLADS_DEMO_DATA);
        }
    } catch (e) {}
    module.exports = MPLADS_DEMO_DATA;
} else if (typeof window !== 'undefined') {
    window.MPLADS_DEMO_DATA = MPLADS_DEMO_DATA;
}

