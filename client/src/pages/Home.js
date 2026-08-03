import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import ReviewsSection from '../components/ReviewsSection';
import PostsSection from '../components/PostsSection';
import PopularSection from '../components/PopularSection';
import SearchResults from './SearchResults';

const Home = () => {
  const [searchParams] = useSearchParams();

  // The navbar search box sends people to "/?search=term" - when that's
  // present, show search results instead of the normal homepage sections.
  if (searchParams.get('search')) return <SearchResults />;

  return (
    <div>
      <Hero />
      <PostsSection />
      <ReviewsSection />
      <PopularSection />
    </div>
  );
};

export default Home;
