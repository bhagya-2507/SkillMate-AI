const { mongoose } = require('../config/database');

const User = require('./User');
const Chat = require('./Chat');
const ChatMessage = require('./ChatMessage');
const StudyPlan = require('./StudyPlan');
const StudyTask = require('./StudyTask');
const Quiz = require('./Quiz');
const Question = require('./Question');
const QuizAttempt = require('./QuizAttempt');
const Note = require('./Note');
const CareerRecommendation = require('./CareerRecommendation');
const InterviewPractice = require('./InterviewPractice');
const MentorAssignment = require('./MentorAssignment');
const LearningResource = require('./LearningResource');
const MentorFeedback = require('./MentorFeedback');
const ContactMessage = require('./ContactMessage');

module.exports = {
  mongoose,
  User,
  Chat,
  ChatMessage,
  StudyPlan,
  StudyTask,
  Quiz,
  Question,
  QuizAttempt,
  Note,
  CareerRecommendation,
  InterviewPractice,
  MentorAssignment,
  LearningResource,
  MentorFeedback,
  ContactMessage
};
