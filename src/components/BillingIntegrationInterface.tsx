'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Power,
  Download,
  ArrowRight,
  Settings,
  Calendar,
  DollarSign,
  Users,
  Building,
  Zap,
  WifiOff,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Save,
  X
} from 'lucide-react'

interface BillingSystem {
  id: string
  name: string
  type: 'accounting' | 'erp' | 'project'
  icon: string
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync: Date
  version: string
  endpoint: string
  recordCount: number
  errorMessage?: string
}

interface Job {
  id: string
  code: string
  name: string
  client: string
  status: 'active' | 'completed' | 'on-hold'
  startDate: string
  endDate?: string
  budget: number
  spent: number
  contractors: string[]
  invoiceCount: number
  lastInvoice?: Date
  billingSystemId: string
}

interface DataMapping {
  id: string
  sourceField: string
  targetField: string
  mappingType: 'direct' | 'transformed' | 'calculated'
  transformation?: string
  isValid: boolean
  confidence: number
  samples: string[]
}

interface SyncActivity {
  id: string
  timestamp: Date
  action: 'pull' | 'push' | 'sync' | 'mapping'
  system: string
  status: 'success' | 'error' | 'warning'
  recordsProcessed: number
  message: string
}

const mockBillingSystems: BillingSystem[] = [
  {
    id: 'qb',
    name: 'QuickBooks Online',
    type: 'accounting',
    icon: '📊',
    status: 'connected',
    lastSync: new Date(Date.now() - 15 * 60 * 1000),
    version: '2024.1',
    endpoint: 'https://api.quickbooks.com',
    recordCount: 1247
  },
  {
    id: 'sap',
    name: 'SAP Business One',
    type: 'erp',
    icon: '🏢',
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    version: '10.0',
    endpoint: 'https://sap.company.com/api',
    recordCount: 3891
  },
  {
    id: 'sage',
    name: 'Sage Intacct',
    type: 'accounting',
    icon: '📈',
    status: 'error',
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
    version: '2024.2',
    endpoint: 'https://api.intacct.com',
    recordCount: 0,
    errorMessage: 'Authentication failed - token expired'
  },
  {
    id: 'procore',
    name: 'Procore',
    type: 'project',
    icon: '🏗️',
    status: 'syncing',
    lastSync: new Date(Date.now() - 5 * 60 * 1000),
    version: '3.8',
    endpoint: 'https://api.procore.com',
    recordCount: 567
  }
]

const mockJobs: Job[] = [
  {
    id: 'job-1',
    code: 'PIPE-2024-001',
    name: 'Alberta Pipeline Extension Phase 1',
    client: 'TransCanada Corp',
    status: 'active',
    startDate: '2024-01-15',
    budget: 2850000,
    spent: 1420000,
    contractors: ['Northern Pipeline Services', 'Alberta Heavy Haul', 'ProWeld Solutions'],
    invoiceCount: 47,
    lastInvoice: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    billingSystemId: 'qb'
  },
  {
    id: 'job-2',
    code: 'INFRA-2024-003',
    name: 'Calgary Infrastructure Upgrade',
    client: 'City of Calgary',
    status: 'active',
    startDate: '2024-02-01',
    budget: 1750000,
    spent: 892000,
    contractors: ['Elite Welding Services', 'Mountain Transport'],
    invoiceCount: 23,
    lastInvoice: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    billingSystemId: 'sap'
  },
  {
    id: 'job-3',
    code: 'MAINT-2024-007',
    name: 'Routine Maintenance Q1',
    client: 'Enbridge Inc',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    budget: 450000,
    spent: 437500,
    contractors: ['Northern Pipeline Services'],
    invoiceCount: 12,
    lastInvoice: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    billingSystemId: 'procore'
  }
]

