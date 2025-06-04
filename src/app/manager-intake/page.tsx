'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  InboxIcon,
  DocumentArrowUpIcon,
  TableCellsIcon,
  CameraIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  BeakerIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import InvoiceIntakeUpload from '@/components/manager/InvoiceIntakeUpload';
import InvoiceProcessingEngine from '@/components/manager/InvoiceProcessingEngine';
import ReconciliationDashboard from '@/components/manager/ReconciliationDashboard';
import ExtractionReview from '@/components/manager/ExtractionReview';

type ActiveTab = 'intake' | 'processing' | 'review' | 'reconciliation' | 'analytics';

interface ProcessingStats {
  totalInvoices: number;
  autoProcessed: number;
  manualReview: number;
  timeSaved: number;
  accuracyRate: number;
}

export default function ManagerIntakePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('intake');
  const [processingStats, setProcessingStats] = useState<ProcessingStats>({
    totalInvoices: 247,
    autoProcessed: 223,
    manualReview: 24,
    timeSaved: 52.3,
    accuracyRate: 94.2
  });

  const tabs = [
    { 
      id: 'intake', 
      name: 'Intake Pipeline', 
      icon: InboxIcon, 
      description: 'Multiple invoice input methods',
      count: 15 
    },
    { 
      id: 'processing', 
      name: 'AI Processing', 
      icon: BeakerIcon, 
      description: 'OCR extraction & data standardization',
      count: 8 
    },
    { 
      id: 'review', 
      name: 'Review Queue', 
      icon: EyeIcon, 
      description: 'Manual review for low-confidence items',
      count: 24 
    },
    { 
      id: 'reconciliation', 
      name: 'Auto-Match', 
      icon: CheckCircleIcon, 
      description: 'Match invoices to work orders',
      count: 223 
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: ChartBarIcon, 
      description: 'Processing performance metrics',
      count: 0 
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'intake':
        return <InvoiceIntakeUpload />;
      case 'processing':
        return <InvoiceProcessingEngine />;
      case 'review':
        return <ExtractionReview />;
      case 'reconciliation':
        return <ReconciliationDashboard />;
      case 'analytics':
        return <ProcessingAnalytics stats={processingStats} />;
      default:
        return <InvoiceIntakeUpload />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">IP</span>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">Invoice Intake Pipeline</h1>
                <p className="text-gray-600">Automated processing with 10x speed improvement</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Processing Time Saved Today</div>
              <div className="text-2xl font-bold text-green-600">{processingStats.timeSaved} hours</div>
              <div className="text-sm text-gray-500">{processingStats.accuracyRate}% accuracy rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BoltIcon className="h-6 w-6 mr-3" />
              <div>
                <h3 className="font-semibold">Live Demo - Automated Invoice Processing</h3>
                <p className="text-indigo-100 text-sm">Watch real-time OCR extraction and auto-matching in action</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{processingStats.autoProcessed}</div>
                <div className="text-xs text-indigo-200">Auto-Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{processingStats.manualReview}</div>
                <div className="text-xs text-indigo-200">Manual Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10x</div>
                <div className="text-xs text-indigo-200">Faster Processing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{tab.name}</div>
                  <div className="text-xs text-gray-500">{tab.description}</div>
                </div>
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

// Processing Analytics Component
function ProcessingAnalytics({ stats }: { stats: ProcessingStats }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentArrowUpIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Auto-Processed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.autoProcessed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Time Saved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.timeSaved}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Accuracy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.accuracyRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Speed Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Processing Speed Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Manual Processing (Traditional)</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Invoice Review:</span>
                <span className="text-sm font-medium">8-12 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Data Entry:</span>
                <span className="text-sm font-medium">3-5 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Work Order Matching:</span>
                <span className="text-sm font-medium">5-8 minutes</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium text-gray-900">Total per Invoice:</span>
                <span className="font-bold text-red-600">16-25 minutes</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Automated Processing (InvoicePatch)</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">OCR Extraction:</span>
                <span className="text-sm font-medium">15-30 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auto Data Mapping:</span>
                <span className="text-sm font-medium">5-10 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Work Order Matching:</span>
                <span className="text-sm font-medium">2-5 seconds</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium text-gray-900">Total per Invoice:</span>
                <span className="font-bold text-green-600">22-45 seconds</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <BoltIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Processing Speed Improvement: 10-20x faster</span>
          </div>
        </div>
      </div>
    </div>
  );
} 