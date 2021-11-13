const express = require('express');
const router = express.Router({ mergeParams: true});
const driverRoute = require('./driver');
const carRoute = require('./car');
const advancedResult = require('../middleware/advancedResult')
const User = require('../model/User');

const {
      getUser,
      getUsers,
      updateUser,
      deleteUser,
      createUser,
      uploadPhoto
} = require('../controller/user');

// Re-route from another resorce

// @ These routes ID (:userId) were replaced with req.user.id
// except where userId is used to fetch driver & car details

router.use('/:userId/driver', driverRoute);
router.use('/:userId/car', carRoute);


const {protected, authorized} = require('../middleware/auth')

router.use(protected)
router.use(authorized('manager', 'admin'));

router.use('/:id/uploadphoto', uploadPhoto)
router.route('/')
      .get(advancedResult(User), getUsers)
      .post(createUser);
  
router.route('/:id')
      .put(updateUser)
      .delete(deleteUser)
      .get(getUser);

module.exports = router