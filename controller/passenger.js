const path = require('path')
const Passenger = require('../model/Passenger');
const ErrorResponse = require('../util/ErrorResponse.js');
const asyncHandler = require('../middleware/asyncHandler');
require('dotenv').config({path: '../config/config.env'})

// @ Method   GET 
// @ Description  Get all passengers
// @ security   public
//@  Route      /api/v1/passengers

exports.getPassengers = asyncHandler( async (req, res, next) => {

  res.status(200).json(res.advancedResult);
});

// @ Method   GET 
// @ Description  Get a single passenger
// @ security   private
//@  Route      /api/v1/passenger/:id

exports.getPassenger = asyncHandler( async (req, res, next) => {

  const passenger = await Passenger.findById(req.params.id)
  if (!passenger) {
      return next(new ErrorResponse(`Passenger with this id ${req.params.id} not found`, 404));
  }

  res.status(200).json({
   success: true,
   data: passenger
 });
});

// @ Method   POST 
// @ Description  Add a passenger
// @ security   private
//@  Route      /api/v1/passenger

exports.createPassenger = asyncHandler( async (req, res, next) => {

  const passenger = await Passenger.create(req.body);

  res.status(200).json({
   success: true,
   count: passenger.length,
   data: passenger
 });
});

// @ Method   PUT 
// @ Description  Update a passenger
// @ security   private
//@  Route      /api/v1/passenger/:id

exports.updatePassenger = asyncHandler( async (req, res, next) => {

  let passenger = await Passenger.findById(req.params.id);

  if (!passenger ) {
   return next(new ErrorResponse(`Can not update passenger with id ${req.params.id}`, 404));
 }

 if ( passenger._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
  return next(new ErrorResponse(`User ${req.user.role} not authorized to access this route `, 403));
 }

 passenger = await Passenger.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

  res.status(200).json({
   success: true,
   data: passenger
 });
});

// @ Method   DELETE 
// @ Description  Delete a passenger
// @ security   private
//@  Route      /api/v1/passenger/:id

exports.deletePassenger = asyncHandler( async (req, res, next) => {

  let passenger = await Passenger.findById(req.params.id);

  if (!passenger ) {
   return next(new ErrorResponse(`Can not delete passenger with id ${req.params.id}`, 404));
 }
  if ( passenger._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
   return next(new ErrorResponse(`User ${req.user.role} not authorized to access this route `, 403));
  }

   passenger = await Passenger.findByIdAndDelete(req.params.id);

  res.status(200).json({
   success: true,
   data: {}
 });
});

// @ Method   PUT
// @ Description  upload a photo
// @ security   private
//@  Route      /api/v1/passenger/:passengerId/photo

exports.uploadPhoto = asyncHandler( async (req, res, next) => {

  const passenger = await Passenger.findById(req.params.id)
  if (!passenger ) {
   return next(new ErrorResponse(`Passenger with id ${req.params.id} not found`, 404));
 }

 const file = req.files.file

 if ( !file ) {
  return next(new ErrorResponse(`Please upload a file`, 404));
 }

 if ( !file.mimetype.startsWith('image')) {
  return next(new ErrorResponse(`Please upload an image file`, 404));
 }

 if ( !file.size > process.env.PHOTO_UPLOAD_SIZE) {
  return next(new ErrorResponse(`File too large, maximum file size: 300kb`, 404));
 }

 file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

 file.mv(`${process.env.PHOTO_UPLOAD_PATH}/${file.name}`, async (err) => {
   if (err) {
     console.log(err);
     return next(new ErrorResponse(`Error uploading photo`, 500))
   }
 });

  res.status(200).json({
   success: true,
   data: 'file successfuly uploaded'
 });
});
