const Tour = require('../models/Tour');
const APIFeatures = require('../utils/apiFeatures');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage, summary, diffuclty';
  next();
};
const getTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      data: {
        status: 'failed',
        message: error.message,
      },
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (tour) {
      res.status(200).json({
        data: {
          tour,
        },
      });
    } else {
      res.status(404).json({
        message: 'Tour not found',
      });
    }
  } catch (error) {
    res.status(404).json({
      data: {
        status: 'failed',
        message: error.message,
      },
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // perform validations against the  updated document
    });

    res.status(200).json({
      status: 'sucess',
      data: {
        tour,
        message: 'Tour updated',
      },
    });
  } catch (error) {
    res.status(400).json({
      data: {
        status: 'failed',
        message: error.message,
      },
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({
      status: 'success',
      tour: newTour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
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
          maxPrice: { $max: '$price' }, // where $name = mongo db operator
        },
      },
      {
        $sort: { avgPrice: -1 }, // now comes from the group stage
      },
      // {
      //   $match: { _id: { $ne: 'easy' } }, //ne = not eqault to
      // },
    ]);

    res.status(200).json({
      data: {
        status: 'success',
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      messages: err.messgae,
    });
  }
};

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
