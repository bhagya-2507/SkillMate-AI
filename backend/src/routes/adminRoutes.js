const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validator');
const {
  createMentorValidator,
  updateUserValidator,
  assignMentorValidator
} = require('../validators/adminValidator');

// Admin only routes
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id', updateUserValidator, validate, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/mentors', createMentorValidator, validate, adminController.createMentor);
router.post('/assign-mentor', assignMentorValidator, validate, adminController.assignMentorToStudent);
router.get('/reports', adminController.getReports);

module.exports = router;
