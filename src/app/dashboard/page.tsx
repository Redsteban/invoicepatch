'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

import { formatCAD } from '@/lib/albertaTax';
import { useNotifications } from '@/lib/notificationService';

interface TrialData {
  trial_id: string;
  ticket_number: string;
  location: string;
  company: string;
  day_rate: number;
  truck_rate: number;
  work_days: string[];
  total_work_days: number;
  total_earnings: number;
  last_checkin_date: string | null;
  status: 'active' | 'pending' | 'completed';
  created_at: string;
}

interface DailyCheckIn {
  id: string;
  check_in_date: string;
  worked_today: boolean;
  daily_total: number;
  status: 'completed' | 'pending';
}

interface DashboardStats {
  totalEarnings: number;
  workDaysCompleted: number;
  averageDailyEarnings: number;
  completionRate: number;
  nextPayrollDate: string;
  daysUntilPayroll: number;
}

export default function ContractorDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [trialData, setTrialData] = useState<TrialData | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<DailyCheckIn[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { checkForReminders } = useNotifications(trialData?.trial_id);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get trial data
        const trialId = searchParams.get('trial') || localStorage.getItem('currentTrialId');
        if (!trialId) {
          router.push('/setup');
          return;
        }

        const [trialResponse, checkInsResponse] = await Promise.all([
          fetch(`/api/setup-trial-invoice?trial=${trialId}`),
          fetch(`/api/daily-checkin?trial=${trialId}&days=7`)
        ]);

        if (trialResponse.ok && checkInsResponse.ok) {
          const trialData = await trialResponse.json();
          const checkInsData = await checkInsResponse.json();
          
          setTrialData(trialData.trial);
          setRecentCheckIns(checkInsData.checkIns || []);
          
          // Calculate dashboard stats
          const stats = calculateDashboardStats(trialData.trial, checkInsData.checkIns || []);
          setDashboardStats(stats);
          
          // Store current trial
          localStorage.setItem('currentTrialId', trialId);
        } else {
          throw new Error('Failed to load dashboard data');
        }
        
        // Show success message if redirected from another page
        if (searchParams.get('success')) {
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 5000);
        }
        
        // Check for reminder notifications
        await checkForReminders();
      } catch (error) {
        console.error('Error loading dashboard:', error);
        router.push('/setup');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [searchParams, router, checkForReminders]);

  const calculateDashboardStats = (trial: TrialData, checkIns: DailyCheckIn[]): DashboardStats => {
    const workDays = checkIns.filter(c => c.worked_today);
    const totalEarnings = workDays.reduce((sum, c) => sum + c.daily_total, 0);
    const averageDailyEarnings = workDays.length > 0 ? totalEarnings / workDays.length : 0;
    
    // Calculate next payroll date (assuming biweekly)
    const today = new Date();
    const nextPayroll = new Date(today);
    nextPayroll.setDate(today.getDate() + (14 - (today.getDate() % 14)));
    
    return {
      totalEarnings,
      workDaysCompleted: workDays.length,
      averageDailyEarnings,
      completionRate: trial.work_days.length > 0 ? (workDays.length / (trial.work_days.length * 2)) * 100 : 0, // Assume 2 weeks
      nextPayrollDate: nextPayroll.toISOString().split('T')[0],
      daysUntilPayroll: Math.ceil((nextPayroll.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    };
  };

  const shouldShowCheckInReminder = () => {
    if (!trialData) return false;
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Check if today is a work day
    if (!trialData.work_days.includes(todayDayName)) return false;
    
    // Check if already logged today
    const hasLoggedToday = recentCheckIns.some(c => c.check_in_date === todayStr);
    return !hasLoggedToday;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!trialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <ExclamationCircleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Setup Required</h2>
          <p className="text-gray-600 mb-4">Please complete your trial setup first.</p>
          <button
            onClick={() => router.push('/setup')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-green-600 text-white p-4 shadow-lg"
        >
          <div className="max-w-md mx-auto flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="font-medium">
              {searchParams.get('success') === 'checkin' ? 'Daily check-in saved!' : 'Setup completed!'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">{trialData.location}</p>
            </div>
            <button
              onClick={() => router.push('/setup')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Check-in Reminder */}
        {shouldShowCheckInReminder() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-600 text-white rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellIcon className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Ready for today's check-in?</p>
                  <p className="text-sm text-blue-200">Log your daily work in 2 minutes</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/daily-checkin?trial=${trialData.trial_id}`)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Log Work
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCAD(dashboardStats.totalEarnings)}
                  </p>
                  <p className="text-sm text-gray-500">Total Earned</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.workDaysCompleted}
                  </p>
                  <p className="text-sm text-gray-500">Work Days</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCAD(dashboardStats.averageDailyEarnings)}
                  </p>
                  <p className="text-sm text-gray-500">Daily Avg</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <ClockIcon className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.daysUntilPayroll}
                  </p>
                  <p className="text-sm text-gray-500">Days to Pay</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/daily-checkin?trial=${trialData.trial_id}`)}
              className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Daily Check-in</span>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-blue-600" />
            </button>

            <button
              onClick={() => router.push(`/invoice/${trialData.trial_id}`)}
              className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">View Invoice</span>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-green-600" />
            </button>

            <button
              onClick={() => router.push('/setup')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Trial Settings</span>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </motion.div>

        {/* Recent Check-ins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Check-ins</h2>
          {recentCheckIns.length > 0 ? (
            <div className="space-y-3">
              {recentCheckIns.slice(0, 5).map((checkIn, index) => (
                <div key={checkIn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {checkIn.worked_today ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(checkIn.check_in_date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {checkIn.worked_today ? `Worked - ${formatCAD(checkIn.daily_total)}` : 'Day off'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/daily-checkin?trial=${trialData.trial_id}&date=${checkIn.check_in_date}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No check-ins yet</p>
              <button
                onClick={() => router.push(`/daily-checkin?trial=${trialData.trial_id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Start Your First Check-in
              </button>
            </div>
          )}
        </motion.div>

        {/* Trial Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trial Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Ticket #</span>
              <span className="font-medium">{trialData.ticket_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-medium">{trialData.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Company</span>
              <span className="font-medium">{trialData.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Day Rate</span>
              <span className="font-medium">{formatCAD(trialData.day_rate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Equipment Rate</span>
              <span className="font-medium">{formatCAD(trialData.truck_rate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                trialData.status === 'active' ? 'bg-green-100 text-green-800' :
                trialData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {trialData.status.charAt(0).toUpperCase() + trialData.status.slice(1)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 