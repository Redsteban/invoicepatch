'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Bell,
  Upload,
  CheckSquare,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  Play,
  Menu,
  X,
  Building2
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const ManagerSidebar = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mainNavItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      href: '/manager/dashboard',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      label: 'Team Management',
      href: '/manager/team',
      icon: <Users className="w-5 h-5" />
    },
    {
      label: 'Invoice Processing',
      href: '/manager/invoice-matching',
      icon: <FileText className="w-5 h-5" />,
      badge: '12'
    },
    {
      label: 'Approval Workflow',
      href: '/manager/approval-workflow',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: '5'
    },
    {
      label: 'Reconciliation',
      href: '/manager/reconciliation',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      label: 'Analytics',
      href: '/manager/analytics',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      label: 'Reporting',
      href: '/manager/reporting',
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  const toolsNavItems: SidebarItem[] = [
    {
      label: 'Manual Upload',
      href: '/manager/manual-upload',
      icon: <Upload className="w-5 h-5" />
    },
    {
      label: 'Notifications',
      href: '/manager/notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: '3'
    },
    {
      label: 'Issue Detection',
      href: '/manager/issue-detection',
      icon: <Eye className="w-5 h-5" />
    },
    {
      label: 'Payroll Calendar',
      href: '/manager/payroll-calendar',
      icon: <Calendar className="w-5 h-5" />
    }
  ];

  const demosNavItems: SidebarItem[] = [
    {
      label: 'Manager Demo',
      href: '/manager-demo',
      icon: <Play className="w-5 h-5" />
    },
    {
      label: 'Invoice Demo',
      href: '/invoice-demo',
      icon: <FileText className="w-5 h-5" />
    },
    {
      label: 'Payroll Demo',
      href: '/payroll-demo',
      icon: <DollarSign className="w-5 h-5" />
    }
  ];

  const isActive = (href: string) => {
    return pathname === href || (href !== '/manager/dashboard' && pathname.startsWith(href));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Manager Hub</h2>
            <p className="text-sm text-gray-500">Invoice Processing</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        {/* Main Navigation */}
        <div className="px-6 mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main
          </h3>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Tools Section */}
        <div className="px-6 mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Tools
          </h3>
          <nav className="space-y-1">
            {toolsNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Demos Section */}
        <div className="px-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Demos
          </h3>
          <nav className="space-y-1">
            {demosNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <Link
          href="/manager/settings"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive('/manager/settings')
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default ManagerSidebar; 