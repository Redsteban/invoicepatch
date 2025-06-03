'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface MatchedItem {
  id: string;
  workOrderId: string;
  invoiceId: string;
  workOrderData: {
    projectName: string;
    afeCode: string;
    contractorName: string;
    dayRate: number;
    startDate: string;
    endDate: string;
    daysWorked: number;
    totalAmount: number;
  };
  invoiceData: {
    projectName: string;
    afeCode: string;
    contractorName: string;
    dayRate: number;
    startDate: string;
    endDate: string;
    daysWorked: number;
    totalAmount: number;
    invoiceNumber: string;
    submittedDate: string;
  };
  matchingResults: {
    overall: number;
    projectMatch: number;
    afeMatch: number;
    contractorMatch: number;
    rateMatch: number;
    dateMatch: number;
    amountMatch: number;
  };
  status: 'perfect_match' | 'good_match' | 'needs_review' | 'major_discrepancy';
  discrepancies: Array<{
    field: string;
    workOrderValue: string;
    invoiceValue: string;
    severity: 'minor' | 'major';
    explanation: string;
  }>;
}

const InvoiceComparison = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const matchedItems: MatchedItem[] = [
    {
      id: '1',
      workOrderId: 'WO-2024-001',
      invoiceId: 'INV-2024-156789',
      workOrderData: {
        projectName: 'Montney Horizontal Drilling Program',
        afeCode: 'AFE-2024-001',
        contractorName: 'Mike Thompson',
        dayRate: 850,
        startDate: '2024-06-01',
        endDate: '2024-06-07',
        daysWorked: 7,
        totalAmount: 5950
      },
      invoiceData: {
        projectName: 'Montney Horizontal Drilling Program',
        afeCode: 'AFE-2024-001',
        contractorName: 'Mike Thompson',
        dayRate: 850,
        startDate: '2024-06-01',
        endDate: '2024-06-07',
        daysWorked: 7,
        totalAmount: 5950,
        invoiceNumber: 'INV-2024-156789',
        submittedDate: '2024-06-08'
      },
      matchingResults: {
        overall: 100,
        projectMatch: 100,
        afeMatch: 100,
        contractorMatch: 100,
        rateMatch: 100,
        dateMatch: 100,
        amountMatch: 100
      },
      status: 'perfect_match',
      discrepancies: []
    },
    {
      id: '2',
      workOrderId: 'WO-2024-002',
      invoiceId: 'INV-2024-156788',
      workOrderData: {
        projectName: 'Pipeline Integrity Assessment',
        afeCode: 'AFE-2024-002',
        contractorName: 'Sarah Chen',
        dayRate: 750,
        startDate: '2024-06-10',
        endDate: '2024-06-19',
        daysWorked: 8,
        totalAmount: 6000
      },
      invoiceData: {
        projectName: 'Pipeline Integrity Assessment',
        afeCode: 'AFE-2024-002',
        contractorName: 'Sarah Chen',
        dayRate: 800,
        startDate: '2024-06-10',
        endDate: '2024-06-19',
        daysWorked: 8,
        totalAmount: 6400,
        invoiceNumber: 'INV-2024-156788',
        submittedDate: '2024-06-20'
      },
      matchingResults: {
        overall: 85,
        projectMatch: 100,
        afeMatch: 100,
        contractorMatch: 100,
        rateMatch: 75,
        dateMatch: 100,
        amountMatch: 75
      },
      status: 'needs_review',
      discrepancies: [
        {
          field: 'dayRate',
          workOrderValue: '$750',
          invoiceValue: '$800',
          severity: 'major',
          explanation: 'Rate variance of $50/day - requires approval for rate adjustment'
        },
        {
          field: 'totalAmount',
          workOrderValue: '$6,000',
          invoiceValue: '$6,400',
          severity: 'major',
          explanation: 'Amount difference due to rate variance ($400 total)'
        }
      ]
    },
    {
      id: '3',
      workOrderId: 'WO-2024-003',
      invoiceId: 'INV-2024-156790',
      workOrderData: {
        projectName: 'Well Site Maintenance',
        afeCode: 'AFE-2024-003',
        contractorName: 'David Wilson',
        dayRate: 650,
        startDate: '2024-05-28',
        endDate: '2024-06-03',
        daysWorked: 5,
        totalAmount: 3250
      },
      invoiceData: {
        projectName: 'Well Site Maintenance & Repair',
        afeCode: 'AFE-2024-003',
        contractorName: 'David Wilson',
        dayRate: 650,
        startDate: '2024-05-28',
        endDate: '2024-06-04',
        daysWorked: 6,
        totalAmount: 3900,
        invoiceNumber: 'INV-2024-156790',
        submittedDate: '2024-06-05'
      },
      matchingResults: {
        overall: 78,
        projectMatch: 90,
        afeMatch: 100,
        contractorMatch: 100,
        rateMatch: 100,
        dateMatch: 85,
        amountMatch: 70
      },
      status: 'needs_review',
      discrepancies: [
        {
          field: 'projectName',
          workOrderValue: 'Well Site Maintenance',
          invoiceValue: 'Well Site Maintenance & Repair',
          severity: 'minor',
          explanation: 'Project name includes additional scope - verify work authorization'
        },
        {
          field: 'endDate',
          workOrderValue: '2024-06-03',
          invoiceValue: '2024-06-04',
          severity: 'minor',
          explanation: 'Work extended by 1 day - check for approval'
        },
        {
          field: 'daysWorked',
          workOrderValue: '5 days',
          invoiceValue: '6 days',
          severity: 'major',
          explanation: 'Additional day worked - verify overtime authorization'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'perfect_match':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'good_match':
        return <CheckCircleIcon className="h-6 w-6 text-blue-600" />;
      case 'needs_review':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />;
      case 'major_discrepancy':
        return <XCircleIcon className="h-6 w-6 text-red-600" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect_match':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good_match':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'major_discrepancy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredItems = filterStatus === 'all' 
    ? matchedItems 
    : matchedItems.filter(item => item.status === filterStatus);

  const stats = {
    total: matchedItems.length,
    perfectMatch: matchedItems.filter(item => item.status === 'perfect_match').length,
    needsReview: matchedItems.filter(item => item.status === 'needs_review').length,
    majorDiscrepancy: matchedItems.filter(item => item.status === 'major_discrepancy').length,
    avgConfidence: Math.round(matchedItems.reduce((sum, item) => sum + item.matchingResults.overall, 0) / matchedItems.length)
  };

  const DataField = ({ 
    label, 
    workOrderValue, 
    invoiceValue, 
    isDiscrepancy = false 
  }: { 
    label: string; 
    workOrderValue: string; 
    invoiceValue: string; 
    isDiscrepancy?: boolean;
  }) => (
    <div className={`flex justify-between py-2 ${isDiscrepancy ? 'bg-red-50 border border-red-200 rounded px-3' : ''}`}>
      <span className="font-medium text-gray-700">{label}:</span>
      <div className="flex gap-4">
        <span className={isDiscrepancy ? 'text-red-600 line-through' : 'text-gray-900'}>{workOrderValue}</span>
        <span className="text-gray-400">→</span>
        <span className={isDiscrepancy ? 'text-red-600 font-semibold' : 'text-gray-900'}>{invoiceValue}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comparisons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Perfect Matches</p>
              <p className="text-2xl font-bold text-green-600">{stats.perfectMatch}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.needsReview}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Confidence</p>
              <p className={`text-2xl font-bold ${getConfidenceColor(stats.avgConfidence)}`}>{stats.avgConfidence}%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'all', name: 'All Items', count: matchedItems.length },
            { id: 'perfect_match', name: 'Perfect Matches', count: stats.perfectMatch },
            { id: 'needs_review', name: 'Needs Review', count: stats.needsReview },
            { id: 'major_discrepancy', name: 'Major Issues', count: stats.majorDiscrepancy }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === filter.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filter.name} ({filter.count})
            </button>
          ))}
        </div>

        {/* Comparison List */}
        <div className="space-y-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                selectedItem === item.id ? 'ring-2 ring-blue-500 shadow-md' : 'border-gray-200'
              }`}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.workOrderData.projectName}</h4>
                    <p className="text-sm text-gray-600">
                      {item.workOrderId} → {item.invoiceData.invoiceNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getConfidenceColor(item.matchingResults.overall)}`}>
                      {item.matchingResults.overall}%
                    </div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>
              </div>

              {/* Basic Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Work Order Data
                  </h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contractor:</span>
                      <span>{item.workOrderData.contractorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span>${item.workOrderData.dayRate}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days:</span>
                      <span>{item.workOrderData.daysWorked}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-600">Total:</span>
                      <span>${item.workOrderData.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Invoice Data
                  </h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contractor:</span>
                      <span>{item.invoiceData.contractorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className={item.discrepancies.some(d => d.field === 'dayRate') ? 'text-red-600 font-semibold' : ''}>
                        ${item.invoiceData.dayRate}/day
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days:</span>
                      <span className={item.discrepancies.some(d => d.field === 'daysWorked') ? 'text-red-600 font-semibold' : ''}>
                        {item.invoiceData.daysWorked}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-600">Total:</span>
                      <span className={item.discrepancies.some(d => d.field === 'totalAmount') ? 'text-red-600' : ''}>
                        ${item.invoiceData.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discrepancies */}
              {item.discrepancies.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <h5 className="font-medium text-red-900 mb-2">Found {item.discrepancies.length} Discrepancies</h5>
                  <div className="space-y-2">
                    {item.discrepancies.map((discrepancy, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-red-800">
                            {discrepancy.field.charAt(0).toUpperCase() + discrepancy.field.slice(1)}:
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            discrepancy.severity === 'major' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {discrepancy.severity}
                          </span>
                        </div>
                        <div className="text-red-700">
                          Expected: {discrepancy.workOrderValue} → Received: {discrepancy.invoiceValue}
                        </div>
                        <div className="text-red-600 text-xs italic">{discrepancy.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded Details */}
              {selectedItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 pt-4 space-y-4"
                >
                  {/* Detailed Matching Scores */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Detailed Matching Analysis</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Project Name', score: item.matchingResults.projectMatch },
                        { label: 'AFE Code', score: item.matchingResults.afeMatch },
                        { label: 'Contractor', score: item.matchingResults.contractorMatch },
                        { label: 'Day Rate', score: item.matchingResults.rateMatch },
                        { label: 'Work Dates', score: item.matchingResults.dateMatch },
                        { label: 'Total Amount', score: item.matchingResults.amountMatch }
                      ].map((metric) => (
                        <div key={metric.label} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  metric.score >= 95 ? 'bg-green-500' :
                                  metric.score >= 85 ? 'bg-blue-500' :
                                  metric.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${metric.score}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-bold ${getConfidenceColor(metric.score)}`}>
                              {metric.score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Side-by-side Detailed Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h6 className="font-medium text-gray-900">Work Order Details</h6>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm space-y-2">
                        <DataField label="Project" workOrderValue={item.workOrderData.projectName} invoiceValue={item.invoiceData.projectName} />
                        <DataField label="AFE Code" workOrderValue={item.workOrderData.afeCode} invoiceValue={item.invoiceData.afeCode} />
                        <DataField label="Start Date" workOrderValue={item.workOrderData.startDate} invoiceValue={item.invoiceData.startDate} />
                        <DataField label="End Date" workOrderValue={item.workOrderData.endDate} invoiceValue={item.invoiceData.endDate} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h6 className="font-medium text-gray-900">Invoice Details</h6>
                      <div className="bg-green-50 border border-green-200 rounded p-3 text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Invoice #:</span>
                          <span className="text-gray-900">{item.invoiceData.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Submitted:</span>
                          <span className="text-gray-900">{item.invoiceData.submittedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    {item.status === 'perfect_match' && (
                      <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        Auto-Approve
                      </button>
                    )}
                    {item.status === 'needs_review' && (
                      <>
                        <button className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                          Request Clarification
                        </button>
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                          Approve with Notes
                        </button>
                      </>
                    )}
                    <button className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                      View Full Details
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No items match the selected filter.</p>
          </div>
        )}
      </div>

      {/* Demo Value Proposition */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Matching Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-blue-600">Time Savings:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• Manual comparison: 45 min/invoice</li>
                  <li>• Automated matching: 30 seconds</li>
                  <li>• 99% time reduction</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-green-600">Accuracy Improvement:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• Catches 100% of discrepancies</li>
                  <li>• Confidence scoring system</li>
                  <li>• Standardized review process</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-purple-600">Process Benefits:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• Automated approvals for perfect matches</li>
                  <li>• Flagged items for review</li>
                  <li>• Audit trail and documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceComparison; 