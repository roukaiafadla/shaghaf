import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import api from '../api/client';
import { imgUrl } from '../utils/imageUrl';
import AuthorLink from '../components/AuthorLink';
import LoadMore from '../components/LoadMore';
import usePagedPosts from '../hooks/usePagedPosts';

// Replaces category1.js...category6.js, which were 6 near-identical files
// with hardcoded placeholder text. One dynamic route + real data instead.
const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Posts load 12 at a time, with a "Load more" button
  const { posts, total, loading: postsLoading, loadingMore, error, hasMore, loadMore } = usePagedPosts({ category: slug });

  useEffect(() => {
    let cancelled = false;
    setCategoryLoading(true);
    api
      .get(`/categories/${slug}`)
      .then(({ data }) => {
        if (!cancelled) setCategory(data);
      })
      .catch(() => {
        if (!cancelled) setCategory(null);
      })
      .finally(() => {
        if (!cancelled) setCategoryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (categoryLoading) return <div className="text-center py-24 text-gray-400">Loading…</div>;
  if (!category) return <div className="text-center py-24 text-gray-400">Category not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">{category.description}</p>

      {postsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error && posts.length === 0 ? (
        <p className="text-gray-400">Could not load posts. Please try again in a moment.</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400">No posts in this category yet — be the first to share one!</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post._id} to={`/posts/${post._id}`} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {post.image ? (
                  <img src={imgUrl(post.image)} alt={post.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="h-44 w-full bg-brand-50 flex items-center justify-center text-brand-300 text-sm">No image</div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.description}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                    <span>by <AuthorLink username={post.author?.username} avatar={post.author?.avatar} showAvatar nested /></span>
                    <span className="flex gap-3">
                      <span className="flex items-center gap-1"><FaHeart /> {post.likes?.length || 0}</span>
                      <span className="flex items-center gap-1"><FaComment /> {post.comments?.length || 0}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {(hasMore || error) && (
            <LoadMore shown={posts.length} total={total} loading={loadingMore} error={error} onClick={loadMore} />
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
