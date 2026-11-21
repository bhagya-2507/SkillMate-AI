const express = require('express');
const router = express.Router();
const studyPlanController = require('../controllers/studyPlanController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validator');
const { createStudyPlanValidator, updateTaskValidator } = require('../validators/studyPlanValidator');

router.use(authenticate);

router.post('/', createStudyPlanValidator, validate, studyPlanController.createStudyPlan);
router.get('/', studyPlanController.getStudyPlans);
router.get('/:id', studyPlanController.getStudyPlanById);
router.put('/:id', studyPlanController.updateStudyPlan);
router.delete('/:id', studyPlanController.deleteStudyPlan);
router.put('/tasks/:id/complete', updateTaskValidator, validate, studyPlanController.toggleTaskComplete);

module.exports = router;
