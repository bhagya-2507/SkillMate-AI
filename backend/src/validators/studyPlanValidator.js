const { body, param } = require('express-validator');

const createStudyPlanValidator = [
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ min: 2, max: 150 }).withMessage('Subject must be between 2 and 150 characters.'),

  body('topic')
    .trim()
    .notEmpty().withMessage('Topic is required.')
    .isLength({ min: 2, max: 200 }).withMessage('Topic must be between 2 and 200 characters.'),

  body('target_date')
    .notEmpty().withMessage('Target date is required.')
    .isISO8601().withMessage('Target date must be a valid date format (YYYY-MM-DD).')
    .custom((val) => {
      const target = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (target < today) {
        throw new Error('Target date cannot be in the past.');
      }
      return true;
    }),

  body('daily_hours')
    .optional()
    .isFloat({ min: 0.5, max: 16 }).withMessage('Daily study hours must be between 0.5 and 16 hours.'),

  body('difficulty')
    .notEmpty().withMessage('Difficulty is required.')
    .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Difficulty must be Beginner, Intermediate, or Advanced.')
];

const updateTaskValidator = [
  param('id')
    .isMongoId().withMessage('Valid task ID is required.'),
  body('is_completed')
    .isBoolean().withMessage('is_completed must be a boolean value.')
];

module.exports = {
  createStudyPlanValidator,
  updateTaskValidator
};

