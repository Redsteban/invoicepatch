'use client';

import { motion } from 'framer-motion';
import { 
  DocumentArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Quick Invoice Processing',
    description: 'Upload invoices and get them processed automatically with AI-powered data extraction.',
    icon: DocumentArrowUpIcon,
    color: 'text-blue-600'
  },
  {
    title: 'Time Savings',
    description: 'Reduce manual data entry and invoice reconciliation time significantly.',
    icon: ClockIcon,
    color: 'text-emerald-600'
  },
  {
    title: 'Accurate Matching',
    description: 'Smart matching algorithms ensure invoices are properly reconciled.',
    icon: CheckCircleIcon,
    color: 'text-violet-600'
  },
  {
    title: 'Cost Effective',
    description: 'Affordable pricing that scales with your business needs.',
    icon: CurrencyDollarIcon,
    color: 'text-amber-600'
  }
];

const cardVariants = {
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

export default function FeatureShowcase() {
  return (
    <div className="bg-gray-50 py-12 sm:py-16 lg:py-20 mobile-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6 break-words">
            Streamline Your Invoice Management
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed break-words">
            Simple, effective tools for professional invoice processing
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex flex-col justify-between bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-50 flex items-center justify-center mb-4 sm:mb-6`}>
                  <feature.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${feature.color}`} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 break-words">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base leading-6 sm:leading-7 text-gray-600 break-words">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 touch-target">
              Try Free Demo
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 touch-target">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 