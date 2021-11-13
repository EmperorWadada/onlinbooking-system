const path = require('path');
const User = require('../model/User');
const ErrorResponse = require('../util/ErrorResponse.js');
const asyncHandler = require('../middleware/asyncHandler');
require('dotenv').config({path: '../config/config.env'});

// @ Method   GET 
// @ Description  Get all users
// @ security   public
//@  Route      /api/v1/users

exports.getUsers = asyncHandler( async (req, res, next) => {

  res.status(200).json(res.advancedResult);
});

// @ Method   GET 
// @ Description  Get a single user
// @ security   private
//@  Route      /api/v1/users/:id

exports.getUser = asyncHandler( async (req, res, next) => {

  const user = await User.findById(req.params.id);
  if (!user ) {
    return next(new ErrorResponse(`Users with this id ${req.params.id} not found`, 404));
  }

  res.status(200).json({
   success: true,
   data: user
 });
});

// @ Method   POST 
// @ Description  Add a user
// @ security   private
//@  Route      /api/v1/users

exports.createUser = asyncHandler( async (req, res, next) => {

  const user = await User.create(req.body);

  res.status(200).json({
   success: true,
   count: user.length,
   data: user
 });
});

// @ Method   PUT 
// @ Description  Update a user
// @ security   private
//@  Route      /api/v1/users/:id

exports.updateUser = asyncHandler( async (req, res, next) => {

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

  if (!user ) {
   return next(new ErrorResponse(`Can not update user with id ${req.params.id}`, 404));
 }

  res.status(200).json({
   success: true,
   count: user.length,
   data: user
 });
});

// @ Method   DELETE 
// @ Description  Delete a user
// @ security   private
//@  Route      /api/v1/users/:id

exports.deleteUser = asyncHandler( async (req, res, next) => {

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user ) {
   return next(new ErrorResponse(`Can not delete user with id ${req.params.id}`, 404));
 }

  res.status(200).json({
   success: true,
   data: {}
 });
});


// @ Method   PUT
// @ Description  upload a photo
// @ security   private
//@  Route      /api/v1/users/:id/phot

exports.uploadPhoto = asyncHandler( async (req, res, next) => {

  const user = await User.findById(req.params.id)
  if (!user ) {
   return next(new ErrorResponse(`User with id ${req.params.id} not found`, 404));
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
 user.uploadPhoto = file.name;
 user.save();

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


