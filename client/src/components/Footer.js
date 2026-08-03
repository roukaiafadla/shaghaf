import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import logo from '../images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <img src={logo} alt="Shaghaf logo" className="w-32 mb-4" />
          <p className="text-sm leading-relaxed text-gray-400">
            Shaghaf is your go-to platform for discovering and exploring new hobbies — art,
            photography, cooking and more, all in one community.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about-us" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contactus" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/faqs" className="hover:text-white">FAQs</Link></li>
            <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">Contact Us</h2>
          <p className="text-sm mb-2">
            Email: <a href="mailto:contact@shaghaf.com" className="hover:text-white">contact@shaghaf.com</a>
          </p>
          <p className="text-sm mb-4">Phone: 0612345678</p>
          <div className="flex gap-4 text-xl">
            <a href="https://facebook.com/shaghaf" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400"><FaFacebook /></a>
            <a href="https://twitter.com/shaghaf" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400"><FaTwitter /></a>
            <a href="https://instagram.com/shaghaf" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Shaghaf. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
