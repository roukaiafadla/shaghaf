import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaHeart, FaComment, FaSearch, FaTimes } from 'react-icons/fa';
import api from '../api/client';
import { imgUrl } from '../utils/imageUrl';
import AuthorLink from '../components/AuthorLink';
import MemberCard from '../components/MemberCard';
import LoadMore from '../components/LoadMore';
import usePagedPosts from '../hooks/usePagedPosts';
import { useAuth } from '../context/AuthContext';


const ResultCard = ({ post }) => (
  <Link
    to={`/posts/${post._id}`}
    className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    <div className="h-40 w-full overflow-hidden">
      {post.image ? (
        <img
          src={imgUrl(post.image)}
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
        <span>by <AuthorLink username={post.author?.username} avatar={post.author?.avatar} showAvatar nested /></span>
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
  const [matchingCategories, setMatchingCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const { user } = useAuth();

  // Matching posts load 12 at a time, with a "Load more" button
  const { posts, total, loading, loadingMore, error, hasMore, loadMore } = usePagedPosts({ search: query });

  // Categories and members that match are small lists, loaded alongside
  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    Promise.all([
      api.get('/categories'),
      // A failing member search must never break the post results
      api.get('/users', { params: { search: query, limit: 6 } }).catch(() => ({ data: [] })),
    ])
      .then(([catsRes, membersRes]) => {
        if (cancelled) return;
        setMatchingCategories(catsRes.data.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())));
        setMembers(membersRes.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
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

      {members.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Members</h2>
            <Link
              to={`/members?search=${encodeURIComponent(query)}`}
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              See all members →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <MemberCard key={m._id} member={m} isYou={user?.username === m.username} />
            ))}
          </div>
        </section>
      )}

      {members.length > 0 && !loading && posts.length > 0 && (
        <h2 className="text-lg font-semibold mb-4">
          Posts <span className="text-sm font-normal text-gray-400">({total})</span>
        </h2>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error && posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Could not load posts. Please try again in a moment.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">No posts match "{query}" yet.</p>
          <p className="text-sm">Try a different word, or browse a category from the menu above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => <ResultCard key={post._id} post={post} />)}
          </div>
          {(hasMore || error) && (
            <LoadMore shown={posts.length} total={total} loading={loadingMore} error={error} onClick={loadMore} />
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
