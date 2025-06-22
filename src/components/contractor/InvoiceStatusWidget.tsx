'use client';

import { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Download,
  Send
} from 'lucide-react';

interface Invoice {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  submissionDate?: string;
  paymentDate?: string;
  amount: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid' | 'overdue';
  daysWorked: number;
  totalDays: number;
}

const InvoiceStatusWidget = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  // Mock invoice data
  const currentInvoice: Invoice = {
    id: 'inv-2024-01-15',
    period: 'Jan 15 - Jan 29, 2024',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    amount: 3367.50,
    status: 'draft',
    daysWorked: 8,
    totalDays: 10
  };

  const recentInvoices: Invoice[] = [
    {
      id: 'inv-2024-01-01',
      period: 'Jan 1 - Jan 14, 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      submissionDate: '2024-01-15',
      paymentDate: '2024-01-22',
      amount: 4250.00,
      status: 'paid',
      daysWorked: 10,
      totalDays: 10
    },
    {
      id: 'inv-2023-12-15',
      period: 'Dec 15 - Dec 31, 2023',
      startDate: '2023-12-15',
      endDate: '2023-12-31',
      submissionDate: '2024-01-01',
      paymentDate: '2024-01-08',
      amount: 3825.00,
      status: 'paid',
      daysWorked: 9,
      totalDays: 10
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(currentInvoice.endDate);
    deadline.setDate(deadline.getDate() + 3); // 3 days after period end
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'submitted': return <Send className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'paid': return <DollarSign className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = (invoice: Invoice) => {
    return (invoice.daysWorked / invoice.totalDays) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Current Invoice Status */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Invoice</h3>
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentInvoice.status)}`}>
            {getStatusIcon(currentInvoice.status)}
            <span className="capitalize">{currentInvoice.status}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invoice Details */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Period</p>
              <p className="text-lg font-semibold text-gray-900">{currentInvoice.period}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Current Amount</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(currentInvoice.amount)}</p>
              <p className="text-sm text-gray-500">
                {currentInvoice.daysWorked} of {currentInvoice.totalDays} days worked
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{getProgressPercentage(currentInvoice).toFixed(0)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getProgressPercentage(currentInvoice)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline & Actions */}
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">Submission Deadline</span>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                {getDaysUntilDeadline()} days
              </p>
              <p className="text-sm text-orange-600">
                Submit by {formatDate(new Date(new Date(currentInvoice.endDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString())}
              </p>
            </div>

            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview Invoice</span>
              </button>
              
              <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Submit Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Timeline */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Timeline</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-semibold text-sm">1</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Work Period Ends</p>
              <p className="text-sm text-gray-600">{formatDate(currentInvoice.endDate)}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="ml-4 border-l-2 border-gray-200 h-6"></div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">2</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Submit Invoice</p>
              <p className="text-sm text-gray-600">
                Due: {formatDate(new Date(new Date(currentInvoice.endDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString())}
              </p>
            </div>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>

          <div className="ml-4 border-l-2 border-gray-200 h-6"></div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">3</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-500">Processing & Approval</p>
              <p className="text-sm text-gray-400">2-3 business days</p>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
          </div>

          <div className="ml-4 border-l-2 border-gray-200 h-6"></div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">4</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-500">Payment Issued</p>
              <p className="text-sm text-gray-400">
                Expected: {formatDate(new Date(new Date(currentInvoice.endDate).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString())}
              </p>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h3>
        
        <div className="space-y-3">
          {recentInvoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${getStatusColor(invoice.status).replace('border-', 'bg-').replace('text-', '').replace('bg-', 'bg-opacity-20 bg-')}`}>
                  {getStatusIcon(invoice.status)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{invoice.period}</p>
                  <p className="text-sm text-gray-600">
                    {invoice.daysWorked}/{invoice.totalDays} days • {formatCurrency(invoice.amount)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                  <span className="capitalize">{invoice.status}</span>
                </span>
                
                {invoice.status === 'paid' && (
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Invoices →
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(recentInvoices.reduce((sum, inv) => sum + inv.amount, 0) + currentInvoice.amount)}
          </div>
          <div className="text-sm text-gray-600">Total This Quarter</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">
            {recentInvoices.filter(inv => inv.status === 'paid').length}
          </div>
          <div className="text-sm text-gray-600">Paid Invoices</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-600">7</div>
          <div className="text-sm text-gray-600">Avg Days to Pay</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-600">100%</div>
          <div className="text-sm text-gray-600">Payment Rate</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusWidget; 