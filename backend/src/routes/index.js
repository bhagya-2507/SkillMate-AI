const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const aiRoutes = require('./aiRoutes');
const studyPlanRoutes = require('./studyPlanRoutes');
const quizRoutes = require('./quizRoutes');
const progressRoutes = require('./progressRoutes');
const adminRoutes = require('./adminRoutes');
const mentorRoutes = require('./mentorRoutes');
const contactRoutes = require('./contactRoutes');

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/study-plans', studyPlanRoutes);
router.use('/quizzes', quizRoutes);
router.use('/progress', progressRoutes);
router.use('/admin', adminRoutes);
router.use('/mentor', mentorRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
