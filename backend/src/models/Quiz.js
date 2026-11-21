const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      default: 'Medium'
    },
    total_questions: {
      type: Number,
      default: 5
    },
    score: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

QuizSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

QuizSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'quiz_id'
});

QuizSchema.virtual('attempts', {
  ref: 'QuizAttempt',
  localField: '_id',
  foreignField: 'quiz_id'
});

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
