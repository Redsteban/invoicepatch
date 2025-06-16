'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  Copy,
  MapPin,
  Eye,
  MessageSquare,
  Users,
  TrendingUp,
  AlertCircle,
  Settings,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Archive,
  Bell
} from 'lucide-react'

interface Issue {
  id: string
  type: 'amount_mismatch' | 'missing_invoice' | 'duplicate_entry' | 'date_inconsistency' | 'job_code_error'
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'investigating' | 'pending_approval' | 'resolved' | 'closed'
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  assignedTo?: string
  contractorName: string
  invoiceNumber?: string
  amount?: number
  expectedAmount?: number
  jobCode?: string
  expectedJobCode?: string
  date?: string
  expectedDate?: string
  autoDetected: boolean
  investigationNotes: InvestigationNote[]
  communicationLog: CommunicationEntry[]
  approvalHistory: ApprovalEntry[]
  resolution?: string
  resolutionType?: 'approve_contractor' | 'approve_billing' | 'manual_adjustment' | 'escalate' | 'ignore'
}

interface InvestigationNote {
  id: string
  author: string
  content: string
  timestamp: Date
  attachments?: string[]
}

interface CommunicationEntry {
  id: string
  type: 'email' | 'call' | 'meeting' | 'internal_note'
  direction: 'inbound' | 'outbound' | 'internal'
  author: string
  recipient?: string
  subject?: string
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read' | 'replied'
}

interface ApprovalEntry {
  id: string
  approver: string
  role: string
  action: 'approved' | 'rejected' | 'escalated' | 'requested_changes'
  comments?: string
  timestamp: Date
  level: number
}

