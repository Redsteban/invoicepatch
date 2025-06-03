'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalculatorIcon,
  CurrencyDollarIcon,
  TruckIcon,
  MapIcon,
  CakeIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import { 
  calculateDailyAlbertaTax,
  calculateWeeklyAlbertaTax,
  AlbertaInvoiceCalculation,
  DailyWorkData,
  WeeklyWorkData,
  formatCAD,
  getTaxBreakdownText,
  validateTaxCalculation,
  ALBERTA_GST_RATE,
  STANDARD_TRAVEL_RATE_PER_KM
} from '@/lib/albertaTax';

interface InvoiceCalculatorProps {
  contractorName?: string;
  invoiceNumber?: string;
  initialData?: DailyWorkData | WeeklyWorkData;
  onCalculationUpdate?: (calculation: AlbertaInvoiceCalculation) => void;
}

const InvoiceCalculator = ({ 
  contractorName = "Mike Thompson",
  invoiceNumber = "INV-2024-156789",
  initialData,
  onCalculationUpdate 
}: InvoiceCalculatorProps) => {
  const [calculationType, setCalculationType] = useState<'daily' | 'weekly'>('daily');
  const [dailyData, setDailyData] = useState<DailyWorkData>({
    dayRate: 750,
    dayRateUsed: true,
    truckRate: 200,
    truckUsed: true,
    travelKMs: 50,
    subsistence: 75
  });

  const [weeklyData, setWeeklyData] = useState<WeeklyWorkData>({
    dailyEntries: [
      // Sample week of work
      { dayRate: 750, dayRateUsed: true, truckRate: 200, truckUsed: true, travelKMs: 50, subsistence: 75 },
      { dayRate: 750, dayRateUsed: true, truckRate: 200, truckUsed: true, travelKMs: 50, subsistence: 75 },
      { dayRate: 750, dayRateUsed: true, truckRate: 200, truckUsed: true, travelKMs: 50, subsistence: 75 },
      { dayRate: 750, dayRateUsed: true, truckRate: 200, truckUsed: true, travelKMs: 50, subsistence: 75 },
      { dayRate: 750, dayRateUsed: true, truckRate: 200, truckUsed: true, travelKMs: 50, subsistence: 75 }
    ],
    weekStartDate: '2024-06-10',
    weekEndDate: '2024-06-14'
  });

  const [showDetails, setShowDetails] = useState(true);
  const [showValidation, setShowValidation] = useState(false);

  // Calculate current totals
  const calculation = calculationType === 'daily' 
    ? calculateDailyAlbertaTax(dailyData)
    : calculateWeeklyAlbertaTax(weeklyData);

  const validation = validateTaxCalculation(calculation);

  // Update parent component when calculation changes
  useState(() => {
    if (onCalculationUpdate) {
      onCalculationUpdate(calculation);
    }
  });

  const updateDailyData = (field: keyof DailyWorkData, value: number | boolean) => {
    setDailyData(prev => ({ ...prev, [field]: value }));
  };

  const addWorkDay = () => {
    setWeeklyData(prev => ({
      ...prev,
      dailyEntries: [...prev.dailyEntries, {
        dayRate: 750,
        dayRateUsed: true,
        truckRate: 200,
        truckUsed: true,
        travelKMs: 50,
        subsistence: 75
      }]
    }));
  };

  const removeWorkDay = (index: number) => {
    setWeeklyData(prev => ({
      ...prev,
      dailyEntries: prev.dailyEntries.filter((_, i) => i !== index)
    }));
  };

  const updateWeeklyDay = (index: number, field: keyof DailyWorkData, value: number | boolean) => {
    setWeeklyData(prev => ({
      ...prev,
      dailyEntries: prev.dailyEntries.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CalculatorIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Alberta Invoice Calculator</h2>
              <p className="text-gray-600">GST calculation for {contractorName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Invoice #</div>
            <div className="font-mono text-lg">{invoiceNumber}</div>
          </div>
        </div>

        {/* Calculation Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCalculationType('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              calculationType === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Daily Calculation
          </button>
          <button
            onClick={() => setCalculationType('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              calculationType === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Weekly Calculation
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="ml-auto px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {/* Alberta Tax Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Alberta Tax Structure</h3>
              <div className="text-blue-700 text-sm space-y-1">
                <div>• GST: {(ALBERTA_GST_RATE * 100).toFixed(0)}% (federal goods and services tax)</div>
                <div>• PST: 0% (Alberta has no provincial sales tax)</div>
                <div>• Taxable: Labour services, equipment rentals</div>
                <div>• Non-taxable: Travel reimbursements (${STANDARD_TRAVEL_RATE_PER_KM}/km), meal allowances</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Forms */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {calculationType === 'daily' ? (
            /* Daily Input Form */
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Daily Work Entry</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Day Rate */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Labour Services</span>
                    <span className="text-xs text-gray-500">(taxable)</span>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dailyData.dayRateUsed}
                        onChange={(e) => updateDailyData('dayRateUsed', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Worked today</span>
                    </label>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Day Rate</label>
                      <input
                        type="number"
                        value={dailyData.dayRate}
                        onChange={(e) => updateDailyData('dayRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={!dailyData.dayRateUsed}
                      />
                    </div>
                  </div>
                </div>

                {/* Truck Usage */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <TruckIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Equipment Services</span>
                    <span className="text-xs text-gray-500">(taxable)</span>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dailyData.truckUsed}
                        onChange={(e) => updateDailyData('truckUsed', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Used truck/equipment</span>
                    </label>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Equipment Rate</label>
                      <input
                        type="number"
                        value={dailyData.truckRate}
                        onChange={(e) => updateDailyData('truckRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={!dailyData.truckUsed}
                      />
                    </div>
                  </div>
                </div>

                {/* Travel */}
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-3">
                    <MapIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Travel Reimbursement</span>
                    <span className="text-xs text-green-600">(non-taxable)</span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Distance (km) @ ${STANDARD_TRAVEL_RATE_PER_KM}/km
                    </label>
                    <input
                      type="number"
                      value={dailyData.travelKMs}
                      onChange={(e) => updateDailyData('travelKMs', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Subsistence */}
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-3">
                    <CakeIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Meal Allowance</span>
                    <span className="text-xs text-green-600">(non-taxable)</span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Subsistence Amount</label>
                    <input
                      type="number"
                      value={dailyData.subsistence}
                      onChange={(e) => updateDailyData('subsistence', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Weekly Input Form */
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Weekly Work Entries</h3>
                <button
                  onClick={addWorkDay}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Add Day
                </button>
              </div>
              
              <div className="space-y-3">
                {weeklyData.dailyEntries.map((day, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Day {index + 1}</h4>
                      {weeklyData.dailyEntries.length > 1 && (
                        <button
                          onClick={() => removeWorkDay(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Day Rate</label>
                        <input
                          type="number"
                          value={day.dayRate}
                          onChange={(e) => updateWeeklyDay(index, 'dayRate', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Equipment Rate</label>
                        <input
                          type="number"
                          value={day.truckRate}
                          onChange={(e) => updateWeeklyDay(index, 'truckRate', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Travel (km)</label>
                        <input
                          type="number"
                          value={day.travelKMs}
                          onChange={(e) => updateWeeklyDay(index, 'travelKMs', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Meals</label>
                        <input
                          type="number"
                          value={day.subsistence}
                          onChange={(e) => updateWeeklyDay(index, 'subsistence', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Calculation Results */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Invoice Calculation</h3>
          <button
            onClick={() => setShowValidation(!showValidation)}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            Validate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Taxable Services */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 border-b pb-2">
              Taxable Services ({(ALBERTA_GST_RATE * 100).toFixed(0)}% GST)
            </h4>
            
            {calculation.dayRateTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Labour Services:</span>
                <span className="font-mono">{formatCAD(calculation.dayRateTotal)}</span>
              </div>
            )}
            
            {calculation.truckRateTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment Services:</span>
                <span className="font-mono">{formatCAD(calculation.truckRateTotal)}</span>
              </div>
            )}
            
            {calculation.additionalCharges > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Additional Services:</span>
                <span className="font-mono">{formatCAD(calculation.additionalCharges)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Subtotal (Taxable):</span>
              <span className="font-mono">{formatCAD(calculation.taxableSubtotal)}</span>
            </div>
            
            <div className="flex justify-between text-red-600">
              <span>GST ({(ALBERTA_GST_RATE * 100).toFixed(0)}%):</span>
              <span className="font-mono font-bold">{formatCAD(calculation.gst)}</span>
            </div>
          </div>

          {/* Non-Taxable Reimbursements */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 border-b pb-2">
              Expense Reimbursements (Tax-Free)
            </h4>
            
            <div className="flex justify-between text-green-600">
              <span>Travel Reimbursement:</span>
              <span className="font-mono">{formatCAD(calculation.travelReimbursement)}</span>
            </div>
            
            <div className="flex justify-between text-green-600">
              <span>Meal Allowance:</span>
              <span className="font-mono">{formatCAD(calculation.subsistence)}</span>
            </div>
            
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>TOTAL INVOICE:</span>
                <span className="font-mono text-blue-600">{formatCAD(calculation.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Results */}
        {showValidation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t"
          >
            <div className="flex items-center gap-2 mb-3">
              {validation.isValid ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {validation.isValid ? 'Calculation Valid' : 'Validation Issues Found'}
              </span>
            </div>
            
            {validation.errors.length > 0 && (
              <div className="space-y-2 mb-4">
                <h5 className="font-medium text-red-600">Errors:</h5>
                {validation.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            )}
            
            {validation.warnings.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-yellow-600">Warnings:</h5>
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                    {warning}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Quick Copy Text Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Invoice Text Breakdown</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm font-mono whitespace-pre-wrap text-gray-700">
            {getTaxBreakdownText(calculation)}
          </pre>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(getTaxBreakdownText(calculation))}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default InvoiceCalculator; 