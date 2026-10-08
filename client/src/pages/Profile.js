import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaCamera, FaEye, FaTrash, FaPlus, FaHeart, FaComment, FaPen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { imgUrl } from '../utils/imageUrl';


const Profile = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/users/me/posts').then(({ data }) => setPosts(data)).catch(() => {});
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete the post');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.put('/users/me', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="relative">
          {user?.avatar ? (
            <img src={imgUrl(user.avatar)} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-300" />
          )}
          <label className="absolute bottom-0 right-0 bg-brand-500 text-white rounded-full p-2 cursor-pointer text-xs">
            <FaCamera />
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-sm text-gray-500 mb-3">{user?.bio || 'No bio yet.'}</p>
          <Link to="/settings" className="text-sm font-medium px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50">
            Edit Profile
          </Link>
        </div>
      </div>

      {uploading && <p className="text-xs text-gray-400 mt-2">Uploading photo…</p>}

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2"><FaEye /> My Posts</h3>
          <Link to="/create-post" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-brand-500 text-white hover:bg-brand-600">
            <FaPlus className="text-xs" /> New Post
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="text-center bg-white border border-dashed border-gray-300 rounded-2xl py-12 px-4">
            <p className="text-sm text-gray-500 mb-4">You haven't shared any activities yet.</p>
            <Link to="/create-post" className="inline-block px-5 py-2 text-sm font-medium rounded-full bg-brand-500 text-white hover:bg-brand-600">
              Share your first post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {posts.map((p) => (
              <div key={p._id} className="relative group bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/posts/${p._id}`} className="block">
                  {p.image ? (
                    <img src={imgUrl(p.image)} alt={p.title} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="h-44 w-full bg-brand-50 flex items-center justify-center text-brand-300 text-sm">No image</div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-brand-500 font-medium mb-1">{p.category?.name}</p>
                    <h4 className="font-semibold text-sm">{p.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                    <div className="flex gap-3 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FaHeart /> {p.likes?.length || 0}</span>
                      <span className="flex items-center gap-1"><FaComment /> {p.comments?.length || 0}</span>
                    </div>
                  </div>
                </Link>
                <Link
                  to={`/posts/${p._id}/edit`}
                  aria-label={`Edit ${p.title}`}
                  title="Edit post"
                  className="absolute top-3 right-14 bg-white/90 text-gray-500 hover:text-brand-600 rounded-full p-2 shadow"
                >
                  <FaPen />
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  aria-label={`Delete ${p.title}`}
                  title="Delete post"
                  className="absolute top-3 right-3 bg-white/90 text-gray-500 hover:text-red-500 rounded-full p-2 shadow"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
