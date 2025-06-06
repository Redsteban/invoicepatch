'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const DailyCheckIn = () => {
  const [worked, setWorked] = useState<boolean | null>(null);
  const [step, setStep] = useState<'worked' | 'confirm' | 'edit' | 'done'>('worked');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trialInvoiceId, setTrialInvoiceId] = useState<string | null>(null);
  const [dayRate, setDayRate] = useState(450);
  const [truckRate, setTruckRate] = useState(150);
  const [travelKms, setTravelKms] = useState(45);
  const [subsistence, setSubsistence] = useState(75);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get trial invoice ID from URL params or localStorage
    const invoiceId = searchParams.get('invoiceId') || localStorage.getItem('currentInvoiceId');
    if (invoiceId) {
      setTrialInvoiceId(invoiceId);
    }
  }, [searchParams]);

  const saveEntry = async () => {
    if (!trialInvoiceId) {
      alert('No trial invoice ID found. Please start from the contractor setup.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contractor/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialInvoiceId,
          date: new Date().toISOString().split('T')[0],
          worked: worked === true,
          dayRate: dayRate,
          truckUsed: true,
          truckRate: truckRate,
          travelKms: travelKms,
          subsistence: subsistence
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setStep('done');
      } else {
        alert('Failed to save check-in: ' + data.error);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Failed to save check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (worked) {
      total += dayRate; // Day rate
      total += truckRate; // Truck rate
      total += travelKms * 0.68; // Travel reimbursement
      total += subsistence; // Subsistence
      total += (dayRate + truckRate) * 0.05; // GST on taxable items
    }
    return total.toFixed(2);
  };
  
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
                onClick={() => { setWorked(false); saveEntry(); }}
                disabled={isSubmitting}
                className="w-full py-4 border border-[#e5e7eb] rounded-lg hover:border-[#6b7280] transition-all text-[#1a1a1a] disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'No, day off'}
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
                  <span className="font-medium text-[#1a1a1a]">${dayRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Truck</span>
                  <span className="font-medium text-[#1a1a1a]">${truckRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Travel</span>
                  <span className="font-medium text-[#1a1a1a]">{travelKms} km</span>
                </div>
                <div className="border-t border-[#e5e7eb] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-[#1a1a1a] font-medium">Today's total</span>
                    <span className="font-semibold text-[#3b82f6]">${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={saveEntry}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Yes, save today\'s work'}
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
                  value={dayRate}
                  onChange={(e) => setDayRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a1a1a]">
                  Truck rate
                </label>
                <input 
                  type="number" 
                  value={truckRate}
                  onChange={(e) => setTruckRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a1a1a]">
                  Travel distance (km)
                </label>
                <input 
                  type="number" 
                  value={travelKms}
                  onChange={(e) => setTravelKms(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button 
                onClick={saveEntry}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save today\'s work'}
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
                {worked ? "Check-in saved. See you tomorrow at 6 PM" : "Day off logged. Enjoy your time!"}
              </p>
            </div>
            
            <button 
              onClick={() => router.push('/contractor/dashboard/' + trialInvoiceId)}
              className="text-[#3b82f6] hover:text-[#2563eb] transition-colors"
            >
              View your invoice →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f9fafb] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#6b7280]">Loading check-in...</p>
        </div>
      </div>
    }>
      <DailyCheckIn />
    </Suspense>
  );
}
