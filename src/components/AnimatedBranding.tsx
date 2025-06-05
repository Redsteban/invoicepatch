'use client';

import { useEffect, useState } from 'react';

export default function AnimatedBranding() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50 overflow-hidden mobile-container">
      {/* Enhanced background elements with emerald theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Enhanced logo/brand name with emerald theme */}
          <div 
            className={`transition-all duration-700 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-3 sm:mb-4 leading-tight">
              <span className="text-slate-800 font-bold relative">
                Invoice
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-200 rounded-full opacity-30"></span>
              </span>
              <span className="text-emerald-600 font-black relative">
                Patch
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-400 rounded-full"></span>
              </span>
            </h1>
          </div>

          {/* Enhanced tagline with emerald theme */}
          <div 
            className={`transition-all duration-700 delay-200 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-5'
            }`}
          >
            <p className="text-base sm:text-lg md:text-xl text-slate-700 font-medium mb-4 sm:mb-6 leading-relaxed px-2 sm:px-0">
              Sync. Validate. Approve.{' '}
              <span className="text-emerald-600 font-semibold block sm:inline">
                Reconciliation Made Simple.
              </span>
            </p>
          </div>

          {/* Enhanced underline with emerald gradient */}
          <div 
            className={`mx-auto transition-all duration-700 delay-400 ease-out ${
              isVisible 
                ? 'w-24 sm:w-32 opacity-100' 
                : 'w-0 opacity-0'
            }`}
          >
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full shadow-sm"></div>
          </div>

          {/* Subtle animation indicators */}
          <div 
            className={`mt-6 sm:mt-8 transition-all duration-700 delay-600 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-3'
            }`}
          >
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 