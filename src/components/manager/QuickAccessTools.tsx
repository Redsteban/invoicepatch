'use client';

import Link from 'next/link';
import { 
  UserPlus, 
  Upload, 
  FileText, 
  CheckSquare, 
  Settings, 
  Bell,
  BarChart3,
  Calendar,
  Eye,
  DollarSign,
  Users,
  ArrowRight
} from 'lucide-react';

interface QuickAccessTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
  isNew?: boolean;
}

const QuickAccessTools = () => {
  const tools: QuickAccessTool[] = [
    {
      id: 'add-team-member',
      title: 'Add Team Member',
      description: 'Invite new team members and set permissions',
      icon: <UserPlus className="w-6 h-6" />,
      href: '/manager/team/add',
      color: 'blue'
    },
    {
      id: 'bulk-upload',
      title: 'Bulk Upload',
      description: 'Upload multiple invoices for processing',
      icon: <Upload className="w-6 h-6" />,
      href: '/manager/manual-upload',
      color: 'green',
      badge: '12 pending'
    },
    {
      id: 'approval-queue',
      title: 'Approval Queue',
      description: 'Review and approve pending invoices',
      icon: <CheckSquare className="w-6 h-6" />,
      href: '/manager/approval-workflow',
      color: 'orange',
      badge: '5 waiting'
    },
    {
      id: 'team-performance',
      title: 'Team Performance',
      description: 'View detailed team analytics and reports',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/manager/analytics',
      color: 'purple'
    },
    {
      id: 'issue-detection',
      title: 'Issue Detection',
      description: 'Review flagged invoices and anomalies',
      icon: <Eye className="w-6 h-6" />,
      href: '/manager/issue-detection',
      color: 'red',
      badge: '3 issues'
    },
    {
      id: 'payroll-calendar',
      title: 'Payroll Calendar',
      description: 'Manage payroll schedules and deadlines',
      icon: <Calendar className="w-6 h-6" />,
      href: '/manager/payroll-calendar',
      color: 'indigo'
    },
    {
      id: 'reconciliation',
      title: 'Reconciliation',
      description: 'Match invoices with work orders',
      icon: <DollarSign className="w-6 h-6" />,
      href: '/manager/reconciliation',
      color: 'emerald'
    },
    {
      id: 'team-settings',
      title: 'Team Settings',
      description: 'Configure team permissions and workflows',
      icon: <Settings className="w-6 h-6" />,
      href: '/manager/settings',
      color: 'gray'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alerts and notification preferences',
      icon: <Bell className="w-6 h-6" />,
      href: '/manager/notifications',
      color: 'yellow',
      badge: '3 new',
      isNew: true
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      red: 'bg-red-50 text-red-600 hover:bg-red-100',
      indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
      emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
      gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
      yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-50 text-gray-600 hover:bg-gray-100';
  };

  const getBadgeColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      orange: 'bg-orange-100 text-orange-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      emerald: 'bg-emerald-100 text-emerald-800',
      gray: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Access</h3>
          <p className="text-sm text-gray-500">Team management tools and shortcuts</p>
        </div>
        <Link 
          href="/manager/tools"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <span>View All Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group relative p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
          >
            {tool.isNew && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${getColorClasses(tool.color)}`}>
                {tool.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {tool.title}
                  </h4>
                  {tool.badge && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(tool.color)}`}>
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Featured Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
            <Users className="w-4 h-4 mr-2" />
            Team Meeting
          </button>
          <button className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
          <button className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessTools; 