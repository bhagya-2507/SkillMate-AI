const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    question_text: {
      type: String,
      required: true
    },
    option_a: {
      type: String,
      required: true
    },
    option_b: {
      type: String,
      required: true
    },
    option_c: {
      type: String,
      required: true
    },
    option_d: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    explanation: {
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

QuestionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
