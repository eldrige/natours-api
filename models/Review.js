const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Tour = require('./Tour');

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

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  next();
});

/**
 * In static methods, the this var, points to the method
 * we take adv of the aggregate pipeline, to derive stats as reviews are added
 *
 */
reviewSchema.statics.calcAvgRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.pre('save', function (next) {
  // this points to the review, and d constructor binds to the model
  this.constructor.calcAvgRatings(this.tour);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
