const express = require('express');
const router = express.Router();
const AlertController = require('../controllers/alert.controller');

router.get('/', AlertController.getAlerts);
router.get('/:id', AlertController.getAlertById);
router.patch('/:id/status', AlertController.updateAlertStatus);
router.put('/:id/status', AlertController.updateAlertStatus);

module.exports = router;
