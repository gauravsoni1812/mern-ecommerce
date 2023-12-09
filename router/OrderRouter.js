const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, fetchAllOrders } = require('../controller/OrderController');

const router = express.Router();

router.post('/',createOrder).get('/own/',fetchOrdersByUser);
router.delete('/:id',deleteOrder);
router.patch('/:id',updateOrder).get('/',fetchAllOrders);

exports.router = router;
