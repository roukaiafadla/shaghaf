import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const groups = [
  {
    label: 'Getting started',
    items: [
      { q: 'What is Shaghaf, exactly?', a: 'A place to post about hobbies - art, cooking, photography, gardening, music, crafts - and see what other people are working on. No follower counts to chase, just posts and reactions.' },
      { q: 'Do I need to be good at something to post here?', a: "No. Half of what makes this useful is seeing other people's early attempts, not just their best work. Post the thing you're proud of and the thing that didn't quite work too." },
      { q: 'Is it free?', a: 'Yes, completely - no paid tiers, no ads deciding what you see.' },
    ],
  },
  {
    label: 'Posting & categories',
    items: [
      { q: 'How do I share something I made?', a: 'Log in, go to your profile, and use "New Post" - add a photo, a short description, and pick the category it fits best.' },
      { q: 'What categories exist right now?', a: 'Arts, Crafts, Photography, Cooking, Gardening & Plants, and Music & Performance. More may be added as the community grows.' },
      { q: 'Can I edit or delete a post after publishing it?', a: 'From your profile, open the post and you\'ll find edit and delete options there.' },
    ],
  },
  {
    label: 'Community',
    items: [
      { q: 'Can I comment on other people\'s posts?', a: 'Yes - liking and commenting are the main ways to interact. Keep it kind; it\'s someone sharing something they made.' },
      { q: 'How does the "Popular" section decide what to show?', a: 'It\'s based on real like counts from the community, recalculated live - not a fixed list, so it changes as people post and react.' },
    ],
  },
];

const FAQItem = ({ q, a, isOpen, onToggle }) => (
  <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors"
    >
      <span>{q}</span>
      <FaChevronDown className={`shrink-0 text-brand-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div
      className={`px-5 text-sm text-gray-600 leading-relaxed transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      {a}
    </div>
  </div>
);

const FAQs = () => {
  const [openKey, setOpenKey] = useState('0-0');

  return (
    <div>
      <div className="bg-gradient-to-br from-brand-500 to-teal-600 text-white py-14 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Questions, answered</h1>
        <p className="text-white/85 text-sm sm:text-base">Everything you need to know before you post your first hobby.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {groups.map((group, gi) => (
          <div key={group.label} className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-3">{group.label}</h2>
            <div className="space-y-3">
              {group.items.map((item, ii) => {
                const key = `${gi}-${ii}`;
                return (
                  <FAQItem
                    key={key}
                    q={item.q}
                    a={item.a}
                    isOpen={openKey === key}
                    onToggle={() => setOpenKey(openKey === key ? null : key)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center bg-gray-50 rounded-xl py-8 px-4 mt-4">
          <p className="text-sm text-gray-600 mb-3">Still have a question we didn't cover?</p>
          <Link
            to="/contactus"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
