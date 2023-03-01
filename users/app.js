const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users')

require('dotenv').config();

const DEBUG = process.env.DEBUG || false;
if (!DEBUG) {
    console.info = () => {}
}

const app = express();

app.use(cors());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/user', userRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404).send({
        success: false,
        message: 'notFound',
        action: req.method + ' ' + req.originalUrl,
        data: [],
        meta: {}
    });
});

// error handler
app.use((err, req, res, next) => {
    if (err && err.status == 520) {
        return next();
    }
    console.error({
        type: 'uncaughtException',
        err: err
    }, 'shop uncaughtException');
    res.status(520).send({
        success: false,
        message: 'somethingWentWrong',
        action: 'uncaughtException'
    });
});


module.exports = app;