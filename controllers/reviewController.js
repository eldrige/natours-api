const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne } = require('./handlerFactory');

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  /**
   * if id empty, query all tours
   * else get all review for a single tour
   */
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const setTourUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

const createReview = createOne(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);
const getReview = getOne(Review);

module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
};
