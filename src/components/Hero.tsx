'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  PlayCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface EmailForm {
  email: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Hero() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 7, hours: 12, minutes: 30, seconds: 45 });
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EmailForm>();

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else if (prevTime.days > 0) {
          return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: EmailForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to secure your spot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Animated Background decoration */}
      <motion.div 
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-400 to-emerald-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </motion.div>
      
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div 
          className="mx-auto max-w-6xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Problem Badge */}
          <motion.div 
            className="mb-8 flex justify-center"
            variants={itemVariants}
          >
            <motion.div 
              className="relative rounded-full bg-red-50 px-4 py-2 text-sm leading-6 text-red-700 ring-1 ring-red-600/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ExclamationTriangleIcon className="inline h-4 w-4 mr-2" />
              Oilfield contractors lose $500-1000 per missed invoice deadline
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl mb-6"
            variants={itemVariants}
          >
            <motion.span 
              className="text-emerald-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Get Paid Faster.
            </motion.span>
            <br />
            <motion.span 
              className="text-blue-600"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Approve Faster.
            </motion.span>
            <br />
            <motion.span 
              className="text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Everyone Wins.
            </motion.span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            className="text-xl leading-8 text-gray-600 max-w-4xl mx-auto mb-12"
            variants={itemVariants}
          >
            InvoicePatch connects oilfield contractors and service companies with automatic AFE sync, 
            real-time payment tracking, and instant approvals. No more chasing payments or weekend reconciliation hell.
          </motion.p>

          {/* Dual Value Props - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* For Contractors */}
            <motion.div 
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200"
              variants={slideInLeft}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-emerald-900 mb-3">For Oilfield Contractors</h3>
              <div className="space-y-2 text-left text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-emerald-800"><strong>2-minute invoices</strong> with AFE codes auto-populated</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-emerald-800"><strong>Get paid 3x faster</strong> with real-time tracking</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-emerald-800"><strong>Never miss deadlines</strong> with automatic alerts</p>
                </div>
              </div>
            </motion.div>

            {/* For Managers */}
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
              variants={slideInRight}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <ClockIcon className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">For Operations Managers</h3>
              <div className="space-y-2 text-left text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800"><strong>90% less reconciliation time</strong> - 8 hours to 45 minutes</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800"><strong>One-click approvals</strong> with pre-validated data</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800"><strong>Automatic ERP sync</strong> with SAP, JDE, Oracle</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/invoice-builder"
                className="rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 flex items-center space-x-2 transition-all duration-200"
              >
                <span>Try Invoice Builder (Free)</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.button 
              className="group flex items-center space-x-2 text-lg font-semibold leading-6 text-gray-700 hover:text-emerald-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <PlayCircleIcon className="h-6 w-6 group-hover:text-emerald-600" />
              <span>Watch 3-min demo</span>
            </motion.button>
          </motion.div>

          {/* Results Banner */}
          <motion.div 
            className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-6 text-white mb-12"
            variants={scaleIn}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold mb-4">Real Results from Oil & Gas Companies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold mb-1">$2,600+</div>
                <div className="text-emerald-100 text-sm">Monthly savings per manager</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold mb-1">3x Faster</div>
                <div className="text-blue-100 text-sm">Payment processing</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold mb-1">90%</div>
                <div className="text-emerald-100 text-sm">Fewer billing errors</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="bg-gray-50 rounded-2xl p-6 max-w-3xl mx-auto border border-gray-200"
            variants={itemVariants}
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div className="flex items-center justify-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <motion.svg 
                  key={i} 
                  className="w-5 h-5 text-emerald-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>
            <blockquote className="text-lg text-gray-700 mb-3 leading-relaxed">
              "Our contractors went from waiting 6 weeks for payment to getting paid in 5 days. I went from spending every Friday reconciling invoices to approving everything in 30 minutes."
            </blockquote>
            <cite className="text-sm text-gray-600">
              — Sarah Chen, Operations Manager, Suncor Energy Services
            </cite>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 