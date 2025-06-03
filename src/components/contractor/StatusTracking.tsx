'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  EyeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface StatusUpdate {
  id: string;
  type: 'submission' | 'review' | 'approval' | 'payment' | 'message' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'attention_needed';
  relatedItem: {
    type: 'invoice' | 'timesheet' | 'expense' | 'project';
    id: string;
    name: string;
  };
  assignedTo?: {
    name: string;
    role: string;
    contact?: {
      email: string;
      phone: string;
    };
  };
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
}

const StatusTracking = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const statusUpdates: StatusUpdate[] = [
    {
      id: '1',
      type: 'approval',
      title: 'Invoice Approved - Ready for Payment',
      description: 'Invoice INV-2024-156789 has been approved by Sarah Mitchell and sent to accounting.',
      timestamp: '2024-06-05T14:30:00Z',
      status: 'completed',
      relatedItem: {
        type: 'invoice',
        id: 'INV-2024-156789',
        name: 'Montney Well Program - Week 1'
      },
      assignedTo: {
        name: 'Sarah Mitchell',
        role: 'Project Manager',
        contact: {
          email: 'sarah.mitchell@suncor.com',
          phone: '(403) 555-0189'
        }
      },
      priority: 'high'
    },
    {
      id: '2',
      type: 'review',
      title: 'Invoice Under Review',
      description: 'Invoice INV-2024-156788 is being reviewed by the project management team.',
      timestamp: '2024-06-05T09:15:00Z',
      status: 'in_progress',
      relatedItem: {
        type: 'invoice',
        id: 'INV-2024-156788',
        name: 'Pipeline Assessment - Week 1'
      },
      assignedTo: {
        name: 'David Rodriguez',
        role: 'Senior PM',
        contact: {
          email: 'david.rodriguez@tcenergy.com',
          phone: '(780) 555-0234'
        }
      },
      priority: 'medium'
    },
    {
      id: '3',
      type: 'message',
      title: 'Question About Equipment Charges',
      description: 'Jennifer Kim has a question about the equipment rental charges on your recent timesheet.',
      timestamp: '2024-06-04T16:45:00Z',
      status: 'attention_needed',
      relatedItem: {
        type: 'timesheet',
        id: 'TS-2024-001',
        name: 'Well Site Maintenance - Week 4'
      },
      assignedTo: {
        name: 'Jennifer Kim',
        role: 'Site Supervisor',
        contact: {
          email: 'jennifer.kim@huskyenergy.com',
          phone: '(306) 555-0156'
        }
      },
      priority: 'high',
      actionRequired: true
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Processed',
      description: 'Payment of $3,380.00 has been processed and will arrive via direct deposit within 2-3 business days.',
      timestamp: '2024-06-01T11:00:00Z',
      status: 'completed',
      relatedItem: {
        type: 'invoice',
        id: 'INV-2024-156787',
        name: 'Well Site Maintenance - May'
      },
      assignedTo: {
        name: 'Accounts Payable',
        role: 'Finance Team'
      },
      priority: 'medium'
    },
    {
      id: '5',
      type: 'submission',
      title: 'Timesheet Submitted',
      description: 'Your timesheet for the Montney project has been submitted and is awaiting approval.',
      timestamp: '2024-05-31T17:30:00Z',
      status: 'pending',
      relatedItem: {
        type: 'timesheet',
        id: 'TS-2024-002',
        name: 'Montney Well Program - Week 2'
      },
      priority: 'low'
    },
    {
      id: '6',
      type: 'notification',
      title: 'New Project Assignment',
      description: 'You have been assigned to a new project: Safety Compliance Audit starting June 10th.',
      timestamp: '2024-05-30T08:00:00Z',
      status: 'completed',
      relatedItem: {
        type: 'project',
        id: 'PROJ-2024-005',
        name: 'Safety Compliance Audit'
      },
      assignedTo: {
        name: 'Michael Thompson',
        role: 'Operations Manager',
        contact: {
          email: 'michael.thompson@imperial.com',
          phone: '(403) 555-0278'
        }
      },
      priority: 'medium'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'in_progress':
        return <ClockIcon className="h-6 w-6 text-blue-600" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-600" />;
      case 'attention_needed':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
      case 'review':
        return <EyeIcon className="h-5 w-5 text-purple-600" />;
      case 'approval':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'payment':
        return <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />;
      case 'message':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-600" />;
      case 'notification':
        return <BellIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredUpdates = filter === 'all' 
    ? statusUpdates 
    : statusUpdates.filter(update => update.type === filter);

  const urgentItems = statusUpdates.filter(update => 
    update.actionRequired || update.status === 'attention_needed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Status Tracking</h2>
          <p className="text-gray-600">Monitor your submissions and communications</p>
        </div>
        <div className="flex items-center gap-3">
          {urgentItems > 0 && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {urgentItems} requiring attention
            </div>
          )}
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <BellIcon className="h-5 w-5 mr-2" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-xl font-bold text-gray-900">
                {statusUpdates.filter(u => u.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {statusUpdates.filter(u => u.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Need Attention</p>
              <p className="text-xl font-bold text-gray-900">
                {statusUpdates.filter(u => u.status === 'attention_needed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Messages</p>
              <p className="text-xl font-bold text-gray-900">
                {statusUpdates.filter(u => u.type === 'message').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'all', name: 'All Updates', count: statusUpdates.length },
            { id: 'submission', name: 'Submissions', count: statusUpdates.filter(u => u.type === 'submission').length },
            { id: 'review', name: 'Reviews', count: statusUpdates.filter(u => u.type === 'review').length },
            { id: 'approval', name: 'Approvals', count: statusUpdates.filter(u => u.type === 'approval').length },
            { id: 'payment', name: 'Payments', count: statusUpdates.filter(u => u.type === 'payment').length },
            { id: 'message', name: 'Messages', count: statusUpdates.filter(u => u.type === 'message').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* Status Updates List */}
        <div className="space-y-4">
          {filteredUpdates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                update.actionRequired ? 'border-red-200 bg-red-50' : 'border-gray-200'
              } ${selectedItem === update.id ? 'ring-2 ring-emerald-500 shadow-md' : ''}`}
              onClick={() => setSelectedItem(selectedItem === update.id ? null : update.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(update.status)}
                  {getTypeIcon(update.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{update.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </span>
                    {update.actionRequired && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 border border-red-200">
                        Action Required
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-3">{update.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(update.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      {update.relatedItem.name}
                    </div>
                    {update.assignedTo && (
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {update.assignedTo.name} - {update.assignedTo.role}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedItem === update.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 mt-4 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Related Item Details</h5>
                      <div className="text-sm text-gray-600">
                        <p><strong>Type:</strong> {update.relatedItem.type}</p>
                        <p><strong>ID:</strong> {update.relatedItem.id}</p>
                        <p><strong>Name:</strong> {update.relatedItem.name}</p>
                      </div>
                    </div>

                    {update.assignedTo && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Contact Information</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Name:</strong> {update.assignedTo.name}</p>
                          <p><strong>Role:</strong> {update.assignedTo.role}</p>
                          {update.assignedTo.contact && (
                            <>
                              <div className="flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                <a href={`mailto:${update.assignedTo.contact.email}`} className="text-emerald-600 hover:text-emerald-700">
                                  {update.assignedTo.contact.email}
                                </a>
                              </div>
                              <div className="flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-1" />
                                <a href={`tel:${update.assignedTo.contact.phone}`} className="text-emerald-600 hover:text-emerald-700">
                                  {update.assignedTo.contact.phone}
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    {update.actionRequired && (
                      <button className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Take Action
                      </button>
                    )}
                    {update.assignedTo?.contact && (
                      <button className="bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                        Contact {update.assignedTo.name}
                      </button>
                    )}
                    <button className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                      View Related Item
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredUpdates.length === 0 && (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No status updates found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Trial Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trial Mode - Sample Status Updates</h3>
            <p className="text-gray-600">
              This shows how you'll track submission status and communications. Connect with real project managers to see live updates.
            </p>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Connect Live Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusTracking; 