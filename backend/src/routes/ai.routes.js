const express = require('express');
const router = express.Router();
const AiController = require('../controllers/ai.controller');

router.post('/audit', AiController.runAudit);
router.get('/audit', AiController.runAudit);
router.get('/duplicates', AiController.detectDuplicates);
router.post('/explain', AiController.explain);
router.post('/copilot', AiController.copilot);

module.exports = router;
