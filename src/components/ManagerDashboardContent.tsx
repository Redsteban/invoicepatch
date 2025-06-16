'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  Upload,
  Download,
  TrendingUp,
  DollarSign,
  Filter,
  ChevronRight
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
  
  // Generate chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - 6 + i)
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      reconciled: Math.floor(Math.random() * 15) + 5,
      pending: Math.floor(Math.random() * 8) + 2
    }
  })
  
  // Recent activity
  const recentActivity = [
    {
      id: '1',
      action: 'Auto-reconciled batch',
      description: '15 invoices from Northern Pipeline Services',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: '2', 
      action: 'Manual review required',
      description: 'Invoice #INV-2024-0847 from Calgary Heavy Haul',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    },
    {
      id: '3',
      action: 'Processing complete',
      description: 'Batch #B240302 - 22 invoices processed',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    }
  ]
  
  return {
    stats: {
      pending: stats.pending,
      reconciled: stats.reconciled,
      issues: stats.flagged,
      totalSaved: '$42,500',
      efficiency: '94.7%',
      avgProcessingTime: '2.4 min',
      pendingAmount: stats.pendingValue,
      reconciledAmount: stats.reconciledValue
    },
    chartData,
    recentActivity,
    nextCutoff: nextCutoff.toISOString()
  }
}

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
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50'
  }

  return (
    <motion.div
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 ${
        onClick ? 'hover:scale-105' : ''
      }`}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {badge && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className={`flex items-center text-sm ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${
                trend.direction === 'down' ? 'rotate-180' : ''
              }`} />
              {trend.value}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

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
    <motion.button
      onClick={onClick}
      className={`
        w-full flex items-center justify-center px-6 py-4 rounded-xl font-medium transition-all duration-200
        ${variant === 'primary' 
          ? 'bg-black text-white hover:bg-gray-800' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{title}</span>
      <ChevronRight className="w-4 h-4 ml-auto" />
    </motion.button>
  )
}

const SimpleChart = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.reconciled, d.pending)))
  
  return (
    <div className="space-y-4">
      <div className="flex items-end space-x-2 h-40">
        {data.map((day, index) => (
          <div key={day.date} className="flex flex-col items-center flex-1">
            <div className="w-full flex flex-col justify-end h-32 space-y-1">
              <motion.div
                className="bg-green-500 rounded-t"
                style={{ height: `${(day.reconciled / maxValue) * 100}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${(day.reconciled / maxValue) * 100}%` }}
                transition={{ delay: index * 0.1 }}
              />
              <motion.div
                className="bg-gray-400 rounded-t"
                style={{ height: `${(day.pending / maxValue) * 100}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${(day.pending / maxValue) * 100}%` }}
                transition={{ delay: index * 0.1 + 0.05 }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-2">{day.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ActivityFeed = ({ activities }: { activities: any[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours}h ago`
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-900">{activity.action}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function ManagerDashboardContent() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Content</h1>
      <p>This is the manager dashboard content.</p>
    </div>
  )
} 