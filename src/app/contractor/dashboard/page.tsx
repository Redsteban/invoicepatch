'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { useContractor } from '@/contexts/ContractorContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ContractorDashboardOverview from '@/components/contractor/ContractorDashboardOverview';
import TimeTrackingWidget from '@/components/contractor/TimeTrackingWidget';
import InvoiceStatusWidget from '@/components/contractor/InvoiceStatusWidget';
import TicketInformationForm from '@/components/contractor/TicketInformationForm';
import SimulationIndicator, { SimulationBanner, SimulationBadge } from '@/components/contractor/SimulationIndicator';
import SimulationLauncher, { SimulationLauncherCompact } from '@/components/contractor/SimulationLauncher';

type ActiveView = 'overview' | 'time-tracking' | 'ticket-info' | 'invoices' | 'history' | 'expenses' | 'payments' | 'settings';

export default function ContractorDashboard() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const { role } = useRole();
  const { 
    dashboard, 
    isLoading, 
    error,
    // Add simulation props
    isSimulationMode,
    simulationDay,
    simulationData,
    advanceSimulationDay
  } = useContractor();

  const getSimulationProgress = () => {
    return {
      percentage: Math.round((simulationDay / 15) * 100)
    };
  };

  const getCurrentScenario = () => {
    if (!isSimulationMode || !simulationData.scenarios) return null;
    return simulationData.scenarios[simulationDay] || null;
  };

  const currentScenario = getCurrentScenario();

  // Handle URL parameters
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab && ['overview', 'time-tracking', 'ticket-info', 'invoices', 'history', 'expenses', 'payments', 'settings'].includes(tab)) {
      setActiveView(tab as ActiveView);
    }
  }, [searchParams]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
        
        {/* Simulation Banner */}
        <SimulationBanner />
        
        {/* Content Area */}
        <div className="p-6">
            {/* Add simulation progress bar */}
            {isSimulationMode && (
              <div className="mb-6 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Simulation Progress
                    </h2>
                    <p className="text-gray-600">Day {simulationDay} of 15</p>
                  </div>
                  <button
                    onClick={advanceSimulationDay}
                    disabled={simulationDay >= 15}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {simulationDay >= 15 ? 'Completed' : `Advance to Day ${simulationDay + 1}`}
                  </button>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getSimulationProgress().percentage}%` }}
                  ></div>
                </div>

                {currentScenario && currentScenario.events && currentScenario.events.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Today's Events:</h3>
                    <div className="space-y-2">
                      {currentScenario.events.map((event: any, index: number) => (
                        <div key={index} className="flex items-start space-x-2 text-sm">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <div>
                            <span className="text-blue-900">{event.message || event}</span>
                            {event.impact && (
                              <span className="ml-2 text-green-600 font-medium">({event.impact})</span>
                            )}
                            {event.time && (
                              <span className="ml-2 text-blue-700">at {event.time}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contractor Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                      Welcome back! Track your work, manage invoices, and monitor your earnings.
                    </p>
                  </div>
                  <SimulationBadge />
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

            {/* Getting Started Guide or Simulation Launcher */}
            {!isSimulationMode ? (
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
            ) : (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Simulation Active</h2>
                      <p className="text-blue-100 mt-1">
                        You're experiencing a {dashboard?.trialInvoice ? '15-day' : ''} work simulation. 
                        All data is generated for demonstration purposes.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        Day {simulationDay} of 15
                      </div>
                      <div className="text-blue-100 text-sm">
                        {getSimulationProgress().percentage}% Complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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

        {/* Simulation Indicator (Fixed Position) */}
        <SimulationIndicator />
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
      <p className="text-gray-600">View your payment history and upcoming payments.</p>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
      <p className="text-gray-600">Manage your account settings and preferences.</p>
    </div>
  );
} 