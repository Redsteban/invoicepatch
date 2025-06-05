'use client';

import { useState } from 'react';
import Link from 'next/link';

// Minimalistic Contractor Trial Component
export const ContractorTrialMinimal = () => {
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
};

// Minimalistic Manager Demo Component
export const ManagerDemoMinimal = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'upload' | 'processing' | 'results'>('intro');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // File upload handling
  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setUploadedFiles(Array.from(files));
      setCurrentStep('processing');
      
      // Simulate processing
      setTimeout(() => {
        setCurrentStep('results');
      }, 2000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  // Intro Screen
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
              Manager Demo
            </h1>
            <p className="text-[#6b7280]">
              See how InvoicePatch eliminates manual reconciliation
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Upload Sample Invoices</h3>
              <p className="text-sm text-[#6b7280]">
                We'll show you how 20+ contractor invoices get reconciled in under 3 minutes
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            <button 
              onClick={() => setCurrentStep('upload')}
              className="w-full bg-[#3b82f6] text-white py-4 rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
            >
              Start Demo
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-[#9ca3af]">
                No signup required • Takes 3 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Upload Screen
  if (currentStep === 'upload') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
              Upload Invoices
            </h1>
            <p className="text-[#6b7280]">
              Drop your contractor invoices or use sample data
            </p>
          </div>
          
          <div 
            className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-12 text-center mb-8 hover:border-[#3b82f6] transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="text-4xl mb-4">📤</div>
            <p className="text-[#6b7280] mb-4">Drop PDF invoices here</p>
            <input 
              type="file" 
              multiple 
              accept=".pdf,.jpg,.png" 
              onChange={handleFileSelect}
              className="hidden" 
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              className="inline-block border border-[#e5e7eb] px-4 py-2 rounded-lg text-[#6b7280] hover:border-[#3b82f6] cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>
          
          <div className="space-y-3">
            <div className="text-center text-[#9ca3af] text-sm">OR</div>
            
            <button 
              onClick={() => {
                // Simulate sample file upload
                const mockFiles = [
                  new File([''], 'contractor_1.pdf', { type: 'application/pdf' }),
                  new File([''], 'contractor_2.pdf', { type: 'application/pdf' }),
                  new File([''], 'contractor_3.pdf', { type: 'application/pdf' })
                ];
                setUploadedFiles(mockFiles);
                setCurrentStep('processing');
                setTimeout(() => setCurrentStep('results'), 2000);
              }}
              className="w-full border border-[#3b82f6] text-[#3b82f6] py-4 rounded-lg font-medium hover:bg-[#f9fafb] transition-colors"
            >
              Use Sample Invoices
            </button>
          </div>
          
          <div className="mt-8">
            <button 
              onClick={() => setCurrentStep('intro')}
              className="w-full text-[#6b7280] text-center py-4 hover:text-[#1a1a1a] transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing Screen
  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-2xl font-semibent text-[#1a1a1a] mb-2">
              Processing Invoices
            </h1>
            <p className="text-[#6b7280]">
              Reconciling with your ERP system
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#6b7280]">Matching AFE codes and rates...</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                <span className="text-sm text-[#1a1a1a]">Reading invoices</span>
                <span className="text-xs text-[#059669]">✓ Complete</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                <span className="text-sm text-[#1a1a1a]">Matching work orders</span>
                <span className="text-xs text-[#059669]">✓ Complete</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f3f4f6] rounded-lg">
                <span className="text-sm text-[#1a1a1a]">Validating rates</span>
                <span className="text-xs text-[#3b82f6]">In progress...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
            Reconciliation Complete
          </h1>
          <p className="text-[#6b7280]">
            {uploadedFiles.length} invoices processed in 47 seconds
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 bg-[#f0f9ff] border border-[#3b82f6]/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#1a1a1a] mb-1">94.7%</div>
              <div className="text-sm text-[#6b7280]">Auto-matched successfully</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb] rounded-lg">
              <div>
                <div className="text-sm font-medium text-[#1a1a1a]">Contractor invoices</div>
                <div className="text-xs text-[#6b7280]">Ready for approval</div>
              </div>
              <div className="text-sm text-[#059669]">{uploadedFiles.length} matched</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb] rounded-lg">
              <div>
                <div className="text-sm font-medium text-[#1a1a1a]">Time saved</div>
                <div className="text-xs text-[#6b7280]">vs manual reconciliation</div>
              </div>
              <div className="text-sm text-[#059669]">7.3 hours</div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 space-y-3">
          <Link
            href="/pricing"
            className="w-full block bg-[#3b82f6] text-white text-center py-4 rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
          >
            See Pricing
          </Link>
          
          <button 
            onClick={() => {
              setCurrentStep('intro');
              setUploadedFiles([]);
            }}
            className="w-full border border-[#e5e7eb] text-[#6b7280] text-center py-4 rounded-lg hover:border-[#3b82f6] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}; 