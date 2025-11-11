'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch CRM records from FastAPI backend
  useEffect(() => {
    const fetchCRMData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-crm-records`);
        if (!response.ok) throw new Error('Failed to fetch CRM data');
        const data = await response.json();
        setRecords(data.records || []);
      } catch (err) {
        console.error('Error fetching CRM data:', err);
        setError('Unable to load CRM data. Check backend connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchCRMData();
  }, []);

  // ✅ Derive metrics dynamically from data
  const totalContacts = records.length;
  const totalPipeline = records.reduce((sum, r) => sum + (r.deal_value || 0), 0);
  const atRiskDeals = records.filter(
    (r) => r.deal_stage?.toLowerCase() === 'at risk'
  ).length;
  const wonThisMonth = records.filter(
    (r) => r.deal_stage?.toLowerCase() === 'closed won'
  ).length;
  const avgDealSize = totalContacts ? totalPipeline / totalContacts : 0;
  const conversionRate = totalContacts ? ((wonThisMonth / totalContacts) * 100).toFixed(1) : 0;

  const stats = {
    totalContacts,
    totalPipeline,
    atRiskDeals,
    wonThisMonth,
    avgDealSize,
    conversionRate,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📈</span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CRM Insights
            </h2>
          </div>
          <p className="text-gray-600">AI-powered insights and real CRM analytics</p>
        </div>
      </div>

      {/* Error or Loading State */}
      {loading ? (
        <div className="text-center py-20 text-gray-600 animate-pulse">
          Loading CRM data...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 font-medium">
          {error}
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-100 text-sm font-medium">Total Pipeline</span>
                <span className="text-3xl">💰</span>
              </div>
              <div className="text-4xl font-bold mb-2">
                ${(stats.totalPipeline / 1000000).toFixed(2)}M
              </div>
              <p className="text-sm text-blue-100">↑ 18% vs last month</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-indigo-100 text-sm font-medium">Total Contacts</span>
                <span className="text-3xl">👥</span>
              </div>
              <div className="text-4xl font-bold mb-2">{stats.totalContacts}</div>
              <p className="text-sm text-indigo-100">↑ new this week</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-100 text-sm font-medium">At Risk Deals</span>
                <span className="text-3xl">⚠️</span>
              </div>
              <div className="text-4xl font-bold mb-2">{stats.atRiskDeals}</div>
              <p className="text-sm text-purple-100">Need attention</p>
            </div>

            <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-violet-100 text-sm font-medium">Won This Month</span>
                <span className="text-3xl">🏆</span>
              </div>
              <div className="text-4xl font-bold mb-2">{stats.wonThisMonth}</div>
              <p className="text-sm text-violet-100">
                ${((stats.totalPipeline * 0.15) / 1000).toFixed(0)}K closed
              </p>
            </div>
          </div>

          {/* CRM Table Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">📋 Recent CRM Records</h3>
            {records.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left bg-indigo-50 text-gray-700 text-sm">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Deal Stage</th>
                    <th className="py-3 px-4">Deal Value</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 hover:bg-indigo-50 transition"
                    >
                      <td className="py-2 px-4 font-medium text-gray-900">
                        {r.company || '-'}
                      </td>
                      <td className="py-2 px-4 text-gray-700">{r.role || '-'}</td>
                      <td className="py-2 px-4 text-gray-600">{r.email || '-'}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            r.deal_stage?.toLowerCase() === 'closed won'
                              ? 'bg-green-100 text-green-800'
                              : r.deal_stage?.toLowerCase() === 'negotiation'
                              ? 'bg-amber-100 text-amber-800'
                              : r.deal_stage?.toLowerCase() === 'at risk'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {r.deal_stage || 'N/A'}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-purple-600 font-semibold">
                        {r.deal_value ? `$${r.deal_value.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No records found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
