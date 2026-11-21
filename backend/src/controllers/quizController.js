const { Quiz, Question, QuizAttempt } = require('../models');
const geminiService = require('../services/geminiService');

// 1. Generate Quiz
const generateQuiz = async (req, res, next) => {
  try {
    const { subject, topic, difficulty, total_questions } = req.body;
    const count = parseInt(total_questions, 10) || 5;

    // Generate questions
    const generatedQuestions = await geminiService.generateQuiz(subject, topic, difficulty, count);

    // Create Quiz record
    const quiz = await Quiz.create({
      user_id: req.user.id,
      subject,
      topic,
      difficulty: difficulty || 'Medium',
      total_questions: generatedQuestions.length,
      score: 0
    });

    // Insert questions
    const questionRecords = generatedQuestions.map(q => ({
      quiz_id: quiz._id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: (q.correct_answer || 'A').toUpperCase(),
      explanation: q.explanation || 'Review the core subject documentation.'
    }));

    await Question.insertMany(questionRecords);

    // Fetch newly created quiz with questions (omitting correct_answer for student test taking)
    const questions = await Question.find({ quiz_id: quiz._id }).select('question_text option_a option_b option_c option_d');
    const quizObj = quiz.toJSON();
    quizObj.questions = questions;

    return res.status(201).json({
      success: true,
      message: 'Quiz generated successfully. Good luck!',
      quiz: quizObj
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get Quizzes
const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ user_id: req.user.id }).sort({ created_at: -1 });

    const enriched = await Promise.all(
      quizzes.map(async (q) => {
        const attempts = await QuizAttempt.find({ quiz_id: q._id }).sort({ attempted_at: -1 }).limit(1);
        return {
          ...q.toJSON(),
          attempts
        };
      })
    );

    return res.status(200).json({ success: true, quizzes: enriched });
  } catch (error) {
    next(error);
  }
};

// 3. Get Single Quiz by ID
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user_id: req.user.id });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const questions = await Question.find({ quiz_id: quiz._id }).select('question_text option_a option_b option_c option_d');
    const quizObj = quiz.toJSON();
    quizObj.questions = questions;

    return res.status(200).json({ success: true, quiz: quizObj });
  } catch (error) {
    next(error);
  }
};

// 4. Submit Quiz Answers and Calculate Score
const submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // { [questionId]: "A" | "B" | "C" | "D" }

    const quiz = await Quiz.findOne({ _id: quizId, user_id: req.user.id });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const questions = await Question.find({ quiz_id: quiz._id });
    let correctCount = 0;
    const totalQuestions = questions.length;

    const detailedResults = questions.map(q => {
      const qId = q._id.toString();
      const userAnswer = answers && (answers[qId] || answers[q.id]) ? (answers[qId] || answers[q.id]).toUpperCase() : null;
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correctCount++;

      return {
        questionId: qId,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        userAnswer,
        correctAnswer: q.correct_answer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Save attempt record
    const attempt = await QuizAttempt.create({
      user_id: req.user.id,
      quiz_id: quiz._id,
      score: scorePercentage,
      total_questions: totalQuestions,
      correct_answers: correctCount,
      answers: answers || {},
      attempted_at: new Date()
    });

    // Update quiz score to latest
    quiz.score = scorePercentage;
    await quiz.save();

    return res.status(200).json({
      success: true,
      message: `Quiz completed! You scored ${scorePercentage}% (${correctCount}/${totalQuestions})`,
      score: scorePercentage,
      total_questions: totalQuestions,
      correct_answers: correctCount,
      attemptId: attempt._id,
      results: detailedResults
    });
  } catch (error) {
    next(error);
  }
};

// 5. Get Quiz History & Performance Overview
const getQuizHistory = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user_id: req.user.id })
      .populate('quiz', 'subject topic difficulty')
      .sort({ attempted_at: -1 });

    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
      : 0;

    return res.status(200).json({
      success: true,
      summary: {
        totalAttempts,
        averageScore
      },
      history: attempts
    });
  } catch (error) {
    next(error);
  }
};

// 6. Delete Quiz
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user_id: req.user.id });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    await Question.deleteMany({ quiz_id: quiz._id });
    await QuizAttempt.deleteMany({ quiz_id: quiz._id });
    await Quiz.findByIdAndDelete(quiz._id);

    return res.status(200).json({
      success: true,
      message: 'Quiz and question records deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQuiz,
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizHistory,
  deleteQuiz
};
