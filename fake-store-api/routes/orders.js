// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controller/orders');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, ordersController.createOrder);
router.get('/', verifyToken, ordersController.getUserOrders);
router.patch('/:orderId/status', verifyToken, ordersController.updateOrderStatus);

module.exports = router;