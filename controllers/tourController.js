const fs = require('fs');

const Tour = require('../models/Tour');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getTours = (req, res) => {
  res.json({
    data: {
      results: tours.length,
      tours,
    },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((elt) => elt.id === +req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
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
  getTour,
  getTours,
};
