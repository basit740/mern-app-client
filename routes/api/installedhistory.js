const express = require('express');
const router = express.Router();
const InstalledHistory = require('../../models/InstalledHistory');

router.post('/installedhistory-data', (req, res) => {
    InstalledHistory.find({}).sort({ date: -1 }).limit(5000).then(history => {
        if (history) {

            return res.status(200).send(history);
        }
    });
});

router.post('/installedhistory-delete', (req, res) => {
    InstalledHistory .deleteOne({ _id: req.body._id}).then(user => {
        if (user) {
            return res.status(200).json({message: 'Installation history deleted successfully. Refreshing data...', success: true})
        }
    });
});

module.exports = router;
