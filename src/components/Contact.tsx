import { MessageCircle, Clock, Phone } from 'lucide-react';

const Contact = () => {
  const whatsappLink = "https://wa.me/918939929919?text=Hi%20PD%2C%20I'm%20interested%20in%20one%20of%20your%20listings.%20Can%20we%20get%20in%20touch%3F";
  const phoneNumber = "+918939929919";

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Talk <span className="text-[#c0c0c0]">sqft</span>
          </h2>
          <div className="w-24 h-1 bg-[#c0c0c0] mx-auto mb-10"></div>

          <p className="text-lg text-gray-300 mb-10">
            Ready to find your dream property? Let's start the conversation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`tel:${phoneNumber}`}
              className="inline-flex items-center space-x-3 bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 transform"
            >
              <Phone size={24} />
              <span>Call Now</span>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-[#25D366] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#20ba5a] transition-all duration-300 hover:scale-105 transform"
            >
              <MessageCircle size={24} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-2 text-gray-400">
            <Clock size={18} />
            <p className="text-sm">Available 7 days a week for property tours and consultations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
