const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');

// @route GET /api/stats
// Real counts pulled live from the database - used on the About page instead
// of hardcoded "10,000+ happy users!" style numbers.
const getStats = asyncHandler(async (req, res) => {
  const [users, posts, categories, likeAgg] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Category.countDocuments(),
    Post.aggregate([{ $project: { likeCount: { $size: '$likes' } } }, { $group: { _id: null, total: { $sum: '$likeCount' } } }]),
  ]);

  res.json({
    users,
    posts,
    categories,
    likes: likeAgg[0]?.total || 0,
  });
});

module.exports = { getStats };
