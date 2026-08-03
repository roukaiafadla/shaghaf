import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaCamera, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const API_ORIGIN = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/users/me/posts').then(({ data }) => setPosts(data)).catch(() => {});
  }, []);

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
            <img src={`${API_ORIGIN}${user.avatar}`} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
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
        <h3 className="font-semibold flex items-center gap-2 mb-4"><FaEye /> My Posts</h3>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-400">You haven't shared any activities yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((p) => (
              <Link key={p._id} to={`/posts/${p._id}`} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md">
                <p className="text-xs text-brand-500 font-medium mb-1">{p.category?.name}</p>
                <h4 className="font-medium text-sm">{p.title}</h4>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
