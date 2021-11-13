const express = require('express');
require('dotenv').config({path: './config/config.env'});
const Car = require('./model/Car');
const Passenger = require('./model/Passenger');
const User = require('./model/User');
const Driver = require('./model/Driver');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology:true
},
console.log(`Databse connected`)
);

const deleteFiles = async () => {
  try {
    await Car.deleteMany();
    await Passenger.deleteMany();
    await User.deleteMany();
    await Driver.deleteMany();
    console.log('Files successfully deleted from database');
    process.exit(1);
  } catch (error) {
    console.log(error)
  }
};

 
if (process.argv[2] === '-d') {
  deleteFiles();
}

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})

