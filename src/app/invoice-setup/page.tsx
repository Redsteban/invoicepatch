'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  TruckIcon,
  MapIcon,
  GiftIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import {
  calculateTrialPreview,
  formatCAD,
  STANDARD_TRAVEL_RATE_PER_KM
} from '@/lib/albertaTax';

interface InvoiceSetupForm {
  ticketNumber: string;
  location: string;
  company: string;
  dayRate: number;
  truckRate: number;
  travelKms: number;
  subsistence: number;
  workStartDate: string;
  workDays: string[];
  invoiceFrequency: string;
}

const workDayOptions = [
  { value: 'monday', label: 'Monday', shortLabel: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', shortLabel: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', shortLabel: 'Wed' },
  { value: 'thursday', label: 'Thursday', shortLabel: 'Thu' },
  { value: 'friday', label: 'Friday', shortLabel: 'Fri' },
  { value: 'saturday', label: 'Saturday', shortLabel: 'Sat' },
  { value: 'sunday', label: 'Sunday', shortLabel: 'Sun' }
];

const invoiceFrequencyOptions = [
  { value: 'weekly', label: 'Weekly (every Friday)', description: 'Invoice every week on Friday' },
  { value: 'biweekly', label: 'Bi-weekly (every 2nd Friday)', description: 'Invoice every two weeks on Friday' }
];

