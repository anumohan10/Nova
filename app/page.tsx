'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import EmailUpload from '@/components/crm/EmailUpload';
import VoiceUpload from '@/components/crm/VoiceUpload';
import AISearch from '@/components/crm/AISearch';
import Dashboard from '@/components/crm/Dashboard';

type Tab = 'dashboard' | 'email' | 'voice' | 'search';

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Show landing page first
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // Show CRM platform after "Try Nova"
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

        {/* Tab Navigation - 4 Tabs */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📊 Insights
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'email'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📧 Email
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'voice'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🎤 Voice
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'email' && <EmailUpload />}
          {activeTab === 'voice' && <VoiceUpload />}
          {activeTab === 'search' && <AISearch />}
        </div>
      </div>
    </main>
  );
}