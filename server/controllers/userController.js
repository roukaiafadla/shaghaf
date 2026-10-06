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

module.exports = { updateProfile, getMyPosts };
