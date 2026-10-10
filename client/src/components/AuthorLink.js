import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Links to a member's public profile at /u/<username>.
//
// Inside a card that is already a <Link>, a second <a> would be invalid HTML,
// so pass `nested` there: it renders a span that behaves like a link instead.
const AuthorLink = ({ username, nested = false, className = '', children }) => {
  const navigate = useNavigate();

  if (!username) return <span className={className}>{children || 'Unknown'}</span>;

  const to = `/u/${encodeURIComponent(username)}`;
  const label = children || username;
  const styles = `hover:text-brand-600 hover:underline underline-offset-2 transition-colors ${className}`;

  if (!nested) {
    return (
      <Link to={to} className={styles}>
        {label}
      </Link>
    );
  }

  const go = (e) => {
    e.preventDefault(); // don't also follow the card's own link
    e.stopPropagation();
    navigate(to);
  };

  return (
    <span
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === 'Enter') go(e);
      }}
      className={`cursor-pointer ${styles}`}
    >
      {label}
    </span>
  );
};

export default AuthorLink;
