'use client';

import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function ProblemSolution() {
  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20 mobile-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Simple Problem Statement */}
        <motion.div 
          className="mx-auto max-w-4xl text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 break-words leading-tight">
            The Problem: Automate invoices correlation in minutes, not hours
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed break-words">
            Managers have AFE codes in ERP systems. Contractors recreate them manually on invoices. 
            This creates errors, delays, and weekend reconciliation nightmares.
          </p>
        </motion.div>

        {/* Simple Before/After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-16 sm:mb-20">
          
          {/* Before */}
          <motion.div 
            className="bg-red-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-red-200 hover:shadow-lg transition-shadow duration-200"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <ExclamationTriangleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 mr-3 flex-shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold text-red-900 break-words">Before InvoicePatch</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-red-800">
              <li className="text-base sm:text-lg leading-relaxed break-words">• Contractors guess at AFE codes and well IDs</li>
              <li className="text-base sm:text-lg leading-relaxed break-words">• 40% of invoices need verification calls</li>
              <li className="text-base sm:text-lg leading-relaxed break-words">• Managers spend 8+ hours weekly reconciling</li>
              <li className="text-base sm:text-lg leading-relaxed break-words">• Payment delays from billing errors</li>
            </ul>
          </motion.div>

          {/* After */}
          <motion.div 
            className="bg-emerald-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-emerald-200 hover:shadow-lg transition-shadow duration-200"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <CheckCircleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 mr-3 flex-shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 break-words">After InvoicePatch</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-emerald-800">
              <li className="text-base sm:text-lg leading-relaxed break-words">• AFE codes sync directly from your ERP</li>
              <li className="text-base sm:text-lg leading-relaxed break-words">• Pre-validated invoices with your exact data</li>
              <li className="text-base sm:text-lg leading-relaxed break-words">• One-click approvals in 45 minutes weekly</li>
              <li className="text-base sm:text-lg leading-relaxed break-words">• Contractors get paid 3x faster</li>
            </ul>
          </motion.div>
        </div>

        {/* Simple Solution Statement */}
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 break-words leading-tight">
            One Source of Truth: Your ERP → Their Mobile App
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 leading-relaxed break-words">
            InvoicePatch connects your FieldCap, FireSpark, or Wellview system directly to contractor apps. 
            Same AFE codes, same well names, same rates - zero reconciliation needed.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-semibold text-white bg-emerald-600 border border-transparent rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 touch-target">
              See How It Works
              <ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0" />
            </button>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
} 