'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  PlusIcon, 
  TrashIcon, 
  DocumentArrowDownIcon,
  PaperAirplaneIcon,
  CalculatorIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  // Contractor Info
  contractorName: string;
  contractorAddress: string;
  contractorCity: string;
  contractorProvince: string;
  contractorPostal: string;
  contractorPhone: string;
  contractorEmail: string;
  gstNumber?: string;
  
  // Client Info
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientProvince: string;
  clientPostal: string;
  clientEmail: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  projectDescription?: string;
  
  // Line Items
  lineItems: LineItem[];
  
  // Notes
  notes?: string;
}

// Canadian tax rates by province
const TAX_RATES = {
  'AB': { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'GST' },
  'BC': { gst: 0.05, pst: 0.07, hst: 0, total: 0.12, name: 'GST + PST' },
  'MB': { gst: 0.05, pst: 0.07, hst: 0, total: 0.12, name: 'GST + PST' },
  'NB': { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'HST' },
  'NL': { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'HST' },
  'NS': { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'HST' },
  'NT': { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'GST' },
  'NU': { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'GST' },
  'ON': { gst: 0, pst: 0, hst: 0.13, total: 0.13, name: 'HST' },
  'PE': { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'HST' },
  'QC': { gst: 0.05, pst: 0.09975, hst: 0, total: 0.14975, name: 'GST + QST' },
  'SK': { gst: 0.05, pst: 0.06, hst: 0, total: 0.11, name: 'GST + PST' },
  'YT': { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'GST' },
};

const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
];

