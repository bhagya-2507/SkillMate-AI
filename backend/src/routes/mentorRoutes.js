const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validator');
const { resourceValidator, feedbackValidator } = require('../validators/mentorValidator');

router.use(authenticate);

// Resources viewing is available to students & mentors
router.get('/resources', mentorController.getResources);

// Mentor-only actions
router.get('/dashboard', authorize('MENTOR'), mentorController.getDashboardStats);
router.get('/students', authorize('MENTOR'), mentorController.getMyStudents);
router.post('/resources', authorize('MENTOR'), resourceValidator, validate, mentorController.createResource);
router.put('/resources/:id', authorize('MENTOR'), resourceValidator, validate, mentorController.updateResource);
router.delete('/resources/:id', authorize('MENTOR'), mentorController.deleteResource);
router.post('/feedback', authorize('MENTOR'), feedbackValidator, validate, mentorController.giveFeedback);
router.get('/feedback', authorize('MENTOR'), mentorController.getMentorFeedbacks);

module.exports = router;
