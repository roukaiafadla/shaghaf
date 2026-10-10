import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

// Links to a member's public profile at /u/<username>.
//
// - The name is underlined so it reads as a link on touch screens too.
// - `showAvatar` puts the member's round avatar (or initial) in front of the name.
// - Inside a card that is already a <Link>, a second <a> would be invalid HTML,
//   so pass `nested`: it renders a span that behaves like a link instead.
const AuthorLink = ({
  username,
  avatar = '',
  showAvatar = false,
  size = 'xs',
  nested = false,
  className = '',
  children,
}) => {
  const navigate = useNavigate();

  if (!username) return <span className={className}>{children || 'Unknown'}</span>;

  const to = `/u/${encodeURIComponent(username)}`;
  const label = children || username;
  const styles = `font-medium text-gray-600 hover:text-brand-600 transition-colors ${className}`;
  const nameStyle = 'underline decoration-gray-300 underline-offset-2';

  const body = showAvatar ? (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <Avatar username={username} avatar={avatar} size={size} />
      <span className={nameStyle}>{label}</span>
    </span>
  ) : (
    <span className={nameStyle}>{label}</span>
  );

  if (!nested) {
    return (
      <Link to={to} className={styles}>
        {body}
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
      {body}
    </span>
  );
};

export default AuthorLink;
