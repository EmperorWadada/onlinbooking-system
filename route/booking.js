const express = require('express');
const router = express.Router({ mergeParams: true});
const Booking = require('../model/Booking');
const advancedResult = require('../middleware/advancedResult');

const {
      getBooking,
      getBookings,
      createBooking,
      updateBooking,
      deleteBooking
} = require('../controller/booking');

const {protected, authorized} = require('../middleware/auth')

router.route('/')
      .get(advancedResult(Booking, {
            path: 'passenger',
            select: 'firstName phoneNumber email'
      }), getBookings)
      .post(protected, authorized('passenger', 'admin', 'manager', 'driver'), createBooking);

router.use(protected);
router.use(authorized('passenger', 'admin', 'manager'));

router.route('/:id')
      .put(updateBooking)
      .delete(deleteBooking)
      .get(getBooking);

module.exports = router