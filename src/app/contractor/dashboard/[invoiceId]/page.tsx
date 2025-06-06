'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface DashboardData {
  invoice: any;
  entries: any[];
  summary: {
    totalEarned: number;
    daysWorked: number;
    currentDay: number;
    trialDaysRemaining: number;
    projectedTotal: number;
  };
}

const ContractorDashboard = () => {
  const params = useParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayWorked, setTodayWorked] = useState<boolean | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [params.invoiceId]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`/api/contractor/dashboard?trialInvoiceId=${params.invoiceId}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result);
        
        // Check if today's work is logged
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = result.entries.find((e: any) => e.entry_date === today);
        setTodayWorked(todayEntry?.worked || null);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const logWork = async (worked: boolean) => {
    try {
      const response = await fetch('/api/contractor/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialInvoiceId: params.invoiceId,
          date: new Date().toISOString().split('T')[0],
          worked,
          dayRate: worked ? 450 : 0,
          truckUsed: worked,
          truckRate: worked ? 150 : 0,
          travelKms: worked ? 45 : 0,
          subsistence: worked ? 75 : 0
        })
      });

      const result = await response.json();
      if (result.success) {
        setTodayWorked(worked);
        loadDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to log work:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-medium text-gray-900">InvoicePatch Trial</h1>
            <span className="text-sm text-gray-500">
              Day {data.summary.currentDay}/5 • {data.summary.trialDaysRemaining} days left
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 5-Day Progress */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Trial Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${data.summary.totalEarned.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Projected 5-day total: ${data.summary.projectedTotal.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Days worked</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.summary.daysWorked}/5
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all" 
              style={{ width: `${(data.summary.currentDay / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {data.summary.trialDaysRemaining} days remaining in trial
          </p>
        </div>

        {/* Today's Work */}
        {todayWorked === null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Did you work today?
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => logWork(true)}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Yes, I worked today
              </button>
              <button 
                onClick={() => logWork(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                No work today
              </button>
            </div>
          </div>
        )}

        {todayWorked === true && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">✓ Today's work logged: $673.50 earned</p>
          </div>
        )}

        {todayWorked === false && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-gray-600">Day off logged for today</p>
          </div>
        )}

        {/* 5-Day Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Trial Insights</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Average daily earnings</span>
                <span className="font-medium">
                  ${data.summary.daysWorked > 0 ? (data.summary.totalEarned / data.summary.daysWorked).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Work completion rate</span>
                <span className="font-medium">
                  {((data.summary.daysWorked / data.summary.currentDay) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days until invoice</span>
                <span className="font-medium">{6 - data.summary.currentDay} days</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Invoice Preview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Day rate total</span>
                <span>${(data.summary.daysWorked * 450).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Truck allowance</span>
                <span>${(data.summary.daysWorked * 150).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travel (45km/day)</span>
                <span>${(data.summary.daysWorked * 45 * 0.68).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subsistence</span>
                <span>${(data.summary.daysWorked * 75).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>GST (5%)</span>
                  <span>${(data.summary.daysWorked * 600 * 0.05).toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-blue-600">
                  <span>Total</span>
                  <span>${data.summary.totalEarned.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work History */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">5-Day Work History</h3>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (4 - i));
              const dateStr = date.toISOString().split('T')[0];
              const entry = data.entries.find(e => e.entry_date === dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isPast = date < new Date(new Date().toDateString());
              
              return (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                  isToday ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}>
                  <div>
                    <span className="font-medium">
                      Day {i + 1} - {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                    {isToday && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">TODAY</span>}
                  </div>
                  <div className="text-right">
                    {entry?.worked ? (
                      <span className="text-green-600 font-medium">$673.50</span>
                    ) : entry?.worked === false ? (
                      <span className="text-gray-500">Day off</span>
                    ) : isPast ? (
                      <span className="text-gray-400">Not logged</span>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA for full version */}
        <div className="mt-8 text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready for the full InvoicePatch experience?
          </h3>
          <p className="text-gray-600 mb-4">
            Automate your invoicing completely and never miss a payment again.
          </p>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
            Start Full Version - $39/month
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard; 