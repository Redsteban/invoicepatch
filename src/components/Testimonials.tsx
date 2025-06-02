'use client';

import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/20/solid';

const testimonials = [
  {
    body: "Friday afternoons used to be my nightmare - 8 hours of matching contractor invoices to our SAP data. Coil tubing crews, frac contractors, pipeline inspectors - all different billing formats. Now I approve everything in under an hour because the data perfectly matches our system. My weekends are back.",
    author: {
      name: 'Sarah Chen',
      handle: 'Operations Manager',
      company: 'Suncor Energy Services',
      location: 'Alberta'
    },
    stats: {
      timeSaved: '7+ hours weekly',
      errorReduction: '95% fewer errors',
      system: 'SAP + QuickBooks'
    }
  },
  {
    body: "The billing errors were killing us. Wireline contractors would submit invoices with wrong AFE codes, missing well IDs, incorrect per-foot rates. Every invoice needed 3-4 back-and-forth emails. InvoicePatch eliminated all of that - contractors now submit perfect invoices because the data comes directly from our ERP.",
    author: {
      name: 'Mike Rodriguez',
      handle: 'Field Operations Supervisor',
      company: 'Encana Corporation',
      location: 'Colorado'
    },
    stats: {
      timeSaved: '12+ hours weekly',
      errorReduction: '98% fewer errors',
      system: 'JDE + Oracle'
    }
  },
  {
    body: "As a pressure pumping contractor, I was losing $800-1200 every time I missed a service company's invoice deadline. The AFE codes, well names, equipment rates - I was always guessing. Now everything auto-populates from their system. I submit invoices in 2 minutes and get paid in days, not weeks.",
    author: {
      name: 'David Thompson',
      handle: 'Pressure Pumping Contractor',
      company: 'Thompson Oilfield Services',
      location: 'Texas'
    },
    stats: {
      timeSaved: '5+ hours weekly',
      errorReduction: '100% accuracy',
      system: 'Mobile + Cloud'
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const statsVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Testimonials() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-emerald-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Real Results from Oil & Gas Operations
          </p>
        </motion.div>
        
        <motion.div 
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, testimonialIdx) => (
            <motion.div
              key={testimonialIdx}
              className="group relative"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <motion.div 
                className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 h-full flex flex-col"
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  scale: 1.02
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Stars */}
                <motion.div 
                  className="flex gap-x-1 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                    >
                      <StarIcon className="h-5 w-5 text-emerald-400" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Testimonial Text */}
                <motion.blockquote 
                  className="text-gray-900 flex-grow"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <p>"{testimonial.body}"</p>
                </motion.blockquote>

                {/* Author Info */}
                <motion.div 
                  className="mt-6 border-t border-gray-100 pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                  <div className="text-gray-600">{testimonial.author.handle}</div>
                  <div className="text-sm text-emerald-600 font-medium">{testimonial.author.company}</div>
                  <div className="text-xs text-gray-500">{testimonial.author.location}</div>
                </motion.div>

                {/* Stats */}
                <motion.div 
                  className="mt-4 grid grid-cols-1 gap-2"
                  variants={statsVariants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: 0.6 }}
                >
                  <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center">
                    <div className="text-sm font-semibold text-emerald-700">{testimonial.stats.timeSaved}</div>
                    <div className="text-xs text-emerald-600">Time Saved</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                    <div className="text-sm font-semibold text-blue-700">{testimonial.stats.errorReduction}</div>
                    <div className="text-xs text-blue-600">Error Reduction</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
                    <div className="text-sm font-semibold text-gray-700">{testimonial.stats.system}</div>
                    <div className="text-xs text-gray-600">System Integration</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 