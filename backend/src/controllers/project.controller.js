const DataStore = require('../repositories/dataStore');

class ProjectController {
    // Get all projects with filtering, searching, and pagination
    static getProjects(req, res) {
        try {
            const { district, constituency, category, status, risk, fy, search, limit = 50, page = 1 } = req.query;

            let works = DataStore.getWorks();

            if (district && district !== 'ALL') {
                works = works.filter(w => w.district === district);
            }
            if (constituency && constituency !== 'ALL') {
                works = works.filter(w => w.constituency === constituency);
            }
            if (category && category !== 'ALL') {
                works = works.filter(w => w.category === category);
            }
            if (status && status !== 'ALL') {
                works = works.filter(w => (w.status || '').toUpperCase() === status.toUpperCase());
            }
            if (risk && risk !== 'ALL') {
                works = works.filter(w => (w.risk || '').toUpperCase() === risk.toUpperCase());
            }
            if (fy && fy !== 'ALL') {
                works = works.filter(w => w.financialYear === fy);
            }
            if (search) {
                const s = search.toLowerCase().trim();
                works = works.filter(w => 
                    (w.id && w.id.toLowerCase().includes(s)) ||
                    (w.name && w.name.toLowerCase().includes(s)) ||
                    (w.district && w.district.toLowerCase().includes(s)) ||
                    (w.category && w.category.toLowerCase().includes(s))
                );
            }

            res.json({
                success: true,
                total: works.length,
                page: Number(page),
                limit: Number(limit),
                data: works.slice(0, Number(limit))
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get single project by ID
    static getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = DataStore.getWorkById(id);
            if (!project) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }

            // Also attach linked alerts & transactions
            const alerts = DataStore.getAlerts(a => a.workId === id);
            const transactions = DataStore.getTransactions(t => t.workId === id);

            res.json({
                success: true,
                data: {
                    ...project,
                    linkedAlerts: alerts,
                    linkedTransactions: transactions
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Update project / Inspection / Sanction status
    static updateProject(req, res) {
        try {
            const { id } = req.params;
            const patch = req.body;
            const updated = DataStore.updateWork(id, patch);
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }

            res.json({
                success: true,
                message: 'Project updated successfully',
                data: updated
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Create new project
    static createProject(req, res) {
        try {
            const projectData = req.body;
            if (!projectData.name || !projectData.district) {
                return res.status(400).json({ success: false, message: 'Project name and district are required' });
            }
            if (!projectData.id) {
                const count = DataStore.getWorks().length + 1;
                projectData.id = `WRK-2026-UP-${String(count).padStart(3, '0')}`;
            }
            // Ensure default numeric fields
            projectData.approvedAmountLakhs = Number(projectData.approvedAmountLakhs) || 0;
            projectData.releasedAmountLakhs = Number(projectData.releasedAmountLakhs) || 0;
            projectData.expenditureLakhs = Number(projectData.expenditureLakhs) || 0;
            projectData.completionPct = Number(projectData.completionPct) || 0;

            const created = DataStore.addWork(projectData);
            res.status(201).json({
                success: true,
                message: 'Project created successfully',
                data: created
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = ProjectController;
