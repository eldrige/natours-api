const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');

const getHome = (req, res) => {
  res.status(200).render('base');
};

const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = (req, res) => {
  res.status(200).render('tour', {
    titile: 'The Forest Hiker',
  });
};

module.exports = {
  getOverview,
  getTour,
  getHome,
};
