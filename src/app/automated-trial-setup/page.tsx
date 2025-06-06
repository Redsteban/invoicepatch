'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AutomatedTrialSetup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/contractor/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to contractor dashboard with the created invoice
        router.push(`/contractor/dashboard/${data.invoiceId}`);
      } else {
        setError(data.error || 'Setup failed. Please try again.');
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
            Almost Ready!
          </h1>
          <p className="text-[#6b7280]">
            We'll create a real demo project for you
          </p>
        </div>
        
        {/* Clean info card */}
        <div className="bg-[#f9fafb] rounded-lg p-6 mb-8">
          <h3 className="font-medium text-[#1a1a1a] mb-3">Demo Project Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Daily Rate</span>
              <span className="font-medium text-[#1a1a1a]">$450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Location</span>
              <span className="font-medium text-[#1a1a1a]">Calgary Downtown</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Duration</span>
              <span className="font-medium text-[#1a1a1a]">2 weeks</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg">
            <p className="text-sm text-[#dc2626]">{error}</p>
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors"
          />
          <input 
            type="email" 
            placeholder="Email for notifications"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors"
          />
          <input 
            type="tel" 
            placeholder="Phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors"
          />
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating your demo...' : 'Start Trial'}
          </button>
          
          <p className="text-center text-sm text-[#9ca3af]">
            You'll get daily check-ins at 6 PM
          </p>
        </form>
      </div>
    </div>
  );
};

export default AutomatedTrialSetup; 