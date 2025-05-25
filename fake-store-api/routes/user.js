const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const verifyToken = require('../middleware/verifyToken');

router.get('/', user.getAllUser);
router.get('/profile', verifyToken, user.getUserProfile);
router.patch('/profile', verifyToken, user.editUser);
router.get('/:id', verifyToken, user.getUser);
router.post('/', user.addUser);
router.put('/:id', verifyToken, user.editUser);
router.delete('/:id', verifyToken, user.deleteUser);

module.exports = router;
