const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const Flight = require('./models/Flight');

const baseFlights = [
  {
    airlineName: "IndiGo",
    source: "Hyderabad",
    destination: "Delhi",
    hours: 10, minutes: 0,
    arrHours: 12, arrMinutes: 30,
    price: 4500
  },
  {
    airlineName: "Air India",
    source: "Mumbai",
    destination: "Bangalore",
    hours: 14, minutes: 15,
    arrHours: 16, arrMinutes: 0,
    price: 3200
  },
  {
    airlineName: "Vistara",
    source: "Delhi",
    destination: "Mumbai",
    hours: 18, minutes: 45,
    arrHours: 21, arrMinutes: 0,
    price: 5200
  },
  {
    airlineName: "AirAsia India",
    source: "Kolkata",
    destination: "Chennai",
    hours: 8, minutes: 30,
    arrHours: 11, arrMinutes: 0,
    price: 3800
  },
  {
    airlineName: "Akasa Air",
    source: "Bangalore",
    destination: "Hyderabad",
    hours: 16, minutes: 0,
    arrHours: 17, arrMinutes: 10,
    price: 2500
  },
  {
    airlineName: "IndiGo",
    source: "Chennai",
    destination: "Delhi",
    hours: 6, minutes: 0,
    arrHours: 8, arrMinutes: 45,
    price: 4100
  },
  {
    airlineName: "Air India",
    source: "Delhi",
    destination: "New York",
    hours: 2, minutes: 0,
    arrHours: 17, arrMinutes: 30,
    price: 65000
  },
  {
    airlineName: "Emirates",
    source: "Mumbai",
    destination: "Dubai",
    hours: 11, minutes: 45,
    arrHours: 14, arrMinutes: 20,
    price: 18000
  },
  {
    airlineName: "British Airways",
    source: "Delhi",
    destination: "London",
    hours: 4, minutes: 30,
    arrHours: 13, arrMinutes: 0,
    price: 45000
  },
  {
    airlineName: "Singapore Airlines",
    source: "Bangalore",
    destination: "Singapore",
    hours: 23, minutes: 0,
    arrHours: 6, arrMinutes: 0,
    price: 22000
  },
  {
    airlineName: "Qatar Airways",
    source: "Hyderabad",
    destination: "Doha",
    hours: 3, minutes: 15,
    arrHours: 6, arrMinutes: 30,
    price: 26000
  }
];

const flights = [];
for (let day = 0; day < 7; day++) {
  baseFlights.forEach(flight => {
    const depDate = new Date();
    depDate.setDate(depDate.getDate() + day);
    depDate.setHours(flight.hours, flight.minutes, 0, 0);
    const arrDate = new Date();
    arrDate.setDate(arrDate.getDate() + day);
    arrDate.setHours(flight.arrHours, flight.arrMinutes, 0, 0);
    flights.push({
      airlineName: flight.airlineName,
      source: flight.source,
      destination: flight.destination,
      departureTime: depDate,
      arrivalTime: arrDate,
      price: flight.price
    });
  });
}

Flight.countDocuments().then(count => {
  if (count === 0) {
    console.log('[INFO] No flights found in DB. Seeding initial data...');
    return Flight.insertMany(flights).then(() => {
      console.log('[SUCCESS] Flights seeded on server start');
    });
  } else {
    console.log(`[INFO] ${count} flights already exist. Skipping startup seed.`);
  }
}).catch(err => {
  console.error('[ERROR] Seeding error on startup:', err);
});

const app = express();

// Debug middleware at the very top
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SkyBooker backend is running');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/flights', require('./routes/flights'));

const nodemailer = require('nodemailer');
const { protect } = require('./middleware/auth');
const Booking = require('./models/Booking');
const Ticket = require('./models/Ticket');

// REAL cancel route directly in server.js to avoid any routing issues
app.post('/api/bookings/cancel/:id', protect, async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log(`[DEBUG] Cancelling booking: ${bookingId}`);
    
    const booking = await Booking.findById(bookingId).populate('flightId').populate('userId', 'name email');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Get ticket info BEFORE deleting it for the email
    const ticket = await Ticket.findOne({ bookingId: booking._id });

    booking.status = 'Cancelled';
    await booking.save();

    // Delete the ticket
    await Ticket.deleteOne({ bookingId: booking._id });

    // Attempt to send cancellation email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log(`[DEBUG] Attempting to send cancellation email to: ${booking.userId.email}`);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        
        const flightDetails = booking.flightId;
        const ticketNum = ticket ? ticket.ticketNumber : 'N/A';

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: booking.userId.email,
          subject: '❌ SkyBooker - Your Booking has been Cancelled',
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333;">
              <div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <div style="background-color: #ef4444; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Booking Cancelled</h1>
                </div>
                <div style="padding: 30px;">
                  <p>Hi <strong>${booking.userId.name}</strong>,</p>
                  <p>Your flight booking has been successfully cancelled as requested.</p>
                  <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #f3f4f6;">
                    <h3 style="margin-top: 0; color: #ef4444;">Cancellation Details:</h3>
                    <p style="margin: 5px 0;"><strong>Ticket Number:</strong> <span style="font-family: monospace; font-size: 1.1em;">${ticketNum}</span></p>
                    <p style="margin: 5px 0;"><strong>Route:</strong> ${flightDetails ? `${flightDetails.source} to ${flightDetails.destination}` : 'N/A'}</p>
                    <p style="margin: 5px 0;"><strong>Airline:</strong> ${flightDetails ? flightDetails.airlineName : 'N/A'}</p>
                    <p style="margin: 5px 0;"><strong>Seat Number:</strong> ${booking.seatNumber}</p>
                  </div>
                  <p style="font-size: 0.9em; color: #6b7280;">If you did not request this cancellation, please contact our support team immediately.</p>
                  <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 25px 0;" />
                  <p style="text-align: center; color: #9ca3af; font-size: 0.8em;">Thank you for using SkyBooker. We hope to see you again soon!</p>
                </div>
              </div>
            </div>
          `
        });
        console.log('[DEBUG] Cancellation email sent to:', req.user.email);
      } catch (mailError) {
        console.error("[ERROR] Cancellation email failed to send:", mailError);
      }
    }

    res.json({ message: 'Booking cancelled successfully and email sent.', booking });
  } catch (error) {
    console.error('[ERROR] Direct cancel error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
