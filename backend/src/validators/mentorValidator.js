const { body, param } = require('express-validator');

const resourceValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Resource title is required.')
    .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters.'),

  body('description')
    .trim()
    .notEmpty().withMessage('Resource description is required.')
    .isLength({ min: 10, max: 3000 }).withMessage('Description must be between 10 and 3000 characters.'),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ min: 2, max: 150 }).withMessage('Subject must be between 2 and 150 characters.'),

  body('resource_url')
    .trim()
    .notEmpty().withMessage('Resource URL is required.')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Resource URL must be a valid HTTP or HTTPS web address.')
];

const feedbackValidator = [
  body('student_id')
    .isInt({ min: 1 }).withMessage('Valid student ID is required.'),

  body('feedback')
    .trim()
    .notEmpty().withMessage('Feedback text is required.')
    .isLength({ min: 10, max: 4000 }).withMessage('Feedback must be between 10 and 4000 characters.')
];

module.exports = {
  resourceValidator,
  feedbackValidator
};
