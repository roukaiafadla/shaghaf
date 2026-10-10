import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import api from '../api/client';
import { imgUrl } from '../utils/imageUrl';

// A few other posts by the same author, shown under a post to keep people browsing.
// Renders nothing when the author has no other posts.
const MoreFromAuthor = ({ postId, username }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/posts/${postId}/more`)
      .then(({ data }) => {
        if (!cancelled) setPosts(data);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (!posts.length) return null;

  return (
    <section className="mt-14 border-t border-gray-100 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">More from {username}</h2>
        <Link to={`/u/${encodeURIComponent(username)}`} className="text-sm font-medium text-brand-600 hover:underline">
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {posts.map((p) => (
          <Link
            key={p._id}
            to={`/posts/${p._id}`}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            {p.image ? (
              <img src={imgUrl(p.image)} alt={p.title} className="h-32 w-full object-cover" />
            ) : (
              <div className="h-32 w-full bg-brand-50 flex items-center justify-center text-brand-300 text-sm">No image</div>
            )}
            <div className="p-3">
              <p className="text-[11px] font-medium text-teal-600 uppercase tracking-wide">{p.category?.name}</p>
              <h3 className="text-sm font-semibold mt-0.5 line-clamp-1 group-hover:text-brand-600 transition-colors">{p.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><FaHeart /> {p.likeCount}</span>
                <span className="flex items-center gap-1"><FaComment /> {p.commentCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MoreFromAuthor;
