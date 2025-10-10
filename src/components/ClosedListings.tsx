import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import ListingModal from './ListingModal';
import { supabase, type Listing } from '../lib/supabase';

const ClosedListings = () => {
  const [closedListings, setClosedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetchClosedListings();
  }, []);

  const fetchClosedListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'Closed')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setClosedListings(data || []);
    } catch (error) {
      console.error('Error fetching closed listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (closedListings.length === 0) {
    return null;
  }

  return (
    <section id="closed-listings" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Archived <span className="text-[#c0c0c0]">Listings</span>
          </h2>
          <div className="w-24 h-1 bg-[#c0c0c0] mx-auto mb-4"></div>
          <p className="text-gray-400">Successfully closed deals showcasing our track record</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {closedListings.map((listing) => (
            <div key={listing.id} className="flex">
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

export default ClosedListings;
