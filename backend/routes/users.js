const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);
router.route('/').get(getUsers);
router.route('/:id').delete(deleteUser);

module.exports = router;
