const fs = require('fs');

const express = require('express');
const router = express.Router();
const {
  getTours,
  getTour,
  createTour,
  deleteTour,
  checkBody,
} = require('../controllers/tourController');

router.route('/').get(getTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(getTour).delete(deleteTour);

module.exports = router;
