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
      {/* Simplified Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-400 to-emerald-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-6xl text-center">
          {/* Problem Badge */}
          <motion.div 
            className="mb-6 sm:mb-8 flex justify-center px-2 sm:px-4"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative rounded-full bg-red-50 px-3 py-2 text-xs sm:text-sm leading-5 sm:leading-6 text-red-700 ring-1 ring-red-600/20 hover:scale-105 transition-transform duration-200 text-center">
              <ExclamationTriangleIcon className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Oilfield contractors lose $500-1000 per missed invoice deadline</span>
              <span className="sm:hidden">Contractors lose $500+ per missed deadline</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 px-2 sm:px-4 lg:px-0"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <span className="text-blue-600">Stop Playing Invoice Detective Every Friday Afternoon</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="mt-4 sm:mt-6 text-lg sm:text-xl lg:text-2xl font-semibold sm:font-bold leading-6 sm:leading-7 lg:leading-8 text-gray-600 max-w-4xl mx-auto px-3 sm:px-4 lg:px-0"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Upload your project data once. Contractors submit pre-matched invoices. Approve everything in minutes, not hours.
          </motion.p>

          {/* CTA Section */}
          <motion.div 
            className="mt-8 sm:mt-10 flex flex-col items-stretch sm:flex-row sm:items-center justify-center gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-0"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/contractor-dashboard"
              className="mobile-button w-full sm:w-auto rounded-lg sm:rounded-md bg-emerald-600 px-4 sm:px-6 py-4 sm:py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors duration-200 hover:scale-105 transform group"
            >
              <span className="flex items-center justify-center">
                Contractor Interface
                <ArrowRightIcon className="ml-2 h-4 w-4 inline group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="text-xs text-emerald-100 mt-1 font-normal">Manual entry, time tracking, mobile invoicing</div>
            </Link>
            
            <Link
              href="/manager-reconciliation"
              className="mobile-button w-full sm:w-auto rounded-lg sm:rounded-md bg-blue-600 px-4 sm:px-6 py-4 sm:py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-200 hover:scale-105 transform group"
            >
              <span className="flex items-center justify-center">
                Manager Interface
                <DocumentTextIcon className="ml-2 h-4 w-4 inline group-hover:scale-110 transition-transform" />
              </span>
              <div className="text-xs text-blue-100 mt-1 font-normal">ERP sync, bulk approvals, reconciliation</div>
            </Link>
            
            <button className="mobile-button w-full sm:w-auto flex items-center justify-center text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors duration-200 py-2">
              <PlayCircleIcon className="mr-2 h-5 w-5" />
              Watch 2-min demo
            </button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3 px-3 sm:px-4 lg:px-0"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <div className="mx-auto flex max-w-xs flex-col gap-y-2 sm:gap-y-4 text-center">
              <dd className="order-first text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-emerald-600">8+ hours</dd>
              <dt className="text-sm sm:text-base leading-5 sm:leading-7 text-gray-600">Average time saved per week</dt>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-2 sm:gap-y-4 text-center">
              <dd className="order-first text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-blue-600">95%</dd>
              <dt className="text-sm sm:text-base leading-5 sm:leading-7 text-gray-600">Billing error reduction</dt>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-2 sm:gap-y-4 text-center">
              <dd className="order-first text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-emerald-600">3x</dd>
              <dt className="text-sm sm:text-base leading-5 sm:leading-7 text-gray-600">Faster payment processing</dt>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 