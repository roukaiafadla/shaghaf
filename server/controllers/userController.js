const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');
const { uploadBuffer, deleteByUrl } = require('../utils/cloudinary');

// @route PUT /api/users/me (protected)
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.bio !== undefined) user.bio = req.body.bio;
  if (req.file) {
    const result = await uploadBuffer(req.file.buffer, 'shaghaf/avatars');
    const oldAvatar = user.avatar;
    user.avatar = result.secure_url;
    await deleteByUrl(oldAvatar); // clean up the previous avatar
  }

  await user.save();
  res.json({ user: user.toSafeObject() });
});

// @route GET /api/users/me/posts (protected)
const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate('category', 'name slug')
    .sort('-createdAt');
  res.json(posts);
});

// @route GET /api/users/:username (public)
// Public profile: only safe fields (never email or password), plus the user's posts and totals.
const getPublicProfile = asyncHandler(async (req, res) => {
  const username = String(req.params.username || '').trim();
  const escaped = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // "me" belongs to the logged-in user routes, so it can never be a public profile
  const user =
    username && username.toLowerCase() !== 'me'
      ? await User.findOne({ username: new RegExp(`^${escaped}$`, 'i') }).select('username bio avatar createdAt')
      : null;

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const posts = await Post.find({ author: user._id })
    .select('title description image category likes comments createdAt')
    .populate('category', 'name slug')
    .sort('-createdAt')
    .lean();

  // Send counts, not the arrays of who liked or what was said
  const publicPosts = posts.map((p) => ({
    _id: p._id,
    title: p.title,
    description: p.description,
    image: p.image,
    category: p.category,
    createdAt: p.createdAt,
    likeCount: p.likes?.length || 0,
    commentCount: p.comments?.length || 0,
  }));

  res.json({
    user: {
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
    stats: {
      posts: publicPosts.length,
      likes: publicPosts.reduce((sum, p) => sum + p.likeCount, 0),
    },
    posts: publicPosts,
  });
});

module.exports = { updateProfile, getMyPosts, getPublicProfile };
