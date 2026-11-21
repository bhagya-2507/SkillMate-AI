const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    total_questions: {
      type: Number,
      required: true
    },
    correct_answers: {
      type: Number,
      required: true
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    attempted_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

QuizAttemptSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

QuizAttemptSchema.virtual('quiz', {
  ref: 'Quiz',
  localField: 'quiz_id',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);
