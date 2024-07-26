//driverge signup ekt adaala model ek
const mongoose = require('mongoose');



const driverSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate NICs
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  verificationStatus: { // Optional: Verification status for the driver
    type: Boolean,
    default: false,
  },
  licenseNumber: { // Driver-specific field
    type: String,
    required: true,
  },
  vehicleType: { // Optional field: Driver's vehicle type
    type: String,
  },
  profilePic:{
    type: Buffer, // Store the image data as a binary buffer
  }
});



module.exports = mongoose.model('Driver', driverSchema);
