import { useState } from 'react';
import { X, MapPin, Home, Maximize, ChevronLeft, ChevronRight, MessageCircle, CheckCircle, Share2, Link as LinkIcon } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  price: string;
  location: string;
  size: string;
  bhk: string;
  highlights: string[];
  amenities: string[];
  status: string;
  property_type: string;
  images: string[];
  neighborhood?: string | null;
}

interface ListingModalProps {
  listing: Listing;
  onClose: () => void;
}

const ListingModal = ({ listing, onClose }: ListingModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const isAvailable = listing.status === 'Available';
  const whatsappLink = `https://wa.me/918939929919?text=Hi%20PD%2C%20I'm%20interested%20in%20${encodeURIComponent(listing.title)}.%20Can%20we%20get%20in%20touch%3F`;

  const listingUrl = `${window.location.origin}?listing=${listing.id}`;
  const shareText = `Check out this property: ${listing.title} - ${listing.price}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(listingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + listingUrl)}`, '_blank');
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(listing.title)}&body=${encodeURIComponent(shareText + '\n\n' + listingUrl)}`;
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'Rental':
        return 'bg-blue-500';
      case 'Purchase':
        return 'bg-[#c0c0c0] text-black';
      case 'Commercial Rental':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-gray-900 rounded-lg max-w-5xl w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="relative">
            <div className="relative h-96 group">
              <img
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-96 object-contain bg-black rounded-t-lg"
              />

              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all"
                  >
                    <ChevronLeft size={24} className="text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all"
                  >
                    <ChevronRight size={24} className="text-white" />
                  </button>
                </>
              )}

              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPropertyTypeColor(listing.property_type)}`}>
                  {listing.property_type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAvailable ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {listing.status}
                </span>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {listing.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-[#c0c0c0] w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{listing.title}</h2>
                  <p className="text-4xl font-bold text-[#c0c0c0]">{listing.price}</p>
                </div>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all"
                  title="Share listing"
                >
                  <Share2 size={24} className="text-white" />
                </button>
              </div>

              <div className="flex items-center space-x-6 mb-8 text-gray-300">
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <Home size={20} className="mr-2" />
                  {listing.bhk} BHK
                </div>
                <div className="flex items-center">
                  <Maximize size={20} className="mr-2" />
                  {listing.size} sqft
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-[#c0c0c0] mb-4">Key Highlights</h3>
                  <ul className="space-y-2 text-gray-300">
                    {listing.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={18} className="mr-2 mt-0.5 text-[#c0c0c0] flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#c0c0c0] mb-4">Amenities</h3>
                  <ul className="space-y-2 text-gray-300">
                    {listing.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {listing.neighborhood && (
                <div className="mb-8 bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[#c0c0c0] mb-4">Neighborhood</h3>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">{listing.neighborhood}</p>
                </div>
              )}

              {isAvailable && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-4 rounded-lg font-semibold hover:bg-[#20ba5a] transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={24} />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {showShareModal && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg p-4" onClick={() => setShowShareModal(false)}>
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Share Listing</h3>
                  <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <p className="text-gray-300 mb-6 text-sm">{listing.title}</p>

                <div className="space-y-3">
                  <button
                    onClick={copyToClipboard}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <LinkIcon size={20} />
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={shareViaWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={20} />
                    <span>Share via WhatsApp</span>
                  </button>

                  <button
                    onClick={shareViaEmail}
                    className="w-full bg-[#c0c0c0] hover:bg-[#d4d4d4] text-black py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <span>Share via Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
