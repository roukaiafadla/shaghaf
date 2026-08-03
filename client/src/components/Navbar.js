import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/?search=${encodeURIComponent(searchValue.trim())}`);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-teal-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Shaghaf logo" className="h-14 w-auto" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/90">
            <li className="relative group">
              <button className="flex items-center gap-1 py-2 hover:text-gold-300 transition-colors">Categories</button>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white shadow-lg rounded-md py-2 w-56 border border-gray-100">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    className="px-4 py-2 text-gray-700 hover:bg-brand-50 hover:text-brand-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </li>
            <li><Link to="/about-us" className="hover:text-gold-300 transition-colors">About Us</Link></li>
            <li><Link to="/faqs" className="hover:text-gold-300 transition-colors">FAQs</Link></li>
            <li><Link to="/contactus" className="hover:text-gold-300 transition-colors">Contact Us</Link></li>
          </ul>

          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xs mx-6">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search activities…"
                className="w-full rounded-full border border-transparent bg-white py-2 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
                  <FaUserCircle className="text-xl" /> {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium rounded-full border border-white/40 text-white hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm font-medium rounded-full border-2 border-white text-white hover:bg-brand-500 hover:border-brand-500 transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden text-2xl text-white" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/20 px-4 pb-4 space-y-3">
          <form onSubmit={handleSearch} className="pt-3">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search activities…"
              className="w-full rounded-full border border-transparent bg-white py-2 px-4 text-sm"
            />
          </form>
          <div>
            <p className="text-xs uppercase text-white/60 font-semibold mt-3 mb-1">Categories</p>
            <div className="flex flex-col">
              {categories.map((cat) => (
                <Link key={cat._id} to={`/category/${cat.slug}`} className="py-2 text-white/90 hover:text-gold-300" onClick={() => setMenuOpen(false)}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/about-us" className="block py-2 text-white/90 hover:text-gold-300" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/faqs" className="block py-2 text-white/90 hover:text-gold-300" onClick={() => setMenuOpen(false)}>FAQs</Link>
          <Link to="/contactus" className="block py-2 text-white/90 hover:text-gold-300" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                <Link to="/profile" className="flex-1 text-center px-4 py-2 rounded-full border border-white/40 text-white" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="flex-1 px-4 py-2 rounded-full border border-white/40 text-white">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex-1 text-center px-4 py-2 rounded-full border-2 border-white text-white" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="flex-1 text-center px-4 py-2 rounded-full bg-brand-500 text-white" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
