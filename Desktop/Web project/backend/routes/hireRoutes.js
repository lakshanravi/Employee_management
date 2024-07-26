const express = require('express');
const router = express.Router();
const hireController = require('../controllers/hireController'); // Assuming controllers folder
const authenticateToken = require('../middleware/authenticateToken');


// Route to retrieve all hire requests (accessible to all)
router.get('/getallhires', authenticateToken,hireController.getAllHires);

// Route to retrieve a specific hire request by departure, arrival, and date (or any combination)
router.get('/gethirebycriteria', authenticateToken,hireController.getHireByCriteria);

router.post('/createhire',authenticateToken, hireController.createHire);

// Route to update a specific hire request (consider adding authorization if needed)
router.put('/updatehire/:id',authenticateToken, hireController.updateHire); // Route with parameter for ID

// Route to delete a specific hire request (consider adding authorization if needed)
router.delete('/deletehire/:id',authenticateToken, hireController.deleteHire); // Route with parameter for ID

router.get('/getMyHires', authenticateToken,hireController.getMyHires);

module.exports = router;
