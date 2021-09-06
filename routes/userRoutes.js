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
router.patch('/resetPassword/:token', resetPassword);

router.use(protect); // mount protect middleware, so all routes after this should get it

router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.route('/me').get(getMe, getUser);

/**
 * Admin routes
 */

router.use(restrictTo('admin'));
router.route('/').get(getUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
