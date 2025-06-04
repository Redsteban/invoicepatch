'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  BoltIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  confidence: number;
  processingTime: number;
}

interface ExtractedData {
  field: string;
  value: string;
  confidence: number;
  source: 'ocr' | 'pattern' | 'ai';
}

export default function InvoiceProcessingEngine() {
  const [currentInvoice, setCurrentInvoice] = useState('stack-testing-invoice-ST2024-001.pdf');
  const [processingStage, setProcessingStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  const processingSteps: ProcessingStep[] = [
    {
      id: 'ocr',
      name: 'OCR Text Extraction',
      description: 'Convert PDF/image to machine-readable text',
      status: 'completed',
      confidence: 96.8,
      processingTime: 2.3
    },
    {
      id: 'parsing',
      name: 'Document Parsing',
      description: 'Identify invoice structure and key sections',
      status: 'completed',
      confidence: 94.2,
      processingTime: 1.8
    },
    {
      id: 'extraction',
      name: 'Data Extraction',
      description: 'Extract key fields using AI pattern recognition',
      status: 'processing',
      confidence: 0,
      processingTime: 0
    },
    {
      id: 'validation',
      name: 'Data Validation',
      description: 'Validate extracted data against business rules',
      status: 'pending',
      confidence: 0,
      processingTime: 0
    },
    {
      id: 'matching',
      name: 'Work Order Matching',
      description: 'Auto-match to existing work orders and projects',
      status: 'pending',
      confidence: 0,
      processingTime: 0
    }
  ];

  const extractedData: ExtractedData[] = [
    { field: 'Invoice Number', value: 'ST-2024-001', confidence: 98.5, source: 'ocr' },
    { field: 'Contractor Name', value: 'John Smith Contracting Ltd.', confidence: 96.2, source: 'ocr' },
    { field: 'Invoice Date', value: '2024-01-15', confidence: 94.8, source: 'pattern' },
    { field: 'Amount', value: '$1,275.00', confidence: 99.1, source: 'ocr' },
    { field: 'Project Code', value: 'STACK-AB-2024-Q1', confidence: 91.3, source: 'ai' },
    { field: 'Work Period', value: '2024-01-08 to 2024-01-12', confidence: 88.7, source: 'ai' },
    { field: 'GST Amount', value: '$63.75', confidence: 97.4, source: 'pattern' },
    { field: 'Total Amount', value: '$1,338.75', confidence: 99.3, source: 'ocr' }
  ];

  // Simulate processing progression
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev >= processingSteps.length - 1) {
          setIsProcessing(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isProcessing, processingSteps.length]);

  const getStepStatus = (index: number) => {
    if (index < processingStage) return 'completed';
    if (index === processingStage && isProcessing) return 'processing';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-600 animate-spin" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600 bg-green-100';
    if (confidence >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ocr':
        return <EyeIcon className="h-4 w-4 text-blue-600" />;
      case 'pattern':
        return <MagnifyingGlassIcon className="h-4 w-4 text-purple-600" />;
      case 'ai':
        return <CpuChipIcon className="h-4 w-4 text-indigo-600" />;
      default:
        return <DocumentTextIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Processing Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">AI Processing Engine</h3>
              <p className="text-sm text-gray-600">OCR extraction and intelligent data processing</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Current Invoice</div>
            <div className="text-lg font-bold text-indigo-600 truncate max-w-xs">{currentInvoice}</div>
          </div>
        </div>

        {/* Processing Pipeline */}
        <div className="space-y-4">
          {processingSteps.map((step, index) => {
            const status = getStepStatus(index);
            const currentConfidence = status === 'completed' ? step.confidence : 0;
            
            return (
              <motion.div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  status === 'processing' 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : status === 'completed'
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                initial={{ opacity: 0.6 }}
                animate={{ 
                  opacity: status === 'pending' ? 0.6 : 1,
                  scale: status === 'processing' ? 1.02 : 1 
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(status)}
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900">{step.name}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {status === 'completed' && (
                      <>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(currentConfidence)}`}>
                          {currentConfidence}% confidence
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{step.processingTime}s</div>
                      </>
                    )}
                    {status === 'processing' && (
                      <div className="text-sm text-yellow-600 font-medium">Processing...</div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Extracted Data Preview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Extracted Data</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Overall Confidence:</span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              94.5%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extractedData.map((data, index) => (
            <motion.div
              key={data.field}
              className="p-4 border border-gray-200 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getSourceIcon(data.source)}
                  <span className="ml-2 text-sm font-medium text-gray-700">{data.field}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(data.confidence)}`}>
                  {data.confidence}%
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-900">{data.value}</div>
              <div className="text-xs text-gray-500 mt-1 capitalize">
                Extracted via {data.source} {data.source === 'ai' ? 'pattern recognition' : 'processing'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Processing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">OCR Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">96.8%</p>
              <p className="text-xs text-gray-500">Average confidence</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BoltIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Processing Speed</p>
              <p className="text-2xl font-bold text-gray-900">38s</p>
              <p className="text-xs text-gray-500">Average per invoice</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Auto-Match Rate</p>
              <p className="text-2xl font-bold text-gray-900">87.3%</p>
              <p className="text-xs text-gray-500">Work order matching</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Confidence Scoring */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Confidence Scoring</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-green-900">High Confidence (≥95%)</span>
              <span className="text-green-800">6 fields</span>
            </div>
            <p className="text-sm text-green-700">
              Fields automatically approved and ready for processing
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-yellow-900">Medium Confidence (85-94%)</span>
              <span className="text-yellow-800">2 fields</span>
            </div>
            <p className="text-sm text-yellow-700">
              Flagged for optional manual review before approval
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-red-900">Low Confidence (&lt;85%)</span>
              <span className="text-red-800">0 fields</span>
            </div>
            <p className="text-sm text-red-700">
              Requires manual review and correction before processing
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Processing Log */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Real-time Processing Log</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { time: '14:23:45', action: 'Started OCR processing for stack-testing-invoice-ST2024-001.pdf', status: 'info' },
            { time: '14:23:47', action: 'OCR completed with 96.8% average confidence', status: 'success' },
            { time: '14:23:49', action: 'Document structure identified: Standard invoice format', status: 'success' },
            { time: '14:23:51', action: 'Extracted contractor name with 96.2% confidence', status: 'success' },
            { time: '14:23:52', action: 'Project code matched to STACK-AB-2024-Q1', status: 'success' },
            { time: '14:23:54', action: 'GST calculation verified: $63.75 (5%)', status: 'success' },
            { time: '14:23:55', action: 'Ready for work order matching...', status: 'processing' },
          ].map((log, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className="text-gray-500 font-mono mr-3">{log.time}</span>
              <div className={`w-2 h-2 rounded-full mr-3 ${
                log.status === 'success' ? 'bg-green-400' :
                log.status === 'processing' ? 'bg-yellow-400' :
                'bg-blue-400'
              }`} />
              <span className="text-gray-900">{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 