const IssueDetectionSystem: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    status: 'all',
    assignee: 'all',
    dateRange: '30days'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'dashboard' | 'list' | 'detail'>('dashboard')
  const [newNote, setNewNote] = useState('')
  const [newCommunication, setNewCommunication] = useState({
    type: 'internal_note' as const,
    content: '',
    recipient: ''
  })

  // Generate mock issues
  useEffect(() => {
    const generateMockIssues = (): Issue[] => {
      const contractors = ['ABC Construction', 'XYZ Plumbing', 'Elite Electrical', 'Metro HVAC', 'Prime Contractors']
      const types: Issue['type'][] = ['amount_mismatch', 'missing_invoice', 'duplicate_entry', 'date_inconsistency', 'job_code_error']
      const priorities: Issue['priority'][] = ['high', 'medium', 'low']
      const statuses: Issue['status'][] = ['open', 'investigating', 'pending_approval', 'resolved', 'closed']
      
      return Array.from({ length: 25 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)]
        const priority = priorities[Math.floor(Math.random() * priorities.length)]
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const contractor = contractors[Math.floor(Math.random() * contractors.length)]
        const amount = Math.floor(Math.random() * 50000) + 1000
        const expectedAmount = type === 'amount_mismatch' ? amount + (Math.random() - 0.5) * 10000 : amount
        
        const getIssueDetails = (type: Issue['type']) => {
          switch (type) {
            case 'amount_mismatch':
              return {
                title: `Amount discrepancy for ${contractor}`,
                description: `Invoice amount $${amount.toLocaleString()} differs from expected $${expectedAmount.toLocaleString()}`
              }
            case 'missing_invoice':
              return {
                title: `Missing invoice from ${contractor}`,
                description: `Expected invoice for job J-${Math.floor(Math.random() * 1000)} not received`
              }
            case 'duplicate_entry':
              return {
                title: `Duplicate invoice detected - ${contractor}`,
                description: `Invoice INV-${Math.floor(Math.random() * 10000)} appears to be duplicated`
              }
            case 'date_inconsistency':
              return {
                title: `Date mismatch for ${contractor}`,
                description: `Invoice date doesn't match expected service period`
              }
            case 'job_code_error':
              return {
                title: `Invalid job code - ${contractor}`,
                description: `Job code J-${Math.floor(Math.random() * 1000)} not found in system`
              }
            default:
              return { title: 'Unknown issue', description: 'Unknown issue type' }
          }
        }
        
        const details = getIssueDetails(type)
        
        return {
          id: `issue-${i + 1}`,
          type,
          priority,
          status,
          title: details.title,
          description: details.description,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          assignedTo: Math.random() > 0.3 ? ['John Doe', 'Jane Smith', 'Mike Johnson'][Math.floor(Math.random() * 3)] : undefined,
          contractorName: contractor,
          invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          amount,
          expectedAmount: type === 'amount_mismatch' ? expectedAmount : undefined,
          jobCode: type === 'job_code_error' ? `J-${Math.floor(Math.random() * 1000)}` : undefined,
          expectedJobCode: type === 'job_code_error' ? `J-${Math.floor(Math.random() * 1000)}` : undefined,
          date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          expectedDate: type === 'date_inconsistency' ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
          autoDetected: Math.random() > 0.2,
          investigationNotes: [],
          communicationLog: [],
          approvalHistory: [],
          resolution: status === 'resolved' || status === 'closed' ? 'Issue resolved through manual adjustment' : undefined,
          resolutionType: status === 'resolved' || status === 'closed' ? 'manual_adjustment' : undefined
        }
      })
    }
    
    setIssues(generateMockIssues())
  }, [])

  const getIssueTypeIcon = (type: Issue['type']) => {
    switch (type) {
      case 'amount_mismatch': return <DollarSign className="w-5 h-5" />
      case 'missing_invoice': return <FileText className="w-5 h-5" />
      case 'duplicate_entry': return <Copy className="w-5 h-5" />
      case 'date_inconsistency': return <Calendar className="w-5 h-5" />
      case 'job_code_error': return <MapPin className="w-5 h-5" />
      default: return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getIssueTypeLabel = (type: Issue['type']) => {
    switch (type) {
      case 'amount_mismatch': return 'Amount Mismatch'
      case 'missing_invoice': return 'Missing Invoice'
      case 'duplicate_entry': return 'Duplicate Entry'
      case 'date_inconsistency': return 'Date Inconsistency'
      case 'job_code_error': return 'Job Code Error'
      default: return 'Unknown'
    }
  }

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'investigating': return <Search className="w-4 h-4 text-yellow-500" />
      case 'pending_approval': return <Clock className="w-4 h-4 text-blue-500" />
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'closed': return <XCircle className="w-4 h-4 text-gray-500" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100'
      case 'investigating': return 'text-yellow-600 bg-yellow-100'
      case 'pending_approval': return 'text-blue-600 bg-blue-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      case 'closed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchTerm === '' || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filters.type === 'all' || issue.type === filters.type
    const matchesPriority = filters.priority === 'all' || issue.priority === filters.priority
    const matchesStatus = filters.status === 'all' || issue.status === filters.status
    const matchesAssignee = filters.assignee === 'all' || 
      (filters.assignee === 'unassigned' && !issue.assignedTo) ||
      issue.assignedTo === filters.assignee
    
    const now = new Date()
    const issueDate = new Date(issue.createdAt)
    const daysDiff = Math.floor((now.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24))
    
    const matchesDateRange = filters.dateRange === 'all' ||
      (filters.dateRange === '7days' && daysDiff <= 7) ||
      (filters.dateRange === '30days' && daysDiff <= 30) ||
      (filters.dateRange === '90days' && daysDiff <= 90)
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesAssignee && matchesDateRange
  })

  const issueStats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    investigating: issues.filter(i => i.status === 'investigating').length,
    pendingApproval: issues.filter(i => i.status === 'pending_approval').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    highPriority: issues.filter(i => i.priority === 'high').length,
    autoDetected: issues.filter(i => i.autoDetected).length,
    byType: {
      amount_mismatch: issues.filter(i => i.type === 'amount_mismatch').length,
      missing_invoice: issues.filter(i => i.type === 'missing_invoice').length,
      duplicate_entry: issues.filter(i => i.type === 'duplicate_entry').length,
      date_inconsistency: issues.filter(i => i.type === 'date_inconsistency').length,
      job_code_error: issues.filter(i => i.type === 'job_code_error').length
    }
  }

  const updateIssueStatus = (issueId: string, newStatus: Issue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus, updatedAt: new Date() }
        : issue
    ))
  }

  const assignIssue = (issueId: string, assignee: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, assignedTo: assignee, updatedAt: new Date() }
        : issue
    ))
  }

  const addInvestigationNote = (issueId: string, content: string) => {
    if (!content.trim()) return
    
    const newNote: InvestigationNote = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Current User',
      content: content.trim(),
      timestamp: new Date()
    }
    
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            investigationNotes: [...issue.investigationNotes, newNote],
            updatedAt: new Date()
          }
        : issue
    ))
    
    setNewNote('')
  }

  const addCommunicationEntry = (issueId: string, entry: Omit<CommunicationEntry, 'id' | 'timestamp' | 'status'>) => {
    if (!entry.content.trim()) return
    
    const newEntry: CommunicationEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...entry,
      timestamp: new Date(),
      status: 'sent'
    }
    
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            communicationLog: [...issue.communicationLog, newEntry],
            updatedAt: new Date()
          }
        : issue
    ))
    
    setNewCommunication({ type: 'internal_note', content: '', recipient: '' })
  }

  const selectedIssueData = selectedIssue ? issues.find(i => i.id === selectedIssue) : null

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Issue Detection System</h1>
            <p className="text-gray-600">Automatically detect and manage invoice discrepancies</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Run Detection</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { key: 'list', label: 'Issue List', icon: FileText },
              { key: 'detail', label: 'Issue Detail', icon: Eye, disabled: !selectedIssue }
            ].map(({ key, label, icon: Icon, disabled }) => (
              <button
                key={key}
                onClick={() => !disabled && setViewMode(key as any)}
                disabled={disabled}
                className={`${
                  viewMode === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Dashboard View */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          {/* Critical Alerts */}
          {issueStats.highPriority > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Critical Issues Detected</h3>
                  <p className="text-red-700">
                    {issueStats.highPriority} high-priority issues require immediate attention
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setFilters(prev => ({ ...prev, priority: 'high', status: 'open' }))
                    setViewMode('list')
                  }}
                  className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  View Issues
                </button>
              </div>
            </motion.div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Issues', value: issueStats.total, color: 'blue', icon: AlertTriangle },
              { label: 'Open Issues', value: issueStats.open, color: 'red', icon: AlertCircle },
              { label: 'In Progress', value: issueStats.investigating + issueStats.pendingApproval, color: 'yellow', icon: Clock },
              { label: 'Resolved', value: issueStats.resolved, color: 'green', icon: CheckCircle }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Issue Types Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Type</h3>
              <div className="space-y-4">
                {Object.entries(issueStats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">
                        {getIssueTypeIcon(type as Issue['type'])}
                      </div>
                      <span className="text-gray-900">{getIssueTypeLabel(type as Issue['type'])}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / issueStats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Auto-Detected Issues</span>
                    <span className="text-sm font-medium">{issueStats.autoDetected}/{issueStats.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(issueStats.autoDetected / issueStats.total) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{Math.round((issueStats.autoDetected / issueStats.total) * 100)}%</p>
                    <p className="text-sm text-gray-600">Detection Rate</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{Math.round((issueStats.resolved / issueStats.total) * 100)}%</p>
                    <p className="text-sm text-gray-600">Resolution Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Critical Issues */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Critical Issues</h3>
              <button 
                onClick={() => setViewMode('list')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {issues
                .filter(issue => issue.priority === 'high' && issue.status !== 'closed')
                .slice(0, 5)
                .map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <div className="text-red-600">
                        {getIssueTypeIcon(issue.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{issue.title}</p>
                        <p className="text-sm text-gray-600">{issue.contractorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority.toUpperCase()}
                      </span>
                      <button 
                        onClick={() => {
                          setSelectedIssue(issue.id)
                          setViewMode('detail')
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Investigate
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="amount_mismatch">Amount Mismatch</option>
                <option value="missing_invoice">Missing Invoice</option>
                <option value="duplicate_entry">Duplicate Entry</option>
                <option value="date_inconsistency">Date Inconsistency</option>
                <option value="job_code_error">Job Code Error</option>
              </select>
              
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>

          {/* Issues List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIssues.map((issue) => (
                    <motion.tr
                      key={issue.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedIssue(issue.id)
                        setViewMode('detail')
                      }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                          <div className="text-sm text-gray-500">{issue.contractorName}</div>
                          {issue.invoiceNumber && (
                            <div className="text-xs text-gray-400">{issue.invoiceNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="text-gray-600">
                            {getIssueTypeIcon(issue.type)}
                          </div>
                          <span className="text-sm text-gray-900">{getIssueTypeLabel(issue.type)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
                          {issue.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(issue.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                            {issue.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.assignedTo || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedIssue(issue.id)
                              setViewMode('detail')
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detail View */}
      {viewMode === 'detail' && selectedIssueData && (
        <div className="space-y-6">
          {/* Issue Header */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">
                  {getIssueTypeIcon(selectedIssueData.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedIssueData.title}</h2>
                  <p className="text-gray-600">{selectedIssueData.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedIssueData.priority)}`}>
                  {selectedIssueData.priority.toUpperCase()} PRIORITY
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedIssueData.status)}`}>
                  {selectedIssueData.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Issue Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contractor</label>
                <p className="text-gray-900">{selectedIssueData.contractorName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <p className="text-gray-900">{selectedIssueData.invoiceNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p className="text-gray-900">{selectedIssueData.createdAt.toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <select
                  value={selectedIssueData.assignedTo || ''}
                  onChange={(e) => assignIssue(selectedIssue!, e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                </select>
              </div>
            </div>

            {/* Discrepancy Details */}
            {(selectedIssueData.type === 'amount_mismatch' || 
              selectedIssueData.type === 'date_inconsistency' || 
              selectedIssueData.type === 'job_code_error') && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Discrepancy Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedIssueData.type === 'amount_mismatch' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-1">Invoice Amount</label>
                        <p className="text-red-900 font-medium">${selectedIssueData.amount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-1">Expected Amount</label>
                        <p className="text-red-900 font-medium">${selectedIssueData.expectedAmount?.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                  {selectedIssueData.type === 'date_inconsistency' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-1">Invoice Date</label>
                        <p className="text-red-900 font-medium">{selectedIssueData.date}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-1">Expected Date</label>
                        <p className="text-red-900 font-medium">{selectedIssueData.expectedDate}</p>
                      </div>
                    </>
                  )}
                  {selectedIssueData.type === 'job_code_error' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-1">Invoice Job Code</label>
                        <p className="text-red-900 font-medium">{selectedIssueData.jobCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-1">Expected Job Code</label>
                        <p className="text-red-900 font-medium">{selectedIssueData.expectedJobCode}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <select
                value={selectedIssueData.status}
                onChange={(e) => updateIssueStatus(selectedIssue!, e.target.value as Issue['status'])}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Approve Contractor</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Manual Adjustment</span>
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Escalate</span>
              </button>
            </div>
          </div>

          {/* Investigation & Communication Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Investigation Notes */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Investigation Notes
              </h3>
              
              {/* Add New Note */}
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add investigation note..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => addInvestigationNote(selectedIssue!, newNote)}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {selectedIssueData.investigationNotes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No investigation notes yet</p>
                ) : (
                  selectedIssueData.investigationNotes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{note.author}</span>
                        <span className="text-sm text-gray-500">
                          {note.timestamp.toLocaleDateString()} {note.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Communication Log */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Communication Log
              </h3>
              
              {/* Add New Communication */}
              <div className="mb-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    value={newCommunication.type}
                    onChange={(e) => setNewCommunication(prev => ({ ...prev, type: e.target.value as any }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="internal_note">Internal Note</option>
                    <option value="email">Email</option>
                    <option value="call">Phone Call</option>
                    <option value="meeting">Meeting</option>
                  </select>
                  
                  {newCommunication.type !== 'internal_note' && (
                    <input
                      type="text"
                      placeholder="Recipient"
                      value={newCommunication.recipient}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, recipient: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
                
                <textarea
                  value={newCommunication.content}
                  onChange={(e) => setNewCommunication(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Communication details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                
                <div className="flex justify-end">
                  <button
                    onClick={() => addCommunicationEntry(selectedIssue!, {
                      type: newCommunication.type,
                      direction: newCommunication.type === 'internal_note' ? 'internal' : 'outbound',
                      author: 'Current User',
                      recipient: newCommunication.recipient,
                      content: newCommunication.content
                    })}
                    disabled={!newCommunication.content.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add Entry
                  </button>
                </div>
              </div>

              {/* Communication Entries */}
              <div className="space-y-3">
                {selectedIssueData.communicationLog.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No communication entries yet</p>
                ) : (
                  selectedIssueData.communicationLog.map((entry) => (
                    <div key={entry.id} className={`p-4 rounded-lg border ${
                      entry.type === 'internal_note' ? 'bg-blue-50 border-blue-200' :
                      entry.direction === 'inbound' ? 'bg-green-50 border-green-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{entry.author}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            entry.type === 'email' ? 'bg-blue-100 text-blue-800' :
                            entry.type === 'call' ? 'bg-green-100 text-green-800' :
                            entry.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.type.replace('_', ' ').toUpperCase()}
                          </span>
                          {entry.direction !== 'internal' && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              entry.direction === 'inbound' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {entry.direction.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {entry.recipient && (
                        <p className="text-sm text-gray-600 mb-2">To: {entry.recipient}</p>
                      )}
                      <p className="text-gray-700">{entry.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Approval Hierarchy */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Approval Hierarchy
            </h3>
            
            <div className="space-y-4">
              {/* Level 1: Manager Review */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedIssueData.status === 'resolved' || selectedIssueData.status === 'closed'
                      ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manager Review</p>
                    <p className="text-sm text-gray-600">Initial assessment and investigation</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Current User</p>
                  <p className="text-xs text-gray-500">Assigned</p>
                </div>
              </div>

              {/* Level 2: Department Approval */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 text-white">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Department Head Approval</p>
                                         <p className="text-sm text-gray-600">Required for amounts &gt; $5,000</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>

              {/* Level 3: Executive Approval */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 text-white">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Executive Approval</p>
                    <p className="text-sm text-gray-600">Required for amounts &gt; $25,000</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Mike Johnson</p>
                  <p className="text-xs text-gray-500">Not Required</p>
                </div>
              </div>
            </div>

            {/* Approval Actions */}
            <div className="mt-6 flex space-x-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Forward</span>
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2">
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Request Changes</span>
              </button>
            </div>
          </div>

          {/* Resolution Summary */}
          {selectedIssueData.resolution && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Resolution Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Resolution Type</label>
                  <p className="text-green-900 capitalize">{selectedIssueData.resolutionType?.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Resolved Date</label>
                  <p className="text-green-900">{selectedIssueData.updatedAt.toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-green-700 mb-1">Resolution Details</label>
                  <p className="text-green-900">{selectedIssueData.resolution}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IssueDetectionSystem 