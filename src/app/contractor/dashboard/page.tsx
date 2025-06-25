'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ContractorDashboardOverview from '@/components/contractor/ContractorDashboardOverview';
import TimeTrackingWidget from '@/components/contractor/TimeTrackingWidget';
import InvoiceStatusWidget from '@/components/contractor/InvoiceStatusWidget';
import TicketInformationForm from '@/components/contractor/TicketInformationForm';

type ActiveView = 'overview' | 'time-tracking' | 'ticket-info' | 'invoices' | 'history' | 'expenses' | 'payments' | 'settings';

export default function ContractorDashboardPage() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const { role } = useRole();

  // Handle URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'time-tracking', 'ticket-info', 'invoices', 'history', 'expenses', 'payments', 'settings'].includes(tab)) {
      setActiveView(tab as ActiveView);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <ContractorDashboardOverview />;
      case 'time-tracking':
        return <TimeTrackingWidget />;
      case 'ticket-info':
        return <TicketInformationForm />;
      case 'invoices':
        return <InvoiceStatusWidget />;
      case 'history':
        return <WorkHistoryView />;
      case 'expenses':
        return <ExpensesView />;
      case 'payments':
        return <PaymentsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ContractorDashboardOverview />;
    }
  };

  return (
    <ProtectedRoute requiredRole="contractor">
      <div className="flex-1 lg:ml-0">
        {/* Mobile padding for sidebar button */}
        <div className="lg:hidden h-16"></div>
        
        {/* Content Area */}
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Contractor Dashboard</h1>
                  <p className="text-gray-600 mt-1">
                    Welcome back! Track your work, manage invoices, and monitor your earnings.
                  </p>
                </div>
                
                {/* Quick Actions */}
                <div className="hidden md:flex items-center space-x-3">
                  <button 
                    onClick={() => setActiveView('ticket-info')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Fill Ticket
                  </button>
                  <button 
                    onClick={() => setActiveView('time-tracking')}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Start Work Timer
                  </button>
                  <button 
                    onClick={() => setActiveView('invoices')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Getting Started Guide */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">See How It Works</h2>
                  <p className="text-green-100 mt-1">
                    Run a personalized 15-day invoice simulation to see your earnings calculated automatically.
                  </p>
                </div>
                <a 
                  href="/contractor-demo"
                  className="bg-white text-green-700 font-bold px-5 py-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Try the Demo
                </a>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', description: 'Dashboard summary' },
                  { id: 'time-tracking', label: 'Time Tracking', description: 'Work timer & GPS' },
                  { id: 'ticket-info', label: 'Ticket Info', description: 'Daily rates & expenses' },
                  { id: 'invoices', label: 'Invoices', description: 'Current & past invoices' },
                  { id: 'history', label: 'Work History', description: 'Past work entries' },
                  { id: 'expenses', label: 'Expenses', description: 'Track expenses' },
                  { id: 'payments', label: 'Payments', description: 'Payment history' },
                  { id: 'settings', label: 'Settings', description: 'Account settings' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as ActiveView)}
                    className={`flex-shrink-0 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeView === tab.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500 hidden lg:block">{tab.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="transition-all duration-300">
              {renderContent()}
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Placeholder components for other views
function WorkHistoryView() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Work History</h2>
      <p className="text-gray-600">Your complete work history and time entries will be displayed here.</p>
    </div>
  );
}

function ExpensesView() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Expenses</h2>
      <p className="text-gray-600">Track and manage your work-related expenses here.</p>
    </div>
  );
}

function PaymentsView() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payments</h2>
      <p className="text-gray-600">View your payment history and upcoming payments here.</p>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
      <p className="text-gray-600">Manage your account settings and preferences here.</p>
    </div>
  );
} 