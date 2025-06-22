'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type UserRole = 'manager' | 'contractor' | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isManager: boolean;
  isContractor: boolean;
  canAccess: (path: string) => boolean;
  switchRole: (newRole: UserRole) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize role from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('invoicepatch_user_role') as UserRole;
      if (savedRole === 'manager' || savedRole === 'contractor') {
        setRoleState(savedRole);
        // Set cookie for middleware
        document.cookie = `user-role=${savedRole}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
      }
      setIsLoading(false);
    }
  }, []);

  // Update localStorage and cookie when role changes
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      if (newRole) {
        localStorage.setItem('invoicepatch_user_role', newRole);
        document.cookie = `user-role=${newRole}; path=/; max-age=${60 * 60 * 24 * 30}`;
      } else {
        localStorage.removeItem('invoicepatch_user_role');
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    }
  };

  // Role-based route access control
  const canAccess = (path: string): boolean => {
    const managerRoutes = ['/manager', '/admin'];
    const contractorRoutes = ['/contractor'];
    const publicRoutes = ['/', '/contact-sales', '/pricing', '/unauthorized'];

    // Public routes are always accessible
    if (publicRoutes.some(route => path.startsWith(route))) {
      return true;
    }

    // Check role-specific access
    if (managerRoutes.some(route => path.startsWith(route))) {
      return role === 'manager';
    }

    if (contractorRoutes.some(route => path.startsWith(route))) {
      return role === 'contractor';
    }

    return true; // Default allow for other routes
  };

  // Switch role with navigation
  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    
    // Redirect based on new role
    if (newRole === 'manager') {
      router.push('/manager/dashboard');
    } else if (newRole === 'contractor') {
      router.push('/contractor');
    } else {
      router.push('/');
    }
  };

  // Clear role and redirect to home
  const clearRole = () => {
    setRole(null);
    router.push('/');
  };

  // Check current path access on role or path change
  useEffect(() => {
    if (!isLoading && role && !canAccess(pathname)) {
      // Redirect to appropriate dashboard if user can't access current path
      if (role === 'manager') {
        router.push('/manager/dashboard');
      } else if (role === 'contractor') {
        router.push('/contractor');
      }
    }
  }, [role, pathname, isLoading]);

  const value: RoleContextType = {
    role,
    setRole,
    isManager: role === 'manager',
    isContractor: role === 'contractor',
    canAccess,
    switchRole,
    clearRole,
  };

  // Don't render children until role is loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
} 