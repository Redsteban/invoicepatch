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

export default function Testimonials() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-emerald-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Real Results from Oil & Gas Operations
          </p>
        </motion.div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3">
          {testimonials.map((testimonial, testimonialIdx) => (
            <motion.div
              key={testimonialIdx}
              className="group relative"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: testimonialIdx * 0.1 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 h-full flex flex-col hover:shadow-xl transition-shadow duration-200">
                {/* Stars */}
                <div className="flex gap-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-emerald-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-900 flex-grow">
                  <p>"{testimonial.body}"</p>
                </blockquote>

                {/* Author Info */}
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                  <div className="text-gray-600">{testimonial.author.handle}</div>
                  <div className="text-sm text-emerald-600 font-medium">{testimonial.author.company}</div>
                  <div className="text-xs text-gray-500">{testimonial.author.location}</div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-1 gap-2">
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 