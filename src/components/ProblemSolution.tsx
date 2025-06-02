'use client';

import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function ProblemSolution() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Simple Problem Statement */}
        <motion.div 
          className="mx-auto max-w-2xl text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            The Problem: Manual Reconciliation Hell
          </h2>
          <p className="text-lg text-gray-600">
            Managers have AFE codes in ERP systems. Contractors recreate them manually on invoices. 
            This creates errors, delays, and weekend reconciliation nightmares.
          </p>
        </motion.div>

        {/* Simple Before/After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Before */}
          <motion.div 
            className="bg-red-50 rounded-xl p-6 border border-red-200"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-xl font-bold text-red-900">Before InvoicePatch</h3>
            </div>
            <ul className="space-y-3 text-red-800">
              <li>• Contractors guess at AFE codes and well IDs</li>
              <li>• 40% of invoices need verification calls</li>
              <li>• Managers spend 8+ hours weekly reconciling</li>
              <li>• Payment delays from billing errors</li>
            </ul>
          </motion.div>

          {/* After */}
          <motion.div 
            className="bg-emerald-50 rounded-xl p-6 border border-emerald-200"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-6 w-6 text-emerald-600 mr-3" />
              <h3 className="text-xl font-bold text-emerald-900">After InvoicePatch</h3>
            </div>
            <ul className="space-y-3 text-emerald-800">
              <li>• AFE codes sync directly from your ERP</li>
              <li>• Pre-validated invoices with your exact data</li>
              <li>• One-click approvals in 45 minutes weekly</li>
              <li>• Contractors get paid 3x faster</li>
            </ul>
          </motion.div>
        </div>

        {/* Simple Solution Statement */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            One Source of Truth: Your ERP → Their Mobile App
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            InvoicePatch connects your SAP, JDE, or Oracle system directly to contractor apps. 
            Same AFE codes, same well names, same rates - zero reconciliation needed.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
              See How It Works
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
} 