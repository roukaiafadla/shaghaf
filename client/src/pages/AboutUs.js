import React, { useState, useEffect } from 'react';
import { FaPaintBrush, FaUsers, FaLightbulb, FaHeart } from 'react-icons/fa';
import api from '../api/client';

const values = [
  { icon: FaPaintBrush, title: 'Made for makers', desc: 'Whatever you make - a painting, a loaf of bread, a playlist of chord progressions - it belongs here just as much as "serious" art does.' },
  { icon: FaUsers, title: 'Small, not viral', desc: "No algorithm chasing engagement. Just people who post what they're working on and other people who actually look at it." },
  { icon: FaLightbulb, title: 'Progress over polish', desc: "Half-finished projects and first attempts are welcome. You don't need to be good at something to post about learning it." },
];

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 text-center">
    <Icon className="text-teal-500 text-xl mx-auto mb-2" />
    <p className="text-2xl font-bold text-gray-900">{value ?? '\u2014'}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

const AboutUs = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-br from-teal-600 to-brand-500 text-white py-16 px-4 sm:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">A place for what you're into</h1>
        <p className="text-white/90 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Shaghaf started from a simple frustration: most social apps reward whoever posts the most
          polished thing. We wanted a smaller space for hobbies - art, food, plants, music, crafts,
          photography - where sharing something you're still learning feels normal, not risky.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          <StatCard label="Members" value={stats?.users} icon={FaUsers} />
          <StatCard label="Posts shared" value={stats?.posts} icon={FaPaintBrush} />
          <StatCard label="Categories" value={stats?.categories} icon={FaLightbulb} />
          <StatCard label="Likes given" value={stats?.likes} icon={FaHeart} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-100 transition-colors">
                <Icon className="text-xl text-brand-500" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
