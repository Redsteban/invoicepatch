'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  Archive,
  Fuel,
  Drill
} from 'lucide-react'

interface ApprovalItem {
  id: string
  ticketNumber: string
  operatorName: string
  amount: number
  description: string
  submittedBy: string
  submittedDate: Date
  currentLevel: number
  maxLevel: number
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'safety-alert'
  dueDate: Date
  approvalHistory: ApprovalHistoryEntry[]
  attachments: string[]
  category: 'Drilling' | 'Completion' | 'Production' | 'Maintenance' | 'Logistics' | 'Other'
  projectCode?: string
  afeNumber?: string
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
    name: 'John "Rig" Doe',
    role: 'Site Supervisor',
    email: 'john.doe@oilfield.co',
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
      name: 'Standard Tickets',
      minAmount: 0,
      maxAmount: 10000,
      requiredRoles: ['Foreman'],
      autoEscalationHours: 24,
      requiresDigitalSignature: false,
      allowBatchApproval: true
    },
    {
      id: 'rule2',
      name: 'High-Value Tickets',
      minAmount: 10001,
      maxAmount: 50000,
      requiredRoles: ['Foreman', 'Site Supervisor'],
      autoEscalationHours: 48,
      requiresDigitalSignature: true,
      allowBatchApproval: true
    },
    {
      id: 'rule3',
      name: 'Major Tickets',
      minAmount: 50001,
      maxAmount: 250000,
      requiredRoles: ['Foreman', 'Site Supervisor', 'Operations Manager'],
      autoEscalationHours: 72,
      requiresDigitalSignature: true,
      allowBatchApproval: false
    },
    {
      id: 'rule4',
      name: 'Executive Tickets',
      minAmount: 250001,
      maxAmount: Infinity,
      requiredRoles: ['Foreman', 'Site Supervisor', 'Operations Manager', 'Director'],
      autoEscalationHours: 96,
      requiresDigitalSignature: true,
      allowBatchApproval: false
    }
  ])

  // Generate mock approval items
  useEffect(() => {
    const generateMockItems = (): ApprovalItem[] => {
      const operators = ['Apex Drilling', 'Horizon Wells', 'Rig Runners', 'Precision Flow', 'Titan Services']
      const categories: ApprovalItem['category'][] = ['Drilling', 'Completion', 'Production', 'Maintenance', 'Logistics', 'Other']
      const priorities: ApprovalItem['priority'][] = ['low', 'medium', 'high', 'urgent', 'safety-alert']
      const statuses: ApprovalItem['status'][] = ['pending', 'approved', 'rejected', 'escalated']
      
      return Array.from({ length: 30 }, (_, i) => {
        const amount = Math.floor(Math.random() * 300000) + 1000
        const submittedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        const dueDate = new Date(submittedDate.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000)
        const isOverdue = new Date() > dueDate
        
        const getApprovalLevels = (amount: number): { current: number; max: number } => {
          if (amount <= 10000) return { current: 1, max: 1 }
          if (amount <= 50000) return { current: Math.floor(Math.random() * 2) + 1, max: 2 }
          if (amount <= 250000) return { current: Math.floor(Math.random() * 3) + 1, max: 3 }
          return { current: Math.floor(Math.random() * 4) + 1, max: 4 }
        }
        
        const levels = getApprovalLevels(amount)
        let priority: ApprovalItem['priority'] = amount > 100000 ? 'high' : amount > 25000 ? 'medium' : 'low'
        if (Math.random() < 0.1) priority = 'safety-alert'
        
        const generateHistory = (): ApprovalHistoryEntry[] => {
          const history: ApprovalHistoryEntry[] = []
          const approvers = [
            { name: 'Hank Hill', role: 'Foreman' },
            { name: 'John Doe', role: 'Site Supervisor' },
            { name: 'Jane Smith', role: 'Operations Manager' },
            { name: 'Richard Roe', role: 'Director' }
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
              comments: Math.random() > 0.7 ? 'Approved - all looks good.' : undefined,
              signature: Math.random() > 0.5 ? 'digital_signature_data' : undefined,
              timeSpent: Math.floor(Math.random() * 30) + 5
            })
          }
          
          return history
        }
        
        return {
          id: `approval-${i + 1}`,
          ticketNumber: `FT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          operatorName: operators[Math.floor(Math.random() * operators.length)],
          amount,
          description: `${categories[Math.floor(Math.random() * categories.length)]} services for AFE ${Math.floor(Math.random() * 1000)}`,
          submittedBy: 'Field Crew',
          submittedDate,
          currentLevel: levels.current,
          maxLevel: levels.max,
          status: Math.random() > 0.7 ? statuses[Math.floor(Math.random() * statuses.length)] : 'pending',
          priority,
          dueDate,
          approvalHistory: generateHistory(),
          attachments: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => `doc-${j + 1}.pdf`),
          category: categories[Math.floor(Math.random() * categories.length)],
          projectCode: `PROJ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          afeNumber: `AFE-${Math.floor(Math.random() * 500).toString().padStart(3, '0')}`,
          escalationCount: Math.floor(Math.random() * 3),
          isOverdue
        }
      })
    }
    
    setApprovalItems(generateMockItems())
  }, [])

  const getRoleLevel = (role: string): number => {
    switch (role) {
      case 'Foreman': return 1
      case 'Site Supervisor': return 2
      case 'Operations Manager': return 3
      case 'Director': return 4
      default: return 0
    }
  }

  const getApprovalRule = (amount: number): ApprovalRule | undefined => {
    return approvalRules.find(rule => amount >= rule.minAmount && amount <= rule.maxAmount)
  }

  const canApprove = (item: ApprovalItem): boolean => {
    const userLevel = getRoleLevel(currentUser.role)
    return item.status === 'pending' && userLevel === item.currentLevel
  }

  const getStatusInfo = (status: ApprovalItem['status']) => {
    switch (status) {
      case 'approved': return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, color: 'text-green-500', bg: 'bg-green-100' }
      case 'pending': return { icon: <Clock className="w-4 h-4 text-yellow-500" />, color: 'text-yellow-500', bg: 'bg-yellow-100' }
      case 'rejected': return { icon: <XCircle className="w-4 h-4 text-red-500" />, color: 'text-red-500', bg: 'bg-red-100' }
      case 'escalated': return { icon: <ArrowUp className="w-4 h-4 text-purple-500" />, color: 'text-purple-500', bg: 'bg-purple-100' }
      case 'expired': return { icon: <Timer className="w-4 h-4 text-gray-500" />, color: 'text-gray-500', bg: 'bg-gray-100' }
      default: return { icon: <Clock className="w-4 h-4" />, color: 'text-gray-500', bg: 'bg-gray-100' }
    }
  }

  const getPriorityInfo = (priority: ApprovalItem['priority']) => {
    switch (priority) {
      case 'safety-alert': return { icon: <AlertTriangle className="w-4 h-4 text-red-700" />, label: 'Safety Alert', color: 'text-red-700', bg: 'bg-red-100' }
      case 'urgent': return { icon: <AlertTriangle className="w-4 h-4 text-red-600" />, label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' }
      case 'high': return { icon: <ArrowUp className="w-4 h-4 text-orange-500" />, label: 'High', color: 'text-orange-500', bg: 'bg-orange-100' }
      case 'medium': return { icon: <MoreHorizontal className="w-4 h-4 text-blue-500" />, label: 'Medium', color: 'text-blue-500', bg: 'bg-blue-100' }
      case 'low': return { icon: <ArrowDown className="w-4 h-4 text-gray-500" />, label: 'Low', color: 'text-gray-500', bg: 'bg-gray-100' }
      default: return { icon: <MoreHorizontal className="w-4 h-4" />, label: 'Normal', color: 'text-gray-500', bg: 'bg-gray-100' }
    }
  }

  const approveItem = (itemId: string, comments?: string) => {
    setApprovalItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return prevItems;
      const item = { ...prevItems[itemIndex] };
      
      item.approvalHistory.push({
        id: `history-${itemId}-${Date.now()}`,
        level: item.currentLevel,
        approver: currentUser.name,
        role: currentUser.role,
        action: 'approved',
        timestamp: new Date(),
        comments,
        signature: digitalSignature,
        timeSpent: Math.floor(Math.random() * 15) + 1 // placeholder
      });

      if (item.currentLevel < item.maxLevel) {
        item.currentLevel += 1;
        item.status = 'pending';
      } else {
        item.status = 'approved';
      }
      
      const newItems = [...prevItems];
      newItems[itemIndex] = item;
      return newItems;
    });

    setSelectedItem(null);
    setShowBatchModal(false);
  };

  const rejectItem = (itemId: string, reason: string) => {
     setApprovalItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return prevItems;
      const item = { ...prevItems[itemIndex] };
      
      item.approvalHistory.push({
        id: `history-${itemId}-${Date.now()}`,
        level: item.currentLevel,
        approver: currentUser.name,
        role: currentUser.role,
        action: 'rejected',
        timestamp: new Date(),
        comments: reason,
        signature: digitalSignature,
        timeSpent: Math.floor(Math.random() * 15) + 1 // placeholder
      });
      
      item.status = 'rejected';
      
      const newItems = [...prevItems];
      newItems[itemIndex] = item;
      return newItems;
    });

    setSelectedItem(null);
    setShowBatchModal(false);
  };

  const escalateItem = (itemId: string, reason?: string) => {
    setApprovalItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return prevItems;
      const item = { ...prevItems[itemIndex] };
      
      item.approvalHistory.push({
        id: `history-${itemId}-${Date.now()}`,
        level: item.currentLevel,
        approver: currentUser.name,
        role: currentUser.role,
        action: 'escalated',
        timestamp: new Date(),
        comments: reason,
        timeSpent: Math.floor(Math.random() * 5) + 1
      });
      
      item.status = 'escalated';
      item.escalationCount += 1;
      
      // Logic for re-assigning to the next level could be added here
      if(item.currentLevel < item.maxLevel) {
          item.currentLevel += 1;
      }
      
      const newItems = [...prevItems];
      newItems[itemIndex] = item;
      return newItems;
    });
    setSelectedItem(null);
  };

  const batchApprove = (itemIds: string[], comments?: string) => {
    itemIds.forEach(id => approveItem(id, comments));
    setSelectedItems([]);
  };

  const filteredItems = approvalItems
    .filter(item => filters.status === 'all' || item.status === filters.status)
    .filter(item => filters.priority === 'all' || item.priority === filters.priority)
    .filter(item => filters.category === 'all' || item.category === filters.category)
    .filter(item => !filters.assignedToMe || canApprove(item))
    .filter(item => !filters.overdue || item.isOverdue)
    .filter(item => 
      item.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const dashboardStats = {
    pending: approvalItems.filter(i => i.status === 'pending').length,
    approved: approvalItems.filter(i => i.status === 'approved').length,
    rejected: approvalItems.filter(i => i.status === 'rejected').length,
    escalated: approvalItems.filter(i => i.status === 'escalated').length,
    totalValue: approvalItems.reduce((acc, i) => acc + i.amount, 0),
    avgApprovalTime: approvalItems.length > 0
      ? approvalItems.flatMap(i => i.approvalHistory.map(h => h.timeSpent)).reduce((a, b) => a + b, 0) / 
        (approvalItems.flatMap(i => i.approvalHistory).length || 1)
      : 0
  };
  
  const handleItemSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(filteredItems.map(i => i.id))
    } else {
      setSelectedItems([])
    }
  }

  const renderDashboard = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Approval Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Clock/>} title="Pending Approvals" value={dashboardStats.pending} color="yellow" />
        <StatCard icon={<CheckCircle/>} title="Approved This Month" value={dashboardStats.approved} color="green" />
        <StatCard icon={<XCircle/>} title="Rejected This Month" value={dashboardStats.rejected} color="red" />
        <StatCard icon={<TrendingUp/>} title="Total Value Pending" value={`$${(dashboardStats.totalValue/1000).toFixed(1)}k`} color="blue" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Items by Category</h3>
          {/* Placeholder for a chart */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Category breakdown chart</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Approval Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Approval Time</span>
              <span className="font-bold text-gray-800">{dashboardStats.avgApprovalTime.toFixed(1)} mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SLA Compliance</span>
              <span className="font-bold text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auto-Escalations</span>
              <span className="font-bold text-orange-500">{dashboardStats.escalated}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const StatCard = ({ icon, title, value, color }: {icon: React.ReactNode, title: string, value: string | number, color: string}) => {
    const colors: { [key: string]: string } = {
      yellow: 'text-yellow-600 bg-yellow-100',
      green: 'text-green-600 bg-green-100',
      red: 'text-red-600 bg-red-100',
      blue: 'text-blue-600 bg-blue-100',
    }
    return (
      <div className="bg-white p-5 rounded-lg shadow flex items-center">
        <div className={`p-3 rounded-full ${colors[color]}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    )
  }

  const renderList = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FilterPill active={filters.status === 'all'} onClick={() => setFilters(f => ({ ...f, status: 'all' }))}>All</FilterPill>
            <FilterPill active={filters.status === 'pending'} onClick={() => setFilters(f => ({ ...f, status: 'pending' }))}>Pending</FilterPill>
            <FilterPill active={filters.status === 'approved'} onClick={() => setFilters(f => ({ ...f, status: 'approved' }))}>Approved</FilterPill>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === filteredItems.length && filteredItems.length > 0} className="rounded border-gray-300 text-green-600 focus:ring-green-500" /></th>
              <th scope="col" className="px-6 py-3">Ticket Info</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Due Date</th>
              <th scope="col" className="px-6 py-3">Priority</th>
              <th scope="col" className="px-6 py-3">Approver</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="w-4 p-4"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleItemSelect(item.id)} className="rounded border-gray-300 text-green-600 focus:ring-green-500" /></td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{item.ticketNumber}</div>
                  <div className="text-xs text-gray-500">{item.operatorName}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">${item.amount.toLocaleString()}</td>
                <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${getStatusInfo(item.status).bg} ${getStatusInfo(item.status).color}`}>{getStatusInfo(item.status).icon} {item.status}</span></td>
                <td className="px-6 py-4">{new Date(item.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium ${getPriorityInfo(item.priority).bg} ${getPriorityInfo(item.priority).color}`}>{getPriorityInfo(item.priority).icon} {getPriorityInfo(item.priority).label}</span></td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">Level {item.currentLevel}/{item.maxLevel}</div>
                  <div className="text-xs text-gray-500">{getApprovalRule(item.amount)?.requiredRoles[item.currentLevel - 1]}</div>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => { setSelectedItem(item.id); setViewMode('detail'); }} className="font-medium text-green-600 hover:underline">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
  
  const FilterPill = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
        {children}
    </button>
  )

  const renderDetail = () => {
    const item = approvalItems.find(i => i.id === selectedItem)
    if (!item) return null

    return (
      <div className="p-6 bg-gray-50">
        <button onClick={() => setViewMode('list')} className="text-green-600 hover:text-green-800 mb-4">&larr; Back to list</button>
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{item.ticketNumber}</h2>
                    <p className="text-gray-500">{item.operatorName} - {item.description}</p>
                </div>
                <div className={`p-2 rounded-lg text-sm font-semibold ${getStatusInfo(item.status).bg} ${getStatusInfo(item.status).color}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
            </div>
            {/* Main content grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Key Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <InfoItem icon={<DollarSign/>} label="Amount" value={`$${item.amount.toLocaleString()}`} />
                        <InfoItem icon={<Calendar/>} label="Submitted Date" value={new Date(item.submittedDate).toLocaleDateString()} />
                        <InfoItem icon={<UserCheck/>} label="Submitted By" value={item.submittedBy} />
                        <InfoItem icon={<Clock/>} label="Due Date" value={new Date(item.dueDate).toLocaleDateString()} />
                        <InfoItem icon={<Drill/>} label="Category" value={item.category} />
                        <InfoItem icon={<FileText/>} label="AFE Number" value={item.afeNumber || 'N/A'} />
                    </div>
                    {/* Approval Timeline */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Approval History</h3>
                        <div className="border-l-2 border-gray-200 pl-4 space-y-6">
                            {item.approvalHistory.map(h => (
                                <div key={h.id} className="relative">
                                    <div className="absolute -left-[2.8rem] top-1.5 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                                    <p className="font-semibold text-gray-800">{h.action.charAt(0).toUpperCase() + h.action.slice(1)} by {h.approver} ({h.role})</p>
                                    <p className="text-sm text-gray-500">{new Date(h.timestamp).toLocaleString()}</p>
                                    {h.comments && <p className="text-sm bg-gray-100 p-2 mt-2 rounded-md">"{h.comments}"</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-3">Actions</h3>
                        {canApprove(item) ? (
                            <div className="space-y-2">
                                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Approve</button>
                                <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Reject</button>
                                <button onClick={() => escalateItem(item.id)} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Escalate</button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">No actions available for you at this stage.</p>
                        )}
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Attachments ({item.attachments.length})</h3>
                      <div className="space-y-2">
                          {item.attachments.map(att => (
                              <a key={att} href="#" className="flex items-center text-sm text-green-600 hover:underline">
                                  <Download className="w-4 h-4 mr-2"/> {att}
                              </a>
                          ))}
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  }
  
  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-start">
        <div className="text-gray-400 mt-0.5">{icon}</div>
        <div className="ml-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    </div>
  )


  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="p-4 sm:p-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Approval Workflow</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and approve field tickets efficiently.</p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button onClick={() => setViewMode('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${viewMode === 'dashboard' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>Dashboard</button>
            <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>List View</button>
            {selectedItems.length > 0 && (
                 <button onClick={() => setShowBatchModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                    Batch Actions ({selectedItems.length})
                </button>
            )}
          </div>
        </header>

        <div>
          {viewMode === 'dashboard' && renderDashboard()}
          {viewMode === 'list' && renderList()}
          {viewMode === 'detail' && renderDetail()}
        </div>
      </div>
    </div>
  )
}

export default ApprovalWorkflowSystem 