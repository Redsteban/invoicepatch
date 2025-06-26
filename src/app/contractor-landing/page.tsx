'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Timer,
  FileText, 
  Camera, 
  Receipt,
  Play,
  Sparkles,
  Shield,
  Fuel,
  HardHat,
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const features = [
    {
      icon: Timer,
      title: "Digital Field Tickets",
      description: "GPS-enabled time tracking, safety checks, and equipment logs for remote sites."
    },
    {
      icon: Fuel,
      title: "Automated Invoicing",
      description: "Automatically create detailed invoices from your approved field tickets."
    },
    {
      icon: Camera,
      title: "Site Documentation",
      description: "Capture well site photos, equipment inspections, and safety documents."
    },
    {
      icon: Receipt,
      title: "Equipment & Expenses",
      description: "Track equipment usage, fuel costs, and field expenses with receipt capture."
    }
  ];

  const benefits = [
    "Get paid faster with automated invoicing.",
    "Eliminate missed billable hours and manual data entry.",
    "Professional-grade documentation for compliance.",
    "Real-time payment status from all operators.",
    "Streamlined equipment and expense tracking.",
    "Mobile-first design for in-the-field use."
  ];

  const workflowSteps = [
    { step: "1", title: "Clock In", description: "Start your shift with GPS verification at the well site." },
    { step: "2", title: "Log Work", description: "Track hours, equipment, and materials on your digital field ticket." },
    { step: "3", title: "Submit Ticket", description: "Submit your completed field ticket for instant approval." },
    { step: "4", title: "Get Paid", description: "Receive payments faster with automated invoice generation." }
  ];

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 text-gray-800"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50 to-emerald-50" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                <HardHat className="w-10 h-10 text-green-600" />
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Field Operations
              <span className="text-green-600 block">Simplified & Automated</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Focus on the work, not the paperwork. Streamline your field tickets, get paid faster, and manage your operations from anywhere.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contractor/dashboard')}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 group"
              >
                <Play className="w-5 h-5" />
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/contractor-demo')}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5 text-green-500" />
                <span>Try it out!</span>
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
            A Simple 4-Step Workflow
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
            From site arrival to payment, our process is automated and optimized for field operations.
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
            <motion.div key={index} variants={fadeInUp} className="text-center p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600 border border-gray-200">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 border-y border-gray-200">
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
              Professional tools designed for mobile-first oil & gas field operations.
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
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 border border-green-200">
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
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Get Paid Faster. <br/>
              Work Smarter.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              InvoicePatch helps you eliminate paperwork, reduce errors, and take control of your cash flow.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li key={index} variants={fadeInUp} className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp} className="relative h-96">
             <div className="absolute inset-0 bg-white rounded-2xl border border-gray-200 p-4 shadow-lg">
                <div className="w-full h-full bg-dots-pattern opacity-10 rounded-lg" style={{backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '1rem 1rem'}}></div>
             </div>
             <div className="absolute inset-4 bg-gray-50/80 backdrop-blur-sm rounded-lg shadow-inner p-6 flex flex-col justify-between border border-gray-200">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Current Ticket</span>
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Approved</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">Rig 3B - Daily Maintenance</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-4xl font-bold text-green-600">$3,450.00</p>
                </div>
                <div>
                  <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    View Details
                  </button>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-20 px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Ready to Simplify Your Field Operations?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Create your account in minutes and start streamlining your field tickets today.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <button
                onClick={() => router.push('/contractor-signup')}
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 group mx-auto"
              >
                <span>Create Your Free Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}

// Minimalistic dot pattern for the benefits section
const BgDotsPattern = () => (
  <style jsx global>{`
    .bg-dots-pattern {
      background-image: radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0);
      background-size: 1rem 1rem;
    }
  `}</style>
); 