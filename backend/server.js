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

Flight.deleteMany().then(() => {
  return Flight.insertMany(flights);
}).then(() => {
  console.log('Flights seeded on server start');
}).catch(err => {
  console.error('Seeding error:', err);
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
