'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CpuChipIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ReconciliationDashboard from './ReconciliationDashboard';

interface ProcessingStep {
  id: string;
  label: string;
  completed: boolean;
  duration: number;
}

interface ReconciliationResult {
  id: string;
  contractorName: string;
  invoiceAmount: number;
  status: 'perfect_match' | 'minor_issue' | 'major_issue';
  confidence: number;
  issues: string[];
  timeToProcess: number;
}

const mockResults: ReconciliationResult[] = [
  {
    id: '1',
    contractorName: 'ABC Drilling Ltd',
    invoiceAmount: 4850.00,
    status: 'perfect_match',
    confidence: 98.5,
    issues: [],
    timeToProcess: 12
  },
  {
    id: '2', 
    contractorName: 'Northern Services',
    invoiceAmount: 3200.00,
    status: 'minor_issue',
    confidence: 87.2,
    issues: ['Rate variance: $25/day vs approved $50/day'],
    timeToProcess: 15
  },
  {
    id: '3',
    contractorName: 'ProWeld Solutions',
    invoiceAmount: 2750.00,
    status: 'perfect_match',
    confidence: 99.1,
    issues: [],
    timeToProcess: 8
  },
  {
    id: '4',
    contractorName: 'Calgary Heavy Haul',
    invoiceAmount: 5500.00,
    status: 'major_issue',
    confidence: 45.8,
    issues: ['No matching work order found', 'Unauthorized project code: XYZ-789'],
    timeToProcess: 22
  },
  {
    id: '5',
    contractorName: 'Precision Contracting',
    invoiceAmount: 1890.00,
    status: 'perfect_match',
    confidence: 96.7,
    issues: [],
    timeToProcess: 10
  }
];

const processingSteps: ProcessingStep[] = [
  { id: '1', label: '🔍 OCR text extraction', completed: false, duration: 800 },
  { id: '2', label: '🧠 Data pattern recognition', completed: false, duration: 1200 },
  { id: '3', label: '💰 Rate validation', completed: false, duration: 600 },
  { id: '4', label: '📋 Project code matching', completed: false, duration: 900 },
  { id: '5', label: '⚡ Auto-reconciliation', completed: false, duration: 700 }
];

interface Props {
  uploadedFiles: File[];
  onComplete: () => void;
}

const InvoiceIntakeSystem = ({ uploadedFiles, onComplete }: Props) => {
  const [processingStatus, setProcessingStatus] = useState<'waiting' | 'processing' | 'complete'>('waiting');
  const [currentSteps, setCurrentSteps] = useState<ProcessingStep[]>(processingSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [reconciliationResults, setReconciliationResults] = useState<ReconciliationResult[]>([]);
  const [totalProcessingTime, setTotalProcessingTime] = useState(0);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      handleFileUpload();
    }
  }, [uploadedFiles]);

  const handleFileUpload = async () => {
    setProcessingStatus('processing');
    const startTime = Date.now();

    // Process each step with realistic timing
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, processingSteps[i].duration));
      
      setCurrentSteps(prev => 
        prev.map((step, index) => 
          index <= i ? { ...step, completed: true } : step
        )
      );
      setCurrentStepIndex(i + 1);
    }

    // Calculate total time
    const endTime = Date.now();
    const totalTime = Math.round((endTime - startTime) / 1000);
    setTotalProcessingTime(totalTime);

    // Show results
    await new Promise(resolve => setTimeout(resolve, 500));
    setReconciliationResults(mockResults);
    setProcessingStatus('complete');
  };

  if (processingStatus === 'waiting') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AnimatePresence mode="wait">
        {processingStatus === 'processing' && (
          <motion.div 
            className="min-h-screen flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="processing"
          >
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                className="mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CpuChipIcon className="h-20 w-20 text-yellow-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-4xl font-bold mb-4">
                  🤖 AI Processing Your Invoices...
                </h2>
                <p className="text-xl text-gray-300">
                  Analyzing {uploadedFiles.length} invoices with advanced pattern recognition
                </p>
              </motion.div>

              <div className="space-y-4">
                {currentSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-center p-4 rounded-lg transition-colors duration-300 ${
                      step.completed 
                        ? 'bg-green-900 text-green-100' 
                        : index === currentStepIndex 
                          ? 'bg-yellow-900 text-yellow-100 animate-pulse'
                          : 'bg-gray-800 text-gray-400'
                    }`}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {step.completed ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3" />
                    ) : index === currentStepIndex ? (
                      <div className="h-6 w-6 mr-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-600 mr-3"></div>
                    )}
                    <span className="text-lg font-medium">{step.label}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-8 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Processing {uploadedFiles.length} invoices across multiple work orders...
              </motion.div>
            </div>
          </motion.div>
        )}

        {processingStatus === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="complete"
          >
            <ReconciliationDashboard />
            
            {/* Back to Upload Button */}
            <div className="fixed bottom-6 right-6">
              <button 
                onClick={onComplete}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors shadow-lg"
              >
                ← Try Different Files
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceIntakeSystem; 