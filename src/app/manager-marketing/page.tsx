'use client';

import { motion } from 'framer-motion';
import { 
  Building2, 
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
  X
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
      problem: "Manual Invoice Processing",
      solution: "Automated AI-Powered Processing",
      description: "Eliminate 75% of manual data entry and reduce processing time from hours to minutes"
    },
    {
      icon: DollarSign,
      problem: "Cost Overruns & Budget Issues",
      solution: "Real-Time Cost Tracking",
      description: "Get instant alerts on budget variances and project cost deviations before they become problems"
    },
    {
      icon: Users,
      problem: "Contractor Compliance Headaches",
      solution: "Automated Compliance Monitoring",
      description: "Ensure 100% compliance with automated verification and instant alerts for missing documentation"
    },
    {
      icon: BarChart3,
      problem: "Lack of Project Visibility",
      solution: "Comprehensive Analytics Dashboard",
      description: "Get real-time insights into project performance, costs, and contractor productivity"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      title: "Construction Manager",
      company: "Metro Construction Ltd.",
      quote: "InvoicePatch reduced our invoice processing time by 80%. What used to take our team 2 days now takes 4 hours. The ROI was immediate.",
      rating: 5,
      metrics: "80% time savings"
    },
    {
      name: "Michael Rodriguez",
      title: "Project Director",
      company: "Summit Building Group",
      quote: "The real-time cost tracking saved us $150K on our last project. We caught budget overruns before they became major issues.",
      rating: 5,
      metrics: "$150K saved"
    },
    {
      name: "Jennifer Walsh",
      title: "Operations Manager",
      company: "Urban Development Corp",
      quote: "Contractor compliance went from our biggest headache to completely automated. No more chasing paperwork or missing deadlines.",
      rating: 5,
      metrics: "100% compliance"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$299",
      period: "per month",
      description: "Perfect for small to medium construction teams",
      features: [
        "Up to 50 invoices/month",
        "Basic analytics dashboard",
        "Email support",
        "Standard integrations",
        "Mobile app access"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$599",
      period: "per month",
      description: "Ideal for growing construction companies",
      features: [
        "Up to 200 invoices/month",
        "Advanced analytics & reporting",
        "Priority support",
        "Custom integrations",
        "API access",
        "Multi-project management",
        "Automated compliance monitoring"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large construction enterprises",
      features: [
        "Unlimited invoices",
        "Custom analytics dashboards",
        "Dedicated account manager",
        "White-label options",
        "Advanced security features",
        "Custom workflows",
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
      className="min-h-screen bg-white"
    >
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">Invoice</span>Patch
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <button
                onClick={() => router.push('/manager/login')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/manager-demo-specific')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                  onClick={() => router.push('/manager/login')}
                  className="text-left text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/manager-demo-specific')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Try Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                Trusted by 500+ Construction Managers
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Stop Drowning in
              <span className="text-blue-600 block">Invoice Paperwork</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Transform your construction project management with AI-powered invoice processing 
              that saves 75% of your time and eliminates costly errors.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => router.push('/trial-setup')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 group text-lg"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/manager-demo-specific')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                <Sparkles className="w-6 h-6" />
                <span>View Demo</span>
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">75%</div>
                <div className="text-gray-600">Time Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">$50K+</div>
                <div className="text-gray-600">Avg. Annual Savings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600">Monitoring</div>
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
              Turn Your Biggest Headaches Into
              <span className="text-blue-600 block">Competitive Advantages</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how InvoicePatch transforms common management challenges into streamlined, automated processes
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
                      <h3 className="text-lg font-semibold text-blue-600 mb-1">Solution:</h3>
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

      {/* Social Proof / Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how construction managers like you are transforming their operations with InvoicePatch
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
                className="bg-gray-50 rounded-2xl p-8 relative"
              >
                <Quote className="w-8 h-8 text-blue-600 mb-4" />
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.title}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-semibold text-sm">Key Result:</div>
                  <div className="text-blue-700">{testimonial.metrics}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
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
                  plan.popular ? 'border-blue-600 relative' : 'border-gray-200'
                } hover:shadow-xl transition-shadow`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
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
                  <p className="text-gray-600">{plan.description}</p>
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
                  onClick={() => {
                    if (plan.cta === "Contact Sales") {
                      router.push('/contact-sales');
                    } else {
                      router.push('/trial-setup');
                    }
                  }}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
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
              Need a custom solution for your enterprise? 
              <button 
                onClick={() => router.push('/contact-sales')}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                Contact our sales team
              </button>
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Operations?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of construction managers who have eliminated invoice headaches and saved thousands of hours.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/trial-setup')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 group text-lg"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/manager-demo-specific')}
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
                <Building2 className="w-8 h-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">
                  <span className="text-blue-400">Invoice</span>Patch
                </span>
              </div>
              <p className="text-gray-400">
                Streamlined invoice processing for construction teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><button onClick={() => router.push('/manager-demo-specific')} className="hover:text-white transition-colors">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InvoicePatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
} 