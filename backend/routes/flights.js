const express = require('express');
const router = express.Router();
const { getFlights, getFlightById, createFlight } = require('../controllers/flightController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getFlights).post(protect, admin, createFlight);
router.route('/:id').get(getFlightById);

module.exports = router;
