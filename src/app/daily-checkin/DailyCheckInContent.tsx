'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TruckIcon,
  MapIcon,
  GiftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  MinusIcon,
  BellIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

import {
  calculateDailyAlbertaTax,
  formatCAD,
  validateTaxCalculation,
  STANDARD_TRAVEL_RATE_PER_KM,
  DailyWorkData,
  AlbertaInvoiceCalculation
} from '@/lib/albertaTax';
import TaxCalculationDisplay from '@/components/TaxCalculationDisplay';

interface DailyCheckInForm {
  workedToday: boolean;
  dayRateUsed: boolean;
  truckUsed: boolean;
  travelKMs: number;
  subsistence: number;
  additionalCharges: number;
  workStartTime: string;
  workEndTime: string;
  notes: string;
}

interface TrialData {
  trial_id: string;
  ticket_number: string;
  location: string;
  company: string;
  day_rate: number;
  truck_rate: number;
  work_days: string[];
}

export default function DailyCheckInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [trialData, setTrialData] = useState<TrialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCalculation, setCurrentCalculation] = useState<AlbertaInvoiceCalculation | null>(null);

  const today = new Date();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-CA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<DailyCheckInForm>({
    mode: 'onChange',
    defaultValues: {
      workedToday: true,
      dayRateUsed: true,
      truckUsed: true,
      travelKMs: 0,
      subsistence: 0,
      additionalCharges: 0,
      workStartTime: '07:00',
      workEndTime: '17:00',
      notes: ''
    }
  });

  const watchedValues = watch();

  // Load trial data on mount
  useEffect(() => {
    const loadTrialData = async () => {
      try {
        const trialId = searchParams.get('trial') || localStorage.getItem('currentTrialId');
        if (!trialId) {
          router.push('/trial-setup');
          return;
        }

        const response = await fetch(`/api/setup-trial-invoice?trial=${trialId}`);
        if (response.ok) {
          const data = await response.json();
          setTrialData(data.trial);
          
          // Set default travel based on trial setup
          setValue('travelKMs', data.trial.travel_kms || 0);
          setValue('subsistence', data.trial.subsistence || 0);
        } else {
          throw new Error('Failed to load trial data');
        }
      } catch (error) {
        console.error('Error loading trial data:', error);
        router.push('/trial-setup');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrialData();
  }, [searchParams, router, setValue]);

  // Check for notifications and show banner
  useEffect(() => {
    const checkNotifications = () => {
      const currentHour = new Date().getHours();
      const hasLoggedToday = localStorage.getItem(`daily-log-${today.toISOString().split('T')[0]}`);
      
      if ((currentHour >= 18 && currentHour <= 22) && !hasLoggedToday) {
        setShowNotificationBanner(true);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [today]);

  // Calculate current day's charges
  useEffect(() => {
    if (!trialData || !watchedValues.workedToday) {
      setCurrentCalculation(null);
      return;
    }

    const dailyData: DailyWorkData = {
      dayRate: trialData.day_rate,
      dayRateUsed: watchedValues.dayRateUsed,
      truckRate: trialData.truck_rate,
      truckUsed: watchedValues.truckUsed,
      travelKMs: Number(watchedValues.travelKMs) || 0,
      travelRatePerKm: STANDARD_TRAVEL_RATE_PER_KM,
      subsistence: Number(watchedValues.subsistence) || 0,
      additionalCharges: Number(watchedValues.additionalCharges) || 0
    };

    const calculation = calculateDailyAlbertaTax(dailyData);
    setCurrentCalculation(calculation);
  }, [trialData, watchedValues]);

  const onSubmit = async (data: DailyCheckInForm) => {
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...data,
        date: today.toISOString().split('T')[0],
        trial_id: trialData?.trial_id,
        calculation: currentCalculation
      };

      const response = await fetch('/api/daily-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        // Mark as logged for today
        localStorage.setItem(`daily-log-${today.toISOString().split('T')[0]}`, 'true');
        setShowNotificationBanner(false);
        
        // Show success and redirect
        router.push(`/trial-dashboard?success=checkin&date=${today.toISOString().split('T')[0]}`);
      } else {
        throw new Error('Failed to save daily check-in');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Failed to save check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your check-in...</p>
        </div>
      </div>
    );
  }

  if (!trialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Trial Setup Required</h2>
          <p className="text-gray-600 mb-4">Please complete your trial setup before logging daily work.</p>
          <button
            onClick={() => router.push('/invoice-setup')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Banner */}
      {showNotificationBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-600 text-white p-4 shadow-lg"
        >
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <BellIcon className="h-5 w-5" />
              <div>
                <p className="font-medium">Time to log today's work!</p>
                <p className="text-xs text-blue-200">Quick 2-minute check-in</p>
              </div>
            </div>
            <button
              onClick={() => setShowNotificationBanner(false)}
              className="text-blue-200 hover:text-white"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Daily Check-in</h1>
          <p className="text-blue-100">{formatDate(today)} - {trialData.location}</p>
          <p className="text-sm text-blue-200">Ticket #{trialData.ticket_number}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-200">
            <ClockIcon className="h-4 w-4" />
            <span>Expected: {trialData.work_days.includes(today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()) ? 'Work Day' : 'Non-Work Day'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Work Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-600" />
              Did you work today?
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 touch-target">
                <input
                  type="radio"
                  {...register('workedToday', { required: true })}
                  value="true"
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">Yes, I worked today</div>
                  <div className="text-xs text-gray-500">Log your daily charges</div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 touch-target">
                <input
                  type="radio"
                  {...register('workedToday', { required: true })}
                  value="false"
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">No, I didn't work today</div>
                  <div className="text-xs text-gray-500">Day off, sick day, etc.</div>
                </div>
              </label>
            </div>
          </motion.div>

          {/* Work Details - Only show if worked today */}
          {watchedValues.workedToday && (
            <>
              {/* Service Charges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                  Service Charges
                </h3>
                
                <div className="space-y-4">
                  {/* Day Rate */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        {...register('dayRateUsed')}
                        className="h-5 w-5 text-blue-600 rounded touch-target"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Daily Labor Rate</div>
                        <div className="text-sm text-gray-500">{formatCAD(trialData.day_rate)}/day</div>
                      </div>
                    </div>
                    {watchedValues.dayRateUsed && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                  </div>

                  {/* Truck Rate */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        {...register('truckUsed')}
                        className="h-5 w-5 text-blue-600 rounded touch-target"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          <TruckIcon className="h-4 w-4 inline mr-1" />
                          Equipment/Truck Rate
                        </div>
                        <div className="text-sm text-gray-500">{formatCAD(trialData.truck_rate)}/day</div>
                      </div>
                    </div>
                    {watchedValues.truckUsed && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Work Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Work Hours
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      {...register('workStartTime', { required: watchedValues.workedToday })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      {...register('workEndTime', { required: watchedValues.workedToday })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Travel & Expenses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Travel & Expenses
                </h3>
                
                <div className="space-y-4">
                  {/* Travel KMs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Round Trip Distance (km)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        {...register('travelKMs', { 
                          required: watchedValues.workedToday,
                          min: 0,
                          valueAsNumber: true 
                        })}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target"
                        placeholder="50.0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">km</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      @ {formatCAD(STANDARD_TRAVEL_RATE_PER_KM)}/km = {formatCAD((Number(watchedValues.travelKMs) || 0) * STANDARD_TRAVEL_RATE_PER_KM)}
                    </p>
                  </div>

                  {/* Subsistence */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <GiftIcon className="h-4 w-4 inline mr-1" />
                      Meal Allowance ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('subsistence', { 
                        min: 0,
                        valueAsNumber: true 
                      })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target"
                      placeholder="75.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">Tax-free meal reimbursement</p>
                  </div>

                  {/* Additional Charges */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Charges ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('additionalCharges', { 
                        min: 0,
                        valueAsNumber: true 
                      })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-target"
                      placeholder="0.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">Extra services, overtime, etc.</p>
                  </div>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notes (Optional)
                </h3>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Any additional details about today's work..."
                />
              </motion.div>

              {/* Live Calculation */}
              {currentCalculation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <TaxCalculationDisplay
                    calculation={currentCalculation}
                    title="Today's Invoice Total"
                    subtitle="Alberta GST calculation"
                    showValidation={true}
                    showTaxInfo={false}
                  />
                </motion.div>
              )}
            </>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="sticky bottom-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200"
          >
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 touch-target flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving check-in...
                </span>
              ) : (
                <span className="flex items-center">
                  <BookmarkIcon className="mr-2 h-5 w-5" />
                  Complete Check-in
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>
            
            {!watchedValues.workedToday && (
              <p className="text-center text-sm text-gray-500 mt-3">
                This will log a non-work day for {formatDate(today)}
              </p>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
} 