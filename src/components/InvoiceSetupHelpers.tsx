'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  InformationCircleIcon,
  LightBulbIcon,
  CalculatorIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface RateSuggestion {
  category: string;
  lowEnd: number;
  highEnd: number;
  description: string;
}

interface ValidationTooltipProps {
  field: string;
  value: string | number;
  isValid: boolean;
  suggestions?: string[];
}

interface RateCalculatorProps {
  onRateUpdate: (dayRate: number, truckRate: number) => void;
}

// Industry rate suggestions based on Alberta oil & gas sector
const RATE_SUGGESTIONS: RateSuggestion[] = [
  {
    category: 'Equipment Operator',
    lowEnd: 650,
    highEnd: 850,
    description: 'Heavy equipment operation, drilling support'
  },
  {
    category: 'Directional Driller',
    lowEnd: 750,
    highEnd: 950,
    description: 'Specialized drilling operations, MWD/LWD'
  },
  {
    category: 'Field Supervisor',
    lowEnd: 800,
    highEnd: 1200,
    description: 'Site supervision, safety management'
  },
  {
    category: 'Completion Tech',
    lowEnd: 700,
    highEnd: 900,
    description: 'Well completion, hydraulic fracturing'
  },
  {
    category: 'Safety Specialist',
    lowEnd: 600,
    highEnd: 800,
    description: 'H2S safety, confined space monitoring'
  }
];

const TRUCK_RATE_SUGGESTIONS = [
  { type: 'Pickup Truck', rate: 150, description: 'Standard work truck with tools' },
  { type: 'Service Truck', rate: 250, description: 'Heavy-duty service vehicle' },
  { type: 'Vacuum Truck', rate: 400, description: 'Specialized industrial vacuum' },
  { type: 'Crane Truck', rate: 500, description: 'Mobile crane operations' },
  { type: 'Rig Equipment', rate: 800, description: 'Specialized drilling equipment' }
];

