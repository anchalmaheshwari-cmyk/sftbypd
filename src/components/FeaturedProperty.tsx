import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, type Listing } from '../lib/supabase';
import ListingModal from './ListingModal';

const FeaturedProperty = () => {
  const [featuredListing, setFeaturedListing] = useState<Listing | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFeaturedListing = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('featured', true)
          .eq('status', 'Available')
          .maybeSingle();

        if (error) throw error;
        setFeaturedListing(data);
      } catch (error) {
        console.error('Error fetching featured listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListing();
  }, []);

  if (loading) {
    return null;
  }

  if (!featuredListing) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % featuredListing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + featuredListing.images.length) % featuredListing.images.length);
  };

  return (
    <>
      <section id="featured" className="py-12 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#c0c0c0]">
              Featured
            </h2>
          </div>

          <div
            className="relative group cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src={featuredListing.images[currentImageIndex]}
                alt={featuredListing.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {featuredListing.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all z-10"
                  >
                    <ChevronLeft size={24} className="text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all z-10"
                  >
                    <ChevronRight size={24} className="text-white" />
                  </button>
                </>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{featuredListing.title}</h3>
                <p className="text-gray-300 text-lg">Click to view full details</p>
              </div>

              <div className="absolute bottom-8 right-8 flex space-x-2">
                {featuredListing.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-[#c0c0c0] w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && featuredListing && (
        <ListingModal
          listing={featuredListing}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default FeaturedProperty;
