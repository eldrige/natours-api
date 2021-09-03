const Tour = require('../models/Tour');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne } = require('./handlerFactory');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage, summary, diffuclty';
  next();
};
const getTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fieldLimit()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    data: {
      results: tours.length,
      tours,
    },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError('No tour found with that ID', 400));
  }
  res.status(200).json({
    data: {
      tour,
    },
  });
});

const deleteTour = deleteOne(Tour);

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the updated document
    runValidators: true, // perform validations against the  updated document
  });

  if (!tour) return next(new AppError('No tour found with that ID', 400));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
      message: 'Tour updated',
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    tour: newTour,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
  ]);

  res.status(200).json({
    data: {
      status: 'success',
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // destructures the given param
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    }, // return tours whose start range fall in that current year
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }, // push add the name fields to the result set
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, // when set to 0, id wont show up,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ]);

  res.status(200).json({
    data: {
      status: 'success',
      plan,
    },
  });
});

module.exports = {
  createTour,
  deleteTour,
  updateTour,
  getTour,
  getTours,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
