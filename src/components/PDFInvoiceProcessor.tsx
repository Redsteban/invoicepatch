'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload,
  FileText,
  Eye,
  Edit,
  Check,
  X,
  AlertCircle,
  Clock,
  Download,
  Trash2,
  Save,
  RefreshCw,
  ChevronRight,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut
} from 'lucide-react'

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface ExtractedData {
  contractorName: string
  contractorEmail: string
  contractorAddress: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  projectCode: string
  lineItems: LineItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
}

interface ProcessedFile {
  id: string
  file: File
  name: string
  size: string
  status: 'uploading' | 'processing' | 'completed' | 'error' | 'reviewing'
  progress: number
  extractedData?: ExtractedData
  error?: string
  isEditing: boolean
}

const simulateOCRExtraction = (fileName: string): ExtractedData => {
  const contractors = [
    {
      name: 'Northern Pipeline Services Ltd.',
      email: 'billing@northernpipeline.ca',
      address: '123 Industrial Ave, Calgary, AB T2E 7H7'
    },
    {
      name: 'Alberta Heavy Haul Inc.',
      email: 'invoices@albertaheavy.com',
      address: '456 Transport Blvd, Edmonton, AB T5J 2B3'
    },
    {
      name: 'ProWeld Solutions Corp.',
      email: 'accounting@proweldsolutions.ca',
      address: '789 Welding Way, Fort McMurray, AB T9H 1A1'
    }
  ]

  const contractor = contractors[Math.floor(Math.random() * contractors.length)]
  const invoiceNum = `INV-${Math.floor(Math.random() * 90000) + 10000}`
  const projectCode = `PRJ-${Math.floor(Math.random() * 9000) + 1000}`
  
  const lineItems: LineItem[] = [
    {
      id: '1',
      description: 'Pipeline Installation Services',
      quantity: 40,
      unitPrice: 125.00,
      total: 5000.00
    },
    {
      id: '2', 
      description: 'Equipment Rental - Excavator',
      quantity: 8,
      unitPrice: 450.00,
      total: 3600.00
    },
    {
      id: '3',
      description: 'Material Transportation',
      quantity: 1,
      unitPrice: 2800.00,
      total: 2800.00
    }
  ]

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.05 // 5% GST
  const total = subtotal + tax

  return {
    contractorName: contractor.name,
    contractorEmail: contractor.email,
    contractorAddress: contractor.address,
    invoiceNumber: invoiceNum,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectCode,
    lineItems,
    subtotal,
    tax,
    total,
    notes: 'Payment terms: Net 30 days'
  }
}

