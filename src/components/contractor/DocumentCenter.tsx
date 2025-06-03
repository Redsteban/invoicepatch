'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PlusIcon,
  CameraIcon,
  ClockIcon,
  TagIcon,
  FunnelIcon,
  CloudArrowUpIcon,
  ArchiveBoxIcon,
  DocumentArrowUpIcon,
  PrinterIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'work_order' | 'tax_document' | 'certificate' | 'contract';
  category: string;
  project?: string;
  client?: string;
  amount?: number;
  date: string;
  size: string;
  format: string;
  status: 'uploaded' | 'processing' | 'verified' | 'archived';
  tags: string[];
  starred: boolean;
  description?: string;
}

const DocumentCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const documents: Document[] = [
    {
      id: '1',
      name: 'INV-2024-156789.pdf',
      type: 'invoice',
      category: 'Invoices',
      project: 'Montney Horizontal Well Program',
      client: 'Suncor Energy',
      amount: 9542.00,
      date: '2024-06-05',
      size: '2.4 MB',
      format: 'PDF',
      status: 'verified',
      tags: ['2024', 'suncor', 'drilling', 'q2'],
      starred: true,
      description: 'Week 1 drilling supervision services'
    },
    {
      id: '2',
      name: 'Hotel_Receipt_June_2024.jpg',
      type: 'receipt',
      category: 'Travel Expenses',
      project: 'Montney Horizontal Well Program',
      amount: 450.00,
      date: '2024-06-03',
      size: '1.8 MB',
      format: 'JPG',
      status: 'verified',
      tags: ['2024', 'travel', 'accommodation', 'deductible'],
      starred: false,
      description: 'Hotel accommodation for project work'
    },
    {
      id: '3',
      name: 'WO-24-0156_Work_Order.pdf',
      type: 'work_order',
      category: 'Work Orders',
      project: 'Montney Horizontal Well Program',
      client: 'Suncor Energy',
      date: '2024-05-28',
      size: '856 KB',
      format: 'PDF',
      status: 'archived',
      tags: ['2024', 'suncor', 'work-order', 'signed'],
      starred: false,
      description: 'Signed work order agreement'
    },
    {
      id: '4',
      name: 'Fuel_Receipt_Shell_June_2024.pdf',
      type: 'receipt',
      category: 'Vehicle Expenses',
      amount: 78.50,
      date: '2024-06-02',
      size: '124 KB',
      format: 'PDF',
      status: 'verified',
      tags: ['2024', 'fuel', 'vehicle', 'deductible'],
      starred: false,
      description: 'Fuel for project travel'
    },
    {
      id: '5',
      name: 'H2S_Alive_Certificate_2024.pdf',
      type: 'certificate',
      category: 'Certifications',
      date: '2024-01-15',
      size: '445 KB',
      format: 'PDF',
      status: 'verified',
      tags: ['2024', 'safety', 'certification', 'h2s'],
      starred: true,
      description: 'H2S Alive Safety Certification'
    },
    {
      id: '6',
      name: 'T4A_Tax_Form_2023.pdf',
      type: 'tax_document',
      category: 'Tax Documents',
      date: '2024-02-28',
      size: '678 KB',
      format: 'PDF',
      status: 'archived',
      tags: ['2023', 'tax', 'cra', 'important'],
      starred: true,
      description: '2023 T4A Statement of Pension, Retirement, Annuity'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <DocumentTextIcon className="h-6 w-6 text-emerald-600" />;
      case 'receipt':
        return <DocumentArrowUpIcon className="h-6 w-6 text-blue-600" />;
      case 'work_order':
        return <FolderIcon className="h-6 w-6 text-purple-600" />;
      case 'tax_document':
        return <ArchiveBoxIcon className="h-6 w-6 text-orange-600" />;
      case 'certificate':
        return <DocumentTextIcon className="h-6 w-6 text-yellow-600" />;
      case 'contract':
        return <DocumentTextIcon className="h-6 w-6 text-gray-600" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const documentStats = {
    total: documents.length,
    invoices: documents.filter(d => d.type === 'invoice').length,
    receipts: documents.filter(d => d.type === 'receipt').length,
    workOrders: documents.filter(d => d.type === 'work_order').length,
    taxDocs: documents.filter(d => d.type === 'tax_document').length,
    totalSize: documents.reduce((acc, doc) => acc + parseFloat(doc.size), 0).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Center</h2>
          <p className="text-gray-600">Organize and manage your business documents</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
            <CameraIcon className="h-5 w-5 mr-2" />
            Scan Receipt
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-center">
            <DocumentTextIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{documentStats.total}</p>
            <p className="text-sm text-gray-600">Total Documents</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-center">
            <DocumentTextIcon className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{documentStats.invoices}</p>
            <p className="text-sm text-gray-600">Invoices</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-center">
            <DocumentArrowUpIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{documentStats.receipts}</p>
            <p className="text-sm text-gray-600">Receipts</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-center">
            <FolderIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{documentStats.workOrders}</p>
            <p className="text-sm text-gray-600">Work Orders</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-center">
            <ArchiveBoxIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{documentStats.taxDocs}</p>
            <p className="text-sm text-gray-600">Tax Docs</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-center">
            <ArchiveBoxIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{documentStats.totalSize} MB</p>
            <p className="text-sm text-gray-600">Storage Used</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents, descriptions, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoices</option>
              <option value="receipt">Receipts</option>
              <option value="work_order">Work Orders</option>
              <option value="tax_document">Tax Documents</option>
              <option value="certificate">Certificates</option>
              <option value="contract">Contracts</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {sortedDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(doc.type)}
                    {doc.starred && <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{doc.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        {doc.description && <p className="mb-1">{doc.description}</p>}
                        {doc.project && <p><strong>Project:</strong> {doc.project}</p>}
                        {doc.client && <p><strong>Client:</strong> {doc.client}</p>}
                      </div>
                      <div>
                        <p><strong>Date:</strong> {new Date(doc.date).toLocaleDateString()}</p>
                        <p><strong>Format:</strong> {doc.format} • {doc.size}</p>
                        {doc.amount && <p><strong>Amount:</strong> ${doc.amount.toLocaleString()}</p>}
                      </div>
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                            >
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="View">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Download">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Print">
                    <PrinterIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {sortedDocuments.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents found matching your criteria.</p>
            <button className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload Your First Document
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CRA Tax Package</h3>
          <p className="text-sm text-gray-600 mb-4">
            Automatically organize tax-deductible expenses and generate CRA-ready documentation.
          </p>
          <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
            Generate Tax Package
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Archive</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create secure backups of your documents and archive completed projects.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Create Backup
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Organization</h3>
          <p className="text-sm text-gray-600 mb-4">
            AI-powered document categorization and automatic tagging system.
          </p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            Auto-Organize
          </button>
        </div>
      </div>

      {/* Trial Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trial Mode - Sample Documents</h3>
            <p className="text-gray-600">
              Experience document management with sample files. Upload your real documents to see the full organizational power.
            </p>
          </div>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
            Upload Real Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCenter; 