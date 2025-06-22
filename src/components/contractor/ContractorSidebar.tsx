'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  FileImage
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
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
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
                      ? 'bg-emerald-100 text-emerald-700'
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
                      ? 'bg-emerald-100 text-emerald-700'
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
                      ? 'bg-emerald-100 text-emerald-700'
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
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-700">Work Status</span>
          </div>
          <p className="text-xs text-emerald-600">Ready to work</p>
          <p className="text-xs text-gray-500">Calgary Downtown - Site A</p>
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