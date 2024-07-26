const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/review'); // Replace with your review model file

// Error handling middleware (optional but recommended)
const handleError = (err, res) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};

const router = express.Router();

// **1. Get All Reviews:**
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('reviewer reviewed', 'firstName lastName'); // Optional: Populate user names
    res.json(reviews);
  } catch (err) {
    handleError(err, res);
  }
});

// **2. Get a Single Review by ID:**
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id).populate('reviewer reviewed', 'firstName lastName'); // Optional: Populate user names
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    handleError(err, res);
  }
});

// **3. Create a Review:** (assuming user authentication is handled elsewhere)
router.post('/', async (req, res) => {
  const { rating, reviewText, reviewer, reviewed } = req.body;

  // Validation (optional but recommended)
  if (!rating || !reviewer || !reviewed) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if reviewer and reviewed users exist (optional)
    const reviewerExists = await mongoose.Types.ObjectId.isValid(reviewer);
    const reviewedExists = await mongoose.Types.ObjectId.isValid(reviewed);

    if (!reviewerExists || !reviewedExists) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const newReview = new Review({
      rating,
      reviewText,
      reviewer,
      reviewed,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review created successfully' });
  } catch (err) {
    handleError(err, res);
  }
});

// **4. Update a Review (Optional - Implement with caution):**

// **Uncomment and adjust the following code if you choose to implement update functionality.**

// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body; // Fields to be updated

//   // Further validation and authorization can be added here

//   try {
//     const updatedReview = await Review.findByIdAndUpdate(id, updates, { new: true }); // Return updated document

//     if (!updatedReview) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     res.json(updatedReview);
//   } catch (err) {
//     handleError(err, res);
//   }
// });

// **5. Delete a Review (Optional - Implement with caution):**

// **Uncomment and adjust the following code if you choose to implement delete functionality.**

// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedReview = await Review.findByIdAndDelete(id);

//     if (!deletedReview) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     res.json({ message: 'Review deleted successfully' });
//   } catch (err) {
//     handleError(err, res);
//   }
// });

module.exports = router;
