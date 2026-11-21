const mongoose = require('mongoose');

const StudyTaskSchema = new mongoose.Schema(
  {
    study_plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyPlan',
      required: true
    },
    task_title: {
      type: String,
      required: true
    },
    task_description: {
      type: String,
      default: ''
    },
    task_date: {
      type: String,
      default: ''
    },
    is_completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

StudyTaskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.models.StudyTask || mongoose.model('StudyTask', StudyTaskSchema);
