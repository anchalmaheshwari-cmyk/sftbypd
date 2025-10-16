import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import ListingModal from './ListingModal';
import { supabase, type Listing } from '../lib/supabase';

interface ActiveListingsProps {
  highlightedListingId?: number | null;
}

const ActiveListings = ({ highlightedListingId }: ActiveListingsProps) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'Available')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="listings" className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Currently <span className="text-[#c0c0c0]">Listed</span>
            </h2>
            <div className="w-24 h-1 bg-[#c0c0c0] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 animate-pulse">
                <div className="w-full h-64 bg-gray-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="listings" className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Currently <span className="text-[#c0c0c0]">Listed</span>
          </h2>
          <div className="w-24 h-1 bg-[#c0c0c0] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {listings.map((listing) => (
            <div
              key={listing.id}
              id={`listing-${listing.id}`}
              className={`flex ${highlightedListingId === listing.id ? 'animate-pulse-border' : ''}`}
            >
              <PropertyCard
                listing={listing}
                onClick={() => setSelectedListing(listing)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </section>
  );
};

export default ActiveListings;
