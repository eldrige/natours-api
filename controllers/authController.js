const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const generateToken = require('../utils/generateToken');

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({ name, email, password });

  res.status(201).json({
    status: 'success',
    token: generateToken(newUser._id),
    data: {
      user: newUser,
    },
  });
});

module.exports = {
  signUp,
};
