import React from 'react';
import { Link } from 'react-router-dom';

// Shown for any address that doesn't match a route (the "*" route in App.js)
const NotFound = () => (
  <div className="max-w-xl mx-auto px-4 py-24 text-center">
    <p className="text-7xl font-bold text-brand-500">404</p>
    <h1 className="text-2xl font-bold mt-4">Page not found</h1>
    <p className="text-gray-500 mt-2 mb-8">
      The page you are looking for doesn't exist, or it may have been moved.
    </p>
    <div className="flex flex-wrap justify-center gap-3">
      <Link
        to="/"
        className="bg-brand-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-brand-600 transition-colors"
      >
        Back to home
      </Link>
      <Link
        to="/members"
        className="border border-gray-200 text-gray-700 text-sm font-semibold px-6 py-2.5 rounded-full hover:border-brand-300 hover:text-brand-600 transition-colors"
      >
        Meet the members
      </Link>
    </div>
  </div>
);

export default NotFound;
