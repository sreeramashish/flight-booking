const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, cancelBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

// More specific routes first
router.get('/mybookings', protect, getMyBookings);
router.post('/cancel/:id', protect, cancelBooking);

// Generic routes for root path
router.post('/', protect, createBooking);
router.get('/', protect, admin, getAllBookings);

module.exports = router;
