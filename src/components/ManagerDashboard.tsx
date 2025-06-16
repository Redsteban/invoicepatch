'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  LogOut, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  Settings,
  Upload,
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Filter,
  Search,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { generateContractorInvoices, calculateStats } from '@/lib/mockData'

// Enhanced mock data generator
const generateDashboardData = () => {
  const today = new Date()
  const nextCutoff = new Date(today)
  nextCutoff.setDate(today.getDate() + ((4 - today.getDay() + 7) % 7)) // Next Thursday
  
  const currentPeriodStart = new Date(nextCutoff)
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 13)
  
  // Generate realistic invoice data
  const allInvoices = generateContractorInvoices(45)
  
  // Mark some as processed for demo
  const processedInvoices = allInvoices.slice(0, 28).map(inv => ({ ...inv, processed: true }))
  const pendingInvoices = allInvoices.slice(28)
  
  const invoices = [...processedInvoices, ...pendingInvoices]
  const stats = calculateStats(invoices)
  
  return {
    nextCutoff: nextCutoff.toISOString(),
    currentPeriod: {
      start: currentPeriodStart.toISOString(),
      end: nextCutoff.toISOString()
    },
    invoices,
    stats: {
      pending: stats.pending,
      pendingAmount: stats.pendingAmount,
      reconciled: stats.reconciled,
      reconciledAmount: stats.reconciledAmount,
      issues: stats.flagged,
      avgProcessingTime: '2.3 minutes',
      totalSaved: '$8,400',
      efficiency: '94.7%'
    },
    recentActivity: allInvoices.slice(0, 8).map(inv => ({
      id: inv.id,
      contractor: inv.contractor,
      amount: inv.amount,
      status: inv.processed ? 'completed' : (inv.status === 'flagged' ? 'flagged' : 'pending'),
      confidence: inv.confidence,
      issue: inv.issues,
      timestamp: inv.submittedDate
    })),
    chartData: [
      { month: 'Jan', reconciled: 145, pending: 23 },
      { month: 'Feb', reconciled: 189, pending: 18 },
      { month: 'Mar', reconciled: 201, pending: 15 },
      { month: 'Apr', reconciled: 234, pending: 12 },
      { month: 'May', reconciled: 267, pending: 8 },
      { month: 'Jun', reconciled: 298, pending: 17 }
    ]
  }
}

