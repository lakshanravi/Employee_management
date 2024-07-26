const express = require('express');
const router = express.Router();
const travellerListeningController = require('../controllers/travellerListeningController'); 

const authenticateToken = require('../middleware/authenticateToken');

// Route to retrieve all traveller listening requests (accessible to all)
router.get('/getalllistenings',authenticateToken, travellerListeningController.getAllListenings);

// Route to retrieve a specific traveller listening request by departure, arrival, and date (accessible to all)
router.get('/getlisteningbycriteria', authenticateToken, travellerListeningController.getListeningByCriteria);

// Route to create a new traveller listening request (accessible to all)
router.post('/createListening',authenticateToken, travellerListeningController.createListening);

// Route to update a specific traveller listening request (requires authentication)
router.put('/updatelistening/:id',authenticateToken,  travellerListeningController.updateListening);

// Route to delete a specific traveller listening request (requires authentication)
router.delete('/deleteListening/:id',authenticateToken,  travellerListeningController.deleteListening);

//getting my listenings only
router.get('/getMyListenings',authenticateToken, travellerListeningController.getMyListenings);


module.exports = router;
