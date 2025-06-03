'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface WorkOrder {
  id: string;
  projectName: string;
  afeCode: string;
  client: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  dayRate: number;
  estimatedHours: number;
  completedHours: number;
  description: string;
  requirements: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  deadlines: {
    timesheet: string;
    invoice: string;
  };
}

const ActiveProjects = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const workOrders: WorkOrder[] = [
    {
      id: 'WO-24-0156',
      projectName: 'Montney Horizontal Well Program',
      afeCode: 'AFE-2024-001',
      client: 'Suncor Energy Services Inc.',
      location: 'Fort St. John, BC',
      startDate: '2024-06-01',
      endDate: '2024-06-14',
      status: 'active',
      priority: 'high',
      dayRate: 850,
      estimatedHours: 112,
      completedHours: 56,
      description: 'Senior drilling supervisor for horizontal well completion operations',
      requirements: [
        'H2S Alive Certification',
        'Fall Protection Training',
        'WHMIS Certification',
        'First Aid Level 1'
      ],
      contact: {
        name: 'Sarah Mitchell',
        phone: '(403) 555-0189',
        email: 'sarah.mitchell@suncor.com'
      },
      deadlines: {
        timesheet: '2024-06-07',
        invoice: '2024-06-15'
      }
    },
    {
      id: 'WO-24-0142',
      projectName: 'Pipeline Integrity Assessment',
      afeCode: 'AFE-2024-002',
      client: 'TC Energy Corporation',
      location: 'Grande Prairie, AB',
      startDate: '2024-06-10',
      endDate: '2024-06-24',
      status: 'pending',
      priority: 'medium',
      dayRate: 750,
      estimatedHours: 120,
      completedHours: 0,
      description: 'Pipeline inspection and integrity assessment services',
      requirements: [
        'Pipeline Inspection Certification',
        'Confined Space Entry',
        'OSSA Safety Training',
        'NDT Level II Certification'
      ],
      contact: {
        name: 'David Rodriguez',
        phone: '(780) 555-0234',
        email: 'david.rodriguez@tcenergy.com'
      },
      deadlines: {
        timesheet: '2024-06-14',
        invoice: '2024-06-25'
      }
    },
    {
      id: 'WO-24-0133',
      projectName: 'Well Site Maintenance',
      afeCode: 'AFE-2024-003',
      client: 'Husky Energy Inc.',
      location: 'Lloydminster, SK',
      startDate: '2024-05-28',
      endDate: '2024-06-03',
      status: 'completed',
      priority: 'low',
      dayRate: 650,
      estimatedHours: 48,
      completedHours: 52,
      description: 'Routine maintenance and equipment inspection',
      requirements: [
        'Basic Safety Orientation',
        'Equipment Operation License',
        'Environmental Awareness'
      ],
      contact: {
        name: 'Jennifer Kim',
        phone: '(306) 555-0156',
        email: 'jennifer.kim@huskyenergy.com'
      },
      deadlines: {
        timesheet: '2024-06-04',
        invoice: '2024-06-10'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <InformationCircleIcon className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const calculateProgress = (completed: number, estimated: number) => {
    return Math.round((completed / estimated) * 100);
  };

  const isDeadlineNear = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
          <p className="text-gray-600">Manage your current work assignments and deadlines</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
            {workOrders.filter(wo => wo.status === 'active').length} Active
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {workOrders.filter(wo => wo.status === 'pending').length} Pending
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-emerald-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-xl font-bold text-gray-900">$4,250</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Hours Logged</p>
              <p className="text-xl font-bold text-gray-900">42.5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-xl font-bold text-gray-900">{workOrders.filter(wo => wo.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Due Invoices</p>
              <p className="text-xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workOrders.map((workOrder, index) => (
          <motion.div
            key={workOrder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all ${
              selectedProject === workOrder.id ? 'ring-2 ring-emerald-500 shadow-md' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedProject(selectedProject === workOrder.id ? null : workOrder.id)}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getPriorityIcon(workOrder.priority)}
                  <h3 className="text-lg font-semibold text-gray-900">{workOrder.projectName}</h3>
                </div>
                <p className="text-sm text-gray-600">{workOrder.afeCode} • {workOrder.client}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(workOrder.status)}`}>
                {workOrder.status.charAt(0).toUpperCase() + workOrder.status.slice(1)}
              </span>
            </div>

            {/* Basic Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-2" />
                {workOrder.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {new Date(workOrder.startDate).toLocaleDateString()} - {new Date(workOrder.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                ${workOrder.dayRate}/day
              </div>
            </div>

            {/* Progress Bar */}
            {workOrder.status === 'active' && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">
                    {workOrder.completedHours}h / {workOrder.estimatedHours}h
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(workOrder.completedHours, workOrder.estimatedHours)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Deadlines Alert */}
            {(isDeadlineNear(workOrder.deadlines.timesheet) || isDeadlineNear(workOrder.deadlines.invoice)) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-900">Upcoming Deadlines</p>
                    {isDeadlineNear(workOrder.deadlines.timesheet) && (
                      <p className="text-yellow-700">Timesheet due: {new Date(workOrder.deadlines.timesheet).toLocaleDateString()}</p>
                    )}
                    {isDeadlineNear(workOrder.deadlines.invoice) && (
                      <p className="text-yellow-700">Invoice due: {new Date(workOrder.deadlines.invoice).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Expanded Details */}
            {selectedProject === workOrder.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-4 space-y-4"
              >
                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{workOrder.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {workOrder.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Project Contact</h4>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{workOrder.contact.name}</p>
                    <p>Phone: {workOrder.contact.phone}</p>
                    <p>Email: {workOrder.contact.email}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Log Time
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Create Invoice
                  </button>
                  <button className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                    Contact
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Trial Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trial Mode - Sample Data</h3>
            <p className="text-gray-600">
              This shows how your active projects will be organized and tracked. Connect your real work orders to see live data.
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Connect Data Source
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveProjects; 