const DataStore = require('../repositories/dataStore');

class AlertController {
    // Get all alerts with filtering
    static getAlerts(req, res) {
        try {
            const { severity, status, district, category } = req.query;
            let alerts = DataStore.getAlerts();

            if (severity && severity !== 'ALL') {
                alerts = alerts.filter(a => (a.severity || '').toUpperCase() === severity.toUpperCase());
            }
            if (status && status !== 'ALL') {
                alerts = alerts.filter(a => (a.status || '').toUpperCase() === status.toUpperCase());
            }
            if (district && district !== 'ALL') {
                alerts = alerts.filter(a => a.district === district);
            }
            if (category && category !== 'ALL') {
                alerts = alerts.filter(a => a.category === category);
            }

            res.json({
                success: true,
                total: alerts.length,
                data: alerts
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get single alert
    static getAlertById(req, res) {
        try {
            const { id } = req.params;
            const alert = DataStore.getAlertById(id);
            if (!alert) {
                return res.status(404).json({ success: false, message: 'Alert not found' });
            }

            // Linked work
            const linkedWork = alert.workId ? DataStore.getWorkById(alert.workId) : null;

            res.json({
                success: true,
                data: {
                    ...alert,
                    linkedWork
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Update alert status (e.g. UNDER_REVIEW, RESOLVED, DISMISSED)
    static updateAlertStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, note, assignedOfficer } = req.body;

            const patch = {};
            if (status) patch.status = status;
            if (note) patch.resolutionNote = note;
            if (assignedOfficer) patch.assignedOfficer = assignedOfficer;

            const updated = DataStore.updateAlert(id, patch);
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Alert not found' });
            }

            res.json({
                success: true,
                message: `Alert status updated to ${status}`,
                data: updated
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = AlertController;
