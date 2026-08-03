const express = require('express');
const { getPosts, getPopularPosts, getPostById, createPost, toggleLike, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getPosts);
// NOTE: this must stay above the /:id route below, otherwise Express would
// treat "popular" as an :id value and 404/cast-error instead of matching here.
router.get('/popular', getPopularPosts);
router.get('/:id', getPostById);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

module.exports = router;
