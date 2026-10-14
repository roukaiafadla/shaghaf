import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

// One member in the directory and in search results. Links to their public page
// (your own card leads to /profile, because /u/<you> redirects there).
const MemberCard = ({ member, isYou = false }) => (
  <Link
    to={`/u/${encodeURIComponent(member.username)}`}
    className="group flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
  >
    <Avatar username={member.username} avatar={member.avatar} size="lg" />
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold truncate group-hover:text-brand-600 transition-colors">{member.username}</h3>
        {isYou && (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide bg-teal-50 text-teal-700 rounded-full px-2 py-0.5">
            You
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 line-clamp-1">{member.bio || 'No bio yet.'}</p>
      <p className="text-xs text-gray-400 mt-1">
        {member.postCount} {member.postCount === 1 ? 'post' : 'posts'}
      </p>
    </div>
  </Link>
);

export default MemberCard;
