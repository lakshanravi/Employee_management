//ek ek url wlt ynna routes hadaagnnas oni 
//exprees use krl

//import express
const express = require('express');
//roter instance ek declare kirima
const router= express.Router();
//controlller page ek import krn nthuw functon em access krnn bh
const controller =require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

//services 4t routes 4 k create krmu
//controller.getUsers refers to a function named getUsers exported from the controller module
//When a client makes a GET request to /users, Express will invoke the getUsers function defined in the controller module.

router.post('/createuser',controller.addUser);
router.put('/updateuser',authenticateToken,controller.updateUser);
router.delete('/deleteuser',authenticateToken,controller.deleteUser);
router.post('/loginuser', controller.loginUser);
router.post('/uploadProfilePic',authenticateToken, controller.uploadProfilePic);
router.get('/profile-pic',authenticateToken, controller.getProfilePic);

module.exports=router;