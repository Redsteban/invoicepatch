'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {user.user_metadata?.full_name || user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link
        href="/login"
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default AuthButton; 