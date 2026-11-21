const mongoose = require('mongoose');

const MentorFeedbackSchema = new mongoose.Schema(
  {
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    feedback: {
      type: String,
      required: true
    },
    recommendations: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

MentorFeedbackSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

MentorFeedbackSchema.virtual('student', {
  ref: 'User',
  localField: 'student_id',
  foreignField: '_id',
  justOne: true
});

MentorFeedbackSchema.virtual('mentor', {
  ref: 'User',
  localField: 'mentor_id',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.models.MentorFeedback || mongoose.model('MentorFeedback', MentorFeedbackSchema);
