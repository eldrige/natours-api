const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('..');

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = await promisify(jwt.verify(token, process.env.JWT_SECRET));
    console.log(decoded);
    const freshUser = await User.findById(decoded.id);
    if (!freshUser)
      return new AppError(
        'The user belonging to this token does not exist',
        401
      );
    if (freshUser.hasChangedPassword(decoded.iat)) {
      return new AppError(
        'User recently changed password, Please login again',
        401
      );
    }
    req.user = freshUser;
    next();
  }
  if (!token) return next(new AppError('You are not logged in', 401));
});

module.exports = {
  protect,
};
