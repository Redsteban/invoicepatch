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

const ContractorSidebar = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { 
    isSimulationMode, 
    simulationDay, 
    startSimulation, 
    exitSimulation
  } = useContractor();

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

      {/* Simulation Mode Section */}
      <div className="p-4 border-b border-gray-200">
        {isSimulationMode ? (
          <div className="space-y-3">
            {/* Simulation Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Demo Mode</span>
              </div>
              <div className="text-xs text-blue-700 mb-3">
                Day {simulationDay}/15 - Interactive Demo
              </div>
              <button
                onClick={exitSimulation}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors"
              >
                Exit Demo
              </button>
            </div>
            
            {/* Simulation Features Highlight */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-800">Demo Features</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• Interactive invoice generation</div>
                <div>• Real-time calculations</div>
                <div>• PDF preview & download</div>
                <div>• Progressive scenarios</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Demo Call-to-Action */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Play className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Try 15-Day Demo</span>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Experience the full contractor workflow with interactive scenarios
              </p>
              <button
                onClick={() => startSimulation('oil_gas')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors"
              >
                Start Demo
              </button>
            </div>
            
            {/* Quick Demo Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 space-y-1">
                <div>• 15 progressive scenarios</div>
                <div>• Real invoice generation</div>
                <div>• PDF download & email</div>
                <div>• No data saved</div>
              </div>
            </div>
          </div>
        )}
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
    </>
  );
};

export default ContractorSidebar; 