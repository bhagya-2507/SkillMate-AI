const mongoose = require('mongoose');

const LearningResourceSchema = new mongoose.Schema(
  {
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      required: true
    },
    resource_url: {
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

LearningResourceSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

LearningResourceSchema.virtual('mentor', {
  ref: 'User',
  localField: 'mentor_id',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.models.LearningResource || mongoose.model('LearningResource', LearningResourceSchema);
