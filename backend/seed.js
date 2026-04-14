const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

const flights = [
  {
    airlineName: "IndiGo",
    source: "Hyderabad",
    destination: "Delhi",
    departureTime: new Date(new Date().setHours(10, 0, 0, 0)),
    arrivalTime: new Date(new Date().setHours(12, 30, 0, 0)),
    price: 4500
  },
  {
    airlineName: "Air India",
    source: "Mumbai",
    destination: "Bangalore",
    departureTime: new Date(new Date().setHours(14, 15, 0, 0)),
    arrivalTime: new Date(new Date().setHours(16, 0, 0, 0)),
    price: 3200
  },
  {
    airlineName: "Vistara",
    source: "Hyderabad",
    destination: "Delhi",
    departureTime: new Date(new Date().setHours(18, 45, 0, 0)),
    arrivalTime: new Date(new Date().setHours(21, 0, 0, 0)),
    price: 5200
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await Flight.deleteMany(); // Clear existing flights (optional)
    await Flight.insertMany(flights);
    console.log("Sample flights added successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
