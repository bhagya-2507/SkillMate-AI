const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'New Discussion'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ChatSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ChatSchema.virtual('messages', {
  ref: 'ChatMessage',
  localField: '_id',
  foreignField: 'chat_id'
});

module.exports = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
