const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('../config/database');
const {
  User,
  StudyPlan,
  StudyTask,
  Quiz,
  Question,
  QuizAttempt,
  LearningResource,
  MentorAssignment,
  MentorFeedback,
  Chat,
  ChatMessage
} = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting SkillMate database seeder for MongoDB...');
    await connectDB();

    const salt = await bcrypt.genSalt(10);

    // 1. Seed Admin
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    let adminUser = await User.findOne({ email: 'admin@skillmate.ai' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Dr. Evelyn Vance',
        email: 'admin@skillmate.ai',
        password: adminPassword,
        role: 'ADMIN',
        education: 'Ph.D. in Computer Science',
        college: 'Sanskar College of Engineering & Technology',
        interests: 'System Architecture, Curriculum Design, Distributed Systems',
        is_active: true
      });
      console.log('✅ Admin user created: admin@skillmate.ai');
    }

    // 2. Seed Mentor
    const mentorPassword = await bcrypt.hash('Mentor@123', salt);
    let mentorUser = await User.findOne({ email: 'mentor@skillmate.ai' });
    if (!mentorUser) {
      mentorUser = await User.create({
        name: 'Prof. Marcus Brody',
        email: 'mentor@skillmate.ai',
        password: mentorPassword,
        role: 'MENTOR',
        education: 'M.Tech Software Engineering',
        college: 'Department of Computer Science & Engineering',
        interests: 'Cloud Computing, Database Optimization, Placement Guidance',
        is_active: true
      });
      console.log('✅ Mentor user created: mentor@skillmate.ai');
    }

    // 3. Seed Student
    const studentPassword = await bcrypt.hash('Student@123', salt);
    let studentUser = await User.findOne({ email: 'student@skillmate.ai' });
    if (!studentUser) {
      studentUser = await User.create({
        name: 'Lalit Bhardwaj',
        email: 'student@skillmate.ai',
        password: studentPassword,
        role: 'STUDENT',
        education: 'B.Tech Computer Science & Engineering (Final Year)',
        college: 'Sanskar College of Engineering & Technology',
        interests: 'Full-Stack Web Development, Data Structures, Cloud Architecture',
        is_active: true
      });
      console.log('✅ Student user created: student@skillmate.ai');
    }

    // 4. Assign Mentor to Student
    const assignmentExists = await MentorAssignment.findOne({
      mentor_id: mentorUser._id,
      student_id: studentUser._id
    });
    if (!assignmentExists) {
      await MentorAssignment.create({
        mentor_id: mentorUser._id,
        student_id: studentUser._id
      });
      console.log('✅ Mentor assigned to Student.');
    }

    // 5. Seed Learning Resources
    const sampleResources = [
      {
        mentor_id: mentorUser._id,
        title: 'Mastering Database Indexing & Query Aggregations',
        subject: 'Database Management Systems',
        description: 'Comprehensive guide covering compound indexes, execution plans, and query optimization techniques in modern databases.',
        resource_url: 'https://developer.mozilla.org'
      },
      {
        mentor_id: mentorUser._id,
        title: 'System Design Primer: High Scalability Architecture',
        subject: 'System Design',
        description: 'Learn how to architect high-throughput applications handling high traffic using caching, load balancing, and async workers.',
        resource_url: 'https://github.com/donnemartin/system-design-primer'
      },
      {
        mentor_id: mentorUser._id,
        title: 'React 19 Component Architecture & Performance Tuning',
        subject: 'Web Technologies',
        description: 'Practical guide to component composition, state management, and performance tuning for modern full-stack web applications.',
        resource_url: 'https://react.dev/learn'
      }
    ];

    for (const resData of sampleResources) {
      const exists = await LearningResource.findOne({ title: resData.title, mentor_id: mentorUser._id });
      if (!exists) {
        await LearningResource.create(resData);
      }
    }
    console.log('✅ Learning resources verified.');

    // 6. Seed Sample Study Plan & Tasks for Student
    let existingPlan = await StudyPlan.findOne({ user_id: studentUser._id });
    if (!existingPlan) {
      const plan = await StudyPlan.create({
        user_id: studentUser._id,
        title: 'Full-Stack Engineering & System Design Preparation',
        subject: 'Web Technologies',
        target_date: '2026-12-15',
        daily_hours: 2.5,
        difficulty: 'Intermediate',
        status: 'in_progress'
      });

      await StudyTask.insertMany([
        {
          study_plan_id: plan._id,
          task_title: 'Day 1: REST API Architecture & Express Middleware',
          task_description: 'Design robust error handling and JWT authentication layers.',
          task_date: '2026-11-18',
          is_completed: true
        },
        {
          study_plan_id: plan._id,
          task_title: 'Day 2: Schema Modeling & Indexing with Mongoose',
          task_description: 'Establish normalized document collections and indexing strategies.',
          task_date: '2026-11-19',
          is_completed: true
        },
        {
          study_plan_id: plan._id,
          task_title: 'Day 3: State Management & Reactive UI Design',
          task_description: 'Build responsive React components and interactive dashboard views.',
          task_date: '2026-11-20',
          is_completed: false
        },
        {
          study_plan_id: plan._id,
          task_title: 'Day 4: Technical Placement Mock Interview Questions',
          task_description: 'Practice SDE-1 questions on linked lists, graph algorithms, and system design.',
          task_date: '2026-11-21',
          is_completed: false
        }
      ]);
      console.log('✅ Sample study plan & tasks created.');
    }

    // 7. Seed Sample Quiz & Questions
    let existingQuiz = await Quiz.findOne({ user_id: studentUser._id });
    if (!existingQuiz) {
      const quiz = await Quiz.create({
        user_id: studentUser._id,
        subject: 'Database Management Systems',
        topic: 'Normalization, ACID & Indexing',
        difficulty: 'Medium',
        total_questions: 4,
        score: 100
      });

      const questions = await Question.insertMany([
        {
          quiz_id: quiz._id,
          question_text: "Which Normal Form removes 'Partial Dependency' on a composite candidate key?",
          option_a: '1NF (First Normal Form)',
          option_b: '2NF (Second Normal Form)',
          option_c: '3NF (Third Normal Form)',
          option_d: 'BCNF (Boyce-Codd Normal Form)',
          correct_answer: 'B',
          explanation: '2NF requires the table to be in 1NF and ensures all non-key attributes are fully functionally dependent on the entire primary key.'
        },
        {
          quiz_id: quiz._id,
          question_text: 'In ACID properties, what does "Atomicity" guarantee during transaction execution?',
          option_a: 'Data is encrypted on disk.',
          option_b: 'Either all transaction operations complete, or none do (All or Nothing).',
          option_c: 'Transactions execute simultaneously without interference.',
          option_d: 'Committed data survives system crashes.',
          correct_answer: 'B',
          explanation: 'Atomicity ensures that all statements within a transaction succeed, or the entire operation is rolled back.'
        },
        {
          quiz_id: quiz._id,
          question_text: 'Which data structure is most commonly used for database indexes to enable range queries?',
          option_a: 'Binary Heap',
          option_b: 'B+ Tree',
          option_c: 'Hash Table',
          option_d: 'Singly Linked List',
          correct_answer: 'B',
          explanation: 'B+ Trees keep data sorted and allow efficient lookups, sequential access, insertions, and range queries in logarithmic time.'
        },
        {
          quiz_id: quiz._id,
          question_text: 'What is the primary difference between a clustered and non-clustered index?',
          option_a: 'Clustered index stores pointers only; non-clustered stores the actual data rows.',
          option_b: 'Clustered index physically orders table data; non-clustered stores a separate index structure with row pointers.',
          option_c: 'A table can have unlimited clustered indexes.',
          option_d: 'Non-clustered indexes are slower for all types of queries.',
          correct_answer: 'B',
          explanation: 'A table can have only one clustered index because data rows themselves are stored in that order.'
        }
      ]);

      await QuizAttempt.create({
        user_id: studentUser._id,
        quiz_id: quiz._id,
        score: 100,
        total_questions: 4,
        correct_answers: 4,
        answers: {
          [questions[0]._id.toString()]: 'B',
          [questions[1]._id.toString()]: 'B',
          [questions[2]._id.toString()]: 'B',
          [questions[3]._id.toString()]: 'B'
        },
        attempted_at: new Date()
      });
      console.log('✅ Sample quiz, questions & attempt created.');
    }

    // 8. Seed Sample Mentor Feedback
    const existingFeedback = await MentorFeedback.findOne({ mentor_id: mentorUser._id, student_id: studentUser._id });
    if (!existingFeedback) {
      await MentorFeedback.create({
        mentor_id: mentorUser._id,
        student_id: studentUser._id,
        feedback: 'Excellent grasp of database normalization and transaction fundamentals. Keep focusing on graph algorithms and system design for upcoming placement drives.',
        recommendations: 'Practice 2-3 LeetCode Medium dynamic programming problems daily and review distributed cache strategies.',
        rating: 5
      });
      console.log('✅ Sample mentor feedback created.');
    }

    console.log(`
=====================================================
🎉 SkillMate Database Seeding Completed Successfully!
=====================================================
Demo Credentials Ready:
👨‍🎓 Student: student@skillmate.ai  /  Student@123
👨‍🏫 Mentor:  mentor@skillmate.ai   /  Mentor@123
🛡️ Admin:   admin@skillmate.ai    /  Admin@123
=====================================================
    `);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