export const RateCalculator: React.FC<RateCalculatorProps> = ({ onRateUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTruckType, setSelectedTruckType] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<number>(5);

  const calculateAdjustedRate = (baseRate: number, years: number): number => {
    // Adjust rate based on experience (5% per year above 2 years, capped at 50% increase)
    const experienceMultiplier = Math.min(1 + ((years - 2) * 0.05), 1.5);
    return Math.round(baseRate * experienceMultiplier);
  };

  const handleApplyRates = () => {
    const categoryData = RATE_SUGGESTIONS.find(r => r.category === selectedCategory);
    const truckData = TRUCK_RATE_SUGGESTIONS.find(t => t.type === selectedTruckType);
    
    if (categoryData && truckData) {
      const adjustedDayRate = calculateAdjustedRate(
        (categoryData.lowEnd + categoryData.highEnd) / 2,
        experienceYears
      );
      onRateUpdate(adjustedDayRate, truckData.rate);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <CalculatorIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-medium text-blue-900">Rate Calculator</span>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-blue-600" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Job Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your role...</option>
                {RATE_SUGGESTIONS.map((rate) => (
                  <option key={rate.category} value={rate.category}>
                    {rate.category} (${rate.lowEnd}-${rate.highEnd}/day)
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <p className="mt-1 text-xs text-blue-700">
                  {RATE_SUGGESTIONS.find(r => r.category === selectedCategory)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Equipment Type
              </label>
              <select
                value={selectedTruckType}
                onChange={(e) => setSelectedTruckType(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select equipment...</option>
                {TRUCK_RATE_SUGGESTIONS.map((truck) => (
                  <option key={truck.type} value={truck.type}>
                    {truck.type} (${truck.rate}/day)
                  </option>
                ))}
              </select>
              {selectedTruckType && (
                <p className="mt-1 text-xs text-blue-700">
                  {TRUCK_RATE_SUGGESTIONS.find(t => t.type === selectedTruckType)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Years of Experience: {experienceYears}
              </label>
              <input
                type="range"
                min="1"
                max="25"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-blue-600 mt-1">
                <span>Entry Level</span>
                <span>Senior</span>
                <span>Expert</span>
              </div>
            </div>

            {selectedCategory && selectedTruckType && (
              <div className="bg-white rounded-md p-3 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Suggested Rates:</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    Day Rate: <span className="font-bold">
                      ${calculateAdjustedRate(
                        (RATE_SUGGESTIONS.find(r => r.category === selectedCategory)!.lowEnd +
                         RATE_SUGGESTIONS.find(r => r.category === selectedCategory)!.highEnd) / 2,
                        experienceYears
                      )}/day
                    </span>
                  </p>
                  <p>
                    Equipment Rate: <span className="font-bold">
                      ${TRUCK_RATE_SUGGESTIONS.find(t => t.type === selectedTruckType)?.rate}/day
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleApplyRates}
                  className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors touch-target"
                >
                  Apply These Rates
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ValidationTooltip: React.FC<ValidationTooltipProps> = ({ 
  field, 
  value, 
  isValid, 
  suggestions = [] 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getValidationMessage = () => {
    switch (field) {
      case 'dayRate':
        const rate = parseFloat(value.toString());
        if (rate < 400) return { type: 'warning', message: 'Rate seems low for oil & gas work' };
        if (rate > 1500) return { type: 'warning', message: 'Rate seems high - verify with client' };
        return { type: 'success', message: 'Rate looks competitive' };
      
      case 'travelKMs':
        const kms = parseFloat(value.toString());
        if (kms > 200) return { type: 'warning', message: 'Long commute - consider overnight allowance' };
        if (kms === 0) return { type: 'info', message: 'Local work - no travel charges' };
        return { type: 'success', message: 'Reasonable travel distance' };
      
      case 'company':
        if (value.toString().length < 3) return { type: 'error', message: 'Company name too short' };
        return { type: 'success', message: 'Company name looks good' };
      
      default:
        return { type: 'info', message: 'Field validated' };
    }
  };

  const validation = getValidationMessage();

  const getIcon = () => {
    switch (validation.type) {
      case 'success': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'warning': return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />;
      case 'error': return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      default: return <InformationCircleIcon className="h-4 w-4 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (validation.type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (!value) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="ml-1 touch-target"
      >
        {getIcon()}
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`absolute z-10 left-0 mt-1 w-64 p-3 rounded-lg border shadow-lg ${getColorClasses()}`}
          >
            <p className="text-sm font-medium">{validation.message}</p>
            {suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium mb-1">Suggestions:</p>
                <ul className="text-xs space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const IndustryInsights = () => {
  const [activeTab, setActiveTab] = useState<'rates' | 'travel' | 'tips'>('rates');

  const insights = {
    rates: {
      title: 'Current Market Rates',
      content: [
        'Alberta day rates have increased 15% in 2024',
        'Equipment rates vary by 40% between regions', 
        'Experience premium averages 5-8% per year',
        'Specialized skills can command 20-30% premium'
      ]
    },
    travel: {
      title: 'Travel & Subsistence',
      content: [
        'Standard meal allowance: $75-$100/day',
        'Travel over 80km typically billable',
        'Overnight stays: $120-$150 lodging allowance',
        'Consider camp vs. daily travel costs'
      ]
    },
    tips: {
      title: 'Billing Best Practices',
      content: [
        'Submit invoices within 3 days of work completion',
        'Include detailed work descriptions',
        'Photo documentation increases approval rate',
        'Weekly invoicing improves cash flow'
      ]
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <LightBulbIcon className="h-6 w-6 text-yellow-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Industry Insights</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(insights).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${
              activeTab === key
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {data.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className="font-medium text-gray-900 mb-3">{insights[activeTab].title}</h4>
          <ul className="space-y-2">
            {insights[activeTab].content.map((item, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Hook for form validation with real-time feedback
export const useFormValidation = (formData: any) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    const newWarnings = { ...warnings };

    // Clear existing messages
    delete newErrors[field];
    delete newWarnings[field];

    switch (field) {
      case 'dayRate':
        const rate = parseFloat(value);
        if (isNaN(rate) || rate <= 0) {
          newErrors[field] = 'Day rate must be a positive number';
        } else if (rate < 400) {
          newWarnings[field] = 'Day rate seems low for industry standards';
        } else if (rate > 1500) {
          newWarnings[field] = 'Day rate seems high - confirm with client';
        }
        break;

      case 'company':
        if (!value || value.trim().length < 2) {
          newErrors[field] = 'Company name is required';
        } else if (value.trim().length < 3) {
          newWarnings[field] = 'Company name seems short';
        }
        break;

      case 'travelKMs':
        const kms = parseFloat(value);
        if (isNaN(kms) || kms < 0) {
          newErrors[field] = 'Travel distance must be 0 or greater';
        } else if (kms > 300) {
          newWarnings[field] = 'Long travel distance - consider overnight stays';
        }
        break;
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
  };

  return { errors, warnings, validateField };
}; 