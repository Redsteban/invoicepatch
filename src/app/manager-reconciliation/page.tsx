'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  CurrencyDollarIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import WorkOrderUpload from '@/components/manager/WorkOrderUpload';
import InvoiceComparison from '@/components/manager/InvoiceComparison';
import ApprovalWorkflow from '@/components/manager/ApprovalWorkflow';
import ReconciliationDashboard from '@/components/manager/ReconciliationDashboard';

type ActiveStep = 'dashboard' | 'upload' | 'comparison' | 'approval' | 'export';

export default function ManagerReconciliationPage() {
  const [activeStep, setActiveStep] = useState<ActiveStep>('dashboard');
  const [demoMode, setDemoMode] = useState(true);

  const steps = [
    { id: 'dashboard', name: 'Overview', icon: ChartBarIcon, description: 'Reconciliation dashboard & metrics' },
    { id: 'upload', name: 'ERP Sync', icon: CloudArrowUpIcon, description: 'Upload work order data from ERP' },
    { id: 'comparison', name: 'Invoice Review', icon: CheckCircleIcon, description: 'Auto-match & validate invoices' },
    { id: 'approval', name: 'Bulk Approve', icon: ExclamationTriangleIcon, description: 'Mass approve matched invoices' },
    { id: 'export', name: 'Export', icon: ArrowDownTrayIcon, description: 'Download to accounting system' }
  ];

  const renderActiveComponent = () => {
    switch (activeStep) {
      case 'dashboard':
        return <ReconciliationDashboard />;
      case 'upload':
        return <WorkOrderUpload />;
      case 'comparison':
        return <InvoiceComparison />;
      case 'approval':
        return <ApprovalWorkflow />;
      case 'export':
        return <div className="text-center py-12"><p>Export functionality coming soon...</p></div>;
      default:
        return <ReconciliationDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-3 sm:gap-0">
            <div className="flex items-center">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">IP</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Manager Reconciliation Center</h1>
                <p className="text-sm sm:text-base text-gray-600">Automated Invoice Processing & Approval Workflows</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-gray-600">Time Saved This Month</div>
                <div className="text-lg sm:text-xl font-bold text-green-600">47.5 hours</div>
                <div className="text-xs text-gray-500">Worth $11,875 in labor costs</div>
              </div>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  demoMode 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                {demoMode ? 'Demo Mode' : 'Live Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Steps */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 py-3 sm:py-4 min-w-max sm:min-w-0">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id as ActiveStep)}
                className={`flex flex-col sm:flex-row items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeStep === step.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <step.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2" />
                <div className="text-center sm:text-left">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Demo Banner */}
      {demoMode && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6 mb-2 sm:mb-0 sm:mr-3" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Manager Demo - Oil & Gas Reconciliation</h3>
                  <p className="text-blue-100 text-xs sm:text-sm">Experience automated invoice processing with realistic project data from major energy companies</p>
                </div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-xs sm:text-sm text-blue-100">Potential Monthly Savings</div>
                <div className="text-lg sm:text-xl font-bold">$12,000+ in labor costs</div>
                <div className="text-xs text-blue-200">Based on $250/hour manager rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manager vs Contractor Clarity Banner */}
      <div className="bg-emerald-50 border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-2 sm:gap-0">
            <div className="flex items-center text-emerald-800">
              <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">Manager Interface:</span>
              <span className="ml-1 sm:ml-2">Bulk ERP uploads, auto-matching, mass approvals</span>
            </div>
            <div className="flex items-center text-emerald-700 pl-5 sm:pl-0">
              <span className="mr-2">Contractors use separate mobile app for manual entry</span>
              <ArrowDownTrayIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
} 