'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Download,
  Settings,
  Filter,
  Search,
  ArrowUpDown,
  Check,
  X,
  RefreshCw,
  FileText,
  DollarSign,
  Calendar,
  Building,
  ChevronDown,
  ChevronUp,
  Edit,
  Save,
  AlertCircle,
  Zap,
  Target,
  CheckSquare,
  Square
} from 'lucide-react'

type MatchStatus = 'perfect' | 'partial' | 'none' | 'discrepancy'
type DiscrepancyType = 'amount' | 'date' | 'description' | 'contractor' | 'reference'

interface ContractorInvoice {
  id: string
  invoiceNumber: string
  contractorName: string
  contractorEmail: string
  amount: number
  date: string
  dueDate: string
  description: string
  projectCode: string
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  attachmentUrl?: string
}

interface BillingSystemEntry {
  id: string
  referenceNumber: string
  vendorName: string
  amount: number
  date: string
  description: string
  projectCode: string
  status: string
  approvedBy?: string
  system: string
}

interface MatchResult {
  id: string
  contractorInvoice: ContractorInvoice
  billingEntry?: BillingSystemEntry
  suggestedMatches: Array<{
    entry: BillingSystemEntry
    confidence: number
    reasons: string[]
  }>
  status: MatchStatus
  confidence: number
  discrepancies: Array<{
    type: DiscrepancyType
    field: string
    contractorValue: any
    billingValue: any
    severity: 'low' | 'medium' | 'high'
  }>
  isSelected: boolean
  lastReviewed?: Date
  reviewedBy?: string
  notes?: string
}

interface MatchCriteria {
  amountTolerance: number
  dateTolerance: number
  exactContractorMatch: boolean
  exactProjectCodeMatch: boolean
  descriptionSimilarityThreshold: number
  minimumConfidenceScore: number
}

const defaultCriteria: MatchCriteria = {
  amountTolerance: 0.05, // 5%
  dateTolerance: 7, // 7 days
  exactContractorMatch: false,
  exactProjectCodeMatch: true,
  descriptionSimilarityThreshold: 0.7,
  minimumConfidenceScore: 0.6
}

const generateMockData = () => {
  const contractors = [
    'Northern Pipeline Services Ltd.',
    'Alberta Heavy Haul Inc.',
    'ProWeld Solutions Corp.',
    'Elite Welding Services',
    'Mountain Transport Ltd.',
    'Fraser Valley Construction'
  ]

  const projectCodes = ['PIPE-2024-001', 'INFRA-2024-003', 'MAINT-2024-007', 'CONSTR-2024-012']
  
  const contractorInvoices: ContractorInvoice[] = Array.from({ length: 15 }, (_, i) => {
    const contractor = contractors[i % contractors.length]
    const projectCode = projectCodes[Math.floor(Math.random() * projectCodes.length)]
    const amount = Math.floor(Math.random() * 50000) + 5000
    const baseDate = new Date(2024, 2, Math.floor(Math.random() * 28) + 1)
    
    return {
      id: `ci-${i + 1}`,
      invoiceNumber: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
      contractorName: contractor,
      contractorEmail: contractor.toLowerCase().replace(/[^a-z]/g, '') + '@company.com',
      amount,
      date: baseDate.toISOString().split('T')[0],
      dueDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `${projectCode} - Professional services and materials`,
      projectCode,
      lineItems: [
        {
          description: 'Professional services',
          quantity: Math.floor(Math.random() * 40) + 10,
          unitPrice: Math.floor(Math.random() * 200) + 100,
          total: amount * 0.7
        },
        {
          description: 'Materials and equipment',
          quantity: 1,
          unitPrice: amount * 0.3,
          total: amount * 0.3
        }
      ]
    }
  })

  const billingEntries: BillingSystemEntry[] = Array.from({ length: 20 }, (_, i) => {
    const contractor = contractors[i % contractors.length]
    const projectCode = projectCodes[Math.floor(Math.random() * projectCodes.length)]
    const amount = Math.floor(Math.random() * 50000) + 5000
    const baseDate = new Date(2024, 2, Math.floor(Math.random() * 28) + 1)
    
    return {
      id: `be-${i + 1}`,
      referenceNumber: `REF-${Math.floor(Math.random() * 90000) + 10000}`,
      vendorName: contractor + (Math.random() > 0.8 ? ' Inc.' : ''),
      amount: amount + (Math.random() > 0.7 ? Math.floor(Math.random() * 1000) - 500 : 0),
      date: new Date(baseDate.getTime() + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000 : 0)).toISOString().split('T')[0],
      description: `${projectCode} services and deliverables`,
      projectCode,
      status: ['pending', 'approved', 'processing'][Math.floor(Math.random() * 3)],
      system: ['QuickBooks', 'SAP', 'Sage'][Math.floor(Math.random() * 3)]
    }
  })

  return { contractorInvoices, billingEntries }
}

