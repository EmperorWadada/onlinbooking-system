const express = require('express');
require('dotenv').config({path: './config/config.env'});
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const connectToDb = require('./config/connectToDb');
const driverRoute = require('./route/driver');
const passengerRoute = require('./route/passenger');
const carRoute = require('./route/car');
const bookingRoute = require('./route/booking');
const userRoute = require('./route/user');
const authRoute = require('./route/auth')
const expressFileUpload = require('express-fileupload')

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(expressFileUpload())

// Connect to databse from config file
connectToDb();

app.use('/api/v1/drivers', driverRoute);
app.use('/api/v1/passengers', passengerRoute);
app.use('/api/v1/cars', carRoute);
app.use('/api/v1/bookings', bookingRoute);
app.use('/api/v1/auth/users', userRoute);
app.use('/api/v1/auth', authRoute);



app.use(errorHandler);

const PORT = 5000
const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port: ${process.env.PORT} in: ${process.env.NODE_ENV}`)
});

process.on('uncaughtException', () => {
  console.log(`Server shutting down on port: ${process.env.PORT}`);
  server.close(process.exit(1));
});

