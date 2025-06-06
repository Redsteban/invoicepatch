'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ContractorTrialPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal info
    name: '',
    email: '',
    phone: '',
    // Invoice details
    invoiceSequence: '',
    dayRate: 450,
    truckRate: 150,
    travelKms: 45,
    travelRatePerKm: 0.68,
    subsistence: 75,
    location: 'Calgary Downtown Site',
    company: 'Demo Construction Ltd'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        setError('Name and email are required');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contractor/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          invoiceSequence: formData.invoiceSequence,
          dayRate: formData.dayRate,
          truckRate: formData.truckRate,
          travelKms: formData.travelKms,
          subsistence: formData.subsistence,
          location: formData.location,
          company: formData.company
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('trialInvoiceId', data.invoiceId);
        router.push(`/contractor/dashboard/${data.invoiceId}`);
      } else {
        setError(data.error || 'Failed to start trial');
      }
    } catch (err) {
      console.error('Trial setup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 1) {
    // Personal Information Step
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Start Your 5-Day Trial
            </h1>
            <p className="text-gray-600">
              Step 1 of 2: Personal Information
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
            <input 
              type="text" 
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input 
              type="email" 
              placeholder="Email for notifications"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input 
              type="tel" 
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            
            <button 
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Next: Invoice Details
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 2) {
    // Invoice Details Step
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Invoice Details
            </h1>
            <p className="text-gray-600">
              Step 2 of 2: Set your rates and project details
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Sequence Number
              </label>
              <input 
                type="text" 
                placeholder="e.g., INV-001"
                value={formData.invoiceSequence}
                onChange={(e) => setFormData({...formData, invoiceSequence: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day Rate ($)
                </label>
                <input 
                  type="number" 
                  value={formData.dayRate}
                  onChange={(e) => setFormData({...formData, dayRate: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Truck Rate ($)
                </label>
                <input 
                  type="number" 
                  value={formData.truckRate}
                  onChange={(e) => setFormData({...formData, truckRate: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel KMs
                </label>
                <input 
                  type="number" 
                  value={formData.travelKms}
                  onChange={(e) => setFormData({...formData, travelKms: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate per KM ($)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.travelRatePerKm}
                  onChange={(e) => setFormData({...formData, travelRatePerKm: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subsistence (Non-taxable) ($)
              </label>
              <input 
                type="number" 
                value={formData.subsistence}
                onChange={(e) => setFormData({...formData, subsistence: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Location
              </label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input 
                type="text" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Daily Total Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Daily Total Preview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Day Rate:</span>
                  <span>${formData.dayRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Truck Rate:</span>
                  <span>${formData.truckRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel ({formData.travelKms}km @ ${formData.travelRatePerKm}/km):</span>
                  <span>${(formData.travelKms * formData.travelRatePerKm).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subsistence:</span>
                  <span>${formData.subsistence.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% on taxable):</span>
                  <span>${((formData.dayRate + formData.truckRate) * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-medium">
                  <span>Total per day:</span>
                  <span>${(formData.dayRate + formData.truckRate + (formData.travelKms * formData.travelRatePerKm) + formData.subsistence + ((formData.dayRate + formData.truckRate) * 0.05)).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Setting up trial...' : 'Start 5-Day Trial'}
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-500">
              You'll get daily check-ins at 6 PM for 5 days
            </p>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default ContractorTrialPage; 