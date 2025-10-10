import { Sparkles, Award, TrendingUp, Shield } from 'lucide-react';

export default function ThemeSample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Silver, White, Teal & <span className="text-amber-500">Gold</span>
          </h1>
          <p className="text-xl text-gray-600">A sophisticated color palette</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="w-16 h-16 bg-teal-500 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Premium Service</h3>
            <p className="text-gray-600 mb-4">
              Experience excellence with our teal-accented premium offerings designed for discerning clients.
            </p>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-500">
            <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Gold Membership</h3>
            <p className="text-gray-600 mb-4">
              Unlock exclusive benefits with our gold-tier membership program and elevate your experience.
            </p>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-xl p-12 text-white mb-12">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Ready to Get Started?</h2>
              <p className="text-teal-100 text-lg">Join thousands of satisfied customers today</p>
            </div>
            <button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-teal-500">
            <TrendingUp className="w-10 h-10 text-teal-500 mb-3" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Growth Focused</h4>
            <p className="text-gray-600">Teal represents progress and innovation</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-amber-500">
            <Sparkles className="w-10 h-10 text-amber-500 mb-3" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Premium Quality</h4>
            <p className="text-gray-600">Gold accents convey luxury and value</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-gray-400">
            <Shield className="w-10 h-10 text-gray-500 mb-3" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Reliable & Secure</h4>
            <p className="text-gray-600">Silver provides stability and trust</p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-full h-24 bg-white border-2 border-gray-300 rounded-lg mb-3"></div>
              <p className="font-semibold text-gray-800">White</p>
              <p className="text-sm text-gray-500">#FFFFFF</p>
            </div>
            <div className="text-center">
              <div className="w-full h-24 bg-gray-400 rounded-lg mb-3"></div>
              <p className="font-semibold text-gray-800">Silver</p>
              <p className="text-sm text-gray-500">#9CA3AF</p>
            </div>
            <div className="text-center">
              <div className="w-full h-24 bg-teal-500 rounded-lg mb-3"></div>
              <p className="font-semibold text-gray-800">Teal</p>
              <p className="text-sm text-gray-500">#14B8A6</p>
            </div>
            <div className="text-center">
              <div className="w-full h-24 bg-amber-500 rounded-lg mb-3"></div>
              <p className="font-semibold text-gray-800">Gold</p>
              <p className="text-sm text-gray-500">#F59E0B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
