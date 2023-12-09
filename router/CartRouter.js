const express = require('express');
const { addToCart, fetchCartByUser, deleteFromCart, updateCart } = require('../controller/CartController');

const router = express.Router();

router.post('/',addToCart).get('/',fetchCartByUser);
router.delete('/:id',deleteFromCart)
router.patch('/:id',updateCart)

exports.router = router;
