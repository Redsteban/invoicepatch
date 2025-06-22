'use client';

import { motion } from 'framer-motion';
import { Building2, HardHat, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';

export default function Home() {
  const router = useRouter();
  const { setRole } = useRole();

  const handleRoleSelection = (role: 'manager' | 'contractor') => {
    // Set role using context (which handles localStorage and cookies)
    setRole(role);
    
    // Redirect to appropriate dashboard/experience
    if (role === 'manager') {
      router.push('/manager/login');
    } else {
      router.push('/contractor');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardHover = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-5xl mx-auto w-full">
        {/* Company Branding */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            <span className="text-green-600">Invoice</span>Patch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamlined invoice processing for construction teams
          </p>
        </motion.div>

        {/* Role Selection Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome! What's your role?
          </h2>
          <p className="text-lg text-gray-600">
            Choose your role to access the right tools and features for you
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* Manager Card */}
          <motion.div variants={fadeInUp}>
            <motion.button
              onClick={() => handleRoleSelection('manager')}
              variants={cardHover}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white rounded-3xl p-10 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 group text-left"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Manager
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Process contractor invoices, manage approvals, handle payroll reconciliation, and access detailed analytics
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6 text-sm text-gray-700">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Invoice processing & approval workflows
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Contractor management & oversight
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Payroll reconciliation & reporting
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Advanced analytics & insights
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  Access Manager Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          </motion.div>

          {/* Contractor Card */}
          <motion.div variants={fadeInUp}>
            <motion.button
              onClick={() => handleRoleSelection('contractor')}
              variants={cardHover}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white rounded-3xl p-10 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 group text-left"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                  <HardHat className="w-10 h-10 text-green-600" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Contractor
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Create and submit invoices, track project time, manage expenses, and monitor payment status
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6 text-sm text-gray-700">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Automated invoice generation
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Time tracking & project management
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Expense tracking & receipts
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Payment status & history
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                  Access Contractor Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            Need help choosing? <button className="text-blue-600 hover:text-blue-700 font-medium underline">Contact our support team</button>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
