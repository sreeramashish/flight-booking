const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');
const Flight = require('./models/Flight');
const User = require('./models/User');

dotenv.config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("--- Detailed Database Check ---");
    
    const bookings = await Booking.find().populate('flightId').populate('userId');
    console.log(`Total Bookings in Database: ${bookings.length}`);

    bookings.forEach((b, i) => {
        console.log(`Booking ${i+1}:`);
        console.log(`  ID: ${b._id}`);
        console.log(`  User: ${b.userId ? b.userId.email : 'MISSING USER'}`);
        console.log(`  Status: ${b.status}`);
        console.log(`  Flight Exists: ${!!b.flightId}`);
        console.log(`  Created At: ${b.createdAt}`);
    });
    
    console.log("------------------------------");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

checkData();
