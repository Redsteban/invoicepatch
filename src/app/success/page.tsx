'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SuccessHero from '@/components/success/SuccessHero';
import NextStepsTimeline from '@/components/success/NextStepsTimeline';
import ExclusivePerks from '@/components/success/ExclusivePerks';
import ReferralProgram from '@/components/success/ReferralProgram';
import SocialSharing from '@/components/success/SocialSharing';
import { motion } from 'framer-motion';
import { trackConversion } from '@/lib/analytics';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  CalendarDaysIcon,
  BellIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { TrialManager } from '@/lib/trialManager';

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"
      />
    </div>
  );
}

// Trial Success Component
function TrialSuccessContent() {
  const [trialData, setTrialData] = useState<any>(null);

  useEffect(() => {
    // Load trial data using TrialManager
    const savedTrialData = TrialManager.getTrialData();
    if (savedTrialData) {
      setTrialData(savedTrialData);
    }

    // Track trial started
    trackConversion('CHECKOUT_COMPLETED', {
      timestamp: new Date().toISOString(),
      trial_type: 'daily_checkin_trial'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Trial is Ready!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've set up your automated daily check-in system. You'll be reminded to log your work every day at 6 PM.
          </p>
        </motion.div>

        {/* Trial Summary */}
        {trialData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Trial Setup Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Ticket:</strong> {trialData.ticketNumber}</p>
                  <p><strong>Location:</strong> {trialData.location}</p>
                  <p><strong>Company:</strong> {trialData.company}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Daily Rates</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Day Rate:</strong> ${parseFloat(trialData.dayRate || 0).toFixed(2)}</p>
                  <p><strong>Truck Rate:</strong> ${parseFloat(trialData.truckRate || 0).toFixed(2)}</p>
                  <p><strong>Subsistence:</strong> ${parseFloat(trialData.taxFreeSubsistence || 0).toFixed(2)}</p>
                  <p><strong>Travel:</strong> {trialData.travelKMs} km</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Work Schedule</h3>
              <div className="flex flex-wrap gap-2">
                {trialData.workDays?.map((day: string) => (
                  <span key={day} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm capitalize">
                    {day}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Invoicing: {trialData.invoiceFrequency}
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <a
            href="/daily-checkin"
            className="block p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Check-in</h3>
            <p className="text-gray-600 text-sm">
              Log today's work and verify your charges. Takes less than 2 minutes.
            </p>
          </a>

          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BellIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Enabled
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Reminders</h3>
            <p className="text-gray-600 text-sm">
              You'll receive notifications at 6 PM, 8 PM, and 10 PM to log your work.
            </p>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Daily Check-ins (Starting Today)</h3>
                <p className="text-blue-100">
                  Log your work each day. We'll remind you at 6 PM and track everything automatically.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Weekly Invoice Generation</h3>
                <p className="text-blue-100">
                  Every {trialData?.invoiceFrequency === 'weekly' ? 'Friday' : 'second Friday'}, we'll generate your professional invoice automatically.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Manager Approval</h3>
                <p className="text-blue-100">
                  Your manager gets instant access to approve invoices with one click.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDaysIcon className="w-5 h-5" />
              <span className="font-semibold">14-Day Free Trial</span>
            </div>
            <p className="text-sm text-blue-100">
              No credit card required. Cancel anytime. Experience the full power of automated invoicing.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="/daily-checkin"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors touch-target"
          >
            <ClockIcon className="w-5 h-5" />
            Start Your First Check-in
            <ArrowRightIcon className="w-5 h-5" />
          </a>
          <p className="text-gray-600 text-sm mt-4">
            Ready to experience effortless invoicing? Let's get started!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Check-in Success Component
function CheckInSuccessContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto px-4 text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Work Logged Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Your daily work has been recorded. We'll remind you again tomorrow at 6 PM.
        </p>
        <div className="space-y-3">
          <a
            href="/daily-checkin"
            className="block w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Today's Check-in
          </a>
          <a
            href="/"
            className="block w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// Component that uses useSearchParams - must be wrapped in Suspense
function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const trialStarted = searchParams.get('trial');
  const checkinCompleted = searchParams.get('checkin');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle different success types
  if (trialStarted === 'started') {
    return <TrialSuccessContent />;
  }

  if (checkinCompleted === 'completed') {
    return <CheckInSuccessContent />;
  }

  useEffect(() => {
    // Track success page view
    trackConversion('SUCCESS_PAGE_VIEW', {
      session_id: sessionId,
    });

    // Fetch customer data if session ID exists
    if (sessionId) {
      fetchCustomerData(sessionId);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchCustomerData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/customer-data?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 space-y-16 pb-16">
        {/* Success Hero Section */}
        <SuccessHero customerData={customerData} />

        {/* Next Steps Timeline */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NextStepsTimeline />
        </section>

        {/* Exclusive Perks */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ExclusivePerks />
        </section>

        {/* Social Sharing */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SocialSharing customerData={customerData} />
        </section>

        {/* Referral Program */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ReferralProgram customerData={customerData} />
        </section>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessPageContent />
    </Suspense>
  );
} 