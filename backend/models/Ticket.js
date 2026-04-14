const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Booking' },
    ticketNumber: { type: String, required: true, unique: true },
    travelDate: { type: Date, required: true }
}, {
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
