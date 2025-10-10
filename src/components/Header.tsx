import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  scrolled: boolean;
}

const Header = ({ scrolled }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasClosedListings, setHasClosedListings] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    checkClosedListings();
  }, []);

  const checkClosedListings = async () => {
    try {
      const { count, error } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Closed');

      if (error) throw error;
      setHasClosedListings((count || 0) > 0);
    } catch (error) {
      console.error('Error checking closed listings:', error);
    }
  };

  const scrollToSection = (id: string) => {
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/SQFT_DP_2 (1) copy.jpg"
            alt="sqft by PD"
            className="h-12 w-auto object-cover"
            style={{ objectPosition: 'center', clipPath: 'inset(8% 8% 8% 8%)' }}
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {isHome && (
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-[#c0c0c0] transition-colors duration-300"
            >
              About
            </button>
          )}
          <Link
            to="/listings"
            className="bg-[#c0c0c0] text-black px-6 py-2 rounded hover:bg-[#d4d4d4] transition-all duration-300 font-semibold"
          >
            Browse Listings
          </Link>
          {isHome && (
            <>
              {hasClosedListings && (
                <button
                  onClick={() => scrollToSection('closed-listings')}
                  className="text-gray-300 hover:text-[#c0c0c0] transition-colors duration-300"
                >
                  Archived Listings
                </button>
              )}
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-300 hover:text-[#c0c0c0] transition-colors duration-300"
              >
                Contact
              </button>
            </>
          )}
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg">
          <nav className="flex flex-col space-y-4 px-6 py-6">
            {isHome && (
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-300 hover:text-[#c0c0c0] transition-colors text-left"
              >
                About
              </button>
            )}
            <Link
              to="/listings"
              className="bg-[#c0c0c0] text-black px-6 py-3 rounded hover:bg-[#d4d4d4] transition-all font-semibold text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Listings
            </Link>
            {isHome && (
              <>
                {hasClosedListings && (
                  <button
                    onClick={() => scrollToSection('closed-listings')}
                    className="text-gray-300 hover:text-[#c0c0c0] transition-colors text-left"
                  >
                    Archived Listings
                  </button>
                )}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-[#c0c0c0] transition-colors text-left"
                >
                  Contact
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
