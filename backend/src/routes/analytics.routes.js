const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analytics.controller');

router.get('/kpis', AnalyticsController.getKpis);
router.get('/finances', AnalyticsController.getFinancials);
router.get('/role', AnalyticsController.getRoleDashboard);

module.exports = router;
