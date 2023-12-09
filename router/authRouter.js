const express = require('express');
const { createUser, loginUser, checkUser, checkAuth } = require('../controller/authController');
const passport = require('passport');

const router = express.Router();

router.post('/signup', createUser);

router.post('/login',passport.authenticate('local'),loginUser);

router.get('/check',passport.authenticate('jwt'),checkAuth);


exports.router = router;