const calculateMatch = (
  invoice: ContractorInvoice, 
  entry: BillingSystemEntry, 
  criteria: MatchCriteria
): { confidence: number; reasons: string[]; discrepancies: MatchResult['discrepancies'] } => {
  const reasons: string[] = []
  const discrepancies: MatchResult['discrepancies'] = []
  let confidence = 0

  // Amount matching
  const amountDiff = Math.abs(invoice.amount - entry.amount) / invoice.amount
  if (amountDiff <= criteria.amountTolerance) {
    confidence += 30
    reasons.push(`Amount match within ${(criteria.amountTolerance * 100).toFixed(1)}% tolerance`)
  } else {
    discrepancies.push({
      type: 'amount',
      field: 'amount',
      contractorValue: invoice.amount,
      billingValue: entry.amount,
      severity: amountDiff > 0.2 ? 'high' : amountDiff > 0.1 ? 'medium' : 'low'
    })
  }

  // Date matching
  const dateDiff = Math.abs(new Date(invoice.date).getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24)
  if (dateDiff <= criteria.dateTolerance) {
    confidence += 25
    reasons.push(`Date within ${criteria.dateTolerance} days`)
  } else {
    discrepancies.push({
      type: 'date',
      field: 'date',
      contractorValue: invoice.date,
      billingValue: entry.date,
      severity: dateDiff > 30 ? 'high' : dateDiff > 14 ? 'medium' : 'low'
    })
  }

  // Contractor name matching
  const contractorSimilarity = calculateStringSimilarity(
    invoice.contractorName.toLowerCase(),
    entry.vendorName.toLowerCase()
  )
  if (contractorSimilarity > 0.8) {
    confidence += 25
    reasons.push('Contractor name strong match')
  } else if (contractorSimilarity > 0.6) {
    confidence += 15
    reasons.push('Contractor name partial match')
    discrepancies.push({
      type: 'contractor',
      field: 'contractorName',
      contractorValue: invoice.contractorName,
      billingValue: entry.vendorName,
      severity: 'medium'
    })
  } else {
    discrepancies.push({
      type: 'contractor',
      field: 'contractorName',
      contractorValue: invoice.contractorName,
      billingValue: entry.vendorName,
      severity: 'high'
    })
  }

  // Project code matching
  if (invoice.projectCode === entry.projectCode) {
    confidence += 20
    reasons.push('Project code exact match')
  } else {
    discrepancies.push({
      type: 'reference',
      field: 'projectCode',
      contractorValue: invoice.projectCode,
      billingValue: entry.projectCode,
      severity: 'high'
    })
  }

  return { confidence: Math.min(confidence, 100), reasons, discrepancies }
}

const calculateStringSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = []
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[str2.length][str1.length]
}

