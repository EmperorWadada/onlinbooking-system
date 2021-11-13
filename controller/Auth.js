const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const User = require('../model/User')
const Driver = require('../model/Driver');
const Passenger = require('../model/Passenger')
const ErrorResponse = require('../util/ErrorResponse')


// @ Method   POST 
// @ Description  Add a user
// @ security   private
//@  Route      /api/v1/users

exports.registerUser = asyncHandler( async (req, res, next) => {

  const user = await User.create(req.body);

  res.status(200).json({
   success: true,
   count: user.length,
   data: user
 });
 sedJWTToken(user, 200, res);

});

exports.loginUser = asyncHandler( async (req, res, next) => {

 // find email or phone number
  const user = await User.findOne({phoneNumber: req.body.phoneNumber}).select('+password');
  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 400));
  }
  // check if password match
  const passwordMatch = await user.matchPassword(req.body.password);
  if (!passwordMatch){
    return next(new ErrorResponse(`Invalid credentials`, 400));
  }

  sedJWTToken(user, 200, res);
 
});

exports.loginDriver = asyncHandler( async (req, res, next) => {

  // find email or phone number
   const driver = await Driver.findOne({phoneNumber: req.body.phoneNumber}).select('+password');
   if (!driver) {
     return next(new ErrorResponse(`Invalid credentials`, 400));
   }
   // check if password match
   const passwordMatch = await driver.matchPassword(req.body.password);
   if (!passwordMatch){
     return next(new ErrorResponse(`Invalid credentials`, 400));
   }
 
   sedJWTToken(driver, 200, res);
  
 });


 // login as a passenger for booking
exports.loginPassenger = asyncHandler( async (req, res, next) => {

  // find email or phone number
   const passenger = await Passenger.findOne({phoneNumber: req.body.phoneNumber}).select('+password');
   if (!passenger) {
     return next(new ErrorResponse(`Invalid credentials`, 400));
   }
   // check if password match
   const passwordMatch = await passenger.matchPassword(req.body.password);
   if (!passwordMatch){
     return next(new ErrorResponse(`Invalid credentials`, 400));
   }
 
   sedJWTToken(passenger, 200, res);
  
 });

 // Get currently loged in user

exports.currentUser = asyncHandler( async (req, res, next) => {

   const user = await User.findById(req.user.id);

   res.status(200).json({
   success: true,    
   data: user
   });
 });




const sedJWTToken = async (user, status, res) => {
  const option = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000),
    httpOnly: true
  };

  // generate token from user model
  const token = await user.getSignedJwtToken();
  res
    .cookie('token', token, option)
    .status(200).json({
    success: true,    
    data: token
  })
};