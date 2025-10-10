import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90"></div>

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(192,192,192,0.08)" strokeWidth="0.5"/>
          </pattern>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(192,192,192,0.15)" />
            <stop offset="100%" stopColor="rgba(192,192,192,0)" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        <circle cx="15%" cy="20%" r="300" fill="url(#glowGradient)" opacity="0.3" />
        <circle cx="85%" cy="75%" r="250" fill="url(#glowGradient)" opacity="0.25" />

        <polygon points="10,10 150,50 100,150" fill="none" stroke="rgba(192,192,192,0.1)" strokeWidth="1" className="animate-pulse" />
        <polygon points="90%,15% 95%,25% 85%,30%" fill="none" stroke="rgba(192,192,192,0.12)" strokeWidth="1" transform="scale(80)" />
      </svg>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <p className="text-4xl md:text-5xl text-gray-400 mb-6 font-light tracking-wide">
            Chennai based high-end Real Estate Agent
          </p>
          <h1 className="text-xl md:text-2xl font-bold mb-12 leading-tight text-[#c0c0c0]">
            Plan <span className="text-white">your next big move</span> with me
          </h1>
          <Link
            to="/listings"
            className="inline-block bg-[#c0c0c0] text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#d4d4d4] transition-all duration-300 hover:scale-105 transform"
          >
            Browse Listings
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-[#c0c0c0]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
