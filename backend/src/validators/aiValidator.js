const { body } = require('express-validator');

const chatMessageValidator = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message content cannot be empty.')
    .isLength({ min: 1, max: 4000 }).withMessage('Message must be between 1 and 4000 characters.')
];

const careerGuidanceValidator = [
  body('interests')
    .trim()
    .notEmpty().withMessage('Please provide your interests and passions.')
    .isLength({ min: 3, max: 1000 }).withMessage('Interests must be between 3 and 1000 characters.'),

  body('skills')
    .trim()
    .notEmpty().withMessage('Please specify your current technical or soft skills.')
    .isLength({ min: 3, max: 1000 }).withMessage('Skills must be between 3 and 1000 characters.'),

  body('education')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 }).withMessage('Education field must be under 150 characters.'),

  body('goals')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Goals must be under 1000 characters.')
];

const interviewFeedbackValidator = [
  body('job_role')
    .trim()
    .notEmpty().withMessage('Target job role is required.')
    .isLength({ min: 2, max: 150 }).withMessage('Job role must be between 2 and 150 characters.'),

  body('question')
    .trim()
    .notEmpty().withMessage('Interview question cannot be empty.')
    .isLength({ min: 5, max: 1000 }).withMessage('Question must be between 5 and 1000 characters.'),

  body('user_answer')
    .trim()
    .notEmpty().withMessage('Your answer cannot be empty.')
    .isLength({ min: 5, max: 4000 }).withMessage('Answer must be between 5 and 4000 characters.')
];

module.exports = {
  chatMessageValidator,
  careerGuidanceValidator,
  interviewFeedbackValidator
};
