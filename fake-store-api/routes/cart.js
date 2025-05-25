const express = require('express')
const router = express.Router()
const cart = require('../controller/cart')
const verifyToken = require('../middleware/verifyToken');

router.get('/user', verifyToken, cart.getUserCart);
router.post('/', verifyToken, cart.updateCart);
router.put('/items/:productId', verifyToken, cart.updateCartItemQuantity);

module.exports = router
