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
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

/**
 * finByIddelte and finbyidandupdate, dont have access to the document
 * the have access to the current query
 * as such, we bind a new ppty review to the pre query middleware, to get access
 * to the object, and finally calc d avg in the post query middleware
 */

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAvgRatings(this.review.tour);
});

// each combination of tour and user has to be unique (no duplicate reviews)
reviewSchema.index(
  { tour: 1, user: 1 },
  {
    unique: true,
  }
);

reviewSchema.pre('save', function (next) {
  // this points to the review, and d constructor binds to the model
  this.constructor.calcAvgRatings(this.tour);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
