import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedProperty from '../components/FeaturedProperty';
import ActiveListings from '../components/ActiveListings';
import ClosedListings from '../components/ClosedListings';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ListingModal from '../components/ListingModal';
import { supabase, type Listing } from '../lib/supabase';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [highlightedListingId, setHighlightedListingId] = useState<number | null>(null);
  const [sharedListing, setSharedListing] = useState<Listing | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get('listing');
    if (listingId) {
      setHighlightedListingId(parseInt(listingId));

      const fetchAndShowListing = async () => {
        try {
          const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('id', listingId)
            .maybeSingle();

          if (error) throw error;
          if (data) {
            setSharedListing(data);
            document.title = `${data.title} | sqft by PD`;
          }
        } catch (error) {
          console.error('Error fetching listing:', error);
        }
      };

      fetchAndShowListing();
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header scrolled={scrolled} />
      <div className="flex items-center justify-center pt-32 pb-2">
        <img
          src="/SQFT_DP_2 (1) copy.jpg"
          alt="sqft by PD"
          className="w-64 h-auto object-cover"
          style={{ objectPosition: 'center', clipPath: 'inset(8% 8% 8% 8%)' }}
        />
      </div>
      <Hero />
      <FeaturedProperty />
      <ActiveListings highlightedListingId={highlightedListingId} />
      <ClosedListings />
      <About />
      <Contact />
      <Footer />

      {sharedListing && (
        <ListingModal
          listing={sharedListing}
          onClose={() => {
            setSharedListing(null);
            window.history.pushState({}, '', window.location.pathname);
          }}
        />
      )}
    </div>
  );
};

export default Home;
