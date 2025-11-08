'use client';

import { useState } from 'react';

interface SearchResult {
  contact: {
    name: string;
    company: string;
    email: string;
    role: string;
  };
  deal: {
    stage: string;
    value: number;
    last_contact: string;
    days_since_contact: number;
  };
  risk_level?: 'high' | 'medium' | 'low';
  suggestion?: string;
}

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [insights, setInsights] = useState('');
  const [error, setError] = useState('');

  const exampleQueries = [
    "Which deals are at risk?",
    "Show me all CTOs",
    "Who should I follow up with today?",
    "Deals over $50k in negotiation",
    "Companies with positive sentiment"
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setQuery(searchQuery);
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || []);
        setInsights(data.insights || '');
      } else {
        setError(data.error || 'Failed to search');
      }
    } catch (err) {
      // Simulate results for demo purposes
      simulateSearch(searchQuery);
    } finally {
      setLoading(false);
    }
  };

  const simulateSearch = (searchQuery: string) => {
    const lowerQuery = searchQuery.toLowerCase();
    
    // Simulate different search results based on query
    if (lowerQuery.includes('risk') || lowerQuery.includes('at risk')) {
      setInsights('Found 3 deals that need immediate attention. These contacts haven\'t been reached in over 14 days and are in critical stages of negotiation.');
      setResults([
        {
          contact: {
            name: 'Michael Chen',
            company: 'TechFlow Inc',
            email: 'michael@techflow.com',
            role: 'CTO'
          },
          deal: {
            stage: 'negotiation',
            value: 120000,
            last_contact: '18 days ago',
            days_since_contact: 18
          },
          risk_level: 'high',
          suggestion: 'Schedule immediate check-in call'
        },
        {
          contact: {
            name: 'Lisa Rodriguez',
            company: 'DataCore Systems',
            email: 'lisa@datacore.com',
            role: 'VP of Engineering'
          },
          deal: {
            stage: 'negotiation',
            value: 85000,
            last_contact: '21 days ago',
            days_since_contact: 21
          },
          risk_level: 'high',
          suggestion: 'Send follow-up proposal'
        },
        {
          contact: {
            name: 'James Wilson',
            company: 'CloudNine',
            email: 'james@cloudnine.io',
            role: 'Director of Operations'
          },
          deal: {
            stage: 'qualified',
            value: 65000,
            last_contact: '15 days ago',
            days_since_contact: 15
          },
          risk_level: 'medium',
          suggestion: 'Re-engage with updated demo'
        }
      ]);
    } else if (lowerQuery.includes('cto')) {
      setInsights('Found 4 CTOs in your pipeline. 2 are in active negotiations, 1 is qualified, and 1 is a new prospect.');
      setResults([
        {
          contact: {
            name: 'Michael Chen',
            company: 'TechFlow Inc',
            email: 'michael@techflow.com',
            role: 'CTO'
          },
          deal: {
            stage: 'negotiation',
            value: 120000,
            last_contact: '3 days ago',
            days_since_contact: 3
          },
          risk_level: 'low'
        },
        {
          contact: {
            name: 'Sarah Park',
            company: 'InnovateLabs',
            email: 'sarah@innovatelabs.com',
            role: 'CTO'
          },
          deal: {
            stage: 'negotiation',
            value: 95000,
            last_contact: '5 days ago',
            days_since_contact: 5
          },
          risk_level: 'low'
        },
        {
          contact: {
            name: 'David Kumar',
            company: 'NextGen AI',
            email: 'david@nextgen.ai',
            role: 'CTO & Co-founder'
          },
          deal: {
            stage: 'qualified',
            value: 150000,
            last_contact: '7 days ago',
            days_since_contact: 7
          },
          risk_level: 'low'
        }
      ]);
    } else if (lowerQuery.includes('follow up') || lowerQuery.includes('today')) {
      setInsights('You have 5 contacts that need follow-up today based on scheduled reminders and optimal engagement timing.');
      setResults([
        {
          contact: {
            name: 'Emma Thompson',
            company: 'Acme Corp',
            email: 'emma@acme.com',
            role: 'VP of Sales'
          },
          deal: {
            stage: 'negotiation',
            value: 75000,
            last_contact: '7 days ago',
            days_since_contact: 7
          },
          suggestion: 'Promised to send updated proposal today'
        },
        {
          contact: {
            name: 'Robert Martinez',
            company: 'GlobalTech',
            email: 'robert@globaltech.com',
            role: 'Head of Procurement'
          },
          deal: {
            stage: 'qualified',
            value: 50000,
            last_contact: '10 days ago',
            days_since_contact: 10
          },
          suggestion: 'Schedule demo that was discussed'
        }
      ]);
    } else if (lowerQuery.includes('50') || lowerQuery.includes('negotiation')) {
      setInsights('Found 6 deals over $50k currently in negotiation stage. Total pipeline value: $680,000.');
      setResults([
        {
          contact: {
            name: 'Michael Chen',
            company: 'TechFlow Inc',
            email: 'michael@techflow.com',
            role: 'CTO'
          },
          deal: {
            stage: 'negotiation',
            value: 120000,
            last_contact: '3 days ago',
            days_since_contact: 3
          }
        },
        {
          contact: {
            name: 'Sarah Park',
            company: 'InnovateLabs',
            email: 'sarah@innovatelabs.com',
            role: 'CTO'
          },
          deal: {
            stage: 'negotiation',
            value: 95000,
            last_contact: '5 days ago',
            days_since_contact: 5
          }
        },
        {
          contact: {
            name: 'Lisa Rodriguez',
            company: 'DataCore Systems',
            email: 'lisa@datacore.com',
            role: 'VP of Engineering'
          },
          deal: {
            stage: 'negotiation',
            value: 85000,
            last_contact: '8 days ago',
            days_since_contact: 8
          }
        }
      ]);
    } else {
      setInsights(`Searching for: "${searchQuery}". API integration coming soon! For now, try one of the example queries to see the AI search in action.`);
      setResults([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔍</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered CRM Search
          </h2>
        </div>
        <p className="text-gray-600">Ask questions in natural language and get intelligent insights about your contacts and deals</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Ask anything about your CRM... (e.g., 'Which deals are at risk?')"
            className="w-full px-6 py-4 pr-12 text-lg border-2 border-indigo-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900 placeholder:text-gray-400"
          />
          <button
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              '🔍'
            )}
          </button>
        </div>

        {/* Example Queries */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-700 font-medium">Try:</span>
          {exampleQueries.map((exampleQuery) => (
            <button
              key={exampleQuery}
              onClick={() => handleSearch(exampleQuery)}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors font-medium"
            >
              {exampleQuery}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* AI Insights Panel */}
      {insights && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🤖</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-indigo-900 mb-2">AI Insights</h3>
              <p className="text-gray-800 leading-relaxed">{insights}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </h3>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-900">
                        {result.contact.name}
                      </h4>
                      {result.risk_level && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          result.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                          result.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {result.risk_level === 'high' && '⚠️ High Risk'}
                          {result.risk_level === 'medium' && '⚡ Medium Risk'}
                          {result.risk_level === 'low' && '✓ Low Risk'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-1 font-medium">{result.contact.company}</p>
                    <p className="text-sm text-indigo-600 font-medium mb-3">{result.contact.role}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 font-medium">Deal Stage:</span>
                        <span className={`ml-2 font-bold ${
                          result.deal.stage === 'negotiation' ? 'text-amber-600' :
                          result.deal.stage === 'qualified' ? 'text-green-600' :
                          'text-blue-600'
                        }`}>
                          {result.deal.stage.charAt(0).toUpperCase() + result.deal.stage.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Deal Value:</span>
                        <span className="ml-2 font-bold text-purple-600">
                          ${result.deal.value.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Last Contact:</span>
                        <span className={`ml-2 font-bold ${
                          result.deal.days_since_contact > 14 ? 'text-red-600' :
                          result.deal.days_since_contact > 7 ? 'text-yellow-600' :
                          'text-gray-800'
                        }`}>
                          {result.deal.last_contact}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Email:</span>
                        <span className="ml-2 text-gray-800">{result.contact.email}</span>
                      </div>
                    </div>

                    {result.suggestion && (
                      <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold text-lg">💡</span>
                          <div>
                            <span className="text-sm font-bold text-indigo-900">Suggestion: </span>
                            <span className="text-sm text-gray-800">{result.suggestion}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !insights && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Ready to search your CRM
          </h3>
          <p className="text-gray-600 mb-6">
            Ask questions in natural language and get instant insights
          </p>
          <div className="max-w-md mx-auto text-left bg-indigo-50 rounded-xl p-6">
            <p className="text-sm font-bold text-indigo-900 mb-3">Example queries:</p>
            <ul className="text-sm text-gray-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>"Which deals are at risk?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>"Show me all CTOs in my pipeline"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>"Who should I follow up with this week?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>"Deals over $100k in negotiation"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>"Companies with positive sentiment"</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}