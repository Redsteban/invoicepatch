'use client';

import React from 'react';

const ROIAnalyticsDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-[#1a1a1a] text-center">
            InvoicePatch ROI Analytics
          </h1>
          <p className="text-[#6b7280] text-center mt-2">
            Real-time business impact measurement and competitive positioning
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Live Metrics */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Live Performance Metrics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-[#1a1a1a] mb-2">$47,892</div>
              <div className="text-[#6b7280]">Saved This Month</div>
              <div className="mt-2 text-sm text-[#9ca3af]">+23% vs last month</div>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-[#1a1a1a] mb-2">127</div>
              <div className="text-[#6b7280]">Hours Saved</div>
              <div className="mt-2 text-sm text-[#9ca3af]">~3.2 hours/day</div>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-[#1a1a1a] mb-2">94%</div>
              <div className="text-[#6b7280]">Auto-Match Rate</div>
              <div className="mt-2 text-sm text-[#9ca3af]">Industry leading</div>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-[#1a1a1a] mb-2">18x</div>
              <div className="text-[#6b7280]">ROI Multiple</div>
              <div className="mt-2 text-sm text-[#9ca3af]">$299 → $5,382 value</div>
            </div>
          </div>
        </div>
        
        {/* Industry Benchmarks */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Industry Benchmarks</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-[#1a1a1a] mb-3">Manual Processing</h3>
              <div className="text-4xl font-bold text-[#1a1a1a] mb-2">8 hours/week</div>
              <div className="text-[#6b7280]">Average reconciliation time</div>
              <div className="mt-3 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg">
                <div className="text-sm text-[#dc2626] font-medium">High Error Rate</div>
                <div className="text-xs text-[#ef4444]">~15% mistakes</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[#1a1a1a] mb-3">With InvoicePatch</h3>
              <div className="text-4xl font-bold text-[#1a1a1a] mb-2">12 minutes/week</div>
              <div className="text-[#6b7280]">New reconciliation time</div>
              <div className="mt-3 p-3 bg-[#f0f9ff] border border-[#3b82f6]/20 rounded-lg">
                <div className="text-sm text-[#3b82f6] font-medium">Near-Perfect Accuracy</div>
                <div className="text-xs text-[#2563eb]">0.2% error rate</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[#1a1a1a] mb-3">Time Savings</h3>
              <div className="text-4xl font-bold text-[#1a1a1a] mb-2">96.25%</div>
              <div className="text-[#6b7280]">Efficiency improvement</div>
              <div className="mt-3 p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg">
                <div className="text-sm text-[#1a1a1a] font-medium">Free Up Resources</div>
                <div className="text-xs text-[#6b7280]">Focus on strategy</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Competitive Analysis */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Competitive Analysis</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left p-4 font-semibold text-[#1a1a1a]">Feature</th>
                  <th className="text-center p-4 font-semibold text-[#1a1a1a] bg-[#f9fafb]">InvoicePatch</th>
                  <th className="text-center p-4 font-semibold text-[#6b7280]">Competitor A</th>
                  <th className="text-center p-4 font-semibold text-[#6b7280]">Competitor B</th>
                  <th className="text-center p-4 font-semibold text-[#6b7280]">Manual Process</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#f3f4f6]">
                  <td className="p-4 font-medium text-[#1a1a1a]">Reconciliation Speed</td>
                  <td className="p-4 text-center bg-[#f9fafb]">
                    <span className="font-bold text-[#1a1a1a]">30 seconds</span>
                    <div className="text-xs text-[#6b7280] mt-1">AI-powered</div>
                  </td>
                  <td className="p-4 text-center text-[#6b7280]">2 hours</td>
                  <td className="p-4 text-center text-[#6b7280]">45 minutes</td>
                  <td className="p-4 text-center text-[#6b7280]">8 hours</td>
                </tr>
                <tr className="border-b border-[#f3f4f6]">
                  <td className="p-4 font-medium text-[#1a1a1a]">Multi-Format Intake</td>
                  <td className="p-4 text-center bg-[#f9fafb]">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3b82f6] text-white">
                      ✓ All formats
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#dc2626]">
                      ✗ PDF only
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fefce8] text-[#f59e0b]">
                      ~ Limited
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#dc2626]">
                      ✗ Manual entry
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#f3f4f6]">
                  <td className="p-4 font-medium text-[#1a1a1a]">Canadian Compliance</td>
                  <td className="p-4 text-center bg-[#f9fafb]">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3b82f6] text-white">
                      ✓ Built-in CRA
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#dc2626]">
                      ✗ None
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#dc2626]">
                      ✗ None
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fefce8] text-[#f59e0b]">
                      ~ Manual setup
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#f3f4f6]">
                  <td className="p-4 font-medium text-[#1a1a1a]">Fraud Detection</td>
                  <td className="p-4 text-center bg-[#f9fafb]">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3b82f6] text-white">
                      ✓ AI-powered
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#dc2626]">
                      ✗ Basic rules
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#dc2626]">
                      ✗ None
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#dc2626]">
                      ✗ Human only
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#1a1a1a]">Monthly Cost</td>
                  <td className="p-4 text-center bg-[#f9fafb]">
                    <span className="font-bold text-[#1a1a1a]">$299</span>
                    <div className="text-xs text-[#6b7280] mt-1">Full feature set</div>
                  </td>
                  <td className="p-4 text-center text-[#6b7280]">$800</td>
                  <td className="p-4 text-center text-[#6b7280]">$1,200</td>
                  <td className="p-4 text-center text-[#6b7280]">$1,400+ labor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Savings Breakdown */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Monthly Cost Savings Breakdown</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-4">Before InvoicePatch</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                  <span className="text-[#6b7280]">Manager time (32 hours @ $45/hr)</span>
                  <span className="font-medium text-[#1a1a1a]">$1,440</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                  <span className="text-[#6b7280]">Error correction & rework</span>
                  <span className="font-medium text-[#1a1a1a]">$680</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                  <span className="text-[#6b7280]">Delayed payments (interest cost)</span>
                  <span className="font-medium text-[#1a1a1a]">$320</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-[#f9fafb] rounded-lg px-3">
                  <span className="font-semibold text-[#1a1a1a]">Total Monthly Cost</span>
                  <span className="font-bold text-[#1a1a1a] text-lg">$2,440</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-4">With InvoicePatch</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                  <span className="text-[#6b7280]">InvoicePatch subscription</span>
                  <span className="font-medium text-[#1a1a1a]">$299</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                  <span className="text-[#6b7280]">Manager oversight (3 hours @ $45/hr)</span>
                  <span className="font-medium text-[#1a1a1a]">$135</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                  <span className="text-[#6b7280]">Setup & maintenance</span>
                  <span className="font-medium text-[#1a1a1a]">$50</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-[#f9fafb] rounded-lg px-3">
                  <span className="font-semibold text-[#1a1a1a]">Total Monthly Cost</span>
                  <span className="font-bold text-[#1a1a1a] text-lg">$484</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-[#f0f9ff] border border-[#3b82f6]/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#3b82f6] mb-2">$1,956</div>
            <div className="text-[#6b7280]">Monthly Savings</div>
            <div className="text-sm text-[#9ca3af] mt-1">80% cost reduction</div>
          </div>
        </div>

        {/* ROI Summary */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">ROI Summary</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-[#1a1a1a] mb-2">3.2 weeks</div>
              <div className="text-[#6b7280]">Payback Period</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1a1a1a] mb-2">656%</div>
              <div className="text-[#6b7280]">Annual ROI</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1a1a1a] mb-2">$23,472</div>
              <div className="text-[#6b7280]">Annual Savings</div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-[#f0f9ff] border border-[#3b82f6]/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Ready to Get Started?</h2>
          <p className="text-[#6b7280] mb-6">
            Schedule a personalized demo to see how InvoicePatch can deliver these results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/manager/login"
              className="bg-[#3b82f6] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2563eb] transition-colors duration-200"
            >
              Schedule Demo
            </a>
            <a
              href="/contractor-trial"
              className="border border-[#e5e7eb] text-[#1a1a1a] px-8 py-3 rounded-lg font-medium hover:bg-[#f9fafb] transition-colors duration-200"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIAnalyticsDashboard; 