const { Router } = require('express');
const {
  getAllReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = Router({ mergeParams: true }); // preserves params from parent routers

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .delete(protect, deleteReview)
  .patch(protect, updateReview)
  .get(protect, getReview);

module.exports = router;
