'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  CalculatorIcon,
  BanknotesIcon,
  ClockIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  hoursWorked: number;
  projectCount: number;
}

interface ProjectProfitability {
  id: string;
  name: string;
  client: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  status: 'active' | 'completed';
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  taxDeductible: boolean;
  color: string;
}

const BusinessAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const monthlyData: MonthlyData[] = [
    { month: 'Jan 2024', revenue: 18500, expenses: 3200, profit: 15300, hoursWorked: 168, projectCount: 3 },
    { month: 'Feb 2024', revenue: 22100, expenses: 4100, profit: 18000, hoursWorked: 184, projectCount: 4 },
    { month: 'Mar 2024', revenue: 19800, expenses: 3600, profit: 16200, hoursWorked: 172, projectCount: 3 },
    { month: 'Apr 2024', revenue: 25300, expenses: 4800, profit: 20500, hoursWorked: 196, projectCount: 4 },
    { month: 'May 2024', revenue: 21750, expenses: 3900, profit: 17850, hoursWorked: 178, projectCount: 3 },
    { month: 'Jun 2024', revenue: 16200, expenses: 2800, profit: 13400, hoursWorked: 142, projectCount: 2 }
  ];

  const projectProfitability: ProjectProfitability[] = [
    {
      id: '1',
      name: 'Montney Horizontal Well Program',
      client: 'Suncor Energy',
      revenue: 25400,
      expenses: 3200,
      profit: 22200,
      margin: 87.4,
      status: 'active'
    },
    {
      id: '2',
      name: 'Pipeline Integrity Assessment',
      client: 'TC Energy',
      revenue: 18900,
      expenses: 2400,
      profit: 16500,
      margin: 87.3,
      status: 'completed'
    },
    {
      id: '3',
      name: 'Well Site Maintenance',
      client: 'Husky Energy',
      revenue: 12600,
      expenses: 1800,
      profit: 10800,
      margin: 85.7,
      status: 'completed'
    },
    {
      id: '4',
      name: 'Safety Compliance Audit',
      client: 'Imperial Oil',
      revenue: 9500,
      expenses: 1200,
      profit: 8300,
      margin: 87.4,
      status: 'completed'
    }
  ];

  const expenseCategories: ExpenseCategory[] = [
    { category: 'Travel & Accommodation', amount: 8400, percentage: 38.5, taxDeductible: true, color: 'bg-blue-500' },
    { category: 'Equipment & Tools', amount: 4200, percentage: 19.2, taxDeductible: true, color: 'bg-emerald-500' },
    { category: 'Vehicle & Fuel', amount: 3800, percentage: 17.4, taxDeductible: true, color: 'bg-yellow-500' },
    { category: 'Insurance', amount: 2100, percentage: 9.6, taxDeductible: true, color: 'bg-purple-500' },
    { category: 'Training & Certification', amount: 1800, percentage: 8.2, taxDeductible: true, color: 'bg-pink-500' },
    { category: 'Office & Admin', amount: 1600, percentage: 7.3, taxDeductible: true, color: 'bg-orange-500' }
  ];

  const currentYear = new Date().getFullYear();
  const ytdRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const ytdExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const ytdProfit = ytdRevenue - ytdExpenses;
  const estimatedTax = ytdProfit * 0.25; // Rough tax estimate
  const netIncome = ytdProfit - estimatedTax;

  const averageHourlyRate = ytdRevenue / monthlyData.reduce((sum, month) => sum + month.hoursWorked, 0);

  const getPerformanceIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />;
    } else if (current < previous) {
      return <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />;
    }
    return <ArrowPathIcon className="h-5 w-5 text-gray-600" />;
  };

  const getPerformanceColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPerformanceText = (current: number, previous: number) => {
    const change = ((current - previous) / previous * 100).toFixed(1);
    const direction = current > previous ? '+' : '';
    return `${direction}${change}% from last month`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Analytics</h2>
          <p className="text-gray-600">Track your financial performance and business insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <DocumentChartBarIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">YTD Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${ytdRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getPerformanceIcon(monthlyData[5].revenue, monthlyData[4].revenue)}
                <span className={`text-sm ml-1 ${getPerformanceColor(monthlyData[5].revenue, monthlyData[4].revenue)}`}>
                  {getPerformanceText(monthlyData[5].revenue, monthlyData[4].revenue)}
                </span>
              </div>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">${netIncome.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getPerformanceIcon(monthlyData[5].profit, monthlyData[4].profit)}
                <span className={`text-sm ml-1 ${getPerformanceColor(monthlyData[5].profit, monthlyData[4].profit)}`}>
                  {getPerformanceText(monthlyData[5].profit, monthlyData[4].profit)}
                </span>
              </div>
            </div>
            <BanknotesIcon className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Hourly Rate</p>
              <p className="text-2xl font-bold text-gray-900">${averageHourlyRate.toFixed(0)}</p>
              <div className="flex items-center mt-1">
                <ClockIcon className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-gray-600">
                  {monthlyData.reduce((sum, month) => sum + month.hoursWorked, 0)} hours YTD
                </span>
              </div>
            </div>
            <ChartBarIcon className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tax Estimate</p>
              <p className="text-2xl font-bold text-gray-900">${estimatedTax.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <CalculatorIcon className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-gray-600">25% estimated rate</span>
              </div>
            </div>
            <CalculatorIcon className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
        <div className="space-y-4">
          {monthlyData.map((month, index) => (
            <motion.div
              key={month.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{month.month}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-gray-600">Revenue: </span>
                    <span className="font-medium">${month.revenue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expenses: </span>
                    <span className="font-medium">${month.expenses.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Profit: </span>
                    <span className="font-medium text-green-600">${month.profit.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hours: </span>
                    <span className="font-medium">{month.hoursWorked}h</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {((month.profit / month.revenue) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Margin</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Profitability */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Profitability</h3>
        <div className="space-y-3">
          {projectProfitability.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border border-gray-200 rounded-lg p-4 cursor-pointer transition-all ${
                selectedProject === project.id ? 'ring-2 ring-emerald-500 shadow-md' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.client}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Revenue: </span>
                      <span className="font-medium">${project.revenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expenses: </span>
                      <span className="font-medium">${project.expenses.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Profit: </span>
                      <span className="font-medium text-green-600">${project.profit.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Margin: </span>
                      <span className="font-medium">{project.margin}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{project.margin}%</div>
                  <div className="text-sm text-gray-600">Profit Margin</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          <div className="space-y-3">
            {expenseCategories.map((expense, index) => (
              <motion.div
                key={expense.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center flex-1">
                  <div className={`w-4 h-4 rounded ${expense.color} mr-3`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{expense.category}</span>
                      {expense.taxDeductible && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Tax Deductible</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">${expense.amount.toLocaleString()}</span>
                      <span className="text-sm font-medium text-gray-900">{expense.percentage}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Expenses</span>
              <span className="font-bold text-lg text-gray-900">
                ${expenseCategories.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Tax Planning */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Planning ({currentYear})</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Quarterly Estimates</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Q1 Estimate:</span>
                  <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Q2 Estimate:</span>
                  <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Q3 Estimate:</span>
                  <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Q4 Estimate:</span>
                  <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Deductible Expenses</h4>
              <div className="text-sm text-green-700">
                <p className="mb-2">Total deductible: ${expenseCategories.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}</p>
                <p>Potential tax savings: ${(expenseCategories.reduce((sum, exp) => sum + exp.amount, 0) * 0.25).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Recommended Actions</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Set aside 25-30% for taxes</li>
                <li>• Track mileage for vehicle deductions</li>
                <li>• Keep receipts for equipment purchases</li>
                <li>• Consider retirement contributions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trial Mode - Sample Analytics</h3>
            <p className="text-gray-600">
              This shows how your business performance will be tracked. Connect your real financial data to see live analytics and tax planning insights.
            </p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Connect Accounting
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalytics; 