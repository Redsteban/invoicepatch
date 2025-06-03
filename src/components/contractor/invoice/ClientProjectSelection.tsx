'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface Client {
  id: string;
  name: string;
  type: string;
  projects: Project[];
}

interface Project {
  id: string;
  name: string;
  afe: string;
  location: string;
  rates: {
    regular: number;
    overtime: number;
    equipment: number;
    mileage: number;
  };
  requirements: string[];
  status: 'active' | 'pending' | 'completed';
}

interface ClientProjectSelectionProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const mockClients: Client[] = [
  {
    id: 'petro-canada',
    name: 'Petro-Canada',
    type: 'Oil & Gas',
    projects: [
      {
        id: 'well-47a',
        name: 'Well Site 47A Development',
        afe: 'AFE-2024-047A',
        location: 'Fort McMurray, AB',
        rates: {
          regular: 65.00,
          overtime: 97.50,
          equipment: 850.00,
          mileage: 0.68
        },
        requirements: ['Safety certification required', 'H2S training mandatory'],
        status: 'active'
      },
      {
        id: 'pipeline-maint',
        name: 'Pipeline Maintenance Q1',
        afe: 'AFE-2024-PM1',
        location: 'Calgary, AB',
        rates: {
          regular: 68.00,
          overtime: 102.00,
          equipment: 900.00,
          mileage: 0.68
        },
        requirements: ['Pipeline safety certification'],
        status: 'active'
      }
    ]
  },
  {
    id: 'suncor',
    name: 'Suncor Energy',
    type: 'Oil Sands',
    projects: [
      {
        id: 'maintenance-2024',
        name: 'Facility Maintenance Contract',
        afe: 'AFE-2024-MAINT',
        location: 'Oil Sands, AB',
        rates: {
          regular: 72.00,
          overtime: 108.00,
          equipment: 950.00,
          mileage: 0.72
        },
        requirements: ['CSTS certification', 'Confined space training'],
        status: 'active'
      }
    ]
  }
];

export default function ClientProjectSelection({ data, onUpdate, onNext }: ClientProjectSelectionProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(data.client || null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(data.project || null);
  const [workPeriod, setWorkPeriod] = useState({
    startDate: '',
    endDate: ''
  });

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSelectedProject(null); // Reset project when client changes
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleNext = () => {
    if (selectedClient && selectedProject && workPeriod.startDate && workPeriod.endDate) {
      onUpdate({
        client: selectedClient,
        project: selectedProject,
        workPeriod
      });
      onNext();
    }
  };

  const isFormValid = selectedClient && selectedProject && workPeriod.startDate && workPeriod.endDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Client & Project</h2>
        <p className="text-gray-600 mt-2">
          Choose your client and project to pre-populate AFE codes and rates
        </p>
      </div>

      {/* Client Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 mr-2" />
          Select Client
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockClients.map((client) => (
            <motion.button
              key={client.id}
              onClick={() => handleClientSelect(client)}
              className={`
                p-4 border-2 rounded-lg text-left transition-all duration-200
                ${selectedClient?.id === client.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium text-gray-900">{client.name}</div>
              <div className="text-sm text-gray-500">{client.type}</div>
              <div className="text-xs text-gray-400 mt-1">
                {client.projects.length} active project{client.projects.length !== 1 ? 's' : ''}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Project Selection */}
      {selectedClient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            Select Project
          </h3>
          
          <div className="space-y-4">
            {selectedClient.projects.map((project) => (
              <motion.button
                key={project.id}
                onClick={() => handleProjectSelect(project)}
                className={`
                  w-full p-4 border-2 rounded-lg text-left transition-all duration-200
                  ${selectedProject?.id === project.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-600 mt-1">AFE: {project.afe}</div>
                    <div className="text-sm text-gray-500">📍 {project.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Regular Rate</div>
                    <div className="font-semibold text-emerald-600">${project.rates.regular}/hr</div>
                  </div>
                </div>
                
                {project.requirements.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-amber-600">
                      <InformationCircleIcon className="h-4 w-4 mr-1" />
                      Requirements: {project.requirements.join(', ')}
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Project Details */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details & Rates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Regular Rate</div>
              <div className="text-lg font-semibold text-gray-900">${selectedProject.rates.regular}/hr</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Overtime Rate</div>
              <div className="text-lg font-semibold text-gray-900">${selectedProject.rates.overtime}/hr</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Equipment Rate</div>
              <div className="text-lg font-semibold text-gray-900">${selectedProject.rates.equipment}/day</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Mileage Rate</div>
              <div className="text-lg font-semibold text-gray-900">${selectedProject.rates.mileage}/km</div>
            </div>
          </div>

          {/* Work Period Selection */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Work Period
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={workPeriod.startDate}
                  onChange={(e) => setWorkPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={workPeriod.endDate}
                  onChange={(e) => setWorkPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all duration-200
            ${isFormValid
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue to Time & Labor
        </button>
      </div>
    </div>
  );
} 