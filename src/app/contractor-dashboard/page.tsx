'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import {
  HomeIcon,
  SparklesIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BriefcaseIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import Dashboard from '../../components/contractor/Dashboard';
import AutomationShowcase from '../../components/contractor/AutomationShowcase';
import IntelligentTimeTracking from '../../components/contractor/IntelligentTimeTracking';
import InvoiceManagement from '../../components/contractor/InvoiceManagement';
import BusinessAnalytics from '../../components/contractor/BusinessAnalytics';
import ActiveProjects from '../../components/contractor/ActiveProjects';
import DocumentCenter from '../../components/contractor/DocumentCenter';

type TabType = 'overview' | 'automation' | 'timetracking' | 'invoices' | 'analytics' | 'projects' | 'documents';

export default function ContractorDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Check onboarding status - in a real app, get userId from auth context
  // For demo purposes, using a proper UUID format
  const { isLoading, error, needsOnboarding } = useOnboardingStatus('123e4567-e89b-12d3-a456-426614174000', true);
  
  // Show loading while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your setup...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview' as TabType,
      name: 'Overview',
      icon: HomeIcon,
      description: 'Dashboard summary and quick actions'
    },
    {
      id: 'automation' as TabType,
      name: 'Automation',
      icon: SparklesIcon,
      description: 'Stack payroll automation system'
    },
    {
      id: 'timetracking' as TabType,
      name: 'Smart Time Tracking',
      icon: ClockIcon,
      description: 'Intelligent work period detection'
    },
    {
      id: 'invoices' as TabType,
      name: 'Invoice Management',
      icon: DocumentTextIcon,
      description: 'Create and manage invoices'
    },
    {
      id: 'projects' as TabType,
      name: 'Active Projects',
      icon: BriefcaseIcon,
      description: 'Current project tracking'
    },
    {
      id: 'analytics' as TabType,
      name: 'Business Analytics',
      icon: ChartBarIcon,
      description: 'Performance insights and reports'
    },
    {
      id: 'documents' as TabType,
      name: 'Document Center',
      icon: FolderIcon,
      description: 'File management and storage'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard />;
      case 'automation':
        return <AutomationShowcase />;
      case 'timetracking':
        return <IntelligentTimeTracking />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'projects':
        return <ActiveProjects />;
      case 'analytics':
        return <BusinessAnalytics />;
      case 'documents':
        return <DocumentCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contractor Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Complete Stack Production Testing automation and intelligent time tracking system
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <tab.icon className={`h-4 w-4 ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-sm">{tab.name}</span>
                </div>
                <p className="text-xs text-gray-500 hidden lg:block">{tab.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Feature Highlights */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Stack Integration Benefits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Never Miss Deadlines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automatic invoice generation every Saturday</li>
                <li>• Smart period boundary detection</li>
                <li>• Progressive deadline reminders</li>
                <li>• GPS-verified time tracking</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">Intelligent Automation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pattern recognition and learning</li>
                <li>• Pre-populated with standard rates</li>
                <li>• Smart work day suggestions</li>
                <li>• Missing time recovery alerts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-700 mb-2">Field Work Optimization</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Live timer with break tracking</li>
                <li>• Weather condition logging</li>
                <li>• Photo and voice documentation</li>
                <li>• Travel time calculation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 