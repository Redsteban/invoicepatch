'use client';

import React, { useState, useEffect } from 'react';
import PayrollCalendar from '../../components/PayrollCalendar';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  PayrollSchedule,
  PayPeriod 
} from '../../lib/payrollCalculation';

const PayrollCalendarDemo = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [contractorName, setContractorName] = useState('Ricardo Esteban');
  const [payrollSchedule, setPayrollSchedule] = useState<PayrollSchedule | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<PayPeriod | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateSchedule();
  }, [startDate]);

  const generateSchedule = () => {
    setLoading(true);
    try {
      const schedule = calculatePayrollSchedule(startDate, 26);
      const current = getCurrentPayPeriod(schedule);
      
      setPayrollSchedule(schedule);
      setCurrentPeriod(current);
      
      console.log('📅 Payroll schedule generated:', {
        totalPeriods: schedule.periods.length,
        currentPeriod: current?.periodNumber,
        firstPeriodEnd: schedule.firstPeriodEnd
      });
    } catch (error) {
      console.error('❌ Error generating schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const presetDates = [
    { label: 'Start Today', date: new Date().toISOString().split('T')[0] },
    { label: 'Start Monday', date: getNextMonday().toISOString().split('T')[0] },
    { label: 'Start Jan 8, 2024', date: '2024-01-08' },
    { label: 'Start Jan 5, 2024', date: '2024-01-05' },
    { label: 'Start Mid-Week (Wed)', date: getNextWednesday().toISOString().split('T')[0] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📅 Payroll Calendar Component Demo
          </h1>
          <p className="text-gray-600 mb-8">
            Interactive demo showing the PayrollCalendar component with Canadian bi-weekly payroll schedules
          </p>

          {/* Configuration Controls */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Configuration
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Contractor Name
                </label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contractor name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Contract Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Preset Date Buttons */}
            <div className="mt-4">
              <p className="text-sm font-medium text-blue-700 mb-2">Quick presets:</p>
              <div className="flex flex-wrap gap-2">
                {presetDates.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setStartDate(preset.date)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      startDate === preset.date
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateSchedule}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Regenerate Schedule'}
            </button>
          </div>

          {/* Schedule Info */}
          {payrollSchedule && currentPeriod && (
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Schedule Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white rounded p-3">
                  <h3 className="font-medium text-gray-900">Total Periods</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {payrollSchedule.periods.length}
                  </p>
                  <p className="text-gray-600">26 bi-weekly periods</p>
                </div>
                <div className="bg-white rounded p-3">
                  <h3 className="font-medium text-gray-900">Current Period</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    #{currentPeriod.periodNumber}
                  </p>
                  <p className="text-gray-600">
                    {currentPeriod.isPartialPeriod ? 'Partial period' : 'Full period'}
                  </p>
                </div>
                <div className="bg-white rounded p-3">
                  <h3 className="font-medium text-gray-900">First Period End</h3>
                  <p className="text-lg font-bold text-purple-600">
                    {formatDate(payrollSchedule.firstPeriodEnd)}
                  </p>
                  <p className="text-gray-600">
                    {currentPeriod.daysInPeriod} days
                  </p>
                </div>
                <div className="bg-white rounded p-3">
                  <h3 className="font-medium text-gray-900">Next Deadline</h3>
                  <p className="text-lg font-bold text-orange-600">
                    {formatDate(currentPeriod.submissionDeadline)}
                  </p>
                  <p className="text-gray-600">Submission due</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PayrollCalendar Component Demo */}
        {payrollSchedule && currentPeriod && (
          <PayrollCalendar
            periods={payrollSchedule.periods}
            currentPeriod={currentPeriod.periodNumber}
            contractorName={contractorName}
            showFullSchedule={false}
          />
        )}

        {/* Component Usage Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🛠️ Component Usage
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Basic Usage</h3>
            <pre className="text-sm bg-white p-4 rounded border overflow-x-auto text-gray-700">
{`import PayrollCalendar from '@/components/PayrollCalendar';
import { calculatePayrollSchedule, getCurrentPayPeriod } from '@/lib/payrollCalculation';

function ContractorDashboard({ contractorData }) {
  const schedule = calculatePayrollSchedule(contractorData.startDate, 26);
  const currentPeriod = getCurrentPayPeriod(schedule);
  
  return (
    <PayrollCalendar
      periods={schedule.periods}
      currentPeriod={currentPeriod.periodNumber}
      contractorName={contractorData.name}
      showFullSchedule={false}
    />
  );
}`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Props</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li><code className="bg-blue-100 px-2 py-1 rounded">periods</code> - Array of PayPeriod objects</li>
                <li><code className="bg-blue-100 px-2 py-1 rounded">currentPeriod</code> - Current period number</li>
                <li><code className="bg-blue-100 px-2 py-1 rounded">contractorName</code> - Optional contractor name</li>
                <li><code className="bg-blue-100 px-2 py-1 rounded">showFullSchedule</code> - Show all periods initially</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3">Features</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• Visual status indicators (Active, Upcoming, Past)</li>
                <li>• Expandable period details</li>
                <li>• Current period highlighting</li>
                <li>• Responsive design</li>
                <li>• Schedule summary statistics</li>
                <li>• Canadian date formatting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Integration Example */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔗 Database Integration Example
          </h2>
          
          <pre className="text-sm bg-gray-50 p-4 rounded border overflow-x-auto text-gray-700">
{`// Example: Loading payroll data for contractor dashboard
async function getContractorPayroll(contractorId: string) {
  const { data: contractor } = await supabase
    .from('trial_invoices')
    .select('*')
    .eq('id', contractorId)
    .single();

  // If payroll schedule is stored in database
  if (contractor.payroll_schedule) {
    return {
      periods: contractor.payroll_schedule,
      currentPeriod: contractor.current_period,
      contractorName: contractor.contractor_name
    };
  }

  // Or calculate on-demand
  const schedule = calculatePayrollSchedule(contractor.start_date, 26);
  const currentPeriod = getCurrentPayPeriod(schedule);
  
  return {
    periods: schedule.periods,
    currentPeriod: currentPeriod.periodNumber,
    contractorName: contractor.contractor_name
  };
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

function getNextMonday(): Date {
  const today = new Date();
  const daysUntilMonday = (8 - today.getDay()) % 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday;
}

function getNextWednesday(): Date {
  const today = new Date();
  const daysUntilWednesday = (10 - today.getDay()) % 7;
  const nextWednesday = new Date(today);
  nextWednesday.setDate(today.getDate() + daysUntilWednesday);
  return nextWednesday;
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default PayrollCalendarDemo; 