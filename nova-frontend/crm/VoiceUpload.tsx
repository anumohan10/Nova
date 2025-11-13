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

export default function VoiceUpload() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CRMData | null>(null);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setError('');
    }
  };

  const handleExtract = async () => {
    if (!audioFile) {
      setError('Please upload an audio file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', audioFile);

      const response = await fetch('http://127.0.0.1:8000/transcribe-audio/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTranscript(data.transcript || '');

        // ⚠️ The corrected part: USE CRM DATA SENT BY BACKEND
        const crm = data.data || {};

        setResult({
          contact: {
            name: crm?.contact?.name || '',
            company: crm?.contact?.company || '',
            email: crm?.contact?.email || '',
            phone: crm?.contact?.phone || '',
            role: crm?.contact?.role || ''
          },
          deal: {
            stage: crm?.deal?.stage || '',
            value: crm?.deal?.value || null,
            products: crm?.deal?.products || []
          },
          interaction: {
            summary: crm?.interaction?.summary || 'No summary available',
            action_items: crm?.interaction?.action_items || [],
            next_steps: crm?.interaction?.next_steps || [],
            follow_up_date: crm?.interaction?.follow_up_date || '',
            sentiment: crm?.interaction?.sentiment || ''
          }
        });

      } else {
        setError(data.error || 'Failed to transcribe audio');
      }
    } catch (err) {
      console.error(err);
      setError('API not responding or backend error');
    } finally {
      setLoading(false);
    }
  };

  const simulateVoiceNote = () => {
    const mockTranscript =
      "Just had coffee with Sarah from Acme Corp. She's the VP of Sales and they're really interested in our enterprise plan. Looking at around fifty thousand dollars for their team of 75 people. They want to move fast - need a proposal by next Friday and want to schedule a technical demo for their IT team next week.";

    setTranscript(mockTranscript);

    setResult({
      contact: {
        name: 'Sarah',
        company: 'Acme Corp',
        email: '',
        phone: '',
        role: 'VP of Sales'
      },
      deal: {
        stage: 'qualified',
        value: 50000,
        products: ['Enterprise Plan']
      },
      interaction: {
        summary:
          'Coffee meeting discussing enterprise plan adoption. Customer is frustrated with current CRM manual entry.',
        action_items: [
          'Send proposal by next Friday',
          'Schedule technical demo for IT team',
          'Follow up next week'
        ],
        next_steps: [
          'Prepare enterprise proposal',
          'Coordinate with technical team for demo'
        ],
        follow_up_date: 'Next Friday',
        sentiment: 'positive'
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎤</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Voice Note Auto-Population
          </h2>
        </div>
        <p className="text-gray-600">
          Upload a voice note and watch Nova transcribe & extract CRM data using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700">
              🎙️ Audio File
            </label>
            <button
              onClick={simulateVoiceNote}
              className="text-sm text-indigo-600 hover:text-purple-600 font-medium transition-colors"
            >
              Try Demo Voice Note
            </button>
          </div>

          {/* UPLOAD AREA */}
          <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center bg-white hover:border-indigo-300 transition-colors">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
            />
            <label htmlFor="audio-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <svg
                  className="w-16 h-16 text-indigo-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>

                {audioFile ? (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">✓ {audioFile.name}</p>
                    <p className="text-xs text-gray-500">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload audio file
                    </p>
                    <p className="text-xs text-gray-500">
                      MP3, WAV, M4A, or any audio format
                    </p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* TRANSCRIPT */}
          {transcript && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">📝 Transcript:</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleExtract}
            disabled={loading || !audioFile}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Transcribing & Extracting...
              </span>
            ) : (
              '🚀 Transcribe & Extract to CRM'
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE – Results */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            ✅ Extracted CRM Data
          </label>

          {result ? (
            <div className="space-y-4 animate-fadeIn">

              {/* CONTACT CARD */}
              <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {result.contact.name || 'No name found'}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {result.contact.company || 'No company'}
                    </p>

                    {result.contact.role && (
                      <p className="text-sm text-indigo-600 font-medium mt-1">
                        {result.contact.role}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        result.deal.stage === 'negotiation'
                          ? 'bg-amber-100 text-amber-800'
                          : result.deal.stage === 'qualified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : result.deal.stage === 'prospect'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
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

              {/* INTERACTION SUMMARY */}
              <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all">
                <h4 className="font-bold text-lg mb-3 text-indigo-700">📝 Interaction Summary</h4>

                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {result.interaction.summary || 'No summary available'}
                </p>

                {/* ACTION ITEMS */}
                {result.interaction.action_items.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm mb-2 text-gray-800">
                      Action Items:
                    </h5>
                    <ul className="space-y-2">
                      {result.interaction.action_items.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-indigo-500 font-bold">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* NEXT STEPS */}
                {result.interaction.next_steps.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm mb-2 text-gray-800">Next Steps:</h5>
                    <ul className="space-y-2">
                      {result.interaction.next_steps.map((step, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-purple-500 font-bold">→</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* FOOTER ROW */}
                <div className="flex items-center gap-4 text-sm pt-4 border-t border-indigo-50">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Sentiment:</span>
                    <span className="font-semibold text-gray-900">
                      {result.interaction.sentiment === 'positive' && '😊 Positive'}
                      {result.interaction.sentiment === 'neutral' && '😐 Neutral'}
                      {result.interaction.sentiment === 'negative' && '😟 Negative'}
                    </span>
                  </div>

                  {result.interaction.follow_up_date && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Follow up:</span>
                      <span className="font-semibold text-indigo-600">
                        {result.interaction.follow_up_date}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center text-gray-400 bg-indigo-50/30">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-indigo-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-500">
                  Extracted data will appear here
                </p>
                <p className="text-sm mt-1 text-gray-400">
                  Try the demo voice note to see it in action
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
