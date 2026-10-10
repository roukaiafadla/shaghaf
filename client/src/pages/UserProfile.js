import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { FaUserCircle, FaHeart, FaComment, FaEye, FaCalendarAlt } from 'react-icons/fa';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { imgUrl } from '../utils/imageUrl';

const joinedLabel = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

// Public page of any member: avatar, bio, totals and their posts.
// Your own username redirects to the private /profile page.
const UserProfile = () => {
  const { username } = useParams();
  const { user: me } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | notfound | error

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    api
      .get(`/users/${encodeURIComponent(username)}`)
      .then(({ data }) => {
        if (cancelled) return;
        setData(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(err.response?.status === 404 ? 'notfound' : 'error');
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (me && me.username.toLowerCase() === username.toLowerCase()) {
    return <Navigate to="/profile" replace />;
  }

  if (status === 'loading') return <div className="text-center py-24 text-gray-400">Loading…</div>;

  if (status === 'notfound') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Member not found</h1>
        <p className="text-gray-500 mb-6">We couldn't find anyone called “{username}”.</p>
        <Link to="/" className="inline-block bg-brand-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-brand-600 transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return <div className="text-center py-24 text-gray-400">Something went wrong. Please try again in a moment.</div>;
  }

  const { user, stats, posts } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {user.avatar ? (
          <img src={imgUrl(user.avatar)} alt={user.username} className="w-24 h-24 shrink-0 rounded-full object-cover" />
        ) : (
          <FaUserCircle className="w-24 h-24 shrink-0 text-gray-300" />
        )}
        <div className="text-center sm:text-left min-w-0">
          <h1 className="text-2xl font-bold break-words">{user.username}</h1>
          {user.bio ? (
            <p className="text-gray-500 mt-1 break-words">{user.bio}</p>
          ) : (
            <p className="text-gray-400 mt-1">No bio yet.</p>
          )}
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><FaEye className="text-gray-400" /> {stats.posts} {stats.posts === 1 ? 'post' : 'posts'}</span>
            <span className="flex items-center gap-1.5"><FaHeart className="text-brand-400" /> {stats.likes} {stats.likes === 1 ? 'like' : 'likes'} received</span>
            <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-gray-400" /> Joined {joinedLabel(user.createdAt)}</span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-10 mb-4">Posts by {user.username}</h2>

      {posts.length === 0 ? (
        <p className="text-gray-400">{user.username} hasn't shared anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p._id}
              to={`/posts/${p._id}`}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {p.image ? (
                <img src={imgUrl(p.image)} alt={p.title} className="h-44 w-full object-cover" />
              ) : (
                <div className="h-44 w-full bg-brand-50 flex items-center justify-center text-brand-300 text-sm">No image</div>
              )}
              <div className="p-4">
                <span className="text-[11px] font-medium text-teal-600 uppercase tracking-wide">{p.category?.name}</span>
                <h3 className="font-semibold mt-1 group-hover:text-brand-600 transition-colors">{p.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FaHeart /> {p.likeCount}</span>
                  <span className="flex items-center gap-1"><FaComment /> {p.commentCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
