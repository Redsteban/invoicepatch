'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ManagerSidebar from '@/components/manager/ManagerSidebar';
import TeamOverviewWidget from '@/components/manager/TeamOverviewWidget';
import PerformanceMetricsCards from '@/components/manager/PerformanceMetricsCards';
import QuickAccessTools from '@/components/manager/QuickAccessTools';
import RecentActivityFeed from '@/components/manager/RecentActivityFeed';
import { Play, ExternalLink, TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="manager">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <ManagerSidebar />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0 ml-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
                  <p className="text-gray-600 mt-1">
                    Welcome back! Here's what's happening with your team today.
                  </p>
                </div>
                
                {/* Header Actions */}
                <div className="flex items-center space-x-4">
                  <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Users className="w-4 h-4 mr-2" />
                    Team Meeting
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h2>
              <PerformanceMetricsCards />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              {/* Team Overview - Takes 2 columns */}
              <div className="xl:col-span-2">
                <TeamOverviewWidget />
              </div>
              
              {/* Recent Activity - Takes 1 column */}
              <div className="xl:col-span-1">
                <RecentActivityFeed />
              </div>
            </div>

            {/* Quick Access Tools */}
            <div className="mb-8">
              <QuickAccessTools />
            </div>

            {/* Demos Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manager Demos</h3>
                    <p className="text-sm text-gray-500">Explore system capabilities and features</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/manager-demo"
                  className="group p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Manager Experience</h4>
                  <p className="text-sm text-gray-500">Complete manager workflow demonstration</p>
                </Link>

                <Link
                  href="/invoice-demo"
                  className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Invoice Processing</h4>
                  <p className="text-sm text-gray-500">See automated invoice processing in action</p>
                </Link>

                <Link
                  href="/payroll-demo"
                  className="group p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Payroll Integration</h4>
                  <p className="text-sm text-gray-500">Explore payroll calculation features</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 