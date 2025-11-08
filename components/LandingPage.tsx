'use client';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        
        {/* Subtle geometric star shape - inspired by OpenAI style */}
        <div className="mb-12 flex justify-center">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 80 80" 
            fill="none" 
            className="opacity-90"
          >
            {/* Center circle */}
            <circle cx="40" cy="40" r="8" fill="white" opacity="0.9" />
            
            {/* Four radiating lines forming a subtle star */}
            <line x1="40" y1="8" x2="40" y2="28" stroke="white" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
            <line x1="40" y1="52" x2="40" y2="72" stroke="white" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
            <line x1="8" y1="40" x2="28" y2="40" stroke="white" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
            <line x1="52" y1="40" x2="72" y2="40" stroke="white" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
            
            {/* Diagonal lines */}
            <line x1="17" y1="17" x2="30" y2="30" stroke="white" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="63" y2="63" stroke="white" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
            <line x1="63" y1="17" x2="50" y2="30" stroke="white" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
            <line x1="30" y1="50" x2="17" y2="63" stroke="white" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Brand name - using system font stack for clean look */}
        <h1 
          className="text-8xl md:text-9xl font-extrabold mb-8 text-white tracking-tight"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
        >
          NOVA
        </h1>

        {/* Main tagline */}
        <div className="mb-12 space-y-6">
          <p className="text-3xl md:text-4xl text-white font-semibold">
            The Zero-Click CRM Platform
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Your CRM that suddenly brightens with intelligence, automatically filling itself from emails, voice, and calls using AI
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onEnter}
          className="px-14 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-20"
        >
          Try Nova
        </button>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
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