import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import api from '../api/client';

const PostCard = ({ post }) => (
  <Link
    to={`/posts/${post._id}`}
    className="group shrink-0 w-64 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="h-40 w-full overflow-hidden">
      {post.image ? (
        <img
          src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${post.image}`}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-teal-50 to-brand-50 flex items-center justify-center text-brand-300 text-sm">No image</div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-sm truncate group-hover:text-brand-600 transition-colors">{post.title}</h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description}</p>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
        <span>by {post.author?.username || 'Unknown'}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 group-hover:text-brand-500 transition-colors"><FaHeart /> {post.likes?.length || 0}</span>
          <span className="flex items-center gap-1"><FaComment /> {post.comments?.length || 0}</span>
        </span>
      </div>
    </div>
  </Link>
);

const CategoryRow = ({ category, posts }) => (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-4">
      <Link to={`/category/${category.slug}`} className="flex items-center gap-3 group">
        <span className="w-1.5 h-6 rounded-full bg-teal-500" />
        <span className="text-xl font-semibold group-hover:text-brand-600 transition-colors">{category.name}</span>
      </Link>
      <Link to={`/category/${category.slug}`} className="flex items-center gap-1 text-sm text-brand-600 font-medium hover:gap-2 transition-all">
        See more →
      </Link>
    </div>
    {posts.length === 0 ? (
      <p className="text-sm text-gray-400">No posts in this category yet.</p>
    ) : (
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    )}
  </div>
);

// Rebuilt PostsSection: fetches real categories + posts from the API instead
// of six hardcoded copies of the same sample array
const PostsSection = () => {
  const [categories, setCategories] = useState([]);
  const [postsByCategory, setPostsByCategory] = useState({});

  useEffect(() => {
    api.get('/categories').then(async ({ data: cats }) => {
      setCategories(cats);
      const entries = await Promise.all(
        cats.map(async (cat) => {
          const { data } = await api.get(`/posts?category=${cat.slug}`);
          return [cat.slug, data.slice(0, 6)];
        })
      );
      setPostsByCategory(Object.fromEntries(entries));
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {categories.map((cat) => (
        <CategoryRow key={cat._id} category={cat} posts={postsByCategory[cat.slug] || []} />
      ))}
    </section>
  );
};

export default PostsSection;
