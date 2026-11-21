const { StudyPlan, StudyTask } = require('../models');
const geminiService = require('../services/geminiService');

// 1. Create a new Study Plan
const createStudyPlan = async (req, res, next) => {
  try {
    const { subject, topic, target_date, daily_hours, difficulty } = req.body;

    // Generate day-wise tasks
    const generated = await geminiService.generateStudyPlan(
      subject,
      topic,
      target_date,
      daily_hours || 2,
      difficulty || 'Beginner'
    );

    // Create StudyPlan record in MongoDB
    const plan = await StudyPlan.create({
      user_id: req.user.id,
      title: generated.title || `${subject}: Mastering ${topic}`,
      subject,
      target_date,
      daily_hours: daily_hours || 2.0,
      difficulty: difficulty || 'Beginner',
      status: 'in_progress'
    });

    // Calculate dates for tasks
    const startDate = new Date();
    const tasksToInsert = (generated.tasks || []).map((t, idx) => {
      const taskDate = new Date(startDate);
      taskDate.setDate(startDate.getDate() + (t.day_offset || (idx + 1)));
      return {
        study_plan_id: plan._id,
        task_title: t.task_title || `Day ${idx + 1}: Study Milestone`,
        task_description: t.task_description || 'Review essential concepts and complete exercises.',
        task_date: taskDate.toISOString().split('T')[0],
        is_completed: false
      };
    });

    if (tasksToInsert.length > 0) {
      await StudyTask.insertMany(tasksToInsert);
    }

    const tasks = await StudyTask.find({ study_plan_id: plan._id }).sort({ task_date: 1 });
    const planObj = plan.toJSON();
    planObj.tasks = tasks;
    planObj.totalTasks = tasks.length;
    planObj.completedTasks = 0;
    planObj.completionPercentage = 0;

    return res.status(201).json({
      success: true,
      message: 'Personalized study plan created successfully!',
      plan: planObj
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get all Study Plans for student
const getStudyPlans = async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({ user_id: req.user.id }).sort({ created_at: -1 });

    const enriched = await Promise.all(
      plans.map(async (p) => {
        const tasks = await StudyTask.find({ study_plan_id: p._id }).sort({ task_date: 1 });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.is_completed).length;
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return {
          ...p.toJSON(),
          tasks,
          totalTasks,
          completedTasks,
          completionPercentage
        };
      })
    );

    return res.status(200).json({ success: true, plans: enriched });
  } catch (error) {
    next(error);
  }
};

// 3. Get single Study Plan with tasks
const getStudyPlanById = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user_id: req.user.id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }

    const tasks = await StudyTask.find({ study_plan_id: plan._id }).sort({ task_date: 1 });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.is_completed).length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.status(200).json({
      success: true,
      plan: {
        ...plan.toJSON(),
        tasks,
        totalTasks,
        completedTasks,
        completionPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update Study Plan details
const updateStudyPlan = async (req, res, next) => {
  try {
    const { title, subject, target_date, daily_hours, difficulty, status } = req.body;
    const plan = await StudyPlan.findOne({ _id: req.params.id, user_id: req.user.id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }

    plan.title = title || plan.title;
    plan.subject = subject || plan.subject;
    plan.target_date = target_date || plan.target_date;
    plan.daily_hours = daily_hours !== undefined ? daily_hours : plan.daily_hours;
    plan.difficulty = difficulty || plan.difficulty;
    plan.status = status || plan.status;

    await plan.save();

    return res.status(200).json({
      success: true,
      message: 'Study plan updated successfully.',
      plan
    });
  } catch (error) {
    next(error);
  }
};

// 5. Delete Study Plan
const deleteStudyPlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user_id: req.user.id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }

    await StudyTask.deleteMany({ study_plan_id: plan._id });
    await StudyPlan.findByIdAndDelete(plan._id);

    return res.status(200).json({
      success: true,
      message: 'Study plan and its associated tasks deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// 6. Toggle Study Task Completion
const toggleTaskCompletion = async (req, res, next) => {
  try {
    const taskId = req.params.taskId || req.params.id;
    const { is_completed } = req.body;

    const task = await StudyTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Study task not found.' });
    }

    task.is_completed = is_completed !== undefined ? Boolean(is_completed) : !task.is_completed;
    await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${task.is_completed ? 'completed' : 'incomplete'}.`,
      task
    });
  } catch (error) {
    next(error);
  }
};

// 7. Add Custom Task to an existing Plan
const addTaskToPlan = async (req, res, next) => {
  try {
    const planId = req.params.id;
    const { task_title, task_description, task_date } = req.body;

    const plan = await StudyPlan.findOne({ _id: planId, user_id: req.user.id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }

    const task = await StudyTask.create({
      study_plan_id: plan._id,
      task_title,
      task_description: task_description || '',
      task_date: task_date || new Date().toISOString().split('T')[0],
      is_completed: false
    });

    return res.status(201).json({
      success: true,
      message: 'New task added to plan.',
      task
    });
  } catch (error) {
    next(error);
  }
};

// 8. Delete a specific Task
const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const task = await StudyTask.findById(taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await StudyTask.findByIdAndDelete(taskId);

    return res.status(200).json({
      success: true,
      message: 'Task removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudyPlan,
  getStudyPlans,
  getStudyPlanById,
  updateStudyPlan,
  deleteStudyPlan,
  toggleTaskCompletion,
  toggleTaskComplete: toggleTaskCompletion,
  addTaskToPlan,
  deleteTask
};
