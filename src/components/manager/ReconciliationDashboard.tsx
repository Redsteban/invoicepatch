'use client';

import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'match' | 'approval' | 'discrepancy' | 'export';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'flagged';
}

const ReconciliationDashboard = () => {
  const metrics: MetricCard[] = [
    {
      title: 'Invoices Processed',
      value: '156',
      change: '+23% from last month',
      changeType: 'positive',
      icon: DocumentTextIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Auto-Match Rate',
      value: '87%',
      change: '+12% improvement',
      changeType: 'positive',
      icon: CheckCircleIcon,
      color: 'text-green-600'
    },
    {
      title: 'Time Saved',
      value: '47.5 hrs',
      change: 'This month',
      changeType: 'positive',
      icon: ClockIcon,
      color: 'text-purple-600'
    },
    {
      title: 'Cost Savings',
      value: '$11,875',
      change: 'Labor cost reduction',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'text-emerald-600'
    }
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'match',
      title: 'Perfect Match Found',
      description: 'Suncor Montney Project - Invoice INV-2024-156789 matched 100%',
      timestamp: '2 minutes ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'approval',
      title: 'Batch Approved',
      description: '8 invoices approved for TC Energy Pipeline Project',
      timestamp: '15 minutes ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'discrepancy',
      title: 'Rate Discrepancy',
      description: 'Husky Well Maintenance - Rate variance of $50/day requires review',
      timestamp: '1 hour ago',
      status: 'flagged'
    },
    {
      id: '4',
      type: 'export',
      title: 'Data Exported',
      description: 'Weekly reconciliation report exported to SAP',
      timestamp: '2 hours ago',
      status: 'completed'
    }
  ];

  const processingQueue = {
    pending: 12,
    matched: 45,
    flagged: 3,
    approved: 28
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'approval':
        return <CheckCircleIcon className="h-5 w-5 text-blue-600" />;
      case 'discrepancy':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'export':
        return <DocumentTextIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{metric.change}</span>
                </div>
              </div>
              <metric.icon className={`h-12 w-12 ${metric.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Processing Queue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Queue</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="font-medium text-gray-900">Pending Review</span>
              </div>
              <span className="text-xl font-bold text-yellow-600">{processingQueue.pending}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Auto-Matched</span>
              </div>
              <span className="text-xl font-bold text-green-600">{processingQueue.matched}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                <span className="font-medium text-gray-900">Flagged Items</span>
              </div>
              <span className="text-xl font-bold text-red-600">{processingQueue.flagged}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Approved</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{processingQueue.approved}</span>
            </div>
          </div>
        </motion.div>

        {/* Time Savings Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Savings Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Manual data entry</span>
              <span className="font-semibold text-gray-900">-32 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cross-referencing</span>
              <span className="font-semibold text-gray-900">-18 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Error correction</span>
              <span className="font-semibold text-gray-900">-12 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Report generation</span>
              <span className="font-semibold text-gray-900">-8 hours</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Time Saved</span>
              <span className="text-xl font-bold text-green-600">70 hours/month</span>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-700">
                <strong>ROI:</strong> $17,500 monthly savings at $250/hour manager rate
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                {getActivityIcon(activity.type)}
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Demo Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">See the InvoicePatch Difference</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-red-600">Before InvoicePatch:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• 70+ hours manual processing</li>
                  <li>• 15% error rate</li>
                  <li>• 2-week approval cycles</li>
                  <li>• Excel spreadsheet chaos</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-green-600">With InvoicePatch:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• 5 minutes auto-processing</li>
                  <li>• 2% error rate</li>
                  <li>• Same-day approvals</li>
                  <li>• Automated workflows</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-blue-600">Monthly Savings:</div>
                <ul className="text-gray-600 mt-1">
                  <li>• $17,500 in labor costs</li>
                  <li>• 87% faster processing</li>
                  <li>• 95% accuracy improvement</li>
                  <li>• Zero missed deadlines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReconciliationDashboard; 