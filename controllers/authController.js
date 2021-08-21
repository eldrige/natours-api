const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/appError');

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const newUser = await User.create({ name, email, password, role });

  res.status(201).json({
    status: 'success',
    token: generateToken(newUser._id),
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide a valid email and password', 400));

  const user = await User.findOne({ email });
  if (user && (await user.checkPassword(password))) {
    return res.status(200).json({
      status: 'success',
      token: generateToken(user._id),
    });
  }
  return next(new AppError('Incorrect email or password', 400));
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user)
    return next(new AppError('There is not user, with that email', 404));
  // send reset link thru users email

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // turn of validation before saving
});
module.exports = {
  signUp,
  login,
  forgotPassword,
};
