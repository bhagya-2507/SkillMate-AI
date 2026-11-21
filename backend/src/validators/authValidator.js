const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name can only contain letters, spaces, dots, and hyphens.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character (@, #, $, %, etc.).'),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match.');
      }
      return true;
    }),

  body('education')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Education field must be under 100 characters.'),

  body('college')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 }).withMessage('College name must be under 150 characters.'),

  body('interests')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Interests field must be under 255 characters.')
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please enter a valid email format.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
];

const changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required.'),

  body('newPassword')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('New password must contain at least one number.')
    .matches(/[\W_]/).withMessage('New password must contain at least one special character.')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from your current password.');
      }
      return true;
    }),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your new password.')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match.');
      }
      return true;
    })
];

const updateProfileValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('education')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Education cannot exceed 100 characters.'),

  body('college')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 }).withMessage('College cannot exceed 150 characters.'),

  body('interests')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Interests cannot exceed 255 characters.')
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator
};
