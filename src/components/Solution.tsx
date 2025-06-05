'use client';

import { useState, useEffect } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  CalculatorIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  ArrowRightIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

const solutions = [
  {
    id: 'automation',
    icon: ClockIcon,
    title: '2-Minute Automated Invoice Submission',
    before: 'Manual entry: 45 minutes',
    after: 'Automated: 2 minutes',
    description: 'Smart templates auto-fill with your project data, tax calculations, and submission details.',
    animation: 'timer',
    savings: '43 minutes saved per invoice',
  },
  {
    id: 'mileage',
    icon: MapPinIcon,
    title: 'GPS-Verified Mileage Tracking',
    before: 'Manual logs: Error-prone',
    after: 'GPS tracking: 100% accurate',
    description: 'Automatic mileage capture with GPS verification for CRA compliance.',
    animation: 'map',
    savings: '95% more accurate tracking',
  },
  {
    id: 'tax',
    icon: CalculatorIcon,
    title: 'Instant GST/PST Calculations',
    before: 'Manual math: 15% error rate',
    after: 'Auto-calculated: 0% errors',
    description: 'Provincial tax rates automatically applied with real-time CRA compliance checking.',
    animation: 'calculator',
    savings: 'Zero tax calculation errors',
  },
  {
    id: 'status',
    icon: CheckCircleIcon,
    title: 'Real-Time Payment Status',
    before: 'Black hole: No visibility',
    after: 'Live tracking: Full transparency',
    description: 'See exactly where your invoice is in the approval process and expected payment date.',
    animation: 'progress',
    savings: 'End payment uncertainty',
  },
  {
    id: 'approval',
    icon: DocumentCheckIcon,
    title: 'Bulk Manager Approval',
    before: 'Individual reviews: 8 hours',
    after: 'Bulk processing: 30 minutes',
    description: 'Managers can review and approve multiple invoices with smart filtering and validation.',
    animation: 'dashboard',
    savings: '90% faster approvals',
  },
];

export default function Solution() {
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [calculatorValue, setCalculatorValue] = useState(1000);
  const [progressValue, setProgressValue] = useState(0);

  // Timer animation
  useEffect(() => {
    if (activeAnimation === 'timer') {
      const interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [activeAnimation]);

  // Calculator animation
  useEffect(() => {
    if (activeAnimation === 'calculator') {
      const interval = setInterval(() => {
        setCalculatorValue(prev => Math.floor(Math.random() * 5000) + 1000);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [activeAnimation]);

  // Progress animation
  useEffect(() => {
    if (activeAnimation === 'progress') {
      const interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 100) return 0;
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeAnimation]);

  const renderAnimation = (type: string) => {
    switch (type) {
      case 'timer':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-slate-600">Time remaining</div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((120 - timerSeconds) / 120) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      
      case 'map':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-1 mb-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`h-3 rounded ${i === 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-700">📍 Trip: 47.2 km</div>
              <div className="text-sm text-blue-600">GPS verified</div>
            </div>
          </div>
        );
      
      case 'calculator':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-800 mb-2">
                Subtotal: ${calculatorValue.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <div>HST (13%): ${(calculatorValue * 0.13).toFixed(2)}</div>
                <div className="border-t border-gray-200 pt-1 font-semibold text-slate-700">
                  Total: ${(calculatorValue * 1.13).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700">Invoice Status</span>
                <span className="text-blue-600">{progressValue}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-100"
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-600">
                {progressValue < 25 ? 'Submitted' : 
                 progressValue < 50 ? 'Under Review' :
                 progressValue < 75 ? 'Approved' : 'Payment Sent'}
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span className="text-slate-700">Invoice #{1000 + i}</span>
                  <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                </div>
              ))}
              <div className="text-center text-xs text-slate-600 mt-2">
                3 invoices approved in 30 seconds
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-24 flex items-center justify-center">
            <PlayIcon className="h-8 w-8 text-slate-400" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">The Solution</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            InvoicePatch Transforms Your Workflow
          </p>
          <p className="text-lg text-slate-600 leading-8 mb-8">
            Transform your invoice management process with professional-grade automation.
          </p>
        </div>

        {/* Solution Cards */}
        <div className="mb-16">
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {solutions.slice(0, 3).map((solution, index) => (
              <div
                key={solution.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 group"
                onMouseEnter={() => {
                  setActiveAnimation(solution.animation);
                  // Reset animation states
                  setTimerSeconds(120);
                  setProgressValue(0);
                }}
                onMouseLeave={() => setActiveAnimation(null)}
              >
                <div className="flex flex-col h-full">
                  {/* Icon and Title */}
                  <div className="bg-gray-50 rounded-lg p-3 w-fit mb-4 group-hover:bg-blue-50 transition-colors">
                    <solution.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-3 leading-tight">
                    {solution.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed flex-grow">
                    {solution.description}
                  </p>

                  {/* Animation */}
                  <div className="mb-4">
                    <div className="h-24">
                      {renderAnimation(activeAnimation === solution.animation ? solution.animation : 'default')}
                    </div>
                  </div>

                  {/* Before/After */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-100 rounded-full p-1 flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      </div>
                      <span className="text-xs text-slate-600">
                        <span className="font-medium text-slate-700">Before:</span> {solution.before}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-50 rounded-full p-1 flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-xs text-slate-600">
                        <span className="font-medium text-blue-600">After:</span> {solution.after}
                      </span>
                    </div>
                  </div>

                  {/* Savings Badge */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <span className="text-slate-700 font-semibold text-xs">
                      💰 {solution.savings}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl w-full">
              {solutions.slice(3, 5).map((solution, index) => (
                <div
                  key={solution.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 group"
                  onMouseEnter={() => {
                    setActiveAnimation(solution.animation);
                    // Reset animation states
                    setTimerSeconds(120);
                    setProgressValue(0);
                  }}
                  onMouseLeave={() => setActiveAnimation(null)}
                >
                  <div className="flex flex-col h-full">
                    {/* Icon and Title */}
                    <div className="bg-gray-50 rounded-lg p-3 w-fit mb-4 group-hover:bg-blue-50 transition-colors">
                      <solution.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-3 leading-tight">
                      {solution.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed flex-grow">
                      {solution.description}
                    </p>

                    {/* Animation */}
                    <div className="mb-4">
                      <div className="h-24">
                        {renderAnimation(activeAnimation === solution.animation ? solution.animation : 'default')}
                      </div>
                    </div>

                    {/* Before/After */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-100 rounded-full p-1 flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                        </div>
                        <span className="text-xs text-slate-600">
                          <span className="font-medium text-slate-700">Before:</span> {solution.before}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-50 rounded-full p-1 flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-xs text-slate-600">
                          <span className="font-medium text-blue-600">After:</span> {solution.after}
                        </span>
                      </div>
                    </div>

                    {/* Savings Badge */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-slate-700 font-semibold text-xs">
                        💰 {solution.savings}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-3xl mx-auto shadow-sm">
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              Ready to Transform Your Invoicing Process?
            </h3>
            <p className="text-slate-600 mb-6 text-lg">
              See how automated invoice processing can streamline your workflow.
            </p>
            <div className="flex flex-wrap justify-center items-center space-x-8 text-slate-600 text-sm mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <span>2-minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <span>CRA compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 