'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function ExpenseTracker() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Expense Tracker</h2>
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Expense tracker coming soon...</p>
        </div>
      </div>
    </div>
  );
} 