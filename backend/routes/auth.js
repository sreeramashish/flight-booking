const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendOTP } = require('../controllers/authController');

router.post('/send-otp', sendOTP);

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
