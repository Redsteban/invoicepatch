'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Mail,
  MessageSquare,
  Download,
  Upload,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Bell,
  Settings,
  PenTool,
  Clipboard,
  TrendingUp,
  UserCheck,
  Timer,
  RefreshCw,
  Archive
} from 'lucide-react'

interface ApprovalItem {
  id: string
  invoiceNumber: string
  contractorName: string
  amount: number
  description: string
  submittedBy: string
  submittedDate: Date
  currentLevel: number
  maxLevel: number
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: Date
  approvalHistory: ApprovalHistoryEntry[]
  attachments: string[]
  category: 'materials' | 'labor' | 'equipment' | 'services' | 'other'
  projectCode?: string
  digitalSignature?: string
  escalationCount: number
  isOverdue: boolean
}

interface ApprovalHistoryEntry {
  id: string
  level: number
  approver: string
  role: string
  action: 'approved' | 'rejected' | 'escalated' | 'commented'
  timestamp: Date
  comments?: string
  signature?: string
  originalAmount?: number
  adjustedAmount?: number
  timeSpent: number // minutes
}

interface ApprovalRule {
  id: string
  name: string
  minAmount: number
  maxAmount: number
  requiredRoles: string[]
  autoEscalationHours: number
  requiresDigitalSignature: boolean
  allowBatchApproval: boolean
}

interface NotificationPreference {
  email: boolean
  sms: boolean
  pushNotification: boolean
  frequency: 'immediate' | 'hourly' | 'daily'
}

