const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads an in-memory image buffer (from multer) and resolves with Cloudinary's result
// (result.secure_url is the permanent https URL we store in MongoDB).
exports.uploadBuffer = (buffer, folder = 'shaghaf') =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (err, result) => (err ? reject(err) : resolve(result)))
      .end(buffer);
  });

// Best-effort delete of an image from its stored URL. Never throws.
// URL looks like https://res.cloudinary.com/<cloud>/image/upload/v123/shaghaf/abc.jpg
// and the public_id is "shaghaf/abc".
exports.deleteByUrl = async (url) => {
  try {
    if (!url || !url.includes('res.cloudinary.com')) return;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    if (!match) return;
    await cloudinary.uploader.destroy(match[1]);
  } catch (err) {
    console.error('Cloudinary delete failed:', err.message);
  }
};
