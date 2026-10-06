import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaComment, FaRegHeart, FaTrash } from 'react-icons/fa';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { imgUrl } from '../utils/imageUrl';


const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(() => {
    api.get(`/posts/${id}`).then(({ data }) => setPost(data));
  }, [id]);

  useEffect(load, [load]);

  const toggleLike = async () => {
    if (!user) return alert('Log in to like this post');
    await api.put(`/posts/${id}/like`);
    load();
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await api.post(`/posts/${id}/comments`, { text: comment });
    setComment('');
    load();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete the post');
    }
  };

  if (!post) return <div className="text-center py-24 text-gray-400">Loading…</div>;

  const isOwner = user && post.author && (post.author._id === user.id);
  const liked = user && post.likes?.some((l) => l === user.id || l._id === user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {post.image && (
        <img src={imgUrl(post.image)} alt={post.title} className="w-full rounded-2xl mb-6 max-h-[420px] object-cover" />
      )}
      <p className="text-xs uppercase tracking-wide text-brand-500 font-semibold mb-2">{post.category?.name}</p>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-6">by {post.author?.username}</p>
      <p className="text-gray-700 leading-relaxed mb-6">{post.description}</p>

      <div className="flex items-center gap-6 mb-10">
        <button onClick={toggleLike} className="flex items-center gap-2 text-sm font-medium text-brand-600">
          {liked ? <FaHeart /> : <FaRegHeart />} {post.likes?.length || 0} likes
        </button>
        {isOwner && (
          <button onClick={handleDelete} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700">
            <FaTrash /> Delete post
          </button>
        )}
      </div>

      <h2 className="font-semibold mb-4 flex items-center gap-2"><FaComment /> Comments ({post.comments?.length || 0})</h2>
      <div className="space-y-4 mb-6">
        {post.comments?.map((c) => (
          <div key={c._id} className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium">{c.author?.username || 'User'}</p>
            <p className="text-sm text-gray-600">{c.text}</p>
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={submitComment} className="flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button type="submit" className="px-5 py-2 bg-brand-500 text-white rounded-full text-sm font-medium">Post</button>
        </form>
      ) : (
        <p className="text-sm text-gray-400"><a href="/login" className="text-brand-600 underline">Log in</a> to comment.</p>
      )}
    </div>
  );
};

export default PostDetail;
