const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // 5-star rating system
  },
  reviewText: {
    type: String,
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  reviewed: {   //being reviewed thing
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver', // Or another model you want to review (e.g., Hire)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
