import { useState } from 'react';
import { MapPin, Home, Maximize, ChevronLeft, ChevronRight, MessageCircle, CheckCircle, Share2, Link as LinkIcon, X, Phone } from 'lucide-react';

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
}

interface PropertyCardProps {
  listing: Listing;
  onClick?: () => void;
}

const PropertyCard = ({ listing, onClick }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const isAvailable = listing.status === 'Available';
  const phoneNumber = '918939929919';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=Hi%20PD%2C%20I'm%20interested%20in%20${encodeURIComponent(listing.title)}.%20Can%20we%20get%20in%20touch%3F`;
  const callLink = `tel:+${phoneNumber}`;

  const listingUrl = `${window.location.origin}?listing=${listing.id}`;
  const shareText = `${listing.title}\n\nListed by sqft by PD\n${listingUrl}`;

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

  const getPropertyTypeDisplay = (type: string) => {
    switch (type) {
      case 'Rental':
        return 'To Rent';
      case 'Purchase':
        return 'For Sale';
      case 'Commercial Rental':
        return 'Commercial Rental';
      default:
        return type;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(listingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(listing.title)}&body=${encodeURIComponent(shareText)}`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-gray-800/50 rounded-lg overflow-hidden backdrop-blur-sm border border-gray-700 hover:border-[#c0c0c0] transition-all duration-300 cursor-pointer flex flex-col h-full ${!isAvailable && 'opacity-60'}`}
    >
      <div className="relative group">
        <img
          src={listing.images[currentImageIndex]}
          alt={listing.title}
          className="w-full h-64 object-cover"
        />

        {listing.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPropertyTypeColor(listing.property_type)}`}>
            {getPropertyTypeDisplay(listing.property_type)}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareClick}
              className="bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
              title="Share listing"
            >
              <Share2 size={18} className="text-white" />
            </button>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAvailable ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
              {listing.status}
            </span>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {listing.images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-[#c0c0c0] w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-base font-bold mb-2 line-clamp-2">{listing.title}</h3>
        <p className="text-xl font-bold text-[#c0c0c0] mb-3">{listing.price}</p>

        <div className="flex items-center space-x-3 mb-3 text-xs text-gray-300">
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          {listing.property_type !== 'Commercial Rental' && (
            <div className="flex items-center">
              <Home size={14} className="mr-1" />
              {listing.bhk} BHK
            </div>
          )}
          <div className="flex items-center">
            <Maximize size={14} className="mr-1" />
            {listing.property_type === 'Commercial Rental' ? listing.size : `${listing.size} sqft`}
          </div>
        </div>

        <div className="mb-3">
          <h4 className="text-xs font-semibold text-[#c0c0c0] mb-1.5">Key Highlights</h4>
          <ul className="grid grid-cols-2 gap-1.5 text-xs text-gray-300">
            {listing.highlights.slice(0, 6).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle size={12} className="mr-1 mt-0.5 text-[#c0c0c0] flex-shrink-0" />
                <span className="line-clamp-1">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-3 flex-1">
          <h4 className="text-xs font-semibold text-[#c0c0c0] mb-1.5">Amenities</h4>
          <ul className="grid grid-cols-2 gap-1.5 text-xs text-gray-300">
            {listing.amenities.map((amenity, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span className="line-clamp-1">{amenity}</span>
              </li>
            ))}
          </ul>
        </div>

        {isAvailable && (
          <div className="flex gap-3 mt-auto">
            <a
              href={callLink}
              className="flex-1 bg-[#c0c0c0] text-black py-3 rounded-lg font-semibold hover:bg-[#a8a8a8] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Phone size={20} />
              <span>Call</span>
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white py-3 rounded-lg font-semibold hover:bg-[#20ba5a] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
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
  );
};

export default PropertyCard;
