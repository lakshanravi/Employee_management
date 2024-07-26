//meka travellerslata post hdnn puluwnn wenn hdpu ek
const { response } = require('express');
const TravellerListening = require('../models/travellerListening.js'); // Assuming models folder

// Function to retrieve all traveller listening requests
const getAllListenings = async (req, res,next) => {
  try {
    const listenings = await TravellerListening.find();
    res.json(listenings); // Return array of listening entries
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving listening requests' }); // More specific error message
  }
};

// Function to retrieve a specific traveller listening request by dearture,arrival and date
//criteria wlin ekk unth input krl match wen oni ekk gnn puluwn
const getListeningByCriteria = async (req, res) => {
  try {
    const { departure, arrival, date } = req.query; // Assuming criteria are sent as query parameters

    // Build query object with optional matching criteria
    const query = {};
    if (departure) {
      query.departure = departure;
    }
    if (arrival) {
      query.arrival = arrival;
    }
    if (date) {
      query.date = date; // Assuming date is a valid date string
    }

    // Use OR operator (`$or`) for matching at least one criterion
    const listenings = await TravellerListening.find({ $or: [query] });

    if (!listenings.length) {
      return res.status(404).json({ message: 'No matching listening requests found' });
    }

    res.json(listenings); // Return array of matching listening entries
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving listening requests' }); // More specific error message
  }
};

// Function to create a new traveller listening request. name ek jwt token eken gnnw
const createListening = async (req, res) => {
  try {
    const { phone, departure, arrival, date } = req.body;
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Userid is missing from token' });
    }
    // Input validation (optional): You can add validation here to check for empty fields, valid phone format, etc.

    const newListening = new TravellerListening({
      userId,
      phone,
      departure,
      arrival,
      date,
    });

    const savedListening = await newListening.save();
    res.json(savedListening); // Return saved listening object
  } catch (error) {
    console.error(error);

    // Handle specific errors (e.g., validation errors, duplicate entries)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ message: messages.join(', ') }); // Return validation errors as a string
    } else {
      res.status(400).json({ message: 'Error creating listening request' }); // More specific error message
    }
  }
};

// Function to update a specific traveller listening request
const updateListening = async (req, res) => {
  try {
    const listeningId = req.params.id;// Get the ID from the URL parameters
    const updates = req.body;

    // Check if listening request with provided ID exists
    const listeningToUpdate = await TravellerListening.findById(listeningId);

    if (!listeningToUpdate) {
      return res.status(404).json({ message: 'Listening request not found' });
    }

    const updatedListening = await TravellerListening.findByIdAndUpdate(listeningId, updates, { new: true }); // Return updated document

    res.json(updatedListening); // Return the updated listening entry
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating listening request' }); // More specific error message
  }
};

// Function to delete a specific traveller listening request
const deleteListening = async (req, res) => {
  try {
    const listeningId = req.params.id;
    const deletedListening = await TravellerListening.findByIdAndDelete(listeningId);

    if (!deletedListening) {
      return res.status(404).json({ message: 'Listening request not found' });
    }

    res.json({ message: 'Listening request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting listening request' }); // More specific error message
  }
};


const getMyListenings = async (req, res) => {
  try {
    const userId = req.user.userId ; //  userId is extracted from the JWT token and set in req.user

    // Find all listening requests associated with the logged-in user
    const listenings = await TravellerListening.find({ userId });

    if (!listenings.length) {
      return res.status(404).json({ message: 'No listening requests found for this user' });
    }

    res.json(listenings); // Return array of listening entries associated with the user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving listening requests' }); // More specific error message
  }
};


// Export all functions as an object (for use in Express routes)
module.exports = {
  getAllListenings,
  getListeningByCriteria,
  createListening,
  updateListening,
  deleteListening,
  getMyListenings
};
