const express = require('express');
const router = express.Router();
const cache = require('../lib/cache')

const ordersController = require('../controllers/orders');
const {
    authenticator,
    allowCustomer,
    allowAdmin,
    allowSeller
} = require('../lib/common');

router.get('/', (req, res) => {

    res.send("Success Fire");
});

// orders
router.post('/create', authenticator, allowCustomer, async(req, res, next) => {

    const response = await ordersController.createOrder(req.body);

    return res.status(response.status).send(response);
});

router.get('/order/:id', authenticator, async(req, res) => {

    const id = req.body.id = Number(req.params.id);

    const response = await ordersController.fetchOrder(req.body)

    const cacheData = await cache.get(id);

    if (!cacheData) {

        const expiry = parseInt(process.env.TOKEN_LIFETIME) / 1000 || 60 * 5;

        await cache.set(id, response, expiry)

        return res.status(response.status).send(response)
    }

    return res.status(201).send(cacheData)
})

router.put('/order/:id', authenticator, async(req, res, next) => {
    req.body.id = Number(req.params.id);
    const response = await ordersController.updateOrder(req.body)
    return res.status(response.status).send(response)
})

// carts
router.post('/addToCart', authenticator, allowCustomer, async(req, res, next) => {
    const response = await ordersController.addToCart(req.body)
    return res.status(response.status).send(response)
})

router.get('/activeCart/:id', authenticator, allowCustomer, async(req, res, next) => {
    // user id
    req.body.id = Number(req.params.id);
    const response = await ordersController.fetchActiveCartByUser(req.body)
    return res.status(response.status).send(response)
})

router.get('/cart/:id', authenticator, allowCustomer, async(req, res, next) => {
    // order id
    req.body.id = Number(req.params.id);
    const response = await ordersController.fetchUserCart(req.body)
    return res.status(response.status).send(response)
})

router.delete('/removeFromCart', authenticator, allowCustomer, async(req, res, next) => {
    const response = await ordersController.removeFromCart(req.body);
    return res.status(response.status).send(response)
})

// shipments
router.post('/ship', authenticator, async(req, res, next) => {
    const response = await ordersController.createShipment(req.body)
    return res.status(response.status).send(response)
})

router.get('/ship/:id', authenticator, async(req, res, next) => {
    req.body.id = Number(req.params.id);
    const response = await ordersController.fetchUserShipment(req.body)
    return res.status(response.status).send(response)
})

router.put('/ship/:id', authenticator, async(req, res, next) => {
    req.body.id = Number(req.params.id);
    const response = await ordersController.updateUserShipment(req.body)
    return res.status(response.status).send(response)
});

// warehouse
router.post('/warehouse', authenticator, allowAdmin, async(req, res, next) => {
    const response = await ordersController.createWarehouse(req.body)
    return res.status(response.status).send(response)
})

module.exports = router;