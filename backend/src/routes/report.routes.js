const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');

router.get('/', ReportController.getReports);
router.post('/generate', ReportController.generateReport);

module.exports = router;
