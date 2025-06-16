'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  CheckCircle, 
  FileText, 
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Zap
} from 'lucide-react'
import ManagerLayout from '@/components/ManagerLayout'

interface ProcessingState {
  status: 'idle' | 'processing' | 'complete'
  currentStep: number
  processedCount: number
  totalCount: number
  startTime?: Date
}

interface InvoiceBatch {
  total: number
  pending: number
  autoMatch: number
  needsReview: number
  confidence: number
}

const ProcessInvoicesPage = () => {
  const router = useRouter()
  const [processing, setProcessing] = useState<ProcessingState>({
    status: 'idle',
    currentStep: 0,
    processedCount: 0,
    totalCount: 17
  })

  const [batch] = useState<InvoiceBatch>({
    total: 17,
    pending: 17,
    autoMatch: 15,
    needsReview: 2,
    confidence: 94.7
  })

  const [showDetailedStats, setShowDetailedStats] = useState(false)
  const [processingStats, setProcessingStats] = useState({
    estimatedTime: '3-5 minutes',
    timeElapsed: 0,
    processingSpeed: '5.2 invoices/min'
  })

  const processingSteps = [
    { label: 'OCR Text Extraction', icon: FileText, duration: 800 },
    { label: 'Data Validation', icon: CheckCircle, duration: 600 },
    { label: 'Auto-matching', icon: Zap, duration: 1000 },
    { label: 'Confidence Analysis', icon: BarChart3, duration: 400 },
    { label: 'Final Review', icon: Users, duration: 300 }
  ]

  const handleStartProcessing = async () => {
    setProcessing(prev => ({
      ...prev,
      status: 'processing',
      startTime: new Date()
    }))

    // Simulate processing steps
    for (let step = 0; step < processingSteps.length; step++) {
      await new Promise(resolve => 
        setTimeout(resolve, processingSteps[step].duration)
      )
      
      setProcessing(prev => ({
        ...prev,
        currentStep: step + 1
      }))
    }

    // Simulate individual invoice processing
    for (let i = 1; i <= batch.total; i++) {
      await new Promise(resolve => setTimeout(resolve, 150))
      setProcessing(prev => ({
        ...prev,
        processedCount: i
      }))
    }

    setProcessing(prev => ({
      ...prev,
      status: 'complete'
    }))
  }

  // Update elapsed time during processing
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (processing.status === 'processing' && processing.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - processing.startTime!.getTime()) / 1000)
        setProcessingStats(prev => ({
          ...prev,
          timeElapsed: elapsed
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [processing.status, processing.startTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (processing.status === 'idle') return 0
    if (processing.status === 'complete') return 100
    
    const stepProgress = (processing.currentStep / processingSteps.length) * 30
    const invoiceProgress = (processing.processedCount / batch.total) * 70
    return Math.min(stepProgress + invoiceProgress, 100)
  }

  return (
    <ManagerLayout loading={processing.status === 'processing'}>
      <div className="p-6">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Process Invoice Batch</h1>
              <p className="text-gray-600 mt-1">
                Automated reconciliation with AI-powered matching
              </p>
            </div>
            
            {processing.status === 'processing' && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Time Elapsed</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(processingStats.timeElapsed)}
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <motion.div
              className="h-2 bg-black rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-sm text-gray-600">
            {getProgressPercentage().toFixed(1)}% complete
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Processing Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <AnimatePresence mode="wait">
                {/* Idle State */}
                {processing.status === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="mb-8">
                      <Upload className="mx-auto h-20 w-20 text-blue-600 mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Ready to Process Invoice Batch
                      </h2>
                      <p className="text-gray-600">
                        {batch.total} pending invoices ready for reconciliation
                      </p>
                    </div>

                    {/* Batch Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                        <FileText className="w-8 h-8 text-yellow-600 mb-3 mx-auto" />
                        <p className="font-bold text-yellow-800 text-xl">{batch.pending}</p>
                        <p className="text-sm text-yellow-600">Pending invoices</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <CheckCircle className="w-8 h-8 text-green-600 mb-3 mx-auto" />
                        <p className="font-bold text-green-800 text-xl">{batch.autoMatch}</p>
                        <p className="text-sm text-green-600">Auto-match ready</p>
                      </div>
                      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                        <AlertCircle className="w-8 h-8 text-red-600 mb-3 mx-auto" />
                        <p className="font-bold text-red-800 text-xl">{batch.needsReview}</p>
                        <p className="text-sm text-red-600">Need manual review</p>
                      </div>
                    </div>

                    <button
                      onClick={handleStartProcessing}
                      className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                      Start Processing Batch
                    </button>
                  </motion.div>
                )}

                {/* Processing State */}
                {processing.status === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-8"
                  >
                    {/* Animated Progress Circle */}
                    <div className="relative w-40 h-40 mx-auto">
                      <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="72"
                          cy="72"
                          r="64"
                          fill="none"
                          stroke="#000000"
                          strokeWidth="8"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: getProgressPercentage() / 100 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          style={{
                            strokeDasharray: "402.12",
                            strokeDashoffset: `${402.12 * (1 - getProgressPercentage() / 100)}`
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">
                            {Math.round(getProgressPercentage())}%
                          </div>
                          <div className="text-sm text-gray-600">
                            {processing.processedCount} / {batch.total}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Processing Invoices...
                      </h3>
                      <p className="text-gray-600">
                        AI-powered reconciliation in progress
                      </p>
                    </div>

                    {/* Processing Steps */}
                    <div className="space-y-3">
                      {processingSteps.map((step, index) => (
                        <motion.div
                          key={index}
                          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                            index < processing.currentStep 
                              ? 'bg-green-50 text-green-800' 
                              : index === processing.currentStep 
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-gray-50 text-gray-600'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center">
                            <step.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{step.label}</span>
                          </div>
                          {index < processing.currentStep && (
                            <CheckCircle className="w-5 h-5" />
                          )}
                          {index === processing.currentStep && (
                            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Complete State */}
                {processing.status === 'complete' && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <CheckCircle className="mx-auto h-20 w-20 text-green-600" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        Processing Complete!
                      </h3>
                      <p className="text-gray-600">
                        All {batch.total} invoices have been successfully reconciled
                      </p>
                    </div>

                    {/* Success Stats */}
                    <div className="grid grid-cols-2 gap-4 py-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatTime(processingStats.timeElapsed)}
                        </div>
                        <div className="text-sm text-gray-600">Processing Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {batch.confidence}%
                        </div>
                        <div className="text-sm text-gray-600">Match Confidence</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => router.push('/manager/reconciliation')}
                        className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        View Results
                      </button>
                      <button
                        onClick={() => router.push('/manager/dashboard')}
                        className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Side Stats Panel */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Processing Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Time</span>
                  <span className="font-medium">{processingStats.estimatedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processing Speed</span>
                  <span className="font-medium">{processingStats.processingSpeed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">{batch.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Batch Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Batch Information</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Auto-match Ready</span>
                    <span className="text-sm font-medium">{batch.autoMatch}/{batch.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(batch.autoMatch / batch.total) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Needs Review</span>
                    <span className="text-sm font-medium">{batch.needsReview}/{batch.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(batch.needsReview / batch.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {processing.status === 'idle' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowDetailedStats(!showDetailedStats)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm">View Detailed Stats</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Upload className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm">Upload More Invoices</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm">Schedule Processing</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ManagerLayout>
  )
}

export default ProcessInvoicesPage 