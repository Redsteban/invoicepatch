'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  Zap,
  Eye,
  Settings,
  ArrowRight,
  Lightbulb,
  Star,
  Award,
  TrendingUp as PredictiveIcon
} from 'lucide-react'

interface KPI {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  target?: number
  unit?: string
  icon: any
  color: string
  trend: number[]
  benchmark?: number
  description: string
}

interface ChartData {
  id: string
  title: string
  type: 'line' | 'bar' | 'pie' | 'area'
  data: any
  insights: string[]
  drillDownAvailable: boolean
}

interface FilterConfig {
  dateRange: { start: string; end: string }
  contractors: string[]
  jobTypes: string[]
  status: string[]
  comparisonPeriod: 'none' | 'previous' | 'lastYear'
}

interface Insight {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  recommendation?: string
}

interface PredictiveAnalysis {
  metric: string
  currentValue: number
  predictedValue: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  timeframe: string
  factors: string[]
}

const AnalyticsDashboard: React.FC = () => {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterConfig>({
    dateRange: { start: '2024-01-01', end: '2024-12-31' },
    contractors: [],
    jobTypes: [],
    status: [],
    comparisonPeriod: 'previous'
  })
  const [drillDownView, setDrillDownView] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30)

  // Mock data - in real implementation, this would come from APIs
  const kpis: KPI[] = [
    {
      id: 'processing-time',
      title: 'Avg Processing Time',
      value: '2.3',
      unit: 'days',
      change: -18.5,
      changeType: 'decrease',
      target: 2.0,
      icon: Clock,
      color: 'bg-blue-500',
      trend: [3.2, 2.8, 2.5, 2.4, 2.3],
      benchmark: 2.8,
      description: 'Average time from invoice submission to approval'
    },
    {
      id: 'accuracy-rate',
      title: 'Accuracy Rate',
      value: '94.7',
      unit: '%',
      change: 5.2,
      changeType: 'increase',
      target: 95.0,
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: [89.2, 91.5, 93.1, 94.0, 94.7],
      benchmark: 92.5,
      description: 'Percentage of invoices processed without errors'
    },
    {
      id: 'cost-savings',
      title: 'Cost Savings',
      value: '$127,450',
      change: 23.7,
      changeType: 'increase',
      target: 150000,
      icon: DollarSign,
      color: 'bg-emerald-500',
      trend: [95000, 108000, 115000, 122000, 127450],
      benchmark: 110000,
      description: 'Total cost savings from automated processing'
    },
    {
      id: 'compliance-score',
      title: 'Compliance Score',
      value: '87.3',
      unit: '%',
      change: 2.1,
      changeType: 'increase',
      target: 90.0,
      icon: Award,
      color: 'bg-purple-500',
      trend: [82.5, 84.1, 85.8, 86.9, 87.3],
      benchmark: 85.0,
      description: 'Overall contractor compliance with submission requirements'
    }
  ]

  const chartData: ChartData[] = [
    {
      id: 'volume-trends',
      title: 'Invoice Volume Trends',
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Invoices Processed',
          data: [245, 289, 312, 287, 334, 356],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      },
      insights: [
        '18% increase in volume over last quarter',
        'Peak processing occurs mid-month',
        'Summer months show 12% higher activity'
      ],
      drillDownAvailable: true
    },
    {
      id: 'contractor-performance',
      title: 'Contractor Performance Distribution',
      type: 'bar',
      data: {
        labels: ['ABC Corp', 'XYZ Ltd', 'Elite Co', 'Metro Inc', 'Prime LLC'],
        datasets: [{
          label: 'Performance Score',
          data: [92, 87, 94, 81, 89],
          backgroundColor: ['#10B981', '#F59E0B', '#10B981', '#EF4444', '#6B7280']
        }]
      },
      insights: [
        'Elite Co consistently top performer (94% avg)',
        'Metro Inc needs improvement (81% avg)',
        '15% variance between best and worst performers'
      ],
      drillDownAvailable: true
    },
    {
      id: 'processing-efficiency',
      title: 'Processing Efficiency Over Time',
      type: 'area',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Efficiency %',
          data: [78, 82, 85, 88],
          fill: true,
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: '#22C55E'
        }]
      },
      insights: [
        'Steady 13% improvement in efficiency',
        'Machine learning optimization showing results',
        'Target 90% efficiency achievable next quarter'
      ],
      drillDownAvailable: false
    }
  ]

  const insights: Insight[] = [
    {
      id: 'peak-processing',
      type: 'info',
      title: 'Peak Processing Times Identified',
      description: 'Analysis shows 60% of invoices arrive between 2-4 PM daily',
      impact: 'medium',
      actionable: true,
      recommendation: 'Consider load balancing or additional processing capacity during peak hours'
    },
    {
      id: 'contractor-variance',
      type: 'warning',
      title: 'High Performance Variance',
      description: 'Performance gap of 15% between top and bottom contractors',
      impact: 'high',
      actionable: true,
      recommendation: 'Implement contractor training program for underperformers'
    },
    {
      id: 'cost-optimization',
      type: 'success',
      title: 'Cost Optimization Opportunity',
      description: 'Automated processing showing 23% cost reduction',
      impact: 'high',
      actionable: true,
      recommendation: 'Expand automation to additional invoice types'
    },
    {
      id: 'compliance-trend',
      type: 'info',
      title: 'Improving Compliance Trend',
      description: 'Compliance scores trending upward across all contractor categories',
      impact: 'medium',
      actionable: false
    }
  ]

  const predictiveAnalytics: PredictiveAnalysis[] = [
    {
      metric: 'Monthly Invoice Volume',
      currentValue: 356,
      predictedValue: 412,
      confidence: 87,
      trend: 'up',
      timeframe: 'Next month',
      factors: ['Seasonal trends', 'New contractor onboarding', 'Project pipeline']
    },
    {
      metric: 'Processing Time',
      currentValue: 2.3,
      predictedValue: 1.8,
      confidence: 92,
      trend: 'down',
      timeframe: 'Next quarter',
      factors: ['ML optimization', 'Process improvements', 'Staff training']
    },
    {
      metric: 'Cost Savings',
      currentValue: 127450,
      predictedValue: 156000,
      confidence: 78,
      trend: 'up',
      timeframe: 'Next quarter',
      factors: ['Automation expansion', 'Error reduction', 'Efficiency gains']
    }
  ]

  const generateMockTrendData = (baseValue: number, points: number = 12) => {
    const data = []
    let current = baseValue
    for (let i = 0; i < points; i++) {
      current += (Math.random() - 0.5) * baseValue * 0.1
      data.push(Math.round(current * 100) / 100)
    }
    return data
  }

  const filteredData = useMemo(() => {
    // In real implementation, this would filter actual data based on filters
    return {
      kpis: kpis.map(kpi => ({
        ...kpi,
        trend: generateMockTrendData(typeof kpi.value === 'string' ? parseFloat(kpi.value) : kpi.value)
      })),
      charts: chartData,
      insights: insights.filter(insight => {
        if (filters.contractors.length > 0 && insight.id === 'contractor-variance') return true
        return true
      })
    }
  }, [filters])

  const handleDrillDown = (chartId: string) => {
    setDrillDownView(chartId)
  }

  const handleKPIClick = (kpiId: string) => {
    setSelectedKPI(selectedKPI === kpiId ? null : kpiId)
  }

  const updateFilters = (newFilters: Partial<FilterConfig>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const exportDashboard = (format: 'pdf' | 'excel' | 'png') => {
    console.log(`Exporting dashboard as ${format}`)
    // Implementation for export functionality
  }

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Refresh data
        console.log('Auto-refreshing dashboard data')
      }, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights and performance analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>Auto Refresh</span>
          </button>
          <button
            onClick={() => exportDashboard('pdf')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => updateFilters({
                      dateRange: { ...filters.dateRange, start: e.target.value }
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => updateFilters({
                      dateRange: { ...filters.dateRange, end: e.target.value }
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contractors</label>
                <select 
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value)
                    updateFilters({ contractors: selected })
                  }}
                >
                  <option value="abc-corp">ABC Corporation</option>
                  <option value="xyz-ltd">XYZ Limited</option>
                  <option value="elite-co">Elite Company</option>
                  <option value="metro-inc">Metro Inc</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Types</label>
                <select 
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value)
                    updateFilters({ jobTypes: selected })
                  }}
                >
                  <option value="construction">Construction</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="hvac">HVAC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comparison</label>
                <select 
                  value={filters.comparisonPeriod}
                  onChange={(e) => updateFilters({ comparisonPeriod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="none">No Comparison</option>
                  <option value="previous">Previous Period</option>
                  <option value="lastYear">Same Period Last Year</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredData.kpis.map((kpi) => {
          const IconComponent = kpi.icon
          const isSelected = selectedKPI === kpi.id
          
          return (
            <motion.div
              key={kpi.id}
              layout
              onClick={() => handleKPIClick(kpi.id)}
              className={`bg-white rounded-lg border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                  kpi.changeType === 'increase' ? 'bg-green-100 text-green-800' :
                  kpi.changeType === 'decrease' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {kpi.changeType === 'increase' ? <TrendingUp className="w-3 h-3" /> :
                   kpi.changeType === 'decrease' ? <TrendingDown className="w-3 h-3" /> :
                   <Activity className="w-3 h-3" />}
                  <span>{Math.abs(kpi.change)}%</span>
                </div>
              </div>
              
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {kpi.value}{kpi.unit && <span className="text-lg text-gray-600 ml-1">{kpi.unit}</span>}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Target: {kpi.target}{kpi.unit}
                </span>
                <span className="text-gray-500">
                  Benchmark: {kpi.benchmark}{kpi.unit}
                </span>
              </div>
              
              {/* Mini trend chart */}
              <div className="mt-4 h-8">
                <div className="flex items-end space-x-1 h-full">
                  {kpi.trend.map((value, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t ${kpi.color.replace('bg-', 'bg-').replace('-500', '-200')}`}
                      style={{ 
                        height: `${(value / Math.max(...kpi.trend)) * 100}%`,
                        minHeight: '2px'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <p className="text-sm text-gray-600 mb-2">{kpi.description}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>View Details</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.charts.map((chart) => (
          <div key={chart.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
              <div className="flex items-center space-x-2">
                {chart.drillDownAvailable && (
                  <button
                    onClick={() => handleDrillDown(chart.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="Drill Down"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Chart placeholder */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                {chart.type === 'line' && <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
                {chart.type === 'bar' && <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
                {chart.type === 'pie' && <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
                {chart.type === 'area' && <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
                <p className="text-gray-500">{chart.title}</p>
                <p className="text-xs text-gray-400">Chart.js integration ready</p>
              </div>
            </div>
            
            {/* Insights */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Key Insights:</h4>
              {chart.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Predictive Analytics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <PredictiveIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Predictive Analytics</h2>
          </div>
          <span className="text-sm text-gray-500">Powered by machine learning</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {predictiveAnalytics.map((prediction, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{prediction.metric}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  prediction.trend === 'up' ? 'bg-green-100 text-green-800' :
                  prediction.trend === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {prediction.trend === 'up' ? '↗' : prediction.trend === 'down' ? '↘' : '→'} {prediction.confidence}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current:</span>
                  <span className="font-medium">{prediction.currentValue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Predicted:</span>
                  <span className="font-medium text-blue-600">{prediction.predictedValue}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {prediction.timeframe}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Key factors:</p>
                <div className="flex flex-wrap gap-1">
                  {prediction.factors.map((factor, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900">Automated Insights & Recommendations</h2>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {filteredData.insights.map((insight) => (
            <div key={insight.id} className={`border-l-4 p-4 rounded-r-lg ${
              insight.type === 'success' ? 'border-green-500 bg-green-50' :
              insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
              insight.type === 'error' ? 'border-red-500 bg-red-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm text-gray-600 italic">
                      💡 {insight.recommendation}
                    </p>
                  )}
                </div>
                {insight.actionable && (
                  <button className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center space-x-1">
                    <span>Take Action</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drill Down Modal */}
      <AnimatePresence>
        {drillDownView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setDrillDownView(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Detailed Analysis</h2>
                <button
                  onClick={() => setDrillDownView(null)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
              
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Detailed drill-down view for {drillDownView}</p>
                  <p className="text-sm text-gray-500">Interactive charts and granular data analysis</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AnalyticsDashboard 