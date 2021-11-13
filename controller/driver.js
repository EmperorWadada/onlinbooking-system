
const path = require('path');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/ErrorResponse');
const Driver = require('../model/Driver');
const User = require('../model/User');
require('dotenv').config({path: '../config/config.env'});


// @ Method   GET
// @ Description  Get all drivers
// @ security   public
//@  Route      /api/v1/users/:userId/driver

exports.getDrivers = asyncHandler( async (req, res, next) => {

  let driver;
  if( req.params.userId) {
     driver = await Driver.find({user: req.params.userId});

     res.status(200).json({
      success: true,
      count: driver.length,
      data: driver
    })
  } else {
    res.status(200).json(res.advancedResult)
  }
     
});

// @ Method   GET 
// @ Description  Get a single driver
// @ security   private
//@  Route      /api/v1/dirvers/:id

exports.getDriver = asyncHandler( async (req, res, next) => {
 
  const driver = await Driver.findById(req.params.id);
     if (!driver ) {
       return next(new ErrorResponse(`Driver with this id ${req.params.id} not found`, 404));
     }

     res.status(200).json({
      success: true,
      data: driver
    })
});

// @ Method   POST 
// @ Description  Add a driver
// @ security   private
//@  Route      /api/v1/users/

exports.createDriver = asyncHandler( async (req, res, next) => {
    
  // The current logedin user id is passed to the req.body.user

    req.body.user = req.user.id

    const userExist = await User.findById(req.user.id);
    if (!userExist) {
      return next(new ErrorResponse(`User with this id ${req.user.id} not found`, 404));
    }
  
     const driver = await Driver.create(req.body);

     res.status(200).json({
      success: true,
      count: driver.length,
      data: driver
    });
});

// @ Method   PUT 
// @ Description  Update a driver
// @ security   private
//@  Route      /api/v1/dirvers/:id

exports.updateDriver = asyncHandler( async (req, res, next) => {
 
     const driver = await Driver.findById(req.params.id, req.body, {new: true, runValidators: true});

     if (!driver ) {
      return next(new ErrorResponse(`Can not update driver with id ${req.params.id}`, 404));
    }

     res.status(200).json({
      success: true,
      count: driver.length,
      data: driver
    });
});

// @ Method   DELETE 
// @ Description  Delete a driver
// @ security   private
//@  Route      /api/v1/dirvers/:id

exports.deleteDriver = asyncHandler( async (req, res, next) => {

     const driver = await Driver.findByIdAndDelete(req.params.id);

     if (!driver ) {
      return next(new ErrorResponse(`Can not delete driver with id ${req.params.id}`, 404));
    }

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

  const driver = await Driver.findById(req.params.id)
  if (!driver ) {
   return next(new ErrorResponse(`driver with id ${req.params.id} not found`, 404));
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

 driver.uploadPhoto = file.name

 driver.save();

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


