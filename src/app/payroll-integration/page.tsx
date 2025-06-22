'use client';

import React, { useState } from 'react';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  getUpcomingDeadlines 
} from '@/lib/payroll';

const PayrollIntegrationDemo = () => {
  const [formData, setFormData] = useState({
    name: 'Ricardo Esteban',
    email: 'redsteban@hotmail.com',
    phone: '(555) 123-4567',
    startDate: new Date().toISOString().split('T')[0],
    dayRate: 450,
    truckRate: 150
  });

  const [setupResult, setSetupResult] = useState<any>(null);
  const [payrollData, setPayrollData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const previewPayroll = () => {
    try {
      const schedule = calculatePayrollSchedule(formData.startDate, 12);
      const currentPeriod = getCurrentPayPeriod(schedule);
      const upcomingDeadlines = getUpcomingDeadlines(schedule, 60);

      setPayrollData({
        schedule,
        currentPeriod,
        upcomingDeadlines,
        summary: {
          totalPeriods: schedule.periods.length,
          firstPeriodEnd: schedule.firstPeriodEnd,
          hasPartialFirstPeriod: schedule.periods[0]?.isPartialPeriod
        }
      });
    } catch (error) {
      console.error('Payroll preview error:', error);
    }
  };

  const setupContractorWithPayroll = async () => {
    setLoading(true);
    try {
      // Method 1: Use enhanced API with payroll calculation
      const enhancedResponse = await fetch('/api/payroll/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractStartDate: formData.startDate,
          numberOfPeriods: 26
        })
      });

      const payrollResult = await enhancedResponse.json();

      if (payrollResult.success) {
        // Method 2: Setup contractor with calculated payroll data
        const setupResponse = await fetch('/api/contractor/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            customStartDate: formData.startDate,
            useCustomStartDate: true,
            // Include calculated payroll data
            payrollSchedule: payrollResult.data.schedule,
            currentPeriod: payrollResult.data.currentPeriod,
            upcomingDeadlines: payrollResult.data.upcomingDeadlines
          })
        });

        const setupResult = await setupResponse.json();
        
        // Combine results
        setSetupResult({
          ...setupResult,
          payrollData: payrollResult.data,
          method: 'api_integration'
        });
      }
    } catch (error) {
      console.error('Setup error:', error);
      setSetupResult({
        success: false,
        error: 'Failed to setup contractor with payroll'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-CA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Payroll System Integration Demo
          </h1>
          <p className="text-gray-600 mb-8">
            Demonstrates how to integrate Canadian payroll calculations into contractor setup
          </p>

          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Contractor Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Contract Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Day Rate ($)
                    </label>
                    <input
                      type="number"
                      value={formData.dayRate}
                      onChange={(e) => handleInputChange('dayRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Truck Rate ($)
                    </label>
                    <input
                      type="number"
                      value={formData.truckRate}
                      onChange={(e) => handleInputChange('truckRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={previewPayroll}
                    className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Preview Payroll
                  </button>
                  <button
                    onClick={setupContractorWithPayroll}
                    disabled={loading}
                    className="flex-1 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Setting up...' : 'Setup with Payroll'}
                  </button>
                </div>
              </div>
            </div>

            {/* Integration Code */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Integration Code
              </h2>
              <pre className="text-sm bg-white p-4 rounded border overflow-x-auto text-gray-700">
{`// Enhanced contractor setup with payroll
import { calculatePayrollSchedule } from '@/lib/payrollCalculation'

export async function POST(request: NextRequest) {
  const { name, email, startDate } = await request.json()
  
  // Calculate Canadian payroll schedule
  const schedule = calculatePayrollSchedule(startDate, 26)
  const currentPeriod = getCurrentPayPeriod(schedule)
  
  // Create contractor with payroll data
  const { data: invoice, error } = await supabaseAdmin
    .from('trial_invoices')
    .insert([{
      contractor_name: name,
      contractor_email: email,
      start_date: startDate,
      first_period_end: schedule.firstPeriodEnd,
      payroll_schedule: schedule.periods,
      current_period: currentPeriod?.periodNumber,
      next_submission_deadline: currentPeriod?.submissionDeadline,
      next_payment_date: currentPeriod?.paymentDate,
      is_partial_first_period: schedule.periods[0]?.isPartialPeriod
    }])
    .select()
    .single()
    
  return NextResponse.json({
    success: true,
    invoiceId: invoice.id,
    currentPeriod,
    nextSubmission: currentPeriod?.submissionDeadline
  })
}`}
              </pre>
            </div>
          </div>

          {/* Payroll Preview */}
          {payrollData && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                📊 Payroll Preview
              </h2>
              
              {/* Current Period */}
              {payrollData.currentPeriod && (
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-gray-900 mb-3">Current Pay Period</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Period:</span>
                      <p className="text-green-600">
                        #{payrollData.currentPeriod.periodNumber}
                        {payrollData.currentPeriod.isPartialPeriod && ' (Partial)'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Work Period:</span>
                      <p>{formatDate(payrollData.currentPeriod.startDate)} - {formatDate(payrollData.currentPeriod.endDate)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submit By:</span>
                      <p className="text-orange-600">{formatDate(payrollData.currentPeriod.submissionDeadline)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment:</span>
                      <p className="text-green-600">{formatDate(payrollData.currentPeriod.paymentDate)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Schedule Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Total Periods:</span>
                    <p>{payrollData.summary.totalPeriods}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">First Period Ends:</span>
                    <p>{formatDate(payrollData.summary.firstPeriodEnd)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Partial First Period:</span>
                    <p>{payrollData.summary.hasPartialFirstPeriod ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Setup Result */}
          {setupResult && (
            <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">
                🚀 Setup Result
              </h2>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className={`w-3 h-3 rounded-full mr-2 ${setupResult.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium">{setupResult.success ? 'Setup Successful' : 'Setup Failed'}</span>
                </div>
                
                {setupResult.success && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Invoice ID:</span> {setupResult.invoiceId}</p>
                    <p><span className="font-medium">Message:</span> {setupResult.message}</p>
                    {setupResult.payrollData && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="font-medium mb-2">Integrated Payroll Data:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Current Period: #{setupResult.payrollData.currentPeriod?.periodNumber}</li>
                          <li>• Next Submission: {setupResult.payrollData.currentPeriod?.submissionDeadline && formatDate(setupResult.payrollData.currentPeriod.submissionDeadline)}</li>
                          <li>• Next Payment: {setupResult.payrollData.currentPeriod?.paymentDate && formatDate(setupResult.payrollData.currentPeriod.paymentDate)}</li>
                          <li>• Upcoming Deadlines: {setupResult.payrollData.upcomingDeadlines?.length || 0}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {!setupResult.success && (
                  <div className="text-sm text-red-600">
                    <p><span className="font-medium">Error:</span> {setupResult.error}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Database Schema */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🗃️ Database Schema Enhancement
            </h2>
            <p className="text-gray-600 mb-4">
              Add these columns to your <code className="bg-gray-200 px-2 py-1 rounded">trial_invoices</code> table:
            </p>
            <pre className="text-sm bg-white p-4 rounded border overflow-x-auto text-gray-700">
{`-- Enhanced payroll columns
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS payroll_type VARCHAR(50) DEFAULT 'canadian_biweekly';
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS payroll_schedule JSONB;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS first_period_end DATE;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS current_period INTEGER DEFAULT 1;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS current_period_start DATE;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS current_period_end DATE;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS next_submission_deadline DATE;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS next_payment_date DATE;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS is_partial_first_period BOOLEAN DEFAULT false;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS use_canadian_payroll BOOLEAN DEFAULT true;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS schedule_generated_at TIMESTAMP;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS upcoming_deadlines JSONB;`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollIntegrationDemo; 