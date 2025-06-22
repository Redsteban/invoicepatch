'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { ChevronRight, Home, Building2, HardHat, User, Settings, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
}

export default function RoleBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isManager, isContractor, switchRole, clearRole } = useRole();

  // Define role-specific navigation structures
  const managerNavigation: Record<string, NavigationItem> = {
    '/manager': { label: 'Manager Hub', icon: <Building2 className="w-4 h-4" /> },
    '/manager/dashboard': { label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    '/manager/login': { label: 'Login', icon: <User className="w-4 h-4" /> },
    '/manager/analytics': { label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    '/manager/approval-workflow': { label: 'Approvals', icon: <FileText className="w-4 h-4" /> },
    '/manager/invoice-matching': { label: 'Invoice Matching', icon: <FileText className="w-4 h-4" /> },
    '/manager/reconciliation': { label: 'Reconciliation', icon: <FileText className="w-4 h-4" /> },
    '/manager/reporting': { label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    '/manager/settings': { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    '/manager/manual-upload': { label: 'Manual Upload', icon: <FileText className="w-4 h-4" /> },
    '/manager/notifications': { label: 'Notifications', icon: <FileText className="w-4 h-4" /> },
  };

  const contractorNavigation: Record<string, NavigationItem> = {
    '/contractor': { label: 'Contractor Hub', icon: <HardHat className="w-4 h-4" /> },
    '/contractor/dashboard': { label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    '/contractor/invoice': { label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
    '/contractor/projects': { label: 'Projects', icon: <FileText className="w-4 h-4" /> },
    '/contractor/time-tracking': { label: 'Time Tracking', icon: <FileText className="w-4 h-4" /> },
    '/contractor/expenses': { label: 'Expenses', icon: <FileText className="w-4 h-4" /> },
    '/contractor/payments': { label: 'Payments', icon: <FileText className="w-4 h-4" /> },
    '/contractor/settings': { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  };

  // Generate breadcrumb items based on current path and role
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always start with home
    breadcrumbs.push({
      label: 'Home',
      path: '/',
      icon: <Home className="w-4 h-4" />
    });

    // Skip breadcrumbs for home page
    if (pathname === '/') {
      return breadcrumbs;
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    const navigation = isManager ? managerNavigation : contractorNavigation;

    // Build path progressively
    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      
      // Find matching navigation item
      const navItem = navigation[currentPath];
      
      if (navItem) {
        breadcrumbs.push({
          label: navItem.label,
          path: currentPath,
          icon: navItem.icon
        });
      } else {
        // Fallback for dynamic routes or unmatched paths
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          path: currentPath
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or if no role
  if (pathname === '/' || !role) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between py-3">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <div key={item.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  // Current page - not clickable
                  <span className="flex items-center text-gray-900 font-medium">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </span>
                ) : (
                  // Clickable breadcrumb
                  <Link
                    href={item.path}
                    className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Role Indicator & Actions */}
          <div className="flex items-center space-x-4">
            {/* Current Role Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Role:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isManager 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {isManager ? (
                  <>
                    <Building2 className="w-3 h-3 mr-1" />
                    Manager
                  </>
                ) : (
                  <>
                    <HardHat className="w-3 h-3 mr-1" />
                    Contractor
                  </>
                )}
              </span>
            </div>

            {/* Role Actions Dropdown */}
            <div className="relative group">
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                <Settings className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => switchRole(isManager ? 'contractor' : 'manager')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    {isManager ? (
                      <>
                        <HardHat className="w-4 h-4 mr-2" />
                        Switch to Contractor
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 mr-2" />
                        Switch to Manager
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearRole}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Return to Role Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 