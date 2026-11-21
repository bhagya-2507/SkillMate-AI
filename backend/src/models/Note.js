const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    original_filename: {
      type: String,
      required: true
    },
    file_type: {
      type: String,
      default: 'pdf'
    },
    file_size: {
      type: Number,
      default: 0
    },
    summary: {
      type: String,
      required: true
    },
    key_points: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

NoteSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.models.Note || mongoose.model('Note', NoteSchema);
