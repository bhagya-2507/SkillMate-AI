const { User, MentorAssignment, LearningResource, MentorFeedback, StudyPlan, StudyTask, QuizAttempt, Quiz } = require('../models');

// 1. Mentor Dashboard Overview Stats
const getDashboardStats = async (req, res, next) => {
  try {
    const mentorId = req.user.id;

    // Assigned students
    const assignments = await MentorAssignment.find({ mentor_id: mentorId })
      .populate('student', 'name email education college interests is_active');

    const students = assignments.map(a => a.student).filter(Boolean);
    const resourcesCount = await LearningResource.countDocuments({ mentor_id: mentorId });
    const feedbacksCount = await MentorFeedback.countDocuments({ mentor_id: mentorId });

    // Recent feedbacks
    const recentFeedbacks = await MentorFeedback.find({ mentor_id: mentorId })
      .populate('student', 'name email')
      .sort({ created_at: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        assignedStudentsCount: students.length,
        resourcesCount,
        feedbacksCount
      },
      students: students.slice(0, 5),
      recentFeedbacks
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get All Assigned Students with Progress
const getMyStudents = async (req, res, next) => {
  try {
    const mentorId = req.user.id;

    const assignments = await MentorAssignment.find({ mentor_id: mentorId })
      .populate('student', 'name email education college interests created_at');

    const enriched = await Promise.all(
      assignments.map(async (a) => {
        const student = a.student;
        if (!student) return null;

        const studentId = student._id;
        const plans = await StudyPlan.find({ user_id: studentId });
        const planIds = plans.map(p => p._id);
        const tasks = await StudyTask.find({ study_plan_id: { $in: planIds } });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.is_completed).length;
        const planCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const quizAttempts = await QuizAttempt.find({ user_id: studentId })
          .populate('quiz', 'subject topic')
          .sort({ attempted_at: -1 })
          .limit(5);

        const totalQuizzes = quizAttempts.length;
        const avgQuizScore = totalQuizzes > 0
          ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes)
          : 75;

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          education: student.education,
          college: student.college,
          interests: student.interests,
          assigned_at: a.created_at,
          planCompletion,
          totalQuizzes,
          avgQuizScore,
          recentQuizzes: quizAttempts
        };
      })
    );

    return res.status(200).json({ success: true, students: enriched.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

// 3. Learning Resources - CRUD
const getResources = async (req, res, next) => {
  try {
    const isMentor = req.user.role === 'MENTOR';
    const filter = isMentor ? { mentor_id: req.user.id } : {};

    const resources = await LearningResource.find(filter)
      .populate('mentor', 'name email')
      .sort({ created_at: -1 });

    return res.status(200).json({ success: true, resources });
  } catch (error) {
    next(error);
  }
};

const createResource = async (req, res, next) => {
  try {
    const { title, description, subject, resource_url } = req.body;

    const resource = await LearningResource.create({
      mentor_id: req.user.id,
      title,
      description,
      subject,
      resource_url
    });

    return res.status(201).json({
      success: true,
      message: 'Learning resource published successfully.',
      resource
    });
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const { title, description, subject, resource_url } = req.body;

    const resource = await LearningResource.findOne({
      _id: resourceId,
      mentor_id: req.user.id
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found or unauthorized.' });
    }

    if (title) resource.title = title;
    if (description) resource.description = description;
    if (subject) resource.subject = subject;
    if (resource_url) resource.resource_url = resource_url;

    await resource.save();

    return res.status(200).json({
      success: true,
      message: 'Learning resource updated successfully.',
      resource
    });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resource = await LearningResource.findOne({
      _id: resourceId,
      mentor_id: req.user.id
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found or unauthorized.' });
    }

    await LearningResource.findByIdAndDelete(resource._id);

    return res.status(200).json({
      success: true,
      message: 'Learning resource deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// 4. Student Feedback
const giveFeedback = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const { student_id, feedback, recommendations, rating } = req.body;

    const isAssigned = await MentorAssignment.findOne({
      mentor_id: mentorId,
      student_id
    });

    if (!isAssigned) {
      await MentorAssignment.create({
        mentor_id: mentorId,
        student_id
      });
    }

    const savedFeedback = await MentorFeedback.create({
      mentor_id: mentorId,
      student_id,
      feedback,
      recommendations: recommendations || '',
      rating: rating || 5
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted to student successfully.',
      feedback: savedFeedback
    });
  } catch (error) {
    next(error);
  }
};

const getMentorFeedbacks = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const feedbacks = await MentorFeedback.find({ mentor_id: mentorId })
      .populate('student', 'name email')
      .sort({ created_at: -1 });

    return res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getMyStudents,
  getResources,
  createResource,
  updateResource,
  deleteResource,
  giveFeedback,
  getMentorFeedbacks
};
