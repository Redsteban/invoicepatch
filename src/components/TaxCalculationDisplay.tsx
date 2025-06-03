'use client';

import { motion } from 'framer-motion';
import {
  CalculatorIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
  AlbertaInvoiceCalculation,
  getTaxBreakdownDetails,
  validateTaxCalculation,
  formatCAD,
  getAlbertaTaxInfo
} from '@/lib/albertaTax';

interface TaxCalculationDisplayProps {
  calculation: AlbertaInvoiceCalculation;
  title?: string;
  subtitle?: string;
  showValidation?: boolean;
  showTaxInfo?: boolean;
  className?: string;
}

export default function TaxCalculationDisplay({
  calculation,
  title = "Alberta Tax Calculation",
  subtitle = "5% GST on taxable services",
  showValidation = false,
  showTaxInfo = false,
  className = ""
}: TaxCalculationDisplayProps) {
  const breakdown = getTaxBreakdownDetails(calculation);
  const validation = validateTaxCalculation(calculation);
  const taxInfo = getAlbertaTaxInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalculatorIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          
          {showValidation && (
            <div className="flex items-center gap-2">
              {validation.isValid ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Valid</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Errors</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Taxable Services */}
        {breakdown.taxableItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              Taxable Services (5% GST)
              {showTaxInfo && (
                <InformationCircleIcon className="h-4 w-4 ml-1 text-gray-400" />
              )}
            </h4>
            <div className="space-y-2">
              {breakdown.taxableItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.description}:</span>
                  <span className="font-medium">{formatCAD(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-medium border-t border-gray-200 pt-2">
                <span>Subtotal (Taxable):</span>
                <span>{formatCAD(breakdown.taxSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>GST (5%):</span>
                <span className="font-bold">{formatCAD(breakdown.taxSummary.gst)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>After Tax:</span>
                <span>{formatCAD(breakdown.taxSummary.afterTax)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Non-Taxable Reimbursements */}
        {breakdown.nonTaxableItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              Expense Reimbursements (Tax-Free)
              {showTaxInfo && (
                <InformationCircleIcon className="h-4 w-4 ml-1 text-gray-400" />
              )}
            </h4>
            <div className="space-y-2">
              {breakdown.nonTaxableItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm text-green-600">
                  <span className="text-gray-600">{item.description}:</span>
                  <span className="font-medium">{formatCAD(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900">TOTAL INVOICE:</span>
            <span className="text-emerald-600">{formatCAD(breakdown.total)}</span>
          </div>
        </div>

        {/* Tax Information */}
        {showTaxInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-blue-900 mb-2">Alberta Tax Information</h5>
            <p className="text-sm text-blue-800 mb-3">{taxInfo.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-medium text-blue-900 mb-1">Taxable Items:</div>
                <ul className="space-y-1">
                  {taxInfo.applicableItems.map((item, index) => (
                    <li key={index} className="text-blue-700">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium text-blue-900 mb-1">Tax-Free Items:</div>
                <ul className="space-y-1">
                  {taxInfo.exemptItems.map((item, index) => (
                    <li key={index} className="text-blue-700">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Validation Errors/Warnings */}
        {showValidation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
          <div className="space-y-3">
            {validation.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-red-900 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  Calculation Errors
                </h5>
                <ul className="space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-800">• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validation.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center">
                  <InformationCircleIcon className="h-4 w-4 mr-1" />
                  Calculation Warnings
                </h5>
                <ul className="space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-800">• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
} 