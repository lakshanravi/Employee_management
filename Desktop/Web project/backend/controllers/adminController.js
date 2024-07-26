const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); 

const User = require('../models/user');
const Driver = require('../models/driver.js'); 

const { JWT_SECRET, ADMIN_SIGNUP_SECRET } = process.env;

// Middleware to verify if the requester is an admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Access is denied' });
  }
  next();
};
//get travellers
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users); // Return users array directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users' }); // More specific error message
  }
};

//get drivers
const getDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers); // Return drivers array directly

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving drivers' }); // More specific error message
  }
};


// Get all admins
const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find();
    res.json(admins); // Return admins array directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving admins' });
  }
};

// Add a new admin
const addAdmin = async (req, res, next) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // Check if the provided secret key matches the stored secret key
    if (secretKey !== ADMIN_SIGNUP_SECRET) {
      return res.status(403).json({ error: "Forbidden: Invalid secret key" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      isAdmin: true, // Ensure this field is present and true for admin users
    });

    const savedAdmin = await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully", admin: savedAdmin });
  } catch (error) {
    console.log("Error in signup adminController", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id, isAdmin: true }, JWT_SECRET, { expiresIn: '10h' });

    res.status(200).json({ token, admin: { name: admin.name } });
  } catch (error) {
    console.error("Error in login adminController:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//counting
// Count all users
const countUsers = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting users' });
  }
};

// Count all drivers
const countDrivers = async (req, res, next) => {
  try {
    const driverCount = await Driver.countDocuments();
    res.json({ driverCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting drivers' });
  }
};

// Count all admins
const countAdmins = async (req, res, next) => {
  try {
    const adminCount = await Admin.countDocuments();
    res.json({ adminCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting admins' });
  }
};


module.exports = {
  getAdmins,
  addAdmin,
  loginAdmin,
  isAdmin,// Export the isAdmin middleware
  getUsers,
  getDrivers, 
  countUsers,
  countDrivers,
  countAdmins,
};
