const express = require('express');
const router = express.Router();
const bookingRoute = require('./booking')
const Passenger = require('../model/Passenger');
const {
      getPassengers,
      getPassenger,
      updatePassenger,
      createPassenger,
      deletePassenger,
      uploadPhoto
} = require('../controller/passenger');
const advancedResult = require('../middleware/advancedResult')

// @ The routes ID (:passengerId) was replaced with req.user.id
// except where passengerId is use to get booking details

// Re-route from another resource
router.use('/:passengerId/booking', bookingRoute)

const {protected, authorized} = require('../middleware/auth')

router.use('/:id/uploadphoto', protected, authorized('admin','manager', 'passenger'), uploadPhoto)

router.route('/')
      .get(advancedResult(Passenger, {
        path: 'booking', 
        select: 'numberOfSeat bookingType destination'}
      ), getPassengers)
      .post(createPassenger);
  
router.route('/:id')
      .put(protected, authorized('admin','manager', 'passenger'), updatePassenger)
      .delete(protected, authorized('admin','manager', 'passenger'), deletePassenger)
      .get(protected, authorized('admin','manager','passenger'), getPassenger);

module.exports = router