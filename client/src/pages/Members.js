import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import MemberCard from '../components/MemberCard';

// Members directory: browse everyone, or search by username or bio.
const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('search') || '');
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    // Wait a moment after typing stops so we don't query on every keystroke
    const timer = setTimeout(
      () => {
        api
          .get('/users', { params: { search: term.trim() || undefined, limit: 48 } })
          .then(({ data }) => {
            if (cancelled) return;
            setMembers(data);
            setStatus('ready');
          })
          .catch(() => {
            if (!cancelled) setStatus('error');
          });
      },
      term ? 300 : 0
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    setSearchParams(value.trim() ? { search: value } : {}, { replace: true });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-2xl font-bold">Members</h1>
      <p className="text-gray-500 mt-1 mb-6">Meet the people sharing their passions on Shaghaf.</p>

      <div className="relative max-w-md mb-8">
        <input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder="Search by name or bio…"
          aria-label="Search members"
          className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <p className="text-center py-16 text-gray-400">Could not load members. Please try again in a moment.</p>
      )}

      {status === 'ready' && members.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">{term.trim() ? `No members match "${term.trim()}".` : 'No members yet.'}</p>
          {term.trim() && <p className="text-sm">Try a different name or a word from their bio.</p>}
        </div>
      )}

      {status === 'ready' && members.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-4">
            {members.length} {members.length === 1 ? 'member' : 'members'}
            {term.trim() ? ` matching "${term.trim()}"` : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <MemberCard key={m._id} member={m} isYou={user?.username === m.username} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Members;
