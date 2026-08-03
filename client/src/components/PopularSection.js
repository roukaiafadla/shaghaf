import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaFire } from 'react-icons/fa';
import api from '../api/client';

const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const PopularCard = ({ post, rank }) => (
  <Link
    to={`/posts/${post._id}`}
    className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="relative h-44 w-full overflow-hidden">
      {post.image ? (
        <img
          src={`${imgBase}${post.image}`}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-teal-100 to-brand-100 flex items-center justify-center text-brand-400 text-sm">
          {post.category?.name}
        </div>
      )}
      {rank <= 3 && (
        <span className="absolute top-3 left-3 flex items-center gap-1 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
          <FaFire /> #{rank} Trending
        </span>
      )}
      <span className="absolute top-3 right-3 bg-teal-600/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
        {post.category?.name}
      </span>
    </div>
    <div className="p-5">
      <h3 className="font-semibold mb-1 group-hover:text-brand-600 transition-colors">{post.title}</h3>
      <p className="text-xs text-gray-400 mb-2">by {post.author?.username}</p>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1 text-brand-500 font-medium">
          <FaHeart /> {post.likeCount}
        </span>
        <span className="flex items-center gap-1">
          <FaComment /> {post.commentCount}
        </span>
      </div>
    </div>
  </Link>
);

// Replaces the old static "Popular Articles" list (six hardcoded external
// links). Popularity is now real: the backend ranks actual user posts by
// like count via an aggregation, so this section changes as the community
// posts and likes things - never the same six items twice.
const PopularSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/posts/popular?limit=6')
      .then(({ data }) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-brand-600 text-sm font-semibold mb-2">
            <FaFire /> Community favorites
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">Popular Right Now</h2>
          <p className="text-gray-500 text-sm mt-2">Ranked by likes from real Shaghaf members - updates as the community grows.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <PopularCard key={post._id} post={post} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularSection;
