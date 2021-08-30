const mongoose = require('mongoose');
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// Pppties not saved to the db, but obtainable upon querying && derived from saved fields
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE, 'called before the document is saved and created
tourSchema.pre('save', function (next) {
  console.log(this);
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', (next) => {
  console.log(aggregate);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
