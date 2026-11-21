const mongoose = require('mongoose');

const InterviewPracticeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    job_role: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    user_answer: {
      type: String,
      required: true
    },
    feedback: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    sample_answer: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

InterviewPracticeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.models.InterviewPractice || mongoose.model('InterviewPractice', InterviewPracticeSchema);
