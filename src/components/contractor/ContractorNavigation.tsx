'use client';

import { motion } from 'framer-motion';
import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  FolderIcon,
  CogIcon,
  UserCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

type ActiveView = 'dashboard' | 'active-projects' | 'invoice-management' | 'invoice-builder' | 'business-analytics' | 'document-center';

interface ContractorNavigationProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Overview', icon: HomeIcon, description: 'Dashboard & quick actions' },
  { id: 'active-projects', name: 'Active Projects', icon: BuildingOfficeIcon, description: 'Current work assignments' },
  { id: 'invoice-management', name: 'Invoice Management', icon: DocumentTextIcon, description: 'Create & track invoices' },
  { id: 'business-analytics', name: 'Business Analytics', icon: ChartBarIcon, description: 'Financial insights' },
  { id: 'document-center', name: 'Document Center', icon: FolderIcon, description: 'File storage & organization' },
];

export default function ContractorNavigation({ 
  activeView, 
  setActiveView
}: ContractorNavigationProps) {
  return (
    <>
      {/* Mobile Navigation - Fixed Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 safe-top">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">IP</span>
              </div>
              <span className="ml-2 text-base sm:text-lg font-semibold text-gray-900">InvoicePatch</span>
              <div className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                TRIAL
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Mobile Tab Navigation - Scrollable */}
        <div className="mobile-scroll bg-white border-t border-gray-100">
          <div className="flex px-3 sm:px-4 pb-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
                className={`
                  mobile-button flex flex-col items-center justify-center px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap min-w-[70px] sm:min-w-[80px] transition-colors
                  ${activeView === item.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs leading-tight text-center">
                  {item.name.split(' ').map((word, index) => (
                    <span key={index} className={index > 0 ? 'block' : ''}>{word}</span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">IP</span>
              </div>
              <div className="ml-3 flex-1">
                <span className="text-xl font-semibold text-gray-900">InvoicePatch</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Contractor Portal</span>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                    TRIAL
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group
                  ${activeView === item.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-600">{item.description}</div>
                </div>
              </motion.button>
            ))}
          </nav>

          {/* Trial Features */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <SparklesIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Trial Features</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Full dashboard access</li>
                <li>• Sample data included</li>
                <li>• All features unlocked</li>
                <li>• No time restrictions</li>
              </ul>
            </div>
          </div>

          {/* User Profile */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Trial User</div>
                <div className="text-xs text-gray-500">trial@invoicepatch.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 