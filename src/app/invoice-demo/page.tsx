'use client';

import React, { useState, useEffect } from 'react';
import PayrollCalendar from '../../components/PayrollCalendar';
import InvoiceGenerationPanel from '../../components/InvoiceGenerationPanel';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  getUpcomingDeadlines 
} from '../../lib/payrollCalculation';
import { GeneratedInvoice } from '../../lib/invoiceGeneration';

const InvoiceDemo = () => {
  const [contractorData, setContractorData] = useState({
    id: 'demo-contractor-001',
    name: 'Ricardo Esteban',
    email: 'redsteban@hotmail.com',
    startDate: new Date().toISOString().split('T')[0],
    dayRate: 450,
    truckRate: 150,
    travelRate: 0.68,
    subsistenceRate: 75
  });

  const [payrollData, setPayrollData] = useState<any>(null);
  const [recentInvoices, setRecentInvoices] = useState<GeneratedInvoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generatePayrollSchedule();
  }, [contractorData.startDate]);

  const generatePayrollSchedule = () => {
    try {
      const schedule = calculatePayrollSchedule(contractorData.startDate, 26);
      const currentPeriod = getCurrentPayPeriod(schedule);
      const upcomingDeadlines = getUpcomingDeadlines(schedule, 60);

      setPayrollData({
        schedule,
        currentPeriod,
        upcomingDeadlines
      });

      console.log('📊 Demo payroll data generated:', {
        totalPeriods: schedule.periods.length,
        currentPeriod: currentPeriod?.periodNumber,
        upcomingDeadlines: upcomingDeadlines.length
      });
    } catch (error) {
      console.error('❌ Error generating demo payroll schedule:', error);
    }
  };

  const setupDemoContractor = async () => {
    setLoading(true);
    try {
      // Simulate creating a contractor with payroll data
      const response = await fetch('/api/contractor/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contractorData.name,
          email: contractorData.email,
          phone: '(555) 123-4567',
          dayRate: contractorData.dayRate,
          truckRate: contractorData.truckRate,
          ratePerKm: contractorData.travelRate,
          subsistence: contractorData.subsistenceRate,
          customStartDate: contractorData.startDate,
          useCustomStartDate: true,
          location: 'Demo Construction Site',
          company: 'Demo Construction Co.',
          // Include payroll schedule
          payrollSchedule: payrollData?.schedule,
          currentPeriod: payrollData?.currentPeriod?.periodNumber
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setContractorData(prev => ({ ...prev, id: result.invoiceId }));
        console.log('✅ Demo contractor setup successful:', result.invoiceId);
      } else {
        console.error('❌ Demo contractor setup failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error setting up demo contractor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceGenerated = (invoice: GeneratedInvoice) => {
    setRecentInvoices(prev => [invoice, ...prev].slice(0, 5)); // Keep only latest 5
    console.log('✅ Invoice generated in demo:', invoice.invoiceNumber);
  };

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
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧾 Complete Invoice Generation Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Comprehensive demonstration of Canadian payroll calculation, schedule display, and automated invoice generation
          </p>

          {/* Demo Configuration */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Demo Configuration
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Contractor Name
                </label>
                <input
                  type="text"
                  value={contractorData.name}
                  onChange={(e) => setContractorData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={contractorData.startDate}
                  onChange={(e) => setContractorData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Day Rate ($)
                </label>
                <input
                  type="number"
                  value={contractorData.dayRate}
                  onChange={(e) => setContractorData(prev => ({ ...prev, dayRate: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Truck Rate ($)
                </label>
                <input
                  type="number"
                  value={contractorData.truckRate}
                  onChange={(e) => setContractorData(prev => ({ ...prev, truckRate: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={generatePayrollSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Regenerate Schedule
              </button>
              
              <button
                onClick={setupDemoContractor}
                disabled={loading || !payrollData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Setup Demo Contractor'}
              </button>
            </div>
          </div>
        </div>

        {/* System Overview */}
        {payrollData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Periods
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {payrollData.schedule.periods.length}
              </p>
              <p className="text-sm text-gray-600">Bi-weekly periods</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Current Period
              </h3>
              <p className="text-3xl font-bold text-green-600">
                #{payrollData.currentPeriod?.periodNumber || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {payrollData.currentPeriod?.isPartialPeriod ? 'Partial period' : 'Full period'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Next Deadline
              </h3>
              <p className="text-lg font-bold text-orange-600">
                {payrollData.currentPeriod && formatDate(payrollData.currentPeriod.submissionDeadline)}
              </p>
              <p className="text-sm text-gray-600">Submission due</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Invoices Generated
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {recentInvoices.length}
              </p>
              <p className="text-sm text-gray-600">In this demo session</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        {payrollData && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Payroll Calendar */}
            <div>
              <PayrollCalendar
                periods={payrollData.schedule.periods}
                currentPeriod={payrollData.currentPeriod?.periodNumber || 1}
                contractorName={contractorData.name}
                showFullSchedule={false}
              />
            </div>

            {/* Invoice Generation Panel */}
            <div>
              <InvoiceGenerationPanel
                trialInvoiceId={contractorData.id}
                periods={payrollData.schedule.periods}
                currentPeriod={payrollData.currentPeriod?.periodNumber || 1}
                contractorName={contractorData.name}
                onInvoiceGenerated={handleInvoiceGenerated}
              />
            </div>
          </div>
        )}

        {/* Recent Invoices */}
        {recentInvoices.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📋 Generated Invoices Summary
            </h2>
            
            <div className="space-y-4">
              {recentInvoices.map((invoice, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                      <p className="text-gray-600">
                        Period {invoice.period.periodNumber}: {formatDate(invoice.period.startDate)} - {formatDate(invoice.period.endDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(invoice.total)}
                      </p>
                      <p className="text-sm text-gray-500">Total Amount</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Days Worked:</span>
                      <p className="font-medium">{invoice.periodSummary.totalDaysWorked}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Subtotal:</span>
                      <p className="font-medium">{formatCurrency(invoice.subtotal)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">GST (5%):</span>
                      <p className="font-medium">{formatCurrency(invoice.gst)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment Date:</span>
                      <p className="font-medium">{formatDate(invoice.paymentDate)}</p>
                    </div>
                  </div>

                  {invoice.lineItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Line Items:</h4>
                      <div className="text-sm space-y-1">
                        {invoice.lineItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between">
                            <span>{item.description}</span>
                            <span>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Code Examples */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            💻 Integration Code Examples
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">1. Payroll Calculation & Calendar</h3>
              <pre className="text-sm bg-gray-50 p-4 rounded border overflow-x-auto">
{`import PayrollCalendar from '@/components/PayrollCalendar';
import { calculatePayrollSchedule, getCurrentPayPeriod } from '@/lib/payrollCalculation';

const schedule = calculatePayrollSchedule('${contractorData.startDate}', 26);
const currentPeriod = getCurrentPayPeriod(schedule);

<PayrollCalendar
  periods={schedule.periods}
  currentPeriod={currentPeriod.periodNumber}
  contractorName="${contractorData.name}"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">2. Invoice Generation</h3>
              <pre className="text-sm bg-gray-50 p-4 rounded border overflow-x-auto">
{`import { generateInvoiceForPeriod } from '@/lib/invoiceGeneration';

// Generate invoice for specific period
const invoice = await generateInvoiceForPeriod('${contractorData.id}', 1);

// API call for invoice generation
const response = await fetch('/api/invoices/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trialInvoiceId: '${contractorData.id}',
    periodNumber: 1,
    action: 'single'
  })
});`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">3. Complete Integration</h3>
              <pre className="text-sm bg-gray-50 p-4 rounded border overflow-x-auto">
{`<InvoiceGenerationPanel
  trialInvoiceId="${contractorData.id}"
  periods={schedule.periods}
  currentPeriod={currentPeriod.periodNumber}
  contractorName="${contractorData.name}"
  onInvoiceGenerated={(invoice) => {
    console.log('Invoice generated:', invoice.invoiceNumber);
    // Handle invoice generation success
  }}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDemo; 