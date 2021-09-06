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

router.use(protect);

router
  .route('/:id')
  .delete(restrictTo('admin', 'user'), deleteReview)
  .patch(restrictTo('admin', 'user'), updateReview)
  .get(getReview);

module.exports = router;
