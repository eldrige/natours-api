const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const reviewSchema = Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, 'A review must have a rating'],
      min: 1,
      max: 5,
    },
    //     Parent refrencing
    tour: {
      type: Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must have a tour'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