const mockDataMappings: DataMapping[] = [
  {
    id: 'map-1',
    sourceField: 'customer_name',
    targetField: 'contractor_name',
    mappingType: 'direct',
    isValid: true,
    confidence: 98,
    samples: ['Northern Pipeline Services Ltd.', 'Alberta Heavy Haul Inc.']
  },
  {
    id: 'map-2',
    sourceField: 'invoice_total',
    targetField: 'amount',
    mappingType: 'direct',
    isValid: true,
    confidence: 100,
    samples: ['$15,750.00', '$23,400.50']
  },
  {
    id: 'map-3',
    sourceField: 'job_reference',
    targetField: 'project_code',
    mappingType: 'transformed',
    transformation: 'extract_project_code',
    isValid: true,
    confidence: 95,
    samples: ['PIPE-2024-001-Phase1', 'INFRA-2024-003-Upgrade']
  },
  {
    id: 'map-4',
    sourceField: 'line_items',
    targetField: 'description',
    mappingType: 'calculated',
    transformation: 'concatenate_descriptions',
    isValid: false,
    confidence: 67,
    samples: ['Pipeline installation, equipment rental', 'Welding services, material transport']
  }
]

const BillingIntegrationInterface: React.FC = () => {
  const [systems, setSystems] = useState<BillingSystem[]>(mockBillingSystems)
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [selectedSystem, setSelectedSystem] = useState<string>('qb')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [autoSync, setAutoSync] = useState(true)
  const [isPulling, setIsPulling] = useState(false)
  const [showMapping, setShowMapping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [syncActivities, setSyncActivities] = useState<SyncActivity[]>([])
  const [expandedMappings, setExpandedMappings] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Simulate auto-sync updates
    if (autoSync) {
      const interval = setInterval(() => {
        setSystems(prev => prev.map(system => ({
          ...system,
          lastSync: system.status === 'connected' ? new Date() : system.lastSync
        })))
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoSync])

  const getStatusIcon = (status: BillingSystem['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'disconnected':
        return <WifiOff className="w-5 h-5 text-gray-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: BillingSystem['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'disconnected':
        return 'bg-gray-50 border-gray-200 text-gray-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'syncing':
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const handleConnect = (systemId: string) => {
    setSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, status: 'syncing' }
        : system
    ))

    // Simulate connection process
    setTimeout(() => {
      setSystems(prev => prev.map(system => 
        system.id === systemId 
          ? { 
              ...system, 
              status: 'connected', 
              lastSync: new Date(),
              errorMessage: undefined
            }
          : system
      ))

      addSyncActivity({
        action: 'sync',
        system: systems.find(s => s.id === systemId)?.name || '',
        status: 'success',
        recordsProcessed: Math.floor(Math.random() * 1000) + 100,
        message: 'Successfully connected and synced initial data'
      })
    }, 3000)
  }

  const handleDisconnect = (systemId: string) => {
    setSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, status: 'disconnected' }
        : system
    ))
  }

  const handlePullInvoices = async () => {
    if (!selectedSystem || isPulling) return

    setIsPulling(true)
    const system = systems.find(s => s.id === selectedSystem)

    addSyncActivity({
      action: 'pull',
      system: system?.name || '',
      status: 'success',
      recordsProcessed: 0,
      message: 'Starting invoice pull...'
    })

    // Simulate pulling process
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (i === 100) {
        const recordCount = Math.floor(Math.random() * 50) + 10
        addSyncActivity({
          action: 'pull',
          system: system?.name || '',
          status: 'success',
          recordsProcessed: recordCount,
          message: `Successfully pulled ${recordCount} invoices`
        })
      }
    }

    setIsPulling(false)
  }

  const addSyncActivity = (activity: Omit<SyncActivity, 'id' | 'timestamp'>) => {
    const newActivity: SyncActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }
    setSyncActivities(prev => [newActivity, ...prev.slice(0, 9)])
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const filteredJobs = jobs.filter(job => {
    if (searchQuery && !job.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter !== 'all' && job.status !== statusFilter) {
      return false
    }
    return true
  })

  const toggleMappingExpansion = (mappingId: string) => {
    setExpandedMappings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(mappingId)) {
        newSet.delete(mappingId)
      } else {
        newSet.add(mappingId)
      }
      return newSet
    })
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-gray-700" />
            <h1 className="text-xl font-bold text-gray-900">Billing System Integration</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">Auto-sync enabled</span>
            </label>
            
            <button
              onClick={() => setShowMapping(!showMapping)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showMapping 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 mr-2 inline" />
              Data Mapping
            </button>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systems.map((system) => (
            <motion.div
              key={system.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedSystem === system.id 
                  ? 'border-black bg-gray-50' 
                  : `border-gray-200 hover:border-gray-300 ${getStatusColor(system.status)}`
              }`}
              onClick={() => setSelectedSystem(system.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{system.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{system.name}</h3>
                    <p className="text-xs text-gray-600">{system.type}</p>
                  </div>
                </div>
                {getStatusIcon(system.status)}
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span>{formatTimeAgo(system.lastSync)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Records:</span>
                  <span>{system.recordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span>{system.version}</span>
                </div>
              </div>

              {system.errorMessage && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {system.errorMessage}
                </div>
              )}

              <div className="mt-3 flex space-x-2">
                {system.status === 'connected' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDisconnect(system.id)
                    }}
                    className="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleConnect(system.id)
                    }}
                    className="flex-1 px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                  >
                    Connect
                  </button>
                )}
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors">
                  <Settings className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {showMapping ? (
          /* Data Mapping Interface */
          <div className="flex-1 bg-white m-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Data Mapping Configuration</h2>
              <p className="text-sm text-gray-600">Configure how data fields are mapped between systems</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {mockDataMappings.map((mapping) => (
                  <motion.div
                    key={mapping.id}
                    className="border border-gray-200 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono">
                            {mapping.sourceField}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-mono">
                            {mapping.targetField}
                          </div>
                        </div>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mapping.mappingType === 'direct' 
                            ? 'bg-green-100 text-green-800'
                            : mapping.mappingType === 'transformed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {mapping.mappingType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {mapping.isValid ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm text-gray-600">
                            {mapping.confidence}% confidence
                          </span>
                        </div>
                        
                        <button
                          onClick={() => toggleMappingExpansion(mapping.id)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          {expandedMappings.has(mapping.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedMappings.has(mapping.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          {mapping.transformation && (
                            <div className="mb-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Transformation Rule
                              </label>
                              <code className="block p-2 bg-gray-100 rounded text-sm font-mono">
                                {mapping.transformation}
                              </code>
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sample Data
                            </label>
                            <div className="space-y-1">
                              {mapping.samples.map((sample, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <div className="px-2 py-1 bg-gray-50 rounded font-mono flex-1">
                                    {sample}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Jobs and Invoice Pull */}
            <div className="w-2/3 flex flex-col">
              {/* Invoice Pull Section */}
              <div className="bg-white border-b border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Pull</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <select
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {systems.filter(s => s.status === 'connected').map(system => (
                      <option key={system.id} value={system.id}>
                        {system.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />

                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />

                  <button
                    onClick={handlePullInvoices}
                    disabled={isPulling || !selectedSystem}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isPulling || !selectedSystem
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isPulling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Pulling...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Pull Invoices</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Jobs Listing */}
              <div className="flex-1 bg-white p-6 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Active Projects</h2>
                  
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-medium text-gray-900">{job.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{job.code} • {job.client}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${job.spent.toLocaleString()} / ${job.budget.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {Math.round((job.spent / job.budget) * 100)}% spent
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Start Date:</span>
                          <p className="font-medium">{job.startDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Invoices:</span>
                          <p className="font-medium">{job.invoiceCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Invoice:</span>
                          <p className="font-medium">
                            {job.lastInvoice ? formatTimeAgo(job.lastInvoice) : 'None'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-xs text-gray-600">Contractors:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.contractors.map((contractor, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {contractor}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((job.spent / job.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sync Activity Panel */}
            <div className="w-1/3 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Sync Activity</h2>
                <p className="text-sm text-gray-600">Recent integration activities</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {syncActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      className="p-3 border border-gray-200 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {activity.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : activity.status === 'error' ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">{activity.system}</p>
                      <p className="text-xs text-gray-500">{activity.message}</p>
                      
                      {activity.recordsProcessed > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          Records: {activity.recordsProcessed.toLocaleString()}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {syncActivities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No sync activities yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BillingIntegrationInterface 