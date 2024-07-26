const Booking = require('../models/booking');
const Hire = require('../models/hire');
const User = require('../models/user');


    const createBooking = async (req, res) => {
      try {

        const { seatsBooked } = req.body;
        const hireId = req.params.hireId; // Access the correct parameter. routes wl daala tynne mekt hireid kyl . e nisa methentath hireid kyl oni
        
        const userId = req.user.userId; // user ID is added to the request object by authentication middleware
    
        // Validate the hire and user
        const hire = await Hire.findById(hireId);
        if (!hire) {
          return res.status(404).json({ message: 'Hire not found' });
        }
    
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check seat availability
        if (hire.noOfSeats < seatsBooked) {
          return res.status(400).json({ message: 'Not enough seats available' });
        }
    
        // Create the booking
        const newBooking = new Booking({
          user: userId,
          hire: hireId,
          seatsBooked,
        });
    
        // Save the booking
        const savedBooking = await newBooking.save();
    
        // Update the hire's seat count
        hire.noOfSeats -= seatsBooked;
        await hire.save();
    
        res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating booking' });
      }
    };

const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    //book krpu user and book krpu hire ek penwi
    const bookings = await Booking.find({ user: userId }).populate('hire').populate({path:'user',select : 'firstname email'});  //book krpu hire ekai user wai penwi
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
};

const getBookingsByHire = async (req, res) => {
  try {
    const hireId = req.params.hireId;
    const bookings = await Booking.find({ hire: hireId }).populate('hire').populate({path:'user',select : 'firstname email'});
    res.json(bookings);
    res.json(bookings.seatsBooked);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
};

module.exports = {
  createBooking,
  getBookingsByUser,
  getBookingsByHire,
};
