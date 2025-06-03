'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  BanknotesIcon,
  TruckIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { 
  workPeriodIntelligence, 
  TimeEntry, 
  MissingTimeAlert 
} from '../../lib/work-period-intelligence';
import { 
  stackPayrollCalendar, 
  PayrollPeriod, 
  formatDate, 
  formatDateShort, 
  getDaysUntil, 
  isOverdue 
} from '../../lib/payroll-calendar';

interface PeriodAnalysis {
  currentPeriod: PayrollPeriod | null;
  nextPeriod: PayrollPeriod | null;
  workDaysInPeriod: number;
  workDaysCompleted: number;
  workDaysRemaining: number;
  timeEntriesCount: number;
  missingDaysCount: number;
  completionPercentage: number;
  estimatedEarnings: number;
  holidaysInPeriod: Array<{
    date: Date;
    name: string;
    isPaid: boolean;
  }>;
}

interface PeriodBoundary {
  type: 'start' | 'end' | 'cutoff' | 'payday';
  date: Date;
  description: string;
  status: 'past' | 'today' | 'upcoming';
  daysAway: number;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

const PeriodBoundaryManager = () => {
  const [periodAnalysis, setPeriodAnalysis] = useState<PeriodAnalysis | null>(null);
  const [periodBoundaries, setPeriodBoundaries] = useState<PeriodBoundary[]>([]);
  const [missingAlerts, setMissingAlerts] = useState<MissingTimeAlert[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [showPartialPeriodSetup, setShowPartialPeriodSetup] = useState(false);

  const contractorId = 'contractor-001'; // In real app, get from auth
  const standardDayRate = 850; // Stack standard day rate

  useEffect(() => {
    analyzePeriodBoundaries();
    loadMissingAlerts();
  }, []);

  const analyzePeriodBoundaries = () => {
    const currentPeriod = stackPayrollCalendar.getCurrentPeriod();
    const nextPeriod = stackPayrollCalendar.getNextPeriod();
    const today = new Date();

    if (!currentPeriod) return;

    // Analyze current period
    const workDaysInPeriod = stackPayrollCalendar.calculateWorkDays(currentPeriod);
    const timeEntries = workPeriodIntelligence.getTimeEntriesForContractor(contractorId);
    const periodEntries = timeEntries.filter(entry =>
      entry.date >= currentPeriod.workPeriodStart && entry.date <= currentPeriod.workPeriodEnd
    );

    const workDaysCompleted = periodEntries.length;
    const workDaysRemaining = Math.max(0, workDaysInPeriod - workDaysCompleted);
    const completionPercentage = Math.round((workDaysCompleted / workDaysInPeriod) * 100);
    const estimatedEarnings = workDaysCompleted * standardDayRate;

    // Detect holidays in period (simplified - in real app would use holiday API)
    const holidaysInPeriod = detectHolidaysInPeriod(currentPeriod);

    const analysis: PeriodAnalysis = {
      currentPeriod,
      nextPeriod,
      workDaysInPeriod,
      workDaysCompleted,
      workDaysRemaining,
      timeEntriesCount: periodEntries.length,
      missingDaysCount: workDaysInPeriod - workDaysCompleted,
      completionPercentage,
      estimatedEarnings,
      holidaysInPeriod
    };

    setPeriodAnalysis(analysis);

    // Generate period boundaries
    const boundaries: PeriodBoundary[] = [];

    // Current period boundaries
    const cutoffDays = getDaysUntil(currentPeriod.cutOffDate);
    const payDays = getDaysUntil(currentPeriod.payDate);

    if (cutoffDays >= 0) {
      boundaries.push({
        type: 'cutoff',
        date: currentPeriod.cutOffDate,
        description: 'Invoice submission deadline',
        status: cutoffDays === 0 ? 'today' : cutoffDays < 0 ? 'past' : 'upcoming',
        daysAway: cutoffDays,
        importance: cutoffDays <= 1 ? 'critical' : cutoffDays <= 3 ? 'high' : 'medium'
      });
    }

    if (payDays >= 0) {
      boundaries.push({
        type: 'payday',
        date: currentPeriod.payDate,
        description: 'Payment date',
        status: payDays === 0 ? 'today' : payDays < 0 ? 'past' : 'upcoming',
        daysAway: payDays,
        importance: payDays <= 0 ? 'high' : 'medium'
      });
    }

    // Next period boundaries
    if (nextPeriod) {
      const nextStartDays = getDaysUntil(nextPeriod.workPeriodStart);
      const nextCutoffDays = getDaysUntil(nextPeriod.cutOffDate);

      boundaries.push({
        type: 'start',
        date: nextPeriod.workPeriodStart,
        description: 'Next period starts',
        status: nextStartDays === 0 ? 'today' : nextStartDays < 0 ? 'past' : 'upcoming',
        daysAway: nextStartDays,
        importance: nextStartDays <= 7 ? 'medium' : 'low'
      });

      boundaries.push({
        type: 'cutoff',
        date: nextPeriod.cutOffDate,
        description: 'Next period deadline',
        status: nextCutoffDays === 0 ? 'today' : nextCutoffDays < 0 ? 'past' : 'upcoming',
        daysAway: nextCutoffDays,
        importance: 'low'
      });
    }

    setPeriodBoundaries(boundaries.sort((a, b) => a.daysAway - b.daysAway));
  };

  const detectHolidaysInPeriod = (period: PayrollPeriod) => {
    // Simplified holiday detection - in real app would use comprehensive holiday API
    const holidays = [];
    const canadianHolidays = [
      { date: new Date('2025-01-01'), name: 'New Year\'s Day', isPaid: true },
      { date: new Date('2025-02-17'), name: 'Family Day (Alberta)', isPaid: true },
      { date: new Date('2025-04-18'), name: 'Good Friday', isPaid: true },
      { date: new Date('2025-05-19'), name: 'Victoria Day', isPaid: true },
      { date: new Date('2025-07-01'), name: 'Canada Day', isPaid: true },
      { date: new Date('2025-08-04'), name: 'Heritage Day (Alberta)', isPaid: true },
      { date: new Date('2025-09-01'), name: 'Labour Day', isPaid: true },
      { date: new Date('2025-10-13'), name: 'Thanksgiving', isPaid: true },
      { date: new Date('2025-11-11'), name: 'Remembrance Day', isPaid: true },
      { date: new Date('2025-12-25'), name: 'Christmas Day', isPaid: true },
      { date: new Date('2025-12-26'), name: 'Boxing Day', isPaid: true }
    ];

    return canadianHolidays.filter(holiday =>
      holiday.date >= period.workPeriodStart && holiday.date <= period.workPeriodEnd
    );
  };

  const loadMissingAlerts = () => {
    const alerts = workPeriodIntelligence.getMissingTimeAlerts(contractorId);
    setMissingAlerts(alerts);
  };

  const getBoundaryIcon = (type: string) => {
    switch (type) {
      case 'start':
        return <ArrowRightIcon className="h-5 w-5" />;
      case 'end':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'cutoff':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'payday':
        return <BanknotesIcon className="h-5 w-5" />;
      default:
        return <CalendarDaysIcon className="h-5 w-5" />;
    }
  };

  const getBoundaryColor = (importance: string, status: string) => {
    if (status === 'past') return 'bg-gray-100 text-gray-600 border-gray-200';
    
    switch (importance) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handlePartialPeriodSetup = () => {
    // In real app, this would guide new contractors through partial period setup
    setShowPartialPeriodSetup(true);
  };

  const generateMissingTimeEntries = () => {
    if (!periodAnalysis?.currentPeriod) return;

    // Generate time entries for missing work days
    const entries = workPeriodIntelligence.generateWeekBulkEntry(
      contractorId, 
      periodAnalysis.currentPeriod.workPeriodStart
    );

    console.log('Generated missing entries:', entries);
    // In real app, would save these entries
  };

  if (!periodAnalysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading period analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDaysIcon className="h-6 w-6" />
              Work Period Analysis
            </h2>
            <p className="text-purple-100">
              Stack Production Testing - Saturday to Friday periods
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{periodAnalysis.completionPercentage}%</div>
            <div className="text-purple-100 text-sm">Period Complete</div>
          </div>
        </div>

        {periodAnalysis.currentPeriod && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">{periodAnalysis.workDaysCompleted}</div>
              <div className="text-sm text-purple-100">Days Worked</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">{periodAnalysis.workDaysRemaining}</div>
              <div className="text-sm text-purple-100">Days Remaining</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">${periodAnalysis.estimatedEarnings.toLocaleString()}</div>
              <div className="text-sm text-purple-100">Period Earnings</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">{getDaysUntil(periodAnalysis.currentPeriod.cutOffDate)}</div>
              <div className="text-sm text-purple-100">Days to Deadline</div>
            </div>
          </div>
        )}
      </div>

      {/* Period Boundaries Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Period Boundaries & Deadlines</h3>
        
        <div className="space-y-3">
          {periodBoundaries.map((boundary, index) => (
            <motion.div
              key={`${boundary.type}-${boundary.date.getTime()}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${getBoundaryColor(boundary.importance, boundary.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getBoundaryIcon(boundary.type)}
                  <div>
                    <h4 className="font-semibold">{boundary.description}</h4>
                    <p className="text-sm">{formatDate(boundary.date)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold">
                    {boundary.status === 'today' ? 'TODAY' :
                     boundary.status === 'past' ? 'PAST' :
                     `${boundary.daysAway} days`}
                  </div>
                  <div className="text-xs capitalize">{boundary.importance} priority</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Holiday Management */}
      {periodAnalysis.holidaysInPeriod.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            Holidays in Current Period
          </h3>
          
          <div className="space-y-2">
            {periodAnalysis.holidaysInPeriod.map((holiday, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <div className="font-medium text-gray-900">{holiday.name}</div>
                  <div className="text-sm text-gray-600">{formatDate(holiday.date)}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  holiday.isPaid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {holiday.isPaid ? 'Paid Holiday' : 'Unpaid'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Time Recovery */}
      {missingAlerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-orange-900 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5" />
              Missing Time Recovery ({missingAlerts.length} days)
            </h3>
            
            <button
              onClick={generateMissingTimeEntries}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
            >
              Auto-Fill Missing Days
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {missingAlerts.slice(0, 6).map((alert, index) => (
              <div key={alert.id} className="bg-white rounded-lg p-3">
                <div className="font-medium text-gray-900">{formatDate(alert.date)}</div>
                <div className="text-sm text-gray-600">{alert.message}</div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {alert.severity} priority
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Contractor Setup */}
      {periodAnalysis.timeEntriesCount === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <div className="text-center">
            <InformationCircleIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Welcome to Stack Production Testing!
            </h3>
            <p className="text-blue-800 mb-4">
              Set up your partial period for mid-period start. We'll help you configure your schedule.
            </p>
            <button
              onClick={handlePartialPeriodSetup}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Setup Partial Period
            </button>
          </div>
        </motion.div>
      )}

      {/* Period Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Period Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">Optimization Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete time entries daily to avoid last-minute rush</li>
              <li>• Use GPS verification for accurate site tracking</li>
              <li>• Document weather conditions for extreme weather pay</li>
              <li>• Track equipment usage for rental charges</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Stack Integration Benefits</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Perfect alignment with biweekly payroll</li>
              <li>• Automatic project code suggestions</li>
              <li>• Standard production testing rates</li>
              <li>• Holiday pay calculations included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodBoundaryManager; 