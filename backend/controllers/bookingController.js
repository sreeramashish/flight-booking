const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const Flight = require('../models/Flight');
const nodemailer = require('nodemailer');

const createBooking = async (req, res) => {
    try {
        const { flightId, seatNumber, travelDate } = req.body;
        
        const booking = new Booking({
            userId: req.user._id,
            flightId,
            seatNumber
        });
        const createdBooking = await booking.save();
        
        const ticketNumber = 'TKT' + Math.floor(Math.random() * 1000000);
        const ticket = new Ticket({
            bookingId: createdBooking._id,
            ticketNumber,
            travelDate
        });
        await ticket.save();

        const flightDetails = await Flight.findById(flightId);
        
        // Attempt to send email if configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
                });
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: req.user.email,
                    subject: '🎫 SkyBooker - Your Flight Ticket is Confirmed!',
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2 style="color: #0ea5e9;">Booking Confirmed!</h2>
                            <p>Hi ${req.user.name}, your flight is booked successfully.</p>
                            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                                <strong>Ticket Number:</strong> ${ticketNumber} <br/>
                                <strong>Flight:</strong> ${flightDetails.source} to ${flightDetails.destination} <br/>
                                <strong>Airline:</strong> ${flightDetails.airlineName} <br/>
                                <strong>Seat:</strong> ${seatNumber}
                            </div>
                            <p>Thank you for choosing SkyBooker!</p>
                        </div>
                    `
                });
            } catch (mailError) {
                console.error("Email notification failed to send:", mailError);
            }
        }
        
        res.status(201).json({ booking: createdBooking, ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('flightId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('userId', 'name email').populate('flightId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings };
