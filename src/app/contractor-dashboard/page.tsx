'use client';

import { useState } from 'react';
import ContractorNavigation from '@/components/contractor/ContractorNavigation';
import Dashboard from '@/components/contractor/Dashboard';
import ActiveProjects from '@/components/contractor/ActiveProjects';
import InvoiceManagement from '@/components/contractor/InvoiceManagement';
import BusinessAnalytics from '@/components/contractor/BusinessAnalytics';
import DocumentCenter from '@/components/contractor/DocumentCenter';
import InvoiceBuilder from '@/components/contractor/InvoiceBuilder';

type ActiveView = 'dashboard' | 'active-projects' | 'invoice-management' | 'invoice-builder' | 'business-analytics' | 'document-center';

export default function ContractorDashboardPage() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'active-projects':
        return <ActiveProjects />;
      case 'invoice-management':
        return <InvoiceManagement />;
      case 'invoice-builder':
        return <InvoiceBuilder onBack={() => setActiveView('dashboard')} />;
      case 'business-analytics':
        return <BusinessAnalytics />;
      case 'document-center':
        return <DocumentCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <ContractorNavigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 ml-0 lg:ml-64 pt-16 lg:pt-0">
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          {/* Contractor Interface Banner */}
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3 sm:mb-0 sm:mr-4 w-fit">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Contractor Interface</h2>
                  <p className="text-emerald-100 text-sm sm:text-base">
                    Manual time entry, expense tracking, and mobile invoicing for field workers
                  </p>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-emerald-100 space-y-1 sm:space-y-0 sm:space-x-4">
                    <span className="flex items-center">
                      <span className="mr-1">✓</span>
                      <span>Manual time & expense entry</span>
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">✓</span>
                      <span>Photo receipt capture</span>
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">✓</span>
                      <span>GPS location tracking</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-left lg:text-right mt-3 lg:mt-0">
                <div className="text-xs sm:text-sm text-emerald-100">Your Interface</div>
                <div className="text-base sm:text-lg font-bold">Mobile-First Design</div>
                <div className="text-xs text-emerald-200">Works offline in remote locations</div>
              </div>
            </div>
          </div>

          {/* Trial Mode Banner */}
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg p-3 sm:p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-3 sm:mb-0">
                <h2 className="text-base sm:text-lg font-bold">🚀 Trial Mode Active</h2>
                <p className="text-blue-100 text-sm">
                  Experience the full contractor dashboard with sample data. All features are fully functional for testing.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <button className="w-full sm:w-auto bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
                  Start Full Setup
                </button>
              </div>
            </div>
          </div>

          {renderActiveView()}
        </div>
      </main>
    </div>
  );
} 