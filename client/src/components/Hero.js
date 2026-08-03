import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPalette, FaCamera, FaUtensils, FaSeedling, FaMusic } from 'react-icons/fa';
import bg1 from '../images/1.webp';
import bg2 from '../images/2.webp';
import bg3 from '../images/3.webp';
import bg4 from '../images/4.webp';
import bg5 from '../images/5.webp';
import bg6 from '../images/6.webp';

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];

const chips = [
  { icon: FaPalette, label: 'Arts', slug: 'arts' },
  { icon: FaCamera, label: 'Photography', slug: 'photography' },
  { icon: FaUtensils, label: 'Cooking', slug: 'cooking' },
  { icon: FaSeedling, label: 'Gardening', slug: 'gardening-plants' },
  { icon: FaMusic, label: 'Music', slug: 'music-performance' },
];

// Rebuilt Homepage1: same rotating-background hero, now responsive, using
// compressed WebP images, and with a livelier two-tone gradient + floating
// category chips instead of a flat dark overlay
const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % backgrounds.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-[70vh] min-h-[440px] w-full overflow-hidden">
      {backgrounds.map((bg, i) => (
        <div
          key={bg}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${bg})`, opacity: i === index ? 1 : 0 }}
        />
      ))}
      {/* Plain dark overlay for text legibility - no color tint over the photos */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Welcome to <span className="text-brand-400">Shaghaf</span>
        </h1>
        <p className="text-white/90 text-base sm:text-lg max-w-xl mb-2">
          Your one-stop destination for exploring and discovering new hobbies.
        </p>
        <p className="text-white/70 text-sm sm:text-base max-w-2xl mb-8">
          Whether you're an aspiring artist, a culinary enthusiast, or simply looking to explore
          new interests, dive into our diverse range of categories and find something that sparks
          your curiosity.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {chips.map(({ icon: Icon, label, slug }) => (
            <Link
              key={slug}
              to={`/category/${slug}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-brand-600 border border-white/30 hover:border-white backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              <Icon className="text-white/80" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5">
        {backgrounds.map((bg, i) => (
          <button
            key={bg}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-8 bg-brand-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
