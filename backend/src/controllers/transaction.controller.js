const DataStore = require('../repositories/dataStore');

class TransactionController {
    static getTransactions(req, res) {
        try {
            const { workId, type, district } = req.query;
            let txns = DataStore.getTransactions();

            if (workId) {
                txns = txns.filter(t => t.workId === workId);
            }
            if (type) {
                txns = txns.filter(t => t.type === type);
            }
            if (district) {
                txns = txns.filter(t => t.district === district);
            }

            res.json({
                success: true,
                total: txns.length,
                data: txns
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static createTransaction(req, res) {
        try {
            const txnData = req.body;
            if (!txnData.workId || !txnData.amountLakhs) {
                return res.status(400).json({ success: false, message: 'workId and amountLakhs are required' });
            }
            if (!txnData.id) {
                txnData.id = `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            }
            txnData.amountLakhs = Number(txnData.amountLakhs) || 0;
            const created = DataStore.addTransaction(txnData);

            // Also update the associated work in DataStore if found
            const work = DataStore.getWorkById(txnData.workId);
            if (work) {
                const type = (txnData.type || '').toUpperCase();
                if (type === 'RELEASE') {
                    work.releasedAmountLakhs = (Number(work.releasedAmountLakhs) || 0) + txnData.amountLakhs;
                } else if (type === 'EXPENDITURE') {
                    work.expenditureLakhs = (Number(work.expenditureLakhs) || 0) + txnData.amountLakhs;
                    if (work.approvedAmountLakhs > 0) {
                        work.completionPct = Math.min(100, Math.round((work.expenditureLakhs / work.approvedAmountLakhs) * 100));
                    }
                } else if (type === 'ALLOCATION') {
                    work.approvedAmountLakhs = (Number(work.approvedAmountLakhs) || 0) + txnData.amountLakhs;
                }
            }

            res.status(201).json({
                success: true,
                message: 'Transaction recorded successfully',
                data: created
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = TransactionController;
