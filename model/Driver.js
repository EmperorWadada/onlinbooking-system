
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DriverSchema = new mongoose.Schema({
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
  required: [true, 'Please add driver phone number'],
  unique: true
},
address: {
  type: String,
  required: [true, 'Please add driver address'],
  maxLength: [300, 'Driver address should not be more than 300 characters']
},

email: {
  type: String,
  required: [true, 'Please add driver email address'],
  unique: true
},
uploadPhoto: {
  type: String,
  default: 'no-photo'
},
uploadCredentials: {
  type: String,
  default: 'no-credentials'
},
dateOfBirth: {
  type: Date,
  required: [true, 'Please add date of birth']
}, 
createAt: {
  type: Date,
  default: Date.now
},
route: {
  type: String,
  required: [true, 'Please enter dirver\'s rout']
},
role: {
  type: String,
  required: true,
  default: 'driver'
},
user: {
  type: mongoose.Schema.ObjectId,
  ref: 'User',
  required: true
}
});

 DriverSchema.pre('save', async function(next) {
   
  if (!this.isModified('password')){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password =  await bcrypt.hash(this.password, salt);
  next();
});

DriverSchema.methods.matchPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
}
// Generate token
DriverSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

module.exports = mongoose.model('Driver', DriverSchema);