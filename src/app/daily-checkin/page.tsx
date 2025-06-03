'use client';

import { Suspense } from 'react';
import DailyCheckInContent from './DailyCheckInContent';

export default function DailyCheckInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your check-in...</p>
        </div>
      </div>
    }>
      <DailyCheckInContent />
    </Suspense>
  );
} 