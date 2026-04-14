const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    flightId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Flight' },
    bookingDate: { type: Date, default: Date.now },
    seatNumber: { type: String, required: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Pending'], default: 'Confirmed' }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
