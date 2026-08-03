import React from 'react';
import p01 from '../images/01.webp';
import p02 from '../images/02.webp';
import p03 from '../images/03.webp';
import p04 from '../images/04.webp';
import p05 from '../images/05.webp';
import p06 from '../images/06.webp';

// Rebuilt Homepage2: these link out to real external articles, so this
// section stays static content (no backend model needed for it)
const articles = [
  { id: 1, title: 'The Healing Power of Art', author: 'Jane Doe', summary: 'Explore how art therapy can help with emotional and psychological healing.', link: 'https://www.verywellmind.com/art-therapy-4172956', image: p01 },
  { id: 2, title: 'The Ultimate Guide to Crafting', author: 'John Smith', summary: 'A comprehensive guide to various crafting techniques and their benefits.', link: 'https://www.craftsy.com/post/beginners-guide-to-crafting/', image: p02 },
  { id: 3, title: 'Capturing Moments: A Guide to Photography', author: 'Emily Johnson', summary: 'Tips and techniques for capturing stunning photographs in any situation.', link: 'https://www.photographycourse.net/beginners-guide-to-photography/', image: p03 },
  { id: 4, title: 'Gourmet Cooking for Beginners', author: 'Michael Lee', summary: 'Learn the basics of gourmet cooking with these easy-to-follow recipes.', link: 'https://www.seriouseats.com/gourmet-cooking-for-beginners', image: p04 },
  { id: 5, title: 'Gardening Tips for Urban Spaces', author: 'Sarah Davis', summary: 'How to start and maintain a thriving garden in a city apartment.', link: 'https://www.thespruce.com/urban-gardening-4127774', image: p05 },
  { id: 6, title: 'The Art of Music Performance', author: 'David Brown', summary: 'Techniques and tips for delivering a memorable music performance.', link: 'https://www.musiciansway.com/performance-tips/', image: p06 },
];

const ArticlesSection = () => (
  <section className="bg-gray-50 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Popular Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <div key={a.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src={a.image} alt={a.title} className="h-44 w-full object-cover" />
            <div className="p-5">
              <h3 className="font-semibold mb-1">{a.title}</h3>
              <p className="text-xs text-gray-400 mb-2">by {a.author}</p>
              <p className="text-sm text-gray-600 mb-3">{a.summary}</p>
              <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-600 hover:underline">
                View More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ArticlesSection;