export default function InvoiceSetupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedData, setSavedData] = useState<Partial<InvoiceSetupForm> | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isValid },
    trigger
  } = useForm<InvoiceSetupForm>({
    mode: 'onChange',
    defaultValues: {
      workStartDate: new Date().toISOString().split('T')[0],
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      invoiceFrequency: 'biweekly',
      dayRate: 0,
      truckRate: 0,
      travelKms: 0,
      subsistence: 0
    }
  });

  const watchedValues = watch();

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (Object.keys(watchedValues).length > 0) {
        localStorage.setItem('invoiceSetupDraft', JSON.stringify(watchedValues));
      }
    }, 1000);

    return () => clearTimeout(autoSave);
  }, [watchedValues]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('invoiceSetupDraft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSavedData(data);
        Object.keys(data).forEach(key => {
          setValue(key as keyof InvoiceSetupForm, data[key]);
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [setValue]);

  // Calculate preview values using Alberta tax system
  const calculatePreview = () => {
    const dayRate = Number(watchedValues.dayRate) || 0;
    const truckRate = Number(watchedValues.truckRate) || 0;
    const travelKms = Number(watchedValues.travelKms) || 0;
    const subsistence = Number(watchedValues.subsistence) || 0;

    // Use Alberta tax calculation system
    const calculation = calculateTrialPreview({
      dayRate,
      truckRate,
      travelKms,
      subsistence
    });

    return {
      dayRate,
      truckRate,
      travelKms,
      subsistence,
      taxableAmount: calculation.taxableSubtotal,
      gst: calculation.gstAmount,
      afterTax: calculation.afterTaxSubtotal,
      travelReimbursement: calculation.travelReimbursement,
      reimbursements: calculation.nonTaxableTotal,
      dailyTotal: calculation.grandTotal
    };
  };

  const preview = calculatePreview();

  const onSubmit = async (data: InvoiceSetupForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to save invoice setup
      const response = await fetch('/api/setup-trial-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          preview: calculatePreview()
        }),
      });

      if (response.ok) {
        // Clear saved draft
        localStorage.removeItem('invoiceSetupDraft');
        
        // Show success message
        setShowSuccessMessage(true);
        
        // Redirect after delay
        setTimeout(() => {
          router.push('/trial-dashboard');
        }, 2000);
      } else {
        throw new Error('Failed to save invoice setup');
      }
    } catch (error) {
      console.error('Setup error:', error);
      alert('Failed to save invoice setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('invoiceSetupDraft', JSON.stringify(watchedValues));
    alert('Draft saved successfully!');
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trial Setup Complete!</h2>
          <p className="text-gray-600 mb-6">
            You'll receive your first daily check-in at 6 PM today. We'll guide you through logging your work hours and generating your first invoice.
          </p>
          <div className="animate-pulse text-blue-600 font-medium">
            Redirecting to your dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 mobile-container">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
            <span className="mr-2">Step 1 of 2</span>
            <ChartBarIcon className="h-4 w-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
            Set Up Your Trial Invoice
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto break-words">
            Enter your project details to start automated daily check-ins
          </p>
          {savedData && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <BookmarkIcon className="h-4 w-4 inline mr-1" />
                Draft found and restored from previous session
              </p>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Section 1: Project Information */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600 flex-shrink-0" />
                  Project Information
                </h2>
                
                <div className="space-y-6">
                  {/* Ticket Number */}
                  <div>
                    <label htmlFor="ticketNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Number *
                    </label>
                    <input
                      type="text"
                      id="ticketNumber"
                      {...register('ticketNumber', {
                        required: 'Ticket number is required',
                        minLength: { value: 3, message: 'Ticket number must be at least 3 characters' }
                      })}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target ${
                        errors.ticketNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., ST-2025-001"
                    />
                    <p className="mt-1 text-sm text-gray-500">This will start your invoice sequence</p>
                    {errors.ticketNumber && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.ticketNumber.message}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      Job Site Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      {...register('location', {
                        required: 'Location is required',
                        minLength: { value: 3, message: 'Location must be at least 3 characters' }
                      })}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target ${
                        errors.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Calgary Downtown, Edmonton North"
                    />
                    <p className="mt-1 text-sm text-gray-500">Where you'll be working</p>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.location.message}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                      Client Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      {...register('company', {
                        required: 'Company name is required',
                        minLength: { value: 2, message: 'Company name must be at least 2 characters' }
                      })}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target ${
                        errors.company ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Stack Production Testing"
                    />
                    <p className="mt-1 text-sm text-gray-500">Who you're invoicing</p>
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.company.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Rate Structure */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 mr-3 text-green-600 flex-shrink-0" />
                  Rate Structure
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Day Rate */}
                  <div>
                    <label htmlFor="dayRate" className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Labor Rate ($) *
                    </label>
                    <input
                      type="number"
                      id="dayRate"
                      min="0"
                      step="0.01"
                      {...register('dayRate', {
                        required: 'Day rate is required',
                        min: { value: 0, message: 'Rate must be positive' },
                        valueAsNumber: true
                      })}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target ${
                        errors.dayRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="450.00"
                    />
                    <p className="mt-1 text-sm text-gray-500">Your daily rate before taxes</p>
                    {errors.dayRate && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.dayRate.message}</p>
                    )}
                  </div>

                  {/* Truck Rate */}
                  <div>
                    <label htmlFor="truckRate" className="block text-sm font-medium text-gray-700 mb-2">
                      <TruckIcon className="h-4 w-4 inline mr-1" />
                      Daily Truck/Equipment Rate ($) *
                    </label>
                    <input
                      type="number"
                      id="truckRate"
                      min="0"
                      step="0.01"
                      {...register('truckRate', {
                        required: 'Truck rate is required',
                        min: { value: 0, message: 'Rate must be positive' },
                        valueAsNumber: true
                      })}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target ${
                        errors.truckRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="150.00"
                    />
                    <p className="mt-1 text-sm text-gray-500">Daily equipment rental rate</p>
                    {errors.truckRate && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.truckRate.message}</p>
                    )}
                  </div>

                  {/* Travel KMs */}
                  <div>
                    <label htmlFor="travelKms" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapIcon className="h-4 w-4 inline mr-1" />
                      Round Trip Distance (km) *
                    </label>
                    <input
                      type="number"
                      id="travelKms"
                      min="0"
                      step="0.1"
                      {...register('travelKms', {
                        required: 'Travel distance is required',
                        min: { value: 0, message: 'Distance must be positive' },
                        valueAsNumber: true
                      })}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target ${
                        errors.travelKms ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="45.5"
                    />
                    <p className="mt-1 text-sm text-gray-500">Total distance to job site and back</p>
                    {errors.travelKms && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.travelKms.message}</p>
                    )}
                  </div>

                  {/* Subsistence */}
                  <div>
                    <label htmlFor="subsistence" className="block text-sm font-medium text-gray-700 mb-2">
                      <GiftIcon className="h-4 w-4 inline mr-1" />
                      Daily Meal Allowance ($) *
                    </label>
                    <input
                      type="number"
                      id="subsistence"
                      min="0"
                      step="0.01"
                      {...register('subsistence', {
                        required: 'Subsistence allowance is required',
                        min: { value: 0, message: 'Amount must be positive' },
                        valueAsNumber: true
                      })}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target ${
                        errors.subsistence ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="75.00"
                    />
                    <p className="mt-1 text-sm text-gray-500">Tax-free daily subsistence (CRA compliant)</p>
                    {errors.subsistence && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.subsistence.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Work Schedule */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CalendarDaysIcon className="h-6 w-6 mr-3 text-purple-600 flex-shrink-0" />
                  Work Schedule
                </h2>
                
                <div className="space-y-6">
                  {/* Work Start Date */}
                  <div>
                    <label htmlFor="workStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Work Start Date *
                    </label>
                    <input
                      type="date"
                      id="workStartDate"
                      {...register('workStartDate', {
                        required: 'Start date is required'
                      })}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target ${
                        errors.workStartDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <p className="mt-1 text-sm text-gray-500">When does this project begin?</p>
                    {errors.workStartDate && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.workStartDate.message}</p>
                    )}
                  </div>

                  {/* Work Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Typical Work Days *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                      {workDayOptions.map((day) => (
                        <Controller
                          key={day.value}
                          name="workDays"
                          control={control}
                          rules={{ required: 'Select at least one work day' }}
                          render={({ field: { value, onChange } }) => (
                            <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all touch-target hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={value?.includes(day.value) || false}
                                onChange={(e) => {
                                  const currentValue = value || [];
                                  if (e.target.checked) {
                                    onChange([...currentValue, day.value]);
                                  } else {
                                    onChange(currentValue.filter((d: string) => d !== day.value));
                                  }
                                }}
                                className="sr-only"
                              />
                              <span className={`text-sm font-medium text-center w-full ${
                                value?.includes(day.value) 
                                  ? 'text-blue-600 bg-blue-50 border-blue-200' 
                                  : 'text-gray-700'
                              }`}>
                                <span className="hidden sm:inline">{day.label}</span>
                                <span className="sm:hidden">{day.shortLabel}</span>
                              </span>
                            </label>
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Select your usual work days</p>
                    {errors.workDays && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.workDays.message}</p>
                    )}
                  </div>

                  {/* Invoice Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <ClockIcon className="h-4 w-4 inline mr-1" />
                      How often do you invoice? *
                    </label>
                    <div className="space-y-3">
                      {invoiceFrequencyOptions.map((option) => (
                        <label key={option.value} className="flex items-start p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 touch-target">
                          <input
                            type="radio"
                            {...register('invoiceFrequency', { required: 'Invoice frequency is required' })}
                            value={option.value}
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Based on your client's payment schedule</p>
                    {errors.invoiceFrequency && (
                      <p className="mt-1 text-sm text-red-600 break-words">{errors.invoiceFrequency.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="w-full sm:w-auto px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 touch-target"
                  >
                    <BookmarkIcon className="h-4 w-4 inline mr-2" />
                    Save Draft
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => trigger()}
                    className="w-full sm:w-auto px-6 py-3 text-base font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 touch-target"
                  >
                    Preview Setup
                  </button>

                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="w-full sm:flex-1 px-6 py-3 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 touch-target"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Setting up trial...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Start Trial
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Live Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-green-600" />
                  Daily Charges Preview
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Day Rate:</span>
                    <span className="font-medium">{formatCAD(preview.dayRate)}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Truck Rate:</span>
                    <span className="font-medium">{formatCAD(preview.truckRate)}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel:</span>
                    <span className="font-medium">{preview.travelKms.toFixed(1)} km roundtrip</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subsistence:</span>
                    <span className="font-medium">{formatCAD(preview.subsistence)}/day (tax-free)</span>
                  </div>
                </div>

                <hr className="my-4" />

                <h4 className="font-semibold text-gray-900 mb-3">Alberta Tax Calculation:</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxable Services:</span>
                    <span>{formatCAD(preview.taxableAmount)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span className="text-gray-600">GST (5%):</span>
                    <span className="font-medium">{formatCAD(preview.gst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">After Tax:</span>
                    <span className="font-medium">{formatCAD(preview.afterTax)}</span>
                  </div>
                  
                  <hr className="my-2 border-gray-300" />
                  
                  <div className="flex justify-between text-green-600">
                    <span className="text-gray-600">Travel Reimbursement:</span>
                    <span className="font-medium">{formatCAD(preview.travelReimbursement)} (tax-free)</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="text-gray-600">Subsistence:</span>
                    <span className="font-medium">{formatCAD(preview.subsistence)} (tax-free)</span>
                  </div>
                  
                  <hr className="my-2 border-gray-400" />
                  
                  <div className="flex justify-between text-lg font-bold text-emerald-600">
                    <span>Daily Total:</span>
                    <span>{formatCAD(preview.dailyTotal)}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Travel rate: {formatCAD(STANDARD_TRAVEL_RATE_PER_KM)}/km (CRA 2024)
                  </div>
                </div>

                {preview.dailyTotal > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                      Ready to start automated daily tracking!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 