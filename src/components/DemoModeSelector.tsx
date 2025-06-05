'use client';

import React from 'react';
import Link from 'next/link';

const DemoModeSelector: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Demo Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how InvoicePatch transforms invoice management for your role. Each demo is tailored to show the specific value for managers and contractors.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Manager Demo */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow group">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👔</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Manager Demo</h2>
              <p className="text-lg text-gray-600">
                Upload invoices, watch AI reconciliation, save 6+ hours weekly
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">⚡</span>
                </div>
                <span className="text-gray-700">Upload 20 invoices in any format</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🤖</span>
                </div>
                <span className="text-gray-700">Watch AI reconcile in 30 seconds</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">💰</span>
                </div>
                <span className="text-gray-700">See $1,200/month savings calculation</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">📊</span>
                </div>
                <span className="text-gray-700">Export to QuickBooks/FieldCap</span>
              </div>
            </div>
            
            <Link href="/manager-intake" className="block">
              <button className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors group-hover:bg-gray-800">
                Start Manager Demo
              </button>
            </Link>
            <p className="text-center text-gray-500 text-sm mt-3">
              5 minutes to see the magic
            </p>
          </div>
          
          {/* Contractor Demo */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow group">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👷</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Contractor Demo</h2>
              <p className="text-lg text-gray-600">
                Daily check-ins, automated invoices, never miss a paycheck
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">📱</span>
                </div>
                <span className="text-gray-700">Daily 6 PM check-in notifications</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🤖</span>
                </div>
                <span className="text-gray-700">Auto-generated professional invoices</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">💸</span>
                </div>
                <span className="text-gray-700">Never miss charges or deadlines</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🇨🇦</span>
                </div>
                <span className="text-gray-700">Perfect Canadian tax compliance</span>
              </div>
            </div>
            
            <Link href="/contractor-trial" className="block">
              <button className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors group-hover:bg-gray-800">
                Start Contractor Demo
              </button>
            </Link>
            <p className="text-center text-gray-500 text-sm mt-3">
              2-week automated trial
            </p>
          </div>
        </div>
        
        {/* Full System Demo */}
        <div className="text-center">
          <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">🔥</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Full System Demo</h2>
              <p className="text-lg text-gray-600">
                See the complete contractor → manager → accounting workflow
              </p>
            </div>
            
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">👷</div>
                  <div className="text-sm font-medium text-gray-700">Contractor Submits</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm font-medium text-gray-700">AI Processes</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">👔</div>
                  <div className="text-sm font-medium text-gray-700">Manager Approves</div>
                </div>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-12 py-4 rounded-lg font-semibold text-xl hover:from-gray-700 hover:to-gray-800 transition-all">
              Experience Full Workflow
            </button>
            <p className="text-gray-500 mt-3">
              Complete end-to-end demonstration
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Not sure which demo to try? Start with the Manager Demo to see immediate ROI.
          </p>
          <Link href="/manager-intake" className="inline-flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors">
            Jump straight to Manager Demo 
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DemoModeSelector; 