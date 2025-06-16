'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, User, Upload, Plus, Download, Clock, CheckCircle, AlertTriangle, 
  DollarSign, TrendingUp, TrendingDown, ChevronRight, Activity, Eye, Edit,
  FileText, GitMerge, BarChart3, Filter, Search
} from 'lucide-react';
import { sampleInvoices, historicalData } from '../data/sampleData';

const EnhancedManagerDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Calculate metrics from sample data
  const pendingInvoices = sampleInvoices.filter(inv => inv.status === 'pending' || inv.status === 'processing');
  const completedReconciliations = sampleInvoices.filter(inv => inv.status === 'approved').length;
  const outstandingIssues = sampleInvoices.filter(inv => inv.status === 'disputed' || inv.status === 'rejected');
  const currentMonth = historicalData[historicalData.length - 1];

  const recentActivities = [
    {
      id: '1',
      title: 'Invoice MC-2024-0345 Approved',
      description: 'Foundation work invoice from Martinez Construction LLC',
      timestamp: '5 minutes ago',
      status: 'success',
      amount: '$15,750'
    },
    {
      id: '2',
      title: 'Batch Processing Completed',
      description: '12 invoices processed automatically',
      timestamp: '15 minutes ago',
      status: 'success',
      amount: '$89,450'
    },
    {
      id: '3',
      title: 'Amount Discrepancy Detected',
      description: 'Invoice CE-2024-0156 has $250 variance',
      timestamp: '1 hour ago',
      status: 'warning',
      amount: '$8,750'
    }
  ];

  const DashboardCard: React.FC<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    onClick?: () => void;
    description?: string;
    badge?: number;
  }> = ({ title, value, change, changeType = 'neutral', icon, onClick, description, badge }) => (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-200' : ''} transition-all duration-200 relative min-h-[160px] flex flex-col justify-between`}
    >
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-md">
          {badge > 99 ? '99+' : badge}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${
          changeType === 'positive' ? 'bg-green-50 text-green-600' :
          changeType === 'negative' ? 'bg-red-50 text-red-600' :
          'bg-blue-50 text-blue-600'
        }`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
            changeType === 'positive' ? 'text-green-700 bg-green-50' : 
            changeType === 'negative' ? 'text-red-700 bg-red-50' : 'text-gray-700 bg-gray-50'
          }`}>
            {changeType === 'positive' ? <TrendingUp size={12} /> : 
             changeType === 'negative' ? <TrendingDown size={12} /> : null}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor invoice processing and reconciliation status</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Pending Invoices"
          value={pendingInvoices.length.toString()}
          change="+12%"
          changeType="positive"
          icon={<Clock size={24} />}
          onClick={() => router.push('/manager/process')}
          description="Awaiting processing"
          badge={pendingInvoices.length}
        />
        <DashboardCard
          title="Completed"
          value={completedReconciliations.toString()}
          change="+8%"
          changeType="positive"
          icon={<CheckCircle size={24} />}
          onClick={() => router.push('/manager/reconciliation')}
          description="Successfully processed"
        />
        <DashboardCard
          title="Issues"
          value={outstandingIssues.length.toString()}
          change="-15%"
          changeType="negative"
          icon={<AlertTriangle size={24} />}
          onClick={() => router.push('/manager/issue-detection')}
          description="Requires attention"
          badge={outstandingIssues.length}
        />
        <DashboardCard
          title="Monthly Total"
          value={`$${Math.round(currentMonth.totalAmount / 1000)}K`}
          change="+18%"
          changeType="positive"
          icon={<DollarSign size={24} />}
          onClick={() => router.push('/manager/reporting')}
          description="Total processed value"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/manager/process')}
            className="flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
          >
            <Plus size={20} />
            <span>Process Batch</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/manager/manual-upload')}
            className="flex items-center justify-center space-x-3 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
          >
            <Upload size={20} />
            <span>Upload Files</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/manager/reporting')}
            className="flex items-center justify-center space-x-3 px-6 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-200"
          >
            <Download size={20} />
            <span>Export Report</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center space-x-1"
                onClick={() => router.push('/manager/notifications')}
              >
                <span>View all</span>
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 hover:bg-gray-25 cursor-pointer transition-all duration-200 group"
                onClick={() => console.log('View activity details:', activity.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-100 text-green-600' :
                    activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Activity size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        {activity.amount && (
                          <p className="font-semibold text-gray-900">{activity.amount}</p>
                        )}
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
          </div>
          
          <div className="p-8 space-y-6">
            {/* Accuracy Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Accuracy Rate</span>
                <span className="text-lg font-bold text-green-600">95.6%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '95.6%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-green-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Processing Speed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Processing Speed</span>
                <span className="text-lg font-bold text-blue-600">1.9 days</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="bg-blue-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Cost Savings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Cost Reduction</span>
                <span className="text-lg font-bold text-purple-600">73%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '73%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-purple-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-blue-900">Monthly Improvement</p>
                <p className="text-2xl font-bold text-blue-700">+2.4%</p>
                <p className="text-xs text-blue-600">Performance increase vs last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedManagerDashboard;