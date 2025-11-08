'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import EmailUpload from '@/components/crm/EmailUpload';
import VoiceUpload from '@/components/crm/VoiceUpload';
import AISearch from '@/components/crm/AISearch';

type Tab = 'email' | 'voice' | 'search';

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('email');

  // Show landing page first
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // Show CRM platform after "Enter Nova"
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            ✨ Nova
          </h1>
          <p className="text-xl text-gray-700 mb-2 font-semibold">
            The Zero-Click CRM Platform
          </p>
          <p className="text-sm text-gray-600">
            Your CRM fills itself from emails, voice, and calls using AI
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'email'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📧 Email Auto-Population
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'voice'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🎤 Voice Notes
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🔍 AI Search
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'email' && <EmailUpload />}
          {activeTab === 'voice' && <VoiceUpload />}
          {activeTab === 'search' && <AISearch />}
        </div>
      </div>
    </main>
  );
}