const jwt = require("jsonwebtoken");

const { errorResponse } = require('./response');

const logStruct = (func, error) => {

    return { 'func': func, 'file': 'commonLib', error }
}

exports.authenticator = async(req, res, next) => {

    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    try {

        if (!token) {

            return res.status(401).send(errorResponse(401));
        }

        req.body.user = jwt.verify(token, process.env.TOKEN_KEY);

        next();

    } catch (error) {

        return res.status(401).send(errorResponse(401));
    }

}

exports.allowCustomer = (req, res, next) => {

    if (!req.body.user.roles || !req.body.user.roles.length || !req.body.user.roles.indexOf('customer') < 0) {

        return res.status(401).send(errorResponse(401));
    }

    next();
}

exports.allowAdmin = (req, res, next) => {

    if (!req.body.user.roles || !req.body.user.roles.length || !req.body.user.roles.indexOf('admin') < 0) {

        return res.status(401).send(errorResponse(401));
    }
    next();
}

exports.allowSeller = (req, res, next) => {

    if (!req.body.user.roles || !req.body.user.roles.length || !req.body.user.roles.indexOf('seller') < 0) {

        return res.status(401).send(errorResponse(401));
    }

    next();
}