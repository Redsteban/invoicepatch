'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DocumentTextIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

interface TrialData {
  trial_id: string;
  ticket_number: string;
  location: string;
  company: string;
  day_rate: number;
  truck_rate: number;
  travel_kms: number;
  subsistence: number;
  work_start_date: string;
  work_days: string[];
  invoice_frequency: string;
  trial_start_date: string;
  trial_end_date: string;
  trial_status: string;
  days_remaining: number;
  daily_total: number;
  notifications_enabled: boolean;
}

function TrialDashboardContent() {
  const searchParams = useSearchParams();
  const trialId = searchParams.get('trial');
  
  const [trialData, setTrialData] = useState<TrialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trialId) {
      fetchTrialData(trialId);
    } else {
      setError('No trial ID provided');
      setLoading(false);
    }
  }, [trialId]);

  const fetchTrialData = async (id: string) => {
    try {
      const response = await fetch(`/api/setup-trial-invoice?trial=${id}`);
      const result = await response.json();
      
      if (result.success) {
        setTrialData(result.trial);
      } else {
        setError(result.error || 'Failed to load trial data');
      }
    } catch (err) {
      setError('Network error loading trial data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgressPercentage = () => {
    if (!trialData) return 0;
    const totalDays = 14;
    const daysCompleted = totalDays - trialData.days_remaining;
    return Math.max(0, Math.min(100, (daysCompleted / totalDays) * 100));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your trial dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !trialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Trial Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/invoice-setup"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            Set Up New Trial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 mobile-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Trial Active - {trialData.days_remaining} days remaining
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Trial Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto break-words">
            Welcome to your 14-day InvoicePatch trial. Track your progress and daily check-ins below.
          </p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Trial Progress</h2>
            <span className="text-sm text-gray-500">
              Day {14 - trialData.days_remaining + 1} of 14
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgressPercentage()}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{14 - trialData.days_remaining}</div>
              <div className="text-sm text-gray-600">Days Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{trialData.days_remaining}</div>
              <div className="text-sm text-gray-600">Days Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{formatDate(trialData.trial_end_date)}</div>
              <div className="text-sm text-gray-600">Trial Ends</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600" />
                Project Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Ticket Number</label>
                  <p className="text-lg font-semibold text-gray-900">{trialData.ticket_number}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Client Company</label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {trialData.company}
                  </p>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Job Site Location</label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {trialData.location}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Work Start Date</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(trialData.work_start_date)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Invoice Frequency</label>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{trialData.invoice_frequency}</p>
                </div>
              </div>
            </motion.div>

            {/* Rate Structure */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-3 text-green-600" />
                Daily Rate Structure
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(trialData.day_rate)}</div>
                  <div className="text-sm text-gray-600">Labor Rate</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(trialData.truck_rate)}</div>
                  <div className="text-sm text-gray-600">Truck Rate</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{trialData.travel_kms} km</div>
                  <div className="text-sm text-gray-600">Travel Distance</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(trialData.subsistence)}</div>
                  <div className="text-sm text-gray-600">Subsistence</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Estimated Daily Total:</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(trialData.daily_total)}</span>
                </div>
              </div>
            </motion.div>

            {/* Work Schedule */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CalendarDaysIcon className="h-6 w-6 mr-3 text-purple-600" />
                Work Schedule
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div
                    key={day}
                    className={`text-center p-3 rounded-lg ${
                      trialData.work_days.includes(day)
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="text-sm">
                      <span className="hidden sm:inline">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                      <span className="sm:hidden">{day.substring(0, 3).toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href="/daily-checkin"
                  className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors touch-target"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Daily Check-in
                </Link>
                
                <button className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 transition-colors touch-target">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  View Invoices
                </button>
                
                <button className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors touch-target">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Trial Reports
                </button>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BellIcon className="h-5 w-5 mr-2" />
                Notifications
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Daily Check-in Reminders</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    trialData.notifications_enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trialData.notifications_enabled ? 'On' : 'Off'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                  Next reminder: Today at 6:00 PM
                </div>
                
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Cog6ToothIcon className="h-4 w-4 inline mr-2" />
                  Manage Settings
                </button>
              </div>
            </motion.div>

            {/* Help & Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the most out of your trial with our quick start guide and video tutorials.
              </p>
              
              <div className="space-y-2">
                <button className="w-full text-left flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
                  <PlayCircleIcon className="h-4 w-4 mr-2" />
                  Watch Video Guide
                </button>
                
                <button className="w-full text-left flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  View Documentation
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trial Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                🎉 Trial Setup Complete!
              </h3>
              <p className="text-green-700 mb-4">
                Your automated daily check-ins will begin today at 6:00 PM. We'll guide you through 
                logging your work hours and help you generate your first professional invoice.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/daily-checkin"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-colors touch-target"
                >
                  Start First Check-in
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
                
                <button className="inline-flex items-center px-6 py-3 text-base font-medium text-green-700 bg-white border border-green-300 rounded-lg shadow-sm hover:bg-green-50 transition-colors touch-target">
                  <PlayCircleIcon className="mr-2 h-4 w-4" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading trial dashboard...</p>
      </div>
    </div>
  );
}

export default function TrialDashboardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TrialDashboardContent />
    </Suspense>
  );
} 