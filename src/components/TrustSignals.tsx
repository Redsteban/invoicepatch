'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  ClockIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface TrustSignal {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface TrustSignalsProps {
  trustSignals?: TrustSignal[];
  className?: string;
}

function SecurityBadge({ title, subtitle, icon: Icon, color }: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className="group"
    >
      <div className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={isInView ? { rotate: 0, scale: 1 } : { rotate: -10, scale: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-600">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function TrustSignals({ className = '' }: TrustSignalsProps) {
  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Professional Invoice Management
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Built with security, compliance, and reliability in mind.
          </p>
        </div>

        {/* Trust Badges - Mobile First Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <ShieldCheckIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1">CRA Compliant</div>
            <div className="text-xs sm:text-sm text-slate-600">Tax-ready invoices</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <LockClosedIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1">Bank-Level Security</div>
            <div className="text-xs sm:text-sm text-slate-600">256-bit encryption</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <ClockIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1">5-Min Setup</div>
            <div className="text-xs sm:text-sm text-slate-600">Quick integration</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <PhoneIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1">24/7 Support</div>
            <div className="text-xs sm:text-sm text-slate-600">Canadian team</div>
          </div>
        </div>

        {/* Money Back Guarantee - Mobile Optimized */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center shadow-sm border border-gray-200 mb-12 sm:mb-16 lg:mb-20 mx-2 sm:mx-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl">💰</div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                  30-Day Money-Back Guarantee
                </h3>
                <p className="text-sm sm:text-lg text-slate-600">
                  Try InvoicePatch risk-free for 30 days. If it doesn&apos;t meet your needs, 
                  we&apos;ll refund your payment completely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Benefits - Real and Honest */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 mb-2">5 min</div>
            <div className="text-sm sm:text-base lg:text-lg text-slate-600 font-semibold">Setup Time</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Quick integration</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 mb-2">99.7%</div>
            <div className="text-sm sm:text-base lg:text-lg text-slate-600 font-semibold">Accuracy Rate</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">AI-powered processing</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 mb-2">24/7</div>
            <div className="text-sm sm:text-base lg:text-lg text-slate-600 font-semibold">Support Available</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Canadian team</div>
          </div>
        </div>

        {/* Simple call to action without fake social proof */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            Ready to Streamline Your Invoice Process?
          </h3>
          <p className="text-sm sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            See how InvoicePatch can help you automate invoice reconciliation and save time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Try Free Demo
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 