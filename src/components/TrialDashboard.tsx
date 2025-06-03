'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrialManager, TrialUtils, type TrialData, type TrialStats } from '@/lib/trialManager';
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ChartBarIcon,
  BellIcon,
  DocumentTextIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface TrialDashboardProps {
  showNotifications?: boolean;
}

const TrialDashboard = ({ showNotifications = true }: TrialDashboardProps) => {
  const [trialData, setTrialData] = useState<TrialData | null>(null);
  const [trialStats, setTrialStats] = useState<TrialStats | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrialData();
  }, []);

  const loadTrialData = () => {
    setLoading(true);
    try {
      const data = TrialManager.getTrialData();
      const stats = TrialManager.getTrialStats();
      const active = TrialManager.isTrialActive();

      setTrialData(data);
      setTrialStats(stats);
      setIsActive(active);
    } catch (error) {
      console.error('Error loading trial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getStatusBadge = () => {
    if (!trialData) return null;

    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active Trial' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Trial Completed' },
      expired: { color: 'bg-red-100 text-red-800', text: 'Trial Expired' },
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' }
    };

    const config = statusConfig[trialData.trialStatus] || statusConfig.draft;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!trialData || !trialStats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Trial</h3>
        <p className="text-gray-600 mb-4">Start your free trial to begin automated daily check-ins.</p>
        <a
          href="/trial-setup"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlayIcon className="h-4 w-4 mr-2" />
          Start Trial
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trial Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Trial Dashboard</h2>
            <p className="text-gray-600">Track your progress and daily check-ins</p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{trialStats.daysRemaining}</div>
            <div className="text-sm text-gray-600">Days Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{trialStats.daysCompleted}</div>
            <div className="text-sm text-gray-600">Days Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(trialStats.completionRate)}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Trial Progress</span>
            <span>{trialStats.daysCompleted} of {trialStats.totalDays} days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${trialStats.completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-2 rounded-full ${getProgressColor(trialStats.completionRate)}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Trial Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trial Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Ticket:</strong> {trialData.ticketNumber}</p>
              <p><strong>Location:</strong> {trialData.location}</p>
              <p><strong>Company:</strong> {trialData.company}</p>
              <p><strong>Started:</strong> {TrialUtils.formatDate(trialData.trialStartDate)}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Rate Structure</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Day Rate:</strong> {TrialUtils.formatCurrency(parseFloat(trialData.dayRate))}</p>
              <p><strong>Truck Rate:</strong> {TrialUtils.formatCurrency(parseFloat(trialData.truckRate))}</p>
              <p><strong>Travel:</strong> {trialData.travelKMs} km</p>
              <p><strong>Subsistence:</strong> {TrialUtils.formatCurrency(parseFloat(trialData.taxFreeSubsistence))}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Earnings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 mr-2" />
          Earnings Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {TrialUtils.formatCurrency(trialStats.totalEarnings)}
              </div>
              <div className="text-sm text-green-700 mt-1">Total Earnings</div>
            </div>
          </div>
          
          <div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {TrialUtils.formatCurrency(trialStats.averageDailyEarnings)}
              </div>
              <div className="text-sm text-blue-700 mt-1">Average Daily</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Projected weekly earnings: {TrialUtils.formatCurrency(trialStats.averageDailyEarnings * 5)}
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/daily-checkin"
            className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-blue-900">Daily Check-in</div>
                <div className="text-sm text-blue-700">Log today's work</div>
              </div>
            </div>
            <ArrowRightIcon className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </a>

          <button
            onClick={() => {
              const exportData = TrialManager.exportTrialData();
              const blob = new Blob([exportData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `trial-data-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Export Data</div>
                <div className="text-sm text-gray-700">Download trial backup</div>
              </div>
            </div>
            <ArrowRightIcon className="h-4 w-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Reminder Settings */}
      {showNotifications && isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BellIcon className="h-5 w-5 mr-2" />
            Daily Reminders
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notification Status</p>
              <p className="text-sm text-gray-600">
                {trialData.notificationsEnabled 
                  ? 'Enabled - You\'ll receive reminders at 6 PM, 8 PM, and 10 PM'
                  : 'Disabled - Enable to get daily check-in reminders'
                }
              </p>
            </div>
            <button
              onClick={() => {
                if (!trialData.notificationsEnabled) {
                  TrialManager.enableNotifications();
                  setTrialData(prev => prev ? { ...prev, notificationsEnabled: true } : null);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                trialData.notificationsEnabled
                  ? 'bg-green-100 text-green-800 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {trialData.notificationsEnabled ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                  Enabled
                </>
              ) : (
                'Enable Notifications'
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Trial Completion */}
      {!isActive && trialData.trialStatus === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white"
        >
          <div className="text-center">
            <CheckCircleIcon className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Trial Completed!</h3>
            <p className="text-green-100 mb-4">
              Great job! You've completed your 14-day trial with {trialStats.daysCompleted} days logged.
            </p>
            <p className="text-green-100 mb-6">
              Ready to continue with full automated invoicing?
            </p>
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrialDashboard; 