const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator
} = require('../validators/authValidator');

// Public auth routes with rate limiting
router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Protected auth routes
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, updateProfileValidator, validate, authController.updateProfile);
router.put('/change-password', authenticate, changePasswordValidator, validate, authController.changePassword);

module.exports = router;
