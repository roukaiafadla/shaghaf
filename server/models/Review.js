const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
