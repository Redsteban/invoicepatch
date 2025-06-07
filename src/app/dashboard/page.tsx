'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface UserTrials {
  active: any[];
  completed: any[];
  total: number;
}

const UserDashboard = () => {
  const [trials, setTrials] = useState<UserTrials>({ active: [], completed: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadUserTrials();
  }, [user, router]);

  const loadUserTrials = async () => {
    try {
      const response = await fetch('/api/user/trials');
      const data = await response.json();
      
      if (data.success) {
        setTrials(data.trials);
      } else {
        setError(data.error || 'Failed to load trials');
      }
    } catch (error: any) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/contractor-trial"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Start New Trial
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trials</p>
                <p className="text-2xl font-bold text-gray-900">{trials.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Trials</p>
                <p className="text-2xl font-bold text-gray-900">{trials.active.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 text-2xl">🏁</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{trials.completed.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Trials */}
        {trials.active.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Trials</h2>
              <p className="text-sm text-gray-600">Your currently running trial invoices</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {trials.active.map((trial) => (
                  <div key={trial.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">
                            {trial.company} - {trial.location}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Period:</span> {formatDate(trial.start_date)} - {formatDate(trial.end_date)}
                          </div>
                          <div>
                            <span className="font-medium">Day Rate:</span> ${trial.day_rate}
                          </div>
                          <div>
                            <span className="font-medium">Days Worked:</span> {trial.days_worked || 0}
                          </div>
                          <div>
                            <span className="font-medium">Total Earned:</span> ${(trial.total_earned || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          href={`/contractor/dashboard/${trial.id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          View Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completed Trials */}
        {trials.completed.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Completed Trials</h2>
              <p className="text-sm text-gray-600">Your finished trial invoices</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {trials.completed.slice(0, 5).map((trial) => (
                  <div key={trial.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">
                            {trial.company} - {trial.location}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Completed
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Period:</span> {formatDate(trial.start_date)} - {formatDate(trial.end_date)}
                          </div>
                          <div>
                            <span className="font-medium">Day Rate:</span> ${trial.day_rate}
                          </div>
                          <div>
                            <span className="font-medium">Days Worked:</span> {trial.days_worked || 0}
                          </div>
                          <div>
                            <span className="font-medium">Total Earned:</span> ${(trial.total_earned || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          href={`/contractor/dashboard/${trial.id}`}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {trials.completed.length > 5 && (
                <div className="mt-4 text-center">
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                    View All Completed Trials
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {trials.total === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to InvoicePatch!
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't started any trials yet. Create your first contractor trial to experience our platform.
              </p>
              <Link
                href="/contractor-trial"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Start Your First Trial
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/contractor-trial"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <span className="text-blue-600 text-xl">📝</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Start New Trial</h3>
                  <p className="text-sm text-gray-600">Create a new contractor trial</p>
                </div>
              </Link>

              <Link
                href="/trial-access"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-green-600 text-xl">🔑</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Access Trial by Email</h3>
                  <p className="text-sm text-gray-600">Quick access to existing trials</p>
                </div>
              </Link>

              <Link
                href="/manager-demo"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <span className="text-purple-600 text-xl">👔</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manager Demo</h3>
                  <p className="text-sm text-gray-600">Explore manager features</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 