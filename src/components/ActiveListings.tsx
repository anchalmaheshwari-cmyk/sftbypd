import { useState, useEffect, useMemo } from 'react';
import PropertyCard from './PropertyCard';
import ListingModal from './ListingModal';
import ListingFilters, { type FilterOptions } from './ListingFilters';
import { supabase, type Listing } from '../lib/supabase';
import { ArrowUpDown } from 'lucide-react';

interface ActiveListingsProps {
  highlightedListingId?: number | null;
}

const ActiveListings = ({ highlightedListingId }: ActiveListingsProps) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'newest'>('default');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    propertyType: [],
    bhk: [],
    minPrice: '',
    maxPrice: '',
    location: [],
  });

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

  const extractPrice = (priceStr: string): number => {
    const cleanPrice = priceStr.replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice);

    if (priceStr.toLowerCase().includes('cr')) {
      return price * 10000000;
    } else if (priceStr.toLowerCase().includes('l')) {
      return price * 100000;
    } else if (priceStr.toLowerCase().includes('k')) {
      return price * 1000;
    }
    return price;
  };

  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    listings.forEach((listing) => {
      if (listing.neighborhood) {
        locations.add(listing.neighborhood);
      }
    });
    return Array.from(locations).sort();
  }, [listings]);

  const filteredAndSortedListings = useMemo(() => {
    let filtered = [...listings];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchLower) ||
          listing.location.toLowerCase().includes(searchLower) ||
          (listing.neighborhood && listing.neighborhood.toLowerCase().includes(searchLower)) ||
          listing.highlights.some((h) => h.toLowerCase().includes(searchLower)) ||
          listing.amenities.some((a) => a.toLowerCase().includes(searchLower))
      );
    }

    if (filters.propertyType.length > 0) {
      filtered = filtered.filter((listing) =>
        filters.propertyType.includes(listing.property_type)
      );
    }

    if (filters.bhk.length > 0) {
      filtered = filtered.filter((listing) => {
        const listingBhk = listing.bhk.toString();
        return filters.bhk.some((bhk) => {
          if (bhk === '5+') {
            return parseInt(listingBhk) >= 5;
          }
          return listingBhk === bhk;
        });
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter((listing) => {
        const listingPrice = extractPrice(listing.price);
        const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
        const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
        return listingPrice >= minPrice && listingPrice <= maxPrice;
      });
    }

    if (filters.location.length > 0) {
      filtered = filtered.filter((listing) =>
        listing.neighborhood && filters.location.includes(listing.neighborhood)
      );
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [listings, filters, sortBy]);

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
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Currently <span className="text-[#c0c0c0]">Listed</span>
          </h2>
          <div className="w-24 h-1 bg-[#c0c0c0] mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <ListingFilters
              filters={filters}
              onFilterChange={setFilters}
              availableLocations={availableLocations}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">
                {filteredAndSortedListings.length} {filteredAndSortedListings.length === 1 ? 'property' : 'properties'} found
              </p>
              <div className="flex items-center space-x-2">
                <ArrowUpDown size={18} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c0c0c0] transition-colors"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {filteredAndSortedListings.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No properties match your filters.</p>
                <button
                  onClick={() => setFilters({
                    search: '',
                    propertyType: [],
                    bhk: [],
                    minPrice: '',
                    maxPrice: '',
                    location: [],
                  })}
                  className="mt-4 text-[#c0c0c0] hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                {filteredAndSortedListings.map((listing) => (
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
            )}
          </div>
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
