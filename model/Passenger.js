const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const PassengerSchema = new mongoose.Schema({
firstName: {
  type: String,
  required: [true, 'Please add first name']
},
lastName: {
  type: String,
  required: [true, 'Please add last name']
},
phoneNumber: {
  type: String,
  required: [true, 'Please add phone number'],
  unique: true
},
currentAddress: {
  type: String,
  required: [true, 'Please add your current address'],
  maxLength: [300, 'Current address should not be more than 300 character']
},
email: {
  type: String,
  unique: true
},
dateOfBirth: {
  type: Date,
  default: Date.now
}, 
createAt: {
  type: Date,
  default: Date.now
},
uploadPhoto: {
  type: String,
  default: 'no-photo'
},
userName: {
  type: String,
  required: [true, 'Please add a login user name']
},
role: {
  type: String,
  required: true,
  default: 'passenger'
},
password: {
  type: String,
  minLength: [6, 'Password can not be leass than 6 character'],
  required: [true, 'Please enter a passowrd not less than six character'],
  select: false
},

},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

PassengerSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password =  await bcrypt.hash(this.password, salt);
  next();
});

PassengerSchema.methods.matchPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
}

// Generate token
PassengerSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

PassengerSchema.virtual('booking', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'passenger',
  justOnce: false
});

module.exports = mongoose.model('Passenger', PassengerSchema);