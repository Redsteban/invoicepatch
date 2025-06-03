'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  BeakerIcon,
  CloudArrowUpIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PhotoIcon,
  ClipboardIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Types
interface Project {
  id: string;
  name: string;
  internalCode: string;
  description: string;
  location: string;
  startDate: string;
  estimatedDuration: number;
  budgetLimit: number;
  billingCycle: 'weekly' | 'bi-weekly' | 'monthly';
  specialRequirements: string;
  status: 'active' | 'pending' | 'completed';
}

interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  defaultDayRate: number;
  overtimeMultiplier: number;
  specialization: string;
  availability: 'available' | 'busy' | 'unavailable';
}

interface RateStructure {
  id: string;
  projectType: string;
  contractorId: string;
  dayRate: number;
  equipmentRate: number;
  travelRate: number;
  overtimeMultiplier: number;
  specialRates: Record<string, number>;
}

interface WorkOrder {
  id: string;
  projectId: string;
  contractorIds: string[];
  startDate: string;
  endDate: string;
  approvedRates: Record<string, number>;
  instructions: string;
  submissionDeadline: string;
  status: 'draft' | 'active' | 'submitted' | 'approved';
}

const AdminSetup = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [rates, setRates] = useState<RateStructure[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  // Sample data for trial
  const loadSampleData = () => {
    const sampleProjects: Project[] = [
      {
        id: '1',
        name: 'Montney Horizontal Well Program',
        internalCode: 'AFE-2024-001',
        description: 'Multi-well horizontal drilling program in Montney formation',
        location: 'Fort St. John, BC',
        startDate: '2024-06-01',
        estimatedDuration: 90,
        budgetLimit: 2500000,
        billingCycle: 'weekly',
        specialRequirements: 'H2S safety certification required, 24/7 operations',
        status: 'active'
      },
      {
        id: '2',
        name: 'Pipeline Integrity Assessment',
        internalCode: 'AFE-2024-002',
        description: 'Comprehensive pipeline inspection and maintenance',
        location: 'Grande Prairie, AB',
        startDate: '2024-06-15',
        estimatedDuration: 45,
        budgetLimit: 850000,
        billingCycle: 'bi-weekly',
        specialRequirements: 'Confined space entry, specialized inspection equipment',
        status: 'pending'
      }
    ];

    const sampleContractors: Contractor[] = [
      {
        id: '1',
        name: 'Mike Thompson',
        email: 'mike@thunderoilfield.com',
        phone: '(780) 555-0123',
        company: 'Thunder Oilfield Services',
        defaultDayRate: 850,
        overtimeMultiplier: 1.5,
        specialization: 'Drilling Operations',
        availability: 'available'
      },
      {
        id: '2',
        name: 'Sarah Rodriguez',
        email: 'sarah@precisionwireline.ca',
        phone: '(403) 555-0456',
        company: 'Precision Wireline',
        defaultDayRate: 1200,
        overtimeMultiplier: 1.75,
        specialization: 'Wireline Services',
        availability: 'available'
      },
      {
        id: '3',
        name: 'David Chen',
        email: 'david@northstarcoil.com',
        phone: '(250) 555-0789',
        company: 'NorthStar Coil Tubing',
        defaultDayRate: 950,
        overtimeMultiplier: 1.5,
        specialization: 'Coil Tubing Operations',
        availability: 'busy'
      }
    ];

    setProjects(sampleProjects);
    setContractors(sampleContractors);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const tabs = [
    { id: 'projects', name: 'Projects', icon: BuildingOfficeIcon },
    { id: 'contractors', name: 'Contractors', icon: UserGroupIcon },
    { id: 'rates', name: 'Rate Structure', icon: CurrencyDollarIcon },
    { id: 'workorders', name: 'Work Orders', icon: ClipboardDocumentListIcon },
    { id: 'firespark', name: 'FireSpark Import', icon: CloudArrowUpIcon },
    { id: 'export', name: 'Data Export', icon: ArrowDownTrayIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Setup - Trial Configuration</h1>
              <p className="text-gray-600">Configure your work order data for testing InvoicePatch</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadSampleData}
                className="inline-flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <BeakerIcon className="h-5 w-5 mr-2" />
                Load Sample Data
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export Setup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mx-4 mt-4"
          >
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-emerald-800 font-medium">Sample data loaded successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'projects' && <ProjectSetup projects={projects} setProjects={setProjects} />}
          {activeTab === 'contractors' && <ContractorManagement contractors={contractors} setContractors={setContractors} />}
          {activeTab === 'rates' && <RateStructureSetup rates={rates} setRates={setRates} contractors={contractors} projects={projects} />}
          {activeTab === 'workorders' && <WorkOrderCreation workOrders={workOrders} setWorkOrders={setWorkOrders} projects={projects} contractors={contractors} />}
          {activeTab === 'firespark' && <FireSparkImport projects={projects} setProjects={setProjects} workOrders={workOrders} setWorkOrders={setWorkOrders} />}
          {activeTab === 'export' && <DataExportHelper projects={projects} contractors={contractors} workOrders={workOrders} />}
        </div>
      </div>
    </div>
  );
};

// Project Setup Component
const ProjectSetup = ({ projects, setProjects }: { projects: Project[], setProjects: (projects: Project[]) => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name || '',
      internalCode: formData.internalCode || '',
      description: formData.description || '',
      location: formData.location || '',
      startDate: formData.startDate || '',
      estimatedDuration: formData.estimatedDuration || 0,
      budgetLimit: formData.budgetLimit || 0,
      billingCycle: formData.billingCycle || 'weekly',
      specialRequirements: formData.specialRequirements || '',
      status: 'pending'
    };
    setProjects([...projects, newProject]);
    setFormData({});
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Project Setup</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Project
        </button>
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Project</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Montney Horizontal Well Program"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Internal Code</label>
                      <input
                        type="text"
                        required
                        value={formData.internalCode || ''}
                        onChange={(e) => setFormData({ ...formData, internalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="AFE-2024-001"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Multi-well horizontal drilling program..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Fort St. John, BC"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                      <input
                        type="number"
                        value={formData.estimatedDuration || ''}
                        onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="90"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget Limit</label>
                      <input
                        type="number"
                        value={formData.budgetLimit || ''}
                        onChange={(e) => setFormData({ ...formData, budgetLimit: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="2500000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                      <select
                        value={formData.billingCycle || 'weekly'}
                        onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as 'weekly' | 'bi-weekly' | 'monthly' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                    <textarea
                      value={formData.specialRequirements || ''}
                      onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="H2S safety certification required, 24/7 operations..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.internalCode}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>Location:</strong> {project.location}</p>
              <p><strong>Duration:</strong> {project.estimatedDuration} days</p>
              <p><strong>Budget:</strong> ${project.budgetLimit.toLocaleString()}</p>
              <p><strong>Billing:</strong> {project.billingCycle}</p>
            </div>

            {project.description && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{project.description}</p>
            )}

            <div className="mt-4 flex gap-2">
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Edit</button>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No projects yet. Add your first project to get started.</p>
        </div>
      )}
    </div>
  );
};

// Contractor Management Component
const ContractorManagement = ({ contractors, setContractors }: { contractors: Contractor[], setContractors: (contractors: Contractor[]) => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Contractor>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContractor: Contractor = {
      id: Date.now().toString(),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      company: formData.company || '',
      defaultDayRate: formData.defaultDayRate || 0,
      overtimeMultiplier: formData.overtimeMultiplier || 1.5,
      specialization: formData.specialization || '',
      availability: 'available'
    };
    setContractors([...contractors, newContractor]);
    setFormData({});
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Contractor Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Contractor
        </button>
      </div>

      {/* Contractor Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Contractor</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Mike Thompson"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="mike@thunderoilfield.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="(780) 555-0123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Thunder Oilfield Services"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <select
                      value={formData.specialization || ''}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select specialization</option>
                      <option value="Drilling Operations">Drilling Operations</option>
                      <option value="Wireline Services">Wireline Services</option>
                      <option value="Coil Tubing Operations">Coil Tubing Operations</option>
                      <option value="Pressure Pumping">Pressure Pumping</option>
                      <option value="Pipeline Services">Pipeline Services</option>
                      <option value="Heavy Equipment">Heavy Equipment</option>
                      <option value="Welding & Fabrication">Welding & Fabrication</option>
                      <option value="Safety & Environmental">Safety & Environmental</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Day Rate ($)</label>
                      <input
                        type="number"
                        value={formData.defaultDayRate || ''}
                        onChange={(e) => setFormData({ ...formData, defaultDayRate: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="850"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.overtimeMultiplier || ''}
                        onChange={(e) => setFormData({ ...formData, overtimeMultiplier: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="1.5"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                      Add Contractor
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contractors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contractors.map((contractor) => (
          <motion.div
            key={contractor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{contractor.name}</h3>
                <p className="text-sm text-gray-600">{contractor.company}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                contractor.availability === 'available' ? 'bg-emerald-100 text-emerald-800' :
                contractor.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {contractor.availability}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {contractor.email}</p>
              <p><strong>Phone:</strong> {contractor.phone}</p>
              <p><strong>Specialization:</strong> {contractor.specialization}</p>
              <p><strong>Day Rate:</strong> ${contractor.defaultDayRate}</p>
              <p><strong>OT Multiplier:</strong> {contractor.overtimeMultiplier}x</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Edit</button>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {contractors.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No contractors yet. Add your first contractor to get started.</p>
        </div>
      )}
    </div>
  );
};

// Rate Structure Setup Component
const RateStructureSetup = ({ 
  rates, 
  setRates, 
  contractors, 
  projects 
}: { 
  rates: RateStructure[], 
  setRates: (rates: RateStructure[]) => void,
  contractors: Contractor[],
  projects: Project[]
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Rate Structure Setup</h2>
        <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Rate Structure
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">Rate structures will be built based on your contractors and projects. Add some data first!</span>
        </div>
      </div>

      {/* Rate Structure Interface - Coming Soon */}
      <div className="text-center py-12">
        <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Rate structure interface coming soon...</p>
      </div>
    </div>
  );
};

// Work Order Creation Component
const WorkOrderCreation = ({ 
  workOrders, 
  setWorkOrders, 
  projects, 
  contractors 
}: { 
  workOrders: WorkOrder[], 
  setWorkOrders: (workOrders: WorkOrder[]) => void,
  projects: Project[],
  contractors: Contractor[]
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Work Order Creation</h2>
        <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Work Order
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-blue-800">Work orders connect your projects with contractors. Set up projects and contractors first!</span>
        </div>
      </div>

      <div className="text-center py-12">
        <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Work order creation interface coming soon...</p>
      </div>
    </div>
  );
};

// Data Export Helper Component
const DataExportHelper = ({ 
  projects, 
  contractors, 
  workOrders 
}: { 
  projects: Project[], 
  contractors: Contractor[], 
  workOrders: WorkOrder[] 
}) => {
  const exportToCSV = () => {
    // Simple CSV export implementation
    console.log('Exporting data...', { projects, contractors, workOrders });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Data Export & FireSpark Integration Helper</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Your Data</h3>
          <div className="space-y-3">
            <button 
              onClick={exportToCSV}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="font-medium">Export Projects CSV</div>
              <div className="text-sm text-gray-600">Download all project data</div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="font-medium">Export Contractors CSV</div>
              <div className="text-sm text-gray-600">Download contractor profiles</div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="font-medium">Export Complete Setup</div>
              <div className="text-sm text-gray-600">Full system configuration</div>
            </button>
          </div>
        </div>

        {/* FireSpark Integration Guide */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FireSpark Integration Guide</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <strong>Step 1:</strong> Export work order data from FireSpark
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Step 2:</strong> Use our field mapping tool to match columns
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Step 3:</strong> Import and validate data automatically
            </div>
          </div>
          <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
            Download Integration Guide
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">{projects.length}</div>
            <div className="text-sm text-gray-600">Projects Configured</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{contractors.length}</div>
            <div className="text-sm text-gray-600">Contractors Added</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{workOrders.length}</div>
            <div className="text-sm text-gray-600">Work Orders Created</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FireSpark Import Component
const FireSparkImport = ({ 
  projects, 
  setProjects, 
  workOrders, 
  setWorkOrders 
}: { 
  projects: Project[], 
  setProjects: (projects: Project[]) => void,
  workOrders: WorkOrder[],
  setWorkOrders: (workOrders: WorkOrder[]) => void
}) => {
  const [importMethod, setImportMethod] = useState('manual');
  const [csvData, setCsvData] = useState('');
  const [pastedData, setPastedData] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const importMethods = [
    {
      id: 'manual',
      title: 'Manual Export Helper',
      description: 'Step-by-step guide to export data from FireSpark',
      icon: DocumentTextIcon,
      color: 'emerald'
    },
    {
      id: 'copy-paste',
      title: 'Copy-Paste Interface',
      description: 'Smart parsing of FireSpark data you copy and paste',
      icon: ClipboardIcon,
      color: 'blue'
    },
    {
      id: 'email',
      title: 'Email Forward System',
      description: 'Forward FireSpark emails for automatic extraction',
      icon: EnvelopeIcon,
      color: 'purple'
    },
    {
      id: 'screenshot',
      title: 'Screenshot Upload',
      description: 'Upload screenshots for OCR text extraction',
      icon: PhotoIcon,
      color: 'orange'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Here you would implement file processing
      console.log('File uploaded:', file.name);
    }
  };

  const parseFireSparkData = (data: string) => {
    // Simple parsing logic for demo
    const lines = data.split('\n').filter(line => line.trim());
    const parsed = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('AFE') || line.includes('Work Order')) {
        parsed.push({
          type: 'work_order',
          content: line,
          afeCode: line.match(/AFE[:\-\s]*([\w\-]+)/i)?.[1] || '',
          location: line.match(/Location[:\-\s]*([^,]+)/i)?.[1] || '',
          contractor: line.match(/Contractor[:\-\s]*([^,]+)/i)?.[1] || ''
        });
      }
    }
    
    return parsed;
  };

  const handleParseData = () => {
    let dataToParseBasedOnMethod = '';
    
    switch (importMethod) {
      case 'copy-paste':
        dataToParseBasedOnMethod = pastedData;
        break;
      case 'email':
        dataToParseBasedOnMethod = emailContent;
        break;
      default:
        dataToParseBasedOnMethod = csvData;
    }
    
    const parsed = parseFireSparkData(dataToParseBasedOnMethod);
    setExtractedData(parsed);
    setShowPreview(true);
  };

  const handleImportData = () => {
    // Convert extracted data to projects/work orders
    const newProjects = extractedData.map((item, index) => ({
      id: `imported-${Date.now()}-${index}`,
      name: `FireSpark Project ${item.afeCode}`,
      internalCode: item.afeCode,
      description: `Imported from FireSpark: ${item.content}`,
      location: item.location,
      startDate: new Date().toISOString().split('T')[0],
      estimatedDuration: 30,
      budgetLimit: 100000,
      billingCycle: 'weekly' as const,
      specialRequirements: 'Imported from FireSpark',
      status: 'pending' as const
    }));

    setProjects([...projects, ...newProjects]);
    setShowPreview(false);
    setExtractedData([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">FireSpark Data Import</h2>
          <p className="text-gray-600">Import work order data from FireSpark using multiple methods</p>
        </div>
      </div>

      {/* Import Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {importMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = importMethod === method.id;
          const colorClasses = {
            emerald: isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300',
            blue: isSelected ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300',
            purple: isSelected ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300',
            orange: isSelected ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
          };

          return (
            <motion.button
              key={method.id}
              onClick={() => setImportMethod(method.id)}
              className={`p-4 border rounded-lg text-left transition-all ${colorClasses[method.color as keyof typeof colorClasses]}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-8 w-8 mb-3" />
              <h3 className="font-semibold text-sm mb-1">{method.title}</h3>
              <p className="text-xs opacity-75">{method.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Import Interface Based on Selected Method */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {importMethod === 'manual' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Manual Export from FireSpark</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div className="text-blue-800 text-sm">
                  <strong>Pro Tip:</strong> Export your FireSpark data during business hours for fastest processing. Contact support if you need help with specific exports.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Step-by-Step Export Guide</h4>
                <div className="space-y-3">
                  {[
                    'Login to your FireSpark dashboard',
                    'Navigate to Work Orders → Export',
                    'Select date range for your projects',
                    'Choose CSV format with all fields',
                    'Download and save the file',
                    'Upload the CSV file below'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Upload FireSpark CSV</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentArrowDownIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Choose CSV File
                  </label>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {uploadedFile.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">CSV Template</h5>
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                    AFE_Code,Project_Name,Location,Start_Date,Contractor,Day_Rate,Equipment_Rate
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Download CSV Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {importMethod === 'copy-paste' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Copy-Paste FireSpark Data</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste FireSpark Work Order Data
                  </label>
                  <textarea
                    value={pastedData}
                    onChange={(e) => setPastedData(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={`Paste your FireSpark data here. Examples:

Work Order: AFE-2024-001
Project: Montney Horizontal Well
Location: Fort St. John, BC
Contractor: Thunder Oilfield Services
Start Date: June 1, 2024
Day Rate: $850

AFE-2024-002 - Pipeline Inspection
Location: Grande Prairie, AB
Contractor: Precision Wireline
Rate: $1,200/day`}
                  />
                </div>
                
                <button
                  onClick={handleParseData}
                  disabled={!pastedData.trim()}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Parse Data
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Supported Formats</h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Work Order Format:</strong><br />
                    AFE-XXXX, Project Name, Location, Contractor
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Email Format:</strong><br />
                    Forward complete FireSpark email notifications
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Table Format:</strong><br />
                    Copy tables directly from FireSpark screens
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-yellow-800 text-sm">
                      <strong>Smart Parsing:</strong> Our system automatically detects AFE codes, project names, locations, and contractor information from your pasted data.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {importMethod === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Email Forward System</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-900 mb-2">Your Import Email Address</h4>
                  <div className="bg-white border border-emerald-300 rounded px-3 py-2 font-mono text-sm">
                    import@{/* your-company */}invoicepatch.com
                  </div>
                  <p className="text-emerald-700 text-sm mt-2">
                    Forward FireSpark emails to this address for automatic processing
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Paste Email Content Here
                  </label>
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={`Paste complete FireSpark email content:

From: firespark@company.com
Subject: Work Order Assignment - AFE-2024-001

Work Order Details:
AFE Code: AFE-2024-001
Project: Montney Horizontal Well Program
Location: Fort St. John, BC
Assigned Contractor: Thunder Oilfield Services
Start Date: June 1, 2024
Daily Rate: $850.00
Equipment Rate: $200.00/day`}
                  />
                </div>

                <button
                  onClick={handleParseData}
                  disabled={!emailContent.trim()}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Extract Email Data
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">How Email Parsing Works</h4>
                <div className="space-y-3">
                  {[
                    'AI detects FireSpark email patterns',
                    'Extracts AFE codes and project details',
                    'Identifies contractor assignments',
                    'Parses rates and schedule information',
                    'Creates work orders automatically',
                    'Sends notifications to contractors'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Supported Email Types</h5>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Work order assignments</li>
                    <li>• Schedule updates</li>
                    <li>• Rate change notifications</li>
                    <li>• Project completion notices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {importMethod === 'screenshot' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Screenshot Upload & OCR</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="cursor-pointer inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    Upload Screenshot
                  </label>
                  <p className="text-gray-600 text-sm mt-3">
                    PNG, JPG, or PDF files up to 10MB
                  </p>
                  {uploadedFile && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium">Uploaded: {uploadedFile.name}</p>
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-1">
                        Process with OCR
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="font-medium text-orange-900 mb-2">OCR Processing</h5>
                  <p className="text-orange-800 text-sm">
                    Our OCR system extracts text from your FireSpark screenshots and converts it to structured data. Review and correct any extraction errors before importing.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Screenshot Tips</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <span>Capture full work order details in one screenshot</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <span>Ensure text is clear and readable</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <span>Include AFE codes and contractor information</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <span>Avoid blurry or low-resolution images</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Common Screenshots</h5>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• FireSpark work order summary</li>
                    <li>• Contractor assignment screen</li>
                    <li>• Rate schedule tables</li>
                    <li>• Project details page</li>
                  </ul>
                </div>

                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700">
                  Process Screenshots
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Preview Modal */}
      <AnimatePresence>
        {showPreview && extractedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Preview Extracted Data</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-emerald-800">
                      <strong>Found {extractedData.length} work orders.</strong> Review the data below and make any corrections before importing.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {extractedData.map((item, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">AFE Code</label>
                            <input
                              type="text"
                              value={item.afeCode}
                              onChange={(e) => {
                                const updated = [...extractedData];
                                updated[index].afeCode = e.target.value;
                                setExtractedData(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              type="text"
                              value={item.location}
                              onChange={(e) => {
                                const updated = [...extractedData];
                                updated[index].location = e.target.value;
                                setExtractedData(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contractor</label>
                            <input
                              type="text"
                              value={item.contractor}
                              onChange={(e) => {
                                const updated = [...extractedData];
                                updated[index].contractor = e.target.value;
                                setExtractedData(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Original Content</label>
                          <p className="text-sm text-gray-600 bg-white p-2 rounded border">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportData}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                      Import {extractedData.length} Work Orders
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">FireSpark Integration Status</h3>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Trial Mode
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">0</div>
            <div className="text-sm text-gray-600">Data Sources Connected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{extractedData.length}</div>
            <div className="text-sm text-gray-600">Records Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Auto-Imports Today</div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div className="text-blue-800 text-sm">
              <strong>Ready for API Integration:</strong> Once your trial is complete, we'll set up direct API integration with FireSpark for automatic real-time data sync. All the field mappings you create during the trial will be preserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup; 