const ApprovalWorkflowSystem: React.FC = () => {
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentUser] = useState({
    name: 'John Doe',
    role: 'Senior Manager',
    email: 'john.doe@company.com',
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  })
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    level: 'all',
    category: 'all',
    assignedToMe: false,
    overdue: false
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'dashboard' | 'list' | 'detail'>('dashboard')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [digitalSignature, setDigitalSignature] = useState('')
  const [approvalRules] = useState<ApprovalRule[]>([
    {
      id: 'rule1',
      name: 'Small Invoices',
      minAmount: 0,
      maxAmount: 5000,
      requiredRoles: ['Manager'],
      autoEscalationHours: 24,
      requiresDigitalSignature: false,
      allowBatchApproval: true
    },
    {
      id: 'rule2',
      name: 'Medium Invoices',
      minAmount: 5001,
      maxAmount: 25000,
      requiredRoles: ['Manager', 'Senior Manager'],
      autoEscalationHours: 48,
      requiresDigitalSignature: true,
      allowBatchApproval: true
    },
    {
      id: 'rule3',
      name: 'Large Invoices',
      minAmount: 25001,
      maxAmount: 100000,
      requiredRoles: ['Manager', 'Senior Manager', 'Finance Director'],
      autoEscalationHours: 72,
      requiresDigitalSignature: true,
      allowBatchApproval: false
    },
    {
      id: 'rule4',
      name: 'Major Invoices',
      minAmount: 100001,
      maxAmount: Infinity,
      requiredRoles: ['Manager', 'Senior Manager', 'Finance Director', 'CEO'],
      autoEscalationHours: 96,
      requiresDigitalSignature: true,
      allowBatchApproval: false
    }
  ])

  // Generate mock approval items
  useEffect(() => {
    const generateMockItems = (): ApprovalItem[] => {
      const contractors = ['ABC Construction', 'XYZ Plumbing', 'Elite Electrical', 'Metro HVAC', 'Prime Contractors']
      const categories: ApprovalItem['category'][] = ['materials', 'labor', 'equipment', 'services', 'other']
      const priorities: ApprovalItem['priority'][] = ['low', 'medium', 'high', 'urgent']
      const statuses: ApprovalItem['status'][] = ['pending', 'approved', 'rejected', 'escalated']
      
      return Array.from({ length: 30 }, (_, i) => {
        const amount = Math.floor(Math.random() * 150000) + 1000
        const submittedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        const dueDate = new Date(submittedDate.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000)
        const isOverdue = new Date() > dueDate
        
        const getApprovalLevels = (amount: number): { current: number; max: number } => {
          if (amount <= 5000) return { current: 1, max: 1 }
          if (amount <= 25000) return { current: Math.floor(Math.random() * 2) + 1, max: 2 }
          if (amount <= 100000) return { current: Math.floor(Math.random() * 3) + 1, max: 3 }
          return { current: Math.floor(Math.random() * 4) + 1, max: 4 }
        }
        
        const levels = getApprovalLevels(amount)
        const priority = amount > 50000 ? 'high' : amount > 20000 ? 'medium' : 'low'
        
        const generateHistory = (): ApprovalHistoryEntry[] => {
          const history: ApprovalHistoryEntry[] = []
          const approvers = [
            { name: 'Sarah Johnson', role: 'Manager' },
            { name: 'Mike Wilson', role: 'Senior Manager' },
            { name: 'Lisa Chen', role: 'Finance Director' },
            { name: 'Robert Smith', role: 'CEO' }
          ]
          
          for (let level = 1; level < levels.current; level++) {
            const approver = approvers[level - 1]
            history.push({
              id: `history-${i}-${level}`,
              level,
              approver: approver.name,
              role: approver.role,
              action: Math.random() > 0.1 ? 'approved' : 'commented',
              timestamp: new Date(submittedDate.getTime() + level * 12 * 60 * 60 * 1000),
              comments: Math.random() > 0.7 ? 'Approved - all documentation looks good' : undefined,
              signature: Math.random() > 0.5 ? 'digital_signature_data' : undefined,
              timeSpent: Math.floor(Math.random() * 30) + 5
            })
          }
          
          return history
        }
        
        return {
          id: `approval-${i + 1}`,
          invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          contractorName: contractors[Math.floor(Math.random() * contractors.length)],
          amount,
          description: `${categories[Math.floor(Math.random() * categories.length)]} work for project ${Math.floor(Math.random() * 1000)}`,
          submittedBy: 'System',
          submittedDate,
          currentLevel: levels.current,
          maxLevel: levels.max,
          status: Math.random() > 0.7 ? statuses[Math.floor(Math.random() * statuses.length)] : 'pending',
          priority: priority === 'high' && Math.random() > 0.8 ? 'urgent' : priority,
          dueDate,
          approvalHistory: generateHistory(),
          attachments: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => `attachment-${j + 1}.pdf`),
          category: categories[Math.floor(Math.random() * categories.length)],
          projectCode: `PRJ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          escalationCount: Math.floor(Math.random() * 3),
          isOverdue
        }
      })
    }
    
    setApprovalItems(generateMockItems())
  }, [])

  const getRoleLevel = (role: string): number => {
    switch (role) {
      case 'Manager': return 1
      case 'Senior Manager': return 2
      case 'Finance Director': return 3
      case 'CEO': return 4
      default: return 0
    }
  }

  const getApprovalRule = (amount: number): ApprovalRule | undefined => {
    return approvalRules.find(rule => amount >= rule.minAmount && amount <= rule.maxAmount)
  }

  const canApprove = (item: ApprovalItem): boolean => {
    const userLevel = getRoleLevel(currentUser.role)
    return userLevel >= item.currentLevel && item.status === 'pending'
  }

  const getStatusColor = (status: ApprovalItem['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'escalated': return 'text-blue-600 bg-blue-100'
      case 'expired': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: ApprovalItem['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: ApprovalItem['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />
      case 'escalated': return <ArrowUp className="w-4 h-4 text-blue-500" />
      case 'expired': return <AlertTriangle className="w-4 h-4 text-gray-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const approveItem = (itemId: string, comments?: string) => {
    setApprovalItems(prev => prev.map(item => {
      if (item.id !== itemId) return item
      
      const newHistory: ApprovalHistoryEntry = {
        id: `history-${Date.now()}`,
        level: item.currentLevel,
        approver: currentUser.name,
        role: currentUser.role,
        action: 'approved',
        timestamp: new Date(),
        comments,
        signature: digitalSignature || currentUser.signature,
        timeSpent: Math.floor(Math.random() * 15) + 5
      }
      
      const isFullyApproved = item.currentLevel >= item.maxLevel
      
      return {
        ...item,
        currentLevel: isFullyApproved ? item.currentLevel : item.currentLevel + 1,
        status: isFullyApproved ? 'approved' : 'pending',
        approvalHistory: [...item.approvalHistory, newHistory]
      }
    }))
    
    // Simulate email notification
    console.log(`Email sent: Invoice ${approvalItems.find(i => i.id === itemId)?.invoiceNumber} approved by ${currentUser.name}`)
  }

  const rejectItem = (itemId: string, reason: string) => {
    setApprovalItems(prev => prev.map(item => {
      if (item.id !== itemId) return item
      
      const newHistory: ApprovalHistoryEntry = {
        id: `history-${Date.now()}`,
        level: item.currentLevel,
        approver: currentUser.name,
        role: currentUser.role,
        action: 'rejected',
        timestamp: new Date(),
        comments: reason,
        timeSpent: Math.floor(Math.random() * 20) + 10
      }
      
      return {
        ...item,
        status: 'rejected',
        approvalHistory: [...item.approvalHistory, newHistory]
      }
    }))
  }

  const escalateItem = (itemId: string, reason?: string) => {
    setApprovalItems(prev => prev.map(item => {
      if (item.id !== itemId) return item
      
      const newHistory: ApprovalHistoryEntry = {
        id: `history-${Date.now()}`,
        level: item.currentLevel,
        approver: currentUser.name,
        role: currentUser.role,
        action: 'escalated',
        timestamp: new Date(),
        comments: reason || 'Escalated for further review',
        timeSpent: Math.floor(Math.random() * 10) + 5
      }
      
      return {
        ...item,
        currentLevel: Math.min(item.currentLevel + 1, item.maxLevel),
        status: 'escalated',
        escalationCount: item.escalationCount + 1,
        approvalHistory: [...item.approvalHistory, newHistory]
      }
    }))
  }

  const batchApprove = (itemIds: string[], comments?: string) => {
    itemIds.forEach(id => approveItem(id, comments))
    setSelectedItems([])
    setShowBatchModal(false)
  }

  const filteredItems = approvalItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filters.status === 'all' || item.status === filters.status
    const matchesPriority = filters.priority === 'all' || item.priority === filters.priority
    const matchesLevel = filters.level === 'all' || item.currentLevel.toString() === filters.level
    const matchesCategory = filters.category === 'all' || item.category === filters.category
    const matchesAssignedToMe = !filters.assignedToMe || canApprove(item)
    const matchesOverdue = !filters.overdue || item.isOverdue
    
    return matchesSearch && matchesStatus && matchesPriority && matchesLevel && 
           matchesCategory && matchesAssignedToMe && matchesOverdue
  })

  const stats = {
    total: approvalItems.length,
    pending: approvalItems.filter(i => i.status === 'pending').length,
    myQueue: approvalItems.filter(i => canApprove(i)).length,
    overdue: approvalItems.filter(i => i.isOverdue).length,
    urgent: approvalItems.filter(i => i.priority === 'urgent').length,
    totalValue: approvalItems.reduce((sum, item) => sum + item.amount, 0),
    avgApprovalTime: 2.5, // hours
    approvalRate: Math.round((approvalItems.filter(i => i.status === 'approved').length / approvalItems.length) * 100)
  }

  const selectedItemData = selectedItem ? approvalItems.find(i => i.id === selectedItem) : null

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Approval Workflow</h1>
            <p className="text-gray-600">Manage invoice approvals with role-based workflow</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowBatchModal(true)}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Batch Approve ({selectedItems.length})</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { key: 'list', label: 'Approval Queue', icon: Clipboard },
              { key: 'detail', label: 'Item Detail', icon: Eye, disabled: !selectedItem }
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
          {/* Alert Banner */}
          {stats.urgent > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Urgent Approvals Required</h3>
                  <p className="text-red-700">{stats.urgent} urgent items need immediate attention</p>
                </div>
                <button 
                  onClick={() => {
                    setFilters(prev => ({ ...prev, priority: 'urgent' }))
                    setViewMode('list')
                  }}
                  className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  View Urgent
                </button>
              </div>
            </motion.div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Items', value: stats.total, color: 'blue', icon: FileText },
              { label: 'My Queue', value: stats.myQueue, color: 'green', icon: UserCheck },
              { label: 'Overdue', value: stats.overdue, color: 'red', icon: Timer },
              { label: 'Pending', value: stats.pending, color: 'yellow', icon: Clock }
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

          {/* Approval Pipeline & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Pipeline</h3>
              <div className="space-y-4">
                {[
                  { level: 'Manager', count: 8, color: 'blue' },
                  { level: 'Senior Manager', count: 5, color: 'green' },
                  { level: 'Finance Director', count: 3, color: 'yellow' },
                  { level: 'CEO', count: 1, color: 'red' }
                ].map((level) => (
                  <div key={level.level} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${level.color}-500`} />
                      <span className="text-gray-900">{level.level}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${level.color}-500 h-2 rounded-full`}
                          style={{ width: `${(level.count / stats.pending) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-4">{level.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">${(stats.totalValue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-blue-600">Total Value</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">2.5h</p>
                    <p className="text-sm text-green-600">Avg Time</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Items */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Items Requiring Your Approval</h3>
              <button 
                onClick={() => setViewMode('list')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {filteredItems
                .filter(item => canApprove(item))
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">
                        {getStatusIcon(item.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">{item.contractorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.amount.toLocaleString()}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority.toUpperCase()}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedItem(item.id)
                          setViewMode('detail')
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Review
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
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="escalated">Escalated</option>
              </select>
              
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                value={filters.level}
                onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.assignedToMe}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignedToMe: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">My Queue</span>
                </label>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(filteredItems.map(item => item.id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Select All ({filteredItems.length})
                    </span>
                  </label>
                  {selectedItems.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} selected
                    </span>
                  )}
                </div>
                
                {selectedItems.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowBatchModal(true)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Batch Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                      Batch Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(prev => [...prev, item.id])
                          } else {
                            setSelectedItems(prev => prev.filter(id => id !== item.id))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{item.invoiceNumber}</p>
                            {item.isOverdue && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{item.contractorName}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Level {item.currentLevel}/{item.maxLevel}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item.id)
                            setViewMode('detail')
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {canApprove(item) && (
                          <>
                            <button
                              onClick={() => approveItem(item.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:')
                                if (reason) rejectItem(item.id, reason)
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail View */}
      {viewMode === 'detail' && selectedItemData && (
        <div className="space-y-6">
          {/* Item Header */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedItemData.invoiceNumber}</h2>
                <p className="text-gray-600">{selectedItemData.contractorName}</p>
                <p className="text-sm text-gray-500">{selectedItemData.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedItemData.priority)}`}>
                  {selectedItemData.priority.toUpperCase()} PRIORITY
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItemData.status)}`}>
                  {selectedItemData.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p className="text-lg font-semibold text-gray-900">${selectedItemData.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval Level</label>
                <p className="text-gray-900">{selectedItemData.currentLevel}/{selectedItemData.maxLevel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
                <p className="text-gray-900">{selectedItemData.submittedDate.toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <p className={`${selectedItemData.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                  {selectedItemData.dueDate.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Approval Actions */}
            {canApprove(selectedItemData) && (
              <div className="flex space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <button
                  onClick={() => approveItem(selectedItemData.id, newComment)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Rejection reason:')
                    if (reason) rejectItem(selectedItemData.id, reason)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center space-x-2">
                  <ArrowUp className="w-4 h-4" />
                  <span>Escalate</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <PenTool className="w-4 h-4" />
                  <span>Digital Sign</span>
                </button>
              </div>
            )}
          </div>

          {/* Approval History & Comments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Approval History */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Approval History
              </h3>
              
              <div className="space-y-4">
                {selectedItemData.approvalHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No approval history yet</p>
                ) : (
                  selectedItemData.approvalHistory.map((entry) => (
                    <div key={entry.id} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{entry.approver}</p>
                          <p className="text-sm text-gray-600">{entry.role} • Level {entry.level}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.action === 'approved' ? 'bg-green-100 text-green-800' :
                            entry.action === 'rejected' ? 'bg-red-100 text-red-800' :
                            entry.action === 'escalated' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.action.toUpperCase()}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {entry.comments && (
                        <p className="text-gray-700 mt-2 text-sm">{entry.comments}</p>
                      )}
                      {entry.signature && (
                        <div className="flex items-center mt-2 text-xs text-green-600">
                          <PenTool className="w-3 h-3 mr-1" />
                          <span>Digitally Signed</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comments & Notes
              </h3>
              
              <div className="space-y-4 mb-4">
                <div className="border-l-4 border-yellow-200 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">System</p>
                      <p className="text-sm text-gray-600">Auto-generated</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {selectedItemData.submittedDate.toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-700 mt-2 text-sm">
                    Invoice submitted for approval. Amount: ${selectedItemData.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {
                      // Add comment logic here
                      setNewComment('')
                    }}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Attachments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedItemData.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <FileText className="w-8 h-8 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{attachment}</p>
                    <p className="text-sm text-gray-600">PDF Document</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Batch Approval Modal */}
      <AnimatePresence>
        {showBatchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowBatchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Approval</h3>
              <p className="text-gray-600 mb-4">
                You are about to approve {selectedItems.length} items. This action cannot be undone.
              </p>
              <textarea
                placeholder="Add approval comments (optional)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                rows={3}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    selectedItems.forEach(id => approveItem(id, 'Batch approval'))
                    setSelectedItems([])
                    setShowBatchModal(false)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApprovalWorkflowSystem 