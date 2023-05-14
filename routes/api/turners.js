const express = require('express');
const router = express.Router();
const validateTurnerInput = require('../../validation/updateTurner');
const Turner = require('../../models/Turner');
const md5Js = require('../../utils/md5.js');

router.post('/turner-add', (req, res) => {
    const { errors, isValid } = validateTurnerInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    Turner.findOne({ from: req.body.from }).then(turner => {
        if (turner) {
            return res.status(400).json({ from: 'Turner From already exists' });
        } else {

            const newTurner = new Turner({
                name: req.body.name,
                from: req.body.from,
                use: req.body.use,
                code: md5Js.md5(req.body.from),
                to: req.body.to,
            });

            console.log(newTurner);

            newTurner
                .save()
                .then(turner => {
                    return res.status(200).json({message: 'Turner added successfully. Refreshing data...'})
                }).catch(err => console.log(err));
        }
    });
});

router.post('/turner-data', (req, res) => {

    var fromFilter = req.body.from;
    if (fromFilter == undefined || fromFilter == '') {
        Turner.find({}).select().then(turner => {
            if (turner) {
                return res.status(200).send(turner);
            }
        });
    } else {
        Turner.find({from: req.body.from}).select().then(turner => {
            if (turner) {
                return res.status(200).send(turner);
            }
        });
    }
});

router.post('/turner-data-xyz', (req, res) => {

    Turner.find({use:1}, ['from', 'code', 'to']).then(turner => {
        if (turner) {
            return res.status(200).send(turner);
        }
    });
});

router.post('/turner-delete', (req, res) => {
    Turner.deleteOne({ _id: req.body._id}).then(turner => {
        if (turner) {
            return res.status(200).json({message: 'Turner deleted successfully. Refreshing data...', success: true})
        }
    });
});

router.post('/turner-update', (req, res) => {

    const { errors, isValid } = validateTurnerInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    Turner.findOne({ _id }).then(turner => {
        if (turner) {

            let update = {'name': req.body.name, 'from': req.body.from, 'to': req.body.to, 'use': req.body.use, 'code': md5Js.md5(req.body.from)};

            Turner.update({ _id: _id}, {$set: update}, function(err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update turner.' });
                } else {
                    return res.status(200).json({ message: 'Turner updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'Now turner found to update.' });
        }
    });
});

module.exports = router;
