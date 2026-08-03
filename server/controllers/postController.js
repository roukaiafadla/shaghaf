const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Category = require('../models/Category');

// @route GET /api/posts/popular?limit=6
// Ranks real posts by like count (ties broken by newest first) so the
// homepage "Popular" section is never static - it reflects what users are
// actually engaging with right now.
const getPopularPosts = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 6, 20);

  const posts = await Post.aggregate([
    { $addFields: { likeCount: { $size: '$likes' }, commentCount: { $size: '$comments' } } },
    { $sort: { likeCount: -1, commentCount: -1, createdAt: -1 } },
    { $limit: limit },
    {
      $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' },
    },
    { $unwind: '$author' },
    {
      $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' },
    },
    { $unwind: '$category' },
    {
      $project: {
        title: 1,
        description: 1,
        image: 1,
        likeCount: 1,
        commentCount: 1,
        createdAt: 1,
        'author.username': 1,
        'author.avatar': 1,
        'category.name': 1,
        'category.slug': 1,
      },
    },
  ]);

  res.json(posts);
});

// @route GET /api/posts?category=slug&search=term
const getPosts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    const category = await Category.findOne({ slug: req.query.category });
    if (!category) return res.json([]);
    filter.category = category._id;
  }
  if (req.query.search) {
    // Escape regex special characters so a search like "a+b?" can't break
    // the pattern or behave unexpectedly.
    const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
    ];
  }

  const posts = await Post.find(filter)
    .populate('author', 'username avatar')
    .populate('category', 'name slug')
    .sort('-createdAt');

  res.json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username avatar')
    .populate('category', 'name slug')
    .populate('comments.author', 'username avatar');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  res.json(post);
});

// @route POST /api/posts (protected)
const createPost = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Title, description and category are required');
  }

  const categoryDoc = await Category.findOne({ slug: category }) || await Category.findById(category);
  if (!categoryDoc) {
    res.status(400);
    throw new Error('Invalid category');
  }

  const post = await Post.create({
    title,
    description,
    category: categoryDoc._id,
    author: req.user._id,
    image: req.file ? `/uploads/${req.file.filename}` : '',
  });

  res.status(201).json(post);
});

// @route PUT /api/posts/:id/like (protected)
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const alreadyLiked = post.likes.some((id) => id.toString() === req.user._id.toString());
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
  }
  await post.save();
  res.json({ likes: post.likes.length, liked: !alreadyLiked });
});

// @route POST /api/posts/:id/comments (protected)
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.comments.push({ author: req.user._id, text });
  await post.save();
  await post.populate('comments.author', 'username avatar');
  res.status(201).json(post.comments[post.comments.length - 1]);
});

module.exports = { getPosts, getPopularPosts, getPostById, createPost, toggleLike, addComment };
