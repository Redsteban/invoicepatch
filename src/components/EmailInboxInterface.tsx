'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail,
  MailOpen,
  Paperclip,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  RefreshCw,
  Archive,
  FileText,
  Eye,
  Star,
  Forward,
  Reply
} from 'lucide-react'

interface EmailAttachment {
  id: string
  name: string
  size: string
  type: 'pdf' | 'image' | 'document'
  isInvoice?: boolean
}

interface EmailMessage {
  id: string
  sender: string
  senderEmail: string
  subject: string
  preview: string
  content: string
  timestamp: Date
  status: 'new' | 'processed' | 'failed' | 'pending'
  priority: 'high' | 'normal' | 'low'
  attachments: EmailAttachment[]
  hasInvoice: boolean
  invoiceAmount?: number
  projectCode?: string
  contractorType: 'drilling' | 'hauling' | 'welding' | 'general'
  read: boolean
}

const generateMockEmails = (): EmailMessage[] => {
  const contractors = [
    { name: 'Northern Pipeline Services', email: 'billing@northernpipeline.ca', type: 'drilling' as const },
    { name: 'Calgary Heavy Haul', email: 'invoices@calgaryheavy.com', type: 'hauling' as const },
    { name: 'ProWeld Solutions', email: 'accounting@proweldsolutions.ca', type: 'welding' as const },
    { name: 'Alberta Construction Co', email: 'billing@albertaconstruction.ca', type: 'general' as const },
    { name: 'Precision Drilling Ltd', email: 'finance@precisiondrilling.com', type: 'drilling' as const },
    { name: 'Mountain Transport', email: 'billing@mountaintransport.ca', type: 'hauling' as const },
    { name: 'Elite Welding Services', email: 'invoices@elitewelding.ca', type: 'welding' as const },
    { name: 'Fraser Valley Construction', email: 'accounts@fraservalley.ca', type: 'general' as const }
  ]

  const statuses: EmailMessage['status'][] = ['new', 'processed', 'failed', 'pending']
  const priorities: EmailMessage['priority'][] = ['high', 'normal', 'low']

  return Array.from({ length: 20 }, (_, i) => {
    const contractor = contractors[i % contractors.length]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const hasInvoice = Math.random() > 0.25
    const invoiceAmount = hasInvoice ? Math.floor(Math.random() * 50000) + 1000 : undefined
    const projectCode = `PRJ-${Math.floor(Math.random() * 9000) + 1000}`
    
    const attachments: EmailAttachment[] = hasInvoice ? [
      {
        id: `att-${i}-1`,
        name: `Invoice_${projectCode}_${new Date().getFullYear()}.pdf`,
        size: `${Math.floor(Math.random() * 500) + 100}KB`,
        type: 'pdf',
        isInvoice: true
      },
      ...(Math.random() > 0.7 ? [{
        id: `att-${i}-2`,
        name: 'Work_Order_Details.pdf',
        size: `${Math.floor(Math.random() * 200) + 50}KB`,
        type: 'pdf' as const,
        isInvoice: false
      }] : [])
    ] : []

    const daysAgo = Math.floor(Math.random() * 14)
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    return {
      id: `email-${i}`,
      sender: contractor.name,
      senderEmail: contractor.email,
      subject: hasInvoice 
        ? `Invoice ${projectCode} - ${contractor.name} Services`
        : `Project Update - ${projectCode}`,
      preview: hasInvoice 
        ? `Please find attached our invoice for project ${projectCode}. Total amount: $${invoiceAmount?.toLocaleString()}. Payment terms: Net 30 days.`
        : `Project ${projectCode} status update and documentation.`,
      content: hasInvoice 
        ? `Dear Project Manager,\n\nPlease find attached our invoice for the work completed on project ${projectCode}.\n\nProject Details:\n- Project Code: ${projectCode}\n- Service Type: ${contractor.type.charAt(0).toUpperCase() + contractor.type.slice(1)} Services\n- Total Amount: $${invoiceAmount?.toLocaleString()}\n- Payment Terms: Net 30 days\n\nAll work has been completed according to specifications and safety standards.\n\nThank you for your business.\n\nBest regards,\n${contractor.name}\nAccounting Department`
        : `Dear Project Manager,\n\nThis email contains project updates and documentation for ${projectCode}.\n\nPlease review the attached documents at your convenience.\n\nBest regards,\n${contractor.name}`,
      timestamp,
      status,
      priority,
      attachments,
      hasInvoice,
      invoiceAmount,
      projectCode,
      contractorType: contractor.type,
      read: Math.random() > 0.4
    }
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

interface EmailInboxInterfaceProps {
  onImportSelected?: (emails: EmailMessage[]) => void
}

const EmailInboxInterface: React.FC<EmailInboxInterfaceProps> = ({ onImportSelected }) => {
  const [emails] = useState<EmailMessage[]>(generateMockEmails())
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [contractorFilter, setContractorFilter] = useState<string>('all')
  const [showOnlyInvoices, setShowOnlyInvoices] = useState(true)

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      // Search filter
      if (searchQuery && !email.sender.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !email.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !email.senderEmail.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Status filter
      if (statusFilter !== 'all' && email.status !== statusFilter) {
        return false
      }

      // Contractor type filter
      if (contractorFilter !== 'all' && email.contractorType !== contractorFilter) {
        return false
      }

      // Invoice filter
      if (showOnlyInvoices && !email.hasInvoice) {
        return false
      }

      // Date range filter
      if (dateRange.start || dateRange.end) {
        const emailDate = email.timestamp
        if (dateRange.start && emailDate < new Date(dateRange.start)) return false
        if (dateRange.end && emailDate > new Date(dateRange.end + 'T23:59:59')) return false
      }

      return true
    })
  }, [emails, searchQuery, statusFilter, contractorFilter, showOnlyInvoices, dateRange])

  const getStatusIcon = (status: EmailMessage['status']) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4 text-blue-500" />
      case 'processed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'pending': return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
    }
  }

  const getStatusColor = (status: EmailMessage['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'processed': return 'bg-green-50 text-green-700 border-green-200'
      case 'failed': return 'bg-red-50 text-red-700 border-red-200'
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  }

  const getPriorityColor = (priority: EmailMessage['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'normal': return 'border-l-gray-300'
      case 'low': return 'border-l-green-500'
    }
  }

  const handleSelectAll = () => {
    if (selectedEmails.size === filteredEmails.length) {
      setSelectedEmails(new Set())
    } else {
      setSelectedEmails(new Set(filteredEmails.map(e => e.id)))
    }
  }

  const handleSelectEmail = (emailId: string) => {
    const newSelected = new Set(selectedEmails)
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId)
    } else {
      newSelected.add(emailId)
    }
    setSelectedEmails(newSelected)
  }

  const handleImportSelected = () => {
    const selectedEmailsList = filteredEmails.filter(email => selectedEmails.has(email.id))
    onImportSelected?.(selectedEmailsList)
    
    // Reset selection after import
    setSelectedEmails(new Set())
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const selectedCount = selectedEmails.size
  const invoiceCount = filteredEmails.filter(e => e.hasInvoice && selectedEmails.has(e.id)).length

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6 text-gray-700" />
            <h1 className="text-xl font-bold text-gray-900">Invoice Email Inbox</h1>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {filteredEmails.filter(e => e.hasInvoice).length} invoices
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Archive className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="processed">Processed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Contractor Type Filter */}
          <select
            value={contractorFilter}
            onChange={(e) => setContractorFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All Contractors</option>
            <option value="drilling">Drilling</option>
            <option value="hauling">Hauling</option>
            <option value="welding">Welding</option>
            <option value="general">General</option>
          </select>

          {/* Date Range */}
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm w-full"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm w-full"
            />
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOnlyInvoices}
                onChange={(e) => setShowOnlyInvoices(e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">Show only emails with invoices</span>
            </label>
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedCount} selected ({invoiceCount} with invoices)
              </span>
              <button
                onClick={handleImportSelected}
                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Import Selected ({invoiceCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Email List and Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
          {/* List Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedEmails.size === filteredEmails.length && filteredEmails.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm font-medium text-gray-700">
                {filteredEmails.length} emails
              </span>
              {selectedCount > 0 && (
                <span className="text-sm text-blue-600">
                  ({selectedCount} selected)
                </span>
              )}
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filteredEmails.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }}
                  className={`
                    p-4 border-b border-gray-100 cursor-pointer transition-colors border-l-4
                    ${selectedEmail?.id === email.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    ${!email.read ? 'bg-blue-25' : ''}
                    ${getPriorityColor(email.priority)}
                  `}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedEmails.has(email.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleSelectEmail(email.id)
                      }}
                      className="mt-1 rounded border-gray-300 text-black focus:ring-black"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {!email.read ? <MailOpen className="w-4 h-4 text-blue-600" /> : <Mail className="w-4 h-4 text-gray-400" />}
                          <span className={`text-sm font-medium truncate ${!email.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {email.sender}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {email.hasInvoice && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Invoice
                            </span>
                          )}
                          {getStatusIcon(email.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm truncate ${!email.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {email.subject}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(email.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 truncate mb-2">
                        {email.preview}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {email.attachments.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Paperclip className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {email.invoiceAmount && (
                            <span className="text-xs font-medium text-green-600">
                              ${email.invoiceAmount.toLocaleString()}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(email.status)}`}>
                            {email.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Email Preview */}
        <div className="w-1/2 bg-white overflow-hidden flex flex-col">
          {selectedEmail ? (
            <>
              {/* Preview Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span><strong>From:</strong> {selectedEmail.sender}</span>
                      <span><strong>Email:</strong> {selectedEmail.senderEmail}</span>
                      <span><strong>Date:</strong> {selectedEmail.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Reply className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Forward className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Star className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(selectedEmail.status)}`}>
                    {selectedEmail.status.charAt(0).toUpperCase() + selectedEmail.status.slice(1)}
                  </span>
                  {selectedEmail.projectCode && (
                    <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {selectedEmail.projectCode}
                    </span>
                  )}
                  {selectedEmail.invoiceAmount && (
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      ${selectedEmail.invoiceAmount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Email Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {selectedEmail.content}
                  </div>
                </div>

                {/* Attachments */}
                {selectedEmail.attachments.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Attachments ({selectedEmail.attachments.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedEmail.attachments.map((attachment) => (
                        <motion.div
                          key={attachment.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {attachment.name}
                                {attachment.isInvoice && (
                                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Invoice
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">{attachment.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select an email to preview
                </h3>
                <p className="text-gray-600">
                  Choose an email from the list to view its content and attachments
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailInboxInterface 