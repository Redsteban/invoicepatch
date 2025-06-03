'use client';

import { motion } from 'framer-motion';
import {
  DocumentArrowUpIcon,
  TableCellsIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface WorkOrder {
  id: string;
  projectName: string;
  afeCode: string;
  contractor: string;
  dayRate: number;
  startDate: string;
  endDate: string;
  location: string;
  projectCode: string;
  status: 'active' | 'completed' | 'pending';
  totalValue: number;
}

const WorkOrderUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-2024-001',
      projectName: 'Montney Horizontal Drilling Program',
      afeCode: 'AFE-2024-MT-001',
      contractor: 'Superior Drilling Services',
      dayRate: 2500,
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      location: 'Dawson Creek, BC',
      projectCode: 'MONT-H-001',
      status: 'active',
      totalValue: 37500
    },
    {
      id: 'WO-2024-002',
      projectName: 'Pipeline Integrity Assessment',
      afeCode: 'AFE-2024-PI-002',
      contractor: 'TC Energy Solutions',
      dayRate: 1800,
      startDate: '2024-03-05',
      endDate: '2024-03-20',
      location: 'Fort St. John, BC',
      projectCode: 'PIPE-INT-002',
      status: 'active',
      totalValue: 28800
    },
    {
      id: 'WO-2024-003',
      projectName: 'Well Site Maintenance',
      afeCode: 'AFE-2024-WM-003',
      contractor: 'Husky Energy Services',
      dayRate: 1200,
      startDate: '2024-02-20',
      endDate: '2024-03-01',
      location: 'Grande Prairie, AB',
      projectCode: 'WELL-MNT-003',
      status: 'completed',
      totalValue: 12000
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files);
    
    // Simulate processing uploaded files
    // In real implementation, this would parse CSV and extract work orders
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles(files);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Manager Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Manager Work Order Upload</h3>
            <p className="text-blue-800 mb-4">
              Upload your project data from ERP systems (SAP, JDE, Oracle) via CSV. This data will be automatically 
              synced to contractor mobile apps for accurate invoice creation.
            </p>
            <div className="bg-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Why Bulk Upload?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensures contractors use exact AFE codes, rates, and project details</li>
                <li>• Eliminates manual data entry errors and reconciliation time</li>
                <li>• Maintains single source of truth from your ERP system</li>
                <li>• Enables automatic invoice validation and faster approvals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center mb-4">
          <CloudArrowUpIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">CSV Upload</h3>
        </div>

        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200"
        >
          <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Drop your work order CSV files here
          </h4>
          <p className="text-gray-600 mb-4">
            Or click to browse for files. Supports CSV exports from SAP, JDE, Oracle, and other ERP systems.
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors duration-200"
          >
            Choose Files
          </label>
        </div>

        {/* File Upload Status */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">{file.name}</span>
                </div>
                <span className="text-xs text-green-600">Ready to process</span>
              </div>
            ))}
          </div>
        )}

        {/* CSV Format Requirements */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Required CSV Columns:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="font-medium text-gray-900">Project Information</div>
              <ul className="mt-2 text-gray-600 space-y-1">
                <li>• Project Name</li>
                <li>• AFE Code</li>
                <li>• Project Code</li>
                <li>• Location</li>
              </ul>
            </div>
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="font-medium text-gray-900">Contract Details</div>
              <ul className="mt-2 text-gray-600 space-y-1">
                <li>• Contractor Name</li>
                <li>• Day Rate</li>
                <li>• Start Date</li>
                <li>• End Date</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ERP Integration Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center mb-4">
          <TableCellsIcon className="h-6 w-6 text-emerald-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">ERP System Integration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-900 mb-2">SAP Integration</h4>
            <p className="text-sm text-emerald-800">
              Direct sync with SAP modules including CO (Controlling) and PS (Project Systems)
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">JD Edwards</h4>
            <p className="text-sm text-blue-800">
              Real-time work order sync from JDE Project Management and Job Cost modules
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Oracle ERP</h4>
            <p className="text-sm text-purple-800">
              Automated data flow from Oracle Project Portfolio Management
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Contact us to set up automatic ERP sync →
          </button>
        </div>
      </motion.div>

      {/* Current Work Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Work Orders</h3>
          <span className="text-sm text-gray-600">{workOrders.length} total projects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AFE Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contractor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workOrders.map((workOrder) => (
                <tr key={workOrder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{workOrder.projectName}</div>
                      <div className="text-sm text-gray-500">{workOrder.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workOrder.afeCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workOrder.contractor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${workOrder.dayRate.toLocaleString()}/day
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workOrder.status)}`}>
                      {workOrder.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${workOrder.totalValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-sm text-emerald-800 font-medium">
              All work order data is automatically synced to contractor mobile apps
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkOrderUpload; 