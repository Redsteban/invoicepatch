'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  X, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Link2, 
  MessageSquare, 
  Save, 
  Download,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

interface UploadedFile {
  id: string
  file: File
  status: 'uploading' | 'processing' | 'ready' | 'error'
  progress: number
  preview?: InvoicePreview
  error?: string
}

interface InvoicePreview {
  contractorName: string
  invoiceNumber: string
  amount: number
  date: string
  description: string
  lineItems: Array<{
    description: string
    quantity: number
    rate: number
    amount: number
  }>
}

interface InvoiceMatch {
  id: string
  contractorInvoice: UploadedFile
  billingInvoice?: UploadedFile
  status: 'unmatched' | 'matched' | 'disputed' | 'approved'
  confidence?: number
  comments: Array<{
    id: string
    text: string
    timestamp: Date
    author: string
  }>
  adjustments: {
    amount?: number
    description?: string
    reason?: string
  }
}

const ManualUploadInterface: React.FC = () => {
  const [contractorFiles, setContractorFiles] = useState<UploadedFile[]>([])
  const [billingFiles, setBillingFiles] = useState<UploadedFile[]>([])
  const [matches, setMatches] = useState<InvoiceMatch[]>([])
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<{ contractor: boolean; billing: boolean }>({
    contractor: false,
    billing: false
  })
  const [viewMode, setViewMode] = useState<'upload' | 'compare' | 'review'>('upload')
  const [newComment, setNewComment] = useState('')
  const [editingAdjustment, setEditingAdjustment] = useState<string | null>(null)

  const contractorDropRef = useRef<HTMLDivElement>(null)
  const billingDropRef = useRef<HTMLDivElement>(null)

  // Mock data generation for file processing
  const generateMockPreview = (fileName: string): InvoicePreview => {
    const contractors = ['ABC Construction', 'XYZ Plumbing', 'Elite Electrical', 'Metro HVAC']
    const contractorName = contractors[Math.floor(Math.random() * contractors.length)]
    
    return {
      contractorName,
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      amount: Math.floor(Math.random() * 50000) + 1000,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `${contractorName} - Project Work`,
      lineItems: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
        description: `Service ${i + 1}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        rate: Math.floor(Math.random() * 200) + 50,
        amount: Math.floor(Math.random() * 2000) + 100
      }))
    }
  }

  // File upload handlers
  const handleFileUpload = useCallback((files: FileList, type: 'contractor' | 'billing') => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0
    }))

    if (type === 'contractor') {
      setContractorFiles(prev => [...prev, ...newFiles])
    } else {
      setBillingFiles(prev => [...prev, ...newFiles])
    }

    // Simulate file processing
    newFiles.forEach(fileData => {
      simulateFileProcessing(fileData, type)
    })
  }, [])

  const simulateFileProcessing = (fileData: UploadedFile, type: 'contractor' | 'billing') => {
    const updateFile = (updates: Partial<UploadedFile>) => {
      const updateFiles = type === 'contractor' ? setContractorFiles : setBillingFiles
      updateFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, ...updates } : f))
    }

    // Simulate upload progress
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        clearInterval(uploadInterval)
        updateFile({ progress: 100, status: 'processing' })
        
        // Simulate processing
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% success rate
            const preview = generateMockPreview(fileData.file.name)
            updateFile({ status: 'ready', preview })
            
            // Auto-create match for contractor files
            if (type === 'contractor') {
              setTimeout(() => {
                setMatches(prev => [...prev, {
                  id: Math.random().toString(36).substr(2, 9),
                  contractorInvoice: { ...fileData, preview },
                  status: 'unmatched',
                  comments: [],
                  adjustments: {}
                }])
              }, 500)
            }
          } else {
            updateFile({ 
              status: 'error', 
              error: 'Failed to process file. Please check file format and try again.' 
            })
          }
        }, 2000)
      } else {
        updateFile({ progress })
      }
    }, 200)
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent, type: 'contractor' | 'billing') => {
    e.preventDefault()
    setIsDragging(prev => ({ ...prev, [type]: true }))
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent, type: 'contractor' | 'billing') => {
    e.preventDefault()
    setIsDragging(prev => ({ ...prev, [type]: false }))
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, type: 'contractor' | 'billing') => {
    e.preventDefault()
    setIsDragging(prev => ({ ...prev, [type]: false }))
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files, type)
    }
  }, [handleFileUpload])

  // File validation
  const isValidFileType = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/csv', 'application/vnd.ms-excel']
    return validTypes.includes(file.type)
  }

  // Manual matching
  const createManualMatch = (contractorFile: UploadedFile, billingFile: UploadedFile) => {
    const existingMatch = matches.find(m => m.contractorInvoice.id === contractorFile.id)
    if (existingMatch) {
      setMatches(prev => prev.map(m => 
        m.id === existingMatch.id 
          ? { ...m, billingInvoice: billingFile, status: 'matched', confidence: 85 }
          : m
      ))
    } else {
      setMatches(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        contractorInvoice: contractorFile,
        billingInvoice: billingFile,
        status: 'matched',
        confidence: 85,
        comments: [],
        adjustments: {}
      }])
    }
  }

  // Comments system
  const addComment = (matchId: string, text: string) => {
    setMatches(prev => prev.map(m => 
      m.id === matchId 
        ? {
            ...m,
            comments: [...m.comments, {
              id: Math.random().toString(36).substr(2, 9),
              text,
              timestamp: new Date(),
              author: 'Current User'
            }]
          }
        : m
    ))
    setNewComment('')
  }

  // Adjustments
  const updateAdjustment = (matchId: string, field: keyof InvoiceMatch['adjustments'], value: any) => {
    setMatches(prev => prev.map(m => 
      m.id === matchId 
        ? {
            ...m,
            adjustments: { ...m.adjustments, [field]: value }
          }
        : m
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'text-blue-600'
      case 'processing': return 'text-yellow-600'
      case 'ready': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'unmatched': return 'text-gray-600'
      case 'matched': return 'text-blue-600'
      case 'disputed': return 'text-red-600'
      case 'approved': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'processing': return <Clock className="w-4 h-4" />
      case 'ready': return <CheckCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      case 'unmatched': return <FileText className="w-4 h-4" />
      case 'matched': return <Link2 className="w-4 h-4" />
      case 'disputed': return <AlertCircle className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const selectedMatchData = selectedMatch ? matches.find(m => m.id === selectedMatch) : null

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manual Upload & Matching</h1>
        <p className="text-gray-600">Upload and manually match contractor and billing system invoices</p>
      </div>

      {/* View Mode Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'upload', label: 'Upload Files', icon: Upload },
              { key: 'compare', label: 'Compare & Match', icon: Link2 },
              { key: 'review', label: 'Review & Approve', icon: CheckCircle }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key as any)}
                className={`${
                  viewMode === key
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

      {/* Upload View */}
      {viewMode === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contractor Invoices Upload */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contractor Invoices</h2>
            
            <div
              ref={contractorDropRef}
              onDragOver={(e) => handleDragOver(e, 'contractor')}
              onDragLeave={(e) => handleDragLeave(e, 'contractor')}
              onDrop={(e) => handleDrop(e, 'contractor')}
              className={`${
                isDragging.contractor
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50'
              } border-2 border-dashed rounded-lg p-8 text-center transition-colors`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drop contractor invoices here
              </h3>
              <p className="text-gray-600 mb-4">
                Supports PDF, JPG, PNG, CSV, Excel files
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'contractor')}
                className="hidden"
                id="contractor-upload"
              />
              <label
                htmlFor="contractor-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Choose Files
              </label>
            </div>

            {/* Contractor Files List */}
            <div className="space-y-3">
              <AnimatePresence>
                {contractorFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={getStatusColor(file.status)}>
                          {getStatusIcon(file.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.preview && (
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => setContractorFiles(prev => prev.filter(f => f.id !== file.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {file.error && (
                      <p className="text-red-600 text-sm mt-2">{file.error}</p>
                    )}
                    
                    {file.preview && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div><strong>Invoice:</strong> {file.preview.invoiceNumber}</div>
                          <div><strong>Amount:</strong> ${file.preview.amount.toLocaleString()}</div>
                          <div><strong>Contractor:</strong> {file.preview.contractorName}</div>
                          <div><strong>Date:</strong> {file.preview.date}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Billing System Invoices Upload */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Billing System Invoices</h2>
            
            <div
              ref={billingDropRef}
              onDragOver={(e) => handleDragOver(e, 'billing')}
              onDragLeave={(e) => handleDragLeave(e, 'billing')}
              onDrop={(e) => handleDrop(e, 'billing')}
              className={`${
                isDragging.billing
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              } border-2 border-dashed rounded-lg p-8 text-center transition-colors`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drop billing system invoices here
              </h3>
              <p className="text-gray-600 mb-4">
                Supports PDF, JPG, PNG, CSV, Excel files
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'billing')}
                className="hidden"
                id="billing-upload"
              />
              <label
                htmlFor="billing-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                Choose Files
              </label>
            </div>

            {/* Billing Files List */}
            <div className="space-y-3">
              <AnimatePresence>
                {billingFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={getStatusColor(file.status)}>
                          {getStatusIcon(file.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.preview && (
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => setBillingFiles(prev => prev.filter(f => f.id !== file.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {file.error && (
                      <p className="text-red-600 text-sm mt-2">{file.error}</p>
                    )}
                    
                    {file.preview && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div><strong>Invoice:</strong> {file.preview.invoiceNumber}</div>
                          <div><strong>Amount:</strong> ${file.preview.amount.toLocaleString()}</div>
                          <div><strong>Contractor:</strong> {file.preview.contractorName}</div>
                          <div><strong>Date:</strong> {file.preview.date}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Compare & Match View */}
      {viewMode === 'compare' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matches List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Matches</h2>
            <div className="space-y-3">
              {matches.map((match) => (
                <motion.div
                  key={match.id}
                  onClick={() => setSelectedMatch(match.id)}
                  className={`${
                    selectedMatch === match.id ? 'ring-2 ring-blue-500' : ''
                  } bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={getStatusColor(match.status)}>
                      {getStatusIcon(match.status)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                      match.status === 'approved' ? 'bg-green-100 text-green-800' :
                      match.status === 'disputed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status}
                    </span>
                  </div>
                  
                  <p className="font-medium text-gray-900 truncate">
                    {match.contractorInvoice.preview?.invoiceNumber}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {match.contractorInvoice.preview?.contractorName}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    ${match.contractorInvoice.preview?.amount.toLocaleString()}
                  </p>
                  
                  {match.confidence && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Match Confidence</span>
                        <span>{match.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${match.confidence}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Comparison View */}
          <div className="lg:col-span-2">
            {selectedMatchData ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Invoice Comparison</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setMatches(prev => prev.map(m => 
                          m.id === selectedMatch ? { ...m, status: 'approved' } : m
                        ))
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      Approve Match
                    </button>
                    <button 
                      onClick={() => {
                        setMatches(prev => prev.map(m => 
                          m.id === selectedMatch ? { ...m, status: 'disputed' } : m
                        ))
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Mark as Disputed
                    </button>
                  </div>
                </div>

                {/* Side by Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contractor Invoice */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-md font-semibold text-blue-600 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Contractor Invoice
                    </h3>
                    {selectedMatchData.contractorInvoice.preview && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                          <p className="text-gray-900">{selectedMatchData.contractorInvoice.preview.invoiceNumber}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Contractor</label>
                          <p className="text-gray-900">{selectedMatchData.contractorInvoice.preview.contractorName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Amount</label>
                          <p className="text-gray-900 font-semibold">${selectedMatchData.contractorInvoice.preview.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date</label>
                          <p className="text-gray-900">{selectedMatchData.contractorInvoice.preview.date}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <p className="text-gray-900">{selectedMatchData.contractorInvoice.preview.description}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Billing Invoice or Available Files */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-md font-semibold text-green-600 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Billing System Invoice
                    </h3>
                    
                    {selectedMatchData.billingInvoice ? (
                      selectedMatchData.billingInvoice.preview && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                            <p className="text-gray-900">{selectedMatchData.billingInvoice.preview.invoiceNumber}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Contractor</label>
                            <p className="text-gray-900">{selectedMatchData.billingInvoice.preview.contractorName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <p className="text-gray-900 font-semibold">${selectedMatchData.billingInvoice.preview.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <p className="text-gray-900">{selectedMatchData.billingInvoice.preview.date}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <p className="text-gray-900">{selectedMatchData.billingInvoice.preview.description}</p>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-600 mb-4">Select a billing invoice to match:</p>
                        <div className="space-y-2">
                          {billingFiles.filter(f => f.status === 'ready').map((file) => (
                            <button
                              key={file.id}
                              onClick={() => createManualMatch(selectedMatchData.contractorInvoice, file)}
                              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{file.preview?.invoiceNumber}</p>
                                  <p className="text-sm text-gray-600">{file.preview?.contractorName}</p>
                                  <p className="text-sm font-medium text-gray-900">${file.preview?.amount.toLocaleString()}</p>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-gray-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Adjustments Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2" />
                    Adjustments & Overrides
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Adjustment</label>
                      <input
                        type="number"
                        value={selectedMatchData.adjustments.amount || ''}
                        onChange={(e) => updateAdjustment(selectedMatch!, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description Override</label>
                      <input
                        type="text"
                        value={selectedMatchData.adjustments.description || ''}
                        onChange={(e) => updateAdjustment(selectedMatch!, 'description', e.target.value)}
                        placeholder="Enter new description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Adjustment</label>
                      <input
                        type="text"
                        value={selectedMatchData.adjustments.reason || ''}
                        onChange={(e) => updateAdjustment(selectedMatch!, 'reason', e.target.value)}
                        placeholder="Enter reason"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Comments & Notes
                  </h3>
                  
                  {/* Existing Comments */}
                  <div className="space-y-3 mb-4">
                    {selectedMatchData.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">
                            {comment.timestamp.toLocaleDateString()} {comment.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Comment */}
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newComment.trim()) {
                          addComment(selectedMatch!, newComment.trim())
                        }
                      }}
                    />
                    <button
                      onClick={() => newComment.trim() && addComment(selectedMatch!, newComment.trim())}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-12 rounded-lg text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Invoice Match</h3>
                <p className="text-gray-600">Choose a match from the list to view the comparison and make adjustments</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review & Approve View */}
      {viewMode === 'review' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Review & Approve Matches</h2>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Approve All</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Matches', value: matches.length, color: 'blue' },
              { label: 'Approved', value: matches.filter(m => m.status === 'approved').length, color: 'green' },
              { label: 'Disputed', value: matches.filter(m => m.status === 'disputed').length, color: 'red' },
              { label: 'Pending', value: matches.filter(m => m.status === 'matched' || m.status === 'unmatched').length, color: 'yellow' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Matches Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contractor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {matches.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {match.contractorInvoice.preview?.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {match.contractorInvoice.preview?.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {match.contractorInvoice.preview?.contractorName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${match.contractorInvoice.preview?.amount.toLocaleString()}
                        </div>
                        {match.adjustments.amount && (
                          <div className="text-sm text-blue-600">
                            Adj: ${match.adjustments.amount.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          match.status === 'approved' ? 'bg-green-100 text-green-800' :
                          match.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                          match.status === 'disputed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {match.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {match.confidence && (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${match.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-900">{match.confidence}%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedMatch(match.id)
                              setViewMode('compare')
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setMatches(prev => prev.map(m => 
                                m.id === match.id ? { ...m, status: 'approved' } : m
                              ))
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setMatches(prev => prev.filter(m => m.id !== match.id))
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManualUploadInterface 