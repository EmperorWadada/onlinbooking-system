
const ErrorResponse = require('../util/ErrorResponse');

const errorHandler = (err, req, res, next) => {

  let error = {...err};
  error.message = err.message;

  console.log(err)

  if (err.name === 'CastError') {
    error = new ErrorResponse(`User id ${err.value} not in correctly format`, 400);
  }

  if (err.name === 'ValidationError') {
    
   const errorMsg = Object.values(err.errors).map(message => message.message)
   error = new ErrorResponse(errorMsg, 400)
  }

  if (err.code === 11000 ) {
    error = new ErrorResponse(`User already exist`, 400);
  }

  res.status(500).json({
  success: false,
  erroName: err.name,
  message: error.message

});

  next();
}

module.exports = errorHandler;