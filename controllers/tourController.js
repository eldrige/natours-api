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

module.exports = {
  createTour,
  deleteTour,
  updateTour,
  getTour,
  getTours,
  aliasTopTours,
};
