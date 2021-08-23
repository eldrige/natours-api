const express = require('express');
const {
  signUp,
  login,
  forgotPassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.patch('/forgotPassword', forgotPassword);

module.exports = router;
