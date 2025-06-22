'use client';

import { Clock, User, FileText, CheckCircle, AlertTriangle, Upload, DollarSign, Eye } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'invoice_processed' | 'approval_required' | 'issue_detected' | 'team_action' | 'upload' | 'reconciliation';
  title: string;
  description: string;
  user?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  amount?: string;
}

const RecentActivityFeed = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'invoice_processed',
      title: 'Invoice Processed',
      description: 'INV-2024-0847 processed successfully by Sarah Chen',
      user: 'Sarah Chen',
      timestamp: '2 minutes ago',
      status: 'success',
      amount: '$2,450.00'
    },
    {
      id: '2',
      type: 'approval_required',
      title: 'Approval Required',
      description: 'High-value invoice flagged for manager approval',
      timestamp: '5 minutes ago',
      status: 'warning',
      amount: '$8,750.00'
    },
    {
      id: '3',
      type: 'team_action',
      title: 'Team Member Added',
      description: 'Emily Watson joined the invoice processing team',
      user: 'System',
      timestamp: '12 minutes ago',
      status: 'info'
    },
    {
      id: '4',
      type: 'issue_detected',
      title: 'Duplicate Invoice Detected',
      description: 'Potential duplicate found for Contractor #247',
      timestamp: '18 minutes ago',
      status: 'error'
    },
    {
      id: '5',
      type: 'upload',
      title: 'Bulk Upload Completed',
      description: '15 invoices uploaded and queued for processing',
      user: 'Mike Rodriguez',
      timestamp: '25 minutes ago',
      status: 'success'
    },
    {
      id: '6',
      type: 'reconciliation',
      title: 'Reconciliation Match',
      description: 'Work order WO-2024-156 matched with invoice',
      timestamp: '32 minutes ago',
      status: 'success',
      amount: '$3,200.00'
    },
    {
      id: '7',
      type: 'invoice_processed',
      title: 'Invoice Processed',
      description: 'INV-2024-0846 processed with minor corrections',
      user: 'David Kim',
      timestamp: '45 minutes ago',
      status: 'warning',
      amount: '$1,875.00'
    },
    {
      id: '8',
      type: 'team_action',
      title: 'Performance Review',
      description: 'Monthly team performance metrics updated',
      user: 'System',
      timestamp: '1 hour ago',
      status: 'info'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invoice_processed':
        return <FileText className="w-4 h-4" />;
      case 'approval_required':
        return <CheckCircle className="w-4 h-4" />;
      case 'issue_detected':
        return <AlertTriangle className="w-4 h-4" />;
      case 'team_action':
        return <User className="w-4 h-4" />;
      case 'upload':
        return <Upload className="w-4 h-4" />;
      case 'reconciliation':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'info':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusDot = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-500">Team actions and system events</p>
          </div>
        </div>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1">
          <Eye className="w-4 h-4" />
          <span>View All</span>
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative">
            {/* Timeline line */}
            {index < activities.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-6 bg-gray-200" />
            )}
            
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
                {/* Status dot */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusDot(activity.status)}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <div className="flex items-center space-x-2">
                    {activity.amount && (
                      <span className="text-sm font-medium text-gray-900">{activity.amount}</span>
                    )}
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                
                {activity.user && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{activity.user}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">24</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">18</div>
            <div className="text-xs text-gray-500">Processed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">3</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">1</div>
            <div className="text-xs text-gray-500">Issues</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityFeed; 