const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();
const {
  getTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
} = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/top-tours').get(aliasTopTours, getTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/tour-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide'), getMonthlyPlan);
router
  .route('/')
  .get(getTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
