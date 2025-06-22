'use client';

import { motion } from 'framer-motion';
import { 
  Drill, 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Users, 
  FileText, 
  Clock, 
  DollarSign,
  Play,
  Sparkles,
  Shield,
  TrendingUp,
  Zap,
  Star,
  Quote,
  Menu,
  X,
  Fuel
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManagerMarketing() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const painPoints = [
    {
      icon: Clock,
      problem: "Manual Field Ticket Chaos",
      solution: "Automated AI-Powered Validation",
      description: "Eliminate 80% of manual data entry and slash processing time from days to minutes."
    },
    {
      icon: DollarSign,
      problem: "Operational Cost Blind Spots",
      solution: "Real-Time Cost & Equipment Tracking",
      description: "Get instant alerts on budget variances and equipment costs before they impact your AFE."
    },
    {
      icon: Users,
      problem: "Sub-Contractor Compliance Risks",
      solution: "Automated Compliance & Certification Hub",
      description: "Ensure 100% compliance with automated ticket validation and instant alerts for missing docs."
    },
    {
      icon: BarChart3,
      problem: "Lack of Operational Visibility",
      solution: "Unified Operations Dashboard",
      description: "Gain real-time insights into project performance, costs, and sub-contractor efficiency."
    }
  ];

  const testimonials = [
    {
      name: "David Chen",
      title: "Operations Manager",
      company: "Precision Flow Services",
      quote: "InvoicePatch cut our field ticket processing time by over 85%. What used to take days of manual reconciliation now happens in near real-time. The impact on our cash flow was immediate.",
      rating: 5,
      metrics: "85% time savings"
    },
    {
      name: "Aisha Khan",
      title: "Site Supervisor",
      company: "Rock solid drilling",
      quote: "The real-time cost tracking is a game-changer. We identified a potential $200K overage on a multi-well pad and course-corrected instantly, saving the project's profitability.",
      rating: 5,
      metrics: "$200K saved"
    },
    {
      name: "Brian Miller",
      title: "Completions Superintendent",
      company: "Apex Well Servicing",
      quote: "Sub-contractor compliance is no longer our biggest operational risk. InvoicePatch automates everything, ensuring every ticket is backed by valid certs. It's a lifesaver.",
      rating: 5,
      metrics: "100% compliance"
    }
  ];

  const plans = [
    {
      name: "Field Pro",
      price: "$499",
      period: "per month",
      description: "Perfect for small to medium-sized operators and service companies.",
      features: [
        "Up to 100 field tickets/month",
        "Standard analytics dashboard",
        "Email & chat support",
        "Core integrations (accounting)",
        "Mobile app for field use"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Operations Command",
      price: "$999",
      period: "per month",
      description: "Ideal for growing operators managing multiple sites.",
      features: [
        "Up to 500 field tickets/month",
        "Advanced ops analytics & reporting",
        "Priority support",
        "Custom integrations (ERP, EHS)",
        "API access",
        "Multi-well pad & project management",
        "Automated compliance tracking"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large-scale oil & gas producers and service providers.",
      features: [
        "Unlimited field tickets",
        "Custom analytics dashboards",
        "Dedicated success manager",
        "White-label options",
        "Advanced security & data residency",
        "Custom approval workflows",
        "SLA guarantees"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white text-gray-800"
    >
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Drill className="w-8 h-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-green-600">Invoice</span>Patch
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
              <button
                onClick={() => router.push('/manager/login')}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/manager-demo-specific')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Try Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
                <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors">Testimonials</a>
                <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
                <button
                  onClick={() => router.push('/manager/login')}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/manager-demo-specific')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  Try Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-white/50" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                Trusted by 100+ Oil & Gas Operations Managers
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Stop Drowning in
              <span className="text-green-600 block">Field Ticket Paperwork</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              The AI-powered platform for oil & gas that automates field ticket processing,
              slashes costs, and gives you total control over your operations.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/manager-demo-specific')}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <Play className="w-5 h-5" />
                <span>See It In Action</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/contact-sales')}
                className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5 text-green-500" />
                <span>Request a Demo</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* "The Problem" Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
              Your Operations Are Leaking Money.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
              Manual field ticket processing isn't just slow—it's a direct threat to your project's profitability and compliance. Every hour wasted is capital you can't deploy.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <point.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-500 line-through">{point.problem}</h3>
                    <h3 className="text-lg font-semibold text-green-600">{point.solution}</h3>
                  </div>
                </div>
                <p className="text-gray-600">{point.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Praised by O&G Leaders</h2>
            <p className="text-lg text-gray-600">See how we're transforming operations across the Permian, Bakken, and beyond.</p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-8 shadow-lg flex flex-col"
              >
                <Quote className="w-10 h-10 text-green-200 mb-4" />
                <p className="text-gray-600 mb-6 flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600 text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500">{testimonial.title}, {testimonial.company}</div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                      ))}
                    </div>
                    <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {testimonial.metrics}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing. Powerful ROI.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
              Choose the plan that fits your operational scale. No hidden fees. No surprises.
            </motion.p>
          </motion.div>
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-3 gap-8 items-stretch"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`flex flex-col rounded-2xl p-8 border ${plan.popular ? 'border-green-500 shadow-2xl relative' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <div className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-500 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
                <ul className="space-y-4 text-left mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push(plan.cta === "Contact Sales" ? '/contact-sales' : '/manager-trial')}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-20 px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Ready to Eliminate Field Ticket Headaches?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Start your free trial today and experience the future of oil & gas operations management. No credit card required.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <button
                onClick={() => router.push('/manager-demo-specific')}
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group mx-auto"
              >
                <span>Try the Interactive Demo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <Drill className="w-8 h-8 text-green-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">
              <span className="text-green-600">Invoice</span>Patch
            </span>
          </div>
          <p className="text-gray-500 mb-4">
            Automating the flow of field data for the modern oil & gas industry.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-green-600">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-green-600">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-green-600">Pricing</a>
            <a href="/contact-sales" className="text-gray-600 hover:text-green-600">Contact</a>
          </div>
          <p className="mt-8 text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} InvoicePatch. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  );
} 