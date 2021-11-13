const express = require('express');
const router = express.Router();

const {loginUser,
      currentUser,
      registerUser,
      loginDriver,
      loginPassenger
} = require('../controller/Auth');

const {protected, authorized,} = require('../middleware/auth')

router.route('/')
      .get(protected, currentUser)

router.post('/logindriver', loginDriver)
router.post('/loginpassenger', loginPassenger)
router.post('/loginuser', loginUser)
router.post('/registerUser', protected, authorized('admin', 'manager'), registerUser)



module.exports = router;
