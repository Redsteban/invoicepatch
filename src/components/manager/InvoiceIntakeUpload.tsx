'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  InboxIcon,
  DocumentArrowUpIcon,
  TableCellsIcon,
  CameraIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  BeakerIcon,
  SparklesIcon,
  BoltIcon,
  PhotoIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface IntakeMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  count: number;
  status: 'active' | 'processing' | 'inactive';
  processingTime: string;
}

export default function InvoiceIntakeUpload() {
  const [activeUpload, setActiveUpload] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const intakeMethods: IntakeMethod[] = [
    {
      id: 'email',
      name: 'Email Forwarding',
      description: 'invoices@trial.invoicepatch.com',
      icon: EnvelopeIcon,
      count: 47,
      status: 'active',
      processingTime: '~30 seconds'
    },
    {
      id: 'pdf',
      name: 'PDF Upload + OCR',
      description: 'Drag & drop PDF invoices for text extraction',
      icon: DocumentArrowUpIcon,
      count: 12,
      status: 'processing',
      processingTime: '~45 seconds'
    },
    {
      id: 'batch',
      name: 'CSV/Excel Batch',
      description: 'Upload multiple invoices from spreadsheet',
      icon: TableCellsIcon,
      count: 8,
      status: 'active',
      processingTime: '~2 minutes'
    },
    {
      id: 'photo',
      name: 'Mobile Photo OCR',
      description: 'Take photos of paper invoices',
      icon: CameraIcon,
      count: 15,
      status: 'active',
      processingTime: '~60 seconds'
    },
    {
      id: 'contractor',
      name: 'Direct Submissions',
      description: 'Contractors submit via mobile app',
      icon: UserGroupIcon,
      count: 23,
      status: 'active',
      processingTime: '~15 seconds'
    }
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      console.log('Processing file:', file.name);
      // Simulate processing
      setActiveUpload(file.name);
      setTimeout(() => setActiveUpload(null), 3000);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Forwarding Setup */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <EnvelopeIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Email Forwarding System</h3>
              <p className="text-sm text-gray-600">Automatic invoice processing from email</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-xs text-gray-500">invoices today</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                Email forwarding is active: <code className="bg-blue-100 px-2 py-1 rounded text-xs">invoices@trial.invoicepatch.com</code>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Forward invoices to this address for automatic OCR processing and data extraction
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">~30s</div>
            <div className="text-xs text-gray-500">Processing Time</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">94.2%</div>
            <div className="text-xs text-gray-500">OCR Accuracy</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">Auto</div>
            <div className="text-xs text-gray-500">Work Order Match</div>
          </div>
        </div>
      </div>

      {/* Intake Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {intakeMethods.slice(1).map((method) => (
          <motion.div
            key={method.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => method.id === 'pdf' && fileInputRef.current?.click()}
          >
            <div className="flex items-center justify-between mb-4">
              <method.icon className="h-8 w-8 text-indigo-600" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(method.status)}`}>
                {method.status}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">{method.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{method.description}</p>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-bold text-indigo-600">{method.count}</div>
                <div className="text-xs text-gray-500">processed today</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{method.processingTime}</div>
                <div className="text-xs text-gray-500">avg processing</div>
              </div>
            </div>

            {method.id === 'pdf' && (
              <div className="mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <PhotoIcon className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">Click to upload or drag files here</p>
              </div>
            )}

            {method.id === 'photo' && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="flex items-center">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-900">Mobile App Available</span>
                </div>
                <p className="text-xs text-purple-700 mt-1">Download the contractor mobile app for photo capture</p>
              </div>
            )}

            {method.id === 'contractor' && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-900">23 Active Contractors</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Direct submissions from mobile app</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Drag & Drop Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-indigo-400 bg-indigo-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {activeUpload ? `Processing: ${activeUpload}` : 'Drag & Drop Invoice Files'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Supports PDF, JPG, PNG, CSV, Excel files
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <CloudArrowUpIcon className="h-4 w-4 mr-2" />
          Choose Files
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Recent Processing Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Processing Activity</h3>
        <div className="space-y-3">
          {[
            { file: 'stack-testing-invoice-ST2024-001.pdf', method: 'Email', time: '2 minutes ago', status: 'completed' },
            { file: 'contractor-expenses-batch.xlsx', method: 'Excel Upload', time: '5 minutes ago', status: 'processing' },
            { file: 'mobile-photo-invoice.jpg', method: 'Mobile OCR', time: '8 minutes ago', status: 'completed' },
            { file: 'direct-submission-contractor-045.json', method: 'Mobile App', time: '12 minutes ago', status: 'completed' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.file}</p>
                  <p className="text-xs text-gray-500">{activity.method} • {activity.time}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                activity.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 