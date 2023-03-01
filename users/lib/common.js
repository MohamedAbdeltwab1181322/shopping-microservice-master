const cache = require('./cache');

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

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        req.user = decoded;

        const cacheData = await cache.get(token);

        if (!cacheData) {

            const expiry = parseInt(process.env.TOKEN_LIFETIME) / 1000 || 60 * 5;

            await cache.set(token, req.body, expiry)
        };

        next();

    } catch (error) {

        console.error('error -> ', logStruct('authenticator', error))

        return res.status(401).send(errorResponse(401));
    }

}

exports.allowCustomer = (req, res, next) => {

    if (!req.user.roles || !req.user.roles.length || !req.user.roles.indexOf('customer') < 0) {

        return res.status(401).send(errorResponse(401));
    }

    next();
}

exports.allowAdmin = (req, res, next) => {

    console.log(req.user);

    if (!req.user.roles || !req.user.roles.length || !req.user.roles.indexOf('admin') < 0) {

        return res.status(401).send(errorResponse(401));
    }
    next();
}

exports.allowSeller = (req, res, next) => {

    if (!req.user.roles || !req.user.roles.length || !req.user.roles.indexOf('seller') < 0) {

        return res.status(401).send(errorResponse(401));
    }

    next();
}