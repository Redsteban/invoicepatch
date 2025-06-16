'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Mail,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  FileText,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  Grid,
  List,
  Layers,
  Database
} from 'lucide-react'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'financial' | 'operational' | 'performance' | 'compliance'
  icon: any
  color: string
  lastUpdated: Date
  dataPoints: string[]
  chartTypes: string[]
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  isScheduled: boolean
  recipients: string[]
}

interface CustomReport {
  id: string
  name: string
  description: string
  createdBy: string
  createdDate: Date
  lastModified: Date
  fields: ReportField[]
  filters: ReportFilter[]
  charts: ChartConfig[]
  isPublic: boolean
  scheduleEnabled: boolean
  schedule?: ScheduleConfig
}

interface ReportField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage'
  source: string
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
  isGroupBy: boolean
  isVisible: boolean
  order: number
}

interface ReportFilter {
  id: string
  field: string
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in'
  value: any
  isActive: boolean
}

interface ChartConfig {
  id: string
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter'
  title: string
  xAxis: string
  yAxis: string[]
  colors: string[]
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
}

interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  dayOfWeek?: number
  dayOfMonth?: number
  recipients: string[]
  format: 'pdf' | 'excel' | 'csv'
  isActive: boolean
}

interface DashboardWidget {
  id: string
  title: string
  type: 'metric' | 'chart' | 'table' | 'progress'
  value: any
  change?: number
  changeType?: 'increase' | 'decrease'
  chartData?: any
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  color: string
}

const ReportingSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'templates' | 'custom' | 'builder'>('dashboard')
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([])
  const [customReports, setCustomReports] = useState<CustomReport[]>([])
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' })
  const [comparisonMode, setComparisonMode] = useState<'none' | 'month' | 'year'>('none')

  // Initialize with mock data
  useEffect(() => {
    const templates: ReportTemplate[] = [
      {
        id: 'monthly-reconciliation',
        name: 'Monthly Reconciliation Summary',
        description: 'Complete monthly financial reconciliation with discrepancies and approvals',
        category: 'financial',
        icon: DollarSign,
        color: 'bg-green-500',
        lastUpdated: new Date(),
        dataPoints: ['Total Invoices', 'Approved Amount', 'Pending Amount', 'Rejected Amount', 'Discrepancies'],
        chartTypes: ['bar', 'pie', 'line'],
        frequency: 'monthly',
        isScheduled: true,
        recipients: ['finance@company.com', 'manager@company.com']
      },
      {
        id: 'contractor-performance',
        name: 'Contractor Performance Analysis',
        description: 'Detailed analysis of contractor submission patterns and approval rates',
        category: 'performance',
        icon: Users,
        color: 'bg-blue-500',
        lastUpdated: new Date(),
        dataPoints: ['Submission Volume', 'Approval Rate', 'Average Processing Time', 'Error Rate'],
        chartTypes: ['bar', 'line', 'scatter'],
        frequency: 'monthly',
        isScheduled: false,
        recipients: []
      },
      {
        id: 'discrepancy-trends',
        name: 'Discrepancy Trends',
        description: 'Track and analyze invoice discrepancy patterns over time',
        category: 'operational',
        icon: TrendingUp,
        color: 'bg-red-500',
        lastUpdated: new Date(),
        dataPoints: ['Discrepancy Count', 'Discrepancy Types', 'Resolution Time', 'Financial Impact'],
        chartTypes: ['line', 'area', 'pie'],
        frequency: 'weekly',
        isScheduled: true,
        recipients: ['operations@company.com']
      },
      {
        id: 'processing-metrics',
        name: 'Processing Time Metrics',
        description: 'Comprehensive analysis of invoice processing and approval timeframes',
        category: 'operational',
        icon: Clock,
        color: 'bg-yellow-500',
        lastUpdated: new Date(),
        dataPoints: ['Average Processing Time', 'SLA Compliance', 'Bottlenecks', 'Efficiency Trends'],
        chartTypes: ['bar', 'line', 'doughnut'],
        frequency: 'weekly',
        isScheduled: true,
        recipients: ['operations@company.com', 'manager@company.com']
      }
    ]

    const widgets: DashboardWidget[] = [
      {
        id: 'total-invoices',
        title: 'Total Invoices',
        type: 'metric',
        value: 1247,
        change: 12.5,
        changeType: 'increase',
        size: 'small',
        position: { x: 0, y: 0 },
        color: 'bg-blue-500'
      },
      {
        id: 'pending-approvals',
        title: 'Pending Approvals',
        type: 'metric',
        value: 23,
        change: -8.2,
        changeType: 'decrease',
        size: 'small',
        position: { x: 1, y: 0 },
        color: 'bg-yellow-500'
      },
      {
        id: 'total-value',
        title: 'Total Value',
        type: 'metric',
        value: '$2.4M',
        change: 15.3,
        changeType: 'increase',
        size: 'small',
        position: { x: 2, y: 0 },
        color: 'bg-green-500'
      },
      {
        id: 'processing-time',
        title: 'Avg Processing Time',
        type: 'metric',
        value: '2.5 days',
        change: -18.1,
        changeType: 'decrease',
        size: 'small',
        position: { x: 3, y: 0 },
        color: 'bg-purple-500'
      }
    ]

    setReportTemplates(templates)
    setDashboardWidgets(widgets)
  }, [])

  const generateMockChartData = (type: string) => {
    switch (type) {
      case 'bar':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Invoices Processed',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }]
        }
      case 'line':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Processing Time',
            data: [3.2, 2.8, 2.1, 2.5],
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4
          }]
        }
      case 'pie':
        return {
          labels: ['Approved', 'Pending', 'Rejected'],
          datasets: [{
            data: [65, 25, 10],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
          }]
        }
      default:
        return {}
    }
  }

  const runReport = (templateId: string) => {
    console.log(`Running report: ${templateId}`)
    // Simulate report generation
    const template = reportTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
    }
  }

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report in ${format} format`)
    // Simulate export functionality
  }

  const scheduleReport = (templateId: string, schedule: ScheduleConfig) => {
    setReportTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isScheduled: schedule.isActive }
        : template
    ))
  }

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reporting & Analytics</h1>
            <p className="text-gray-600">Generate insights and track performance with comprehensive reporting</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Report</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Activity },
              { key: 'templates', label: 'Report Templates', icon: FileText },
              { key: 'custom', label: 'Custom Reports', icon: Layers },
              { key: 'builder', label: 'Report Builder', icon: Grid }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key as any)}
                className={`${
                  currentView === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          {/* Date Range & Comparison Controls */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              
              <select
                value={comparisonMode}
                onChange={(e) => setComparisonMode(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="none">No Comparison</option>
                <option value="month">Month-over-Month</option>
                <option value="year">Year-over-Year</option>
              </select>
            </div>
            
            <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardWidgets.filter(w => w.type === 'metric').map((widget) => (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{widget.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{widget.value}</p>
                    {widget.change && (
                      <div className={`flex items-center mt-1 ${
                        widget.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {widget.changeType === 'increase' ? 
                          <TrendingUp className="w-4 h-4 mr-1" /> : 
                          <TrendingDown className="w-4 h-4 mr-1" />
                        }
                        <span className="text-sm font-medium">{Math.abs(widget.change)}%</span>
                        {comparisonMode !== 'none' && (
                          <span className="text-xs text-gray-500 ml-1">
                            vs {comparisonMode === 'month' ? 'last month' : 'last year'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${widget.color.replace('bg-', 'bg-')}`}>
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Invoice Volume */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Invoice Volume</h3>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <LineChart className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would appear here</p>
                  <p className="text-xs text-gray-400">Integration with Chart.js/Recharts</p>
                </div>
              </div>
            </div>

            {/* Processing Time Trends */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Processing Time Trends</h3>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <LineChart className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Line chart visualization</p>
                  <p className="text-xs text-gray-400">Shows processing efficiency trends</p>
                </div>
              </div>
            </div>

            {/* Approval Status Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Approval Status Distribution</h3>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <PieChart className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Pie chart visualization</p>
                  <p className="text-xs text-gray-400">Approval status breakdown</p>
                </div>
              </div>
            </div>

            {/* Top Contractors */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Contractors by Volume</h3>
                <button className="p-1 text-gray-500 hover:text-gray-700">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {['ABC Construction', 'XYZ Plumbing', 'Elite Electrical', 'Metro HVAC'].map((contractor, index) => (
                  <div key={contractor} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'][index]
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-gray-900">{contractor}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${(Math.random() * 500000 + 100000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                      <p className="text-sm text-gray-600">{Math.floor(Math.random() * 50 + 10)} invoices</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Templates View */}
      {currentView === 'templates' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="financial">Financial</option>
                  <option value="operational">Operational</option>
                  <option value="performance">Performance</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const IconComponent = template.icon
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${template.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => runReport(template.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Run Report"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded" title="Edit Template">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded" title="Schedule">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        template.category === 'financial' ? 'bg-green-100 text-green-800' :
                        template.category === 'operational' ? 'bg-blue-100 text-blue-800' :
                        template.category === 'performance' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {template.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Frequency:</span>
                      <span className="text-gray-900">{template.frequency}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Scheduled:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        template.isScheduled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isScheduled ? 'Yes' : 'No'}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => runReport(template.id)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Run Now
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Custom Reports View */}
      {currentView === 'custom' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Custom Reports</h2>
              <button
                onClick={() => setCurrentView('builder')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Report</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Sample Custom Reports */}
              {[
                {
                  name: 'Q4 Financial Summary',
                  description: 'Custom quarterly financial analysis with contractor breakdowns',
                  createdBy: 'Finance Team',
                  lastRun: '2 days ago',
                  status: 'Active'
                },
                {
                  name: 'Weekly Processing Dashboard',
                  description: 'Custom weekly processing metrics and efficiency tracking',
                  createdBy: 'Operations',
                  lastRun: '1 week ago',
                  status: 'Scheduled'
                },
                {
                  name: 'Contractor Performance Scorecard',
                  description: 'Detailed performance analysis with custom scoring metrics',
                  createdBy: 'Manager',
                  lastRun: '3 days ago',
                  status: 'Active'
                }
              ].map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Created by: {report.createdBy}</span>
                        <span>Last run: {report.lastRun}</span>
                        <span className={`px-2 py-1 rounded ${
                          report.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report Builder View */}
      {currentView === 'builder' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Report Builder</h2>
              <p className="text-gray-600">Drag and drop fields to create custom reports</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Data Sources Panel */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Data Sources</h3>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3">Available Fields</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Invoice Amount', type: 'currency', source: 'invoices' },
                        { name: 'Contractor Name', type: 'text', source: 'contractors' },
                        { name: 'Approval Date', type: 'date', source: 'approvals' },
                        { name: 'Processing Time', type: 'number', source: 'processing' },
                        { name: 'Status', type: 'text', source: 'invoices' },
                        { name: 'Project Code', type: 'text', source: 'projects' }
                      ].map((field, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 rounded border border-gray-200 cursor-move hover:bg-gray-100"
                          draggable
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              field.type === 'currency' ? 'bg-green-500' :
                              field.type === 'date' ? 'bg-blue-500' :
                              field.type === 'number' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <span className="text-sm font-medium">{field.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-4">{field.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3">Chart Types</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { type: 'bar', icon: BarChart3, name: 'Bar Chart' },
                        { type: 'line', icon: LineChart, name: 'Line Chart' },
                        { type: 'pie', icon: PieChart, name: 'Pie Chart' },
                        { type: 'area', icon: TrendingUp, name: 'Area Chart' }
                      ].map((chart) => (
                        <div
                          key={chart.type}
                          className="p-2 border border-gray-200 rounded text-center cursor-move hover:bg-gray-50"
                          draggable
                        >
                          <chart.icon className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                          <span className="text-xs text-gray-700">{chart.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Report Design Area */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Report Design</h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                        Save Report
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Drop Zones */}
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[200px]">
                      <div className="text-gray-500">
                        <Grid className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h4 className="font-medium mb-2">Report Layout</h4>
                        <p className="text-sm">Drag fields and charts here to build your report</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center min-h-[150px]">
                        <div className="text-gray-500">
                          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Drop chart here</p>
                        </div>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center min-h-[150px]">
                        <div className="text-gray-500">
                          <Database className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Drop table here</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report Settings */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3">Report Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                        <input
                          type="text"
                          placeholder="Enter report name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                          <option value="pdf">PDF</option>
                          <option value="excel">Excel</option>
                          <option value="csv">CSV</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                          <option value="none">No Schedule</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                        <input
                          type="text"
                          placeholder="email@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportingSystem 