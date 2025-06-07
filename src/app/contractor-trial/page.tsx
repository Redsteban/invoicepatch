'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  phone: string;
  invoiceSequence: string;
  dayRate: number;
  truckRate: number;
  travelKms: number;
  travelRatePerKm: number;
  subsistence: number;
  location: string;
  company: string;
  useCustomStartDate: boolean;
  customStartDate: string;
  rateType: 'daily' | 'hourly';
  hourlyRate: number;
  createAccount: boolean;
  password: string;
  // Manual schedule options
  useManualSchedule: boolean;
  cutoffDay: string; // Day of week or specific date
  submissionDay: string; // Day of week or specific date
  scheduleType: 'weekly' | 'biweekly' | 'custom';
  customCutoffDate: string;
  customSubmissionDate: string;
}

const ContractorTrialPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAccessTrial, setShowAccessTrial] = useState(false);
  const [accessEmail, setAccessEmail] = useState('');
  const [accessLoading, setAccessLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    invoiceSequence: '',
    dayRate: 750,
    truckRate: 75,
    travelKms: 100,
    travelRatePerKm: 0.68,
    subsistence: 60,
    location: '',
    company: '',
    useCustomStartDate: false,
    customStartDate: '',
    rateType: 'daily',
    hourlyRate: 45,
    createAccount: false,
    password: '',
    // Manual schedule defaults
    useManualSchedule: false,
    cutoffDay: 'friday',
    submissionDay: 'monday',
    scheduleType: 'biweekly',
    customCutoffDate: '',
    customSubmissionDate: ''
  });

  const calculatePayPeriods = (startDate: string, useManual = false) => {
    const start = new Date(startDate);
    const periods = [];
    
    if (useManual && formData.useManualSchedule) {
      // IMPROVED: Manual schedule calculation with better logic
      if (formData.scheduleType === 'custom' && formData.customCutoffDate && formData.customSubmissionDate) {
        // Custom specific dates - calculate subsequent periods
        const cutoffDate = new Date(formData.customCutoffDate);
        const submissionDate = new Date(formData.customSubmissionDate);
        
        for (let i = 1; i <= 6; i++) { // Show more periods for planning
          const periodStart = new Date(start);
          const periodCutoff = new Date(cutoffDate);
          const periodSubmission = new Date(submissionDate);
          
          // Add weeks to each subsequent period
          const weeksToAdd = (i - 1) * 2; // Bi-weekly
          periodStart.setDate(periodStart.getDate() + (weeksToAdd * 7));
          periodCutoff.setDate(periodCutoff.getDate() + (weeksToAdd * 7));
          periodSubmission.setDate(periodSubmission.getDate() + (weeksToAdd * 7));
          
          periods.push({
            period: i,
            workStart: periodStart.toISOString().split('T')[0],
            cutoffDate: periodCutoff.toISOString().split('T')[0],
            submissionDate: periodSubmission.toISOString().split('T')[0],
            type: 'custom-recurring'
          });
        }
      } else {
        // IMPROVED: Weekly or biweekly with proper day-of-week calculation
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const cutoffDayIndex = dayNames.indexOf(formData.cutoffDay.toLowerCase());
        const submissionDayIndex = dayNames.indexOf(formData.submissionDay.toLowerCase());
        
        const periodLength = formData.scheduleType === 'weekly' ? 7 : 14;
        
        for (let i = 1; i <= 6; i++) { // Show more periods
          // Calculate period start
          const periodStart = new Date(start);
          if (i > 1) {
            periodStart.setDate(start.getDate() + ((i - 1) * periodLength));
          }
          
          // Find the cutoff date (last day of period)
          const cutoffDate = new Date(periodStart);
          cutoffDate.setDate(cutoffDate.getDate() + periodLength - 1);
          
          // Adjust to correct day of week
          const cutoffDayDiff = (cutoffDayIndex - cutoffDate.getDay() + 7) % 7;
          cutoffDate.setDate(cutoffDate.getDate() + cutoffDayDiff);
          
          // Find submission date (after cutoff)
          const submissionDate = new Date(cutoffDate);
          const submissionDayDiff = (submissionDayIndex - cutoffDate.getDay() + 7) % 7;
          submissionDate.setDate(submissionDate.getDate() + (submissionDayDiff || 7)); // Next occurrence
          
          periods.push({
            period: i,
            workStart: periodStart.toISOString().split('T')[0],
            cutoffDate: cutoffDate.toISOString().split('T')[0],
            submissionDate: submissionDate.toISOString().split('T')[0],
            type: formData.scheduleType,
            description: `Period ${i}: ${periodStart.toLocaleDateString()} - ${cutoffDate.toLocaleDateString()}`
          });
        }
      }
    } else {
      // IMPROVED: Default automatic calculation
      const firstCutoff = new Date(start);
      firstCutoff.setDate(firstCutoff.getDate() + 13); // 14-day period (0-indexed)
      
      const firstSubmission = new Date(firstCutoff);
      firstSubmission.setDate(firstSubmission.getDate() + 1);
      
      // Generate 6 periods for better planning visibility
      for (let i = 1; i <= 6; i++) {
        const periodStart = new Date(start);
        const periodCutoff = new Date(firstCutoff);
        const periodSubmission = new Date(firstSubmission);
        
        // Add 14 days for each subsequent period
        const daysToAdd = (i - 1) * 14;
        periodStart.setDate(periodStart.getDate() + daysToAdd);
        periodCutoff.setDate(periodCutoff.getDate() + daysToAdd);
        periodSubmission.setDate(periodSubmission.getDate() + daysToAdd);
        
        periods.push({
          period: i,
          workStart: periodStart.toISOString().split('T')[0],
          cutoffDate: periodCutoff.toISOString().split('T')[0],
          submissionDate: periodSubmission.toISOString().split('T')[0],
          type: i === 1 ? 'initial' : 'regular',
          description: `Period ${i}: ${periodStart.toLocaleDateString()} - ${periodCutoff.toLocaleDateString()}`
        });
      }
    }
    
    return periods;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? parseFloat(value) || 0 
              : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // If user wants to create an account, sign them up first
      if (formData.createAccount && formData.password) {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone
          })
        });

        const authResult = await response.json();
        if (!authResult.success && !authResult.error?.includes('already registered')) {
          setError(authResult.error || 'Failed to create account');
          setIsSubmitting(false);
          return;
        }
      }

      // Create the trial
      const response = await fetch('/api/contractor/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ratePerKm: formData.travelRatePerKm
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/contractor/dashboard/${data.invoiceId}`);
      } else {
        setError(data.error || 'Failed to setup trial');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccessTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccessLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contractor/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: accessEmail
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/contractor/dashboard/${data.trial.id}`);
      } else {
        setError(data.error || 'Failed to access trial');
      }
    } catch (error) {
      console.error('Access error:', error);
      setError('Failed to connect to server');
    } finally {
      setAccessLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Step 1: Basic Information + Account Creation Option
  if (step === 1) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Start Your 15-Day Trial
            </h1>
            <p className="text-gray-600">
              Experience the full power of automated invoicing
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Company you work for"
                />
              </div>
            </div>

            {/* Account Creation Option */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="createAccount"
                  name="createAccount"
                  checked={formData.createAccount}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="createAccount" className="text-sm font-medium text-blue-900 cursor-pointer">
                    Create a secure account (Recommended)
                  </label>
                  <p className="text-xs text-blue-700 mt-1">
                    Protect your trial data and easily access it from any device. You can also access your trial without an account using just your email.
                  </p>
                </div>
              </div>

              {formData.createAccount && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-blue-900 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={formData.createAccount}
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Create a secure password (min. 6 characters)"
                    minLength={6}
                  />
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Next: Invoice Details
            </button>
          </form>

          {/* Access Existing Trial */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Already have a trial?</p>
              <button
                onClick={() => setShowAccessTrial(!showAccessTrial)}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                {showAccessTrial ? 'Hide' : 'Access Existing Trial'}
              </button>
            </div>

            {showAccessTrial && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <form onSubmit={handleAccessTrial} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your trial email"
                      value={accessEmail}
                      onChange={(e) => setAccessEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={accessLoading}
                    className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {accessLoading ? 'Finding Trial...' : 'Access My Trial'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Invoice Details
  if (step === 2) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Invoice Details
            </h1>
            <p className="text-gray-600">
              Set up your rates and invoice preferences
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Sequence Number *
                </label>
                <input 
                  type="text" 
                  name="invoiceSequence"
                  value={formData.invoiceSequence}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 140177"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 15-02-77-14W6"
                />
              </div>
            </div>

            {/* Rate Type Selection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate Type *
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="daily"
                    name="rateType"
                    value="daily"
                    checked={formData.rateType === 'daily'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="daily" className="ml-2 text-sm text-gray-700">
                    Daily Rate (Fixed amount per day)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="hourly"
                    name="rateType"
                    value="hourly"
                    checked={formData.rateType === 'hourly'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="hourly" className="ml-2 text-sm text-gray-700">
                    Hourly Rate (With BC overtime rules)
                  </label>
                </div>
              </div>
            </div>

            {/* Rate Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.rateType === 'daily' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day Rate ($) *
                  </label>
                  <input 
                    type="number" 
                    name="dayRate"
                    value={formData.dayRate}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="750.00"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate ($) *
                  </label>
                  <input 
                    type="number" 
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="45.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Overtime: 1.5x after 8hrs, 2x after 12hrs
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Truck Rate ($) *
                </label>
                <input 
                  type="number" 
                  name="truckRate"
                  value={formData.truckRate}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="75.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Distance (km) *
                </label>
                <input 
                  type="number" 
                  name="travelKms"
                  value={formData.travelKms}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Rate ($/km) *
                </label>
                <input 
                  type="number" 
                  name="travelRatePerKm"
                  value={formData.travelRatePerKm}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0.68"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subsistence ($) *
                </label>
                <input 
                  type="number" 
                  name="subsistence"
                  value={formData.subsistence}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="60.00"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Next: Schedule Setup
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Schedule Setup
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schedule Setup
          </h1>
          <p className="text-gray-600">
            Configure your work schedule and pay periods
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Start Date Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              When do you want to start your trial? *
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="startToday"
                  name="useCustomStartDate"
                  checked={!formData.useCustomStartDate}
                  onChange={() => setFormData(prev => ({ ...prev, useCustomStartDate: false }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="startToday" className="ml-2 text-sm text-gray-700">
                  Start today
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="customStart"
                  name="useCustomStartDate"
                  checked={formData.useCustomStartDate}
                  onChange={() => setFormData(prev => ({ ...prev, useCustomStartDate: true }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="customStart" className="ml-2 text-sm text-gray-700">
                  Choose a custom start date
                </label>
              </div>
            </div>

            {formData.useCustomStartDate && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Start Date *
                </label>
                <input
                  type="date"
                  name="customStartDate"
                  value={formData.customStartDate}
                  onChange={handleInputChange}
                  required={formData.useCustomStartDate}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Manual Schedule Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pay Period Schedule *
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="autoSchedule"
                  name="useManualSchedule"
                  checked={!formData.useManualSchedule}
                  onChange={() => setFormData(prev => ({ ...prev, useManualSchedule: false }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="autoSchedule" className="ml-2 text-sm text-gray-700">
                  Use automatic schedule (recommended)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="manualSchedule"
                  name="useManualSchedule"
                  checked={formData.useManualSchedule}
                  onChange={() => setFormData(prev => ({ ...prev, useManualSchedule: true }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="manualSchedule" className="ml-2 text-sm text-gray-700">
                  Set custom cutoff and submission dates
                </label>
              </div>
            </div>

            {/* Manual Schedule Configuration */}
            {formData.useManualSchedule && (
              <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Schedule Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="weekly"
                        name="scheduleType"
                        value="weekly"
                        checked={formData.scheduleType === 'weekly'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="weekly" className="ml-2 text-sm text-gray-700">
                        Weekly
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="biweekly"
                        name="scheduleType"
                        value="biweekly"
                        checked={formData.scheduleType === 'biweekly'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="biweekly" className="ml-2 text-sm text-gray-700">
                        Bi-weekly
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="custom"
                        name="scheduleType"
                        value="custom"
                        checked={formData.scheduleType === 'custom'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="custom" className="ml-2 text-sm text-gray-700">
                        Custom dates
                      </label>
                    </div>
                  </div>
                </div>

                {/* Day of Week Selection for Weekly/Biweekly */}
                {(formData.scheduleType === 'weekly' || formData.scheduleType === 'biweekly') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cutoff Day *
                      </label>
                      <select
                        name="cutoffDay"
                        value={formData.cutoffDay}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Last day to submit work for the period
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Submission Day *
                      </label>
                      <select
                        name="submissionDay"
                        value={formData.submissionDay}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        When invoices are submitted
                      </p>
                    </div>
                  </div>
                )}

                {/* Custom Date Selection */}
                {formData.scheduleType === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cutoff Date *
                      </label>
                      <input
                        type="date"
                        name="customCutoffDate"
                        value={formData.customCutoffDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Specific cutoff date for this period
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Submission Date *
                      </label>
                      <input
                        type="date"
                        name="customSubmissionDate"
                        value={formData.customSubmissionDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        When the invoice will be submitted
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pay Period Preview */}
          {(formData.useCustomStartDate && formData.customStartDate) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-3">📅 Pay Period Preview</h3>
              <div className="space-y-2 text-sm text-blue-700">
                {calculatePayPeriods(formData.customStartDate, formData.useManualSchedule).map((period) => (
                  <div key={period.period} className="flex justify-between">
                    <span>Period {period.period} ({period.type}):</span>
                    <span>
                      {period.workStart} → cutoff {period.cutoffDate} → submit {period.submissionDate}
                    </span>
                  </div>
                ))}
              </div>
              {formData.useManualSchedule && (
                <div className="mt-3 p-3 bg-blue-100 rounded-md">
                  <p className="text-xs text-blue-800">
                    <strong>Manual schedule:</strong> Cutoff on {formData.scheduleType === 'custom' ? formData.customCutoffDate : `every ${formData.cutoffDay}`}, 
                    submit on {formData.scheduleType === 'custom' ? formData.customSubmissionDate : `every ${formData.submissionDay}`}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={prevStep}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Setting Up Trial...' : 'Start My 15-Day Trial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractorTrialPage; 