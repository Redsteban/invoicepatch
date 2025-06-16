'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, User, LogOut, Menu, Home, FileText, GitMerge, BarChart3, Settings,
  Upload, Plus, Download, Clock, CheckCircle, AlertTriangle, DollarSign,
  TrendingUp, TrendingDown, Calendar, Filter, Search, ChevronRight, Activity, X
} from 'lucide-react';
import { sampleInvoices, historicalData } from '../data/sampleData';

const InvoiceManagerDashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);

  // Calculate metrics
  const pendingInvoices = sampleInvoices.filter(inv => inv.status === 'pending' || inv.status === 'processing');
  const completedReconciliations = sampleInvoices.filter(inv => inv.status === 'approved').length;
  const outstandingIssues = sampleInvoices.filter(inv => inv.status === 'disputed' || inv.status === 'rejected');
  const currentMonth = historicalData[historicalData.length - 1];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, count: null },
    { id: 'process', label: 'Process Invoices', icon: <FileText size={20} />, count: pendingInvoices.length },
    { id: 'reconciliation', label: 'Reconciliation', icon: <GitMerge size={20} />, count: null },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} />, count: null },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, count: null }
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'Invoice MC-2024-0345 Approved',
      description: 'Foundation work invoice from Martinez Construction approved for $15,750',
      timestamp: '5 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      title: 'Batch Processing Completed',
      description: '12 invoices processed automatically with 100% success rate',
      timestamp: '15 minutes ago',
      status: 'success'
    },
    {
      id: '3',
      title: 'Amount Discrepancy Detected',
      description: 'Invoice CE-2024-0156 has $250 variance requiring review',
      timestamp: '1 hour ago',
      status: 'warning'
    }
  ];

  const StatCard: React.FC<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    onClick?: () => void;
  }> = ({ title, value, change, changeType = 'neutral', icon, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-blue-200' : ''} transition-all duration-200 relative min-h-[180px] flex flex-col justify-between`}
    >
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
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">InvoicePatch Manager</h1>
              <p className="text-sm text-gray-600">Invoice Processing & Reconciliation Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search invoices, contractors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {recentActivities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{activity.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden md:block font-medium text-gray-700">John Manager</span>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">John Manager</p>
                      <p className="text-sm text-gray-600">john.manager@company.com</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? 80 : 280 }}
          className="bg-white border-r border-gray-200 min-h-screen sticky top-16"
        >
          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeNav === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium flex-1">{item.label}</span>
                      {item.count && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </motion.button>
              ))}
            </div>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Pending Invoices"
              value={pendingInvoices.length.toString()}
              change="+12% from last week"
              changeType="positive"
              icon={<Clock size={24} />}
              onClick={() => setActiveNav('process')}
            />
            <StatCard
              title="Completed Reconciliations"
              value={completedReconciliations.toString()}
              change="+8% from last month"
              changeType="positive"
              icon={<CheckCircle size={24} />}
              onClick={() => setActiveNav('reconciliation')}
            />
            <StatCard
              title="Outstanding Issues"
              value={outstandingIssues.length.toString()}
              change="-15% from last week"
              changeType="positive"
              icon={<AlertTriangle size={24} />}
              onClick={() => setActiveNav('process')}
            />
            <StatCard
              title="Monthly Summary"
              value={`$${Math.round(currentMonth.totalAmount / 1000)}K`}
              change="+18.2% vs last month"
              changeType="positive"
              icon={<DollarSign size={24} />}
              onClick={() => setActiveNav('reports')}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border p-10 mb-8">
            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600">Streamline your workflow with these common tasks</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveNav('process')}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus size={20} />
                <span>Process New Batch</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveNav('process')}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Upload size={20} />
                <span>Upload Invoices</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveNav('reports')}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Download size={20} />
                <span>Generate Report</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
                    <p className="text-gray-600">Latest updates and notifications</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
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
                  >
                    <div className="flex items-start space-x-6">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${
                        activity.status === 'success' ? 'bg-green-100 text-green-600' :
                        activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
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
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reconciliation Trends */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900">Reconciliation Trends</h2>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {historicalData.slice(-6).map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${month.accuracyRate}%` }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="bg-blue-600 h-2 rounded-full"
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">{month.accuracyRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoiceManagerDashboard;