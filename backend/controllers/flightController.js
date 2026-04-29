const Flight = require('../models/Flight');

const getFlights = async (req, res) => {
    try {
        const { source, destination, date } = req.query;
        let filter = {};
        if (source) filter.source = new RegExp(source, 'i');
        if (destination) filter.destination = new RegExp(destination, 'i');
        if (date) {
            const [year, month, day] = date.split('-').map(Number);
            const startDate = new Date(year, month - 1, day);
            const endDate = new Date(year, month - 1, day + 1);
            filter.departureTime = { $gte: startDate, $lt: endDate };
        }
        const flights = await Flight.find(filter);
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (flight) {
            res.json(flight);
        } else {
            res.status(404).json({ message: 'Flight not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFlight = async (req, res) => {
    try {
        const flight = new Flight(req.body);
        const createdFlight = await flight.save();
        res.status(201).json(createdFlight);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFlights, getFlightById, createFlight };
