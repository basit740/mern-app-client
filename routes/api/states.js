const express = require('express');
const router = express.Router();
const Turner = require('../../models/Turner');
const User = require('../../models/User');
const VisitorHistory = require('../../models/VisitorHistory');
const InstalledHistory = require('../../models/InstalledHistory');

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDateTimeString(dateVal, hourNum, minNum, secNum)
{
    let date = ("0" + dateVal.getDate()).slice(-2);
    let month = ("0" + (dateVal.getMonth() + 1)).slice(-2);
    let year = dateVal.getFullYear();
    let hours = hourNum;
    let minutes = minNum;
    let seconds = secNum;
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

function getDateString(dateVal)
{
    let date = ("0" + dateVal.getDate()).slice(-2);
    let month = ("0" + (dateVal.getMonth() + 1)).slice(-2);
    let year = dateVal.getFullYear();

    return year + "-" + month + "-" + date;
}

router.post('/getinfo', async (req, res) => {

    let dateNow = new Date();

    let today_from_date = getDateTimeString(dateNow, 0, 0, 0);
    let today_to_date = getDateTimeString(dateNow, 23, 59, 59);

    let weekAgo = dateNow.addDays(-7);
    let week_from_date = getDateTimeString(weekAgo, 0, 0, 0);
    let week_to_date = getDateTimeString(dateNow, 23, 59, 59);

    let turnerCount = await Turner.find().count();

    var visitorRes, installedRes;

    {
        let totalVisits = await VisitorHistory.find().count();
        let todayVisits = await VisitorHistory.find({"date": {"$gte": today_from_date, "$lt": today_to_date}}).count();
        let weekVisits = await VisitorHistory.find({"date": {"$gte": week_from_date, "$lt": week_to_date}}).count();
        let uniqueVisits = await VisitorHistory.distinct("ip");

        var nodes = [];
        var index = 0;
        for (var i = 7; i >= 0; i--) {
            let dateVal = dateNow.addDays(-1 * (i));
            let week_from_date = getDateTimeString(dateVal, 0, 0, 0);
            let week_to_date = getDateTimeString(dateVal, 23, 59, 59);
            let visitCount = await VisitorHistory.find({"date": {"$gte": week_from_date, "$lt": week_to_date}}).count();
            nodes[index] = {
                title : getDateString(dateVal),
                visits : visitCount
            }
            index++;
        }

        visitorRes = 
        {
            total: totalVisits,
            today: todayVisits,
            week: weekVisits,
            unique: uniqueVisits.length,
            chart_data: nodes,
        };
    }

    {
        let totalVisits = await InstalledHistory.find().count();
        let todayVisits = await InstalledHistory.find({"date": {"$gte": today_from_date, "$lt": today_to_date}}).count();
        let weekVisits = await InstalledHistory.find({"date": {"$gte": week_from_date, "$lt": week_to_date}}).count();
        let uniqueVisits = await InstalledHistory.distinct("ip");

        var nodes = [];
        var index = 0;
        for (var i = 7; i >= 0; i--) {
            let dateVal = dateNow.addDays(-1 * (i));
            let week_from_date = getDateTimeString(dateVal, 0, 0, 0);
            let week_to_date = getDateTimeString(dateVal, 23, 59, 59);
            let visitCount = await InstalledHistory.find({"date": {"$gte": week_from_date, "$lt": week_to_date}}).count();
            nodes[index] = {
                title : getDateString(dateVal),
                visits : visitCount
            }
            index++;
        }

        installedRes = 
        {
            total: totalVisits,
            today: todayVisits,
            week: weekVisits,
            unique: uniqueVisits.length,
            chart_data: nodes,
        };
    }
    
    return res.status(200).json({ turner_count: turnerCount, visitorRes: visitorRes, installedRes: installedRes });
});

// router.post('/getchartinfo', async (req, res) => {

//     let dateNow = new Date();

//     var nodes = [];
//     var index = 0;
//     for (var i = -7; i <= 0; i++) {

//         let durationFrom = dateNow.addDays(-1 * (i + 1));
//         let durationTo = dateNow.addDays(-1 * (i));
//         let week_from_date = getDateTimeString(durationFrom, 0, 0, 0);
//         let week_to_date = getDateTimeString(durationTo, 0, 0, 0);
//         let visitCount = await VisitorHistory.find({"date": {"$gte": week_from_date, "$lt": week_to_date}}).count();

//         nodes[index] = {
//             title : getDateString(durationFrom),
//             visits : visitCount
//         }

//         index++;
//     }
    
//     return res.status(200).json({
//         data: nodes,
//     });
// });

module.exports = router;
