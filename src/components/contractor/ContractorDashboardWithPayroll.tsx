'use client';

import React, { useState, useEffect } from 'react';
import PayrollCalendar from '../PayrollCalendar';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  getUpcomingDeadlines,
  PayrollSchedule,
  PayPeriod 
} from '../../lib/payroll';

interface ContractorDashboardProps {
  contractorData: {
    id: string;
    name: string;
    email: string;
    startDate: string;
    dayRate: number;
    // Existing payroll data if stored in database
    payrollSchedule?: PayPeriod[];
    currentPeriod?: number;
    nextSubmissionDeadline?: string;
    nextPaymentDate?: string;
  };
}

const ContractorDashboardWithPayroll: React.FC<ContractorDashboardProps> = ({ contractorData }) => {
  const [payrollData, setPayrollData] = useState<{
    schedule: PayrollSchedule;
    currentPeriod: PayPeriod;
    upcomingDeadlines: PayPeriod[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [workHours, setWorkHours] = useState(0);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);

  useEffect(() => {
    loadPayrollData();
  }, [contractorData]);

  const loadPayrollData = () => {
    try {
      let schedule: PayrollSchedule;
      let currentPeriod: PayPeriod | null;

      // Use stored payroll data if available
      if (contractorData.payrollSchedule && contractorData.currentPeriod) {
        schedule = {
          periods: contractorData.payrollSchedule.map(p => ({
            ...p,
            startDate: typeof p.startDate === 'string' ? new Date(p.startDate) : p.startDate,
            endDate: typeof p.endDate === 'string' ? new Date(p.endDate) : p.endDate,
            submissionDeadline: typeof p.submissionDeadline === 'string' ? new Date(p.submissionDeadline) : p.submissionDeadline,
            paymentDate: typeof p.paymentDate === 'string' ? new Date(p.paymentDate) : p.paymentDate,
          })),
          firstPeriodEnd: typeof contractorData.payrollSchedule[0]?.endDate === 'string' ? new Date(contractorData.payrollSchedule[0]?.endDate) : contractorData.payrollSchedule[0]?.endDate || new Date(contractorData.startDate),
          contractStartDate: typeof contractorData.startDate === 'string' ? new Date(contractorData.startDate) : contractorData.startDate
        };
        currentPeriod = schedule.periods.find(p => p.periodNumber === contractorData.currentPeriod) || schedule.periods[0];
      } else {
        // Calculate on-demand
        schedule = calculatePayrollSchedule(contractorData.startDate, 26);
        currentPeriod = getCurrentPayPeriod(schedule);
      }
      if (!currentPeriod) {
        setPayrollData(null);
        setLoading(false);
        return;
      }

      const upcomingDeadlines = getUpcomingDeadlines(schedule, 60);

      setPayrollData({
        schedule,
        currentPeriod,
        upcomingDeadlines
      });

      console.log('📊 Payroll data loaded for contractor:', contractorData.name);
    } catch (error) {
      console.error('❌ Error loading payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (payrollData?.currentPeriod && workHours > 0) {
      const earnings = workHours * contractorData.dayRate;
      setEstimatedEarnings(earnings);
    }
  }, [workHours, contractorData.dayRate, payrollData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!payrollData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load payroll data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {contractorData.name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's your payroll overview and current work period information.
        </p>
      </div>

      {/* Current Period Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Current Period
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            #{payrollData.currentPeriod.periodNumber}
          </p>
          <p className="text-sm text-gray-600">
            {payrollData.currentPeriod.daysInPeriod} working days
            {payrollData.currentPeriod.isPartialPeriod && ' (Partial)'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Submission Due
          </h3>
          <p className="text-lg font-bold text-orange-600">
            {formatDate(payrollData.currentPeriod.submissionDeadline)}
          </p>
          <p className="text-sm text-gray-600">
            {getDaysUntilDeadline(payrollData.currentPeriod.submissionDeadline)} days remaining
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Payment Date
          </h3>
          <p className="text-lg font-bold text-green-600">
            {formatDate(payrollData.currentPeriod.paymentDate)}
          </p>
          <p className="text-sm text-gray-600">Direct deposit</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Day Rate
          </h3>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(contractorData.dayRate)}
          </p>
          <p className="text-sm text-gray-600">Per working day</p>
        </div>
      </div>

      {/* Time Tracking & Earnings Estimate */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ⏱️ Current Period Tracking
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days Worked This Period
            </label>
            <input
              type="number"
              min="0"
              max={payrollData.currentPeriod.daysInPeriod}
              value={workHours}
              onChange={(e) => setWorkHours(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter days worked"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {payrollData.currentPeriod.daysInPeriod} days for this period
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Earnings
            </label>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(estimatedEarnings)}
              </p>
              <p className="text-sm text-green-700">
                {workHours} days × {formatCurrency(contractorData.dayRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Calendar */}
      <PayrollCalendar
        periods={payrollData.schedule.periods}
        currentPeriod={payrollData.currentPeriod.periodNumber}
        contractorName={contractorData.name}
        showFullSchedule={false}
      />

      {/* Upcoming Deadlines */}
      {payrollData.upcomingDeadlines.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📅 Upcoming Deadlines
          </h2>
          
          <div className="space-y-3">
            {payrollData.upcomingDeadlines.slice(0, 3).map((period) => (
              <div key={period.periodNumber} className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Period {period.periodNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(period.startDate)} - {formatDate(period.endDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-600">
                    Submit: {formatDate(period.submissionDeadline)}
                  </p>
                  <p className="text-sm text-green-600">
                    Pay: {formatDate(period.paymentDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🚀 Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-blue-600 text-2xl mb-2">📝</div>
            <p className="font-medium text-blue-900">Submit Timesheet</p>
            <p className="text-sm text-blue-700">For current period</p>
          </button>
          
          <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-green-600 text-2xl mb-2">💰</div>
            <p className="font-medium text-green-900">View Payments</p>
            <p className="text-sm text-green-700">Payment history</p>
          </button>
          
          <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-purple-600 text-2xl mb-2">📊</div>
            <p className="font-medium text-purple-900">Download Reports</p>
            <p className="text-sm text-purple-700">Tax & earnings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

function getDaysUntilDeadline(deadline: Date | string): number {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const today = new Date();
  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.max(0, daysDiff);
}

export default ContractorDashboardWithPayroll; 