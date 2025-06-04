'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TruckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

import { useForm } from 'react-hook-form';
import { formatCAD } from '@/lib/albertaTax';

interface SetupFormData {
  // Company/Client Information
  company: string;
  location: string;
  ticketNumber: string;
  contactPerson: string;
  contactEmail: string;
  
  // Rate Information
  dayRate: number;
  truckRate: number;
  travelRate: number;
  
  // Work Schedule
  workDays: string[];
  startDate: string;
  expectedDuration: number;
  
  // Additional Settings
  travelKMs: number;
  subsistence: number;
  includeGST: boolean;
  
  // Contractor Info
  contractorName: string;
  contractorAddress: string;
  gstNumber: string;
}

const WORK_DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

const SETUP_STEPS = [
  { id: 'company', title: 'Company Info', icon: BuildingOfficeIcon },
  { id: 'rates', title: 'Rates & Pricing', icon: CurrencyDollarIcon },
  { id: 'schedule', title: 'Work Schedule', icon: CalendarDaysIcon },
  { id: 'contractor', title: 'Your Info', icon: DocumentTextIcon }
];

function SetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingTrialId, setExistingTrialId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<SetupFormData>({
    mode: 'onChange',
    defaultValues: {
      company: 'Stack Testing Inc.',
      location: 'Alberta, Canada',
      ticketNumber: '',
      contactPerson: 'Stack Production Manager',
      contactEmail: 'production@stacktesting.ca',
      dayRate: 850,
      truckRate: 150,
      travelRate: 0.68,
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      travelKMs: 0,
      subsistence: 75,
      includeGST: true,
      contractorName: '',
      contractorAddress: '',
      gstNumber: ''
    }
  });

  const watchedValues = watch();

  // Load existing trial data if editing
  useEffect(() => {
    const loadExistingTrial = async () => {
      const trialId = searchParams.get('trial') || localStorage.getItem('currentTrialId');
      if (trialId) {
        try {
          const response = await fetch(`/api/setup-trial-invoice?trial=${trialId}`);
          if (response.ok) {
            const data = await response.json();
            const trial = data.trial;
            
            // Pre-populate form with existing data
            setValue('company', trial.company || 'Stack Testing Inc.');
            setValue('location', trial.location || 'Alberta, Canada');
            setValue('ticketNumber', trial.ticket_number || '');
            setValue('dayRate', trial.day_rate || 850);
            setValue('truckRate', trial.truck_rate || 150);
            setValue('workDays', trial.work_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
            setValue('travelKMs', trial.travel_kms || 0);
            setValue('subsistence', trial.subsistence || 75);
            setValue('contractorName', trial.contractor_name || '');
            setValue('contractorAddress', trial.contractor_address || '');
            setValue('gstNumber', trial.gst_number || '');
            
            setExistingTrialId(trialId);
          }
        } catch (error) {
          console.error('Error loading existing trial:', error);
        }
      }
    };

    loadExistingTrial();
  }, [searchParams, setValue]);

  const onSubmit = async (data: SetupFormData) => {
    setIsSubmitting(true);
    
    try {
      const trialData = {
        trial_id: existingTrialId || `trial_${Date.now()}`,
        company: data.company,
        location: data.location,
        ticket_number: data.ticketNumber,
        contact_person: data.contactPerson,
        contact_email: data.contactEmail,
        day_rate: data.dayRate,
        truck_rate: data.truckRate,
        travel_rate: data.travelRate,
        work_days: data.workDays,
        start_date: data.startDate || new Date().toISOString().split('T')[0],
        expected_duration: data.expectedDuration || 14,
        travel_kms: data.travelKMs,
        subsistence: data.subsistence,
        include_gst: data.includeGST,
        contractor_name: data.contractorName,
        contractor_address: data.contractorAddress,
        gst_number: data.gstNumber,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const response = await fetch('/api/setup-trial-invoice', {
        method: existingTrialId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trialData)
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('currentTrialId', result.trial.trial_id);
        router.push(`/dashboard?trial=${result.trial.trial_id}&success=setup`);
      } else {
        throw new Error('Failed to save trial setup');
      }
    } catch (error) {
      console.error('Setup error:', error);
      alert('Failed to save setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < SETUP_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = SETUP_STEPS[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {existingTrialId ? 'Edit Trial Setup' : 'Trial Setup'}
              </h1>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {SETUP_STEPS.length}</p>
            </div>
            <div className="text-right">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-2">
            {SETUP_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <IconComponent className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">{currentStepData.title}</h2>
            </div>

            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    {...register('company', { required: 'Company name is required' })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Stack Testing Inc."
                  />
                  {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Calgary, Alberta"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Number</label>
                  <input
                    type="text"
                    {...register('ticketNumber', { required: 'Ticket number is required' })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ST-2024-001"
                  />
                  {errors.ticketNumber && <p className="mt-1 text-sm text-red-600">{errors.ticketNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    {...register('contactPerson')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Project Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    {...register('contactEmail')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="manager@company.com"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Labor Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('dayRate', { 
                        required: 'Day rate is required',
                        min: { value: 0, message: 'Rate must be positive' }
                      })}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="850.00"
                    />
                  </div>
                  {errors.dayRate && <p className="mt-1 text-sm text-red-600">{errors.dayRate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment/Truck Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('truckRate', { 
                        required: 'Truck rate is required',
                        min: { value: 0, message: 'Rate must be positive' }
                      })}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="150.00"
                    />
                  </div>
                  {errors.truckRate && <p className="mt-1 text-sm text-red-600">{errors.truckRate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Rate (per km)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('travelRate', { 
                        min: { value: 0, message: 'Rate must be positive' }
                      })}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.68"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">CRA standard rate: $0.68/km</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Meal Allowance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('subsistence', { 
                        min: { value: 0, message: 'Amount must be positive' }
                      })}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="75.00"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Tax-free meal reimbursement</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    {...register('includeGST')}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Include GST (5%)</p>
                    <p className="text-sm text-gray-500">Required for Alberta contractors</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Work Days</label>
                  <div className="grid grid-cols-2 gap-3">
                    {WORK_DAYS.map((day) => (
                      <label key={day.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          value={day.id}
                          {...register('workDays')}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-900">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Duration (days)</label>
                  <input
                    type="number"
                    {...register('expectedDuration')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="14"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Travel Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('travelKMs')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50.0"
                  />
                  <p className="mt-1 text-xs text-gray-500">Round trip distance (can be adjusted daily)</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Full Name</label>
                  <input
                    type="text"
                    {...register('contractorName', { required: 'Your name is required' })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Smith"
                  />
                  {errors.contractorName && <p className="mt-1 text-sm text-red-600">{errors.contractorName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Address</label>
                  <textarea
                    {...register('contractorAddress', { required: 'Address is required' })}
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="123 Main St, Calgary, AB T2P 1M4"
                  />
                  {errors.contractorAddress && <p className="mt-1 text-sm text-red-600">{errors.contractorAddress.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Number (Optional)</label>
                  <input
                    type="text"
                    {...register('gstNumber')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123456789RT0001"
                  />
                  <p className="mt-1 text-xs text-gray-500">Required if you charge GST</p>
                </div>

                {/* Setup Summary */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-3">Setup Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Company:</span>
                      <span className="font-medium text-blue-900">{watchedValues.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Day Rate:</span>
                      <span className="font-medium text-blue-900">{formatCAD(watchedValues.dayRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Equipment Rate:</span>
                      <span className="font-medium text-blue-900">{formatCAD(watchedValues.truckRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Work Days:</span>
                      <span className="font-medium text-blue-900">{watchedValues.workDays?.length || 0} days/week</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Previous
            </button>

            {currentStep < SETUP_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading setup...</p>
        </div>
      </div>
    }>
      <SetupForm />
    </Suspense>
  );
} 