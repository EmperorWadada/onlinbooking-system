const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  carPlateNumer: {
    type: String,
    unique: true,
    required: [true, 'Please enter car plate number']
  },
  carType: {
    type: String,
    required: [true, 'Please enter type of care']
  },
  travellingHOur: {
    type: String,
    enum: ['morning', 'evening'],
    required: [true, 'Please enter travaling options: morning or nigth']
  },
  carOwner: {
    type: String,
    required: [true, 'Please enter car owner'],
    enum: ['private', 'management']
  },
  carDescription: {
    type: String,
    required: [true, 'Briefly describe the car please'],
    maxLength: [200, 'Description character can not be more than 200 characters']
  },
  carRoute: String,
  carAvailable:{
    type: Boolean,
    default: true,
  },
  carCapacity: {
    type: Number,
    required: [true, 'Please enter the car capacity']
  },
  availableSeats: Number,
  uploadPhoto: {
    type: String,
    default: 'no-photo'
  },
  creatAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Car', CarSchema);