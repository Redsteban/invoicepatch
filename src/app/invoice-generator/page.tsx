'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  PrinterIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  CalculatorIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

const EmailCollectionModal = dynamic(() => import('@/components/EmailCollectionModal'), { ssr: false });

// Canadian Provinces and their tax rates
const CANADIAN_PROVINCES = {
  'BC': { name: 'British Columbia', gst: 5, pst: 7, hst: 0 },
  'AB': { name: 'Alberta', gst: 5, pst: 0, hst: 0 },
  'SK': { name: 'Saskatchewan', gst: 5, pst: 6, hst: 0 },
  'MB': { name: 'Manitoba', gst: 5, pst: 7, hst: 0 },
  'ON': { name: 'Ontario', gst: 0, pst: 0, hst: 13 },
  'QC': { name: 'Quebec', gst: 5, pst: 9.975, hst: 0 },
  'NB': { name: 'New Brunswick', gst: 0, pst: 0, hst: 15 },
  'NS': { name: 'Nova Scotia', gst: 0, pst: 0, hst: 15 },
  'PE': { name: 'Prince Edward Island', gst: 0, pst: 0, hst: 15 },
  'NL': { name: 'Newfoundland and Labrador', gst: 0, pst: 0, hst: 15 },
  'YT': { name: 'Yukon', gst: 5, pst: 0, hst: 0 },
  'NT': { name: 'Northwest Territories', gst: 5, pst: 0, hst: 0 },
  'NU': { name: 'Nunavut', gst: 5, pst: 0, hst: 0 }
};

