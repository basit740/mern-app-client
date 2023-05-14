const express = require('express');
const router = express.Router();
const VisitorHistory = require('../../models/VisitorHistory');

router.post('/visitorhistory-data', (req, res) => {
    VisitorHistory.find().sort({ date: -1 }).limit(5000).then(history => {
        if (history) {

            return res.status(200).send(history);
        }
    });
});

router.post('/visitorhistory-delete', (req, res) => {
    VisitorHistory.deleteOne({ _id: req.body._id}).then(user => {
        if (user) {
            return res.status(200).json({message: 'Visitor history deleted successfully. Refreshing data...', success: true})
        }
    });
});

module.exports = router;
