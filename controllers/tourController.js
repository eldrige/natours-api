const Tour = require('../models/Tour');

const getTours = async (req, res) => {
  try {
    // * Build query
    // !Filtering v1
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((field) => delete queryObj[field]);
    // console.log(req.query, queryObj);
    // filtering with greater than and less than (gte/gt/lte/lt)
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    console.log(JSON.parse(queryString));
    const query = Tour.find(JSON.parse(queryString));

    // !Filtering

    // * Execute query

    const tours = await query;

    // to implement filter pass into find, req.query

    // filtering your db queries with mongo
    // method one
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // })
    // method two

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
};
