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
} = require('../controllers/tourController');

router.route('/top-tours').get(aliasTopTours, getTours);
router.route('/tour-stats').get(getTourStats);
router.route('/tour-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect, getTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
