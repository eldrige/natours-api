const mongoose = require('mongoose');
const User = require('./User');
// const validator = require('validator');

const { Schema } = mongoose;

const tourSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxLength: [40, 'A schema must have a max length of 40'],
      minLength: [10, 'A schema must have a min length of 10'],
      // validate: [
      //   validator.isAlpha,
      //   'tour name must only contain alphanumeric characters',
      // ],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either medium,easy or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater or equal to 1.0'],
      max: [5, 'Rating must be less or equal to 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this always points to the current doc, on new doc creations ( So wont work on updates)
          return value < this.price; // since we want discounts to be always less than prices
        },
        message: 'Discount price ({VALUE}) should be below regular price', // the ({}) is a mongo thing
      },
    },
    summary: {
      type: String,
      trim: true, // Gets rid of whitespace
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // geojson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // Embedding docs ( One to many relationships )
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // Referencing documents ( A ref bewteen tours and users)
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.index({ price: 1, ratingsAverage: -1 }); // add indexes to this field, in asc order
/**
 * Indexes optimize querying a field or document
 * in this case we cadded index to the price
 * field, in order to optimize the query
 */

// Pppties not saved to the db, but obtainable upon querying && derived from saved fields
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 * Virtual populate
 * like implmenting child referencing
 * foreignField => reference to the other model, where the parent Model is stored
 * in this case parent model = Tour, child model = Review, so tour is our foreignField
 * where the id is the local field (_id) of the tour
 */
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
// DOCUMENT MIDDLEWARE, 'called before the document is saved and created
tourSchema.pre('save', async function (next) {
  const guides = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guides); // resolve all the promises in the guides array
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', (next) => {
  console.log(aggregate);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
