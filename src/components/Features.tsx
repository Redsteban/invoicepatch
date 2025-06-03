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
    <div className="bg-white py-12 sm:py-16 lg:py-20 mobile-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Features Section */}
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center"
          variants={simpleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Core Features</h2>
          <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl break-words">
            Built to Eliminate Manual Reconciliation
          </p>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 break-words">
            Every feature designed around one goal: perfect invoice data that requires zero manual checking.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 sm:mt-16 lg:mt-24 max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="flex flex-col bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 group hover:shadow-lg transition-shadow duration-200"
                variants={simpleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <dt className="flex items-center gap-x-3 text-sm sm:text-base font-semibold leading-7 text-gray-900 mb-3 sm:mb-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors duration-200 flex-shrink-0">
                    <feature.icon className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" aria-hidden="true" />
                  </div>
                  <span className="break-words">{feature.name}</span>
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
                  <p className="flex-auto break-words">{feature.description}</p>
                  <div className="mt-4 sm:mt-6">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs sm:text-sm font-semibold text-emerald-700 border border-emerald-200 break-words">
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
          className="mt-16 sm:mt-20 lg:mt-24"
          variants={simpleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-2xl lg:text-center mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl break-words">
              Exactly How You'll Save Time
            </h3>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 break-words">
              Real numbers from managers who eliminated invoice reconciliation
            </p>
          </div>

          <div className="rounded-lg sm:rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
            <div className="bg-gray-50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-1 sm:gap-2 lg:gap-4 text-xs sm:text-sm font-semibold text-gray-700">
                <div className="break-words">Task</div>
                <div className="text-center break-words">Before</div>
                <div className="text-center break-words">After</div>
                <div className="text-center break-words">Saved</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {timeComparison.map((item, index) => (
                <motion.div 
                  key={item.task}
                  className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className="grid grid-cols-4 gap-1 sm:gap-2 lg:gap-4 text-xs sm:text-sm">
                    <div className="font-medium text-gray-900 break-words">{item.task}</div>
                    <div className="text-center text-red-600 font-medium break-words">{item.before}</div>
                    <div className="text-center text-emerald-600 font-medium break-words">{item.after}</div>
                    <div className="text-center text-blue-600 font-semibold break-words">{item.savings}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-emerald-50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-emerald-200">
              <div className="grid grid-cols-4 gap-1 sm:gap-2 lg:gap-4 text-xs sm:text-sm font-bold">
                <div className="text-gray-900 col-span-3 break-words">Total Weekly Savings</div>
                <div className="text-center text-emerald-700 text-sm sm:text-base lg:text-lg">12+ hours</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Integration Section */}
        <motion.div 
          className="mt-16 sm:mt-20 lg:mt-24"
          variants={simpleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-2xl lg:text-center mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl break-words">
              Works with Your Existing Systems
            </h3>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 break-words">
              Direct integration with systems used daily by oil & gas companies
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {[
              { name: 'FieldCap', description: 'Direct sync' },
              { name: 'FireSpark', description: 'Real-time data' },
              { name: 'AFE Manager', description: 'Cost tracking' },
              { name: 'WellView', description: 'Production data' }
            ].map((system, index) => (
              <motion.div 
                key={system.name}
                className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 break-words">{system.name}</div>
                <div className="text-xs sm:text-sm text-gray-600 break-words">{system.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 