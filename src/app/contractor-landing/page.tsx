'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Camera, 
  FileText, 
  MapPin, 
  DollarSign,
  Play,
  Sparkles,
  Timer,
  Receipt,
  Wrench,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ContractorLanding() {
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
      icon: Timer,
      title: "Site Time Tracking",
      description: "GPS-enabled time tracking with safety compliance and equipment logging for remote oil & gas sites"
    },
    {
      icon: FileText,
      title: "Service Invoicing",
      description: "Automated invoice creation for drilling, completion, production, and maintenance services"
    },
    {
      icon: Camera,
      title: "Site Documentation",
      description: "Capture well site photos, equipment inspections, and safety compliance documentation"
    },
    {
      icon: Receipt,
      title: "Equipment & Expenses",
      description: "Track specialized equipment usage, fuel costs, and field expenses with receipt management"
    }
  ];

  const benefits = [
    "Get paid faster with automated service invoicing",
    "Never miss billable hours at remote locations",
    "Professional documentation for safety compliance",
    "Real-time payment status for all operators",
    "Streamlined equipment and expense tracking",
    "Mobile-first design for field operations"
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Clock In",
      description: "Start your shift timer with GPS verification at well sites"
    },
    {
      step: "2",
      title: "Track Services",
      description: "Log drilling, completion, or production hours with equipment details"
    },
    {
      step: "3",
      title: "Submit Invoice",
      description: "Generate detailed service invoices for operators automatically"
    },
    {
      step: "4",
      title: "Get Paid",
      description: "Receive payments faster with streamlined operator processing"
    }
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
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-10 h-10 text-green-600" />
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Oil & Gas Field
              <span className="text-green-600 block">Operations Hub</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your oilfield services with smart time tracking, automated invoicing, 
              and comprehensive site documentation—built for Canadian oil & gas subcontractors.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contractor/dashboard')}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Start Field Work</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/contractor-demo')}
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>View Demo</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
            Simple 4-Step Service Workflow
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
            From site arrival to payment, everything is automated and optimized for oilfield operations
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in the Field
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional tools designed for mobile-first oil & gas field operations
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
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Work Smarter, Get Paid Faster
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join hundreds of oil & gas subcontractors who have simplified their workflow and increased their earnings with InvoicePatch.
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
              <div className="text-4xl font-bold text-green-600 mb-2">5 Days</div>
              <div className="text-gray-600">Faster operator payment processing</div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">60%</div>
                <div className="text-sm text-gray-600">Less Admin Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">Service Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Remote Access</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Lost Service Hours</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Safety & Compliance Ready</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Built-in safety documentation and regulatory compliance features
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Ready to Streamline Your Oilfield Operations?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90">
              Start tracking service hours, documenting site work, and getting paid faster today.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contractor/dashboard')}
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Back to Role Selection
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
} 