const express = require('express');
const { fetchCategories, createCategory } = require('../controller/CategoryController');


const router = express.Router();
// categories is already added in the base path
router.get('/',fetchCategories).post('/',createCategory)

exports.router = router;