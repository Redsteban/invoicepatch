'use client';

import { useState } from 'react';

const DailyCheckIn = () => {
  const [worked, setWorked] = useState<boolean | null>(null);
  const [step, setStep] = useState<'worked' | 'confirm' | 'edit' | 'done'>('worked');
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-16">
        {/* Simple header */}
        <div className="mb-8">
          <p className="text-sm text-[#9ca3af]">Daily Check-in</p>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h1>
        </div>
        
        {step === 'worked' && (
          <div>
            <h2 className="text-lg font-medium text-[#1a1a1a] mb-6">
              Did you work today?
            </h2>
            <div className="space-y-3">
              <button 
                onClick={() => { setWorked(true); setStep('confirm'); }}
                className="w-full py-4 border border-[#e5e7eb] rounded-lg hover:border-[#3b82f6] hover:bg-[#f0f9ff] transition-all text-[#1a1a1a]"
              >
                Yes, I worked
              </button>
              <button 
                onClick={() => { setWorked(false); setStep('done'); }}
                className="w-full py-4 border border-[#e5e7eb] rounded-lg hover:border-[#6b7280] transition-all text-[#1a1a1a]"
              >
                No, day off
              </button>
            </div>
          </div>
        )}
        
        {step === 'confirm' && (
          <div>
            <h2 className="text-lg font-medium text-[#1a1a1a] mb-6">
              Everything standard today?
            </h2>
            
            {/* Clean summary card */}
            <div className="bg-[#f9fafb] rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Day rate</span>
                  <span className="font-medium text-[#1a1a1a]">$450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Truck</span>
                  <span className="font-medium text-[#1a1a1a]">$150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Travel</span>
                  <span className="font-medium text-[#1a1a1a]">45 km</span>
                </div>
                <div className="border-t border-[#e5e7eb] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-[#1a1a1a] font-medium">Today's total</span>
                    <span className="font-semibold text-[#3b82f6]">$673.50</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setStep('done')}
                className="w-full py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
              >
                Yes, save today's work
              </button>
              <button 
                onClick={() => setStep('edit')}
                className="w-full py-3 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors text-[#1a1a1a]"
              >
                No, something's different
              </button>
            </div>
          </div>
        )}
        
        {step === 'edit' && (
          <div>
            <h2 className="text-lg font-medium text-[#1a1a1a] mb-6">
              What's different today?
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a1a1a]">
                  Day rate
                </label>
                <input 
                  type="number" 
                  defaultValue="450"
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a1a1a]">
                  Truck usage
                </label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors text-[#1a1a1a]">
                  <option value="150">Yes - $150</option>
                  <option value="0">No truck today</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a1a1a]">
                  Travel distance (km)
                </label>
                <input 
                  type="number" 
                  defaultValue="45"
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button 
                onClick={() => setStep('done')}
                className="w-full py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
              >
                Save today's work
              </button>
              <button 
                onClick={() => setStep('confirm')}
                className="w-full py-3 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors text-[#1a1a1a]"
              >
                Back
              </button>
            </div>
          </div>
        )}
        
        {step === 'done' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#dbeafe] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-[#1a1a1a]">All set!</h2>
              <p className="text-[#6b7280]">
                {worked ? "See you tomorrow at 6 PM" : "Enjoy your day off!"}
              </p>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="text-[#3b82f6] hover:text-[#2563eb] transition-colors"
            >
              View dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCheckIn; 