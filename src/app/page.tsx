'use client';

import { motion } from 'framer-motion';
import { Drill, HardHat, ArrowRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { setRole } = useRole();
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole && (savedRole === 'manager' || savedRole === 'contractor')) {
      setIsReturningUser(true);
    }
  }, []);

  const handleRoleSelection = (selectedRole: 'manager' | 'contractor') => {
    setShowTransition(true);
    setRole(selectedRole);
    setTimeout(() => {
      const targetPath = selectedRole === 'manager' ? '/manager-landing' : '/contractor-landing';
      router.push(targetPath);
    }, 300);
  };

  const handleSkipToDashboard = () => {
    const savedRole = localStorage.getItem('userRole');
    const targetPath = savedRole === 'manager' ? '/manager/dashboard' : '/contractor/dashboard';
    router.push(targetPath);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerChildren = { visible: { transition: { staggerChildren: 0.2 } } };
  const cardHover = { hover: { y: -8, scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } } };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center px-4">
      {showTransition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">Configuring your dashboard...</p>
          </div>
        </motion.div>
      )}

      <div className="max-w-5xl mx-auto w-full">
        {isReturningUser && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome Back!</h3>
              <p className="text-gray-600 mb-4">Jump straight to your dashboard or select a different role.</p>
              <button
                onClick={handleSkipToDashboard}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </motion.div>
        )}

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            <span className="text-green-600">Invoice</span>Patch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamlined Field Ticket Processing for Oil & Gas Operations
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isReturningUser ? "Review Your Role" : "Identify Your Role"}
          </h2>
          <p className="text-lg text-gray-600">
            {isReturningUser ? "Select a role to explore different features" : "Choose your role to get started."}
          </p>
        </motion.div>

        <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div variants={fadeInUp}>
            <motion.button
              onClick={() => handleRoleSelection('manager')}
              variants={cardHover}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="w-full h-full bg-white rounded-3xl p-10 border border-gray-200 hover:border-green-600/50 hover:shadow-lg transition-all duration-300 group text-left flex flex-col"
            >
              <div className="flex-grow">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Drill className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Operations Manager</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Process field tickets, manage approvals, reconcile costs, and access detailed operational analytics.
                </p>
                <div className="space-y-2 mb-6 text-sm text-gray-700">
                  <div className="flex items-center"><div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>Field ticket validation</div>
                  <div className="flex items-center"><div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>Sub-contractor management</div>
                  <div className="flex items-center"><div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>Cost tracking & AFE reconciliation</div>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <span className="font-semibold text-green-600 flex items-center">
                  Select Manager Role <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
            </motion.button>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <motion.button
              onClick={() => handleRoleSelection('contractor')}
              variants={cardHover}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="w-full h-full bg-white rounded-3xl p-10 border border-gray-200 hover:border-green-600/50 hover:shadow-lg transition-all duration-300 group text-left flex flex-col"
            >
              <div className="flex-grow">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <HardHat className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Field Sub-Contractor</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Submit daily field tickets, track your work hours, log equipment usage, and monitor payment status.
                </p>
                <div className="space-y-2 mb-6 text-sm text-gray-700">
                  <div className="flex items-center"><div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>Daily field ticket submission</div>
                  <div className="flex items-center"><div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>Real-time hour and equipment logging</div>
                  <div className="flex items-center"><div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>Automated payment tracking</div>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <span className="font-semibold text-green-600 flex items-center">
                  Select Contractor Role <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
