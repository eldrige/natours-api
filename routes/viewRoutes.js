const { Router } = require('express');
const {
  getOverview,
  getTour,
  getHome,
} = require('../controllers/viewController');

const router = Router();

router.route('/').get(getHome);

router.route('/overview').get(getOverview);
router.route('/tour').get(getTour);

module.exports = router;
