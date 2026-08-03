const express = require('express');
const { updateProfile, getMyPosts } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.put('/me', protect, upload.single('avatar'), updateProfile);
router.get('/me/posts', protect, getMyPosts);

module.exports = router;
