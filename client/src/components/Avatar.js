import React from 'react';
import { imgUrl } from '../utils/imageUrl';

const SIZES = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
};

// Round avatar: the member's photo, or their initial on a soft brand background.
const Avatar = ({ username = '', avatar = '', size = 'sm', className = '' }) => {
  const box = `${SIZES[size] || SIZES.sm} shrink-0 rounded-full ${className}`;

  if (avatar) {
    return <img src={imgUrl(avatar)} alt="" className={`${box} object-cover`} />;
  }

  return (
    <span
      aria-hidden="true"
      className={`${box} inline-flex items-center justify-center bg-brand-100 text-brand-600 font-semibold uppercase`}
    >
      {username.charAt(0) || '?'}
    </span>
  );
};

export default Avatar;