// Interactive Card Component
const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  badge,
  onClick,
  trend
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  badge?: number
  onClick?: () => void
  trend?: { value: string, direction: 'up' | 'down' }
}) => {
  const colorClasses = {
    blue: 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700',
    green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
    red: 'bg-red-50 border-red-200 hover:bg-red-100 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 text-yellow-700',
    purple: 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
  }

  return (
    <div 
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer
        transform hover:scale-105 hover:shadow-lg
        ${colorClasses[color]}
        ${onClick ? 'hover:shadow-xl' : ''}
      `}
      onClick={onClick}
    >
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {badge}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-8 h-8" />
        {trend && (
          <div className={`flex items-center text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend.direction === 'down' ? 'rotate-180' : ''}`} />
            {trend.value}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm opacity-70">{subtitle}</p>
        )}
      </div>
      
      {onClick && (
        <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 opacity-50" />
      )}
    </div>
  )
}

// Quick Action Button Component
const QuickActionButton = ({ 
  title, 
  icon: Icon, 
  onClick, 
  variant = 'primary' 
}: {
  title: string
  icon: any
  onClick: () => void
  variant?: 'primary' | 'secondary'
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center px-6 py-4 rounded-xl font-medium
        transition-all duration-200 transform hover:scale-105 hover:shadow-lg
        ${variant === 'primary' 
          ? 'bg-black text-white hover:bg-gray-800' 
          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      {title}
    </button>
  )
}

// Simple Chart Component
const SimpleChart = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(...data.map(d => d.reconciled + d.pending))
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.month} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.month}</span>
            <span className="text-gray-600">{item.reconciled + item.pending}</span>
          </div>
          <div className="flex h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 transition-all duration-500"
              style={{ width: `${(item.reconciled / maxValue) * 100}%` }}
            />
            <div 
              className="bg-gray-400 transition-all duration-500"
              style={{ width: `${(item.pending / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Activity Feed Component
const ActivityFeed = ({ activities }: { activities: any[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'flagged': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{activity.contractor}</p>
            <p className="text-sm text-gray-600">${activity.amount.toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
              {activity.status}
            </span>
            <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ManagerDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const data = useMemo(() => generateDashboardData(), [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const daysUntilCutoff = Math.ceil(
    (new Date(data.nextCutoff).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, active: true },
    { id: 'process', label: 'Process Invoices', icon: FileText, badge: data.stats.pending },
    { id: 'reconciliation', label: 'Reconciliation', icon: CheckCircle },
    { id: 'reports', label: 'Reports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleNavigation = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false)
    
    // Add navigation logic here
    switch (tab) {
      case 'process':
        router.push('/manager/process')
        break
      case 'reconciliation':
        router.push('/manager/reconciliation')
        break
      case 'reports':
        router.push('/manager/reports')
        break
      case 'settings':
        router.push('/manager/settings')
        break
    }
  }

  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      case 'pending':
        router.push('/manager/process')
        break
      case 'completed':
        router.push('/manager/reconciliation')
        break
      case 'issues':
        router.push('/manager/issues')
        break
      case 'summary':
        router.push('/manager/reports')
        break
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'process':
        router.push('/manager/process')
        break
      case 'upload':
        router.push('/manager/upload')
        break
      case 'report':
        router.push('/manager/reports')
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">InvoicePatch</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`
                w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-black text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">JD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-600">Manager</p>
                </div>
              </div>
              
              {/* Logout */}
              <button 
                onClick={() => router.push('/manager/login')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Quick Stats Bar */}
          <div className="mb-8 p-6 bg-gray-900 rounded-xl text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-300 text-sm">Next Deadline</p>
                <p className="text-2xl font-bold">{formatDate(data.nextCutoff)}</p>
                <p className="text-gray-400 text-sm">{daysUntilCutoff} days remaining</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Total Saved</p>
                <p className="text-2xl font-bold">{data.stats.totalSaved}</p>
                <p className="text-gray-400 text-sm">This month</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Efficiency Rate</p>
                <p className="text-2xl font-bold">{data.stats.efficiency}</p>
                <p className="text-gray-400 text-sm">Auto-reconciliation</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Avg Processing</p>
                <p className="text-2xl font-bold">{data.stats.avgProcessingTime}</p>
                <p className="text-gray-400 text-sm">Per invoice batch</p>
              </div>
            </div>
          </div>

          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Pending Invoices"
              value={data.stats.pending}
              subtitle={`$${data.stats.pendingAmount.toLocaleString()}`}
              icon={FileText}
              color="yellow"
              badge={data.stats.pending}
              onClick={() => handleCardClick('pending')}
              trend={{ value: '+12%', direction: 'up' }}
            />
            
            <DashboardCard
              title="Completed"
              value={data.stats.reconciled}
              subtitle={`$${data.stats.reconciledAmount.toLocaleString()}`}
              icon={CheckCircle}
              color="green"
              onClick={() => handleCardClick('completed')}
              trend={{ value: '+8%', direction: 'up' }}
            />
            
            <DashboardCard
              title="Outstanding Issues"
              value={data.stats.issues}
              subtitle="Need attention"
              icon={AlertCircle}
              color="red"
              badge={data.stats.issues}
              onClick={() => handleCardClick('issues')}
              trend={{ value: '-5%', direction: 'down' }}
            />
            
            <DashboardCard
              title="Monthly Summary"
              value={data.stats.reconciled + data.stats.pending}
              subtitle="Total invoices"
              icon={BarChart3}
              color="purple"
              onClick={() => handleCardClick('summary')}
              trend={{ value: '+15%', direction: 'up' }}
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionButton
                title="Process New Batch"
                icon={FileText}
                onClick={() => handleQuickAction('process')}
                variant="primary"
              />
              <QuickActionButton
                title="Upload Invoices"
                icon={Upload}
                onClick={() => handleQuickAction('upload')}
                variant="secondary"
              />
              <QuickActionButton
                title="Generate Report"
                icon={Download}
                onClick={() => handleQuickAction('report')}
                variant="secondary"
              />
            </div>
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reconciliation Trends */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Reconciliation Trends</h3>
                <Filter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              <SimpleChart data={data.chartData} />
                             <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                 <div className="flex items-center">
                   <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                   <span className="text-gray-600">Reconciled</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                   <span className="text-gray-600">Pending</span>
                 </div>
               </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                                 <button className="text-gray-600 hover:text-black text-sm font-medium">
                   View All
                 </button>
              </div>
              <ActivityFeed activities={data.recentActivity} />
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
} 