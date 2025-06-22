'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { Shield, AlertTriangle, Home, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'manager' | 'contractor';
  allowedRoles?: ('manager' | 'contractor')[];
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles,
  fallbackPath = '/'
}: ProtectedRouteProps) {
  const { role, canAccess } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Allow time for role to be loaded from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking role
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  const hasRequiredRole = () => {
    if (requiredRole) {
      return role === requiredRole;
    }
    if (allowedRoles) {
      return allowedRoles.includes(role as any);
    }
    return true;
  };

  // Check if user can access current path
  const hasPathAccess = canAccess(pathname);

  // If no role is set, redirect to home
  if (!role) {
    router.push('/');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please select your role to continue.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // If user doesn't have required role or path access, show unauthorized
  if (!hasRequiredRole() || !hasPathAccess) {
    const attemptedAccess = requiredRole || (allowedRoles ? allowedRoles.join(' or ') : 'unknown');
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            <p className="text-gray-600 mb-4">
              You are currently logged in as a <span className="font-semibold text-gray-900">{role}</span>, 
              but this page requires <span className="font-semibold text-gray-900">{attemptedAccess}</span> access.
            </p>
            <div className="text-sm text-gray-500">
              <p className="mb-2">Current role: <span className="font-medium capitalize">{role}</span></p>
              <p>Required role: <span className="font-medium capitalize">{attemptedAccess}</span></p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            <button
              onClick={() => {
                if (role === 'manager') {
                  router.push('/manager/dashboard');
                } else if (role === 'contractor') {
                  router.push('/contractor');
                } else {
                  router.push('/');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
} 