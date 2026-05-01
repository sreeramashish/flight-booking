const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');
const Flight = require('./models/Flight');

dotenv.config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("--- Database Check ---");
    
    const flightCount = await Flight.countDocuments();
    console.log("Total Flights:", flightCount);
    
    const bookingCount = await Booking.countDocuments();
    console.log("Total Bookings:", bookingCount);
    
    const bookings = await Booking.find().populate('flightId');
    bookings.forEach((b, i) => {
        console.log(`Booking ${i+1}: ID=${b._id}, Status=${b.status}, FlightExists=${!!b.flightId}`);
    });
    
    console.log("----------------------");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

checkData();
