'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  getUpcomingDeadlines,
  PayrollSchedule,
  PayPeriod 
} from '../../lib/payroll';

interface PayrollIntegrationProps {
  contractorEmail: string;
  startDate: string;
  onPayrollCalculated?: (data: any) => void;
}

const PayrollIntegration: React.FC<PayrollIntegrationProps> = ({
  contractorEmail,
  startDate,
  onPayrollCalculated
}) => {
  const [payrollSchedule, setPayrollSchedule] = useState<PayrollSchedule | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<PayPeriod | null>(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<PayPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [setupResult, setSetupResult] = useState<any>(null);

  useEffect(() => {
    if (startDate) {
      calculatePayroll();
    }
  }, [startDate]);

  const calculatePayroll = () => {
    try {
      console.log('🧮 Calculating payroll for contractor:', { contractorEmail, startDate });
      
      const schedule = calculatePayrollSchedule(startDate, 26);
      const current = getCurrentPayPeriod(schedule);
      const upcoming = getUpcomingDeadlines(schedule, 60);

      setPayrollSchedule(schedule);
      setCurrentPeriod(current);
      setUpcomingDeadlines(upcoming);

      const payrollData = {
        schedule,
        currentPeriod: current,
        upcomingDeadlines: upcoming,
        summary: {
          totalPeriods: schedule.periods.length,
          firstPeriodEnd: schedule.firstPeriodEnd,
          hasPartialFirstPeriod: schedule.periods[0]?.isPartialPeriod,
          nextSubmission: current?.submissionDeadline,
          nextPayment: current?.paymentDate
        }
      };

      if (onPayrollCalculated) {
        onPayrollCalculated(payrollData);
      }

      console.log('✅ Payroll calculated successfully');
    } catch (error) {
      console.error('❌ Payroll calculation error:', error);
    }
  };

  const setupContractorWithPayroll = async () => {
    setLoading(true);
    try {
      const setupData = {
        name: 'Sample Contractor',
        email: contractorEmail,
        phone: '(555) 123-4567',
        customStartDate: startDate,
        useCustomStartDate: true,
        useCanadianPayroll: true,
        numberOfPeriods: 26,
        dayRate: 450,
        truckRate: 150,
        travelKms: 45,
        ratePerKm: 0.68,
        subsistence: 75,
        location: 'Project Site',
        company: 'Sample Construction Co.'
      };

      const response = await fetch('/api/contractor/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData)
      });

      const result = await response.json();
      setSetupResult(result);

      if (result.success) {
        console.log('✅ Contractor setup with payroll successful:', result.invoiceId);
      } else {
        console.error('❌ Contractor setup failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Setup request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🇨🇦 Contractor Payroll Integration
      </h2>

      {/* Contractor Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Contractor Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Email:</span>
            <span className="ml-2 text-blue-600">{contractorEmail}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Start Date:</span>
            <span className="ml-2 text-blue-600">{formatDate(startDate)}</span>
          </div>
        </div>
      </div>

      {/* Setup Integration */}
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-3">API Integration Example</h3>
        <button
          onClick={setupContractorWithPayroll}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
        >
          {loading ? 'Setting up...' : 'Setup Contractor with Payroll'}
        </button>
        
        {setupResult && (
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-sm font-medium mb-2">
              {setupResult.success ? '✅ Setup Result:' : '❌ Setup Failed:'}
            </p>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(setupResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Current Period */}
      {currentPeriod && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-orange-900 mb-3">📅 Current Pay Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded p-3">
              <p className="text-sm font-medium text-gray-700">Period</p>
              <p className="text-lg font-bold text-orange-600">
                #{currentPeriod.periodNumber}
                {currentPeriod.isPartialPeriod && (
                  <span className="text-sm text-orange-500 ml-1">(Partial)</span>
                )}
              </p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-medium text-gray-700">Work Dates</p>
              <p className="text-sm text-gray-600">
                {formatDate(currentPeriod.startDate)} - {formatDate(currentPeriod.endDate)}
              </p>
              <p className="text-xs text-gray-500">{currentPeriod.daysInPeriod} days</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-medium text-gray-700">Submit By</p>
              <p className="text-sm font-bold text-orange-600">
                {formatDate(currentPeriod.submissionDeadline)}
              </p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-medium text-gray-700">Payment</p>
              <p className="text-sm font-bold text-green-600">
                {formatDate(currentPeriod.paymentDate)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-3">⏰ Upcoming Deadlines</h3>
          <div className="space-y-2">
            {upcomingDeadlines.slice(0, 3).map((period) => (
              <div key={period.periodNumber} className="bg-white rounded p-3 flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900">Period #{period.periodNumber}</span>
                  <span className="text-gray-600 text-sm ml-2">
                    ({formatDate(period.startDate)} - {formatDate(period.endDate)})
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-700">
                    Submit: {formatDate(period.submissionDeadline)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Pay: {formatDate(period.paymentDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Code Example */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">💻 Integration Code Example</h3>
        <pre className="text-sm text-gray-700 overflow-x-auto bg-white p-3 rounded border">
{`// In app/api/contractor/setup/route.ts
import { calculatePayrollSchedule } from '@/lib/payroll'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, startDate } = body
  
  // Calculate Canadian bi-weekly payroll schedule
  const schedule = calculatePayrollSchedule(startDate, 26)
  const currentPeriod = getCurrentPayPeriod(schedule)
  const upcomingDeadlines = getUpcomingDeadlines(schedule, 60)
  
  // Store in database
  const { data: invoice, error } = await supabaseAdmin
    .from('trial_invoices')
    .insert([{
      contractor_name: name,
      contractor_email: email,
      start_date: startDate,
      first_period_end: schedule.firstPeriodEnd,
      payroll_schedule: schedule.periods, // Store as JSONB
      current_period: currentPeriod?.periodNumber || 1,
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
    nextSubmission: currentPeriod?.submissionDeadline,
    nextPayment: currentPeriod?.paymentDate
  })
}`}
        </pre>
      </div>
    </div>
  );
};

export default PayrollIntegration; 