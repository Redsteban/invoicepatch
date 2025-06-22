'use client';

import { motion } from 'framer-motion';
import { 
  Fuel, 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Users, 
  FileText, 
  Drill,
  Play,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManagerLanding() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: FileText,
      title: "Field Ticket Processing",
      description: "Automated field ticket validation, and approval workflows"
    },
    {
      icon: Users,
      title: "Sub-contractor Oversight",
      description: "Comprehensive oversight of sub-contractor performance and compliance"
    },
    {
      icon: BarChart3,
      title: "Operations Analytics",
      description: "Real-time insights into costs, equipment uptime, and project metrics"
    },
    {
      icon: Fuel,
      title: "Cost Reconciliation",
      description: "Streamlined cost tracking with automated reconciliation"
    }
  ];

  const benefits = [
    "Reduce ticket processing time by 80%",
    "Eliminate manual data entry errors",
    "Real-time operational cost tracking",
    "Automated compliance and safety monitoring",
    "Instant payment status for sub-contractors",
    "Comprehensive digital audit trails"
  ];

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <Drill className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Command Your
              <span className="text-green-600 block">Oil & Gas Operations</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Transform your oil and gas project management with AI-powered field ticket processing, 
              real-time analytics, and streamlined sub-contractor oversight.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/manager/dashboard')}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <Play className="w-5 h-5" />
                <span>Access Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/manager-demo-specific')}
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>View Live Demo</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
            Total Control, From Wellhead to Invoice
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed specifically for oil & gas operations managers
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Boost Efficiency, Cut Costs
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join hundreds of site supervisors who have transformed their field operations with InvoicePatch.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">$50K+</div>
                <div className="text-gray-600">Average annual savings per project</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">75%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Compliance</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
            Ready to Transform Your Operations?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90">
            Get started with your management dashboard and see the difference immediately.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/manager/dashboard')}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 group"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/contact-sales')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.main>
  );
} 