'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, HardHat, Clock, FileText, Calendar, DollarSign, Percent, PlusCircle, CheckCircle, RefreshCw, Save, Settings, Briefcase, Download, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FreemiumModal from '@/components/FreemiumModal';
import dynamic from 'next/dynamic';
import ProfessionalPDFPreview from '@/components/ProfessionalPDFPreview';
import { generateHTMLToPDF } from '@/utils/htmlToPdfGenerator';
const EmailCollectionModal = dynamic(() => import('@/components/EmailCollectionModal'), { ssr: false });

// @ts-ignore
const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || '';

// Simulating a daily work entry
interface DailyEntry {
  day: number;
  date: string;
  description: string;
  hours: number;
  rate: number;
  truckRate: number;
  kmsDriven: number;
  kmsRate: number;
  otherCharges: number;
  location: string;
  ticketNumber: string;
  dailyTotal: number;
  worked: boolean;
}

// Main component for the interactive demo
export default function ContractorTrialDemo() {
  const router = useRouter();

  // State for user-configurable values
  const [companyName, setCompanyName] = useState('My Company Inc.');
  const [payType, setPayType] = useState<'daily' | 'hourly'>('hourly');
  const [rate, setRate] = useState(72.50);
  const [subsistence, setSubsistence] = useState(50.00);
  
  // Constants for the simulation
  const GST_RATE = 0.05;
  const TOTAL_DAYS = 14;

  // State management for the simulation
  const [day, setDay] = useState(1);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [invoiceSaved, setInvoiceSaved] = useState(false);

  // State for daily variables (allow string for empty input)
  const [truckRate, setTruckRate] = useState<string>('');
  const [kmsDriven, setKmsDriven] = useState<string>('');
  const [kmsRate, setKmsRate] = useState<string>('0.5');
  const [otherCharges, setOtherCharges] = useState<string>('');

  // Invoice metadata
  const [clientName, setClientName] = useState('Acme Energy Ltd.');
  const [clientAddress, setClientAddress] = useState('123 Main St, Calgary, AB');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [contractorName, setContractorName] = useState('John Doe');
  const [contractorAddress, setContractorAddress] = useState('456 Contractor Rd, Edmonton, AB');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientInvoiceNumber, setClientInvoiceNumber] = useState('');

  // For editing daily entries
  const [editDay, setEditDay] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<any>({});

  // Pay period start date
  const [payPeriodStart, setPayPeriodStart] = useState(() => new Date());

  // Modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showFreemiumModal, setShowFreemiumModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Reminder banner state
  const [showLocationReminder, setShowLocationReminder] = useState(true);

  // Function to simulate the next day
  const handleNextDay = () => {
    if (day > TOTAL_DAYS) return;
    const hours = payType === 'hourly' ? 8 : 12;
    const base = payType === 'hourly' ? hours * rate : rate;
    const truckRateNum = parseFloat(truckRate) || 0;
    const kmsDrivenNum = parseFloat(kmsDriven) || 0;
    const kmsRateNum = parseFloat(kmsRate) || 0;
    const otherChargesNum = parseFloat(otherCharges) || 0;
    const dailyTotal = base + truckRateNum + (kmsDrivenNum * kmsRateNum) + otherChargesNum;
    // Calculate the date for this day
    const entryDate = new Date(payPeriodStart);
    entryDate.setDate(payPeriodStart.getDate() + (day - 1));
    // Determine ticket number
    let ticketNumber = '';
    if (day === 1) {
      ticketNumber = clientInvoiceNumber;
    } else if (dailyEntries.length > 0) {
      const prev = dailyEntries[dailyEntries.length - 1].ticketNumber;
      const prevNum = parseInt(prev, 10);
      if (!isNaN(prevNum)) {
        ticketNumber = String(prevNum + 1);
      }
    }
    const newEntry: DailyEntry = {
      day: day,
      date: entryDate.toISOString().slice(0, 10),
      description: 'Stack Production Testing',
      hours: hours,
      rate: rate,
      truckRate: truckRateNum,
      kmsDriven: kmsDrivenNum,
      kmsRate: kmsRateNum,
      otherCharges: otherChargesNum,
      location: '',
      ticketNumber: ticketNumber,
      dailyTotal,
      worked: true,
    };
    setDailyEntries([...dailyEntries, newEntry]);
    setTruckRate(truckRate);
    setKmsDriven(kmsDriven);
    setKmsRate(kmsRate);
    setOtherCharges(otherCharges);
    if (day === TOTAL_DAYS) {
      setSimulationComplete(true);
      setShowEmailModal(true);
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

  // Edit daily entry
  const startEditDay = (entry: DailyEntry) => {
    setEditDay(entry.day);
    setEditFields({ ...entry });
  };
  const saveEditDay = () => {
    setDailyEntries(dailyEntries.map(e => e.day === editDay ? {
      ...editFields,
      truckRate: parseFloat(editFields.truckRate) || 0,
      kmsDriven: parseFloat(editFields.kmsDriven) || 0,
      kmsRate: parseFloat(editFields.kmsRate) || 0,
      otherCharges: parseFloat(editFields.otherCharges) || 0,
      dailyTotal:
        (editFields.payType === 'hourly' ? (editFields.hours * editFields.rate) : editFields.rate)
        + (parseFloat(editFields.truckRate) || 0)
        + ((parseFloat(editFields.kmsDriven) || 0) * (parseFloat(editFields.kmsRate) || 0))
        + (parseFloat(editFields.otherCharges) || 0),
      worked: editFields.worked !== undefined ? editFields.worked : true,
    } : e));
    setEditDay(null);
    setEditFields({});
  };
  const cancelEditDay = () => {
    setEditDay(null);
    setEditFields({});
  };

  // Only include worked days in totals
  const workedEntries = dailyEntries.filter(e => e.worked);
  const subtotal = workedEntries.reduce((acc, entry) => acc + entry.dailyTotal, 0);
  const gst = subtotal * GST_RATE;
  const totalSubsistence = workedEntries.length * subsistence;
  const grandTotal = subtotal + gst + totalSubsistence;

  // Generate all days in the pay period (including days off)
  const allDaysInPeriod = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const dayNumber = i + 1;
    const entryDate = new Date(payPeriodStart);
    entryDate.setDate(payPeriodStart.getDate() + i);
    const dateString = entryDate.toISOString().slice(0, 10);
    
    // Find if we have an entry for this day
    const existingEntry = dailyEntries.find(e => e.day === dayNumber);
    
    if (existingEntry) {
      return existingEntry;
    } else {
      // Create a day off entry
      return {
        day: dayNumber,
        date: dateString,
        description: 'Days Off',
        hours: 0,
        rate: 0,
        truckRate: 0,
        kmsDriven: 0,
        kmsRate: 0,
        otherCharges: 0,
        location: '',
        ticketNumber: '',
        dailyTotal: 0,
        worked: false,
      };
    }
  });

  // Check if any entry is missing location
  const anyMissingLocation = dailyEntries.some(e => !e.location?.trim());

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

  // Helper to build invoiceData for EmailCollectionModal
  const buildInvoiceData = () => {
    const periodStart = payPeriodStart;
    const periodEnd = new Date(payPeriodStart);
    periodEnd.setDate(periodEnd.getDate() + TOTAL_DAYS - 1);
    return {
      invoiceNumber: invoiceNumber || 'N/A',
      issueDate: new Date(invoiceDate),
      dueDate: periodEnd,
      contractor: {
        name: contractorName,
        address: contractorAddress,
        email: '',
        phone: '',
      },
      client: {
        name: clientName,
        address: clientAddress,
      },
      period: {
        startDate: new Date(periodStart),
        endDate: new Date(periodEnd),
      },
      entries: workedEntries.map(e => ({
        date: new Date(e.date),
        description: 'Stack Production Testing',
        worked: e.worked,
        hoursWorked: e.hours,
        truckUsed: !!e.truckRate,
        travelKms: e.kmsDriven,
        subsistence: subsistence,
        dailyTotal: e.dailyTotal,
        location: e.location,
        ticketNumber: e.ticketNumber,
        truckRate: e.truckRate,
        kmsDriven: e.kmsDriven,
        kmsRate: e.kmsRate,
        otherCharges: e.otherCharges,
      })),
      summary: {
        regularHours: workedEntries.reduce((acc, e) => acc + e.hours, 0),
        overtimeHours: 0,
        travelHours: 0,
        totalHours: workedEntries.reduce((acc, e) => acc + e.hours, 0),
        regularAmount: workedEntries.reduce((acc, e) => acc + e.rate * e.hours, 0),
        overtimeAmount: 0,
        travelAmount: 0,
        expensesTotal: workedEntries.reduce((acc, e) => acc + (e.otherCharges || 0), 0),
        subtotal,
        gst: gst,
        pst: 0,
        total: grandTotal,
      },
      notes: '',
    };
  };

  // Handlers for EmailCollectionModal
  const handleEmailSubmit = async (email: string, consent: boolean) => {
    setIsSending(true);
    try {
      if (!CSRF_TOKEN) {
        return { error: 'CSRF token missing. Please contact support.' };
      }
      const res = await fetch('/api/email/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': CSRF_TOKEN,
        },
        body: JSON.stringify({
          email,
          consent,
          invoiceData: buildInvoiceData(),
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setShowEmailModal(false);
        setShowFreemiumModal(true);
      }
      return result;
    } catch (e: any) {
      return { error: e?.message || 'Failed to send invoice.' };
    } finally {
      setIsSending(false);
    }
  };
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData: buildInvoiceData() }),
      });
      const result = await res.json();
      if (res.ok && result.pdfUrl) {
        window.open(result.pdfUrl, '_blank');
        setShowEmailModal(false);
      }
      return result;
    } catch (e: any) {
      return { error: e?.message || 'Failed to download PDF.' };
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to generate the full 14-day log at once
  const handleGenerateFullLog = () => {
    const entries: DailyEntry[] = [];
    for (let i = 1; i <= TOTAL_DAYS; i++) {
      const hours = payType === 'hourly' ? 8 : 12;
      const base = payType === 'hourly' ? hours * rate : rate;
      const truckRateNum = parseFloat(truckRate) || 0;
      const kmsDrivenNum = parseFloat(kmsDriven) || 0;
      const kmsRateNum = parseFloat(kmsRate) || 0;
      const otherChargesNum = parseFloat(otherCharges) || 0;
      const dailyTotal = base + truckRateNum + (kmsDrivenNum * kmsRateNum) + otherChargesNum;
      const entryDate = new Date(payPeriodStart);
      entryDate.setDate(payPeriodStart.getDate() + (i - 1));
      let ticketNumber = '';
      if (i === 1) {
        ticketNumber = clientInvoiceNumber;
      } else if (entries.length > 0) {
        const prev = entries[entries.length - 1].ticketNumber;
        const prevNum = parseInt(prev, 10);
        if (!isNaN(prevNum)) {
          ticketNumber = String(prevNum + 1);
        }
      }
      entries.push({
        day: i,
        date: entryDate.toISOString().slice(0, 10),
        description: 'Stack Production Testing',
        hours: hours,
        rate: rate,
        truckRate: truckRateNum,
        kmsDriven: kmsDrivenNum,
        kmsRate: kmsRateNum,
        otherCharges: otherChargesNum,
        location: '',
        ticketNumber: ticketNumber,
        dailyTotal,
        worked: true,
      });
    }
    setDailyEntries(entries);
    setSimulationComplete(true);
    // Do NOT open the email modal here; let the user audit first
    setShowEmailModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <EmailCollectionModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        invoiceData={buildInvoiceData()}
      />
      <FreemiumModal open={showFreemiumModal} onClose={() => setShowFreemiumModal(false)}>
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-blue-700">Ready to use InvoicePatch for real?</h2>
          <p className="text-gray-700 mb-4">Get started with our <span className="font-semibold text-blue-600">Freemium</span> version—no credit card required!</p>
          <Link href="/freemium" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center mb-2">
            <span className="mr-2">Try Freemium Now</span>
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
          <button onClick={() => setShowFreemiumModal(false)} className="text-gray-500 underline text-sm mt-2">Maybe later</button>
        </div>
      </FreemiumModal>
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

        {/* Invoice metadata section */}
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Address</label>
                <input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Delivery Date</label>
                <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Name</label>
                <input type="text" value={contractorName} onChange={e => setContractorName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Address</label>
                <input type="text" value={contractorAddress} onChange={e => setContractorAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period Start</label>
                <input type="date" value={payPeriodStart.toISOString().slice(0, 10)} onChange={e => setPayPeriodStart(new Date(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period End</label>
                <input type="date" value={(() => { const d = new Date(payPeriodStart); d.setDate(d.getDate() + TOTAL_DAYS - 1); return d.toISOString().slice(0, 10); })()} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Invoice Number (first day ticket)</label>
                <input type="text" value={clientInvoiceNumber} onChange={e => setClientInvoiceNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        {!simulationComplete && dailyEntries.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Settings className="w-6 h-6 mr-3 text-green-600"/>Configure Your Simulation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Type</label>
                <select 
                  value={payType}
                  onChange={(e) => setPayType(e.target.value as 'daily' | 'hourly')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="hourly">Hourly Rate</option>
                  <option value="daily">Daily Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {payType === 'hourly' ? 'Hourly Rate ($)' : 'Daily Rate ($)'}
                </label>
                <input 
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Subsistence ($)</label>
                <input 
                  type="number"
                  value={subsistence}
                  onChange={(e) => setSubsistence(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Simulation Controls and Status */}
        {!simulationComplete && (
           <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 text-center">
             <h2 className="text-2xl font-bold text-gray-800 mb-2">
               Simulating Day <span className="text-green-600">{day}</span> of {TOTAL_DAYS}
            </h2>
            <p className="text-gray-600 mb-6">
              {payType === 'hourly' 
                ? `An 8-hour workday at $${rate.toFixed(2)}/hr will be logged.`
                : `A 12-hour workday at a daily rate of $${rate.toFixed(2)} will be logged.`
              }
            </p>
            {/* Daily variable inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Truck Rate ($)</label>
                <input
                  type="number"
                  value={truckRate}
                  onChange={e => setTruckRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kms Driven (per day)</label>
                <input
                  type="number"
                  value={kmsDriven}
                  onChange={e => setKmsDriven(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kms Rate ($/km)</label>
                <input
                  type="number"
                  value={kmsRate}
                  onChange={e => setKmsRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Charges ($)</label>
                <input
                  type="number"
                  value={otherCharges}
                  onChange={e => setOtherCharges(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <button 
              onClick={handleNextDay}
              className="bg-green-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-transform duration-200 ease-in-out hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={simulationComplete}
            >
              Simulate Next Day
            </button>
            {/* Add Generate 14-Day Log button if no days have been simulated yet */}
            {dailyEntries.length === 0 && (
              <button
                onClick={handleGenerateFullLog}
                className="ml-4 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform duration-200 ease-in-out hover:scale-105 mt-4"
              >
                Generate 14-Day Log
              </button>
            )}
          </div>
        )}

        {/* Daily Entries Log */}
        {dailyEntries.length > 0 && showLocationReminder && anyMissingLocation && (
          <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded flex items-center justify-between">
            <span>
              <strong>Reminder:</strong> Don't forget to update the <span className="font-semibold">Location/Job Site</span> for each day's ticket!
            </span>
            <button
              className="ml-4 text-yellow-700 hover:underline text-sm"
              onClick={() => setShowLocationReminder(false)}
            >
              Dismiss
            </button>
          </div>
        )}
        {dailyEntries.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><Calendar className="w-6 h-6 mr-3 text-green-600"/>Daily Work Log</h3>
            <div className="space-y-3">
              {dailyEntries.map(entry => (
                <div key={entry.day} className="flex flex-col md:flex-row md:justify-between md:items-center p-3 bg-green-50 rounded-lg mb-2">
                  {editDay === entry.day ? (
                    <div className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                          <input type="text" value={editFields.description} onChange={e => setEditFields({ ...editFields, description: e.target.value })} className="px-2 py-1 border rounded w-full" placeholder="Description" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                          <input type="text" value={editFields.location} onChange={e => setEditFields({ ...editFields, location: e.target.value })} className="px-2 py-1 border rounded w-full" placeholder="Location" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Ticket Number</label>
                          <input type="text" value={editFields.ticketNumber} onChange={e => setEditFields({ ...editFields, ticketNumber: e.target.value })} className="px-2 py-1 border rounded w-full" placeholder="Ticket Number" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Truck Rate ($)</label>
                          <input type="number" value={editFields.truckRate ?? ''} onChange={e => setEditFields({ ...editFields, truckRate: e.target.value })} className="px-2 py-1 border rounded w-full" placeholder="Truck Rate" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Kms Driven</label>
                          <input type="number" value={editFields.kmsDriven ?? ''} onChange={e => setEditFields({ ...editFields, kmsDriven: e.target.value })} className="px-2 py-1 border rounded w-full" placeholder="Kms Driven" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Kms Rate ($/km)</label>
                          <input type="number" value={editFields.kmsRate ?? ''} onChange={e => setEditFields({ ...editFields, kmsRate: e.target.value })} className="px-2 py-1 border rounded w-full" placeholder="Kms Rate" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Other Charges ($)</label>
                          <input type="number" value={editFields.otherCharges ?? ''} onChange={e => setEditFields({ ...editFields, otherCharges: e.target.value })} className="px-2 py-1 border rounded w-full" placeholder="Other Charges" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <input
                            type="checkbox"
                            checked={editFields.worked !== false}
                            onChange={e => setEditFields({ ...editFields, worked: e.target.checked })}
                          />
                          Worked this day
                        </label>
                        <button onClick={saveEditDay} className="bg-emerald-600 text-white px-4 py-1 rounded">Save</button>
                        <button onClick={cancelEditDay} className="bg-gray-200 text-gray-700 px-4 py-1 rounded">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">{entry.description}</span>
                          <span className="text-sm text-gray-500">• Day {entry.day}</span>
                          <span className="text-sm text-gray-500">• {entry.date}</span>
                        </div>
                        <span className="block text-xs text-gray-500">Location: {entry.location || '-'} | Ticket #: {entry.ticketNumber || '-'}</span>
                        <span className="block text-xs text-gray-500">Hours: {entry.hours}, Rate: ${entry.rate}, Truck: ${entry.truckRate}, Kms: {entry.kmsDriven} @ ${entry.kmsRate}/km, Other: ${entry.otherCharges}</span>
                      </div>
                      <span className="font-mono text-gray-700">${entry.dailyTotal.toFixed(2)}</span>
                      <button onClick={() => startEditDay(entry)} className="ml-4 text-emerald-600 hover:underline">Edit</button>
                      <button
                        className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${entry.worked ? 'bg-green-200 text-green-800 border-green-400' : 'bg-gray-200 text-gray-500 border-gray-300'}`}
                        onClick={() => setDailyEntries(dailyEntries.map(e => e.day === entry.day ? { ...e, worked: !e.worked } : e))}
                        aria-label={entry.worked ? 'Mark as day off' : 'Mark as worked'}
                      >
                        {entry.worked ? 'Worked' : 'Day Off'}
                      </button>
                    </>
                  )}
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
                <div className="mt-2 text-gray-700">
                  <div><span className="font-semibold">Client:</span> {clientName}</div>
                  <div><span className="font-semibold">Client Address:</span> {clientAddress}</div>
                  <div><span className="font-semibold">Invoice Date:</span> {invoiceDate}</div>
                  <div><span className="font-semibold">Contractor:</span> {contractorName}</div>
                  <div><span className="font-semibold">Contractor Address:</span> {contractorAddress}</div>
                  <div><span className="font-semibold">Pay Period:</span> {payPeriodStart.toISOString().slice(0, 10)} to {(() => { const d = new Date(payPeriodStart); d.setDate(d.getDate() + TOTAL_DAYS - 1); return d.toISOString().slice(0, 10); })()}</div>
                  <div><span className="font-semibold">Invoice Number:</span> {invoiceNumber || '-'}</div>
                </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
                {/* Line Items */}
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Work Summary:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1">Day</th>
                        <th className="px-2 py-1">Date</th>
                        <th className="px-2 py-1">Description</th>
                        <th className="px-2 py-1">Location</th>
                        <th className="px-2 py-1">Ticket #</th>
                        <th className="px-2 py-1">Truck</th>
                        <th className="px-2 py-1">Kms</th>
                        <th className="px-2 py-1">Kms Rate</th>
                        <th className="px-2 py-1">Other</th>
                        <th className="px-2 py-1">Subsistence</th>
                        <th className="px-2 py-1">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allDaysInPeriod.map(e => (
                        <tr key={e.day} className="border-b">
                          <td className="px-2 py-1 text-center">{e.day}</td>
                          <td className="px-2 py-1 text-center">{e.date}</td>
                          <td className="px-2 py-1">{e.description}</td>
                          <td className="px-2 py-1">{e.location}</td>
                          <td className="px-2 py-1">{e.ticketNumber}</td>
                          <td className="px-2 py-1 text-right">{e.worked ? `$${e.truckRate}` : '-'}</td>
                          <td className="px-2 py-1 text-right">{e.worked ? e.kmsDriven : '-'}</td>
                          <td className="px-2 py-1 text-right">{e.worked ? `$${e.kmsRate}` : '-'}</td>
                          <td className="px-2 py-1 text-right">{e.worked ? `$${e.otherCharges}` : '-'}</td>
                          <td className="px-2 py-1 text-right">{e.worked ? `$${subsistence.toFixed(2)}` : '-'}</td>
                          <td className="px-2 py-1 text-right font-bold">{e.worked ? `$${e.dailyTotal.toFixed(2)}` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add breakdown for truck, kms, other charges */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center"><PlusCircle className="w-4 h-4 mr-2"/>Total Truck Charges</span>
                  <span className="font-mono text-gray-800">${workedEntries.reduce((acc, e) => acc + e.truckRate, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center"><PlusCircle className="w-4 h-4 mr-2"/>Total Kms Charges</span>
                  <span className="font-mono text-gray-800">${workedEntries.reduce((acc, e) => acc + (e.kmsDriven * e.kmsRate), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center"><PlusCircle className="w-4 h-4 mr-2"/>Total Other Charges</span>
                  <span className="font-mono text-gray-800">${workedEntries.reduce((acc, e) => acc + e.otherCharges, 0).toFixed(2)}</span>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={async () => {
                    await generateHTMLToPDF({
                      entries: allDaysInPeriod.map(e => ({
                        ...e,
                        completed: e.worked,
                      })),
                      contractorName,
                      clientName,
                      clientAddress,
                      contractorAddress,
                      startDate: payPeriodStart.toISOString().slice(0, 10),
                      endDate: (() => {
                        const end = new Date(payPeriodStart);
                        end.setDate(end.getDate() + TOTAL_DAYS - 1);
                        return end.toISOString().slice(0, 10);
                      })(),
                      subsistence: subsistence,
                      totalTruckCharges: workedEntries.reduce((acc, e) => acc + e.truckRate, 0),
                      totalKmsCharges: workedEntries.reduce((acc, e) => acc + (e.kmsDriven * e.kmsRate), 0),
                      totalOtherCharges: workedEntries.reduce((acc, e) => acc + e.otherCharges, 0),
                      subtotal: subtotal,
                      gst: gst,
                      totalSubsistence: totalSubsistence,
                      grandTotal: grandTotal,
                    });
                  }}
                  className="flex-1 bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center mx-auto"
                  disabled={isGenerating}
                >
                  <Download className="w-5 h-5 mr-3" />
                  {isGenerating ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                  disabled={isSending}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Email PDF
                </button>
              </div>
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
