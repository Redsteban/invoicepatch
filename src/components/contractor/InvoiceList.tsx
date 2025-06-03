'use client';

import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function InvoiceList() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">My Invoices</h2>
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Invoice list coming soon...</p>
        </div>
      </div>
    </div>
  );
} 