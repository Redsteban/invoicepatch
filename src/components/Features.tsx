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

const features = [
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

const timeComparison = [
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export default function Features() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Features Section */}
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Core Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built to Eliminate Manual Reconciliation
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Every feature designed around one goal: perfect invoice data that requires zero manual checking.
          </p>
        </motion.div>

        <motion.div 
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="flex flex-col bg-gray-50 rounded-xl p-6 border border-gray-200 group"
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 }
                }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 mb-4">
                  <motion.div 
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  </motion.div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <motion.div 
                    className="mt-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 border border-emerald-200">
                      ✓ {feature.benefit}
                    </span>
                  </motion.div>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        {/* Time Savings Breakdown */}
        <motion.div 
          className="mt-20 sm:mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mx-auto max-w-2xl lg:text-center mb-12">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Exactly How You'll Save Time
            </h3>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Real numbers from managers who eliminated invoice reconciliation
            </p>
          </div>

          <motion.div 
            className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm"
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-700">
                <div>Current Task</div>
                <div className="text-center">Before</div>
                <div className="text-center">After</div>
                <div className="text-center">Time Saved</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {timeComparison.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  variants={slideInVariants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-medium text-gray-900">{item.task}</div>
                    <div className="text-center text-gray-600 font-medium">{item.before}</div>
                    <div className="text-center text-emerald-600 font-medium">{item.after}</div>
                    <div className="text-center">
                      <motion.span 
                        className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.savings} saved
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="bg-emerald-50 px-6 py-4 border-t border-emerald-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Weekly Savings:</span>
                <motion.span 
                  className="text-2xl font-bold text-emerald-600"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                >
                  12+ hours per week
                </motion.span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Average manager saves $2,400+ monthly in time costs (at $50/hour)
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Integration Benefits - Simplified */}
        <motion.div 
          className="mt-20 sm:mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mx-auto max-w-2xl lg:text-center mb-12">
            <h3 className="text-base font-semibold leading-7 text-emerald-600">System Integration</h3>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Works With Your Existing ERP
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              No platform migration required. InvoicePatch syncs with what you already use.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { name: 'SAP', color: 'bg-blue-600' },
              { name: 'JDE', color: 'bg-gray-800' },
              { name: 'Oracle', color: 'bg-red-600' },
              { name: 'NetSuite', color: 'bg-emerald-600' }
            ].map((system, index) => (
              <motion.div 
                key={system.name}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-4 hover:shadow-lg transition-shadow">
                  <div className={`${system.color} text-white px-4 py-2 rounded font-bold text-lg mx-auto inline-block`}>
                    {system.name}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{system.name}</h4>
                <p className="text-sm text-gray-600">Full AFE and project sync</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 