interface InvoiceLineItem {
  id: string;
  description: string;
  category: 'labor' | 'equipment' | 'travel' | 'expense';
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  contractor: {
    businessName: string;
    contactName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
    gstNumber: string;
  };
  client: {
    companyName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  project: {
    name: string;
    afeCode: string;
    workOrderRef: string;
    workPeriod: string;
  };
  lineItems: InvoiceLineItem[];
  notes: string;
  paymentTerms: string;
}

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contractor: {
      businessName: 'Thunder Oilfield Services Ltd.',
      contactName: 'Mike Thompson',
      address: '1234 Industrial Drive',
      city: 'Fort St. John',
      province: 'BC',
      postalCode: 'V1J 4M7',
      phone: '(250) 555-0123',
      email: 'mike@thunderoilfield.com',
      gstNumber: '123456789RT0001'
    },
    client: {
      companyName: 'Suncor Energy Services Inc.',
      address: '150 6th Avenue SW',
      city: 'Calgary',
      province: 'AB',
      postalCode: 'T2P 3E3'
    },
    project: {
      name: 'Montney Horizontal Well Program',
      afeCode: 'AFE-2024-001',
      workOrderRef: 'WO-24-0156',
      workPeriod: 'June 1-7, 2024'
    },
    lineItems: [
      {
        id: '1',
        description: 'Senior Drilling Supervisor - Day Shift',
        category: 'labor',
        quantity: 7,
        unit: 'days',
        rate: 850,
        amount: 5950
      },
      {
        id: '2',
        description: 'Service Truck with Equipment',
        category: 'equipment',
        quantity: 7,
        unit: 'days',
        rate: 450,
        amount: 3150
      },
      {
        id: '3',
        description: 'Travel - Calgary to Location',
        category: 'travel',
        quantity: 650,
        unit: 'km',
        rate: 0.68,
        amount: 442
      }
    ],
    notes: 'Payment due within 30 days. Late payment subject to 1.5% monthly service charge.',
    paymentTerms: 'Net 30 Days'
  });

  const [showPreview, setShowPreview] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [modalAction, setModalAction] = useState<'download' | 'email' | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const lastPdfBase64 = useRef<string | null>(null);

  // Calculate totals and taxes
  const calculateInvoice = () => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxInfo = CANADIAN_PROVINCES[invoiceData.client.province as keyof typeof CANADIAN_PROVINCES];
    
    const gstAmount = subtotal * (taxInfo.gst / 100);
    const pstAmount = subtotal * (taxInfo.pst / 100);
    const hstAmount = subtotal * (taxInfo.hst / 100);
    const totalTax = gstAmount + pstAmount + hstAmount;
    const total = subtotal + totalTax;

    return {
      subtotal,
      gstAmount,
      pstAmount,
      hstAmount,
      totalTax,
      total,
      taxInfo
    };
  };

  const totals = calculateInvoice();

  const addLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: Date.now().toString(),
      description: '',
      category: 'labor',
      quantity: 1,
      unit: 'days',
      rate: 0,
      amount: 0
    };
    setInvoiceData({
      ...invoiceData,
      lineItems: [...invoiceData.lineItems, newItem]
    });
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    const updatedItems = invoiceData.lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setInvoiceData({ ...invoiceData, lineItems: updatedItems });
  };

  const deleteLineItem = (id: string) => {
    setInvoiceData({
      ...invoiceData,
      lineItems: invoiceData.lineItems.filter(item => item.id !== id)
    });
  };

  // --- Modal Handlers ---
  const handleOpenModal = (action: 'download' | 'email') => {
    setModalAction(action);
    setModalOpen(true);
    setModalError(null);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalError(null);
  };

  // --- Backend Integration ---
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setModalError(null);
    try {
      const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const { pdfBase64 } = await res.json();
      lastPdfBase64.current = pdfBase64;
      // Download PDF
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfBase64}`;
      link.download = `Invoice-${invoiceData.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      setModalError(e.message || 'Failed to generate PDF.');
      throw e;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailSubmit = async (email: string, consent: boolean) => {
    setIsSending(true);
    setModalError(null);
    try {
      // Always generate PDF first if not already
      let pdfBase64 = lastPdfBase64.current;
      if (!pdfBase64) {
        const res = await fetch('/api/pdf/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceData }),
        });
        if (!res.ok) throw new Error('Failed to generate PDF');
        const data = await res.json();
        pdfBase64 = data.pdfBase64;
        lastPdfBase64.current = pdfBase64;
      }
      // Send email
      const res = await fetch('/api/email/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': process.env.NEXT_PUBLIC_CSRF_TOKEN || '',
        },
        body: JSON.stringify({
          email,
          consent: { consentMarketing: consent, consentUpdates: true },
          invoiceData,
          pdfBase64,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send invoice');
      }
    } catch (e: any) {
      setModalError(e.message || 'Failed to send invoice.');
      throw e;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Canadian Invoice Generator</h1>
              <p className="text-gray-600">CRA-compliant professional invoicing</p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Save Draft
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Form */}
          <div className="space-y-6">
            {/* Contractor Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                Contractor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={invoiceData.contractor.businessName}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      contractor: { ...invoiceData.contractor, businessName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST/HST Number</label>
                  <input
                    type="text"
                    value={invoiceData.contractor.gstNumber}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      contractor: { ...invoiceData.contractor, gstNumber: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123456789RT0001"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={invoiceData.contractor.address}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      contractor: { ...invoiceData.contractor, address: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={invoiceData.contractor.city}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      contractor: { ...invoiceData.contractor, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <select
                    value={invoiceData.contractor.province}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      contractor: { ...invoiceData.contractor, province: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(CANADIAN_PROVINCES).map(([code, info]) => (
                      <option key={code} value={code}>{info.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Invoice Line Items
                </h3>
                <button
                  onClick={addLineItem}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
              
              <div className="space-y-3">
                {invoiceData.lineItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end border-b border-gray-100 pb-3">
                    <div className="col-span-5">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rate</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                      <div className="px-2 py-1 bg-gray-50 border border-gray-300 rounded text-sm">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => deleteLineItem(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalculatorIcon className="h-5 w-5 mr-2" />
                Tax Calculation - {CANADIAN_PROVINCES[invoiceData.client.province as keyof typeof CANADIAN_PROVINCES]?.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.gstAmount > 0 && (
                  <div className="flex justify-between">
                    <span>GST ({totals.taxInfo.gst}%):</span>
                    <span>${totals.gstAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.pstAmount > 0 && (
                  <div className="flex justify-between">
                    <span>PST ({totals.taxInfo.pst}%):</span>
                    <span>${totals.pstAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.hstAmount > 0 && (
                  <div className="flex justify-between">
                    <span>HST ({totals.taxInfo.hst}%):</span>
                    <span>${totals.hstAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-blue-600">{invoiceData.contractor.businessName}</h1>
                    <div className="text-sm text-gray-600 mt-2">
                      <p>{invoiceData.contractor.address}</p>
                      <p>{invoiceData.contractor.city}, {invoiceData.contractor.province} {invoiceData.contractor.postalCode}</p>
                      <p>Phone: {invoiceData.contractor.phone}</p>
                      <p>Email: {invoiceData.contractor.email}</p>
                      {invoiceData.contractor.gstNumber && (
                        <p className="font-medium">GST/HST: {invoiceData.contractor.gstNumber}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                    <div className="text-sm text-gray-600 mt-2">
                      <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
                      <p><strong>Date:</strong> {new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>
                      <p><strong>Due Date:</strong> {new Date(invoiceData.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Bill To & Project Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">BILL TO:</h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{invoiceData.client.companyName}</p>
                      <p>{invoiceData.client.address}</p>
                      <p>{invoiceData.client.city}, {invoiceData.client.province} {invoiceData.client.postalCode}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">PROJECT:</h3>
                    <div className="text-sm text-gray-600">
                      <p><strong>Project:</strong> {invoiceData.project.name}</p>
                      <p><strong>AFE Code:</strong> {invoiceData.project.afeCode}</p>
                      <p><strong>Work Order:</strong> {invoiceData.project.workOrderRef}</p>
                      <p><strong>Period:</strong> {invoiceData.project.workPeriod}</p>
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.lineItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-2">{item.description}</td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">${item.rate.toFixed(2)}</td>
                          <td className="text-right py-2">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${totals.subtotal.toFixed(2)}</span>
                      </div>
                      {totals.gstAmount > 0 && (
                        <div className="flex justify-between">
                          <span>GST ({totals.taxInfo.gst}%):</span>
                          <span>${totals.gstAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {totals.pstAmount > 0 && (
                        <div className="flex justify-between">
                          <span>PST ({totals.taxInfo.pst}%):</span>
                          <span>${totals.pstAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {totals.hstAmount > 0 && (
                        <div className="flex justify-between">
                          <span>HST ({totals.taxInfo.hst}%):</span>
                          <span>${totals.hstAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-1 flex justify-between font-bold text-lg">
                        <span>TOTAL:</span>
                        <span>${totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">
                    <p><strong>Payment Terms:</strong> {invoiceData.paymentTerms}</p>
                    <p className="mt-2">{invoiceData.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            onClick={() => handleOpenModal('download')}
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download PDF
          </button>
          <button
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => handleOpenModal('email')}
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Email Invoice
          </button>
          <button className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print
          </button>
        </div>
      </div>
      {/* Email Collection Modal */}
      <EmailCollectionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        invoiceData={{
          contractorName: invoiceData.contractor.businessName,
          contractorAddress: invoiceData.contractor.address,
          contractorCity: invoiceData.contractor.city,
          contractorProvince: invoiceData.contractor.province,
          contractorPostal: invoiceData.contractor.postalCode,
          contractorPhone: invoiceData.contractor.phone,
          contractorEmail: invoiceData.contractor.email,
          gstNumber: invoiceData.contractor.gstNumber,
          clientName: invoiceData.client.companyName,
          clientAddress: invoiceData.client.address,
          clientCity: invoiceData.client.city,
          clientProvince: invoiceData.client.province,
          clientPostal: invoiceData.client.postalCode,
          clientEmail: '',
          invoiceNumber: invoiceData.invoiceNumber,
          invoiceDate: invoiceData.invoiceDate,
          dueDate: invoiceData.dueDate,
          projectDescription: invoiceData.project.name,
          lineItems: invoiceData.lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
          notes: invoiceData.notes,
        }}
        onEmailSubmit={handleEmailSubmit}
        onDownloadPDF={handleDownloadPDF}
        isGenerating={isGenerating}
        isSending={isSending}
      />
    </div>
  );
};

export default InvoiceGenerator; 