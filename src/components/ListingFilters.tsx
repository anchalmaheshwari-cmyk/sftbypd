import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterOptions {
  search: string;
  propertyType: string[];
  bhk: string[];
  minPrice: string;
  maxPrice: string;
  location: string[];
}

interface ListingFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableLocations: string[];
}

const ListingFilters = ({ filters, onFilterChange, availableLocations }: ListingFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const propertyTypes = ['Rental', 'Purchase', 'Commercial Rental'];
  const bhkOptions = ['1', '2', '3', '4', '5+'];
  const priceRanges = [
    { label: 'Any', value: '' },
    { label: '10L', value: '1000000' },
    { label: '25L', value: '2500000' },
    { label: '50L', value: '5000000' },
    { label: '75L', value: '7500000' },
    { label: '1Cr', value: '10000000' },
    { label: '2Cr', value: '20000000' },
    { label: '5Cr', value: '50000000' },
  ];

  const handlePropertyTypeToggle = (type: string) => {
    const newTypes = filters.propertyType.includes(type)
      ? filters.propertyType.filter(t => t !== type)
      : [...filters.propertyType, type];
    onFilterChange({ ...filters, propertyType: newTypes });
  };

  const handleBhkToggle = (bhk: string) => {
    const newBhk = filters.bhk.includes(bhk)
      ? filters.bhk.filter(b => b !== bhk)
      : [...filters.bhk, bhk];
    onFilterChange({ ...filters, bhk: newBhk });
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.location.includes(location)
      ? filters.location.filter(l => l !== location)
      : [...filters.location, location];
    onFilterChange({ ...filters, location: newLocations });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: '',
      propertyType: [],
      bhk: [],
      minPrice: '',
      maxPrice: '',
      location: [],
    });
  };

  const activeFilterCount =
    filters.propertyType.length +
    filters.bhk.length +
    filters.location.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by location or keywords..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#c0c0c0] transition-colors"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-[#c0c0c0] transition-colors relative"
        >
          <SlidersHorizontal size={20} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#c0c0c0] text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#c0c0c0] hover:text-white transition-colors flex items-center space-x-1"
              >
                <X size={16} />
                <span>Clear all</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handlePropertyTypeToggle(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.propertyType.includes(type)
                      ? 'bg-[#c0c0c0] text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">BHK</label>
            <div className="flex flex-wrap gap-2">
              {bhkOptions.map((bhk) => (
                <button
                  key={bhk}
                  onClick={() => handleBhkToggle(bhk)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.bhk.includes(bhk)
                      ? 'bg-[#c0c0c0] text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {bhk} BHK
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Price Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Min Price</label>
                <select
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#c0c0c0] transition-colors"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Max Price</label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#c0c0c0] transition-colors"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {availableLocations.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Location</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {availableLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationToggle(location)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.location.includes(location)
                        ? 'bg-[#c0c0c0] text-black'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListingFilters;
