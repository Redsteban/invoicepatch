'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  FlagIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface ReviewItem {
  id: string;
  fileName: string;
  contractor: string;
  amount: string;
  extractedData: ExtractedField[];
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  submittedAt: string;
  confidence: number;
}

interface ExtractedField {
  field: string;
  extractedValue: string;
  suggestedValue?: string;
  confidence: number;
  needsReview: boolean;
  source: 'ocr' | 'ai' | 'pattern';
  userCorrected?: boolean;
  correctedValue?: string;
}

export default function ExtractionReview() {
  const [selectedItem, setSelectedItem] = useState<string | null>('item-1');
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('detail');
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);

  const reviewQueue: ReviewItem[] = [
    {
      id: 'item-1',
      fileName: 'handwritten-invoice-scan.jpg',
      contractor: 'Mike Johnson Contracting',
      amount: '$1,847.50',
      submittedAt: '2024-01-15 14:23',
      confidence: 72.3,
      status: 'pending',
      priority: 'high',
      extractedData: [
        { field: 'Invoice Number', extractedValue: 'MJ-2024-003', confidence: 89.2, needsReview: false, source: 'ocr' },
        { field: 'Contractor Name', extractedValue: 'Mike Johnson Contractin', suggestedValue: 'Mike Johnson Contracting', confidence: 67.8, needsReview: true, source: 'ocr' },
        { field: 'Invoice Date', extractedValue: '2024-01-12', confidence: 94.1, needsReview: false, source: 'pattern' },
        { field: 'Project Code', extractedValue: 'STACK-AB-Q1', suggestedValue: 'STACK-AB-2024-Q1', confidence: 73.4, needsReview: true, source: 'ai' },
        { field: 'Amount', extractedValue: '$1,B47.50', suggestedValue: '$1,847.50', confidence: 68.9, needsReview: true, source: 'ocr' },
        { field: 'Work Period', extractedValue: 'Jan 8-12, 2024', confidence: 81.2, needsReview: false, source: 'ai' }
      ]
    },
    {
      id: 'item-2',
      fileName: 'faded-receipt-photo.jpg',
      contractor: 'Sarah Thompson Ltd.',
      amount: '$892.00',
      submittedAt: '2024-01-15 13:45',
      confidence: 78.9,
      status: 'in-review',
      priority: 'medium',
      extractedData: [
        { field: 'Invoice Number', extractedValue: 'ST-2024-001', confidence: 95.6, needsReview: false, source: 'ocr' },
        { field: 'Contractor Name', extractedValue: 'Sarah Thompson Ltd.', confidence: 92.1, needsReview: false, source: 'ocr' },
        { field: 'Amount', extractedValue: '$B92.00', suggestedValue: '$892.00', confidence: 71.3, needsReview: true, source: 'ocr' }
      ]
    },
    {
      id: 'item-3',
      fileName: 'crumpled-invoice.pdf',
      contractor: 'Arctic Drilling Solutions',
      amount: '$3,245.75',
      submittedAt: '2024-01-15 12:15',
      confidence: 84.7,
      status: 'pending',
      priority: 'low',
      extractedData: []
    }
  ];

  const selectedReviewItem = reviewQueue.find(item => item.id === selectedItem);

  const handleFieldCorrection = (fieldIndex: number, correctedValue: string) => {
    // In a real app, this would update the state/database
    console.log(`Correcting field ${fieldIndex} to: ${correctedValue}`);
  };

  const handleApprove = (itemId: string) => {
    console.log(`Approving item: ${itemId}`);
  };

  const handleReject = (itemId: string) => {
    console.log(`Rejecting item: ${itemId}`);
  };

  const handleBulkApprove = () => {
    console.log(`Bulk approving: ${bulkSelected}`);
    setBulkSelected([]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600 bg-green-100';
    if (confidence >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ocr':
        return <EyeIcon className="h-4 w-4 text-blue-600" />;
      case 'ai':
        return <CpuChipIcon className="h-4 w-4 text-indigo-600" />;
      case 'pattern':
        return <MagnifyingGlassIcon className="h-4 w-4 text-purple-600" />;
      default:
        return <DocumentDuplicateIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Manual Review Queue</h3>
            <p className="text-sm text-gray-600">Low-confidence extractions requiring human verification</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView(currentView === 'list' ? 'detail' : 'list')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {currentView === 'list' ? 'Detail View' : 'List View'}
            </button>
            {bulkSelected.length > 0 && (
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Approve {bulkSelected.length} Items
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{reviewQueue.filter(i => i.priority === 'high').length}</div>
            <div className="text-sm text-red-700">High Priority</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{reviewQueue.filter(i => i.priority === 'medium').length}</div>
            <div className="text-sm text-yellow-700">Medium Priority</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{reviewQueue.length}</div>
            <div className="text-sm text-gray-700">Total Items</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">4.2min</div>
            <div className="text-sm text-blue-700">Avg Review Time</div>
          </div>
        </div>
      </div>

      {currentView === 'list' ? (
        /* List View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Review Queue</h4>
              <div className="text-sm text-gray-600">{reviewQueue.length} items pending</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {reviewQueue.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={bulkSelected.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelected([...bulkSelected, item.id]);
                        } else {
                          setBulkSelected(bulkSelected.filter(id => id !== item.id));
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.fileName}</p>
                      <p className="text-sm text-gray-600">{item.contractor} • {item.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                      {item.confidence}%
                    </span>
                    <button
                      onClick={() => {
                        setSelectedItem(item.id);
                        setCurrentView('detail');
                      }}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Detail View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Queue Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Review Queue</h4>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {reviewQueue.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 ${
                      selectedItem === item.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                        {item.confidence}%
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 truncate">{item.fileName}</p>
                    <p className="text-sm text-gray-600 truncate">{item.contractor}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.submittedAt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedReviewItem && (
              <div className="space-y-6">
                {/* Item Header */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedReviewItem.fileName}</h3>
                      <p className="text-sm text-gray-600">{selectedReviewItem.contractor} • {selectedReviewItem.amount}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(selectedReviewItem.confidence)}`}>
                        {selectedReviewItem.confidence}% confidence
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedReviewItem.priority)}`}>
                        {selectedReviewItem.priority} priority
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(selectedReviewItem.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Approve All
                    </button>
                    <button
                      onClick={() => handleReject(selectedReviewItem.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>

                {/* Extracted Fields Review */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Extracted Data Review</h4>
                  <div className="space-y-4">
                    {selectedReviewItem.extractedData.map((field, index) => (
                      <motion.div
                        key={field.field}
                        className={`p-4 rounded-lg border-2 ${
                          field.needsReview 
                            ? 'border-yellow-200 bg-yellow-50' 
                            : 'border-green-200 bg-green-50'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {getSourceIcon(field.source)}
                            <span className="ml-2 font-medium text-gray-900">{field.field}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(field.confidence)}`}>
                              {field.confidence}%
                            </span>
                            {field.needsReview && (
                              <FlagIcon className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Extracted Value</label>
                            <div className="mt-1 p-2 bg-gray-100 rounded border text-sm font-mono">
                              {field.extractedValue}
                            </div>
                          </div>

                          {field.suggestedValue && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">AI Suggestion</label>
                              <div className="mt-1 p-2 bg-blue-50 rounded border text-sm font-mono">
                                {field.suggestedValue}
                              </div>
                            </div>
                          )}

                          {field.needsReview && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Corrected Value</label>
                              <div className="mt-1 flex space-x-2">
                                <input
                                  type="text"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  placeholder="Enter corrected value"
                                  defaultValue={field.suggestedValue || field.extractedValue}
                                />
                                <button
                                  onClick={() => handleFieldCorrection(index, 'corrected_value')}
                                  className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 