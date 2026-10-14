const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');
const { uploadBuffer, deleteByUrl } = require('../utils/cloudinary');

// Escapes regex special characters so search text is always matched literally
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

// @route GET /api/users?search=term&limit=24 (public)
// Members directory: most active first. Only public fields are returned, never email or password.
const listMembers = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 24, 48);
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 50) : '';

  const match = {};
  if (search) {
    const pattern = escapeRegex(search);
    match.$or = [
      { username: { $regex: pattern, $options: 'i' } },
      { bio: { $regex: pattern, $options: 'i' } },
    ];
  }

  const members = await User.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'posts',
        let: { uid: '$_id' },
        pipeline: [{ $match: { $expr: { $eq: ['$author', '$$uid'] } } }, { $count: 'n' }],
        as: 'postStats',
      },
    },
    { $addFields: { postCount: { $ifNull: [{ $arrayElemAt: ['$postStats.n', 0] }, 0] } } },
    { $sort: { postCount: -1, createdAt: -1 } },
    { $limit: limit },
    // Inclusion-only projection: everything not listed here (email, password...) is dropped
    { $project: { username: 1, bio: 1, avatar: 1, createdAt: 1, postCount: 1 } },
  ]);

  res.json(members);
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

module.exports = { updateProfile, getMyPosts, getPublicProfile, listMembers };
