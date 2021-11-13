const express = require('express');
const router = express.Router({mergeParams: true});
const Driver = require('../model/Driver');

const {getDrivers,
      getDriver,
      createDriver,
      updateDriver,
      deleteDriver,
      uploadPhoto
     } = require('../controller/driver');

const {protected, authorized} = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult')

router.route('/')
  .get(protected, authorized('manager', 'admin', 'driver'), advancedResult(Driver, {
       path: 'user',
       select: 'firstName lastName phoneNumber role'
  }), getDrivers)
  .post(protected, authorized('manager', 'admin'), createDriver);

router.use(protected);
router.use(authorized('admin', 'manager'))
router.use('/:id/uploadphoto', uploadPhoto)
router.route('/:id')
     .get(getDriver)
     .put(updateDriver)
     .delete(deleteDriver);



module.exports = router;