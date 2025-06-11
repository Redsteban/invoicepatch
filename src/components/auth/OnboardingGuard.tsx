'use client';

import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { ReactNode } from 'react';

interface OnboardingGuardProps {
  userId: string | null;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function OnboardingGuard({ userId, children, fallback }: OnboardingGuardProps) {
  const { isLoading, error, needsOnboarding } = useOnboardingStatus(userId, true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your setup...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to onboarding...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 