export default function InvoiceBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InvoiceData>({
    defaultValues: {
      lineItems: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  });

  const watchedLineItems = watch('lineItems');
  const watchedProvince = watch('contractorProvince');

  // Calculate totals whenever line items change
  useEffect(() => {
    const newSubtotal = watchedLineItems.reduce((sum, item) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      return sum + amount;
    }, 0);

    const taxRate = watchedProvince ? TAX_RATES[watchedProvince as keyof typeof TAX_RATES]?.total || 0 : 0;
    const newTaxAmount = newSubtotal * taxRate;
    const newTotal = newSubtotal + newTaxAmount;

    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotal(newTotal);

    // Update individual line item amounts
    watchedLineItems.forEach((item, index) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      setValue(`lineItems.${index}.amount`, amount);
    });
  }, [watchedLineItems, watchedProvince, setValue]);

  const addLineItem = () => {
    append({ description: '', quantity: 1, rate: 0, amount: 0 });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const generatePDF = async (data: InvoiceData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subtotal,
          taxAmount,
          total,
          taxRate: watchedProvince ? TAX_RATES[watchedProvince as keyof typeof TAX_RATES] : null
        }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${data.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendInvoice = async (data: InvoiceData) => {
    setIsSending(true);
    try {
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subtotal,
          taxAmount,
          total,
          taxRate: watchedProvince ? TAX_RATES[watchedProvince as keyof typeof TAX_RATES] : null
        }),
      });

      if (!response.ok) throw new Error('Failed to send invoice');

      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Send invoice error:', error);
      alert('Failed to send invoice. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = (data: InvoiceData, action: 'pdf' | 'send') => {
    if (action === 'pdf') {
      generatePDF(data);
    } else {
      sendInvoice(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <CalculatorIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">InvoicePatch</h1>
          </div>
          <p className="text-slate-600">Create professional invoices with Canadian tax calculations</p>
        </div>

        <form className="space-y-6">
          {/* Contractor Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
              Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business/Contractor Name *
                </label>
                <input
                  {...register('contractorName', { required: 'Contractor name is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Business Name"
                />
                {errors.contractorName && (
                  <p className="text-red-600 text-sm mt-1">{errors.contractorName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  GST/HST Number
                </label>
                <input
                  {...register('gstNumber')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456789RT0001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address *
                </label>
                <input
                  {...register('contractorAddress', { required: 'Address is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main Street"
                />
                {errors.contractorAddress && (
                  <p className="text-red-600 text-sm mt-1">{errors.contractorAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  City *
                </label>
                <input
                  {...register('contractorCity', { required: 'City is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Toronto"
                />
                {errors.contractorCity && (
                  <p className="text-red-600 text-sm mt-1">{errors.contractorCity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Province *
                </label>
                <select
                  {...register('contractorProvince', { required: 'Province is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map(province => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.contractorProvince && (
                  <p className="text-red-600 text-sm mt-1">{errors.contractorProvince.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Postal Code *
                </label>
                <input
                  {...register('contractorPostal', { required: 'Postal code is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="M5H 2N2"
                />
                {errors.contractorPostal && (
                  <p className="text-red-600 text-sm mt-1">{errors.contractorPostal.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone *
                </label>
                <input
                  {...register('contractorPhone', { required: 'Phone is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(416) 555-0123"
                />
                {errors.contractorPhone && (
                  <p className="text-red-600 text-sm mt-1">{errors.contractorPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  {...register('contractorEmail', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email'
                    }
                  })}
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="contractor@example.com"
                />
                {errors.contractorEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.contractorEmail.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Bill To</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Client Name *
                </label>
                <input
                  {...register('clientName', { required: 'Client name is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Client Company Name"
                />
                {errors.clientName && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Client Email *
                </label>
                <input
                  {...register('clientEmail', { 
                    required: 'Client email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email'
                    }
                  })}
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="client@company.com"
                />
                {errors.clientEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientEmail.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address *
                </label>
                <input
                  {...register('clientAddress', { required: 'Client address is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="456 Business Avenue"
                />
                {errors.clientAddress && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  City *
                </label>
                <input
                  {...register('clientCity', { required: 'Client city is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Toronto"
                />
                {errors.clientCity && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientCity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Province *
                </label>
                <select
                  {...register('clientProvince', { required: 'Client province is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map(province => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.clientProvince && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientProvince.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Postal Code *
                </label>
                <input
                  {...register('clientPostal', { required: 'Client postal code is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="M5H 2N2"
                />
                {errors.clientPostal && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientPostal.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
              Invoice Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Invoice Number *
                </label>
                <input
                  {...register('invoiceNumber', { required: 'Invoice number is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.invoiceNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.invoiceNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Invoice Date *
                </label>
                <input
                  {...register('invoiceDate', { required: 'Invoice date is required' })}
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.invoiceDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.invoiceDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date *
                </label>
                <input
                  {...register('dueDate', { required: 'Due date is required' })}
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.dueDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Project Description
                </label>
                <input
                  {...register('projectDescription')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Electrical work at downtown office building"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Line Items</h2>
              <button
                type="button"
                onClick={addLineItem}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description *
                    </label>
                    <input
                      {...register(`lineItems.${index}.description`, { required: 'Description is required' })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Work description"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Qty *
                    </label>
                    <input
                      {...register(`lineItems.${index}.quantity`, { 
                        required: 'Quantity is required',
                        min: { value: 0.01, message: 'Quantity must be greater than 0' }
                      })}
                      type="number"
                      step="0.01"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Rate ($) *
                    </label>
                    <input
                      {...register(`lineItems.${index}.rate`, { 
                        required: 'Rate is required',
                        min: { value: 0, message: 'Rate cannot be negative' }
                      })}
                      type="number"
                      step="0.01"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Amount
                    </label>
                    <input
                      {...register(`lineItems.${index}.amount`)}
                      type="number"
                      step="0.01"
                      readOnly
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-slate-600"
                      value={((watchedLineItems[index]?.quantity || 0) * (watchedLineItems[index]?.rate || 0)).toFixed(2)}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      disabled={fields.length === 1}
                      className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Invoice Summary</h2>
            
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              
              {watchedProvince && (
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {TAX_RATES[watchedProvince as keyof typeof TAX_RATES]?.name || 'Tax'} 
                    ({((TAX_RATES[watchedProvince as keyof typeof TAX_RATES]?.total || 0) * 100).toFixed(1)}%):
                  </span>
                  <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Notes</h2>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Payment terms, additional notes, etc."
            />
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, 'pdf'))}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center space-x-2 bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
              </button>
              
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, 'send'))}
                disabled={isSending}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                <span>{isSending ? 'Sending...' : 'Send Invoice'}</span>
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm text-slate-500">
              <p>✅ CRA compliant • 🔒 Secure • 📧 Professional delivery</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 