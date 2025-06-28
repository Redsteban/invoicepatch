'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContractor } from '@/contexts/ContractorContext';
import { 
  BarChart3, 
  Clock, 
  FileText, 
  Settings, 
  Bell,
  Upload,
  CheckSquare,
  DollarSign,
  Calendar,
  Camera,
  Play,
  Menu,
  X,
  HardHat,
  MapPin,
  Truck,
  Calculator,
  FileImage,
  Target,
  Zap
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function ContractorSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSimulationMenu, setShowSimulationMenu] = useState(false);
  
  const { 
    isSimulationMode, 
    simulationDay, 
    simulationTemplate,
    simulationData,
    startSimulation, 
    exitSimulation
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

  const mainNavItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      href: '/contractor/dashboard',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      label: 'Time Tracking',
      href: '/contractor/time-tracking',
      icon: <Clock className="w-5 h-5" />,
      badge: 'Live'
    },
    {
      label: 'Invoices',
      href: '/contractor/invoices',
      icon: <FileText className="w-5 h-5" />,
      badge: '1'
    },
    {
      label: 'Work History',
      href: '/contractor/history',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      label: 'Expenses',
      href: '/contractor/expenses',
      icon: <Calculator className="w-5 h-5" />
    }
  ];

  const toolsNavItems: SidebarItem[] = [
    {
      label: 'Ticket Info',
      href: '/contractor/dashboard?tab=ticket-info',
      icon: <FileText className="w-5 h-5" />
    },
    {
      label: 'Photo Upload',
      href: '/contractor/photos',
      icon: <Camera className="w-5 h-5" />
    },
    {
      label: 'GPS Check-in',
      href: '/contractor/gps',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      label: 'Equipment Log',
      href: '/contractor/equipment',
      icon: <Truck className="w-5 h-5" />
    },
    {
      label: 'Quick Submit',
      href: '/contractor/submit',
      icon: <Upload className="w-5 h-5" />
    }
  ];

  const accountNavItems: SidebarItem[] = [
    {
      label: 'Payments',
      href: '/contractor/payments',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      label: 'Notifications',
      href: '/contractor/notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: '3'
    },
    {
      label: 'Settings',
      href: '/contractor/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const isActive = (href: string) => {
    if (href === '/contractor/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href) || false;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Simulation header at top */}
      {isSimulationMode && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-blue-900">🎯 Demo Mode</div>
              <div className="text-xs text-blue-700">
                Day {simulationDay} of 15 • {getSimulationProgress().percentage}% Complete
              </div>
            </div>
            <button
              onClick={exitSimulation}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Exit Demo
            </button>
          </div>
          
          {currentScenario && (
            <div className="mt-2 p-2 bg-white rounded text-xs">
              <div className="font-medium text-gray-900">{currentScenario.title}</div>
              <div className="text-gray-600">{currentScenario.description}</div>
            </div>
          )}
        </div>
      )}

      {/* Simulation starter for non-simulation users */}
      {!isSimulationMode && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <button
            onClick={() => setShowSimulationMenu(true)}
            className="w-full bg-green-600 text-white text-sm font-medium py-2 px-3 rounded hover:bg-green-700"
          >
            🚀 Try 15-Day Demo
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isSimulationMode ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            <HardHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Contractor</h2>
            <p className="text-sm text-gray-600">Work Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main
            </h3>
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? isSimulationMode 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.badge === 'Live' 
                        ? 'bg-red-100 text-red-600 animate-pulse'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Tools
            </h3>
            <div className="space-y-1">
              {toolsNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? isSimulationMode 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Account
            </h3>
            <div className="space-y-1">
              {accountNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? isSimulationMode 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`rounded-lg p-3 ${isSimulationMode ? 'bg-blue-50' : 'bg-emerald-50'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isSimulationMode ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
            <span className={`text-sm font-medium ${isSimulationMode ? 'text-blue-700' : 'text-emerald-700'}`}>
              {isSimulationMode ? 'Demo Status' : 'Work Status'}
            </span>
          </div>
          <p className={`text-xs ${isSimulationMode ? 'text-blue-600' : 'text-emerald-600'}`}>
            {isSimulationMode ? 'Demo mode active' : 'Ready to work'}
          </p>
          <p className="text-xs text-gray-500">
            {isSimulationMode ? 'Interactive simulation' : 'Calgary Downtown - Site A'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-80 bg-white h-full shadow-xl">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-80 bg-white border-r border-gray-200 h-screen">
          <SidebarContent />
        </div>
      </div>

      {/* Simulation starter modal */}
      {showSimulationMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Experience InvoicePatch Demo
            </h3>
            <p className="text-gray-600 mb-6">
              See how 15 days of contractor work flows through our system - from time tracking to final payment.
            </p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => {
                  startSimulation('oil_gas');
                  setShowSimulationMenu(false);
                }}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300"
              >
                <div className="font-semibold">🛢️ Oil & Gas Contractor</div>
                <div className="text-sm text-gray-600">Shell drilling project • $65-68/hr • Overtime scenarios</div>
              </button>
              
              <button
                onClick={() => {
                  startSimulation('construction');
                  setShowSimulationMenu(false);
                }}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 opacity-60"
                disabled
              >
                <div className="font-semibold">🏗️ Construction Manager</div>
                <div className="text-sm text-gray-600">Coming soon</div>
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSimulationMenu(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 