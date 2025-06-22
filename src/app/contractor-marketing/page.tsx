'use client';

import { motion } from 'framer-motion';
import { 
  HardHat, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Camera, 
  FileText, 
  MapPin, 
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
  Timer,
  Receipt,
  Smartphone,
  Wifi,
  Battery
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ContractorMarketing() {
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
      problem: "Lost Hours & Missed Payments",
      solution: "GPS-Verified Time Tracking",
      description: "Never lose billable hours again with automatic GPS verification and real-time tracking that ensures every minute is captured and paid"
    },
    {
      icon: FileText,
      problem: "Complex Invoice Creation",
      solution: "One-Tap Invoice Generation",
      description: "Generate professional invoices instantly with all your hours, expenses, and photos automatically included"
    },
    {
      icon: Receipt,
      problem: "Expense Receipt Chaos",
      solution: "Smart Receipt Management",
      description: "Snap photos of receipts and let AI automatically categorize and organize them for seamless expense tracking"
    },
    {
      icon: DollarSign,
      problem: "Slow Payment Processing",
      solution: "Faster Payment Pipeline",
      description: "Get paid 3 days faster with streamlined approval workflows and automated payment notifications"
    }
  ];

  const testimonials = [
    {
      name: "Jake Morrison",
      title: "Independent Contractor",
      company: "Morrison Electrical",
      quote: "I was losing 2-3 hours every week on paperwork. Now everything is automated and I get paid faster. Made an extra $8K last quarter just from better time tracking.",
      rating: 5,
      metrics: "Extra $8K earned",
      location: "Calgary, AB"
    },
    {
      name: "Maria Santos",
      title: "Framing Contractor",
      company: "Santos Construction",
      quote: "The GPS tracking saved my reputation when a client questioned my hours. Having proof of exactly when and where I worked was a game-changer.",
      rating: 5,
      metrics: "100% payment accuracy",
      location: "Edmonton, AB"
    },
    {
      name: "David Chen",
      title: "Heavy Equipment Operator",
      company: "Chen Excavation",
      quote: "Invoice creation used to take me hours every week. Now it's literally one button and everything is professional and accurate. My clients love it.",
      rating: 5,
      metrics: "5 hours saved weekly",
      location: "Vancouver, BC"
    }
  ];

  const plans = [
    {
      name: "Solo Contractor",
      price: "$29",
      period: "per month",
      description: "Perfect for independent contractors",
      features: [
        "Unlimited time tracking",
        "GPS verification",
        "Photo documentation",
        "Basic invoice generation",
        "Expense tracking",
        "Mobile app access",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false,
      savings: "vs $200/mo in lost time"
    },
    {
      name: "Pro Contractor",
      price: "$49",
      period: "per month",
      description: "For contractors managing multiple projects",
      features: [
        "Everything in Solo",
        "Multi-project management",
        "Advanced reporting",
        "Custom invoice templates",
        "Equipment logging",
        "Priority support",
        "Integration with accounting software"
      ],
      cta: "Start Free Trial",
      popular: true,
      savings: "vs $400/mo in admin costs"
    },
    {
      name: "Team Contractor",
      price: "$89",
      period: "per month",
      description: "For contractors with crews",
      features: [
        "Everything in Pro",
        "Team member management",
        "Crew time tracking",
        "Bulk invoice processing",
        "Advanced analytics",
        "Custom workflows",
        "Dedicated support"
      ],
      cta: "Start Free Trial",
      popular: false,
      savings: "vs $800/mo in overhead"
    }
  ];

  const features = [
    {
      icon: Timer,
      title: "Smart Time Tracking",
      description: "GPS-enabled tracking that automatically logs your location, hours, and breaks",
      benefits: ["Never lose billable hours", "Automatic overtime calculation", "GPS proof of work location"]
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      description: "Capture and organize work progress photos with automatic date/location stamps",
      benefits: ["Professional work documentation", "Automatic photo organization", "Client progress updates"]
    },
    {
      icon: FileText,
      title: "Instant Invoicing",
      description: "Generate professional invoices with one tap, including all hours and expenses",
      benefits: ["Professional invoice templates", "Automatic calculations", "Instant client delivery"]
    },
    {
      icon: Receipt,
      title: "Expense Management",
      description: "Snap photos of receipts and track all project expenses automatically",
      benefits: ["AI receipt categorization", "Mileage tracking", "Tax-ready reports"]
    }
  ];

  const mobileFeatures = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Built specifically for contractors working in the field"
    },
    {
      icon: Wifi,
      title: "Offline Capability",
      description: "Works without internet, syncs when connected"
    },
    {
      icon: Battery,
      title: "Battery Optimized",
      description: "Designed to preserve your phone's battery all day"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white"
    >
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <HardHat className="w-8 h-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-green-600">Invoice</span>Patch
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <button
                onClick={() => router.push('/contractor')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/contractor-demo')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                <button
                  onClick={() => router.push('/contractor')}
                  className="text-left text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/contractor-demo')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  Try Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                Used by 10,000+ Canadian Contractors
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Stop Losing Money on
              <span className="text-green-600 block">Paperwork & Lost Hours</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              The mobile app built for Canadian contractors. Track time with GPS, 
              create professional invoices instantly, and get paid 3 days faster.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => router.push('/contractor-trial')}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 group text-lg"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/contractor-demo')}
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                <Sparkles className="w-6 h-6" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">3 Days</div>
                <div className="text-gray-600">Faster Payment</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">$5K+</div>
                <div className="text-gray-600">Avg. Extra Income</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">50%</div>
                <div className="text-gray-600">Less Admin Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-gray-600">Accurate Tracking</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points & Solutions */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Turn Your Biggest Challenges Into
              <span className="text-green-600 block">Money-Making Opportunities</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how InvoicePatch solves the problems that cost contractors thousands every year
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-8"
          >
            {painPoints.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-red-600 mb-1">Problem:</h3>
                      <p className="text-gray-700">{item.problem}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-green-600 mb-1">Solution:</h3>
                      <p className="text-gray-700 font-medium">{item.solution}</p>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in Your Pocket
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools designed specifically for Canadian contractors working in the field
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile-First Features */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white"
          >
            <div className="text-center mb-12">
              <motion.h3 variants={fadeInUp} className="text-3xl font-bold mb-4">
                Built for the Field, Not the Office
              </motion.h3>
              <motion.p variants={fadeInUp} className="text-xl opacity-90">
                Designed by contractors, for contractors working in real Canadian conditions
              </motion.p>
            </div>

            <motion.div
              variants={staggerChildren}
              className="grid md:grid-cols-3 gap-8"
            >
              {mobileFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="opacity-90">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Canadian Contractors
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how contractors across Canada are earning more and working smarter with InvoicePatch
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg relative"
              >
                <Quote className="w-8 h-8 text-green-600 mb-4" />
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.title}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-green-600 font-semibold text-sm">Key Result:</div>
                    <div className="text-green-700 font-medium">{testimonial.metrics}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-blue-600 font-semibold text-sm">Location:</div>
                    <div className="text-blue-700 font-medium">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Plan
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with a 14-day free trial. No credit card required. Cancel anytime.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${
                  plan.popular ? 'border-green-600 relative' : 'border-gray-200'
                } hover:shadow-xl transition-shadow`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-600 font-normal">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{plan.description}</p>
                  <div className="text-sm text-green-600 font-medium">{plan.savings}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => router.push('/contractor-trial')}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              Questions about which plan is right for you? 
              <button 
                onClick={() => router.push('/contact-sales')}
                className="text-green-600 hover:text-green-700 font-medium ml-1"
              >
                Talk to our contractor success team
              </button>
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Canadian Privacy Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Mobile Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Earn More & Work Smarter?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of Canadian contractors who have eliminated paperwork headaches and increased their income.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contractor-trial')}
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 group text-lg"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/contractor-demo')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-lg"
              >
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <HardHat className="w-8 h-8 text-green-400 mr-2" />
                <span className="text-xl font-bold">
                  <span className="text-green-400">Invoice</span>Patch
                </span>
              </div>
              <p className="text-gray-400">
                The mobile app built for Canadian contractors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><button onClick={() => router.push('/contractor-demo')} className="hover:text-white transition-colors">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Canadian Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InvoicePatch. All rights reserved. Made in Canada for Canadian contractors.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
