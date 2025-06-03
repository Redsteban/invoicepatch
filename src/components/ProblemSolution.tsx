'use client';

import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function ProblemSolution() {
  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Simple Problem Statement */}
        <motion.div 
          className="mx-auto max-w-2xl text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            The Problem: Automate invoices correlation in minutes, not hours
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Managers have AFE codes in ERP systems. Contractors recreate them manually on invoices. 
            This creates errors, delays, and weekend reconciliation nightmares.
          </p>
        </motion.div>

        {/* Simple Before/After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          
          {/* Before */}
          <motion.div 
            className="bg-red-50 rounded-xl p-4 sm:p-6 border border-red-200"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2 sm:mr-3 flex-shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-red-900">Before InvoicePatch</h3>
            </div>
            <ul className="space-y-2 sm:space-y-3 text-red-800">
              <li className="text-sm sm:text-base">• Contractors guess at AFE codes and well IDs</li>
              <li className="text-sm sm:text-base">• 40% of invoices need verification calls</li>
              <li className="text-sm sm:text-base">• Managers spend 8+ hours weekly reconciling</li>
              <li className="text-sm sm:text-base">• Payment delays from billing errors</li>
            </ul>
          </motion.div>

          {/* After */}
          <motion.div 
            className="bg-emerald-50 rounded-xl p-4 sm:p-6 border border-emerald-200"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mr-2 sm:mr-3 flex-shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-emerald-900">After InvoicePatch</h3>
            </div>
            <ul className="space-y-2 sm:space-y-3 text-emerald-800">
              <li className="text-sm sm:text-base">• AFE codes sync directly from your ERP</li>
              <li className="text-sm sm:text-base">• Pre-validated invoices with your exact data</li>
              <li className="text-sm sm:text-base">• One-click approvals in 45 minutes weekly</li>
              <li className="text-sm sm:text-base">• Contractors get paid 3x faster</li>
            </ul>
          </motion.div>
        </div>

        {/* Simple Solution Statement */}
        <motion.div 
          className="text-center px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            One Source of Truth: Your ERP → Their Mobile App
          </h3>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            InvoicePatch connects your SAP, JDE, or Oracle system directly to contractor apps. 
            Same AFE codes, same well names, same rates - zero reconciliation needed.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="inline-flex items-center px-6 sm:px-8 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors w-full sm:w-auto justify-center">
              See How It Works
              <ArrowRightIcon className="ml-2 h-4 w-4 flex-shrink-0" />
            </button>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
} 