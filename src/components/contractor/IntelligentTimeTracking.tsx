'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ClockIcon,
  CalendarDaysIcon,
  SparklesIcon,
  ChartBarIcon,
  CogIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import SmartTimeTracker from './SmartTimeTracker';
import PeriodBoundaryManager from './PeriodBoundaryManager';

type TabType = 'tracker' | 'periods' | 'analytics' | 'settings';

const IntelligentTimeTracking = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tracker');

  const tabs = [
    {
      id: 'tracker' as TabType,
      name: 'Smart Tracker',
      icon: ClockIcon,
      description: 'GPS-verified time tracking with smart suggestions'
    },
    {
      id: 'periods' as TabType,
      name: 'Period Management',
      icon: CalendarDaysIcon,
      description: 'Work period boundaries and deadline tracking'
    },
    {
      id: 'analytics' as TabType,
      name: 'Time Analytics',
      icon: ChartBarIcon,
      description: 'Pattern analysis and productivity insights'
    },
    {
      id: 'settings' as TabType,
      name: 'Intelligence Settings',
      icon: CogIcon,
      description: 'Configure automation and preferences'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tracker':
        return <SmartTimeTracker />;
      case 'periods':
        return <PeriodBoundaryManager />;
      case 'analytics':
        return <TimeAnalytics />;
      case 'settings':
        return <IntelligenceSettings />;
      default:
        return <SmartTimeTracker />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <SparklesIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Intelligent Time Tracking</h1>
        </div>
        <p className="text-indigo-100">
          Complete work period detection and time tracking intelligence for Stack Production Testing
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <tab.icon className={`h-5 w-5 ${
                  activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <span className="font-medium">{tab.name}</span>
              </div>
              <p className="text-sm text-gray-500">{tab.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

// Time Analytics Component
const TimeAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Pattern Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">8.2h</div>
            <div className="text-sm text-blue-800">Average Daily Hours</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-sm text-green-800">On-Time Submission Rate</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">3.2km</div>
            <div className="text-sm text-purple-800">Average Daily Travel</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Work Pattern Insights</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Most productive hours:</span>
                <span className="font-medium">7:00 AM - 11:00 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Typical start time:</span>
                <span className="font-medium">7:15 AM ± 15 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Break patterns:</span>
                <span className="font-medium">30 min lunch, 2x 15 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Overtime frequency:</span>
                <span className="font-medium">15% of work days</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Site & Project Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Most frequent site:</span>
                <span className="font-medium">Montney Field Site A</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average travel time:</span>
                <span className="font-medium">47 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Primary project:</span>
                <span className="font-medium">Production Testing (78%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Weather impact:</span>
                <span className="font-medium">2.3% productivity loss</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">Time Optimization</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Start 15 minutes earlier to beat traffic</li>
              <li>• Consolidate morning site visits</li>
              <li>• Use voice notes for faster documentation</li>
              <li>• Batch similar tasks together</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Earning Maximization</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Track all travel time accurately</li>
              <li>• Document extreme weather conditions</li>
              <li>• Log equipment usage for rental charges</li>
              <li>• Submit invoices 2 days before deadline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Intelligence Settings Component
const IntelligenceSettings = () => {
  const [settings, setSettings] = useState({
    autoFillSuggestions: true,
    gpsVerification: true,
    smartReminders: true,
    patternLearning: true,
    voiceNotes: false,
    photoDocumentation: true,
    weatherTracking: true,
    travelTimeCalculation: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Intelligence Features</h3>
        
        <div className="space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <p className="text-sm text-gray-600">
                  {getSettingDescription(key)}
                </p>
              </div>
              <button
                onClick={() => toggleSetting(key as keyof typeof settings)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">Privacy & Data</h4>
            <p className="text-sm text-yellow-800 mt-1">
              Your time tracking data is encrypted and stored securely. GPS coordinates are only used 
              for work verification and are not shared with third parties. You can export or delete 
              your data at any time.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stack Integration Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Standard Day Rate
            </label>
            <input
              type="number"
              defaultValue="850"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overtime Threshold (hours)
            </label>
            <input
              type="number"
              defaultValue="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Project Code
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="PRODUCTION-TEST">Production Testing Services</option>
              <option value="MONTNEY-DRILL">Montney Horizontal Drilling</option>
              <option value="PIPELINE-INTEGRITY">Pipeline Integrity Assessment</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mileage Rate (CAD/km)
            </label>
            <input
              type="number"
              step="0.01"
              defaultValue="0.68"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const getSettingDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    autoFillSuggestions: 'Automatically suggest time entries based on your patterns',
    gpsVerification: 'Verify work location using GPS coordinates',
    smartReminders: 'Intelligent reminders for missing time entries',
    patternLearning: 'Learn from your work patterns to improve suggestions',
    voiceNotes: 'Enable voice-to-text for quick work descriptions',
    photoDocumentation: 'Attach photos to time entries for verification',
    weatherTracking: 'Automatically log weather conditions',
    travelTimeCalculation: 'Calculate and suggest travel times to job sites'
  };
  
  return descriptions[key] || 'Configure this intelligence feature';
};

export default IntelligentTimeTracking; 