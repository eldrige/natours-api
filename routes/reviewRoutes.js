const { Router } = require('express');
const {
  getAllReviews,
  createReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = Router();

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
