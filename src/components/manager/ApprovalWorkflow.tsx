'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface ApprovalItem {
  id: string;
  type: 'invoice' | 'expense' | 'timesheet';
  invoiceNumber: string;
  contractor: string;
  project: string;
  amount: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  priority: 'high' | 'medium' | 'low';
  issues?: Array<{
    type: 'rate_variance' | 'date_mismatch' | 'amount_discrepancy' | 'missing_docs';
    description: string;
    severity: 'minor' | 'major';
  }>;
  notes?: string;
  reviewedBy?: string;
  reviewDate?: string;
}

const ApprovalWorkflow = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [showBulkPanel, setShowBulkPanel] = useState(false);

  const approvalItems: ApprovalItem[] = [
    {
      id: '1',
      type: 'invoice',
      invoiceNumber: 'INV-2024-156789',
      contractor: 'Mike Thompson',
      project: 'Montney Horizontal Drilling',
      amount: 5950,
      submittedDate: '2024-06-08',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      type: 'invoice',
      invoiceNumber: 'INV-2024-156788',
      contractor: 'Sarah Chen',
      project: 'Pipeline Integrity Assessment',
      amount: 6400,
      submittedDate: '2024-06-20',
      status: 'needs_review',
      priority: 'medium',
      issues: [
        {
          type: 'rate_variance',
          description: 'Day rate $50 higher than work order ($800 vs $750)',
          severity: 'major'
        }
      ]
    },
    {
      id: '3',
      type: 'invoice',
      invoiceNumber: 'INV-2024-156790',
      contractor: 'David Wilson',
      project: 'Well Site Maintenance',
      amount: 3900,
      submittedDate: '2024-06-05',
      status: 'needs_review',
      priority: 'medium',
      issues: [
        {
          type: 'date_mismatch',
          description: 'Work extended 1 day beyond work order end date',
          severity: 'minor'
        },
        {
          type: 'amount_discrepancy',
          description: 'Total amount $650 higher due to extra day',
          severity: 'major'
        }
      ]
    },
    {
      id: '4',
      type: 'invoice',
      invoiceNumber: 'INV-2024-156785',
      contractor: 'Jennifer Kim',
      project: 'Safety Compliance Audit',
      amount: 4500,
      submittedDate: '2024-05-03',
      status: 'approved',
      priority: 'low',
      reviewedBy: 'Manager Smith',
      reviewDate: '2024-05-05'
    },
    {
      id: '5',
      type: 'expense',
      invoiceNumber: 'EXP-2024-001',
      contractor: 'Mike Thompson',
      project: 'Montney Drilling - Travel',
      amount: 450,
      submittedDate: '2024-06-10',
      status: 'pending',
      priority: 'low'
    }
  ];

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = filteredItems.map(item => item.id);
    setSelectedItems(prev => 
      prev.length === filteredIds.length ? [] : filteredIds
    );
  };

  const handleBulkApproval = (action: 'approve' | 'reject') => {
    setBulkAction(action);
    setShowBulkPanel(true);
  };

  const executeApproval = (itemId: string, action: 'approve' | 'reject', notes?: string) => {
    console.log(`${action} item ${itemId} with notes: ${notes}`);
    // Update item status logic would go here
  };

  const filteredItems = approvalItems.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'needs_review':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'needs_review':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    pending: approvalItems.filter(item => item.status === 'pending').length,
    needsReview: approvalItems.filter(item => item.status === 'needs_review').length,
    approved: approvalItems.filter(item => item.status === 'approved').length,
    rejected: approvalItems.filter(item => item.status === 'rejected').length,
    totalValue: approvalItems
      .filter(item => item.status === 'pending' || item.status === 'needs_review')
      .reduce((sum, item) => sum + item.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Review</p>
              <p className="text-2xl font-bold text-orange-600">{stats.needsReview}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-blue-900">
                {selectedItems.length} item(s) selected
              </span>
              <span className="text-blue-700">
                Total: ${approvalItems
                  .filter(item => selectedItems.includes(item.id))
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkApproval('approve')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Bulk Approve
              </button>
              <button
                onClick={() => handleBulkApproval('reject')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Bulk Reject
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'pending', name: 'Pending', count: stats.pending },
              { id: 'needs_review', name: 'Needs Review', count: stats.needsReview },
              { id: 'approved', name: 'Approved', count: stats.approved },
              { id: 'rejected', name: 'Rejected', count: stats.rejected },
              { id: 'all', name: 'All Items', count: approvalItems.length }
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
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>
        </div>

        {/* Approval Items List */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-4 hover:shadow-md transition-all ${
                selectedItems.includes(item.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="h-4 w-4 text-blue-600 rounded"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <h4 className="font-semibold text-gray-900">{item.invoiceNumber}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority} priority
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${item.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Amount</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <strong>Contractor:</strong> {item.contractor}
                      </div>
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        <strong>Type:</strong> {item.type}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        <strong>Project:</strong> {item.project}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <strong>Submitted:</strong> {new Date(item.submittedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      {item.reviewedBy && (
                        <div className="flex items-center mb-1">
                          <UserIcon className="h-4 w-4 mr-1" />
                          <strong>Reviewed by:</strong> {item.reviewedBy}
                        </div>
                      )}
                      {item.reviewDate && (
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <strong>Review date:</strong> {new Date(item.reviewDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Issues */}
                  {item.issues && item.issues.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                      <h5 className="font-medium text-orange-900 mb-2">
                        {item.issues.length} Issue(s) Found
                      </h5>
                      <div className="space-y-2">
                        {item.issues.map((issue, idx) => (
                          <div key={idx} className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-orange-800 text-sm font-medium">
                                {issue.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                              <div className="text-orange-700 text-sm">{issue.description}</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ml-2 ${
                              issue.severity === 'major' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {issue.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <h5 className="font-medium text-blue-900 mb-1">Notes</h5>
                      <p className="text-blue-800 text-sm">{item.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => executeApproval(item.id, 'approve')}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => executeApproval(item.id, 'reject')}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4 inline mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    {item.status === 'needs_review' && (
                      <>
                        <button className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-yellow-700 transition-colors">
                          Request Clarification
                        </button>
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          Approve with Adjustment
                        </button>
                      </>
                    )}
                    <button className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No items found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Bulk Action Panel */}
      {showBulkPanel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bulk {bulkAction === 'approve' ? 'Approval' : 'Rejection'}
            </h3>
            <p className="text-gray-600 mb-4">
              You are about to {bulkAction} {selectedItems.length} item(s) with a total value of ${
                approvalItems
                  .filter(item => selectedItems.includes(item.id))
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toLocaleString()
              }.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add any comments or reasoning..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Execute bulk action
                  setShowBulkPanel(false);
                  setSelectedItems([]);
                  setBulkAction(null);
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition-colors ${
                  bulkAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {bulkAction === 'approve' ? 'Approval' : 'Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowBulkPanel(false);
                  setBulkAction(null);
                }}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Demo Benefits */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Streamlined Approval Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-green-600">Efficiency Gains:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• Bulk approval for perfect matches</li>
                  <li>• Automated flagging of discrepancies</li>
                  <li>• 80% faster approval process</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-blue-600">Quality Control:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• Systematic issue identification</li>
                  <li>• Audit trail for all decisions</li>
                  <li>• Standardized review criteria</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-purple-600">Management Insights:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• Real-time approval metrics</li>
                  <li>• Bottleneck identification</li>
                  <li>• Performance tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflow; 