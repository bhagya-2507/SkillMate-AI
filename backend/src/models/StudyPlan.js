const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    target_date: {
      type: String,
      required: true
    },
    daily_hours: {
      type: Number,
      default: 2.0
    },
    difficulty: {
      type: String,
      default: 'Beginner'
    },
    status: {
      type: String,
      default: 'in_progress'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

StudyPlanSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

StudyPlanSchema.virtual('tasks', {
  ref: 'StudyTask',
  localField: '_id',
  foreignField: 'study_plan_id'
});

module.exports = mongoose.models.StudyPlan || mongoose.model('StudyPlan', StudyPlanSchema);
