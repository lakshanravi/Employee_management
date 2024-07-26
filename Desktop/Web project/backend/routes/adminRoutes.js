const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/createadmin', adminController.addAdmin); // No need to authenticate token for signup
router.post('/loginadmin', adminController.loginAdmin);
router.get('/', authenticateToken, adminController.isAdmin);
router.get('/getalladmins',authenticateToken,adminController.getAdmins);

//trvellers
router.get('/users',authenticateToken,adminController.getUsers);
//get all drivers
router.get('/drivers',authenticateToken, adminController.getDrivers); 
module.exports = router;


//counting
router.get('/count-users', authenticateToken, adminController.isAdmin, adminController.countUsers);
router.get('/count-drivers', authenticateToken, adminController.isAdmin, adminController.countDrivers);
router.get('/count-admins', authenticateToken, adminController.isAdmin, adminController.countAdmins);

