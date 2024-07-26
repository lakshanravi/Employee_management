//ek ek url wlt ynna routes hadaagnnas oni 
//exprees use krl

//import express
const express = require('express');
//roter instance ek declare kirima
const router= express.Router();
//controlller page ek import krn nthuw functon em access krnn bh
const driverController = require('../controllers/driverController'); // Replace with your actual path
const authenticateToken = require('../middleware/authenticateToken');

// Routes for driver management (RESTful approach)

router.post('/createdriver',driverController.addDriver); // Create a new driver
//router.get('/drivers/:nic', driverController.getDriver); // Get a specific driver
router.put('/updatedriver',authenticateToken, driverController.updateDriver); // Update a driver
router.delete('/deletedriver',authenticateToken, driverController.deleteDriver); // Delete a driver
router.post('/logindriver', driverController.loginDriver);
router.post('/uploadProfilePic',authenticateToken,driverController.uploadProfilePic);
router.get('/profile-pic',authenticateToken,driverController.getProfilePic)
module.exports=router;