const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const validate = require('../middleware/validator');
const { contactValidator } = require('../validators/contactValidator');

// Public contact route
router.post('/', contactValidator, validate, contactController.submitContact);

module.exports = router;
