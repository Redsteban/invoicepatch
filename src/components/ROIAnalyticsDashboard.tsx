'use client';

import React from 'react';

const ROIAnalyticsDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            InvoicePatch ROI Analytics
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Real-time business impact measurement and competitive positioning
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Live Metrics */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Live Performance Metrics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">$47,892</div>
              <div className="text-gray-600">Saved This Month</div>
              <div className="mt-2 text-sm text-gray-500">+23% vs last month</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">127</div>
              <div className="text-gray-600">Hours Saved</div>
              <div className="mt-2 text-sm text-gray-500">~3.2 hours/day</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">94%</div>
              <div className="text-gray-600">Auto-Match Rate</div>
              <div className="mt-2 text-sm text-gray-500">Industry leading</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">18x</div>
              <div className="text-gray-600">ROI Multiple</div>
              <div className="mt-2 text-sm text-gray-500">$299 → $5,382 value</div>
            </div>
          </div>
        </div>
        
        {/* Industry Benchmarks */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Industry Benchmarks</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-3">Manual Processing</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">8 hours/week</div>
              <div className="text-gray-600">Average reconciliation time</div>
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <div className="text-sm text-red-700 font-medium">High Error Rate</div>
                <div className="text-xs text-red-600">~15% mistakes</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-3">With InvoicePatch</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">12 minutes/week</div>
              <div className="text-gray-600">New reconciliation time</div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700 font-medium">Near-Perfect Accuracy</div>
                <div className="text-xs text-gray-600">0.2% error rate</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-3">Time Savings</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">96.25%</div>
              <div className="text-gray-600">Efficiency improvement</div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700 font-medium">Free Up Resources</div>
                <div className="text-xs text-gray-600">Focus on strategy</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Competitive Analysis */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Competitive Analysis</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center p-4 font-semibold text-gray-900 bg-gray-50">InvoicePatch</th>
                  <th className="text-center p-4 font-semibold text-gray-600">Competitor A</th>
                  <th className="text-center p-4 font-semibold text-gray-600">Competitor B</th>
                  <th className="text-center p-4 font-semibold text-gray-600">Manual Process</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Reconciliation Speed</td>
                  <td className="p-4 text-center bg-gray-50">
                    <span className="font-bold text-gray-900">30 seconds</span>
                    <div className="text-xs text-gray-600 mt-1">AI-powered</div>
                  </td>
                  <td className="p-4 text-center text-gray-600">2 hours</td>
                  <td className="p-4 text-center text-gray-600">45 minutes</td>
                  <td className="p-4 text-center text-gray-600">8 hours</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Multi-Format Intake</td>
                  <td className="p-4 text-center bg-gray-50">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      ✓ All formats
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      ✗ PDF only
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      ~ Limited
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      ✗ Manual entry
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Canadian Compliance</td>
                  <td className="p-4 text-center bg-gray-50">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      ✓ Built-in CRA
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      ✗ None
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      ✗ None
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      ~ Manual setup
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Fraud Detection</td>
                  <td className="p-4 text-center bg-gray-50">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      ✓ AI-powered
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      ✗ Basic rules
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      ✗ None
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      ✗ Human only
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Monthly Cost</td>
                  <td className="p-4 text-center bg-gray-50">
                    <span className="font-bold text-gray-900">$299</span>
                    <div className="text-xs text-gray-600 mt-1">Full feature set</div>
                  </td>
                  <td className="p-4 text-center text-gray-600">$800</td>
                  <td className="p-4 text-center text-gray-600">$1,200</td>
                  <td className="p-4 text-center text-gray-600">$1,400+ labor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Savings Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Cost Savings Breakdown</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Before InvoicePatch</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Manager time (32 hours @ $45/hr)</span>
                  <span className="font-medium text-gray-900">$1,440</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Error correction & rework</span>
                  <span className="font-medium text-gray-900">$680</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Delayed payments (interest cost)</span>
                  <span className="font-medium text-gray-900">$320</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-3">
                  <span className="font-semibold text-gray-900">Total Monthly Cost</span>
                  <span className="font-bold text-gray-900 text-lg">$2,440</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">With InvoicePatch</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">InvoicePatch subscription</span>
                  <span className="font-medium text-gray-900">$299</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Manager oversight (3 hours @ $45/hr)</span>
                  <span className="font-medium text-gray-900">$135</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Setup & maintenance</span>
                  <span className="font-medium text-gray-900">$50</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-3">
                  <span className="font-semibold text-gray-900">Total Monthly Cost</span>
                  <span className="font-bold text-gray-900 text-lg">$484</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">$1,956</div>
            <div className="text-gray-600">Monthly Savings</div>
            <div className="text-sm text-gray-500 mt-1">80% cost reduction</div>
          </div>
        </div>

        {/* ROI Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">ROI Summary</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">3.2 weeks</div>
              <div className="text-gray-600">Payback Period</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">656%</div>
              <div className="text-gray-600">Annual ROI</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$23,472</div>
              <div className="text-gray-600">Annual Savings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIAnalyticsDashboard; 