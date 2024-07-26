//model hadaagnnw. me file eke. data type em thiyenn oni widi daala

const mongoose = require('mongoose');

// use bcryptjs for password hashing


const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    
  },
  lastname: {
    type: String,
    required: false,
    
  },
  nic: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
 
  password: {
    type: String,
    required: true
  },
  profilePic:{
    type: Buffer, // Store the image data as a binary buffer

  },
  verificationStatus: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('User', userSchema);
