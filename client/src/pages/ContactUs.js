import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaPaperPlane } from 'react-icons/fa';

const ContactUs = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint for contact messages yet - this is a placeholder
    // confirmation until an /api/contact route (or an email service) exists
    setSent(true);
    e.target.reset();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
        {/* Info panel */}
        <div className="bg-gradient-to-br from-teal-600 to-brand-500 text-white p-8 sm:p-10 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Let's talk</h1>
          <p className="text-white/85 text-sm leading-relaxed mb-8">
            Question, bug report, or just want to say hi? Pick whichever feels easiest.
          </p>

          <div className="space-y-5 text-sm">
            <a href="mailto:info@shaghaf.com" className="flex items-center gap-3 hover:opacity-80">
              <FaEnvelope className="text-lg shrink-0" /> info@shaghaf.com
            </a>
            <a href="tel:+1234567890" className="flex items-center gap-3 hover:opacity-80">
              <FaPhoneAlt className="text-lg shrink-0" /> +123 456 7890
            </a>
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80">
              <FaMapMarkerAlt className="text-lg shrink-0" /> 123 Shaghaf St., Creative City
            </a>
          </div>

          <div className="flex gap-4 text-lg mt-auto pt-10">
            <a href="https://facebook.com/shaghaf" target="_blank" rel="noopener noreferrer" className="hover:opacity-80"><FaFacebook /></a>
            <a href="https://instagram.com/shaghaf" target="_blank" rel="noopener noreferrer" className="hover:opacity-80"><FaInstagram /></a>
            <a href="https://twitter.com/shaghaf" target="_blank" rel="noopener noreferrer" className="hover:opacity-80"><FaTwitter /></a>
          </div>
        </div>

        {/* Form panel */}
        <div className="bg-white p-8 sm:p-10">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                <FaPaperPlane className="text-teal-600 text-xl" />
              </div>
              <p className="font-medium mb-1">Message sent</p>
              <p className="text-sm text-gray-500">Thanks for reaching out - we'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Your name</label>
                <input type="text" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Your email</label>
                <input type="email" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Message</label>
                <textarea rows={5} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-full py-2.5 text-sm font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
