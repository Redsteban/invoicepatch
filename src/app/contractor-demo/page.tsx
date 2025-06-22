'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, HardHat, Clock, FileText, Calendar, DollarSign, Percent, PlusCircle, CheckCircle, RefreshCw, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Simulating a daily work entry
interface DailyEntry {
  day: number;
  description: string;
  hours: number;
  rate: number;
  dailyTotal: number;
}

// Main component for the interactive demo
export default function ContractorTrialDemo() {
  const router = useRouter();

  // Constants for the simulation
  const HOURLY_RATE = 72.50;
  const SUBSISTENCE_PER_DAY = 50.00;
  const GST_RATE = 0.05;
  const TOTAL_DAYS = 15;

  // State management for the simulation
  const [day, setDay] = useState(1);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [invoiceSaved, setInvoiceSaved] = useState(false);

  // Function to simulate the next day
  const handleNextDay = () => {
    if (day > TOTAL_DAYS) return;

    const newEntry: DailyEntry = {
      day: day,
      description: `Well Site Servicing - Day ${day}`,
      hours: 8,
      rate: HOURLY_RATE,
      dailyTotal: 8 * HOURLY_RATE,
    };

    setDailyEntries([...dailyEntries, newEntry]);

    if (day === TOTAL_DAYS) {
      setSimulationComplete(true);
    } else {
      setDay(day + 1);
    }
  };
  
  // Function to reset the simulation
  const handleReset = () => {
    setDay(1);
    setDailyEntries([]);
    setSimulationComplete(false);
    setInvoiceSaved(false);
  };

  // Function to simulate saving the invoice
  const handleSaveInvoice = () => {
    console.log("Simulating: Saving invoice...");
    setInvoiceSaved(true);
  };

  // Calculated totals for the final invoice
  const subtotal = dailyEntries.reduce((acc, entry) => acc + entry.dailyTotal, 0);
  const gst = subtotal * GST_RATE;
  const totalSubsistence = dailyEntries.length * SUBSISTENCE_PER_DAY;
  const grandTotal = subtotal + gst + totalSubsistence;

  useEffect(() => {
    // Simple fade-in animation for the final invoice
    const styleId = 'fade-in-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center">
              <HardHat className="w-8 h-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-green-600">Invoice</span>Patch
              </span>
            </div>
            <button
                onClick={handleReset}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                title="Reset Simulation"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reset
              </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
           <div className="flex justify-center mb-6">
            <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
              15-Day Invoice Generation Demo
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simulate Your 15-Day Work Period
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Click through each day to log your work. After 15 days, your invoice will be generated automatically, with tax-free subsistence calculated correctly.
          </p>
          <div className="mt-6">
            <Link href="/contractor-trial" className="inline-block bg-white text-green-700 font-semibold py-3 px-6 rounded-lg border border-green-300 hover:bg-green-50 transition-colors shadow-sm">
                Or, Start Your Full 14-Day Free Trial
            </Link>
          </div>
        </div>

        {/* Simulation Controls and Status */}
        {!simulationComplete && (
           <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 text-center">
             <h2 className="text-2xl font-bold text-gray-800 mb-2">
               Simulating Day <span className="text-green-600">{day}</span> of {TOTAL_DAYS}
            </h2>
            <p className="text-gray-600 mb-6">
              A standard 8-hour workday at ${HOURLY_RATE.toFixed(2)}/hr will be logged.
            </p>
            <button 
              onClick={handleNextDay}
              className="bg-green-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-transform duration-200 ease-in-out hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={simulationComplete}
            >
              Simulate Next Day
            </button>
          </div>
        )}

        {/* Daily Entries Log */}
        {dailyEntries.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><Calendar className="w-6 h-6 mr-3 text-green-600"/>Daily Work Log</h3>
            <div className="space-y-3">
              {dailyEntries.map(entry => (
                <div key={entry.day} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-700 mr-3"/>
                    <span className="font-medium text-gray-800">{entry.description}</span>
                  </div>
                  <span className="font-mono text-gray-700">${entry.dailyTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Invoice */}
        {simulationComplete && (
          <div className="bg-white border-4 border-green-600 rounded-2xl p-8 animate-fade-in">
            <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4"/>
                <h2 className="text-4xl font-extrabold text-gray-900">Invoice Ready for Submission</h2>
                <p className="text-gray-600 mt-2">15-day work period completed and invoice generated.</p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
                {/* Line Items */}
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Work Summary:</h4>
                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center"><FileText className="w-4 h-4 mr-2"/>Total from Daily Work Logs</span>
                    <span className="font-mono text-gray-800">${subtotal.toFixed(2)}</span>
                </div>

                {/* Financial Calculations */}
                <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Financial Summary:</h4>
                <div className="space-y-2">
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-600 flex items-center"><PlusCircle className="w-4 h-4 mr-2"/>Subtotal</span>
                        <span className="font-mono font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-600 flex items-center"><Percent className="w-4 h-4 mr-2"/>GST (5%)</span>
                        <span className="font-mono font-semibold text-gray-800">${gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
                        <span className="font-medium text-yellow-800 flex items-center"><PlusCircle className="w-4 h-4 mr-2"/>Subsistence (Tax-Free)</span>
                        <span className="font-mono font-semibold text-yellow-900">${totalSubsistence.toFixed(2)}</span>
                    </div>
                </div>

                {/* Grand Total */}
                <div className="mt-6 pt-4 border-t-2 border-dashed">
                    <div className="flex justify-between items-center text-2xl font-bold text-green-700">
                        <span className="flex items-center"><DollarSign className="w-6 h-6 mr-2"/>Grand Total</span>
                        <span className="font-mono">${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8">
              {!invoiceSaved ? (
                <button
                  onClick={handleSaveInvoice}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                >
                  <Save className="w-5 h-5 mr-3" />
                  Save Invoice
                </button>
              ) : (
                <div className="text-green-700 font-bold text-lg p-4 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Invoice Saved Successfully!
                </div>
              )}
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
                This invoice is now ready to be sent to the operator for approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
