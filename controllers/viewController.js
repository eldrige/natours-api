const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tours,
  });
});

module.exports = {
  getOverview,
  getTour,
};
