'use client';

import { useEffect, useState } from 'react';

export default function AnimatedBranding() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated logo/brand name */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95'
            }`}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-4 flex flex-wrap justify-center items-center gap-4">
              {/* Invoice part */}
              <span className="inline-block">
                {['I', 'n', 'v', 'o', 'i', 'c', 'e'].map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block text-emerald-600 hover:text-emerald-700 transition-all duration-300 hover:scale-110 cursor-default"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.8s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
              
              {/* Patch part */}
              <span className="inline-block">
                {['P', 'a', 't', 'c', 'h'].map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block text-emerald-800 hover:text-emerald-900 transition-all duration-300 hover:scale-110 cursor-default font-black"
                    style={{
                      animationDelay: `${(index + 7) * 0.1}s`,
                      animation: 'fadeInUp 0.8s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          {/* Tagline with animation */}
          <div 
            className={`transition-all duration-1000 delay-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-5'
            }`}
          >
            <p className="text-lg sm:text-xl text-emerald-700 font-medium mb-6">
              Sync. Validate. Approve.{' '}
              <span className="text-emerald-800 font-semibold">
                Reconciliation Made Simple.
              </span>
            </p>
          </div>

          {/* Animated underline */}
          <div 
            className={`mx-auto transition-all duration-1000 delay-1200 ease-out ${
              isVisible 
                ? 'w-32 opacity-100' 
                : 'w-0 opacity-0'
            }`}
          >
            <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full"></div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-emerald-500 rounded-full animate-bounce opacity-40" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/6 w-2 h-2 bg-emerald-600 rounded-full animate-bounce opacity-50" style={{ animationDelay: '2.5s' }}></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(16, 185, 129, 0.3) 0%,
            rgba(16, 185, 129, 0.8) 50%,
            rgba(16, 185, 129, 0.3) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 