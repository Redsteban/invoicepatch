'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  BellIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import AutoInvoiceDashboard from './AutoInvoiceDashboard';
import NotificationCenter from './NotificationCenter';
import { 
  stackCronScheduler, 
  getAutomationStatus, 
  startStackAutomation, 
  stopStackAutomation,
  CronJob 
} from '../../lib/cron-scheduler';
import { formatDate, formatDateShort } from '../../lib/payroll-calendar';

interface AutomationStats {
  isRunning: boolean;
  totalJobs: number;
  enabledJobs: number;
  totalRuns: number;
  successRate: number;
  nextRuns: Array<{
    jobId: string;
    name: string;
    nextRun: Date;
  }>;
}

const AutomationShowcase = () => {
  const [automationStats, setAutomationStats] = useState<AutomationStats | null>(null);
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'automation' | 'notifications'>('dashboard');

  useEffect(() => {
    // Initialize automation status
    const stats = getAutomationStatus();
    setAutomationStats({
      ...stats,
      isRunning: true
    });
    setCronJobs(stackCronScheduler.getAllJobs());
    
    // Check if automation should be running (in a real app, this would check actual status)
    setIsAutomationRunning(true);
  }, []);

  const toggleAutomation = () => {
    if (isAutomationRunning) {
      stopStackAutomation();
      setIsAutomationRunning(false);
    } else {
      startStackAutomation();
      setIsAutomationRunning(true);
    }
  };

  const triggerJob = async (jobId: string) => {
    try {
      const result = await stackCronScheduler.triggerJob(jobId);
      console.log('Job triggered:', result);
      // Refresh stats
      const newStats = getAutomationStatus();
      setAutomationStats({
        ...newStats,
        isRunning: isAutomationRunning
      });
    } catch (error) {
      console.error('Failed to trigger job:', error);
    }
  };

  const getJobStatusIcon = (job: CronJob) => {
    if (!job.enabled) {
      return <PauseIcon className="h-4 w-4 text-gray-400" />;
    }
    
    if (job.errorCount > 0 && job.errorCount / (job.runCount || 1) > 0.1) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    }
    
    return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
  };

  const getNextRunStatus = (nextRun: Date) => {
    const now = new Date();
    const diffHours = Math.ceil((nextRun.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 1) return { color: 'text-red-600', label: 'Due soon' };
    if (diffHours <= 24) return { color: 'text-orange-600', label: 'Today' };
    if (diffHours <= 72) return { color: 'text-yellow-600', label: 'This week' };
    return { color: 'text-green-600', label: 'Scheduled' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Master Control */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <SparklesIcon className="h-8 w-8" />
              Stack Automation Center
            </h1>
            <p className="text-blue-100 mt-2">
              Complete automated invoice generation system for Stack Production Testing
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-blue-100">System Status</div>
              <div className={`text-lg font-semibold ${
                isAutomationRunning ? 'text-green-300' : 'text-red-300'
              }`}>
                {isAutomationRunning ? 'ACTIVE' : 'STOPPED'}
              </div>
            </div>
            
            <button
              onClick={toggleAutomation}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isAutomationRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isAutomationRunning ? (
                <>
                  <PauseIcon className="h-5 w-5" />
                  Stop Automation
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5" />
                  Start Automation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        {automationStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CogIcon className="h-5 w-5" />
                <span className="font-medium">Active Jobs</span>
              </div>
              <div className="text-2xl font-bold">{automationStats.enabledJobs}</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <ArrowTrendingUpIcon className="h-5 w-5" />
                <span className="font-medium">Success Rate</span>
              </div>
              <div className="text-2xl font-bold">{automationStats.successRate}%</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <BoltIcon className="h-5 w-5" />
                <span className="font-medium">Total Runs</span>
              </div>
              <div className="text-2xl font-bold">{automationStats.totalRuns}</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span className="font-medium">Next Run</span>
              </div>
              <div className="text-sm">
                {automationStats.nextRuns.length > 0 
                  ? formatDateShort(automationStats.nextRuns[0].nextRun)
                  : 'None scheduled'
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
        <button
          onClick={() => setSelectedTab('dashboard')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            selectedTab === 'dashboard'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChartBarIcon className="h-5 w-5" />
          Invoice Dashboard
        </button>
        
        <button
          onClick={() => setSelectedTab('automation')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            selectedTab === 'automation'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CogIcon className="h-5 w-5" />
          Automation Control
        </button>
        
        <button
          onClick={() => setSelectedTab('notifications')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            selectedTab === 'notifications'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BellIcon className="h-5 w-5" />
          Notification Center
        </button>
      </div>

      {/* Tab Content */}
      {selectedTab === 'dashboard' && <AutoInvoiceDashboard />}
      
      {selectedTab === 'automation' && (
        <div className="space-y-6">
          {/* Cron Jobs Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CogIcon className="h-5 w-5" />
              Automated Jobs
            </h3>
            
            <div className="space-y-3">
              {cronJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getJobStatusIcon(job)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.name}</h4>
                        <p className="text-sm text-gray-600">{job.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => triggerJob(job.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Run Now
                      </button>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        job.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-gray-600">
                    <div>
                      <strong>Schedule:</strong> {job.schedule}
                    </div>
                    <div>
                      <strong>Next Run:</strong> 
                      <span className={`ml-1 ${getNextRunStatus(job.nextRun).color}`}>
                        {formatDateShort(job.nextRun)}
                      </span>
                    </div>
                    <div>
                      <strong>Runs:</strong> {job.runCount}
                    </div>
                    <div>
                      <strong>Errors:</strong> 
                      <span className={job.errorCount > 0 ? 'text-red-600' : 'text-green-600'}>
                        {job.errorCount}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Automation Benefits */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold text-gray-900">Complete Automation Benefits</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">Never Miss Deadlines</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Automatic invoice generation every Saturday</li>
                  <li>• Progressive reminder system (Tuesday, Thursday, Friday)</li>
                  <li>• Real-time deadline monitoring</li>
                  <li>• Overdue invoice alerts</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Streamlined Workflow</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Pre-populated with contractor rates</li>
                  <li>• Automatic AFE code generation</li>
                  <li>• Smart work period calculation</li>
                  <li>• One-click submission when complete</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-700 mb-2">Quality Assurance</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Missing item detection</li>
                  <li>• Receipt requirement tracking</li>
                  <li>• Automatic tax calculations (GST)</li>
                  <li>• Submission readiness validation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Financial Control</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time earning projections</li>
                  <li>• Cash flow forecasting</li>
                  <li>• Payment tracking integration</li>
                  <li>• Multi-client support</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-indigo-700 mb-2">Stack Integration</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Perfect payroll calendar alignment</li>
                  <li>• Production testing project codes</li>
                  <li>• Standard rate structures</li>
                  <li>• Equipment rental tracking</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-700 mb-2">Technical Excellence</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cron-based job scheduling</li>
                  <li>• Multi-channel notifications</li>
                  <li>• Calendar synchronization</li>
                  <li>• Error monitoring & alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                Notification System
              </h3>
              <NotificationCenter />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Notification Schedule</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <div className="font-medium text-blue-900">Saturday 8 AM</div>
                    <div className="text-sm text-gray-600">Invoice auto-generated and ready for review</div>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-3">
                    <div className="font-medium text-yellow-900">Tuesday 9 AM</div>
                    <div className="text-sm text-gray-600">Friendly reminder with completion status</div>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3">
                    <div className="font-medium text-orange-900">Thursday 10 AM</div>
                    <div className="text-sm text-gray-600">Urgent reminder - due tomorrow</div>
                  </div>
                  <div className="border-l-4 border-red-500 pl-3">
                    <div className="font-medium text-red-900">Friday 8 AM</div>
                    <div className="text-sm text-gray-600">Final notice - due today</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Delivery Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Email Notifications</div>
                      <div className="text-sm text-green-700">Detailed messages with direct links</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">In-App Notifications</div>
                      <div className="text-sm text-blue-700">Real-time alerts with action buttons</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-900">SMS Alerts (Optional)</div>
                      <div className="text-sm text-purple-700">Critical deadline reminders</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Status Footer */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isAutomationRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                Stack Automation: {isAutomationRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            
            {automationStats && (
              <div className="text-sm text-gray-600">
                Next scheduled job: {
                  automationStats.nextRuns.length > 0 
                    ? `${automationStats.nextRuns[0].name} - ${formatDate(automationStats.nextRuns[0].nextRun)}`
                    : 'None scheduled'
                }
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationShowcase; 