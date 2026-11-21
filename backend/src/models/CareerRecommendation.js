const mongoose = require('mongoose');

const CareerRecommendationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    interests: {
      type: String,
      required: true
    },
    skills: {
      type: String,
      required: true
    },
    education: {
      type: String,
      default: ''
    },
    goals: {
      type: String,
      default: ''
    },
    recommendation: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

CareerRecommendationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.models.CareerRecommendation || mongoose.model('CareerRecommendation', CareerRecommendationSchema);
