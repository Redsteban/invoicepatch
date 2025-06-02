'use client';

import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  UserGroupIcon,
  UserIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const managerProblems = [
  {
    title: "Manual verification of AFE codes against service contractor invoices",
    description: "Your system shows contractor worked on AFE 24-015 Cardium Horizontal well, but their invoice shows 'Johnson Well #3'. Time to dig through field reports and make phone calls to verify.",
    icon: DocumentMagnifyingGlassIcon,
    stat: "40% of oilfield invoices require verification"
  },
  {
    title: "Weekend reconciliation hell with multiple service contractors",
    description: "Friday afternoon becomes reconciliation nightmare. Pressure pumping invoices, wireline charges, coil tubing rates, directional drilling fees - all need manual verification against SAP or JDE.",
    icon: ExclamationTriangleIcon,
    stat: "Managers report 10-15 hours weekly"
  },
  {
    title: "Service contractors undercharge without real-time rate access",
    description: "Coil tubing crew charges $800/day, approved rate is $950/day. Contractor doesn't know current rates. You catch the error, but revenue is lost and invoices need rework.",
    icon: CurrencyDollarIcon,
    stat: "15-25% revenue lost to undercharging"
  },
  {
    title: "Missing standby time and equipment charges in field invoices",
    description: "Your field reports show contractor on standby Tuesday and Thursday, but their invoice only shows active hours. Time to dig through field supervisor logs and make calls.",
    icon: ClockIcon,
    stat: "35% of billable time missed"
  }
];

const contractorProblems = [
  {
    title: "Guessing at AFE codes and well IDs without field data access",
    description: "You know you worked on the Cardium Horizontal well, but was it AFE 24-015 or 24-016? Is this Eagle Ford or Bakken pricing? Wrong codes mean delayed payments and angry office staff.",
    icon: DocumentDuplicateIcon,
    stat: "Average 3-5 billing errors per invoice"
  },
  {
    title: "No access to service company's current rates and per-foot pricing",
    description: "Did the standby rate change? Is this wellhead vs surface pricing? Are mobilization charges billable? You're working blind without real-time access to approved rate schedules.",
    icon: EyeIcon,
    stat: "50% unsure of current rates"
  },
  {
    title: "Missing invoice deadlines due to complex field schedules",
    description: "Drilling ops run 24/7 with different completion cycles. Was the Precision invoice due the 15th or month-end? Late submissions to service companies mean 6-week payment delays.",
    icon: ClockIcon,
    stat: "40% of oilfield contractors miss deadlines"
  },
  {
    title: "Equipment vs services tax complexity across provinces",
    description: "HST on coil tubing equipment rental, PST+GST on services, different rates for per diems and travel allowances. Cross-border jobs create compliance nightmares with CRA audits.",
    icon: ExclamationTriangleIcon,
    stat: "Hours of tax reconciliation per month"
  }
];

const solutions = [
  {
    title: "AFE and well data syncs directly to service contractor apps",
    description: "Well IDs, AFE codes, authorized rates, and billing deadlines flow automatically from your ERP system to contractor mobile apps. No more guessing at project codes.",
    icon: ArrowPathIcon,
    stat: "100% data accuracy"
  },
  {
    title: "Pre-filled invoices with validated AFE and well information",
    description: "Service contractors submit invoices that are already populated with your exact well names, AFE codes, and approved rates. They just add hours and equipment time, hit submit.",
    icon: CheckCircleIcon,
    stat: "95% reduction in billing errors"
  },
  {
    title: "One-click approval since all data matches your ERP",
    description: "No more line-by-line verification of AFE codes and well names. Since the data came from your SAP/JDE system, you can approve with confidence in seconds.",
    icon: EyeIcon,
    stat: "98% faster approvals"
  },
  {
    title: "Real-time visibility into well costs and AFE spending",
    description: "See hours logged, equipment charges, and AFE burn rates in real-time. No more surprises when service contractor invoices arrive at month-end.",
    icon: CurrencyDollarIcon,
    stat: "Live AFE budget tracking"
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

const slideInLeft = {
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

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export default function ProblemSolution() {
  return (
    <div className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Problems Section */}
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold leading-7 text-gray-600">The Oilfield Reconciliation Problem</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            AFE Data Lives in ERP, Service Contractors Recreate It Manually
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Operations managers have well data and AFE codes in their ERP systems. Service contractors recreate it manually on invoices. 
            This disconnect creates billing errors, payment delays, and weekend reconciliation hell.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Manager Problems */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <UserGroupIcon className="h-8 w-8 text-gray-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                Operations Manager Pain Points
              </h3>
            </div>
            
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {managerProblems.map((problem, index) => (
                <motion.div 
                  key={index} 
                  className="relative rounded-xl bg-white p-6 shadow-sm border border-gray-200 group"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 group-hover:bg-red-100"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <problem.icon className="h-6 w-6 text-red-600" aria-hidden="true" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {problem.title}
                      </h4>
                      <p className="text-gray-600 mb-4 text-sm">
                        {problem.description}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                        {problem.stat}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Contractor Problems */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <UserIcon className="h-8 w-8 text-gray-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                Service Contractor Pain Points
              </h3>
            </div>
            
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {contractorProblems.map((problem, index) => (
                <motion.div 
                  key={index} 
                  className="relative rounded-xl bg-white p-6 shadow-sm border border-gray-200 group"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100"
                        whileHover={{ rotate: -360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <problem.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {problem.title}
                      </h4>
                      <p className="text-gray-600 mb-4 text-sm">
                        {problem.description}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        {problem.stat}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Solution Section */}
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-base font-semibold leading-7 text-emerald-600">The ERP Sync Solution</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            One Source of Truth: Your ERP to Their Mobile App
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            InvoicePatch connects your SAP, JDE, or Oracle system directly to service contractor mobile apps. 
            Same AFE codes, same well names, same rates - zero reconciliation needed.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {solutions.map((solution, index) => (
            <motion.div 
              key={index} 
              className="relative rounded-xl bg-white p-6 shadow-sm border border-emerald-200 group"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <motion.div 
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <solution.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  </motion.div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {solution.title}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {solution.description}
                  </p>
                  <motion.span 
                    className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ✓ {solution.stat}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Solution Workflow */}
        <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How Data Sync Works
          </h3>
          
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Work Order</h4>
              <p className="text-sm text-gray-600">Manager creates work order in QuickBooks/Sage/Xero with project codes, rates, locations</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:block">
              <ArrowPathIcon className="h-8 w-8 text-emerald-600" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Sync</h4>
              <p className="text-sm text-gray-600">Work order data appears instantly in contractor's mobile app with all details</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:block">
              <ArrowPathIcon className="h-8 w-8 text-emerald-600" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                <span className="text-2xl font-bold text-gray-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pre-filled Invoice</h4>
              <p className="text-sm text-gray-600">Contractor submits invoice with your exact data - just adds hours and submits</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:block">
              <ArrowPathIcon className="h-8 w-8 text-emerald-600" />
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-2xl font-bold text-emerald-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">One-Click Approve</h4>
              <p className="text-sm text-gray-600">Perfect match = instant approval. No reconciliation needed</p>
            </div>
          </div>
        </div>

        {/* ROI Section */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-8 py-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Stop the Reconciliation Madness
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              See exactly how data sync will work with your specific system
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500">
                Schedule Demo Call
              </button>
              <button className="rounded-lg border border-emerald-600 bg-white px-8 py-3 text-base font-semibold text-emerald-600 hover:bg-emerald-50">
                Try Reconciliation Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 