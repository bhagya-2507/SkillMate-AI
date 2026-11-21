const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validator');
const { aiLimiter } = require('../middleware/rateLimiter');
const { generateQuizValidator, submitQuizValidator } = require('../validators/quizValidator');

router.use(authenticate);

router.post('/generate', aiLimiter, generateQuizValidator, validate, quizController.generateQuiz);
router.get('/', quizController.getQuizzes);
router.get('/history', quizController.getQuizHistory);
router.get('/:id', quizController.getQuizById);
router.post('/:id/submit', submitQuizValidator, validate, quizController.submitQuiz);

module.exports = router;
