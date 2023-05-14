const express = require('express');
const router = express.Router();
const Turner = require('../../models/Turner');
const VisitorHistory = require('../../models/VisitorHistory');
const InstalledHistory = require('../../models/InstalledHistory');
const requestIp = require('request-ip');

function appendVisitorHistory(req, to_name) {

    const ip = requestIp.getClientIp(req); 
    require('dns').reverse(ip, function(err, domains) {

        var hostname = "-";

        if (domains != undefined && domains.length) {
            hostname = domains[0];
        }

        const newVisitor = new VisitorHistory({
            hostname: hostname,
            ip: ip,
            redirected_to: to_name
        });
    
        newVisitor
            .save()
            .then(visitor => {
                console.log("Visit info detected: ", ip, " ", hostname, " ", new Date().toString());
            }).catch();
    });
}

function appendInstalledHistory(req) {

    const ip = requestIp.getClientIp(req); 
    require('dns').reverse(ip, function(err, domains) {

        var hostname = "-";

        if (domains != undefined && domains.length) {
            hostname = domains[0];
        }

        const newInstaller = new InstalledHistory({
            hostname: hostname,
            ip: ip
        });
    
        newInstaller
            .save()
            .then(installer => {
                console.log("Installation info detected: ", ip, " ", hostname, " ", new Date().toString());
            }).catch();
    });
}

router.get('/', (req, res) => {

    var x = req.query.x;
    var y = atob(req.query.y);

    if (x == undefined || x == null || x == '') {
        res.status(500).send();
        return;
    }

    Turner.findOne({ code: x }).select().then(turner => {
        if (turner) {
            var redirectUrl = turner.to;
            if (redirectUrl == undefined || redirectUrl == '') {
                res.status(501).send();
            } else {
                appendVisitorHistory(req, turner.to);
                console.log("[", new Date().toTimeString() ,"] Exists in database!. redirecting to ", redirectUrl);
                res.redirect(redirectUrl);
            }
        } else {
            console.log("[", new Date().toTimeString() ,"] No exists in database. redirecting to ", y);
            res.redirect(y);
        }
    });
});

router.post('/visit', (req, res) => {

    var code = req.body.code;    // md5 string

    var result = {
        msg: '',
        url: ''
    }

    if (code == undefined || code == null || code == '') {
        result.msg = 'parameter_error';
        result.url = '';
        res.status(200).json(result);
        return;
    }

    Turner.findOne({ code: code }).select().then(turner => {
        if (turner) {
            var redirectUrl = turner.to;
            if (redirectUrl == undefined || redirectUrl == '') {
                result.msg = 'error';
                result.url = '';
                res.status(200).json(result);
            } else {
                appendVisitorHistory(req, turner.to);
                console.log("[", new Date().toTimeString() ,"] Exists in database!. redirecting to ", redirectUrl);

                result.msg = 'success';
                result.url = redirectUrl;
                res.status(200).json(result);
            }
        } else {
            console.log("[", new Date().toTimeString() ,"] No exists in database.");
            result.msg = 'url_does_not_exist';
            result.url = '';
            res.status(200).json(result);
        }
    });
});

router.post('/install', (req, res) => {

    appendInstalledHistory(req);
});
 
router.get('/msg1', (req, res) => {

    res.status(200).send("alert('you lose!')");
});


module.exports = router;
