// Images are stored on Cloudinary, so the DB holds full https URLs.
// Older local paths (e.g. "/uploads/x.jpg") still work through the API origin.
const API_ORIGIN = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

export const imgUrl = (path) => {
  if (!path) return '';
  return /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`;
};
