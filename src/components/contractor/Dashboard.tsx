'use client';

import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CameraIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const stats = [
    {
      name: 'Monthly Revenue',
      value: '$12,450',
      change: '+12.3%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Pending Invoices',
      value: '3',
      change: '-2 from last week',
      changeType: 'positive',
      icon: DocumentTextIcon,
    },
    {
      name: 'Hours This Week',
      value: '42.5',
      change: '+5.2 from last week',
      changeType: 'positive',
      icon: ClockIcon,
    },
    {
      name: 'Payment Rate',
      value: '94%',
      change: '+2.1% from last month',
      changeType: 'positive',
      icon: CheckCircleIcon,
    },
  ];

  const recentInvoices = [
    {
      id: 'INV-001',
      client: 'Petro-Canada',
      project: 'Well Site 47A',
      amount: '$2,850.00',
      status: 'paid',
      date: '2024-03-15',
    },
    {
      id: 'INV-002',
      client: 'Suncor Energy',
      project: 'Pipeline Maintenance',
      amount: '$4,200.00',
      status: 'pending',
      date: '2024-03-12',
    },
    {
      id: 'INV-003',
      client: 'Husky Energy',
      project: 'Equipment Rental',
      amount: '$1,650.00',
      status: 'overdue',
      date: '2024-03-08',
    },
  ];

  const quickActions = [
    {
      name: 'Create Invoice',
      description: 'Start a new invoice',
      icon: DocumentTextIcon,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      action: 'create-invoice',
    },
    {
      name: 'Professional Invoice',
      description: 'Canadian tax compliant',
      icon: DocumentTextIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: 'invoice-generator',
    },
    {
      name: 'Log Time',
      description: 'Track work hours',
      icon: ClockIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: 'time-tracking',
    },
    {
      name: 'Add Expense',
      description: 'Capture receipt',
      icon: CameraIcon,
      color: 'bg-orange-600 hover:bg-orange-700',
      action: 'expenses',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'invoice-generator') {
      window.open('/invoice-generator', '_blank');
    } else {
      // Other actions would be handled here
      console.log(`Action: ${action}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your contracting business today.
            </p>
          </div>
          <div className="hidden sm:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              New Invoice
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <stat.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${action.color} text-white p-4 rounded-lg transition-colors`}
              onClick={() => handleQuickAction(action.action)}
            >
              <action.icon className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm font-medium">{action.name}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.id}</p>
                    <p className="text-sm text-gray-600">{invoice.client}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{invoice.project}</p>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900">{invoice.amount}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                  <span className="text-xs text-gray-500">{invoice.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">Submit timesheet for Suncor project</p>
              <p className="text-xs text-yellow-700">Due: Today</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Log mileage for yesterday's site visit</p>
              <p className="text-xs text-blue-700">Started: 2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 