'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import confetti from 'canvas-confetti';

interface CustomerData {
  email?: string;
  company_name?: string;
  plan_type?: string;
  amount_paid?: number;
}

interface SuccessHeroProps {
  customerData?: CustomerData | null;
}

export default function SuccessHero({ customerData }: SuccessHeroProps) {
  const controls = useAnimation();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    const triggerConfetti = () => {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    };

    // Start animations
    const animateSequence = async () => {
      await controls.start({
        scale: [0, 1.2, 1],
        rotate: [0, 360],
        transition: { duration: 1, ease: "easeOut" }
      });
      
      triggerConfetti();
      setShowConfetti(true);
    };

    const timer = setTimeout(animateSequence, 500);
    return () => clearTimeout(timer);
  }, [controls]);

  const getPlanName = (planType?: string) => {
    switch (planType) {
      case 'contractor_monthly':
        return 'Contractor Monthly';
      case 'manager_platform':
        return 'Manager Platform';
      case 'complete_system':
        return 'Complete System';
      default:
        return 'InvoicePatch';
    }
  };

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 left-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Checkmark */}
        <motion.div
          animate={controls}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircleIcon className="w-20 h-20 text-white" />
            </motion.div>
            
            {/* Sparkle Effects */}
            {showConfetti && (
              <>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  className="absolute -top-4 -right-4"
                >
                  <SparklesIcon className="w-8 h-8 text-yellow-400" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, -180, -360]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-4 -left-4"
                >
                  <SparklesIcon className="w-6 h-6 text-purple-400" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 90, 180]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute top-1/2 -right-8"
                >
                  <SparklesIcon className="w-5 h-5 text-blue-400" />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">
            🎉 Welcome to InvoicePatch
            <span className="block text-gradient-emerald">Founding Members!</span>
          </h1>
          
          {customerData?.company_name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-4"
            >
              Thank you, <span className="font-bold text-emerald-600">{customerData.company_name}</span>!
            </motion.p>
          )}

          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your payment has been confirmed and you're officially part of our exclusive founding member community.
            You've just secured 90% savings and lifetime access to InvoicePatch!
          </p>
        </motion.div>

        {/* Order Summary */}
        {customerData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-md mx-auto glass rounded-2xl p-6 mb-8 border border-emerald-200/30"
          >
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              Order Confirmed ✅
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getPlanName(customerData.plan_type)}
                </span>
              </div>
              {customerData.amount_paid && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-emerald-600">
                    ${(customerData.amount_paid / 100).toFixed(2)} CAD
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Savings:</span>
                <span className="font-bold text-green-600">90% OFF</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-800 dark:text-emerald-300 px-6 py-3 rounded-full font-semibold text-lg"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Founding Member #247</span>
          <SparklesIcon className="w-5 h-5" />
        </motion.div>
      </div>
    </section>
  );
} 