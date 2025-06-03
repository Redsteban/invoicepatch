'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

import ClientProjectSelection from './invoice/ClientProjectSelection';
import TimeLaborSection from './invoice/TimeLaborSection';
import EquipmentTruckSection from './invoice/EquipmentTruckSection';
import TravelMileageSection from './invoice/TravelMileageSection';
import ExpensesSection from './invoice/ExpensesSection';
import TaxCalculation from './invoice/TaxCalculation';
import InvoicePreview from './invoice/InvoicePreview';

interface InvoiceBuilderProps {
  onBack: () => void;
}

type InvoiceStep = 
  | 'client-project'
  | 'time-labor'
  | 'equipment-truck'
  | 'travel-mileage'
  | 'expenses'
  | 'tax-calculation'
  | 'preview';

const steps = [
  { id: 'client-project', name: 'Client & Project', icon: DocumentTextIcon },
  { id: 'time-labor', name: 'Time & Labor', icon: ClockIcon },
  { id: 'equipment-truck', name: 'Equipment & Truck', icon: TruckIcon },
  { id: 'travel-mileage', name: 'Travel & Mileage', icon: MapPinIcon },
  { id: 'expenses', name: 'Expenses', icon: CameraIcon },
  { id: 'tax-calculation', name: 'Tax Calculation', icon: CurrencyDollarIcon },
  { id: 'preview', name: 'Preview & Submit', icon: CheckCircleIcon },
];

export default function InvoiceBuilder({ onBack }: InvoiceBuilderProps) {
  const [currentStep, setCurrentStep] = useState<InvoiceStep>('client-project');
  const [invoiceData, setInvoiceData] = useState({
    client: null,
    project: null,
    timeEntries: [],
    equipmentEntries: [],
    travelEntries: [],
    expenses: [],
    taxInfo: {
      province: 'BC',
      gst: 0.05,
      pst: 0.07,
      hst: 0,
    },
    totals: {
      subtotal: 0,
      tax: 0,
      total: 0,
    },
  });

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1].id as InvoiceStep);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1].id as InvoiceStep);
    }
  };

  const goToStep = (stepId: InvoiceStep) => {
    setCurrentStep(stepId);
  };

  const updateInvoiceData = (section: string, data: any) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'client-project':
        return (
          <ClientProjectSelection
            data={invoiceData}
            onUpdate={(data) => updateInvoiceData('client', data.client)}
            onNext={nextStep}
          />
        );
      case 'time-labor':
        return (
          <TimeLaborSection
            data={invoiceData.timeEntries}
            onUpdate={(data) => updateInvoiceData('timeEntries', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'equipment-truck':
        return (
          <EquipmentTruckSection
            data={invoiceData.equipmentEntries}
            onUpdate={(data) => updateInvoiceData('equipmentEntries', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'travel-mileage':
        return (
          <TravelMileageSection
            data={invoiceData.travelEntries}
            onUpdate={(data) => updateInvoiceData('travelEntries', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'expenses':
        return (
          <ExpensesSection
            data={invoiceData.expenses}
            onUpdate={(data) => updateInvoiceData('expenses', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'tax-calculation':
        return (
          <TaxCalculation
            data={invoiceData}
            onUpdate={(data) => updateInvoiceData('taxInfo', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'preview':
        return (
          <InvoicePreview
            data={invoiceData}
            onPrev={prevStep}
            onSubmit={() => {
              // Handle invoice submission
              console.log('Submitting invoice:', invoiceData);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-3 sm:mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Create Invoice</h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].name}
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <button className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps - Mobile Optimized */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Mobile Progress Bar */}
          <div className="sm:hidden py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-900">
                {steps[currentStepIndex].name}
              </span>
              <span className="text-xs text-gray-500">
                {currentStepIndex + 1} / {steps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Progress Steps */}
          <div className="hidden sm:block">
            <nav className="flex space-x-2 lg:space-x-4 py-3 sm:py-4 overflow-x-auto">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const isClickable = index <= currentStepIndex;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => isClickable && goToStep(step.id as InvoiceStep)}
                    disabled={!isClickable}
                    className={`
                      flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                      ${isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'text-gray-400 cursor-not-allowed'
                      }
                      ${isClickable && !isActive ? 'hover:bg-gray-50' : ''}
                    `}
                  >
                    <step.icon className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${
                      isCompleted ? 'text-green-600' : isActive ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    <span className="hidden md:inline">{step.name}</span>
                    <span className="md:hidden">{step.name.split(' ')[0]}</span>
                    {isCompleted && (
                      <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 ml-1 text-green-600" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderCurrentStep()}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-3 py-2">
              Save Draft
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={isLastStep}
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${isLastStep
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }
            `}
          >
            {isLastStep ? 'Submit' : 'Next'}
            {!isLastStep && <ChevronRightIcon className="h-4 w-4 ml-1" />}
          </button>
        </div>
      </div>

      {/* Add bottom padding for mobile navigation */}
      <div className="sm:hidden h-20" />
    </div>
  );
} 