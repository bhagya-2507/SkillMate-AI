const mongoose = require('mongoose');

const MentorAssignmentSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

MentorAssignmentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

MentorAssignmentSchema.virtual('student', {
  ref: 'User',
  localField: 'student_id',
  foreignField: '_id',
  justOne: true
});

MentorAssignmentSchema.virtual('mentor', {
  ref: 'User',
  localField: 'mentor_id',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.models.MentorAssignment || mongoose.model('MentorAssignment', MentorAssignmentSchema);
