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
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-blue-200' : ''} transition-all duration-200 relative min-h-[180px] flex flex-col justify-between`}
    >
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center font-medium shadow-lg">
          {badge > 99 ? '99+' : badge}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-xl ${
          changeType === 'positive' ? 'bg-green-50 text-green-600' :
          changeType === 'negative' ? 'bg-red-50 text-red-600' :
          'bg-blue-50 text-blue-600'
        }`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full ${
            changeType === 'positive' ? 'text-green-700 bg-green-50' : 
            changeType === 'negative' ? 'text-red-700 bg-red-50' : 'text-gray-700 bg-gray-50'
          }`}>
            {changeType === 'positive' ? <TrendingUp size={16} /> : 
             changeType === 'negative' ? <TrendingDown size={16} /> : null}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-sm text-gray-500 leading-relaxed">{description}</p>}
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
      className={`flex items-center justify-center space-x-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
        size === 'sm' ? 'px-5 py-3 text-sm' :
        size === 'lg' ? 'px-10 py-5 text-lg' :
        'px-8 py-4'
      } ${
        variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
        variant === 'secondary' ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300' :
        variant === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
        'bg-orange-600 text-white hover:bg-orange-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );

  return (
    <div className="space-y-12 p-2">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-lg text-gray-600">Monitor invoice processing and reconciliation status</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative lg:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search invoices, contractors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-lg shadow-sm"
          />
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <DashboardCard
          title="Pending Invoices"
          value={pendingInvoices.length.toString()}
          change="+12% from last week"
          changeType="positive"
          icon={<Clock size={28} />}
          onClick={() => window.location.href = '/manager/process'}
          description="Awaiting processing"
          badge={pendingInvoices.length}
        />
        <DashboardCard
          title="Completed Reconciliations"
          value={completedReconciliations.toString()}
          change="+8% from last month"
          changeType="positive"
          icon={<CheckCircle size={28} />}
          onClick={() => window.location.href = '/manager/reconciliation'}
          description="Successfully processed"
        />
        <DashboardCard
          title="Outstanding Issues"
          value={outstandingIssues.length.toString()}
          change="-15% from last week"
          changeType="positive"
          icon={<AlertTriangle size={28} />}
          onClick={() => window.location.href = '/manager/issue-detection'}
          description="Requires attention"
          badge={outstandingIssues.length}
        />
        <DashboardCard
          title="Monthly Summary"
          value={`$${Math.round(currentMonth.totalAmount / 1000)}K`}
          change="+18.2% vs last month"
          changeType="positive"
          icon={<DollarSign size={28} />}
          onClick={() => window.location.href = '/manager/reporting'}
          description="Total processed value"
        />
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Streamline your workflow with these common tasks</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-gray-600">Latest updates and notifications</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
                onClick={() => window.location.href = '/manager/notifications'}
              >
                <span>View all</span>
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 hover:bg-gray-25 cursor-pointer transition-all duration-200 group"
                onClick={() => console.log('View activity details:', activity.id)}
              >
                <div className="flex items-start space-x-6">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-100 text-green-600' :
                    activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    activity.status === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Activity size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                          {activity.title}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-4" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-gray-500">{activity.timestamp}</span>
                      {activity.amount && (
                        <span className="text-lg font-semibold text-gray-900">{activity.amount}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reconciliation Trends Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-gray-900">Reconciliation Trends</h2>
                <p className="text-gray-600">Performance over the last 6 months</p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => window.location.href = '/manager/analytics'}
                >
                  <Filter size={18} className="text-gray-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => window.location.href = '/manager/analytics'}
                >
                  <BarChart3 size={18} className="text-gray-600" />
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              {historicalData.slice(-6).map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-24">{month.month}</span>
                  <div className="flex-1 mx-6">
                    <div className="bg-gray-100 rounded-full h-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${month.accuracyRate}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full shadow-sm"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                    {month.accuracyRate}%
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900 uppercase tracking-wide">Current Accuracy Rate</p>
                  <p className="text-3xl font-bold text-blue-700">95.6%</p>
                  <p className="text-sm text-blue-600">+2.4% from last month</p>
                </div>
                <div className="text-blue-600">
                  <TrendingUp size={36} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Quick Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Quick Navigation</h2>
          <p className="text-gray-600">Access key areas of the invoice management system</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = '/manager/process'}
            className="flex flex-col items-center p-8 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 space-y-4"
          >
            <FileText className="text-blue-600" size={32} />
            <span className="text-sm font-medium text-gray-700">Process Invoices</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = '/manager/reconciliation'}
            className="flex flex-col items-center p-8 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 space-y-4"
          >
            <GitMerge className="text-green-600" size={32} />
            <span className="text-sm font-medium text-gray-700">Reconciliation</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = '/manager/reporting'}
            className="flex flex-col items-center p-8 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 space-y-4"
          >
            <BarChart3 className="text-purple-600" size={32} />
            <span className="text-sm font-medium text-gray-700">Reports</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = '/manager/analytics'}
            className="flex flex-col items-center p-8 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 space-y-4"
          >
            <Activity className="text-orange-600" size={32} />
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedManagerDashboard;