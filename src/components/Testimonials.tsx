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
    <div className="bg-gray-50 py-12 sm:py-16 lg:py-20 mobile-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6 break-words">
            What Our Users Say
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed break-words">
            Real feedback from managers and contractors using InvoicePatch
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              className="flex flex-col justify-between bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div>
                <div className="flex gap-1 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-900 mb-6 sm:mb-8 break-words">
                  "{testimonial.body}"
                </blockquote>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl font-bold text-gray-600">
                    {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900 break-words">{testimonial.author.name}</div>
                  <div className="text-sm sm:text-base text-gray-600 break-words">{testimonial.author.handle}</div>
                  <div className="text-sm text-gray-500 break-words">{testimonial.author.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 break-words">
            Join hundreds of satisfied customers who've eliminated invoice reconciliation
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-emerald-600 border border-transparent rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 touch-target">
              Start Your Free Trial
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 touch-target">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 