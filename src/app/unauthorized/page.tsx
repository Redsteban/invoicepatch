'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Home, Building2, HardHat } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useEffect, useState } from 'react';

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role, switchRole } = useRole();
  const [mounted, setMounted] = useState(false);

  const userRole = searchParams.get('role') || role || 'unknown';
  const attemptedAccess = searchParams.get('attempted') || 'unknown';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (roleType: string) => {
    switch (roleType) {
      case 'manager':
        return 'Manager';
      case 'contractor':
        return 'Contractor';
      default:
        return 'Unknown';
    }
  };

  const getCorrectDashboard = () => {
    if (userRole === 'manager') {
      return '/manager/dashboard';
    } else if (userRole === 'contractor') {
      return '/contractor';
    }
    return '/';
  };

  const getAlternativeRole = () => {
    return userRole === 'manager' ? 'contractor' : 'manager';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <p className="text-gray-600 mb-6 leading-relaxed">
            You are currently signed in as a <span className="font-semibold text-gray-900">{getRoleDisplayName(userRole)}</span>, 
            but this page requires <span className="font-semibold text-gray-900">{getRoleDisplayName(attemptedAccess)}</span> access.
          </p>
          
          {/* Role Status */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Your role:</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  userRole === 'manager' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userRole === 'manager' ? (
                    <>
                      <Building2 className="w-3 h-3 mr-1" />
                      Manager
                    </>
                  ) : (
                    <>
                      <HardHat className="w-3 h-3 mr-1" />
                      Contractor
                    </>
                  )}
                </span>
              </div>
              <div className="text-gray-300">→</div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Required:</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  attemptedAccess === 'manager' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {attemptedAccess === 'manager' ? (
                    <>
                      <Building2 className="w-3 h-3 mr-1" />
                      Manager
                    </>
                  ) : (
                    <>
                      <HardHat className="w-3 h-3 mr-1" />
                      Contractor
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-900 mb-3">What you can do:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Switch to {getRoleDisplayName(getAlternativeRole())} role if you have access
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Return to your {getRoleDisplayName(userRole)} dashboard
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Contact support if you believe this is an error
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium inline-flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => router.push(getCorrectDashboard())}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center justify-center transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            My Dashboard
          </button>
          
          {(getAlternativeRole() === 'manager' || getAlternativeRole() === 'contractor') && (
            <button
              onClick={() => switchRole(getAlternativeRole() as 'manager' | 'contractor')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center transition-colors"
            >
              {getAlternativeRole() === 'manager' ? (
                <>
                  <Building2 className="w-4 h-4 mr-2" />
                  Switch to Manager
                </>
              ) : (
                <>
                  <HardHat className="w-4 h-4 mr-2" />
                  Switch to Contractor
                </>
              )}
            </button>
          )}
        </div>

        {/* Support Link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <button className="text-blue-600 hover:text-blue-700 font-medium underline">Contact Support</button>
          </p>
        </div>
      </div>
    </div>
  );
} 