'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  project: string;
  afeCode: string;
  amount: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'paid' | 'overdue' | 'rejected';
  createdDate: string;
  dueDate: string;
  submittedDate?: string;
  paidDate?: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  workPeriod: string;
  paymentTerms: string;
  notes?: string;
}

const InvoiceManagement = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-156789',
      client: 'Suncor Energy Services Inc.',
      project: 'Montney Horizontal Well Program',
      afeCode: 'AFE-2024-001',
      amount: 9542.00,
      status: 'submitted',
      createdDate: '2024-06-01',
      dueDate: '2024-06-15',
      submittedDate: '2024-06-05',
      description: 'Week 1 drilling supervision services',
      priority: 'high',
      workPeriod: 'June 1-7, 2024',
      paymentTerms: 'Net 30 Days'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-156788',
      client: 'TC Energy Corporation',
      project: 'Pipeline Integrity Assessment',
      afeCode: 'AFE-2024-002',
      amount: 6750.00,
      status: 'approved',
      createdDate: '2024-05-28',
      dueDate: '2024-06-12',
      submittedDate: '2024-05-30',
      description: 'Pipeline inspection and assessment',
      priority: 'medium',
      workPeriod: 'May 20-27, 2024',
      paymentTerms: 'Net 15 Days'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-156787',
      client: 'Husky Energy Inc.',
      project: 'Well Site Maintenance',
      afeCode: 'AFE-2024-003',
      amount: 3380.00,
      status: 'paid',
      createdDate: '2024-05-20',
      dueDate: '2024-06-03',
      submittedDate: '2024-05-22',
      paidDate: '2024-06-01',
      description: 'Equipment maintenance and inspection',
      priority: 'low',
      workPeriod: 'May 13-19, 2024',
      paymentTerms: 'Net 14 Days'
    },
    {
      id: '4',
      invoiceNumber: 'DRAFT-001',
      client: 'Canadian Natural Resources',
      project: 'Drilling Operations Support',
      afeCode: 'AFE-2024-004',
      amount: 7200.00,
      status: 'draft',
      createdDate: '2024-06-06',
      dueDate: '2024-06-20',
      description: 'Week 2 drilling support services',
      priority: 'high',
      workPeriod: 'June 3-9, 2024',
      paymentTerms: 'Net 30 Days',
      notes: 'Waiting for timesheet approval'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2024-156785',
      client: 'Imperial Oil Limited',
      project: 'Safety Compliance Audit',
      afeCode: 'AFE-2024-005',
      amount: 4500.00,
      status: 'overdue',
      createdDate: '2024-05-01',
      dueDate: '2024-05-15',
      submittedDate: '2024-05-03',
      description: 'Safety audit and compliance review',
      priority: 'medium',
      workPeriod: 'April 22-28, 2024',
      paymentTerms: 'Net 14 Days'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'submitted':
        return <ClockIcon className="h-4 w-4" />;
      case 'under_review':
        return <EyeIcon className="h-4 w-4" />;
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'paid':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const filteredInvoices = filterStatus === 'all' 
    ? invoices 
    : invoices.filter(invoice => invoice.status === filterStatus);

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices.filter(inv => ['submitted', 'under_review', 'approved'].includes(inv.status)).reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  const handleDuplicate = (invoice: Invoice) => {
    console.log('Duplicating invoice:', invoice.invoiceNumber);
  };

  const handleDownload = (invoice: Invoice) => {
    console.log('Downloading invoice:', invoice.invoiceNumber);
  };

  const handleEmail = (invoice: Invoice) => {
    console.log('Emailing invoice:', invoice.invoiceNumber);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <p className="text-gray-600">Create, track, and manage your invoices</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
            <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
            Use Template
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Invoiced</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">${paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">${overdueAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Invoice List */}
        <div className="space-y-3">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                selectedInvoice === invoice.id ? 'ring-2 ring-emerald-500 shadow-md' : ''
              }`}
              onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1">{invoice.status.replace('_', ' ').charAt(0).toUpperCase() + invoice.status.replace('_', ' ').slice(1)}</span>
                    </span>
                    <h4 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.client}</p>
                      <p>{invoice.project}</p>
                      <p className="text-xs">{invoice.afeCode}</p>
                    </div>
                    <div>
                      <p><strong>Amount:</strong> ${invoice.amount.toLocaleString()}</p>
                      <p><strong>Period:</strong> {invoice.workPeriod}</p>
                      <p><strong>Terms:</strong> {invoice.paymentTerms}</p>
                    </div>
                    <div>
                      <p><strong>Created:</strong> {new Date(invoice.createdDate).toLocaleDateString()}</p>
                      <p><strong>Due:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                      {invoice.paidDate && (
                        <p><strong>Paid:</strong> {new Date(invoice.paidDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(invoice);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Download PDF"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmail(invoice);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Email Invoice"
                  >
                    <EnvelopeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(invoice);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Duplicate Invoice"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedInvoice === invoice.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 mt-4 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                      <p className="text-gray-600 mb-4">{invoice.description}</p>
                      
                      {invoice.notes && (
                        <>
                          <h5 className="font-semibold text-gray-900 mb-2">Notes</h5>
                          <p className="text-gray-600">{invoice.notes}</p>
                        </>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Timeline</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span>{new Date(invoice.createdDate).toLocaleDateString()}</span>
                        </div>
                        {invoice.submittedDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Submitted:</span>
                            <span>{new Date(invoice.submittedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                        {invoice.paidDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Paid:</span>
                            <span className="text-green-600 font-medium">{new Date(invoice.paidDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                      View Details
                    </button>
                    {invoice.status === 'draft' && (
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Submit Invoice
                      </button>
                    )}
                    <button className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                      Edit
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No invoices found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Quick Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
              <h4 className="font-medium text-gray-900 ml-2">Drilling Services</h4>
            </div>
            <p className="text-sm text-gray-600">Standard drilling supervision template with safety requirements</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <h4 className="font-medium text-gray-900 ml-2">Equipment Rental</h4>
            </div>
            <p className="text-sm text-gray-600">Equipment rental and operation services template</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              <h4 className="font-medium text-gray-900 ml-2">Consulting</h4>
            </div>
            <p className="text-sm text-gray-600">Professional consulting and advisory services template</p>
          </div>
        </div>
      </div>

      {/* Trial Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trial Mode - Sample Invoices</h3>
            <p className="text-gray-600">
              Experience the full invoice management workflow. These sample invoices show real-world scenarios you'll encounter.
            </p>
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Start Real Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement; 