const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');

router.get('/', TransactionController.getTransactions);
router.post('/', TransactionController.createTransaction);

module.exports = router;
