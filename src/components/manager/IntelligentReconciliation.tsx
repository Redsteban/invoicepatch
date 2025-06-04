'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
  FlagIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  SparklesIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  invoiceNumber: string;
  contractor: string;
  extractedContractor: string;
  amount: number;
  projectCode: string;
  workPeriod: string;
  submittedDate: string;
  status: 'perfect_match' | 'minor_issues' | 'major_issues' | 'processing';
  matchConfidence: number;
  exceptions: Exception[];
  workOrder?: WorkOrder;
}

interface Exception {
  type: 'rate_mismatch' | 'missing_work_order' | 'date_discrepancy' | 'unauthorized_project' | 'budget_overage' | 'name_variation';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedAction: string;
  autoFixable: boolean;
}

interface WorkOrder {
  id: string;
  projectCode: string;
  contractor: string;
  approvedDayRate: number;
  approvedEquipmentRate: number;
  startDate: string;
  endDate: string;
  budgetRemaining: number;
}

export default function IntelligentReconciliation() {
  const [selectedQueue, setSelectedQueue] = useState<'perfect' | 'minor' | 'major'>('minor');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const mockInvoices: Invoice[] = [
    {
      id: 'inv-001',
      invoiceNumber: 'ST-2024-001',
      contractor: 'John Smith Contracting Ltd.',
      extractedContractor: 'J. Smith Contracting',
      amount: 4675.00,
      projectCode: 'STACK-AB-2024-Q1',
      workPeriod: '2024-01-08 to 2024-01-12',
      submittedDate: '2024-01-15',
      status: 'minor_issues',
      matchConfidence: 87.3,
      exceptions: [
        {
          type: 'name_variation',
          severity: 'low',
          description: 'Contractor name variation detected',
          suggestedAction: 'Auto-match to John Smith Contracting Ltd.',
          autoFixable: true
        }
      ],
      workOrder: {
        id: 'WO-STACK-001',
        projectCode: 'STACK-AB-2024-Q1',
        contractor: 'John Smith Contracting Ltd.',
        approvedDayRate: 850,
        approvedEquipmentRate: 150,
        startDate: '2024-01-08',
        endDate: '2024-01-19',
        budgetRemaining: 12500
      }
    },
    {
      id: 'inv-002',
      invoiceNumber: 'MJ-2024-003',
      contractor: 'Mike Johnson Contracting',
      extractedContractor: 'Mike Johnson Contracting',
      amount: 6750.00,
      projectCode: 'STACK-AB-2024-Q1',
      workPeriod: '2024-01-15 to 2024-01-19',
      submittedDate: '2024-01-20',
      status: 'major_issues',
      matchConfidence: 45.2,
      exceptions: [
        {
          type: 'rate_mismatch',
          severity: 'high',
          description: 'Daily rate $900 exceeds approved rate $850',
          suggestedAction: 'Contact contractor for rate clarification',
          autoFixable: false
        },
        {
          type: 'budget_overage',
          severity: 'medium',
          description: 'Invoice would exceed project budget by $1,250',
          suggestedAction: 'Require budget approval before processing',
          autoFixable: false
        }
      ],
      workOrder: {
        id: 'WO-STACK-001',
        projectCode: 'STACK-AB-2024-Q1',
        contractor: 'Mike Johnson Contracting',
        approvedDayRate: 850,
        approvedEquipmentRate: 150,
        startDate: '2024-01-15',
        endDate: '2024-01-26',
        budgetRemaining: 5500
      }
    },
    {
      id: 'inv-003',
      invoiceNumber: 'ST-2024-002',
      contractor: 'Sarah Thompson Ltd.',
      extractedContractor: 'Sarah Thompson Ltd.',
      amount: 2890.00,
      projectCode: 'STACK-BC-2024-Q1',
      workPeriod: '2024-01-10 to 2024-01-12',
      submittedDate: '2024-01-13',
      status: 'major_issues',
      matchConfidence: 23.8,
      exceptions: [
        {
          type: 'unauthorized_project',
          severity: 'high',
          description: 'Project code STACK-BC-2024-Q1 not found in approved work orders',
          suggestedAction: 'Verify project authorization with management',
          autoFixable: false
        },
        {
          type: 'missing_work_order',
          severity: 'high',
          description: 'No matching work order found for this contractor and project',
          suggestedAction: 'Create work order or reject invoice',
          autoFixable: false
        }
      ]
    }
  ];

  const queueStats = {
    perfect: mockInvoices.filter(i => i.status === 'perfect_match').length,
    minor: mockInvoices.filter(i => i.status === 'minor_issues').length,
    major: mockInvoices.filter(i => i.status === 'major_issues').length,
    processing: mockInvoices.filter(i => i.status === 'processing').length
  };

  const getQueueInvoices = () => {
    return mockInvoices.filter(i => {
      switch (selectedQueue) {
        case 'perfect': return i.status === 'perfect_match';
        case 'minor': return i.status === 'minor_issues';
        case 'major': return i.status === 'major_issues';
        default: return false;
      }
    });
  };

  const getExceptionColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect_match': return 'text-green-600 bg-green-100';
      case 'minor_issues': return 'text-yellow-600 bg-yellow-100';
      case 'major_issues': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleBulkApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setBulkSelected([]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleAutoFix = (invoiceId: string) => {
    console.log(`Auto-fixing invoice: ${invoiceId}`);
  };

  const selectedInvoiceData = mockInvoices.find(i => i.id === selectedInvoice);

  return (
    <div className="space-y-6">
      {/* Reconciliation Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Intelligent Reconciliation Engine</h3>
              <p className="text-sm text-gray-600">Automated invoice matching with exception handling</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">94.7%</div>
            <div className="text-sm text-gray-500">Auto-match accuracy</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedQueue('perfect')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedQueue === 'perfect' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{queueStats.perfect}</div>
            <div className="text-sm text-green-700">Perfect Matches</div>
            <div className="text-xs text-gray-500 mt-1">Auto-approved</div>
          </button>

          <button
            onClick={() => setSelectedQueue('minor')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedQueue === 'minor' 
                ? 'border-yellow-500 bg-yellow-50' 
                : 'border-gray-200 hover:border-yellow-300'
            }`}
          >
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{queueStats.minor}</div>
            <div className="text-sm text-yellow-700">Minor Issues</div>
            <div className="text-xs text-gray-500 mt-1">Quick review</div>
          </button>

          <button
            onClick={() => setSelectedQueue('major')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedQueue === 'major' 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <XCircleIcon className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{queueStats.major}</div>
            <div className="text-sm text-red-700">Major Issues</div>
            <div className="text-xs text-gray-500 mt-1">Detailed review</div>
          </button>

          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <ClockIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{queueStats.processing}</div>
            <div className="text-sm text-blue-700">Processing</div>
            <div className="text-xs text-gray-500 mt-1">In progress</div>
          </div>
        </div>
      </div>

      {/* Queue Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Queue */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                {selectedQueue === 'perfect' && 'Perfect Matches - Auto-Approved'}
                {selectedQueue === 'minor' && 'Minor Issues - Quick Review'}
                {selectedQueue === 'major' && 'Major Issues - Detailed Review'}
              </h4>
              {bulkSelected.length > 0 && selectedQueue !== 'major' && (
                <button
                  onClick={handleBulkApprove}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Approve ${bulkSelected.length} Items`}
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {getQueueInvoices().map((invoice) => (
              <motion.div
                key={invoice.id}
                className={`p-6 hover:bg-gray-50 cursor-pointer ${
                  selectedInvoice === invoice.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
                onClick={() => setSelectedInvoice(invoice.id)}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {selectedQueue !== 'major' && (
                      <input
                        type="checkbox"
                        checked={bulkSelected.includes(invoice.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setBulkSelected([...bulkSelected, invoice.id]);
                          } else {
                            setBulkSelected(bulkSelected.filter(id => id !== invoice.id));
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">{invoice.contractor}</p>
                      <p className="text-sm text-gray-500">
                        ${invoice.amount.toLocaleString()} • {invoice.projectCode}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.matchConfidence}% match
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {invoice.exceptions.length} exceptions
                    </div>
                  </div>
                </div>

                {/* Exception Preview */}
                {invoice.exceptions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {invoice.exceptions.slice(0, 2).map((exception, index) => (
                      <div key={index} className={`px-2 py-1 rounded text-xs border ${getExceptionColor(exception.severity)}`}>
                        {exception.description}
                      </div>
                    ))}
                    {invoice.exceptions.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{invoice.exceptions.length - 2} more exceptions
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedInvoiceData ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Invoice Details</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInvoiceData.status)}`}>
                  {selectedInvoiceData.matchConfidence}% confidence
                </span>
              </div>

              {/* Invoice Info */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-medium text-gray-500">Invoice Number</label>
                  <p className="text-sm text-gray-900">{selectedInvoiceData.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Contractor</label>
                  <p className="text-sm text-gray-900">{selectedInvoiceData.contractor}</p>
                  {selectedInvoiceData.extractedContractor !== selectedInvoiceData.contractor && (
                    <p className="text-xs text-gray-500">Extracted as: {selectedInvoiceData.extractedContractor}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Amount</label>
                  <p className="text-sm text-gray-900">${selectedInvoiceData.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Project Code</label>
                  <p className="text-sm text-gray-900">{selectedInvoiceData.projectCode}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Work Period</label>
                  <p className="text-sm text-gray-900">{selectedInvoiceData.workPeriod}</p>
                </div>
              </div>

              {/* Work Order Match */}
              {selectedInvoiceData.workOrder && (
                <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-900 mb-2">Matched Work Order</h5>
                  <div className="text-sm space-y-1">
                    <p><span className="text-green-700">ID:</span> {selectedInvoiceData.workOrder.id}</p>
                    <p><span className="text-green-700">Day Rate:</span> ${selectedInvoiceData.workOrder.approvedDayRate}</p>
                    <p><span className="text-green-700">Budget Remaining:</span> ${selectedInvoiceData.workOrder.budgetRemaining.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Exceptions */}
              <div className="mb-6">
                <h5 className="font-medium text-gray-900 mb-3">Exceptions ({selectedInvoiceData.exceptions.length})</h5>
                <div className="space-y-3">
                  {selectedInvoiceData.exceptions.map((exception, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getExceptionColor(exception.severity)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{exception.type.replace('_', ' ').toUpperCase()}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getExceptionColor(exception.severity)}`}>
                          {exception.severity}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{exception.description}</p>
                      <p className="text-xs font-medium">Suggested: {exception.suggestedAction}</p>
                      {exception.autoFixable && (
                        <button
                          onClick={() => handleAutoFix(selectedInvoiceData.id)}
                          className="mt-2 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Auto-Fix
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {selectedInvoiceData.status === 'minor_issues' && (
                  <button className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                    Quick Approve
                  </button>
                )}
                {selectedInvoiceData.status === 'major_issues' && (
                  <>
                    <button className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700">
                      Send for Review
                    </button>
                    <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                      Request Clarification
                    </button>
                  </>
                )}
                <button className="w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                  Reject Invoice
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Select an invoice to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Reconciliation Intelligence */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reconciliation Intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Fuzzy Matching</p>
                <p className="text-xs text-blue-700">Contractor name variations</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-900">Rate Validation</p>
                <p className="text-xs text-green-700">Against approved amounts</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <AdjustmentsHorizontalIcon className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-900">Smart Rules</p>
                <p className="text-xs text-purple-700">Business logic validation</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <BoltIcon className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Auto-Actions</p>
                <p className="text-xs text-yellow-700">Fix common issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 