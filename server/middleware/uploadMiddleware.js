const multer = require('multer');
const path = require('path');

// Keeps uploaded images (post photos, avatars) in memory as req.file.buffer.
// The controller then sends the buffer to Cloudinary, so nothing is written
// to the server's disk (which is wiped on every redeploy on Render).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  if (ok) return cb(null, true);
  cb(new Error('Only image files (jpg, png, webp) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap per image
});

module.exports = upload;