'use client';

import { motion } from 'framer-motion';
import { 
  Building2, 
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
    projectSize: '',
    message: ''
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Redirect to success page or show confirmation
    router.push('/success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">Invoice</span>Patch
              </span>
            </div>
            <button
              onClick={() => router.push('/manager-marketing')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Marketing
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Let's Build Something Great Together
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get a custom solution tailored to your construction company's needs. 
              Our enterprise team will work with you to create the perfect workflow.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="ABC Construction"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="projectSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Size *
                </label>
                <select
                  id="projectSize"
                  name="projectSize"
                  required
                  value={formData.projectSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Select project size</option>
                  <option value="small">Small (1-10 contractors)</option>
                  <option value="medium">Medium (11-50 contractors)</option>
                  <option value="large">Large (51-200 contractors)</option>
                  <option value="enterprise">Enterprise (200+ contractors)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your needs
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Describe your current challenges and what you're looking for..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Get Custom Quote</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* Right Column - Information */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-8"
          >
            {/* Contact Methods */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Sales Team</div>
                    <div className="text-gray-600">sales@invoicepatch.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Call Sales</div>
                    <div className="text-gray-600">+1 (800) 555-0123</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Schedule Demo</div>
                    <div className="text-gray-600">Book a personalized demo</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Features */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Enterprise Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Custom integrations & APIs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Dedicated account manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">White-label solutions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Advanced security & compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Custom workflows & automation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">SLA guarantees</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Trusted by Industry Leaders</h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm opacity-80">Companies</div>
                </div>
                <div>
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">SOC 2</div>
                  <div className="text-sm opacity-80">Compliant</div>
                </div>
                <div>
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm opacity-80">Uptime</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 