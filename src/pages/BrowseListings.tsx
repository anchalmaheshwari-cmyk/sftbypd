import { useState } from 'react';
import Header from '../components/Header';
import ActiveListings from '../components/ActiveListings';
import Footer from '../components/Footer';

const BrowseListings = () => {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header scrolled={scrolled} />
      <div className="pt-24">
        <ActiveListings />
      </div>
      <Footer />
    </div>
  );
};

export default BrowseListings;
