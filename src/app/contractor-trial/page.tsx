'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ContractorTrialPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contractor/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Store trial ID in localStorage for easy access
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Start Your 5-Day Trial
          </h1>
          <p className="text-gray-600">
            Experience automated invoice tracking for 5 days
          </p>
        </div>
        
        {/* Demo Project Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-gray-900 mb-3">Demo Project Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Rate</span>
              <span className="font-medium">$450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Truck Rate</span>
              <span className="font-medium">$150</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span className="font-medium">Calgary Downtown</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trial Duration</span>
              <span className="font-medium">5 days</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Setting up trial...' : 'Start 5-Day Trial'}
          </button>
          
          <p className="text-center text-sm text-gray-500">
            You'll get daily check-ins at 6 PM for 5 days
          </p>
        </form>
      </div>
    </div>
  );
};

export default ContractorTrialPage; 