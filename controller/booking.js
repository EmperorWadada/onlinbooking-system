const Booking = require('../model/Booking');
const ErrorResponse = require('../util/ErrorResponse.js');
const asyncHandler = require('../middleware/asyncHandler');

// @ Method   GET 
// @ Description  Get all booking
// @ security   public
//@  Route      /api/v1/passenger/:passengerId/booking

exports.getBookings = asyncHandler( async (req, res, next) => {
  let booking;
  if ( req.params.passengerId) {
    
    booking = await Booking.find({passenger: req.params.passengerId});
    if ( !booking ) {
      return next(new ErrorResponse('No booking found for this passenger', 404));
    }
  
    res.status(200).json({
      success: true,
      count: booking.length,
      data: booking
    });
  } else {
  
    res.status(200).json(res.advancedResult);
  }
});

// @ Method   GET 
// @ Description  Get a single booking
// @ security   public
//@  Route      /api/v1/bookings/:id

exports.getBooking = asyncHandler( async (req, res, next) => {

  const booking = await Booking.findById(req.params.id);
  if (!booking ) {
    return next(new ErrorResponse(`Booking with this id ${req.params.id} not found`, 404));
  }

  res.status(200).json({
   success: true,
   data: booking
 });
});

// @ Method   POST 
// @ Description  Add a booking
// @ security   private
//@  Route      /api/v1/passwnger/:passengerId/booking

exports.createBooking = asyncHandler( async (req, res, next) => {

  req.body.passenger = req.params.passengerId;

  const booking = await Booking.create(req.body);

  res.status(200).json({
   success: true,
   count: booking.length,
   data: booking
 });
});

// @ Method   PUT 
// @ Description  Update a bookings
// @ security   private
//@  Route      /api/v1/bookings/:id

exports.updateBooking = asyncHandler( async (req, res, next) => {

  let booking = await Booking.findById(req.params.id);

  if ( !booking ) {
   return next(new ErrorResponse(`Can not update booking with id ${req.params.id}`, 404));
 }

 if ( booking.passenger.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
  return next(new ErrorResponse(`Your are not authorized to access this route ${req.params.id}`, 403));
 }

booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

  res.status(200).json({
   success: true,
   count: booking.length,
   data: booking
 });
});

// @ Method   DELETE 
// @ Description  Delete a booking
// @ security   private
//@  Route      /api/v1/bookings/:id

exports.deleteBooking = asyncHandler( async (req, res, next) => {

  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking ) {
   return next(new ErrorResponse(`Can not delete booking with id ${req.params.id}`, 404));
 }

  res.status(200).json({
   success: true,
   data: {}
 });
});