const InvoiceMatchingSystem: React.FC = () => {
  const [criteria, setCriteria] = useState<MatchCriteria>(defaultCriteria)
  const [showCriteria, setShowCriteria] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('confidence')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set())
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)

  const { contractorInvoices, billingEntries } = useMemo(() => generateMockData(), [])

  const matchResults = useMemo(() => {
    return contractorInvoices.map(invoice => {
      const suggestedMatches = billingEntries
        .map(entry => {
          const { confidence, reasons } = calculateMatch(invoice, entry, criteria)
          return { entry, confidence, reasons }
        })
        .filter(match => match.confidence >= criteria.minimumConfidenceScore * 100)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)

      const bestMatch = suggestedMatches[0]
      let status: MatchStatus = 'none'
      let matchedEntry: BillingSystemEntry | undefined
      let discrepancies: MatchResult['discrepancies'] = []

      if (bestMatch) {
        if (bestMatch.confidence >= 95) {
          status = 'perfect'
        } else if (bestMatch.confidence >= 80) {
          status = 'partial'
        } else if (bestMatch.confidence >= 60) {
          status = 'partial'
        }

        const matchAnalysis = calculateMatch(invoice, bestMatch.entry, criteria)
        discrepancies = matchAnalysis.discrepancies
        
        if (discrepancies.some(d => d.severity === 'high')) {
          status = 'discrepancy'
        }

        matchedEntry = bestMatch.entry
      }

      return {
        id: invoice.id,
        contractorInvoice: invoice,
        billingEntry: matchedEntry,
        suggestedMatches,
        status,
        confidence: bestMatch?.confidence || 0,
        discrepancies,
        isSelected: false
      } as MatchResult
    })
  }, [contractorInvoices, billingEntries, criteria])

  const filteredResults = useMemo(() => {
    let filtered = matchResults.filter(result => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!result.contractorInvoice.contractorName.toLowerCase().includes(query) &&
            !result.contractorInvoice.invoiceNumber.toLowerCase().includes(query) &&
            !result.contractorInvoice.projectCode.toLowerCase().includes(query)) {
          return false
        }
      }
      
      if (statusFilter !== 'all' && result.status !== statusFilter) {
        return false
      }
      
      return true
    })

    // Sort results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'confidence':
          aValue = a.confidence
          bValue = b.confidence
          break
        case 'amount':
          aValue = a.contractorInvoice.amount
          bValue = b.contractorInvoice.amount
          break
        case 'date':
          aValue = new Date(a.contractorInvoice.date)
          bValue = new Date(b.contractorInvoice.date)
          break
        case 'contractor':
          aValue = a.contractorInvoice.contractorName
          bValue = b.contractorInvoice.contractorName
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [matchResults, searchQuery, statusFilter, sortBy, sortDirection])

  const getStatusIcon = (status: MatchStatus) => {
    switch (status) {
      case 'perfect':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'discrepancy':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'none':
        return <XCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case 'perfect':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'partial':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'discrepancy':
        return 'bg-red-50 text-red-800 border-red-200'
      case 'none':
        return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  const getDiscrepancyColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'text-yellow-600 bg-yellow-50'
      case 'medium':
        return 'text-orange-600 bg-orange-50'
      case 'high':
        return 'text-red-600 bg-red-50'
    }
  }

  const handleSelectAll = () => {
    if (selectedMatches.size === filteredResults.length) {
      setSelectedMatches(new Set())
    } else {
      setSelectedMatches(new Set(filteredResults.map(r => r.id)))
    }
  }

  const handleSelectMatch = (matchId: string) => {
    const newSelected = new Set(selectedMatches)
    if (newSelected.has(matchId)) {
      newSelected.delete(matchId)
    } else {
      newSelected.add(matchId)
    }
    setSelectedMatches(newSelected)
  }

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    setIsProcessing(true)
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSelectedMatches(new Set())
    setIsProcessing(false)
  }

  const toggleRowExpansion = (matchId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(matchId)) {
      newExpanded.delete(matchId)
    } else {
      newExpanded.add(matchId)
    }
    setExpandedRows(newExpanded)
  }

  const exportResults = (format: 'csv' | 'excel' | 'pdf') => {
    // Simulate export
    console.log(`Exporting ${filteredResults.length} results to ${format.toUpperCase()}`)
  }

  const statusCounts = useMemo(() => {
    return matchResults.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1
      return acc
    }, {} as Record<MatchStatus, number>)
  }, [matchResults])

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-gray-700" />
            <h1 className="text-xl font-bold text-gray-900">Invoice Matching System</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCriteria(!showCriteria)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Match Criteria</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => exportResults('csv')}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                CSV
              </button>
              <button
                onClick={() => exportResults('excel')}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                Excel
              </button>
              <button
                onClick={() => exportResults('pdf')}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-800">Perfect Matches</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {statusCounts.perfect || 0}
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-800">Partial Matches</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-1">
              {statusCounts.partial || 0}
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-800">Discrepancies</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-1">
              {statusCounts.discrepancy || 0}
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-800">No Matches</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {statusCounts.none || 0}
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
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
              <option value="perfect">Perfect Match</option>
              <option value="partial">Partial Match</option>
              <option value="discrepancy">Discrepancy</option>
              <option value="none">No Match</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="confidence">Confidence</option>
              <option value="amount">Amount</option>
              <option value="date">Date</option>
              <option value="contractor">Contractor</option>
            </select>
            
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
          
          {selectedMatches.size > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedMatches.size} selected
              </span>
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                <span>Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Match Criteria Panel */}
      <AnimatePresence>
        {showCriteria && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-100 border-b border-gray-200 p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Match Criteria Settings</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Tolerance (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={criteria.amountTolerance * 100}
                  onChange={(e) => setCriteria(prev => ({ 
                    ...prev, 
                    amountTolerance: parseFloat(e.target.value) / 100 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Tolerance (days)
                </label>
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={criteria.dateTolerance}
                  onChange={(e) => setCriteria(prev => ({ 
                    ...prev, 
                    dateTolerance: parseInt(e.target.value) 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min. Confidence Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={criteria.minimumConfidenceScore * 100}
                  onChange={(e) => setCriteria(prev => ({ 
                    ...prev, 
                    minimumConfidenceScore: parseFloat(e.target.value) / 100 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="exactContractor"
                  checked={criteria.exactContractorMatch}
                  onChange={(e) => setCriteria(prev => ({ 
                    ...prev, 
                    exactContractorMatch: e.target.checked 
                  }))}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="exactContractor" className="text-sm text-gray-700">
                  Exact contractor name match
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="exactProject"
                  checked={criteria.exactProjectCodeMatch}
                  onChange={(e) => setCriteria(prev => ({ 
                    ...prev, 
                    exactProjectCodeMatch: e.target.checked 
                  }))}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="exactProject" className="text-sm text-gray-700">
                  Exact project code match
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedMatches.size === filteredResults.length && filteredResults.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contractor Invoice
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing System Entry
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discrepancies
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <React.Fragment key={result.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedMatches.has(result.id)}
                        onChange={() => handleSelectMatch(result.id)}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(result.status)}`}>
                          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {result.contractorInvoice.invoiceNumber}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {result.contractorInvoice.contractorName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            ${result.contractorInvoice.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {result.contractorInvoice.date}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      {result.billingEntry ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {result.billingEntry.referenceNumber}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {result.billingEntry.vendorName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              ${result.billingEntry.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {result.billingEntry.date}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No match found</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              result.confidence >= 80 
                                ? 'bg-green-500' 
                                : result.confidence >= 60 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {result.confidence.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      {result.discrepancies.length > 0 ? (
                        <div className="space-y-1">
                          {result.discrepancies.slice(0, 2).map((discrepancy, index) => (
                            <span
                              key={index}
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDiscrepancyColor(discrepancy.severity)}`}
                            >
                              {discrepancy.type}
                            </span>
                          ))}
                          {result.discrepancies.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{result.discrepancies.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleRowExpansion(result.id)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          {expandedRows.has(result.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <AnimatePresence>
                    {expandedRows.has(result.id) && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={7} className="px-4 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* Suggested Matches */}
                            {result.suggestedMatches.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Suggested Matches
                                </h4>
                                <div className="space-y-2">
                                  {result.suggestedMatches.map((suggestion, index) => (
                                    <div
                                      key={index}
                                      className="p-3 bg-white border border-gray-200 rounded-lg"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">
                                          {suggestion.entry.referenceNumber} - {suggestion.entry.vendorName}
                                        </span>
                                        <span className="text-sm font-medium text-blue-600">
                                          {suggestion.confidence.toFixed(0)}% match
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        <p>${suggestion.entry.amount.toLocaleString()} • {suggestion.entry.date}</p>
                                        <p className="mt-1">{suggestion.reasons.join(', ')}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Detailed Discrepancies */}
                            {result.discrepancies.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Detailed Discrepancies
                                </h4>
                                <div className="space-y-2">
                                  {result.discrepancies.map((discrepancy, index) => (
                                    <div
                                      key={index}
                                      className="p-3 bg-white border border-gray-200 rounded-lg"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-900 capitalize">
                                          {discrepancy.field}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDiscrepancyColor(discrepancy.severity)}`}>
                                          {discrepancy.severity}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        <p><strong>Contractor:</strong> {discrepancy.contractorValue}</p>
                                        <p><strong>Billing System:</strong> {discrepancy.billingValue}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No matching results found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoiceMatchingSystem 