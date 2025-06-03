'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CalculatorIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TruckIcon,
  MapIcon,
  GiftIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  calculateTrialPreview,
  calculateDailyAlbertaTax,
  validateTaxCalculation,
  formatCAD,
  getAlbertaTaxInfo,
  ALBERTA_GST_RATE,
  STANDARD_TRAVEL_RATE_PER_KM,
  DailyWorkData
} from '@/lib/albertaTax';
import TaxCalculationDisplay from '@/components/TaxCalculationDisplay';

export default function AlbertaTaxDemoPage() {
  const [demoType, setDemoType] = useState<'simple' | 'detailed'>('simple');
  const [simpleInputs, setSimpleInputs] = useState({
    dayRate: 750,
    truckRate: 200,
    travelKms: 50,
    subsistence: 75
  });

  const [detailedInputs, setDetailedInputs] = useState<DailyWorkData>({
    dayRate: 800,
    dayRateUsed: true,
    truckRate: 250,
    truckUsed: true,
    travelKMs: 65,
    travelRatePerKm: STANDARD_TRAVEL_RATE_PER_KM,
    subsistence: 85,
    additionalCharges: 150
  });

  const taxInfo = getAlbertaTaxInfo();
  
  // Calculate results based on demo type
  const simpleCalculation = calculateTrialPreview(simpleInputs);
  const detailedCalculation = calculateDailyAlbertaTax(detailedInputs);
  const currentCalculation = demoType === 'simple' ? simpleCalculation : detailedCalculation;
  const validation = validateTaxCalculation(currentCalculation);

  // Example scenarios
  const exampleScenarios = [
    {
      name: "Drilling Supervisor",
      data: { dayRate: 850, truckRate: 0, travelKms: 45, subsistence: 100 },
      description: "Senior drilling supervisor with company truck, 45km commute"
    },
    {
      name: "Service Tech + Equipment",
      data: { dayRate: 650, truckRate: 300, travelKms: 80, subsistence: 75 },
      description: "Service technician with specialized equipment, longer commute"
    },
    {
      name: "Consultant",
      data: { dayRate: 1200, truckRate: 0, travelKms: 25, subsistence: 0 },
      description: "High-rate consultant, short commute, no meals"
    },
    {
      name: "Equipment Operator",
      data: { dayRate: 500, truckRate: 450, travelKms: 120, subsistence: 90 },
      description: "Heavy equipment operator, long distance job"
    }
  ];

  const updateSimpleInput = (field: keyof typeof simpleInputs, value: number) => {
    setSimpleInputs(prev => ({ ...prev, [field]: value }));
  };

  const updateDetailedInput = (field: keyof DailyWorkData, value: number | boolean) => {
    setDetailedInputs(prev => ({ ...prev, [field]: value }));
  };

  const loadScenario = (scenario: typeof exampleScenarios[0]) => {
    setSimpleInputs(scenario.data);
    setDemoType('simple');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 mobile-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to InvoicePatch
          </Link>
          
          <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
            <CalculatorIcon className="h-4 w-4 mr-2" />
            Alberta Tax Calculator Demo
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
            Alberta Tax Calculation System
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto break-words">
            See how InvoicePatch correctly calculates 5% GST on taxable services while 
            keeping expense reimbursements tax-free, compliant with Alberta tax laws.
          </p>
        </motion.div>

        {/* Tax Information Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Alberta Tax Structure</h3>
              <p className="text-blue-800 mb-4">{taxInfo.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Taxable Services (5% GST):</h4>
                  <ul className="space-y-1 text-sm">
                    {taxInfo.applicableItems.map((item, index) => (
                      <li key={index} className="text-blue-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Tax-Free Reimbursements:</h4>
                  <ul className="space-y-1 text-sm">
                    {taxInfo.exemptItems.map((item, index) => (
                      <li key={index} className="text-blue-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Demo Type Toggle */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Demo Type</h3>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setDemoType('simple')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    demoType === 'simple'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Simple Calculator
                </button>
                <button
                  onClick={() => setDemoType('detailed')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    demoType === 'detailed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Detailed Calculator
                </button>
              </div>

              {demoType === 'simple' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                      Day Rate ($)
                    </label>
                    <input
                      type="number"
                      value={simpleInputs.dayRate}
                      onChange={(e) => updateSimpleInput('dayRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <TruckIcon className="h-4 w-4 inline mr-1" />
                      Truck Rate ($)
                    </label>
                    <input
                      type="number"
                      value={simpleInputs.truckRate}
                      onChange={(e) => updateSimpleInput('truckRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapIcon className="h-4 w-4 inline mr-1" />
                      Travel KMs
                    </label>
                    <input
                      type="number"
                      value={simpleInputs.travelKms}
                      onChange={(e) => updateSimpleInput('travelKms', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <GiftIcon className="h-4 w-4 inline mr-1" />
                      Subsistence ($)
                    </label>
                    <input
                      type="number"
                      value={simpleInputs.subsistence}
                      onChange={(e) => updateSimpleInput('subsistence', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={detailedInputs.dayRateUsed}
                          onChange={(e) => updateDetailedInput('dayRateUsed', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Day Rate ({formatCAD(detailedInputs.dayRate)})
                        </span>
                      </label>
                      <input
                        type="number"
                        value={detailedInputs.dayRate}
                        onChange={(e) => updateDetailedInput('dayRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!detailedInputs.dayRateUsed}
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={detailedInputs.truckUsed}
                          onChange={(e) => updateDetailedInput('truckUsed', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Truck Rate ({formatCAD(detailedInputs.truckRate)})
                        </span>
                      </label>
                      <input
                        type="number"
                        value={detailedInputs.truckRate}
                        onChange={(e) => updateDetailedInput('truckRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!detailedInputs.truckUsed}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Travel KMs</label>
                      <input
                        type="number"
                        value={detailedInputs.travelKMs}
                        onChange={(e) => updateDetailedInput('travelKMs', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subsistence ($)</label>
                      <input
                        type="number"
                        value={detailedInputs.subsistence}
                        onChange={(e) => updateDetailedInput('subsistence', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Charges ($)</label>
                      <input
                        type="number"
                        value={detailedInputs.additionalCharges || 0}
                        onChange={(e) => updateDetailedInput('additionalCharges', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Example Scenarios */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Example Scenarios
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exampleScenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => loadScenario(scenario)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">{scenario.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{scenario.description}</div>
                    <div className="text-xs text-blue-600">
                      Day: {formatCAD(scenario.data.dayRate)} | 
                      Truck: {formatCAD(scenario.data.truckRate)} | 
                      Travel: {scenario.data.travelKms}km
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tax Calculation Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <TaxCalculationDisplay
                calculation={currentCalculation}
                title="Live Tax Calculation"
                subtitle={`${demoType === 'simple' ? 'Simple' : 'Detailed'} Alberta GST calculation`}
                showValidation={true}
                showTaxInfo={false}
              />
              
              {/* Calculation Summary */}
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-900 mb-3 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Quick Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">GST Rate:</span>
                    <span className="font-medium text-emerald-900">{(ALBERTA_GST_RATE * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Travel Rate:</span>
                    <span className="font-medium text-emerald-900">{formatCAD(STANDARD_TRAVEL_RATE_PER_KM)}/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Tax Saved:</span>
                    <span className="font-medium text-emerald-900">
                      {formatCAD(currentCalculation.nonTaxableTotal * ALBERTA_GST_RATE)}
                    </span>
                  </div>
                </div>
                
                {!validation.isValid && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
                    <ExclamationTriangleIcon className="h-3 w-3 inline mr-1" />
                    {validation.errors[0]}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Integrated into InvoicePatch Trial System
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This Alberta tax calculation system is fully integrated into the InvoicePatch trial workflow. 
            Every invoice generated automatically applies correct GST calculations and maintains 
            CRA compliance for tax-free reimbursements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/invoice-setup"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              Start Your Trial
              <CalculatorIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contractor-dashboard"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-700 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
            >
              View Contractor Interface
              <DocumentTextIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 