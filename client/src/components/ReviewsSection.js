import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const loadReviews = () => {
    api.get('/reviews').then(({ data }) => setReviews(data)).finally(() => setLoading(false));
  };

  useEffect(loadReviews, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', { text, rating });
      setText('');
      setRating(5);
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit your review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">What Our Users Are Saying</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-400">No reviews yet — be the first to share one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r._id} className="bg-gray-50 hover:bg-white rounded-xl p-6 flex flex-col gap-3 border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300">
              <FaQuoteLeft className="text-teal-400 text-xl" />
              <p className="text-gray-700 text-sm leading-relaxed">{r.text}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="font-medium text-sm">{r.reviewer?.username || 'Anonymous'}</span>
                <div className="flex text-gold-500">
                  {Array.from({ length: r.rating }).map((_, i) => <FaStar key={i} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <p className="font-medium mb-3">Leave a review</p>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)}>
                <FaStar className={n <= rating ? 'text-brand-400' : 'text-gray-300'} />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience…"
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 px-5 py-2 bg-brand-500 text-white rounded-full text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <p className="text-center text-sm text-gray-400 mt-8">
          <a href="/login" className="text-brand-600 underline">Log in</a> to leave a review.
        </p>
      )}
    </section>
  );
};

export default ReviewsSection;
