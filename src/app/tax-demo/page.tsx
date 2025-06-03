'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalculatorIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

import InvoiceCalculator from '@/components/manager/InvoiceCalculator';
import { 
  AlbertaInvoiceCalculation,
  AlbertaTaxUtils,
  formatCAD,
  ALBERTA_GST_RATE,
  STANDARD_TRAVEL_RATE_PER_KM,
  calculateAnnualGSTEstimate
} from '@/lib/albertaTax';

const TaxDemoPage = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'examples' | 'education'>('calculator');
  const [currentCalculation, setCurrentCalculation] = useState<AlbertaInvoiceCalculation | null>(null);

  // Example scenarios
  const scenarios = [
    {
      title: "Standard Daily Rate",
      description: "Typical oil & gas contractor working with own vehicle",
      data: {
        dayRate: 750,
        dayRateUsed: true,
        truckRate: 0,
        truckUsed: false,
        travelKMs: 100,
        subsistence: 75
      }
    },
    {
      title: "Equipment Operator",
      description: "Contractor providing specialized equipment",
      data: {
        dayRate: 800,
        dayRateUsed: true,
        truckRate: 300,
        truckUsed: true,
        travelKMs: 75,
        subsistence: 100
      }
    },
    {
      title: "Local Work",
      description: "Working close to home with minimal travel",
      data: {
        dayRate: 700,
        dayRateUsed: true,
        truckRate: 150,
        truckUsed: true,
        travelKMs: 20,
        subsistence: 0
      }
    },
    {
      title: "Remote Assignment",
      description: "Extended travel with full subsistence",
      data: {
        dayRate: 850,
        dayRateUsed: true,
        truckRate: 250,
        truckUsed: true,
        travelKMs: 200,
        subsistence: 125
      }
    }
  ];

  const handleCalculationUpdate = (calculation: AlbertaInvoiceCalculation) => {
    setCurrentCalculation(calculation);
  };

  const runScenario = (scenario: any) => {
    const calculation = AlbertaTaxUtils.calculate(scenario.data);
    setCurrentCalculation(calculation);
  };

  const annualEstimate = currentCalculation 
    ? calculateAnnualGSTEstimate(currentCalculation)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalculatorIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Alberta Tax Calculation System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive GST calculation system for Alberta contractors. 
            Properly handles taxable services vs. non-taxable expense reimbursements.
          </p>
        </motion.div>

        {/* Tax Structure Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{(ALBERTA_GST_RATE * 100).toFixed(0)}%</div>
              <div className="text-blue-100">GST Rate</div>
              <div className="text-sm text-blue-200 mt-1">Federal goods & services tax</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">0%</div>
              <div className="text-blue-100">PST Rate</div>
              <div className="text-sm text-blue-200 mt-1">No provincial sales tax</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${STANDARD_TRAVEL_RATE_PER_KM}</div>
              <div className="text-blue-100">Travel Rate</div>
              <div className="text-sm text-blue-200 mt-1">Per kilometer (CRA rate)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Tax-Free</div>
              <div className="text-blue-100">Reimbursements</div>
              <div className="text-sm text-blue-200 mt-1">Travel & meal allowances</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'calculator', name: 'Interactive Calculator', icon: CalculatorIcon },
            { id: 'examples', name: 'Example Scenarios', icon: DocumentTextIcon },
            { id: 'education', name: 'Tax Education', icon: AcademicCapIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              {/* Calculator */}
              <div className="xl:col-span-2">
                <InvoiceCalculator onCalculationUpdate={handleCalculationUpdate} />
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                {/* Current Calculation Summary */}
                {currentCalculation && (
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxable Services:</span>
                        <span className="font-bold">{formatCAD(currentCalculation.taxableSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>GST ({(ALBERTA_GST_RATE * 100).toFixed(0)}%):</span>
                        <span className="font-bold">{formatCAD(currentCalculation.gst)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Tax-Free Reimbursements:</span>
                        <span className="font-bold">
                          {formatCAD(currentCalculation.travelReimbursement + currentCalculation.subsistence)}
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Invoice:</span>
                        <span className="text-blue-600">{formatCAD(currentCalculation.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Annual Projections */}
                {annualEstimate && (
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Annual Projections</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxable Income:</span>
                        <span className="font-mono">{formatCAD(annualEstimate.annualTaxableIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual GST:</span>
                        <span className="font-mono">{formatCAD(annualEstimate.annualGSTPayable)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quarterly Payment:</span>
                        <span className="font-mono">{formatCAD(annualEstimate.quarterlyGSTPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Reserve:</span>
                        <span className="font-mono font-bold text-blue-600">
                          {formatCAD(annualEstimate.monthlyGSTReserve)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-blue-700">
                        💡 Tip: Set aside {formatCAD(annualEstimate.monthlyGSTReserve)} monthly for GST payments
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Benefits */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">System Benefits</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        Automatically separates taxable services from non-taxable reimbursements
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        Uses current CRA travel rates and guidelines
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        Validates calculations for accuracy
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        Generates professional invoice breakdowns
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'examples' && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {scenarios.map((scenario, index) => {
                const calculation = AlbertaTaxUtils.calculate(scenario.data);
                
                return (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                        <p className="text-sm text-gray-600">{scenario.description}</p>
                      </div>
                      <button
                        onClick={() => runScenario(scenario)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Use This
                      </button>
                    </div>

                    {/* Scenario Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Day Rate:</span>
                        <span>{formatCAD(scenario.data.dayRate)}</span>
                      </div>
                      {scenario.data.truckUsed && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Equipment:</span>
                          <span>{formatCAD(scenario.data.truckRate)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travel:</span>
                        <span>{scenario.data.travelKMs} km</span>
                      </div>
                      {scenario.data.subsistence > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meals:</span>
                          <span>{formatCAD(scenario.data.subsistence)}</span>
                        </div>
                      )}
                    </div>

                    {/* Calculation Results */}
                    <div className="border-t pt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taxable Subtotal:</span>
                          <span>{formatCAD(calculation.taxableSubtotal)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>GST:</span>
                          <span>{formatCAD(calculation.gst)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Reimbursements:</span>
                          <span>{formatCAD(calculation.travelReimbursement + calculation.subsistence)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span className="text-blue-600">{formatCAD(calculation.grandTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Tax Structure Education */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Understanding Alberta Taxes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Taxable Services (Subject to GST)</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CurrencyDollarIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Labour Services:</strong> Your daily rate for work performed
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <BuildingOffice2Icon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Equipment Rentals:</strong> Truck, tools, specialized equipment
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Additional Services:</strong> Any extra billable services
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Non-Taxable Reimbursements</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Travel Reimbursement:</strong> ${STANDARD_TRAVEL_RATE_PER_KM}/km (CRA rate)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Meal Allowances:</strong> Subsistence for work-related meals
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Accommodation:</strong> Hotel/camp costs (when applicable)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GST Registration Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">GST Registration Requirements</h3>
                    <div className="text-yellow-800 text-sm space-y-2">
                      <p>
                        <strong>Mandatory Registration:</strong> Required if annual revenue exceeds $30,000
                      </p>
                      <p>
                        <strong>Voluntary Registration:</strong> Can register earlier to claim input tax credits
                      </p>
                      <p>
                        <strong>Quarterly Filing:</strong> Most small businesses file quarterly returns
                      </p>
                      <p>
                        <strong>Collection & Remittance:</strong> Collect GST from clients, remit to CRA
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Best Practices for Contractors</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Record Keeping</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Track all taxable vs non-taxable amounts</li>
                      <li>• Keep receipts for travel and meals</li>
                      <li>• Maintain detailed work logs</li>
                      <li>• Save all invoices and payments</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">GST Management</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Set aside {(ALBERTA_GST_RATE * 100).toFixed(0)}% of taxable income</li>
                      <li>• File returns on time to avoid penalties</li>
                      <li>• Claim input tax credits on business expenses</li>
                      <li>• Consider quarterly installments</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Compliance Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Important Compliance Note</h3>
                    <p className="text-red-800 text-sm">
                      This calculator is for demonstration purposes only. Always consult with a qualified 
                      accountant or tax professional for your specific situation. Tax laws and rates may 
                      change, and individual circumstances can affect tax obligations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxDemoPage; 