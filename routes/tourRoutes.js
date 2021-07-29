const express = require('express');

const router = express.Router();
const {
  getTours,
  getTour,
  createTour,
  deleteTour,
} = require('../controllers/tourController');

router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).patch(getTour).delete(deleteTour);

module.exports = router;
