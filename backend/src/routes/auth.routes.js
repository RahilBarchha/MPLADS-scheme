const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Authentication & Registration Endpoints
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/officers', AuthController.getOfficers);
router.get('/districts-roster', AuthController.getDistrictsWithRoster);

module.exports = router;
