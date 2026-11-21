const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['STUDENT', 'MENTOR', 'ADMIN'],
      default: 'STUDENT'
    },
    education: {
      type: String,
      default: null
    },
    college: {
      type: String,
      default: null
    },
    interests: {
      type: String,
      default: null
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for id
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
