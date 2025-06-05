'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContractorTrial() {
  const [selectedOption, setSelectedOption] = useState<'quick' | 'full' | null>(null);

  // Quick Start Setup Screen
  if (selectedOption === 'quick') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
              Quick Start Setup
            </h1>
            <p className="text-[#6b7280]">
              Create your first invoice in 2 minutes
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#1a1a1a]">
                Your Name
              </label>
              <input 
                type="text" 
                className="w-full px-0 py-3 border-0 border-b border-[#e5e7eb] focus:border-[#3b82f6] focus:ring-0 bg-transparent text-[#1a1a1a] placeholder-[#9ca3af]"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#1a1a1a]">
                Company Name
              </label>
              <input 
                type="text" 
                className="w-full px-0 py-3 border-0 border-b border-[#e5e7eb] focus:border-[#3b82f6] focus:ring-0 bg-transparent text-[#1a1a1a] placeholder-[#9ca3af]"
                placeholder="Your business name"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#1a1a1a]">
                Daily Rate
              </label>
              <input 
                type="number" 
                className="w-full px-0 py-3 border-0 border-b border-[#e5e7eb] focus:border-[#3b82f6] focus:ring-0 bg-transparent text-[#1a1a1a] placeholder-[#9ca3af]"
                placeholder="850"
              />
            </div>
          </div>
          
          <div className="mt-16">
            <Link
              href="/invoice-setup"
              className="w-full block bg-[#3b82f6] text-white text-center py-4 rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
            >
              Create First Invoice
            </Link>
            
            <button 
              onClick={() => setSelectedOption(null)}
              className="w-full text-[#6b7280] text-center py-4 mt-2 hover:text-[#1a1a1a] transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full Experience Setup Screen
  if (selectedOption === 'full') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
              Full Experience Setup
            </h1>
            <p className="text-[#6b7280]">
              See automated daily check-ins in action
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#1a1a1a]">
                Your Name
              </label>
              <input 
                type="text" 
                className="w-full px-0 py-3 border-0 border-b border-[#e5e7eb] focus:border-[#3b82f6] focus:ring-0 bg-transparent text-[#1a1a1a] placeholder-[#9ca3af]"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#1a1a1a]">
                Email
              </label>
              <input 
                type="email" 
                className="w-full px-0 py-3 border-0 border-b border-[#e5e7eb] focus:border-[#3b82f6] focus:ring-0 bg-transparent text-[#1a1a1a] placeholder-[#9ca3af]"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#1a1a1a]">
                Phone Number
              </label>
              <input 
                type="tel" 
                className="w-full px-0 py-3 border-0 border-b border-[#e5e7eb] focus:border-[#3b82f6] focus:ring-0 bg-transparent text-[#1a1a1a] placeholder-[#9ca3af]"
                placeholder="(403) 555-0123"
              />
            </div>
            
            <div className="p-4 bg-[#f9fafb] rounded-lg">
              <p className="text-sm text-[#6b7280]">
                We'll send you a daily 6 PM text asking about your work. 
                You can reply directly to create invoices.
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            <Link
              href="/automated-trial-setup"
              className="w-full block bg-[#3b82f6] text-white text-center py-4 rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
            >
              Start Automated Trial
            </Link>
            
            <button 
              onClick={() => setSelectedOption(null)}
              className="w-full text-[#6b7280] text-center py-4 mt-2 hover:text-[#1a1a1a] transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial Selection Screen
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
            Start Your Trial
          </h1>
          <p className="text-[#6b7280]">
            Choose how you'd like to experience InvoicePatch
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedOption('quick')}
            className="w-full p-6 border border-[#e5e7eb] rounded-lg text-left hover:border-[#3b82f6] transition-colors group"
          >
            <h3 className="font-medium text-[#1a1a1a] mb-1">Quick Start</h3>
            <p className="text-sm text-[#6b7280]">Manual invoice creation • 2 min setup</p>
          </button>
          
          <button 
            onClick={() => setSelectedOption('full')}
            className="w-full p-6 border-2 border-[#3b82f6] rounded-lg text-left bg-[#f9fafb] group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">Full Experience</h3>
                <p className="text-sm text-[#6b7280]">Automated daily check-ins • See the magic</p>
              </div>
              <span className="text-xs bg-[#3b82f6] text-white px-2 py-1 rounded">RECOMMENDED</span>
            </div>
          </button>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-[#9ca3af]">
            Both options are completely free
          </p>
        </div>
      </div>
    </div>
  );
} 