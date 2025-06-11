'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  getUpcomingDeadlines, 
  formatPeriodDates,
  PayrollSchedule,
  PayPeriod 
} from '../../../lib/payrollCalculation';

const PayrollDemo = () => {
  const [contractStartDate, setContractStartDate] = useState('');
  const [schedule, setSchedule] = useState<PayrollSchedule | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<PayPeriod | null>(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<PayPeriod[]>([]);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setContractStartDate(today);
  }, []);

  const handleCalculate = () => {
    if (!contractStartDate) return;
    
    const newSchedule = calculatePayrollSchedule(contractStartDate, 12); // 6 months
    setSchedule(newSchedule);
    
    const current = getCurrentPayPeriod(newSchedule);
    setCurrentPeriod(current);
    
    const upcoming = getUpcomingDeadlines(newSchedule, 60); // Next 60 days
    setUpcomingDeadlines(upcoming);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-CA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDayOfWeek = (date: Date) => {
    return date.toLocaleDateString('en-CA', { weekday: 'long' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🇨🇦 Canadian Contractor Payroll Calculator
          </h1>
          <p className="text-gray-600 mb-8">
            Calculate bi-weekly pay periods with Canadian contractor requirements
          </p>

          {/* Input Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Contract Details</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Contract Start Date
                </label>
                <input
                  type="date"
                  value={contractStartDate}
                  onChange={(e) => setContractStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleCalculate}
                disabled={!contractStartDate}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calculate Schedule
              </button>
            </div>
          </div>

          {schedule && (
            <>
              {/* Current Period */}
              {currentPeriod && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-green-900 mb-4">
                    📅 Current Pay Period
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-1">Period</h3>
                      <p className="text-lg font-semibold text-green-600">
                        #{currentPeriod.periodNumber}
                        {currentPeriod.isPartialPeriod && (
                          <span className="text-sm text-orange-600 ml-2">(Partial)</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-1">Work Period</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(currentPeriod.startDate)} - {formatDate(currentPeriod.endDate)}
                      </p>
                      <p className="text-xs text-gray-500">{currentPeriod.daysInPeriod} days</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-1">Submit By</h3>
                      <p className="text-sm font-semibold text-orange-600">
                        {formatDate(currentPeriod.submissionDeadline)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ({getDayOfWeek(currentPeriod.submissionDeadline)})
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-1">Payment Date</h3>
                      <p className="text-sm font-semibold text-green-600">
                        {formatDate(currentPeriod.paymentDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ({getDayOfWeek(currentPeriod.paymentDate)})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Deadlines */}
              {upcomingDeadlines.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-orange-900 mb-4">
                    ⏰ Upcoming Submission Deadlines (Next 60 Days)
                  </h2>
                  <div className="space-y-3">
                    {upcomingDeadlines.slice(0, 5).map((period) => (
                      <div key={period.periodNumber} className="bg-white rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-900">
                            Period #{period.periodNumber}
                          </span>
                          <span className="text-gray-600 ml-2">
                            ({formatDate(period.startDate)} - {formatDate(period.endDate)})
                          </span>
                          {period.isPartialPeriod && (
                            <span className="text-orange-600 text-sm ml-2">(Partial)</span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-orange-600">
                            Submit: {formatDate(period.submissionDeadline)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Pay: {formatDate(period.paymentDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Schedule */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📋 Complete Pay Schedule (Next 12 Periods)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Work Period</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Days</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Submit By</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.periods.map((period) => (
                        <tr 
                          key={period.periodNumber} 
                          className={`border-b border-gray-200 ${
                            currentPeriod?.periodNumber === period.periodNumber 
                              ? 'bg-green-100' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <td className="py-3 px-4 font-medium">
                            #{period.periodNumber}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p>{formatDate(period.startDate)} - {formatDate(period.endDate)}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {period.daysInPeriod}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{formatDate(period.submissionDeadline)}</p>
                              <p className="text-xs text-gray-500">
                                {getDayOfWeek(period.submissionDeadline)}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{formatDate(period.paymentDate)}</p>
                              <p className="text-xs text-gray-500">
                                {getDayOfWeek(period.paymentDate)}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {period.isPartialPeriod && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                  Partial
                                </span>
                              )}
                              {currentPeriod?.periodNumber === period.periodNumber && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Rules */}
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  📋 Canadian Contractor Payroll Rules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-blue-800 mb-2">Pay Period Structure</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Bi-weekly periods (14 days)</li>
                      <li>• Periods typically end on Thursdays</li>
                      <li>• First period may be partial</li>
                      <li>• Automatic calculation of all future periods</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 mb-2">Submission & Payment</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Submit invoices by day after period ends</li>
                      <li>• Payment on Friday after period ends</li>
                      <li>• Automatic adjustment for weekends/holidays</li>
                      <li>• Canadian statutory holidays considered</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollDemo; 