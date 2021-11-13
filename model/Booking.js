const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingDescription: {
    type: String,
    maxLength: [100, 'Booking description should not be more than 100 characters']
  },
  bookingType: {
    type: String,
    emum: ['morning', 'evening'],
    required: [true, 'Please enter traveling hour: morning or evening housr']
  },
  destination: {
    type: String,
    required: [true, 'Please enter traveling destination']
  },
  ticketId: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  numberOfSeat: {
    type: Number,
    required: [true, 'Please enter number of seat you want to book'],
    default: 1
  },
  nextOfKin: String,
  nextOfKingPhone: String,
  passenger: {
    type: mongoose.Schema.ObjectId,
    ref: 'Passenger',
    required: true
  },
  car: {
    type: mongoose.Schema.ObjectId,
    ref: 'Car',
    required: true,
  }
});

module.exports = BookingSchema;