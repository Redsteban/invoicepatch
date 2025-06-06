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
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Dashboard component mounted with ID:', params.invoiceId);
    loadDashboardData();
  }, [params.invoiceId]);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data for:', params.invoiceId);
      
      const response = await fetch(`/api/contractor/dashboard?trialInvoiceId=${params.invoiceId}`);
      console.log('Dashboard API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Dashboard API result:', result);
      
      if (result.success) {
        setData(result);
        
        // Check if today's work is logged
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = result.entries.find((e: any) => e.entry_date === today);
        setTodayWorked(todayEntry?.worked || null);
      } else {
        setError(result.error || 'Failed to load dashboard');
      }
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
      setError(`Failed to load dashboard: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logWork = async (worked: boolean) => {
    try {
      console.log('Logging work:', { worked, trialId: params.invoiceId });
      
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

      console.log('Checkin API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Checkin API result:', result);
      
      if (result.success) {
        setTodayWorked(worked);
        loadDashboardData(); // Refresh data
      } else {
        setError(result.error || 'Failed to log work');
      }
    } catch (error: any) {
      console.error('Failed to log work:', error);
      setError(`Failed to log work: ${error.message}`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">No dashboard data available</p>
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
              Day {data.summary?.currentDay || 1}/5 • {data.summary?.trialDaysRemaining || 0} days left
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
                ${(data.summary?.totalEarned || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Projected 5-day total: ${(data.summary?.projectedTotal || 0).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Days worked</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.summary?.daysWorked || 0}/5
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all" 
              style={{ width: `${((data.summary?.currentDay || 1) / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {data.summary?.trialDaysRemaining || 0} days remaining in trial
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

        {/* Simple stats for now */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">Trial Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-xl font-semibold text-gray-900">
                ${(data.summary?.totalEarned || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Days Worked</p>
              <p className="text-xl font-semibold text-gray-900">
                {data.summary?.daysWorked || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard; 