const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const turners = require('./routes/api/turners');
const visitorHist = require('./routes/api/visitorhistory');
const installedHist = require('./routes/api/installedhistory');
const states = require('./routes/api/states');
const xyz = require('./routes/api/xyz');

var fs = require('fs'),
    http = require('http'),
    https = require('https');

require('./config/passport')(passport);

const app = express();

// app.set('trust proxy', true);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose.connect(db, { useNewUrlParser: true })
    .then(() =>
        console.log('MongoDB successfully connected.')
    ).catch(err => console.log(err));

app.use(passport.initialize());

app.use('/api', users);
app.use('/api', turners);
app.use('/api', visitorHist);
app.use('/api', installedHist);
app.use('/api', states);
app.use('/xyz', xyz);

if(process.env.NODE_ENV === 'production' || 1) {
    app.use(express.static(path.join(__dirname, 'admin')));

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'admin', 'index.html'));
    });
}

const port = process.env.PORT || 80;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));

var options = {
    key: fs.readFileSync(__dirname + '/ssl/private.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/ssl/certificate.crt', 'utf8'),
};

console.log(`Server up and running on port ${port} !`);

https.createServer(options, app).listen(443);


