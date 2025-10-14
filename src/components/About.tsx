const About = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          About <span className="text-[#c0c0c0]">Sqft by PD</span>
        </h2>
        <div className="w-24 h-1 bg-[#c0c0c0] mx-auto mb-12"></div>
        <div className="space-y-5 text-base text-gray-300 leading-relaxed">
          <p>
            I'm PD — a Chennai-based real estate advisor who found his passion by accident. While searching for a rental years ago, I realized how much of a grind the process could be — so I decided to change that.
          </p>
          <p>
            At Sqft by PD, I believe real estate should feel less like a hunt and more like a handpicked experience. Whether you're upgrading, downsizing, or chasing that "I'll know it when I see it" space, I'm here to make your next big move feel like a done deal.
          </p>
          <p>
            Because in my world, it's not just about square feet — it's about the right fit. Every interaction is private, curated, and built on trust.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
