'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const stats = {
    totalContacts: 47,
    totalPipeline: 1240000,
    atRiskDeals: 5,
    wonThisMonth: 3,
    avgDealSize: 86000,
    conversionRate: 34
  };

  const dealsByStage = [
    { stage: 'Closed Won', count: 3, value: 180000, color: 'bg-green-500', percentage: 15 },
    { stage: 'Negotiation', count: 12, value: 580000, color: 'bg-amber-500', percentage: 47 },
    { stage: 'Qualified', count: 18, value: 320000, color: 'bg-blue-500', percentage: 26 },
    { stage: 'Prospect', count: 14, value: 160000, color: 'bg-indigo-500', percentage: 12 }
  ];

  const recentActivity = [
    { 
      type: 'extraction', 
      title: 'Email Auto-Extracted', 
      description: 'Contact from TechFlow Inc added',
      value: '$120K deal',
      time: '2 min ago', 
      icon: '📧',
      color: 'bg-blue-50 border-blue-200'
    },
    { 
      type: 'voice', 
      title: 'Voice Note Processed', 
      description: 'Meeting notes from Sarah at Acme',
      value: '$50K opportunity',
      time: '15 min ago', 
      icon: '🎤',
      color: 'bg-purple-50 border-purple-200'
    },
    { 
      type: 'insight', 
      title: 'AI Insight Generated', 
      description: 'Positive sentiment detected in 3 interactions',
      value: 'High priority',
      time: '1 hour ago', 
      icon: '🤖',
      color: 'bg-indigo-50 border-indigo-200'
    },
    { 
      type: 'search', 
      title: 'Search Query Executed', 
      description: 'Found 5 deals at risk',
      value: '5 results',
      time: '2 hours ago', 
      icon: '🔍',
      color: 'bg-green-50 border-green-200'
    }
  ];

  const priorityActions = [
    { 
      action: 'Follow up with Michael Chen', 
      reason: 'No contact in 18 days',
      dealValue: 120000,
      priority: 'urgent',
      company: 'TechFlow Inc'
    },
    { 
      action: 'Send proposal to Lisa Rodriguez', 
      reason: 'Promised by end of week',
      dealValue: 85000,
      priority: 'high',
      company: 'DataCore Systems'
    },
    { 
      action: 'Schedule demo for Emma Thompson', 
      reason: 'Mentioned in last email',
      dealValue: 75000,
      priority: 'medium',
      company: 'Acme Corp'
    }
  ];

  const topPerformers = [
    { name: 'Michael Chen', company: 'TechFlow Inc', value: 120000, sentiment: 'positive', lastContact: '3 days ago' },
    { name: 'Sarah Park', company: 'InnovateLabs', value: 95000, sentiment: 'positive', lastContact: '1 day ago' },
    { name: 'David Kumar', company: 'NextGen AI', value: 150000, sentiment: 'neutral', lastContact: '5 days ago' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Header with Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📈</span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CRM Insights
            </h2>
          </div>
          <p className="text-gray-600">AI-powered insights and actionable intelligence</p>
        </div>
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-indigo-100">
          {(['week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeframe === period
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics - Brand Palette (Blue/Indigo/Purple/Violet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-100 text-sm font-medium">Total Pipeline</span>
            <span className="text-3xl">💰</span>
          </div>
          <div className="text-4xl font-bold mb-2">
            ${(stats.totalPipeline / 1000000).toFixed(2)}M
          </div>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <span className="text-green-300">↑ 18%</span>
            <span>vs last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <span className="text-indigo-100 text-sm font-medium">Total Contacts</span>
            <span className="text-3xl">👥</span>
          </div>
          <div className="text-4xl font-bold mb-2">{stats.totalContacts}</div>
          <div className="flex items-center gap-2 text-indigo-100 text-sm">
            <span className="text-green-300">↑ 12</span>
            <span>new this week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-100 text-sm font-medium">At Risk Deals</span>
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="text-4xl font-bold mb-2">{stats.atRiskDeals}</div>
          <div className="flex items-center gap-2 text-purple-100 text-sm">
            <span className="text-yellow-300">Need attention</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <span className="text-violet-100 text-sm font-medium">Won This Month</span>
            <span className="text-3xl">🏆</span>
          </div>
          <div className="text-4xl font-bold mb-2">{stats.wonThisMonth}</div>
          <div className="flex items-center gap-2 text-violet-100 text-sm">
            <span>${(stats.totalPipeline * 0.15 / 1000).toFixed(0)}K closed</span>
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Priority Actions</h3>
            <p className="text-sm text-gray-600">AI-recommended next steps based on your pipeline</p>
          </div>
        </div>
        <div className="space-y-3">
          {priorityActions.map((action, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                action.priority === 'urgent'
                  ? 'bg-red-50 border-red-200 hover:border-red-300'
                  : action.priority === 'high'
                  ? 'bg-orange-50 border-orange-200 hover:border-orange-300'
                  : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-3 h-3 rounded-full ${
                    action.priority === 'urgent'
                      ? 'bg-red-500 animate-pulse'
                      : action.priority === 'high'
                      ? 'bg-orange-500'
                      : 'bg-yellow-500'
                  }`}
                />
                <div>
                  <div className="font-bold text-gray-900">{action.action}</div>
                  <div className="text-sm text-gray-600">{action.company} • {action.reason}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-600">
                  ${(action.dealValue / 1000).toFixed(0)}K
                </div>
                <div className={`text-xs font-semibold uppercase ${
                  action.priority === 'urgent' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {action.priority}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pipeline Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📈</span>
            Pipeline by Stage
          </h3>
          <div className="space-y-6">
            {dealsByStage.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                    <span className="font-semibold text-gray-800">{stage.stage}</span>
                    <span className="text-sm text-gray-500">({stage.count} deals)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      ${(stage.value / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">{stage.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${stage.color} h-3 rounded-full transition-all duration-1000 shadow-sm`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Opportunities */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>🌟</span>
            Top Opportunities
          </h3>
          <div className="space-y-3">
            {topPerformers.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all border border-indigo-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-600">{contact.company}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{contact.lastContact}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        contact.sentiment === 'positive' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {contact.sentiment === 'positive' ? '😊 Positive' : '😐 Neutral'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600 text-lg">
                    ${(contact.value / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>⚡</span>
          Recent Activity
          <span className="ml-2 text-sm font-normal text-gray-500">Last 24 hours</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 ${activity.color} hover:shadow-md transition-all`}
            >
              <span className="text-3xl">{activity.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-1">{activity.title}</div>
                <div className="text-sm text-gray-600 mb-2">{activity.description}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <span className="text-xs font-semibold text-indigo-600">{activity.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}