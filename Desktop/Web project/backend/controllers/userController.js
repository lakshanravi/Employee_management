const { response } = require('express');
const User = require('../models/user');
 // Replace with your user model file
const bcrypt = require('bcrypt'); // For password hashing

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

//for image upload file handling
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('profilePic');




const addUser = async (req, res, next) => {
  try {
    const { firstname,lastname, nic, email, password } = req.body;



    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    const existingUser = await User.findOne({ nic });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const existingEmail = await User.findOne({ email });
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
//hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   

    const newUser = new User({
      firstname,
      lastname,
      nic,
      email,
      password:hashedPassword,
    });
    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with success message and (optional) the saved user data
    res.status(201).json({ message: "User created successfully", user: savedUser })
    
  } catch (error) {
    console.log("Error in signup userController", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

};
const updateUser = async (req, res, next) => {
  try {
    // Extract properties from the request body into separate variables
    const { firstname, lastname, nic, email, password } = req.body; // Include password for potential update
    const userId = req.user.userId;

    // Check if user with provided userId exists
    const userToUpdate = await User.findById(userId); // Filter by userId

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an object named updates containing the extracted properties for updating the user.
    //password update is optional
    const updates = {
      firstname,
      lastname,
      nic,
      email,
    };

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    // Find the user by ID and update their details
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating user' }); // More specific error message
  }
};


const deleteUser = async (req, res, next) => {
  try {
    // Extract the userId from req.user
    const { userId } = req.user;

    // Use the correct Mongoose method to delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error deleting user' }); // More specific error message
  }
};




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // Use 401 for unauthorized access
    }

    // Secure password comparison with bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" }); // Generic error message
    }

     // Generate JWT token
     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '10h' });

     // Respond with token and optional user data
     res.status(200).json({ token, user: { firstname: user.firstname, lastname: user.lastname } });
 
  } catch (error) {
    console.error("Error in login controller:", error.message);
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
      const userId = req.user.userId; // Assuming you have userId in req.user
      console.log('Decoded userId from token:', userId); // Debug log

      // Check if user with provided userId exists
      const userToUpdate = await User.findById(userId);
      if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's profile picture
      userToUpdate.profilePic = req.file.buffer;
      const updatedUser = await userToUpdate.save();

      res.json({ message: 'Profile picture updated successfully', user: updatedUser });
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
    const userId = req.user.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user || !user.profilePic) {
      return res.status(404).json({ message: 'User or profile picture not found' });
    }

    // Set the content type for the response
    res.set('Content-Type', 'image/jpeg');
    res.send(user.profilePic);
  } catch (error) {
    console.error("Error in retrieving profile picture:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

 
exports.getProfilePic = getProfilePic;
exports.uploadProfilePic = uploadProfilePic; 
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;


