const AiService = require('../services/ai.service');
const DataStore = require('../repositories/dataStore');

class AiController {
    // Run full AI Audit scan
    static async runAudit(req, res) {
        try {
            const auditResult = AiService.runFullAudit();
            res.json({
                success: true,
                data: auditResult
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Detect duplicate works
    static async detectDuplicates(req, res) {
        try {
            const works = DataStore.getWorks();
            const duplicates = AiService.detectDuplicates(works);
            res.json({
                success: true,
                count: duplicates.length,
                data: duplicates
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Forensic explanation for alert or project
    static async explain(req, res) {
        try {
            const { id, type } = req.body;
            let targetItem = null;

            if (type === 'work' || (id && id.startsWith('WRK-'))) {
                targetItem = DataStore.getWorkById(id);
            } else {
                targetItem = DataStore.getAlertById(id);
                if (!targetItem) {
                    targetItem = DataStore.getWorkById(id);
                }
            }

            if (!targetItem) {
                targetItem = {
                    id: id || 'DEMO-ITEM',
                    name: 'Flagged MPLADS Asset Allocation',
                    district: 'Varanasi',
                    severity: 'HIGH',
                    evidence: 'Substantial discrepancy identified between fund disbursal velocity and physical completion.'
                };
            }

            const apiKey = req.headers['x-groq-key'] || req.headers['x-openai-key'] || req.headers['x-api-key'] || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
            const explanation = await AiService.generateForensicExplanation(targetItem, apiKey);

            res.json({
                success: true,
                item: targetItem,
                explanation: explanation.analysis,
                source: explanation.source
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Copilot Assistant query
    static async copilot(req, res) {
        try {
            const { query, role, history } = req.body;
            if (!query) {
                return res.status(400).json({ success: false, message: 'Query is required' });
            }

            const apiKey = req.headers['x-groq-key'] || req.headers['x-openai-key'] || req.headers['x-api-key'] || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
            const result = await AiService.handleCopilotQuery(query, role || 'District Magistrate', apiKey, history || []);

            res.json({
                success: true,
                reply: result.reply,
                source: result.source
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = AiController;
