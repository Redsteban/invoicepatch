'use client';

import React from 'react';

interface Invoice {
  id: string;
  contractor: string;
  ticket: string;
  amount: string;
  confidence?: number;
}

interface FlaggedInvoice extends Invoice {
  issue: string;
  issueType: 'rate_mismatch' | 'missing_work_order' | 'date_discrepancy' | 'unauthorized_project' | 'fraud_alert' | 'budget_overrun';
  details: any;
}

const ReconciliationDashboard: React.FC = () => {
  const perfectMatches: Invoice[] = [
    { id: '1', contractor: 'ABC Drilling Services', ticket: 'WO-2024-001', amount: '3,450.00' },
    { id: '2', contractor: 'Northern Pipeline Co.', ticket: 'WO-2024-002', amount: '2,875.50' },
    { id: '3', contractor: 'Calgary Construction Ltd.', ticket: 'WO-2024-003', amount: '4,200.00' },
    { id: '4', contractor: 'Mountain View Contractors', ticket: 'WO-2024-004', amount: '1,950.75' },
    { id: '5', contractor: 'Prairie Services Inc.', ticket: 'WO-2024-005', amount: '3,125.00' },
    { id: '6', contractor: 'Foothills Engineering', ticket: 'WO-2024-006', amount: '2,680.25' },
    { id: '7', contractor: 'Bow River Construction', ticket: 'WO-2024-007', amount: '3,890.00' },
    { id: '8', contractor: 'Chinook Drilling', ticket: 'WO-2024-008', amount: '2,450.50' },
    { id: '9', contractor: 'Stampede Services', ticket: 'WO-2024-009', amount: '1,875.75' },
    { id: '10', contractor: 'Rocky Mountain Co.', ticket: 'WO-2024-010', amount: '3,250.00' },
    { id: '11', contractor: 'Alberta Pipeline Services', ticket: 'WO-2024-011', amount: '2,125.50' },
    { id: '12', contractor: 'Canmore Construction', ticket: 'WO-2024-012', amount: '1,750.25' },
    { id: '13', contractor: 'Banff Engineering Ltd.', ticket: 'WO-2024-013', amount: '2,890.00' },
    { id: '14', contractor: 'Kananaskis Services', ticket: 'WO-2024-014', amount: '1,625.75' },
    { id: '15', contractor: 'Cochrane Drilling Co.', ticket: 'WO-2024-015', amount: '2,375.50' },
    { id: '16', contractor: 'Airdrie Construction', ticket: 'WO-2024-016', amount: '1,425.00' }
  ];

  const flaggedIssues: FlaggedInvoice[] = [
    {
      id: '17',
      contractor: 'Mike Johnson',
      ticket: 'ST-456',
      amount: '2,847.50',
      confidence: 85,
      issue: 'Rate Mismatch Detected',
      issueType: 'rate_mismatch',
      details: {
        invoiceRate: '$475/day',
        approvedRate: '$450/day'
      }
    },
    {
      id: '18',
      contractor: 'Sarah Chen',
      ticket: 'ST-789',
      amount: '1,892.00',
      issue: 'Missing Work Order',
      issueType: 'missing_work_order',
      details: {
        description: 'Emergency Repair - Site 7'
      }
    },
    {
      id: '19',
      contractor: 'Suspicious Contractor LLC',
      ticket: 'ST-999',
      amount: '4,750.00',
      confidence: 15,
      issue: 'FRAUD ALERT: Duplicate Invoice Detected',
      issueType: 'fraud_alert',
      details: {
        duplicateOf: 'Invoice #INV-2024-045',
        fraudScore: 95,
        riskFactors: ['Identical amount', 'Similar description', 'Same date range']
      }
    },
    {
      id: '20',
      contractor: 'Edmonton Heavy Haul',
      ticket: 'ST-654',
      amount: '8,127.25',
      confidence: 68,
      issue: 'BUDGET ALERT: Project 78% Over Budget',
      issueType: 'budget_overrun',
      details: {
        budgetLimit: '$45,000',
        currentSpend: '$52,127.25',
        overrun: '$7,127.25',
        percentOver: '15.8%'
      }
    }
  ];

  const totalPerfectMatches = perfectMatches.reduce((sum, invoice) => 
    sum + parseFloat(invoice.amount.replace(',', '')), 0
  );

  const totalFlagged = flaggedIssues.reduce((sum, invoice) => 
    sum + parseFloat(invoice.amount.replace(',', '')), 0
  );

  const totalAmount = totalPerfectMatches + totalFlagged;

  const renderFlaggedIssue = (invoice: FlaggedInvoice) => {
    const isCritical = invoice.issueType === 'fraud_alert' || invoice.issueType === 'budget_overrun';
    
    return (
      <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-semibold text-gray-900 text-lg">
              {invoice.contractor}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Ticket #{invoice.ticket}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isCritical 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {isCritical ? '🚨' : '⚠️'} {invoice.issue}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${invoice.amount}</div>
            {invoice.confidence && (
              <div className="text-sm text-gray-500">{invoice.confidence}% confidence</div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          {invoice.issueType === 'fraud_alert' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Duplicate of:</span>
                  <div className="text-gray-900">{invoice.details.duplicateOf}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fraud Score:</span>
                  <div className="text-gray-900 font-semibold">{invoice.details.fraudScore}%</div>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700 text-sm">Risk Factors:</span>
                <ul className="list-disc ml-4 text-sm text-gray-600 mt-1">
                  {invoice.details.riskFactors.map((factor: string, idx: number) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-3 pt-2">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Reject & Flag
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Investigate
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          )}

          {invoice.issueType === 'budget_overrun' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Budget Limit:</span>
                  <div className="text-gray-900">{invoice.details.budgetLimit}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Current Spend:</span>
                  <div className="text-gray-900 font-semibold">{invoice.details.currentSpend}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Overrun:</span>
                  <div className="text-red-600 font-semibold">{invoice.details.overrun}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Percent Over:</span>
                  <div className="text-red-600 font-semibold">{invoice.details.percentOver}</div>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Stop Project
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Budget Revision
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Alert PM
                </button>
              </div>
            </div>
          )}
          
          {invoice.issueType === 'rate_mismatch' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Invoice Rate:</span>
                  <div className="text-gray-900">{invoice.details.invoiceRate}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Approved Rate:</span>
                  <div className="text-gray-900">{invoice.details.approvedRate}</div>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Accept Invoice Rate
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Use Approved Rate
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Ask Contractor
                </button>
              </div>
            </div>
          )}
          
          {invoice.issueType === 'missing_work_order' && (
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Description:</span>
                <div className="text-gray-900 mt-1">"{invoice.details.description}"</div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Create Work Order
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Reject Invoice
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Request Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reconciliation Complete</h1>
              <p className="text-gray-600 mt-1">Processed 18 invoices in 43 seconds</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">${totalAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Invoice Amount</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="bg-red-50 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <div>
                <div className="font-semibold text-red-800">Critical Business Alerts</div>
                <div className="text-sm text-red-600">Fraud detection and budget overrun protection activated</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-800">$12,877</div>
              <div className="text-sm text-red-600">Potential losses prevented</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Perfect Matches */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Perfect Matches
                </h2>
                <p className="text-gray-600 text-sm mt-1">{perfectMatches.length} invoices ready for approval</p>
              </div>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Approve All — ${totalPerfectMatches.toLocaleString()}
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {perfectMatches.map((invoice, index) => (
              <div key={invoice.id} className={`flex justify-between items-center p-4 ${
                index < perfectMatches.length - 1 ? 'border-b border-gray-100' : ''
              } hover:bg-gray-50 transition-colors`}>
                <div>
                  <div className="font-medium text-gray-900">{invoice.contractor}</div>
                  <div className="text-sm text-gray-500">Ticket #{invoice.ticket}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${invoice.amount}</div>
                  <div className="text-sm text-gray-500">100% match</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Issues Requiring Review */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Issues Requiring Review</h2>
            <p className="text-gray-600 text-sm mt-1">{flaggedIssues.length} invoices need attention</p>
          </div>
          
          <div className="space-y-4">
            {flaggedIssues.map(renderFlaggedIssue)}
          </div>
        </div>

        {/* Business Intelligence */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-gray-800 rounded-full mr-3"></div>
              <h3 className="font-semibold text-gray-900">Contractor Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ABC Drilling Services</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">A+ (98%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Northern Pipeline Co.</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">A (94%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Suspicious Contractor LLC</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">F (15%)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-gray-800 rounded-full mr-3"></div>
              <h3 className="font-semibold text-gray-900">Cash Flow Forecast</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next 7 days</span>
                <span className="font-medium text-gray-900">$28,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next 30 days</span>
                <span className="font-medium text-gray-900">$127,890</span>
              </div>
              <div className="text-xs text-amber-600 mt-2 p-2 bg-amber-50 rounded">
                High-risk contractor may delay $8,127 payment
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-gray-800 rounded-full mr-3"></div>
              <h3 className="font-semibold text-gray-900">Compliance Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Alberta minimum wage verified</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Overtime calculations validated</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-gray-600">WCB coverage confirmed</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Session Summary</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">$12,877</div>
              <div className="text-sm text-gray-600">Losses Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">6.5</div>
              <div className="text-sm text-gray-600">Hours Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-sm text-gray-600">Audit Ready</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">43s</div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors">
            Process Safe Invoices
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors">
            Review Critical Issues
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationDashboard; 