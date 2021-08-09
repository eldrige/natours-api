const mongoose = require('mongoose');

const { Schema } = mongoose;

const tourSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
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
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: Number,
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// Pppties not saved to the db, but obtainable upon querying && derived from saved fields
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE, 'called before the document is saved and created
tourSchema.pre('save', function () {
  console.log(this);
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
