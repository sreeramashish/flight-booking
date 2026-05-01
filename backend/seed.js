const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

const baseFlights = [
  // Domestic Flights
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

  // International Flights
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
for (let day = 0; day < 7; day++) { // 7 days from today
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

async function seedFlights() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existingFlights = await Flight.countDocuments();
    
    if (existingFlights > 0) {
      console.log(`[INFO] ${existingFlights} flights already exist. Skipping seeding to preserve booking integrity.`);
    } else {
      console.log("[INFO] No flights found. Seeding sample flights...");
      await Flight.insertMany(flights);
      console.log("[SUCCESS] Sample flights added successfully!");
    }
  } catch (error) {
    console.error('[ERROR] Error seeding flights:', error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit();
  }
}

seedFlights();
