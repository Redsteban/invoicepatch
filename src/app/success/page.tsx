'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SuccessHero from '@/components/success/SuccessHero';
import NextStepsTimeline from '@/components/success/NextStepsTimeline';
import ExclusivePerks from '@/components/success/ExclusivePerks';
import ReferralProgram from '@/components/success/ReferralProgram';
import SocialSharing from '@/components/success/SocialSharing';
import { motion } from 'framer-motion';
import { trackConversion } from '@/lib/analytics';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

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