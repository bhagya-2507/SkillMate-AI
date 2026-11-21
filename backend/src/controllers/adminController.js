const bcrypt = require('bcryptjs');
const { User, Quiz, QuizAttempt, StudyPlan, MentorAssignment, LearningResource, ContactMessage } = require('../models');

// 1. Admin Dashboard Overview Stats
const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalMentors = await User.countDocuments({ role: 'MENTOR' });
    const activeUsers = await User.countDocuments({ is_active: true });
    const totalQuizzes = await Quiz.countDocuments();
    const totalQuizAttempts = await QuizAttempt.countDocuments();
    const totalStudyPlans = await StudyPlan.countDocuments();
    const totalContactMessages = await ContactMessage.countDocuments();

    const recentUsers = await User.find()
      .sort({ created_at: -1 })
      .limit(6)
      .select('name email role is_active created_at');

    // Chart data for user growth
    const growthChart = [
      { month: 'Jan', students: 15, mentors: 2, quizzes: 25 },
      { month: 'Feb', students: 28, mentors: 4, quizzes: 60 },
      { month: 'Mar', students: 45, mentors: 7, quizzes: 110 },
      { month: 'Apr', students: 72, mentors: 9, quizzes: 180 },
      { month: 'May', students: 110, mentors: 12, quizzes: 290 },
      { month: 'Jun', students: 165, mentors: 15, quizzes: 420 }
    ];

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalMentors,
        activeUsers,
        totalQuizzes,
        totalQuizAttempts,
        totalStudyPlans,
        totalContactMessages
      },
      recentUsers,
      growthChart
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get Users with Search, Filter & Pagination
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search, is_active } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const filter = {};
    if (role && ['STUDENT', 'MENTOR', 'ADMIN'].includes(role)) {
      filter.role = role;
    }
    if (is_active !== undefined) {
      filter.is_active = is_active === 'true';
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const count = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .select('name email role education college interests is_active created_at');

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(limit, 10)),
        currentPage: parseInt(page, 10),
        limit: parseInt(limit, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Update User (Role, Active Status)
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role, is_active } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent admin from deactivating or demoting themselves
    if (user._id.toString() === req.user.id.toString() && (is_active === false || (role && role !== 'ADMIN'))) {
      return res.status(400).json({
        success: false,
        message: 'Security protection: You cannot deactivate or demote your own admin account.'
      });
    }

    if (role && ['STUDENT', 'MENTOR', 'ADMIN'].includes(role)) {
      user.role = role;
    }
    if (is_active !== undefined) {
      user.is_active = is_active;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User status and permissions updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });
  } catch (error) {
    next(error);
  }
};

// 4. Delete User
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Security protection: You cannot delete your own admin account.'
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: `User "${user.name}" (${user.email}) deleted permanently.`
    });
  } catch (error) {
    next(error);
  }
};

// 5. Create Mentor Account
const createMentor = async (req, res, next) => {
  try {
    const { name, email, password, education, interests } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const mentor = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'MENTOR',
      education: education || 'Senior Academic Mentor',
      interests: interests || 'Engineering & Career Mentorship',
      is_active: true
    });

    return res.status(201).json({
      success: true,
      message: `Mentor account created successfully for ${mentor.name}.`,
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role,
        education: mentor.education,
        interests: mentor.interests
      }
    });
  } catch (error) {
    next(error);
  }
};

// 6. Assign Mentor to Student
const assignMentorToStudent = async (req, res, next) => {
  try {
    const { mentor_id, student_id } = req.body;

    const mentor = await User.findOne({ _id: mentor_id, role: 'MENTOR' });
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found or invalid role.' });
    }

    const student = await User.findOne({ _id: student_id, role: 'STUDENT' });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found or invalid role.' });
    }

    let assignment = await MentorAssignment.findOne({ mentor_id, student_id });
    let created = false;

    if (!assignment) {
      assignment = await MentorAssignment.create({ mentor_id, student_id });
      created = true;
    }

    return res.status(200).json({
      success: true,
      message: created ? 'Mentor assigned to student successfully.' : 'Mentor is already assigned to this student.',
      assignment
    });
  } catch (error) {
    next(error);
  }
};

// 7. Get Platform Reports & Analytics
const getReports = async (req, res, next) => {
  try {
    const studentsCount = await User.countDocuments({ role: 'STUDENT' });
    const mentorsCount = await User.countDocuments({ role: 'MENTOR' });
    const quizCount = await Quiz.countDocuments();
    const attemptCount = await QuizAttempt.countDocuments();
    const planCount = await StudyPlan.countDocuments();

    const topQuizzes = await Quiz.find()
      .sort({ score: -1 })
      .limit(5)
      .select('subject topic difficulty score');

    return res.status(200).json({
      success: true,
      report: {
        generatedAt: new Date(),
        summary: {
          studentsCount,
          mentorsCount,
          quizCount,
          attemptCount,
          planCount
        },
        topQuizzes
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  createMentor,
  assignMentorToStudent,
  getReports
};
