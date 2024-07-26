const mongoose = require('mongoose');

const HireSchema = new mongoose.Schema({
  departure: {
    type: String,
    required: true,
  },
  arrival: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  noOfSeats: {
    type: Number,
    required: true,
    min: 1, // Enforce a minimum of 1 seat
  },
  seatPrice: {
    type: Number,
    required: true,
    min: 0, // Enforce a minimum price of 0
  },
  departureTime: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Set to current date by default
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true }, // Reference to Driver model

});

module.exports = mongoose.model('Hire', HireSchema);
