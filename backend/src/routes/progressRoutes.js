const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/overview', progressController.getOverview);
router.get('/activity', progressController.getActivity);
router.get('/subjects', progressController.getSubjectProgress);

module.exports = router;
