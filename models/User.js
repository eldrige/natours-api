const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const userSchema = Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
