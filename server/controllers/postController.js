const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { uploadBuffer, deleteByUrl } = require('../utils/cloudinary');

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
  // Pagination is opt-in: send ?page= and/or ?limit= to get { posts, page, pages, total }.
  // Without them the old behaviour (a plain array of every match) is kept.
  const paginated = req.query.page !== undefined || req.query.limit !== undefined;

  const filter = {};
  if (req.query.category) {
    const category = await Category.findOne({ slug: req.query.category });
    if (!category) return res.json(paginated ? { posts: [], page: 1, pages: 0, total: 0 } : []);
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

  const query = Post.find(filter)
    .populate('author', 'username avatar')
    .populate('category', 'name slug')
    .sort({ createdAt: -1, _id: -1 }); // _id breaks ties so two pages never overlap

  if (!paginated) return res.json(await query);

  const requested = parseInt(req.query.limit, 10);
  const limit = Math.min(requested >= 1 ? requested : 12, 50); // default 12, never more than 50
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const total = await Post.countDocuments(filter);
  const pages = Math.ceil(total / limit);

  // A page past the end is simply empty
  const posts = page > pages ? [] : await query.skip((page - 1) * limit).limit(limit);

  res.json({ posts, page, pages, total });
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

  // Upload the photo to Cloudinary and store its permanent https URL
  let imageUrl = '';
  if (req.file) {
    const result = await uploadBuffer(req.file.buffer);
    imageUrl = result.secure_url;
  }

  const post = await Post.create({
    title,
    description,
    category: categoryDoc._id,
    author: req.user._id,
    image: imageUrl,
  });

  res.status(201).json(post);
});

// @route GET /api/posts/:id/more?limit=3
// Other posts by the same author as this post (newest first), as light cards.
const getMoreFromAuthor = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.json([]);

  const post = await Post.findById(req.params.id).select('author');
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 3, 6);
  const others = await Post.find({ author: post.author, _id: { $ne: post._id } })
    .select('title image category likes comments createdAt')
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(limit)
    .lean();

  res.json(
    others.map((p) => ({
      _id: p._id,
      title: p.title,
      image: p.image,
      category: p.category,
      likeCount: p.likes?.length || 0,
      commentCount: p.comments?.length || 0,
    }))
  );
});

// @route PUT /api/posts/:id (protected, author only)
// Updates title, description, category and optionally replaces the photo.
const updatePost = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Post not found');
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only edit your own posts');
  }

  const title = typeof req.body.title === 'string' ? req.body.title.trim() : post.title;
  const description = typeof req.body.description === 'string' ? req.body.description.trim() : post.description;

  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description cannot be empty');
  }
  if (title.length > 120 || description.length > 2000) {
    res.status(400);
    throw new Error('Title is limited to 120 characters and description to 2000');
  }

  if (req.body.category) {
    const categoryDoc =
      (await Category.findOne({ slug: req.body.category })) ||
      (mongoose.isValidObjectId(req.body.category) ? await Category.findById(req.body.category) : null);
    if (!categoryDoc) {
      res.status(400);
      throw new Error('Invalid category');
    }
    post.category = categoryDoc._id;
  }

  post.title = title;
  post.description = description;

  // New photo: upload it first, and only delete the old one once the save succeeded
  let oldImage = '';
  if (req.file) {
    const result = await uploadBuffer(req.file.buffer);
    oldImage = post.image;
    post.image = result.secure_url;
  }

  await post.save();
  if (oldImage) await deleteByUrl(oldImage);

  await post.populate('author', 'username avatar');
  await post.populate('category', 'name slug');
  res.json(post);
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

// @route DELETE /api/posts/:id/comments/:commentId (protected)
// Allowed for the comment's author or the owner of the post.
const deleteComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params;

  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(commentId)) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const post = await Post.findById(id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const userId = req.user._id.toString();
  const isCommentAuthor = comment.author.toString() === userId;
  const isPostOwner = post.author.toString() === userId;
  if (!isCommentAuthor && !isPostOwner) {
    res.status(403);
    throw new Error('Not allowed to delete this comment');
  }

  post.comments.pull({ _id: commentId });
  await post.save();
  res.json({ message: 'Comment deleted', id: commentId });
});

// @route DELETE /api/posts/:id (protected, author only)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Only the person who wrote the post can delete it
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not allowed to delete this post');
  }

  // Remove the image from Cloudinary too (best effort - never blocks the delete)
  await deleteByUrl(post.image);

  await post.deleteOne();
  res.json({ message: 'Post deleted', id: req.params.id });
});

module.exports = { getPosts, getPopularPosts, getPostById, getMoreFromAuthor, createPost, updatePost, toggleLike, addComment, deleteComment, deletePost };
