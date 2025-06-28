'use client';

import { useState, useEffect } from 'react';
import { useContractor } from '@/contexts/ContractorContext';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Target,
  Zap
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  clientName: string;
  description: string;
}

export default function InvoiceStatusWidget() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      date: '2024-06-15',
      dueDate: '2024-06-30',
      amount: 3247.50,
      status: 'pending',
      clientName: 'Acme Energy Ltd.',
      description: 'Week 1 - Foundation work'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      date: '2024-06-22',
      dueDate: '2024-07-07',
      amount: 3897.00,
      status: 'pending',
      clientName: 'Acme Energy Ltd.',
      description: 'Week 2 - Equipment setup'
    }
  ]);

  const { 
    dashboard,
    isSimulationMode, 
    simulationDay
  } = useContractor();

  const simulationInvoiceData = isSimulationMode ? {
    pendingInvoices: Math.floor(simulationDay / 7), // Weekly invoices
    paidInvoices: simulationDay >= 10 ? 1 : 0, // First payment on day 10
    totalOutstanding: simulationDay >= 7 ? (simulationDay >= 10 ? 0 : 3247.50) : 0,
    nextPaymentDue: simulationDay >= 7 ? '2024-06-28' : null
  } : null;

  const displayData = isSimulationMode ? simulationInvoiceData : dashboard;

  const getTotalOutstanding = () => {
    return invoices
      .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getTotalPaid = () => {
    return invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getPendingCount = () => {
    return invoices.filter(invoice => invoice.status === 'pending').length;
  };

  const getOverdueCount = () => {
    return invoices.filter(invoice => invoice.status === 'overdue').length;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {isSimulationMode && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded p-3">
          <span className="text-green-800 font-medium text-sm">
            💰 Simulation Invoices
          </span>
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Pending:</span>
          <span className="font-semibold">
            {isSimulationMode ? simulationInvoiceData?.pendingInvoices : getPendingCount()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Paid:</span>
          <span className="font-semibold text-green-600">
            {isSimulationMode ? simulationInvoiceData?.paidInvoices : getTotalPaid().toFixed(0)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Outstanding:</span>
          <span className="font-semibold">
            ${(isSimulationMode ? (simulationInvoiceData?.totalOutstanding || 0) : getTotalOutstanding()).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Show simulation milestones */}
      {isSimulationMode && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs space-y-1">
            <div className={`flex justify-between ${simulationDay >= 7 ? 'text-green-600' : 'text-gray-400'}`}>
              <span>Week 1 Invoice</span>
              <span>{simulationDay >= 7 ? '✓' : '○'}</span>
            </div>
            <div className={`flex justify-between ${simulationDay >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
              <span>First Payment</span>
              <span>{simulationDay >= 10 ? '✓' : '○'}</span>
            </div>
            <div className={`flex justify-between ${simulationDay >= 15 ? 'text-green-600' : 'text-gray-400'}`}>
              <span>Final Invoice</span>
              <span>{simulationDay >= 15 ? '✓' : '○'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Invoices</h4>
        <div className="space-y-3">
          {invoices.slice(0, 3).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  invoice.status === 'paid' ? 'bg-green-100' : 
                  invoice.status === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <FileText className={`w-4 h-4 ${
                    invoice.status === 'paid' ? 'text-green-600' : 
                    invoice.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">{invoice.description}</p>
                  <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Eye className="w-4 h-4" />
            <span>View All</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Payment Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${getTotalPaid().toLocaleString()}
            </div>
            <div className="text-sm text-green-700">Total Paid</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              ${getTotalOutstanding().toLocaleString()}
            </div>
            <div className="text-sm text-yellow-700">Outstanding</div>
          </div>
        </div>
      </div>

      {/* Next Payment Info */}
      {isSimulationMode && simulationInvoiceData?.nextPaymentDue && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Next Payment Due</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">{simulationInvoiceData.nextPaymentDue}</p>
        </div>
      )}
    </div>
  );
} 