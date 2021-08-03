const express = require('express');

const router = express.Router();
const {
  getTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  aliasTopTours,
  getTourStats,
} = require('../controllers/tourController');

router.route('/top-tours').get(aliasTopTours, getTours);
router.route('/tour-stats').get(getTourStats);
router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