const PDFInvoiceProcessor: React.FC = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pdfZoom, setPdfZoom] = useState(100)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (fileList: File[]) => {
    const pdfFiles = fileList.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length === 0) {
      alert('Please select PDF files only')
      return
    }

    const newFiles: ProcessedFile[] = pdfFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      status: 'uploading',
      progress: 0,
      isEditing: false
    }))

    setFiles(prev => [...prev, ...newFiles])
    processFiles(newFiles)
  }

  const processFiles = async (filesToProcess: ProcessedFile[]) => {
    setIsProcessing(true)

    for (const file of filesToProcess) {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ))
      }

      // Update to processing status
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'processing', progress: 0 } : f
      ))

      // Simulate OCR processing
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300))
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ))
      }

      // Simulate occasional errors
      if (Math.random() < 0.1) {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'error', 
            error: 'Failed to extract data - unclear text quality'
          } : f
        ))
      } else {
        // Complete processing with extracted data
        const extractedData = simulateOCRExtraction(file.name)
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'reviewing', 
            extractedData,
            progress: 100
          } : f
        ))
      }
    }

    setIsProcessing(false)
  }

  const handleRetryProcessing = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (file) {
      processFiles([{ ...file, status: 'uploading', progress: 0 }])
    }
  }

  const handleEditData = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isEditing: true } : f
    ))
  }

  const handleSaveData = (fileId: string, updatedData: ExtractedData) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { 
        ...f, 
        extractedData: updatedData, 
        isEditing: false,
        status: 'completed'
      } : f
    ))
  }

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
  }

  const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'reviewing':
        return <Eye className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'border-blue-200 bg-blue-50'
      case 'completed':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'reviewing':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const completedFiles = files.filter(f => f.status === 'completed')
  const processingFiles = files.filter(f => f.status === 'uploading' || f.status === 'processing')

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-gray-700" />
            <h1 className="text-xl font-bold text-gray-900">PDF Invoice Processor</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {completedFiles.length} processed • {processingFiles.length} processing
            </span>
            {completedFiles.length > 0 && (
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Save All ({completedFiles.length})
              </button>
            )}
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${isDragOver 
              ? 'border-black bg-gray-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop PDF invoices here or click to browse
          </h3>
          <p className="text-gray-600">
            Upload multiple PDF files for batch processing
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File List */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Processing Queue</h2>
            <p className="text-sm text-gray-600">{files.length} files uploaded</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    p-4 border-b border-gray-100 cursor-pointer transition-all
                    ${selectedFile?.id === file.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}
                    ${getStatusColor(file.status)}
                  `}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile(file.id)
                      }}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 mb-2">
                    Size: {file.size} • Status: {file.status}
                  </div>

                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}

                  {file.error && (
                    <div className="text-xs text-red-600 mb-2">
                      {file.error}
                    </div>
                  )}

                  {file.status === 'error' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRetryProcessing(file.id)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Retry Processing
                    </button>
                  )}

                  {file.extractedData && (
                    <div className="text-xs text-gray-700">
                      <p><strong>Invoice:</strong> {file.extractedData.invoiceNumber}</p>
                      <p><strong>Total:</strong> ${file.extractedData.total.toFixed(2)}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview and Data */}
        <div className="flex-1 flex overflow-hidden">
          {selectedFile ? (
            <>
              {/* PDF Preview */}
              <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">PDF Preview</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPdfZoom(Math.max(50, pdfZoom - 25))}
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600">{pdfZoom}%</span>
                      <button
                        onClick={() => setPdfZoom(Math.min(200, pdfZoom + 25))}
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-4 overflow-auto bg-gray-100">
                  {/* Mock PDF Preview */}
                  <div 
                    className="bg-white shadow-lg mx-auto"
                    style={{ 
                      width: `${(595 * pdfZoom) / 100}px`,
                      height: `${(842 * pdfZoom) / 100}px`,
                      minHeight: '600px'
                    }}
                  >
                    <div className="p-8 h-full border border-gray-300">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                        <p className="text-gray-600">Invoice #{selectedFile.extractedData?.invoiceNumber}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">From:</h3>
                          <p className="text-sm text-gray-700">
                            {selectedFile.extractedData?.contractorName}<br/>
                            {selectedFile.extractedData?.contractorAddress}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">Invoice Details:</h3>
                          <p className="text-sm text-gray-700">
                            Date: {selectedFile.extractedData?.invoiceDate}<br/>
                            Due: {selectedFile.extractedData?.dueDate}<br/>
                            Project: {selectedFile.extractedData?.projectCode}
                          </p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="text-left py-2">Description</th>
                              <th className="text-right py-2">Qty</th>
                              <th className="text-right py-2">Price</th>
                              <th className="text-right py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedFile.extractedData?.lineItems.map((item) => (
                              <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2">{item.description}</td>
                                <td className="text-right py-2">{item.quantity}</td>
                                <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                                <td className="text-right py-2">${item.total.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="ml-auto w-64">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${selectedFile.extractedData?.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax (5%):</span>
                            <span>${selectedFile.extractedData?.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                            <span>Total:</span>
                            <span>${selectedFile.extractedData?.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Data */}
              <div className="w-1/2 bg-white overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Extracted Data</h3>
                    {selectedFile.extractedData && !selectedFile.isEditing && (
                      <button
                        onClick={() => handleEditData(selectedFile.id)}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {selectedFile.extractedData ? (
                    <ExtractedDataForm
                      data={selectedFile.extractedData}
                      isEditing={selectedFile.isEditing}
                      onSave={(updatedData) => handleSaveData(selectedFile.id, updatedData)}
                      onCancel={() => setFiles(prev => prev.map(f => 
                        f.id === selectedFile.id ? { ...f, isEditing: false } : f
                      ))}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      {selectedFile.status === 'error' ? (
                        <div>
                          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                          <p>Failed to extract data from this PDF</p>
                          <button
                            onClick={() => handleRetryProcessing(selectedFile.id)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Retry Processing
                          </button>
                        </div>
                      ) : (
                        <div>
                          <RefreshCw className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
                          <p>Processing PDF and extracting data...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a file to preview
                </h3>
                <p className="text-gray-600">
                  Upload PDF invoices to start processing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ExtractedDataFormProps {
  data: ExtractedData
  isEditing: boolean
  onSave: (data: ExtractedData) => void
  onCancel: () => void
}

const ExtractedDataForm: React.FC<ExtractedDataFormProps> = ({
  data,
  isEditing,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<ExtractedData>(data)

  const handleLineItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }))
  }

  const removeLineItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }))
  }

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.05
    const total = subtotal + tax
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }))
  }

  const handleSave = () => {
    calculateTotals()
    onSave(formData)
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contractor Name
            </label>
            <p className="text-sm text-gray-900">{data.contractorName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <p className="text-sm text-gray-900">{data.invoiceNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <p className="text-sm text-gray-900">{data.invoiceDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Code
            </label>
            <p className="text-sm text-gray-900">{data.projectCode}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Line Items
          </label>
          <div className="space-y-2">
            {data.lineItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.description}</p>
                  <p className="text-xs text-gray-600">
                    {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${data.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contractor Name
          </label>
          <input
            type="text"
            value={formData.contractorName}
            onChange={(e) => setFormData(prev => ({ ...prev, contractorName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Date
          </label>
          <input
            type="date"
            value={formData.invoiceDate}
            onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Code
          </label>
          <input
            type="text"
            value={formData.projectCode}
            onChange={(e) => setFormData(prev => ({ ...prev, projectCode: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Line Items
          </label>
          <button
            onClick={addLineItem}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.lineItems.map((item, index) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const unitPrice = parseFloat(e.target.value) || 0
                      const total = item.quantity * unitPrice
                      handleLineItemChange(item.id, 'unitPrice', unitPrice)
                      handleLineItemChange(item.id, 'total', total)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Total"
                    value={item.total}
                    onChange={(e) => handleLineItemChange(item.id, 'total', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removeLineItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-4">
            <span>Subtotal: ${formData.subtotal.toFixed(2)}</span>
            <span>Tax: ${formData.tax.toFixed(2)}</span>
            <span className="font-bold">Total: ${formData.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Data</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PDFInvoiceProcessor 