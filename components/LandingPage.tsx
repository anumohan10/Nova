'use client';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none"></div>
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Glowing orb effect behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Sparkle star icon - SAME AS DASHBOARD */}
        <div className="mb-8 relative z-10">
          <div className="text-9xl">✨</div>
        </div>

        {/* Brand name */}
        <h1 
          className="text-8xl md:text-9xl font-extrabold mb-8 text-white tracking-tight relative z-10"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
        >
          NOVA
        </h1>

        {/* Main tagline */}
        <div className="mb-12 relative z-10">
          <p className="text-3xl md:text-4xl text-white font-semibold mb-4">
            The Zero-Click CRM Platform
          </p>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your CRM that suddenly brightens with intelligence,
            <br />automatically filling itself from emails, voice, and calls using AI
          </p>
        </div>

        {/* CTA Button - Fixed z-index and pointer events */}
        <div className="relative z-20 mb-20">
          <button
            onClick={onEnter}
            className="px-16 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Try Nova
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-white font-semibold text-lg mb-2">Email Auto-Population</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Extracts contacts and deals from emails automatically
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="text-5xl mb-4">🎤</div>
            <h3 className="text-white font-semibold text-lg mb-2">Voice Intelligence</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transcribes voice notes into structured CRM data
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-white font-semibold text-lg mb-2">AI-Powered Search</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Natural language queries reveal pipeline insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}