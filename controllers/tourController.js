const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const EARTH_RADIUS_IN_MILES = 3963.2;
const EARTH_RADIUS_IN_KM = 6378.1;
const ONE_KM = 0.001;

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage, summary, diffuclty';
  next();
};
const getTours = getAll(Tour);

const getTour = getOne(Tour, { path: 'reviews' });
const deleteTour = deleteOne(Tour);
const updateTour = updateOne(Tour);
const createTour = createOne(Tour);

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

// '/tours-within/:distance/center/:latlng/unit/:unit',
const getToursWithin = catchAsync(async (req, res, next) => {
  let queryObj = {};
  const { distance, unit, latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius =
    unit === 'mi'
      ? distance / EARTH_RADIUS_IN_MILES
      : distance / EARTH_RADIUS_IN_KM;

  if (!lat || !lng)
    next(
      new AppError(
        'Please provide latitude and logitude in the format, lat, lng',
        400
      )
    );

  queryObj = {
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  };

  const tours = await Tour.find(queryObj);

  res.json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const getDistances = catchAsync(async (req, res, next) => {
  const { unit, latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : ONE_KM;

  if (!lat || !lng)
    next(
      new AppError(
        'Please provide latitude and logitude in the format, lat, lng',
        400
      )
    );

  // geoNear is the aggregation function available in geoSpatialCoordinates
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        // will look at ur schema for geospatial fields, and use it as default
        near: {
          type: 'Point',
          coordinates: [+lng, +lat],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier, // to convert from m to km
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.json({
    status: 'success',
    data: {
      distances,
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
  getToursWithin,
  getDistances,
};
