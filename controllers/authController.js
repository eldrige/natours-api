const crypto = require('crypto');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/appError');
const sendMail = require('../utils/sendEmail');

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // cookies, make it such that the token, is always automatically sent back to the server

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // to prevent against xss
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const newUser = await User.create({ name, email, password, role });

  createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide a valid email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.checkPassword(password))) {
    return createSendToken(user, 200, res);
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

const resetPassword = catchAsync(async (req, res, next) => {
  // rehash psw for comparsim, with whats in the db
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex ');

  // check if there is a user belonging to the token
  // and also if his token is still valid
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  // update users password and save
  user.password = req.body.password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  const { oldPassword, newPassword } = req.body;
  if (!user.checkPassword(oldPassword, user.password))
    return next(new AppError('Your password is incorrect', 400));
  user.password = newPassword;
  await user.save();
  createSendToken(user, 200, res);

  // we dont user finbyidandupdate bcos of our validators
});

module.exports = {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
};
