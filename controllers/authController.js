const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/appError');
const sendMail = require('../utils/sendEmail');

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
  // send reset link thru users emailb

  // Gen random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // turn of validation before saving

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword${resetToken}`;

  const message = `Forgot your password? Click here to request for a new password, and confirm this password to ${resetUrl}
  \nIf you didnt forget your password, just ignore this message
  `;

  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (e) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email', 500));
  }
});

module.exports = {
  signUp,
  login,
  forgotPassword,
};
