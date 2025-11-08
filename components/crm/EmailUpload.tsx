'use client';

import { useState } from 'react';

interface CRMData {
  contact: {
    name: string;
    company: string;
    email: string;
    phone: string;
    role: string;
  };
  deal: {
    stage: string;
    value: number | null;
    products: string[];
  };
  interaction: {
    summary: string;
    action_items: string[];
    next_steps: string[];
    follow_up_date: string;
    sentiment: string;
  };
}

export default function EmailUpload() {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CRMData | null>(null);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!emailText.trim()) {
      setError('Please enter an email');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/extract-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailText }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to extract data');
      }
    } catch (err) {
      setError('API not ready yet. Anusree is working on it!');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setEmailText(`From: john.smith@acme.com
To: sales@nova.com
Subject: Following up on enterprise demo

Hi there,

Thanks for the demo yesterday. Our team at Acme Corp is really impressed with your enterprise features. We're looking at a potential deal around $50,000 for 50 seats.

Can you send over a proposal by Friday? We'd like to move quickly on this. Let's also schedule a technical deep-dive for next week with our CTO.

Best,
John Smith
CTO, Acme Corp
john.smith@acme.com
555-0123`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          ✨ Email Auto-Population
        </h2>
        <p className="text-gray-600">Paste an email and watch Nova auto-fill your CRM using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Input */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700">
              📧 Email Content
            </label>
            <button
              onClick={loadSample}
              className="text-sm text-indigo-600 hover:text-purple-600 font-medium transition-colors"
            >
              Load Sample Email
            </button>
          </div>
          
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste email content here..."
            className="w-full h-96 p-4 border-2 border-indigo-200 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white shadow-sm text-gray-800 placeholder:text-gray-400"
          />
          
          <button
            onClick={handleExtract}
            disabled={loading || !emailText.trim()}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Extracting with Gemini AI...
              </span>
            ) : (
              '🚀 Extract to CRM'
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Right Side - Results */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            ✅ Extracted CRM Data
          </label>

          {result ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Contact Card */}
              <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {result.contact.name || 'No name found'}
                    </h3>
                    <p className="text-lg text-gray-600">{result.contact.company || 'No company'}</p>
                    {result.contact.role && (
                      <p className="text-sm text-indigo-600 font-medium mt-1">{result.contact.role}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      result.deal.stage === 'negotiation' ? 'bg-amber-100 text-amber-800' :
                      result.deal.stage === 'qualified' ? 'bg-emerald-100 text-emerald-800' :
                      result.deal.stage === 'prospect' ? 'bg-blue-100 text-blue-800' :
                      result.deal.stage === 'closed-won' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.deal.stage}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-indigo-50 pt-4">
                  {result.contact.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-500">📧</span>
                      <span className="text-gray-700">{result.contact.email}</span>
                    </div>
                  )}
                  {result.contact.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-500">📞</span>
                      <span className="text-gray-700">{result.contact.phone}</span>
                    </div>
                  )}
                  {result.deal.value && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-500">💰</span>
                      <span className="font-bold text-purple-600 text-lg">
                        ${result.deal.value.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Interaction Details */}
              <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all">
                <h4 className="font-bold text-lg mb-3 text-indigo-700">📝 Interaction Summary</h4>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {result.interaction.summary || 'No summary available'}
                </p>

                {result.interaction.action_items.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm mb-2 text-gray-800">Action Items:</h5>
                    <ul className="space-y-2">
                      {result.interaction.action_items.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-indigo-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.interaction.next_steps.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm mb-2 text-gray-800">Next Steps:</h5>
                    <ul className="space-y-2">
                      {result.interaction.next_steps.map((step, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-purple-500 font-bold">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm pt-4 border-t border-indigo-50">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Sentiment:</span>
                    <span className="font-semibold">
                      {result.interaction.sentiment === 'positive' && '😊 Positive'}
                      {result.interaction.sentiment === 'neutral' && '😐 Neutral'}
                      {result.interaction.sentiment === 'negative' && '😟 Negative'}
                    </span>
                  </div>
                  {result.interaction.follow_up_date && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Follow up:</span>
                      <span className="font-semibold text-indigo-600">{result.interaction.follow_up_date}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center text-gray-400 bg-indigo-50/30">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium text-gray-500">Extracted data will appear here</p>
                <p className="text-sm mt-1 text-gray-400">Try the sample email to see it in action</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}