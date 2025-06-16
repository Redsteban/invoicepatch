'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react'

export default function ProcessInvoicesPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  const handleStartProcessing = () => {
    setIsProcessing(true)
    setProcessedCount(0)
    
    // Simulate processing
    const interval = setInterval(() => {
      setProcessedCount(prev => {
        if (prev >= 17) {
          clearInterval(interval)
          setIsProcessing(false)
          return 17
        }
        return prev + 1
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Process Invoices</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <Upload className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Process Invoice Batch
            </h2>
            <p className="text-gray-600">
              17 pending invoices ready for reconciliation
            </p>
          </div>

          {!isProcessing && processedCount === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <FileText className="w-6 h-6 text-yellow-600 mb-2" />
                  <p className="font-medium text-yellow-800">17 Pending</p>
                  <p className="text-sm text-yellow-600">Ready to process</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                  <p className="font-medium text-green-800">Auto-match ready</p>
                  <p className="text-sm text-green-600">94.7% confidence</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
                  <p className="font-medium text-red-800">2 Need review</p>
                  <p className="text-sm text-red-600">Manual check required</p>
                </div>
              </div>

              <button
                onClick={handleStartProcessing}
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Start Processing Batch
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                  style={{ 
                    clipPath: `polygon(0 0, ${(processedCount / 17) * 100}% 0, ${(processedCount / 17) * 100}% 100%, 0 100%)` 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round((processedCount / 17) * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Processing Invoices...</h3>
                <p className="text-gray-600">
                  {processedCount} of 17 invoices processed
                </p>
              </div>
            </div>
          )}

          {!isProcessing && processedCount === 17 && (
            <div className="text-center space-y-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Processing Complete!
                </h3>
                <p className="text-gray-600">
                  All 17 invoices have been successfully reconciled
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/manager/reconciliation')}
                  className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  View Results
                </button>
                <button
                  onClick={() => router.push('/manager/dashboard')}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 