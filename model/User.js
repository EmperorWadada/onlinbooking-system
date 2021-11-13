const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const booking = require('./Booking')

const UserSchema = new mongoose.Schema({
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
uploadPhoto: {
  type: String,
  default: 'no-photo'
},
role: {
  type: String,
  required: [true, 'Please add user role'],
  enum: ['admin', 'driver', 'passenger', 'cahsier']
},
password: {
  type: String,
  minLength: [6, 'Password can not be leass than 6 character'],
  required: [true, 'Please enter a passowrd not less than six character'],
  select: false
},
creatAt: {
  type: Date,
  default: Date.now
},
forgotPassword: String,
resetPasswordExp: String,
booking: [booking],
});

// Hash the password

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password =  await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
}

// Generate token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};





module.exports = mongoose.model('User', UserSchema);