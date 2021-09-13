const { Router } = require('express');
const { getOverview, getTour } = require('../controllers/viewController');

const router = Router();

router.route('/').get(getOverview);

router.route('/tour').get(getTour);

module.exports = router;
