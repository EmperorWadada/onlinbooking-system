const express = require('express');
const router = express.Router({mergeParams: true});
const Car = require('../model/Car');

const {
      getCars,
      getCar,
      updateCar,
      createCar,
      deleteCar
} = require('../controller/car');

const advancedResult = require('../middleware/advancedResult');
const {protected, authorized} = require('../middleware/auth');

router.route('/')
      .get(advancedResult(Car, {
            path: 'user',
            select: 'firstName lastName phoneNumber email'
      }), getCars)
      .post(protected, authorized('manager', 'admin'), createCar);

router.use(protected);
router.use(authorized('manager', 'admin'))

router.route('/:id')
      .put(updateCar)
      .delete(deleteCar)
      .get(getCar);

module.exports = router