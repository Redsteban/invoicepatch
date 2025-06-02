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
      
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          {/* Problem Badge */}
          <motion.div 
            className="mb-8 flex justify-center"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative rounded-full bg-red-50 px-4 py-2 text-sm leading-6 text-red-700 ring-1 ring-red-600/20 hover:scale-105 transition-transform duration-200">
              <ExclamationTriangleIcon className="inline h-4 w-4 mr-2" />
              Oilfield contractors lose $500-1000 per missed invoice deadline
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl mb-6"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <span className="text-emerald-600">Get Paid Faster.</span>
            <br />
            <span className="text-blue-600">Stop Reconciliation Hell.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            InvoicePatch syncs your ERP data directly to contractor mobile apps. 
            Same AFE codes, same well names, same rates. Zero reconciliation needed.
          </motion.p>

          {/* CTA Section */}
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/invoice-builder"
              className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors duration-200 hover:scale-105 transform"
            >
              Try Invoice Builder
              <ArrowRightIcon className="ml-2 h-4 w-4 inline" />
            </Link>
            
            <button className="flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors duration-200">
              <PlayCircleIcon className="mr-2 h-5 w-5" />
              Watch 2-min demo
            </button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Average time saved per week</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-emerald-600 sm:text-5xl">8+ hours</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Billing error reduction</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-blue-600 sm:text-5xl">95%</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Faster payment processing</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-emerald-600 sm:text-5xl">3x</dd>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 