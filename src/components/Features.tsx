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

const simpleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
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
          variants={simpleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Core Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built to Eliminate Manual Reconciliation
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Every feature designed around one goal: perfect invoice data that requires zero manual checking.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="flex flex-col bg-gray-50 rounded-xl p-6 border border-gray-200 group hover:shadow-lg transition-shadow duration-200"
                variants={simpleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors duration-200">
                    <feature.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <div className="mt-6">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 border border-emerald-200">
                      ✓ {feature.benefit}
                    </span>
                  </div>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Time Savings Breakdown */}
        <motion.div 
          className="mt-20 sm:mt-24"
          variants={simpleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-2xl lg:text-center mb-12">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Exactly How You'll Save Time
            </h3>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Real numbers from managers who eliminated invoice reconciliation
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
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
                  key={item.task}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="font-medium text-gray-900">{item.task}</div>
                    <div className="text-center text-red-600 font-medium">{item.before}</div>
                    <div className="text-center text-emerald-600 font-medium">{item.after}</div>
                    <div className="text-center text-blue-600 font-semibold">{item.savings}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-emerald-50 px-6 py-4 border-t border-emerald-200">
              <div className="grid grid-cols-4 gap-4 text-sm font-bold">
                <div className="text-gray-900">Total Weekly Savings</div>
                <div></div>
                <div></div>
                <div className="text-center text-emerald-700 text-lg">12+ hours</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Integration Section */}
        <motion.div 
          className="mt-20 sm:mt-24"
          variants={simpleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-2xl lg:text-center mb-12">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Works with Your Existing Systems
            </h3>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Direct integration with major ERP systems used in oil & gas
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { name: 'SAP', description: 'Full AFE sync' },
              { name: 'JD Edwards', description: 'Real-time data' },
              { name: 'Oracle', description: 'Automated workflow' },
              { name: 'NetSuite', description: 'Instant updates' }
            ].map((system, index) => (
              <motion.div 
                key={system.name}
                className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="text-lg font-semibold text-gray-900 mb-2">{system.name}</div>
                <div className="text-sm text-gray-600">{system.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 