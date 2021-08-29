const express = require('express');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/resetPassword/:token', resetPassword);

module.exports = router;
