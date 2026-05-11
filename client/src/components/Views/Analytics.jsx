import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Target, Activity } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

  const cards = [
    { label: 'Total Leads', value: stats?.total || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Hot Leads', value: stats?.hot || 0, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Avg Score', value: stats?.avgScore || 0, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Today', value: stats?.today || 0, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
        <div className="text-sm text-slate-500">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="card p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Lead Distribution</h2>
          <div className="space-y-4">
            {[
              { label: 'Hot Leads (High Intent)', value: stats?.hot || 0, total: stats?.total || 1, color: 'bg-orange-500' },
              { label: 'Warm Leads (Medium Intent)', value: stats?.warm || 0, total: stats?.total || 1, color: 'bg-blue-500' },
              { label: 'Cold Leads (Low Intent)', value: stats?.cold || 0, total: stats?.total || 1, color: 'bg-slate-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium">{Math.round((item.value / item.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full`} 
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-4 bg-brand-50 rounded-full">
            <BarChart3 className="w-12 h-12 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Advanced Insights</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              AI-driven predictive analytics and historical trend mapping are being initialized based on your current lead volume.
            </p>
          </div>
          <button className="btn btn-secondary text-sm">Download Report</button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
