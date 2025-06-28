'use client';

import { useContractor } from '@/contexts/ContractorContext';
import { Play, SkipForward, X, AlertTriangle, Info } from 'lucide-react';

export default function SimulationIndicator() {
  const { 
    isSimulationMode, 
    simulationDay, 
    simulationTemplate, 
    advanceSimulationDay, 
    exitSimulation 
  } = useContractor();

  if (!isSimulationMode) {
    return null;
  }

  const getTemplateDisplayName = (template: string) => {
    return template === 'oil_gas' ? 'Oil & Gas' : 'Construction';
  };

  const getDayProgress = () => {
    return Math.round((simulationDay / 15) * 100);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold text-sm">Simulation Mode</span>
          </div>
          <button
            onClick={exitSimulation}
            className="text-white hover:text-red-200 transition-colors"
            title="Exit Simulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Info */}
        <div className="mb-3">
          <div className="text-xs text-blue-100 mb-1">
            Template: {simulationTemplate ? getTemplateDisplayName(simulationTemplate) : 'Unknown'}
          </div>
          <div className="text-xs text-blue-100">
            Day: {simulationDay} of 15
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-blue-100 mb-1">
            <span>Progress</span>
            <span>{getDayProgress()}%</span>
          </div>
          <div className="w-full bg-blue-700 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getDayProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-2">
          <button
            onClick={advanceSimulationDay}
            disabled={simulationDay >= 15}
            className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black text-xs px-3 py-2 rounded transition-colors"
            title="Advance to Next Day"
          >
            <SkipForward className="w-3 h-3" />
            <span>Next Day</span>
          </button>
          
          <div className="flex items-center space-x-1 bg-blue-700 text-xs px-3 py-2 rounded">
            <Play className="w-3 h-3" />
            <span>Demo</span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 pt-3 border-t border-blue-500">
          <div className="flex items-start space-x-2">
            <Info className="w-3 h-3 text-blue-200 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-100">
              This is a simulation. All data is generated for demonstration purposes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for use in headers or sidebars
export function SimulationBadge() {
  const { isSimulationMode, simulationDay, simulationTemplate } = useContractor();

  if (!isSimulationMode) {
    return null;
  }

  return (
    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
      <AlertTriangle className="w-3 h-3" />
      <span>Sim Day {simulationDay}</span>
    </div>
  );
}

// Banner version for top of pages
export function SimulationBanner() {
  const { 
    isSimulationMode, 
    simulationDay, 
    simulationTemplate, 
    advanceSimulationDay, 
    exitSimulation 
  } = useContractor();

  if (!isSimulationMode) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">Simulation Mode</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <span>Template: {simulationTemplate === 'oil_gas' ? 'Oil & Gas' : 'Construction'}</span>
            <span>Day: {simulationDay} of 15</span>
            <div className="flex items-center space-x-2">
              <span>Progress:</span>
              <div className="w-24 bg-blue-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((simulationDay / 15) * 100)}%` }}
                ></div>
              </div>
              <span className="text-xs">{Math.round((simulationDay / 15) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={advanceSimulationDay}
            disabled={simulationDay >= 15}
            className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black px-3 py-2 rounded text-sm transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            <span>Next Day</span>
          </button>
          
          <button
            onClick={exitSimulation}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            Exit Simulation
          </button>
        </div>
      </div>
    </div>
  );
} 