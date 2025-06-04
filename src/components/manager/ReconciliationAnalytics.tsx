'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BoltIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  timeRange: '7d' | '30d' | '90d';
  timeSavings: {
    traditional: number;
    automated: number;
    hoursSaved: number;
    percentageImprovement: number;
  };
  accuracy: {
    autoMatchRate: number;
    errorRate: number;
    reviewTime: number;
    correctionRate: number;
  };
  contractors: ContractorPerformance[];
  processEfficiency: {
    throughput: number;
    avgProcessingTime: number;
    exceptionRate: number;
    autoFixRate: number;
  };
}

interface ContractorPerformance {
  id: string;
  name: string;
  invoiceCount: number;
  errorRate: number;
  avgProcessingTime: number;
  complianceScore: number;
  trend: 'improving' | 'declining' | 'stable';
}

export default function ReconciliationAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const analyticsData: AnalyticsData = {
    timeRange,
    timeSavings: {
      traditional: timeRange === '7d' ? 42 : timeRange === '30d' ? 186 : 567,
      automated: timeRange === '7d' ? 8.4 : timeRange === '30d' ? 37.2 : 113.4,
      hoursSaved: timeRange === '7d' ? 33.6 : timeRange === '30d' ? 148.8 : 453.6,
      percentageImprovement: 80
    },
    accuracy: {
      autoMatchRate: 94.7,
      errorRate: 2.3,
      reviewTime: 4.2,
      correctionRate: 12.8
    },
    contractors: [
      {
        id: '1',
        name: 'John Smith Contracting Ltd.',
        invoiceCount: 28,
        errorRate: 3.2,
        avgProcessingTime: 38,
        complianceScore: 96.8,
        trend: 'improving'
      },
      {
        id: '2',
        name: 'Mike Johnson Contracting',
        invoiceCount: 22,
        errorRate: 8.1,
        avgProcessingTime: 62,
        complianceScore: 84.3,
        trend: 'declining'
      },
      {
        id: '3',
        name: 'Sarah Thompson Ltd.',
        invoiceCount: 35,
        errorRate: 1.8,
        avgProcessingTime: 28,
        complianceScore: 98.7,
        trend: 'stable'
      },
      {
        id: '4',
        name: 'Arctic Drilling Solutions',
        invoiceCount: 19,
        errorRate: 5.4,
        avgProcessingTime: 45,
        complianceScore: 91.2,
        trend: 'improving'
      }
    ],
    processEfficiency: {
      throughput: timeRange === '7d' ? 104 : timeRange === '30d' ? 452 : 1387,
      avgProcessingTime: 41.3,
      exceptionRate: 18.4,
      autoFixRate: 67.8
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-100';
    if (score >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-8">
      {/* Header with Time Range Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Reconciliation Analytics</h3>
            <p className="text-sm text-gray-600">Performance metrics and efficiency insights</p>
          </div>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  timeRange === range
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{analyticsData.timeSavings.hoursSaved}h</div>
            <div className="text-sm text-green-700">Hours Saved</div>
            <div className="text-xs text-gray-500 mt-1">vs traditional process</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{analyticsData.accuracy.autoMatchRate}%</div>
            <div className="text-sm text-blue-700">Auto-Match Rate</div>
            <div className="text-xs text-gray-500 mt-1">successful reconciliation</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{analyticsData.processEfficiency.throughput}</div>
            <div className="text-sm text-purple-700">Invoices Processed</div>
            <div className="text-xs text-gray-500 mt-1">in {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">{analyticsData.timeSavings.percentageImprovement}%</div>
            <div className="text-sm text-yellow-700">Faster Processing</div>
            <div className="text-xs text-gray-500 mt-1">efficiency improvement</div>
          </div>
        </div>
      </div>

      {/* Time Savings Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h4 className="text-lg font-medium text-gray-900">Time Savings Analysis</h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h5 className="font-medium text-gray-700 mb-4">Processing Time Comparison</h5>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Traditional Manual Process</span>
                  <span className="text-sm font-medium text-red-600">{analyticsData.timeSavings.traditional}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Automated Reconciliation</span>
                  <span className="text-sm font-medium text-green-600">{analyticsData.timeSavings.automated}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <BoltIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">
                  {analyticsData.timeSavings.hoursSaved} hours saved in {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Equivalent to ${Math.round(analyticsData.timeSavings.hoursSaved * 65).toLocaleString()} in labor costs
              </p>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 mb-4">Process Breakdown</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Invoice Review & Validation:</span>
                <span className="text-sm font-medium">85% faster</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Data Entry & Mapping:</span>
                <span className="text-sm font-medium">92% faster</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Work Order Matching:</span>
                <span className="text-sm font-medium">78% faster</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Exception Handling:</span>
                <span className="text-sm font-medium">68% faster</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium text-gray-900">Overall Improvement:</span>
                <span className="font-bold text-green-600">{analyticsData.timeSavings.percentageImprovement}% faster</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy & Quality Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
          <h4 className="text-lg font-medium text-gray-900">Accuracy & Quality Metrics</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{analyticsData.accuracy.autoMatchRate}%</div>
            <div className="text-sm text-green-700">Auto-Match Success</div>
            <div className="text-xs text-gray-500 mt-1">invoices processed without review</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <ExclamationTriangleIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{analyticsData.accuracy.errorRate}%</div>
            <div className="text-sm text-blue-700">Error Rate</div>
            <div className="text-xs text-gray-500 mt-1">false positives/negatives</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{analyticsData.accuracy.reviewTime}min</div>
            <div className="text-sm text-purple-700">Avg Review Time</div>
            <div className="text-xs text-gray-500 mt-1">for flagged exceptions</div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <SparklesIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{analyticsData.accuracy.correctionRate}%</div>
            <div className="text-sm text-yellow-700">Auto-Correction Rate</div>
            <div className="text-xs text-gray-500 mt-1">issues resolved automatically</div>
          </div>
        </div>
      </div>

      {/* Contractor Performance Scoring */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-6 w-6 text-indigo-600 mr-3" />
            <h4 className="text-lg font-medium text-gray-900">Contractor Performance Scoring</h4>
          </div>
          <div className="text-sm text-gray-600">
            Based on invoice quality, compliance, and processing efficiency
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contractor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoices
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Processing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.contractors.map((contractor) => (
                <motion.tr
                  key={contractor.id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: parseInt(contractor.id) * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contractor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contractor.invoiceCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      contractor.errorRate < 3 ? 'bg-green-100 text-green-800' :
                      contractor.errorRate < 6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {contractor.errorRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contractor.avgProcessingTime}s</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplianceColor(contractor.complianceScore)}`}>
                      {contractor.complianceScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTrendIcon(contractor.trend)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{contractor.trend}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Efficiency */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
          <h4 className="text-lg font-medium text-gray-900">Process Efficiency Reporting</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="font-medium text-gray-700 mb-4">Exception Handling</h5>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Auto-Fixed Issues</span>
                <span className="text-lg font-bold text-green-600">{analyticsData.processEfficiency.autoFixRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-900">Manual Review Required</span>
                <span className="text-lg font-bold text-yellow-600">{analyticsData.processEfficiency.exceptionRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Avg Processing Time</span>
                <span className="text-lg font-bold text-blue-600">{analyticsData.processEfficiency.avgProcessingTime}s</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 mb-4">ROI Calculation</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Labor Cost Savings:</span>
                <span className="text-sm font-medium">${Math.round(analyticsData.timeSavings.hoursSaved * 65).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Error Reduction Savings:</span>
                <span className="text-sm font-medium">$8,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Faster Processing Value:</span>
                <span className="text-sm font-medium">$12,300</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium text-gray-900">Total ROI ({timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}):</span>
                <span className="font-bold text-green-600">
                  ${(Math.round(analyticsData.timeSavings.hoursSaved * 65) + 8450 + 12300).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center">
                <ArrowUpIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((Math.round(analyticsData.timeSavings.hoursSaved * 65) + 8450 + 12300) / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90))} 
                  /day value delivered
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 