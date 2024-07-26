const Hire = require('../models/hire.js'); // Assuming models folder
const Driver = require('../models/driver.js');

const { response } = require('express'); // Assuming error handling

// Function to retrieve all hire requests
const getAllHires = async (req, res) => {
  try {
    const hires = await Hire.find();
    res.json(hires); // Return array of hire entries
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving hire requests' }); // More specific error message
  }
};

// Function to retrieve a specific hire request by departure, arrival, and date (or any combination)
const getHireByCriteria = async (req, res) => {
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
    const hires = await Hire.find({ $or: [query] });

    if (!hires.length) {
      return res.status(404).json({ message: 'No matching hire requests found' });
    }

    res.json(hires); // Return array of matching hire entries
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving hire requests' }); // More specific error message
  }
};

// Function to create a new hire request
const createHire = async (req, res) => {
  try {
    const {
      departure,
      arrival,
      description,
      vehicleType,
      noOfSeats,
      seatPrice,
      departureTime,
      date,
    } = req.body;

    const driverId = req.user.driverId; // Extract driver ID from the request object.token eken meka gnne
     // Validate driver ID
     const driver = await Driver.findById(driverId);
     if (!driver) {
       return res.status(404).json({ message: 'Driver not found' });
     }

    
    const newHire = new Hire({
      departure,
      arrival,
      description,
      vehicleType,
      noOfSeats,
      seatPrice,
      departureTime,
      date,
      driver: driverId, // Link to the driver

    });

    const savedHire = await newHire.save();
    res.json(savedHire); // Return saved hire object
  } catch (error) {
    console.error(error);

    // Handle specific errors (e.g., validation errors, duplicate entries)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ message: messages.join(', ') }); // Return validation errors as a string
    } else {
      res.status(400).json({ message: 'Error creating hire request' }); // More specific error message
    }
  }
};

// Function to update a specific hire request (consider adding authorization if needed)
const updateHire = async (req, res) => {
  try {
    const hireId = req.params.id;
    const updates = req.body;

    // Check if hire request with provided ID exists
    const hireToUpdate = await Hire.findById(hireId);

    if (!hireToUpdate) {
      return res.status(404).json({ message: 'Hire request not found' });
    }

    const updatedHire = await Hire.findByIdAndUpdate(hireId, updates, { new: true }); // Return updated document
    res.json(updatedHire); // Return the updated hire entry
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating hire request' }); // More specific error message
  }
};

// Function to delete a specific hire request (consider adding authorization if needed)
const deleteHire = async (req, res) => {
  try {
    const hireId = req.params.id;
    const deletedHire = await Hire.findByIdAndDelete(hireId);

    if (!deletedHire) {
      return res.status(404).json({ message: 'Hire request not found' });
    }

    res.json({ message: 'Hire request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting hire request' }); // More specific error message
  }
};

const getMyHires = async (req, res) => {
  try {
    const driverId = req.user.driverId; // Assuming the driverId is extracted from the JWT token and set in req.driver

    // Find all hires associated with the logged-in driver
    const hires = await Hire.find({ driver: driverId });

    if (!hires.length) {
      return res.status(404).json({ message: 'No hire requests found for this driver' });
    }

    res.json(hires); // Return array of hire entries associated with the driver
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving hire requests' }); // More specific error message
  }
};
module.exports = {
  getAllHires,
  getHireByCriteria,
  createHire,
  updateHire,
  deleteHire,
  getMyHires 
}
