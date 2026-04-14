const mongoose = require('mongoose');

const flightSchema = mongoose.Schema({
    airlineName: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    price: { type: Number, required: true }
}, {
    timestamps: true
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
