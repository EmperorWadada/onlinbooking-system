const Car = require('../model/Car');
const User = require('../model/User');
const ErrorResponse = require('../util/ErrorResponse.js');
const asyncHandler = require('../middleware/asyncHandler');

// @ Method   GET 
// @ Description  Get all cars
// @ security   public
//@  Route      /api/v1/users/:userId/car

exports.getCars = asyncHandler( async (req, res, next) => {
  
  if (req.params.userId) {
    const car = await Car.find({user: req.params.userId});

    res.status(200).json({
    success: true,
    count: car.length,
    data: car
    });
  } else {
    res.status(200).json(res.advancedResult);
  }
});

// @ Method   GET 
// @ Description  Get a single car
// @ security   public
//@  Route      /api/v1/cars/:id

exports.getCar = asyncHandler( async (req, res, next) => {

  const car = await Car.findById(req.params.id);
  if (!car ) {
    return next(new ErrorResponse(`Car with this id ${req.params.id} not found`, 404));
  }

  res.status(200).json({
   success: true,
   data: car
 });
});

// @ Method   POST 
// @ Description  Add a car
// @ security   private
//@  Route      /api/v1/users/:userId/car

exports.createCar = asyncHandler( async (req, res, next) => {
  
  req.body.user = req.user.id;

  const userExist = await User.findById(req.user.id);
  if ( !userExist) {
      return next(new ErrorResponse(`User with id ${req.user.id} not found`, 404));
  }
  
  const car = await Car.create(req.body);

  res.status(200).json({
   success: true,
   count: car.length,
   data: car
 });
});

// @ Method   PUT 
// @ Description  Update a passenger
// @ security   private
//@  Route      /api/v1/cars/:id

exports.updateCar = asyncHandler( async (req, res, next) => {

  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

  if ( !car ) {
   return next(new ErrorResponse(`Can not update car with id ${req.params.id}, Please check the "Id"`, 404));
 }

  res.status(200).json({
   success: true,
   count: car.length,
   data: car
 });
});

// @ Method   DELETE 
// @ Description  Delete a car
// @ security   private
//@  Route      /api/v1/cars/:id

exports.deleteCar = asyncHandler( async (req, res, next) => {

  const car = await Car.findByIdAndDelete(req.params.id);

  if (!car ) {
   return next(new ErrorResponse(`Can not delete car with id ${req.params.id}, Please check the "Id"`, 404));
 }

  res.status(200).json({
   success: true,
   data: {}
 });
});



