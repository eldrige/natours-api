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
  getUsers,
  getUser,
  getMe,
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

router.route('/me').get(protect, getMe, getUser);
router.route('/').get(protect, restrictTo('admin'), getUsers);

router
  .route('/:id')
  .get(protect, restrictTo('admin'), getUser)
  .patch(protect, restrictTo('admin'), updateUser)
  .delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;
