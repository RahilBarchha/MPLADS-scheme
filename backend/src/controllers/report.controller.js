const DataStore = require('../repositories/dataStore');

class ReportController {
    static getReports(req, res) {
        try {
            const reports = DataStore.getReports();
            res.json({
                success: true,
                data: reports
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static generateReport(req, res) {
        try {
            const { type, district, fy } = req.body;
            const newReport = {
                id: `RPT-2026-${Date.now().toString().slice(-4)}`,
                type: type || "Monthly Progress Report (MPR)",
                generatedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
                generatedBy: "System Auditor (Authorized)",
                district: district || "All Districts",
                status: "COMPLETED",
                format: "PDF (2.2 MB)"
            };

            DataStore.addReport(newReport);

            res.json({
                success: true,
                message: 'Report generated successfully',
                data: newReport
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = ReportController;
