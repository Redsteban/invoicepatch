'use client';

import { useState } from 'react';
import { useContractor } from '@/contexts/ContractorContext';
import { SimulationTemplate } from '@/lib/simulationDataGenerator';
import { Play, HardHat, Zap, ArrowRight, Info } from 'lucide-react';

interface SimulationTemplateOption {
  id: SimulationTemplate;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  dayRate: number;
  truckRate: number;
  subsistenceRate: number;
}

const simulationTemplates: SimulationTemplateOption[] = [
  {
    id: 'oil_gas',
    name: 'Oil & Gas',
    description: 'High-paying oil field and energy sector work',
    icon: <Zap className="w-6 h-6" />,
    features: [
      'Premium day rates ($650/day)',
      'Equipment charges ($150/day)',
      'Subsistence allowance ($60/day)',
      'Remote site locations',
      'Safety-focused protocols',
      'Emergency response scenarios'
    ],
    dayRate: 650,
    truckRate: 150,
    subsistenceRate: 60
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Commercial and residential construction projects',
    icon: <HardHat className="w-6 h-6" />,
    features: [
      'Competitive day rates ($550/day)',
      'Equipment charges ($120/day)',
      'Subsistence allowance ($50/day)',
      'Urban project locations',
      'Multi-trade scenarios',
      'Project management features'
    ],
    dayRate: 550,
    truckRate: 120,
    subsistenceRate: 50
  }
];

export default function SimulationLauncher() {
  const { startSimulation, isSimulationMode } = useContractor();
  const [selectedTemplate, setSelectedTemplate] = useState<SimulationTemplate | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartSimulation = async (template: SimulationTemplate) => {
    setIsStarting(true);
    try {
      startSimulation(template);
    } catch (error) {
      console.error('Failed to start simulation:', error);
    } finally {
      setIsStarting(false);
    }
  };

  if (isSimulationMode) {
    return null; // Don't show launcher when already in simulation
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Play className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Start Simulation</h2>
        </div>
        <p className="text-gray-600">
          Experience the contractor dashboard with realistic demo data
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {simulationTemplates.map((template) => (
          <div
            key={template.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-blue-600">{template.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">${template.dayRate}</div>
                  <div className="text-gray-500">Day Rate</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">${template.truckRate}</div>
                  <div className="text-gray-500">Truck</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">${template.subsistenceRate}</div>
                  <div className="text-gray-500">Subsistence</div>
                </div>
              </div>
            </div>

            <ul className="space-y-1">
              {template.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Simulation Details</h4>
              <p className="text-sm text-blue-700 mb-3">
                You'll experience a 15-day work period with realistic scenarios, 
                time tracking, invoice generation, and payment processing.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All data is generated for demonstration purposes</li>
                <li>• No real API calls or data persistence</li>
                <li>• Full dashboard functionality available</li>
                <li>• Progress through days to see different scenarios</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => selectedTemplate && handleStartSimulation(selectedTemplate)}
          disabled={!selectedTemplate || isStarting}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {isStarting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Starting...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start {selectedTemplate ? simulationTemplates.find(t => t.id === selectedTemplate)?.name : ''} Simulation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Compact version for use in sidebars or modals
export function SimulationLauncherCompact() {
  const { startSimulation, isSimulationMode } = useContractor();
  const [isStarting, setIsStarting] = useState(false);

  const handleQuickStart = async (template: SimulationTemplate) => {
    setIsStarting(true);
    try {
      startSimulation(template);
    } catch (error) {
      console.error('Failed to start simulation:', error);
    } finally {
      setIsStarting(false);
    }
  };

  if (isSimulationMode) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4">
      <div className="text-center mb-4">
        <Play className="w-8 h-8 mx-auto mb-2" />
        <h3 className="font-semibold mb-1">Try the Demo</h3>
        <p className="text-blue-100 text-sm">Experience the full dashboard</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleQuickStart('oil_gas')}
          disabled={isStarting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black text-sm py-2 px-3 rounded transition-colors"
        >
          {isStarting ? 'Starting...' : 'Oil & Gas Demo'}
        </button>
        
        <button
          onClick={() => handleQuickStart('construction')}
          disabled={isStarting}
          className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-500 text-blue-600 text-sm py-2 px-3 rounded transition-colors"
        >
          {isStarting ? 'Starting...' : 'Construction Demo'}
        </button>
      </div>
    </div>
  );
} 