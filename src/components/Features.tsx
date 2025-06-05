'use client';

import { motion } from 'framer-motion';
import {
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  EyeIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

// TypeScript interfaces for Ethan Marcotte components
interface Feature {
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  benefit: string;
}

interface TimeComparisonItem {
  task: string;
  before: string;
  after: string;
  savings: string;
}

interface IntegrationSystem {
  name: string;
  desc: string;
}

interface FeatureIconProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

interface MetricProps {
  value: string;
  label: string;
  delay?: number;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

interface TimeComparisonRowProps {
  item: TimeComparisonItem;
  index: number;
}

interface IntegrationCardProps {
  system: IntegrationSystem;
  index: number;
}

interface HeroSectionProps {
  children: ReactNode;
}

interface FeatureGridProps {
  features: Feature[];
}

// Ethan Marcotte Atomic Design - Atoms
const FeatureIcon: React.FC<FeatureIconProps> = ({ icon: Icon, className = "" }) => (
  <div className={`icon-container ${className}`}>
    <Icon />
  </div>
);

const Metric: React.FC<MetricProps> = ({ value, label, delay = 0 }) => (
  <motion.div 
    className="text-center group micro-lift"
    initial={{ opacity: 0, y: 20, rotateX: -10 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    whileHover={{ 
      scale: 1.05,
      rotateY: 3,
      transition: { duration: 0.3 }
    }}
  >
    <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-300">
      {value}
    </div>
    <div className="text-lg text-slate-600">{label}</div>
  </motion.div>
);

// Ethan Marcotte Atomic Design - Molecules
const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => (
  <motion.div 
    className="molecule-feature-card micro-glow"
    initial={{ opacity: 0, y: 40, rotateX: -10 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ 
      delay: index * 0.15, 
      duration: 0.7, 
      ease: [0.25, 1, 0.5, 1]
    }}
    whileHover={{ 
      y: -6,
      rotateX: 4,
      rotateY: -2,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
  >
    <div className="flex items-start space-x-4">
      <FeatureIcon icon={feature.icon} />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors duration-300">
          {feature.name}
        </h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          {feature.description}
        </p>
        <div className="inline-flex items-center px-3 py-2 rounded-full bg-slate-50 text-sm font-medium text-slate-700 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
          <motion.span 
            className="mr-2"
            whileHover={{ scale: 1.2, rotateZ: 10 }}
            transition={{ duration: 0.2 }}
          >
            ✓
          </motion.span>
          {feature.benefit}
        </div>
      </div>
    </div>
  </motion.div>
);

const TimeComparisonRow: React.FC<TimeComparisonRowProps> = ({ item, index }) => (
  <motion.div 
    className="px-4 sm:px-6 lg:px-8 py-5 hover:bg-slate-50 transition-all duration-300 micro-lift border-l-4 border-transparent hover:border-amber-400"
    initial={{ opacity: 0, x: -40, rotateY: -5 }}
    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ 
      delay: index * 0.2, 
      duration: 0.6,
      ease: "easeOut"
    }}
    whileHover={{
      x: 4,
      rotateY: 1,
      transition: { duration: 0.2 }
    }}
  >
    <div className="grid grid-cols-4 gap-2 sm:gap-4 text-sm sm:text-base items-center">
      <div className="font-medium text-slate-900 leading-tight">{item.task}</div>
      <div className="text-center text-slate-500 font-medium relative">
        <span className="relative z-10">{item.before}</span>
        <div className="absolute inset-0 bg-amber-100 rounded opacity-20"></div>
      </div>
      <div className="text-center text-slate-900 font-semibold relative">
        <span className="relative z-10">{item.after}</span>
        <div className="absolute inset-0 bg-teal-100 rounded opacity-20"></div>
      </div>
      <div className="text-center text-slate-900 font-bold text-base sm:text-lg">
        <motion.span 
          className="bg-slate-900 text-white px-2 py-1 rounded text-sm inline-block"
          whileHover={{ 
            scale: 1.1, 
            rotateZ: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" 
          }}
          transition={{ duration: 0.2 }}
        >
          {item.savings}
        </motion.span>
      </div>
    </div>
  </motion.div>
);

const IntegrationCard: React.FC<IntegrationCardProps> = ({ system, index }) => (
  <motion.div
    className="atom-card p-6 text-center group cursor-pointer micro-scale"
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
    whileHover={{ 
      scale: 1.05,
      rotateY: 5,
      rotateX: 2,
      transition: { duration: 0.3 }
    }}
  >
    <motion.div 
      className="w-12 h-12 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-slate-900 transition-all duration-300"
      whileHover={{
        rotateY: 15,
        rotateX: 10,
        scale: 1.1
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-6 h-6 bg-slate-400 rounded group-hover:bg-white transition-colors duration-300"
        whileHover={{ scale: 1.2 }}
      />
    </motion.div>
    <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors duration-300">
      {system.name}
    </h4>
    <p className="text-sm text-slate-600">{system.desc}</p>
    <motion.div 
      className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      initial={{ y: 10 }}
      whileHover={{ y: 0 }}
    >
      <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
        Learn more →
      </span>
    </motion.div>
  </motion.div>
);

// Ethan Marcotte Atomic Design - Organisms
const HeroSection: React.FC<HeroSectionProps> = ({ children }) => (
  <motion.div 
    className="mx-auto max-w-2xl lg:text-center mb-8 sm:mb-12"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => (
  <div className="mx-auto mt-12 sm:mt-16 lg:mt-24 max-w-2xl lg:max-w-none">
    <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
      {features.map((feature, index) => (
        <FeatureCard key={feature.name} feature={feature} index={index} />
      ))}
    </div>
  </div>
);

// Data structures
const features: Feature[] = [
  {
    name: 'Zero Manual Data Entry',
    description: 'AFE codes, well IDs, and rates flow automatically from your ERP to contractor apps. No typing, no guessing, no errors.',
    icon: ArrowPathIcon,
    benefit: 'Eliminates 95% of data entry errors'
  },
  {
    name: 'Pre-Validated Invoices',
    description: 'Contractors submit invoices pre-filled with your exact data. You just verify hours and approve - no line-by-line checking.',
    icon: DocumentCheckIcon,
    benefit: 'Reduces approval time by 90%'
  },
  {
    name: 'Real-Time Work Tracking',
    description: 'See hours logged and costs accumulating as work happens. No more month-end surprises when invoices arrive.',
    icon: EyeIcon,
    benefit: 'Live project cost visibility'
  },
  {
    name: 'Instant Approval Workflow',
    description: 'Since invoice data came from your system, approve with confidence in seconds. Bulk approve multiple invoices at once.',
    icon: CheckCircleIcon,
    benefit: 'From hours to minutes weekly'
  }
];

const timeComparison: TimeComparisonItem[] = [
  {
    task: 'Invoice Reconciliation',
    before: '8 hours weekly',
    after: '45 minutes weekly',
    savings: '7.25 hours'
  },
  {
    task: 'Data Entry Corrections',
    before: '3 hours weekly', 
    after: '10 minutes weekly',
    savings: '2.8 hours'
  },
  {
    task: 'AFE Code Verification',
    before: '2 hours weekly',
    after: '0 hours (automatic)',
    savings: '2 hours'
  }
];

const integrationSystems: IntegrationSystem[] = [
  { name: 'QuickBooks', desc: 'Desktop & Online' },
  { name: 'FieldCap', desc: 'Field Management' },
  { name: 'FireSpark', desc: 'Operations Hub' },
  { name: 'Wellview', desc: 'Production Data' }
];

export default function Features() {
  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <HeroSection>
            <motion.h2 
              className="text-base font-semibold leading-7 text-slate-600 tracking-wide uppercase"
              initial={{ opacity: 0, rotateX: -10 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Core Features
            </motion.h2>
            <motion.p 
              className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Built to Eliminate Manual Reconciliation
            </motion.p>
            <motion.p 
              className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Every feature designed around one goal: perfect invoice data that requires zero manual checking.
            </motion.p>
          </HeroSection>
        </motion.div>

        <FeatureGrid features={features} />

        {/* Time Savings Breakdown */}
        <motion.div 
          className="mt-16 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Exactly How You'll Save Time
            </h3>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-7 sm:leading-8 text-slate-600">
              Real numbers from managers who eliminated invoice reconciliation
            </p>
          </HeroSection>

          {/* Enhanced Time Comparison Table */}
          <motion.div 
            className="atom-card overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, rotateX: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-200">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-sm sm:text-base font-semibold text-slate-700">
                <div>Task</div>
                <div className="text-center">Before</div>
                <div className="text-center">After</div>
                <div className="text-center">Saved</div>
              </div>
            </div>
            
            <div className="divide-y divide-slate-200">
              {timeComparison.map((item, index) => (
                <TimeComparisonRow key={item.task} item={item} index={index} />
              ))}
            </div>
            
            <motion.div 
              className="bg-slate-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-slate-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{
                scale: 1.02,
                rotateX: 2,
                transition: { duration: 0.3 }
              }}
            >
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-sm sm:text-base font-bold">
                <div className="text-white col-span-3">Total Weekly Savings</div>
                <div className="text-center text-white text-base sm:text-lg lg:text-xl">
                  <motion.span 
                    className="bg-white text-slate-900 px-3 py-1 rounded-full inline-block"
                    whileHover={{ 
                      scale: 1.1, 
                      boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)" 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    12+ hours
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Integration Section */}
        <motion.div 
          className="mt-16 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Works with Your Existing Systems
            </h3>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-7 sm:leading-8 text-slate-600">
              Direct integration with systems used daily by oil & gas companies
            </p>
          </HeroSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {integrationSystems.map((system, index) => (
              <IntegrationCard key={system.name} system={system} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Weekly Time Savings Metrics */}
        <motion.div 
          className="mt-16 sm:mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="atom-card p-8 bg-gradient-to-br from-slate-50 to-white"
            whileHover={{
              rotateX: 2,
              rotateY: 1,
              scale: 1.01,
              transition: { duration: 0.3 }
            }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Your Weekly Time Recovery
              </h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Time you'll get back every single week to focus on what matters most
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Metric value="12+ hrs" label="Total time saved weekly" delay={0} />
              <Metric value="$1,440" label="Value recovered monthly" delay={0.15} />
              <Metric value="85%" label="Stress reduction reported" delay={0.3} />
            </div>
          </motion.div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="mt-16 sm:mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="atom-card p-8 max-w-2xl mx-auto bg-gradient-to-br from-slate-50 to-white"
            whileHover={{
              rotateX: 3,
              rotateY: -1,
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Experience Zero Manual Reconciliation?
            </h3>
            <p className="text-slate-600 mb-6">
              See how these features work together in a live demo with your actual invoice data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="atom-button--primary micro-lift">
                Book Live Demo
              </button>
              <button className="atom-button--secondary micro-lift">
                Learn More
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 