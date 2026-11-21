const { body, param } = require('express-validator');

const generateQuizValidator = [
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ min: 2, max: 150 }).withMessage('Subject must be between 2 and 150 characters.'),

  body('topic')
    .trim()
    .notEmpty().withMessage('Topic is required.')
    .isLength({ min: 2, max: 200 }).withMessage('Topic must be between 2 and 200 characters.'),

  body('difficulty')
    .notEmpty().withMessage('Difficulty is required.')
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard.'),

  body('total_questions')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Question count must be between 1 and 20.')
];

const submitQuizValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Valid quiz ID is required.'),
  body('answers')
    .isObject().withMessage('Answers object containing question IDs and selected options is required.')
];

module.exports = {
  generateQuizValidator,
  submitQuizValidator
};
