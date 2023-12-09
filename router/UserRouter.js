const express = require('express');
const { createUser, fetchAllUsers, fetchUserById, updateUser } = require('../controller/Usercontroller');

const router = express.Router();

router.get('/',fetchAllUsers);
router.get('/own',fetchUserById);
router.patch('/:id',updateUser)

exports.router = router;