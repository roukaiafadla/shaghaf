import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaHeart, FaComment, FaSearch, FaTimes } from 'react-icons/fa';
import api from '../api/client';

const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ResultCard = ({ post }) => (
  <Link
    to={`/posts/${post._id}`}
    className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    <div className="h-40 w-full overflow-hidden">
      {post.image ? (
        <img
          src={`${imgBase}${post.image}`}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-teal-50 to-brand-50 flex items-center justify-center text-brand-300 text-sm">
          {post.category?.name}
        </div>
      )}
    </div>
    <div className="p-4">
      <span className="text-[11px] font-medium text-teal-600 uppercase tracking-wide">{post.category?.name}</span>
      <h3 className="font-semibold text-sm mt-1 group-hover:text-brand-600 transition-colors">{post.title}</h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description}</p>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
        <span>by {post.author?.username || 'Unknown'}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1"><FaHeart /> {post.likes?.length || 0}</span>
          <span className="flex items-center gap-1"><FaComment /> {post.comments?.length || 0}</span>
        </span>
      </div>
    </div>
  </Link>
);

// Powers real search: the navbar search box sends the user to /?search=term,
// and this component (rendered by Home when that param is present) actually
// queries the backend for matching posts, plus surfaces any category whose
// name matches so people searching a hobby name land on the right place.
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [posts, setPosts] = useState([]);
  const [matchingCategories, setMatchingCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    Promise.all([
      api.get(`/posts?search=${encodeURIComponent(query)}`),
      api.get('/categories'),
    ]).then(([postsRes, catsRes]) => {
      setPosts(postsRes.data);
      setMatchingCategories(
        catsRes.data.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      );
    }).finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaSearch className="text-brand-500 text-lg" />
          Results for "{query}"
        </h1>
        <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600">
          <FaTimes /> Clear search
        </Link>
      </div>

      {matchingCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {matchingCategories.map((c) => (
            <Link
              key={c._id}
              to={`/category/${c.slug}`}
              className="bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 px-4 py-2 rounded-full text-sm font-medium"
            >
              Browse the "{c.name}" category →
            </Link>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">No posts match "{query}" yet.</p>
          <p className="text-sm">Try a different word, or browse a category from the menu above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => <ResultCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
