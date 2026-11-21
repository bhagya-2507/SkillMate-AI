const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const aiController = require('../controllers/aiController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validator');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  chatMessageValidator,
  careerGuidanceValidator,
  interviewFeedbackValidator
} = require('../validators/aiValidator');

// Configure Multer for PDF & TXT uploads
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.pdf', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext) || file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and TXT documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

// All AI routes require authentication
router.use(authenticate);

// 1. Chat
router.get('/chats', aiController.getChats);
router.get('/chats/:id', aiController.getChatById);
router.post('/chat', aiLimiter, chatMessageValidator, validate, aiController.sendChatMessage);
router.delete('/chats/:id', aiController.deleteChat);

// 2. Notes Summarizer
router.post('/summarize', aiLimiter, upload.single('document'), aiController.summarizeNotes);
router.get('/notes', aiController.getNotesHistory);

// 3. Career Guidance
router.post('/career-guidance', aiLimiter, careerGuidanceValidator, validate, aiController.generateCareerGuidance);
router.get('/career-history', aiController.getCareerHistory);

// 4. Interview Preparation
router.get('/interview-questions', aiController.getInterviewQuestions);
router.post('/interview-feedback', aiLimiter, interviewFeedbackValidator, validate, aiController.evaluateInterviewPractice);
router.get('/interview-history', aiController.getInterviewHistory);

module.exports = router;
