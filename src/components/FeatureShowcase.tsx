'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  color: string;
  benefits: string[];
  stats?: {
    value: string;
    label: string;
  };
}

interface FeatureShowcaseProps {
  features: Feature[];
  className?: string;
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const IconComponent = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="relative group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl p-6 lg:p-8 h-full hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1 + 0.3,
            type: "spring",
            stiffness: 200
          }}
          className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300"
        >
          <motion.div
            animate={isHovered ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Glow effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHovered ? { opacity: 0.6, scale: 1.5 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-blue-600 rounded-xl blur-lg"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
            {feature.title}
          </h3>
          
          <p className="text-slate-600 leading-relaxed mb-4">
            {feature.description}
          </p>

          {/* Stats Badge */}
          {feature.stats && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="inline-flex items-center bg-gray-100 text-slate-800 px-3 py-1 rounded-full text-sm font-semibold mb-4"
            >
              {feature.stats.value} {feature.stats.label}
            </motion.div>
          )}

          {/* Progressive Disclosure */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-semibold text-slate-800 mb-3">Key Benefits:</h4>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <motion.li
                    key={benefitIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: benefitIndex * 0.1 }}
                    className="flex items-start space-x-2 text-sm text-slate-600"
                  >
                    <CheckBadgeIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeatureShowcase({ features, className = '' }: FeatureShowcaseProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gray-50 rounded-3xl p-8 lg:p-16">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isHeaderInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-semibold mb-6"
          >
            <CheckBadgeIcon className="w-5 h-5" />
            <span>Powerful Features</span>
          </motion.div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Everything You Need to Get Paid Faster
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Streamline your invoicing process with features designed specifically for Canadian contractors.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300"
          >
            <span>Try All Features Free</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
          
          <p className="text-sm text-slate-500 mt-4">
            No credit card required • 14-day trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Default features for InvoicePatch
export const defaultFeatures: Feature[] = [
  {
    id: 'time-tracking',
    title: '2-Minute Invoice Creation',
    description: 'Transform hours of paperwork into minutes with our intelligent automation system.',
    icon: ClockIcon,
    benefits: [
      'Auto-fill contractor information',
      'Smart template suggestions',
      'Bulk processing capabilities',
      'One-click submission to multiple clients'
    ],
    stats: { label: 'faster processing', value: '87%' },
    color: 'bg-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: 'gps-tracking',
    title: 'GPS Mileage Tracking',
    description: 'Never miss a kilometer again with automatic GPS-verified mileage tracking and CRA-compliant logs.',
    icon: DocumentTextIcon,
    benefits: [
      'Automatic route detection',
      'CRA-compliant mileage logs',
      'Real-time GPS verification',
      'Tax-optimized categorization'
    ],
    stats: { label: 'more mileage recovered', value: '23%' },
    color: 'bg-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: 'tax-calculation',
    title: 'Instant Tax Calculations',
    description: 'Automated GST/PST calculations ensure compliance and eliminate costly errors.',
    icon: CurrencyDollarIcon,
    benefits: [
      'Province-specific tax rates',
      'Automatic HST calculations',
      'CRA audit-ready reports',
      'Error detection and warnings'
    ],
    stats: { label: 'tax error reduction', value: '99%' },
    color: 'bg-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: 'payment-tracking',
    title: 'Real-Time Payment Status',
    description: 'Know exactly when invoices are viewed, approved, and paid with instant notifications.',
    icon: BellIcon,
    benefits: [
      'Read receipt notifications',
      'Payment status updates',
      'Automated follow-up reminders',
      'Cash flow predictions'
    ],
    stats: { label: 'faster payments', value: '31%' },
    color: 'bg-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: 'compliance',
    title: 'CRA Compliance Center',
    description: 'Stay audit-ready with built-in compliance features designed for Canadian tax requirements.',
    icon: CheckBadgeIcon,
    benefits: [
      'Audit-ready documentation',
      'Receipt digitization',
      'Expense categorization',
      'Year-end tax prep'
    ],
    stats: { label: 'audit success rate', value: '100%' },
    color: 'bg-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Make data-driven decisions with comprehensive reporting and business insights.',
    icon: ChartBarIcon,
    benefits: [
      'Revenue trend analysis',
      'Contractor performance metrics',
      'Profit margin tracking',
      'Predictive cash flow'
    ],
    stats: { label: 'revenue increase', value: '18%' },
    color: 'bg-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  }
]; 