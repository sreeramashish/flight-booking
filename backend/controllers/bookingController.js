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
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('flightId')
            .lean(); // Use lean for performance and to allow manual modification
            
        // Fetch tickets for these bookings
        const bookingsWithTickets = await Promise.all(bookings.map(async (booking) => {
            const ticket = await Ticket.findOne({ bookingId: booking._id });
            return { ...booking, ticketId: ticket };
        }));

        res.json(bookingsWithTickets);
    } catch (error) {
        console.error('[ERROR] Error in getMyBookings:', error);
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('userId', 'name email')
            .populate('flightId')
            .lean();

        // Fetch tickets for these bookings
        const bookingsWithTickets = await Promise.all(bookings.map(async (booking) => {
            const ticket = await Ticket.findOne({ bookingId: booking._id });
            return { ...booking, ticketId: ticket };
        }));

        res.json(bookingsWithTickets);
    } catch (error) {
        console.error('[ERROR] Error in getAllBookings:', error);
        res.status(500).json({ message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        console.log(`[DEBUG] Attempting to cancel booking: ${bookingId} by user: ${req.user._id}`);
        
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            console.log(`[DEBUG] Booking ${bookingId} not found`);
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            console.log(`[DEBUG] User ${req.user._id} not authorized to cancel booking ${bookingId}`);
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        booking.status = 'Cancelled';
        await booking.save();
        
        // Also delete the ticket if it exists
        const ticketDeleteResult = await Ticket.deleteOne({ bookingId: booking._id });
        console.log(`[DEBUG] Ticket deletion result:`, ticketDeleteResult);

        console.log(`[DEBUG] Booking ${bookingId} cancelled successfully`);
        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.error('[ERROR] Error in deleteBooking:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking };
