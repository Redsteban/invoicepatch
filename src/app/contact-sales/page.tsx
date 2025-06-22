'use client';

import { motion } from 'framer-motion';
import { 
  Drill, 
  ArrowRight, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ContactSales() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    operationSize: '',
    message: ''
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    router.push('/success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Drill className="w-8 h-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-green-600">Invoice</span>Patch
              </span>
            </div>
            <button
              onClick={() => router.push('/manager-marketing')}
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Back to Features
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Optimize Your Field Operations
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get a custom solution tailored to your oil & gas company's needs. 
              Our enterprise team will help you design the perfect workflow.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text" id="name" name="name" required
                    value={formData.name} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Work Email *</label>
                  <input
                    type="email" id="email" name="email" required
                    value={formData.email} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="john@youroperations.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text" id="company" name="company" required
                    value={formData.company} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Precision Flow Services"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel" id="phone" name="phone"
                    value={formData.phone} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="operationSize" className="block text-sm font-medium text-gray-700 mb-2">Operation Size *</label>
                <select
                  id="operationSize" name="operationSize" required
                  value={formData.operationSize} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select your scale</option>
                  <option value="small">Small (1-10 Sub-Contractors)</option>
                  <option value="medium">Medium (11-50 Sub-Contractors)</option>
                  <option value="large">Large (51-200 Sub-Contractors)</option>
                  <option value="enterprise">Enterprise (200+ Sub-Contractors)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">How can we help?</label>
                <textarea
                  id="message" name="message" rows={4}
                  value={formData.message} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your current field ticket and payment challenges..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Request a Custom Demo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* Right Column - Benefits */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="pt-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Enterprise-Grade Solution</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our platform is built for the demands of the oil and gas industry, providing security, scalability, and dedicated support.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Advanced Security</h3>
                  <p className="text-gray-600">SOC 2 Type II compliance and data encryption at rest and in transit.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Custom Integrations</h3>
                  <p className="text-gray-600">Seamlessly connect with your existing ERP, accounting, and EHS systems.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dedicated Support</h3>
                  <p className="text-gray-600">Get a dedicated account manager and priority support for your entire team.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Or Contact Us Directly</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-3 text-green-600" />
                  <a href="mailto:sales@invoicepatch.com" className="hover:text-green-700">sales@invoicepatch.com</a>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-3 text-green-600" />
                  <span>+1 (800) 555-0199</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-green-600" />
                  <span>Mon - Fri, 8am - 6pm CST</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 