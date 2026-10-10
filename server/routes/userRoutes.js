const express = require('express');
const { updateProfile, getMyPosts, getPublicProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.put('/me', protect, upload.single('avatar'), updateProfile);
router.get('/me/posts', protect, getMyPosts);
// Keep this last: it matches any single path segment
router.get('/:username', getPublicProfile);

module.exports = router;
