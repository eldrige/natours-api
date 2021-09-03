const express = require('express');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');
const {
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

/**
 * Admin routes
 */
router.patch('/updateuser', protect, restrictTo('admin'), updateUser);
router.delete('/deleteuser', protect, restrictTo('admin'), deleteUser);

module.exports = router;
