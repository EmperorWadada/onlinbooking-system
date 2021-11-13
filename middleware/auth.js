const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../config/config.env'});
const ErrorResponse = require('../util/ErrorResponse');
const User = require('../model/User')

exports.protected = asyncHandler( async (req, res, next) => {
  let token
  // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

  //   token = req.headers.authorization.split(' ')[1];
  // }


 if (req.cookies.token) {
    token = req.cookies.token;
 }

 if (!token) {
   return next(new ErrorResponse('Not authorized to access this route', 401))
 }

 try {

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decode.id);

  next();
 } catch (error) {
   return next(new ErrorResponse('Not authorized to access this route', 401))
 }
 
});

exports.authorized = (...roles) => (req, res, next) => {
  
  if ( !roles.includes(req.user.role)) {
    return next(new ErrorResponse(`User ${req.user.role} is not authorized to access this route`, 403));
  }
  next();
}