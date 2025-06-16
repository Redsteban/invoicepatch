'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Clock,
  Star,
  Target,
  Zap,
  Award
} from 'lucide-react';

import { 
  sampleContractors,
  sampleInvoices,
  historicalData,
  testimonials,
  industryCategories,
  edgeCases,
  performanceMetrics,
  type Invoice,
  type Contractor
} from '../data/sampleData';

import { 
  demoUtils,
  generateDemoScenario,
  getSalesMetrics,
  getROICalculation,
  simulateInvoiceProcessing,
  defaultDemoConfig,
  type DemoConfig,
  type DemoScenario
} from '../utils/demoDataHelpers';

interface DemoShowcaseProps {
  mode?: 'presentation' | 'interactive' | 'sales';
  autoplay?: boolean;
}

const DemoShowcase: React.FC<DemoShowcaseProps> = ({ 
  mode = 'interactive', 
  autoplay = false 
}) => {
  const [currentScenario, setCurrentScenario] = useState<DemoScenario>(generateDemoScenario('mixed'));
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoConfig, setDemoConfig] = useState<DemoConfig>(defaultDemoConfig);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [processingSimulation, setProcessingSimulation] = useState<any>(null);
  const [salesMetrics] = useState(getSalesMetrics());

  // Auto-advance steps in presentation mode
  useEffect(() => {
    if (isPlaying && mode === 'presentation') {
      const timer = setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % scenarios.length);
      }, 8000); // 8 seconds per step
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, mode]);

  const scenarios = [
    generateDemoScenario('perfect'),
    generateDemoScenario('problematic'),
    generateDemoScenario('mixed'),
    generateDemoScenario('large-volume')
  ];

  const handleInvoiceDemo = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    const simulation = await simulateInvoiceProcessing(invoice, demoConfig);
    setProcessingSimulation(simulation);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setSelectedInvoice(null);
    setProcessingSimulation(null);
    setIsPlaying(false);
  };

  const StatCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    value: string; 
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }> = ({ icon, title, value, change, changeType = 'neutral' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {change}
          </div>
        )}
      </div>
    </motion.div>
  );

  if (mode === 'sales') {
    const roiCalc = getROICalculation(250, 8500); // Example: 250 invoices/month, $8,500 average

    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Sales Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-gray-900">
            InvoicePatch: Transforming Invoice Processing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading companies are reducing processing time by 73% and saving thousands monthly
          </p>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Clock size={24} />}
            title="Processing Time Reduction"
            value="73.2%"
            change="+5.2% this month"
            changeType="positive"
          />
          <StatCard
            icon={<Target size={24} />}
            title="Accuracy Improvement"
            value="94.7%"
            change="+2.1% this month"
            changeType="positive"
          />
          <StatCard
            icon={<DollarSign size={24} />}
            title="Monthly Cost Savings"
            value={`$${Math.round(salesMetrics.totalCostSavings / 13).toLocaleString()}`}
            change="+23.7% YoY"
            changeType="positive"
          />
          <StatCard
            icon={<Users size={24} />}
            title="Contractor Satisfaction"
            value={`${salesMetrics.averageContractorRating}★`}
            change="98% retention"
            changeType="positive"
          />
        </div>

        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ROI Calculator Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">First Year Savings</h3>
              <p className="text-3xl font-bold text-green-600">${roiCalc.annualSavings.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Annual processing cost reduction</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ROI</h3>
              <p className="text-3xl font-bold text-blue-600">{roiCalc.firstYearROI}%</p>
              <p className="text-sm text-gray-600 mt-1">First year return on investment</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payback Period</h3>
              <p className="text-3xl font-bold text-purple-600">{roiCalc.paybackPeriod} months</p>
              <p className="text-sm text-gray-600 mt-1">Time to recover investment</p>
            </div>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Customer Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoUtils.getFeaturedTestimonials().map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg p-6 shadow-sm border"
              >
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.contractorName}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {testimonial.industry}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Demo Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">InvoicePatch Demo Showcase</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => setCurrentStep((prev) => (prev + 1) % scenarios.length)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <SkipForward size={16} />
              <span>Next</span>
            </button>
            <button
              onClick={resetDemo}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {scenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                setCurrentScenario(scenario);
              }}
              className={`p-4 rounded-lg border text-left transition-colors ${
                currentStep === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{scenario.title}</h3>
              <p className="text-sm text-gray-600">{scenario.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Current Scenario Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Scenario Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{currentScenario.title}</h2>
            <p className="text-gray-600 mb-4">{currentScenario.description}</p>
            <div className="flex flex-wrap gap-2">
              {currentScenario.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Invoices */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Invoices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentScenario.invoices.map((invoice) => (
                <motion.div
                  key={invoice.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleInvoiceDemo(invoice)}
                  className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      invoice.status === 'approved' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      invoice.status === 'disputed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{invoice.contractorName}</p>
                  <p className="text-lg font-semibold text-gray-900">${invoice.amount.toLocaleString()}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {invoice.flags.slice(0, 2).map((flag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Processing Simulation */}
          {processingSimulation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Simulation</h3>
              <div className="space-y-3">
                {processingSimulation.processingSteps.map((step: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">{step.message}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Final Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    processingSimulation.finalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    processingSimulation.finalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {processingSimulation.finalStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-blue-700">Match Confidence:</span>
                  <span className="text-sm font-semibold text-blue-900">
                    {processingSimulation.matchConfidence}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Risk Score:</span>
                  <span className="text-sm font-semibold text-blue-900">
                    {processingSimulation.riskScore}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          icon={<FileText size={24} />}
          title="Total Invoices"
          value={sampleInvoices.length.toString()}
        />
        <StatCard
          icon={<Users size={24} />}
          title="Active Contractors"
          value={sampleContractors.length.toString()}
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          title="Industries Served"
          value={industryCategories.length.toString()}
        />
        <StatCard
          icon={<Award size={24} />}
          title="Edge Cases Handled"
          value={edgeCases.length.toString()}
        />
      </motion.div>
    </div>
  );
};

export default DemoShowcase;