'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, User, Upload, Plus, Download, Clock, CheckCircle, AlertTriangle, 
  DollarSign, TrendingUp, TrendingDown, ChevronRight, Activity, Eye, Edit,
  FileText, GitMerge, BarChart3, Filter, Search
} from 'lucide-react';
import { sampleInvoices, historicalData } from '../data/sampleData';

const EnhancedManagerDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate metrics from sample data
  const pendingInvoices = sampleInvoices.filter(inv => inv.status === 'pending' || inv.status === 'processing');
  const completedReconciliations = sampleInvoices.filter(inv => inv.status === 'approved').length;
  const outstandingIssues = sampleInvoices.filter(inv => inv.status === 'disputed' || inv.status === 'rejected');
  const currentMonth = historicalData[historicalData.length - 1];

  const recentActivities = [
    {
      id: '1',
      title: 'Invoice MC-2024-0345 Approved',
      description: 'Foundation work invoice from Martinez Construction LLC approved for payment',
      timestamp: '5 minutes ago',
      status: 'success',
      amount: '$15,750'
    },
    {
      id: '2',
      title: 'Batch Processing Completed',
      description: '12 invoices processed automatically with 100% success rate',
      timestamp: '15 minutes ago',
      status: 'success',
      amount: '$89,450'
    },
    {
      id: '3',
      title: 'Amount Discrepancy Detected',
      description: 'Invoice CE-2024-0156 has $250 variance requiring manual review',
      timestamp: '1 hour ago',
      status: 'warning',
      amount: '$8,750'
    },
    {
      id: '4',
      title: 'Duplicate Invoice Rejected',
      description: 'Invoice TP-2024-0234 flagged as duplicate and automatically rejected',
      timestamp: '2 hours ago',
      status: 'error',
      amount: '$4,850'
    },
    {
      id: '5',
      title: 'Monthly Report Generated',
      description: 'January 2024 reconciliation summary ready for download',
      timestamp: '3 hours ago',
      status: 'info',
      amount: null
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
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border p-6 ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-blue-200' : ''} transition-all duration-200 relative`}
    >
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
          {badge > 99 ? '99+' : badge}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${
          changeType === 'positive' ? 'bg-green-50 text-green-600' :
          changeType === 'negative' ? 'bg-red-50 text-red-600' :
          'bg-blue-50 text-blue-600'
        }`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {changeType === 'positive' ? <TrendingUp size={16} /> : 
             changeType === 'negative' ? <TrendingDown size={16} /> : null}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </motion.div>
  );

  const QuickActionButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
  }> = ({ label, icon, onClick, variant = 'primary', size = 'md' }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center space-x-2 rounded-lg font-medium transition-all duration-200 ${
        size === 'sm' ? 'px-4 py-2 text-sm' :
        size === 'lg' ? 'px-8 py-4 text-lg' :
        'px-6 py-3'
      } ${
        variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' :
        variant === 'secondary' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' :
        variant === 'success' ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg' :
        'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Monitor invoice processing and reconciliation status</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search invoices, contractors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
          />
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Pending Invoices"
          value={pendingInvoices.length.toString()}
          change="+12% from last week"
          changeType="positive"
          icon={<Clock size={24} />}
          onClick={() => window.location.href = '/manager/process'}
          description="Awaiting processing"
          badge={pendingInvoices.length}
        />
        <DashboardCard
          title="Completed Reconciliations"
          value={completedReconciliations.toString()}
          change="+8% from last month"
          changeType="positive"
          icon={<CheckCircle size={24} />}
          onClick={() => window.location.href = '/manager/reconciliation'}
          description="Successfully processed"
        />
        <DashboardCard
          title="Outstanding Issues"
          value={outstandingIssues.length.toString()}
          change="-15% from last week"
          changeType="positive"
          icon={<AlertTriangle size={24} />}
          onClick={() => window.location.href = '/manager/issue-detection'}
          description="Requires attention"
          badge={outstandingIssues.length}
        />
        <DashboardCard
          title="Monthly Summary"
          value={`$${Math.round(currentMonth.totalAmount / 1000)}K`}
          change="+18.2% vs last month"
          changeType="positive"
          icon={<DollarSign size={24} />}
          onClick={() => window.location.href = '/manager/reporting'}
          description="Total processed value"
        />
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <span className="text-sm text-gray-500">Streamline your workflow</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionButton
            label="Process New Batch"
            icon={<Plus size={20} />}
            onClick={() => window.location.href = '/manager/process'}
            variant="primary"
          />
          <QuickActionButton
            label="Upload Invoices"
            icon={<Upload size={20} />}
            onClick={() => window.location.href = '/manager/manual-upload'}
            variant="secondary"
          />
          <QuickActionButton
            label="Generate Report"
            icon={<Download size={20} />}
            onClick={() => window.location.href = '/manager/reporting'}
            variant="success"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center space-x-1"
                onClick={() => window.location.href = '/manager/notifications'}
              >
                <span>View all</span>
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                onClick={() => console.log('View activity details:', activity.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-100 text-green-600' :
                    activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    activity.status === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Activity size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          {activity.amount && (
                            <span className="text-sm font-medium text-gray-900">{activity.amount}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reconciliation Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Reconciliation Trends</h2>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => window.location.href = '/manager/analytics'}
                >
                  <Filter size={16} className="text-gray-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => window.location.href = '/manager/analytics'}
                >
                  <BarChart3 size={16} className="text-gray-600" />
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {historicalData.slice(-6).map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-20">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${month.accuracyRate}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                    {month.accuracyRate}%
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Current Accuracy Rate</p>
                  <p className="text-2xl font-bold text-blue-700">95.6%</p>
                  <p className="text-xs text-blue-600 mt-1">+2.4% from last month</p>
                </div>
                <div className="text-blue-600">
                  <TrendingUp size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Quick Navigation */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = '/manager/process'}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <FileText className="text-blue-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Process Invoices</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = '/manager/reconciliation'}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
          >
            <GitMerge className="text-green-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Reconciliation</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = '/manager/reporting'}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <BarChart3 className="text-purple-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Reports</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = '/manager/analytics'}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <Activity className="text-orange-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedManagerDashboard;