const { body, param } = require('express-validator');

const createMentorValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Valid email format is required.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character.'),

  body('education')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Education cannot exceed 100 characters.'),

  body('interests')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Specialization / interests cannot exceed 255 characters.')
];

const updateUserValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Valid user ID is required.'),

  body('role')
    .optional()
    .isIn(['STUDENT', 'ADMIN', 'MENTOR']).withMessage('Role must be STUDENT, ADMIN, or MENTOR.'),

  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be true or false.')
];

const assignMentorValidator = [
  body('mentor_id')
    .isInt({ min: 1 }).withMessage('Valid mentor ID is required.'),
  body('student_id')
    .isInt({ min: 1 }).withMessage('Valid student ID is required.')
];

module.exports = {
  createMentorValidator,
  updateUserValidator,
  assignMentorValidator
};
