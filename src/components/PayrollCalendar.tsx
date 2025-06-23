'use client';

import React, { useState } from 'react';
import { PayPeriod } from '@/lib/payroll';

interface PayrollCalendarProps {
  periods: PayPeriod[]
  currentPeriod: number
  contractorName?: string
  showFullSchedule?: boolean
}

export default function PayrollCalendar({ 
  periods, 
  currentPeriod, 
  contractorName,
  showFullSchedule = false 
}: PayrollCalendarProps) {
  const [viewAll, setViewAll] = useState(showFullSchedule);
  const [selectedPeriod, setSelectedPeriod] = useState<PayPeriod | null>(null);

  const displayPeriods = viewAll ? periods : periods.slice(0, 5);
  const today = new Date();

  const isPeriodActive = (period: PayPeriod) => {
    const startDate = typeof period.startDate === 'string' ? new Date(period.startDate) : period.startDate;
    const endDate = typeof period.endDate === 'string' ? new Date(period.endDate) : period.endDate;
    return today >= startDate && today <= endDate;
  };

  const isPeriodUpcoming = (period: PayPeriod) => {
    const startDate = typeof period.startDate === 'string' ? new Date(period.startDate) : period.startDate;
    return today < startDate;
  };

  const isPeriodPast = (period: PayPeriod) => {
    const endDate = typeof period.endDate === 'string' ? new Date(period.endDate) : period.endDate;
    return today > endDate;
  };

  const getStatusColor = (period: PayPeriod) => {
    if (isPeriodActive(period)) return 'border-blue-500 bg-blue-50';
    if (isPeriodUpcoming(period)) return 'border-green-200 bg-green-50';
    if (isPeriodPast(period)) return 'border-gray-300 bg-gray-50';
    return 'border-gray-200';
  };

  const getStatusText = (period: PayPeriod) => {
    if (isPeriodActive(period)) return 'Active Period';
    if (isPeriodUpcoming(period)) return 'Upcoming';
    if (isPeriodPast(period)) return 'Completed';
    return '';
  };

  const getStatusIcon = (period: PayPeriod) => {
    if (isPeriodActive(period)) return '🟢';
    if (isPeriodUpcoming(period)) return '⏳';
    if (isPeriodPast(period)) return '✅';
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            🗓️ Payroll Schedule
          </h3>
          {contractorName && (
            <p className="text-sm text-gray-600 mt-1">
              For {contractorName}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Period {currentPeriod} of {periods.length}
          </span>
          <div className="flex space-x-1">
            <span className="text-xs">🟢 Active</span>
            <span className="text-xs">⏳ Upcoming</span>
            <span className="text-xs">✅ Past</span>
          </div>
        </div>
      </div>

      {/* Current Period Highlight */}
      {periods.find(p => isPeriodActive(p)) && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Current Pay Period</h4>
              <p className="text-blue-100">
                Period {currentPeriod} • {periods.find(p => isPeriodActive(p))?.daysInPeriod} working days
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Next submission:</p>
              <p className="font-bold">
                {formatDate(periods.find(p => isPeriodActive(p))?.submissionDeadline)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {displayPeriods.map((period) => (
          <div 
            key={period.periodNumber}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${getStatusColor(period)}`}
            onClick={() => setSelectedPeriod(selectedPeriod?.periodNumber === period.periodNumber ? null : period)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getStatusIcon(period)}</span>
                  <p className="font-medium text-gray-900">
                    Period {period.periodNumber}
                  </p>
                  {period.isPartialPeriod && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Partial Period
                    </span>
                  )}
                  <span className="text-xs text-gray-500 font-medium">
                    {getStatusText(period)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="font-medium">
                    {formatDate(period.startDate)} - {formatDate(period.endDate)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {period.daysInPeriod} working days
                  </p>
                </div>
              </div>
              
              <div className="text-right text-sm ml-4">
                <div className="mb-2">
                  <p className="text-gray-500 text-xs">Submit by:</p>
                  <p className="font-semibold text-orange-600">
                    {formatDate(period.submissionDeadline)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Payment date:</p>
                  <p className="font-semibold text-green-600">
                    {formatDate(period.paymentDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Expanded Period Details */}
            {selectedPeriod?.periodNumber === period.periodNumber && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium text-gray-900 mb-2">Work Period</h5>
                    <ul className="text-gray-600 text-xs space-y-1">
                      <li>• Start work: {formatDate(period.startDate)}</li>
                      <li>• End work: {formatDate(period.endDate)}</li>
                      <li>• Total days: {period.daysInPeriod}</li>
                      {period.isPartialPeriod && (
                        <li>• Note: Partial period (started mid-cycle)</li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium text-gray-900 mb-2">Submission</h5>
                    <ul className="text-gray-600 text-xs space-y-1">
                      <li>• Deadline: {formatDate(period.submissionDeadline)}</li>
                      <li>• Submit timesheet & expenses</li>
                      <li>• Late submissions may delay payment</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium text-gray-900 mb-2">Payment</h5>
                    <ul className="text-gray-600 text-xs space-y-1">
                      <li>• Payment date: {formatDate(period.paymentDate)}</li>
                      <li>• Electronic transfer</li>
                      <li>• Includes approved expenses</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!viewAll && periods.length > 5 && (
        <button 
          onClick={() => setViewAll(true)}
          className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
        >
          View full year schedule ({periods.length} periods) →
        </button>
      )}

      {viewAll && periods.length > 5 && (
        <button 
          onClick={() => setViewAll(false)}
          className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
        >
          ← Show less (next 5 periods)
        </button>
      )}

      {/* Schedule Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {periods.filter(p => isPeriodPast(p)).length}
            </p>
            <p className="text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {periods.filter(p => isPeriodActive(p)).length}
            </p>
            <p className="text-gray-600">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {periods.filter(p => isPeriodUpcoming(p)).length}
            </p>
            <p className="text-gray-600">Upcoming</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return 'TBD';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Handle invalid dates
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  return new Intl.DateTimeFormat('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
} 