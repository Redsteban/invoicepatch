'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How long does it take to stop manual reconciliation?',
    answer: 'Most clients see immediate results. Basic sync setup takes 2-3 days. After that, every new work order automatically flows to contractors, and invoices come back pre-validated. Your next reconciliation cycle can drop from 8+ hours to under 1 hour.'
  },
  {
    question: 'Is my data secure during the sync process?',
    answer: 'Yes. We use bank-level encryption (AES-256) and never store sensitive financial data. InvoicePatch acts as a secure bridge between your systems - data flows through encrypted channels but isn\'t stored on our servers. We\'re SOC 2 Type II compliant.'
  },
  {
    question: 'What if I use a custom ERP or spreadsheet system?',
    answer: 'We handle custom integrations regularly. If you have APIs, database access, or even just Excel templates, we can usually sync within 2-3 weeks. Many clients start with our Excel/CSV connector while we build their custom integration.'
  },
  {
    question: 'Will this disrupt my current approval workflow?',
    answer: 'No. InvoicePatch enhances your workflow without changing it. You still receive invoices in your normal process - they just arrive with perfect data that matches your system. Your approval steps, routing, and payment processes stay exactly the same.'
  },
  {
    question: 'How much does it cost vs. the time I\'ll save?',
    answer: 'Plans start at $49/month. If you save just 2 hours weekly (most save 8+), you\'ve already recovered the cost at $25/hour billing rates. Average ROI is 400%+ in the first month from reduced reconciliation time alone.'
  },
  {
    question: 'What happens if a contractor doesn\'t use smartphones?',
    answer: 'We have web-based options and can even work with basic phone calls. However, 95% of contractors prefer the mobile app once they see how it eliminates invoice paperwork and gets them paid faster with pre-validated data.'
  },
  {
    question: 'Can I try this with just one project to test it?',
    answer: 'Absolutely. We recommend starting with 1-2 contractors on current projects. You\'ll see the reconciliation time savings immediately. Most clients roll out to all contractors within 30 days after seeing the results.'
  },
  {
    question: 'Does this work with multiple provinces/territories?',
    answer: 'Yes. InvoicePatch handles all Canadian tax rates automatically - HST, PST+GST, and territorial variations. Tax calculations happen automatically based on work location, so contractors and managers don\'t need to think about it.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-base font-semibold leading-7 text-emerald-600">FAQ</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Common Questions About Eliminating Reconciliation
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Answers to questions we hear from managers ready to stop spending weekends on invoice reconciliation
          </p>
        </motion.div>
        
        <div className="mt-16">
          <dl className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className="border border-gray-200 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <dt>
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-start justify-between text-left text-gray-900 p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-lg font-semibold leading-7 pr-4">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center flex-shrink-0">
                      <ChevronDownIcon
                        className={`h-6 w-6 transform transition-transform duration-200 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </dt>
                {openIndex === index && (
                  <motion.dd 
                    className="px-6 pb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                  </motion.dd>
                )}
              </motion.div>
            ))}
          </dl>
        </div>
        
        {/* Bottom CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-2xl bg-gray-50 border border-gray-200 px-6 py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Schedule a 15-minute call to see exactly how this works with your system
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors duration-200 hover:scale-105 transform">
                Schedule Call
              </button>
              <button className="rounded-lg border border-emerald-600 bg-white px-8 py-3 text-base font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors duration-200">
                See Demo First
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 