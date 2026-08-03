const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('reviewer', 'username avatar').sort('-createdAt').limit(20);
  res.json(reviews);
});

// @route POST /api/reviews (protected)
const createReview = asyncHandler(async (req, res) => {
  const { rating, text } = req.body;
  if (!rating || !text) {
    res.status(400);
    throw new Error('Rating and review text are required');
  }

  const review = await Review.create({ reviewer: req.user._id, rating, text });
  await review.populate('reviewer', 'username avatar');
  res.status(201).json(review);
});

module.exports = { getReviews, createReview };
