'use client';

import { useEffect, useState } from 'react';

export default function AnimatedBranding() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 overflow-hidden">
      {/* Simplified background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Simplified logo/brand name */}
          <div 
            className={`transition-all duration-500 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-5'
            }`}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-4">
              <span className="text-blue-600 font-bold">Invoice</span>
              <span className="text-emerald-700 font-black">Patch</span>
            </h1>
          </div>

          {/* Simplified tagline */}
          <div 
            className={`transition-all duration-500 delay-200 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-5'
            }`}
          >
            <p className="text-lg sm:text-xl text-slate-700 font-medium mb-6">
              Sync. Validate. Approve.{' '}
              <span className="text-blue-600 font-semibold">
                Reconciliation Made Simple.
              </span>
            </p>
          </div>

          {/* Simplified underline */}
          <div 
            className={`mx-auto transition-all duration-500 delay-300 ease-out ${
              isVisible 
                ? 'w-32 opacity-100' 
                : 'w-0 opacity-0'
            }`}
          >
            <div className="h-1 bg-gradient-to-r from-blue-400 via-emerald-500 to-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 