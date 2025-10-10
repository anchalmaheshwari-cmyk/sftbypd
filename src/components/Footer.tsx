import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center">
            <img
              src="/SQFT_DP_2 (1) copy.jpg"
              alt="sqft by PD"
              className="h-12 w-auto object-cover"
              style={{ objectPosition: 'center', clipPath: 'inset(8% 8% 8% 8%)' }}
            />
          </div>

          <a
            href="https://instagram.com/sqftbypd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-400 hover:text-[#c0c0c0] transition-colors duration-300"
          >
            <Instagram size={20} />
            <span>@sqftbypd</span>
          </a>

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Sqft by PD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
