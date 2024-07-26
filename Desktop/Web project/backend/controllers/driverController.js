const { response } = require('express');
const Driver = require('../models/driver.js'); // Replace with your driver model file
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

//for image upload file handling
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('profilePic');


const addDriver = async (req, res, next) => {
  try {
    const { firstname, lastname, nic, email, password, licenseNumber, vehicleType } = req.body;


    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    const existingDriver = await Driver.findOne({ nic });
    if (existingDriver) {
      return res.status(400).json({
        error: "Driver already exists",
      });
    }

    const existingEmail = await Driver.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }
        // Hash password before saving

    const hashedPassword = await bcrypt.hash(password, 10); // Increase rounds for stronger hashing

    const driver = new Driver({
      firstname,
      lastname,
      nic,
      email,
      password: hashedPassword,
      licenseNumber,
      vehicleType,
    });

    const savedDriver = await driver.save();
    res.status(201).json({ message: "Driver account created successfully", driver: savedDriver })

  }
    catch (error) {
      console.log("Error in drivercontroller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
   
    
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const { firstname, lastname, nic, email, password, licenseNumber, vehicleType } = req.body;
    const driverId =  req.user.driverId; // Extract driverId directly from req

    console.log(`Driver ID from token: ${driverId}`); // Verify driverId

    // Check if driver with provided ID exists
    const driverToUpdate = await Driver.findById(driverId); // Find by ID directly

    if (!driverToUpdate) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const updates = {
      firstname,
      lastname,
      nic,
      email,
      licenseNumber,
      vehicleType,
    };

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updates, { new: true });
    res.json({ message: 'Driver profile updated successfully', updatedDriver });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating driver profile' });
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    const driverId = req.user.driverId; // Assuming `driverId` is set in the request object by the JWT middleware

    // Delete driver
    const deletedDriver = await Driver.findByIdAndDelete(driverId);

    if (!deletedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting driver' });
  }
};


const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the driver by email
    const driver = await Driver.findOne({ email });

    // Check if driver exists
    if (!driver) {
      return res.status(401).json({ error: "Invalid credentials" }); // Use 401 for unauthorized access
    }

    // Secure password comparison with bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, driver?.password || "");
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" }); // Generic error message
    }

     // Generate JWT token
     const token = jwt.sign({ driverId: driver._id }, JWT_SECRET, { expiresIn: '10h' });

     // Respond with token and optional user data
     res.status(200).json({ token, driver: { firstname: driver.firstname, lastname: driver.lastname } });
 
  } catch (error) {
    console.error("Error in logindriver controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const uploadProfilePic = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error in Multer upload:", err);
      return res.status(500).json({ error: "Error uploading file" });
    }

    try {
      console.log('Request file:', req.file); // Debug log
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const driverId = req.user.driverId;
      console.log('Decoded userId from token:', driverId); // Debug log

      // Check if user with provided userId exists
      const driverToUpdate = await Driver.findById(driverId);
      if (!driverToUpdate) {
        return res.status(404).json({ message: 'driver not found' });
      }

      // Update the user's profile picture
      driverToUpdate.profilePic = req.file.buffer;
      const updatedDriver = await driverToUpdate.save();

      res.json({ message: 'Profile picture updated successfully',  updatedDriver });
    } catch (error) {
      console.error("Error in uploadProfilePic controller:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

//for retrieve profile pic

// Serve profile picture function
const getProfilePic = async (req, res) => {
  try {
    const driverId = req.user.driverId;

    // Find the user by ID
    const driver = await Driver.findById(driverId);

    if (!driver || !driver.profilePic) {
      return res.status(404).json({ message: 'Driver or profile picture not found' });
    }

    // Set the content type for the response
    res.set('Content-Type', 'image/jpeg');
    res.send(driver.profilePic);
  } catch (error) {
    console.error("Error in retrieving profile picture:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

 



module.exports = {
  
  addDriver,
  updateDriver,
  deleteDriver,
  loginDriver,
  getProfilePic,
  uploadProfilePic
};

