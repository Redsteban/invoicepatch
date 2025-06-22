'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building, Upload, Zap, BarChart3, FileCheck, DollarSign, Clock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManagerDemo() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center">
              <Building className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">Invoice</span>Patch
              </span>
            </div>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
              Manager Demo Experience
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            See Your ROI in Real-Time
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the AI-powered invoice processing that saves construction managers 
            6+ hours weekly and reduces costs by $50K+ annually.
          </p>
        </div>

        {/* Main Demo Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Live Demo */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Processing Demo</h2>
              <p className="text-lg text-gray-600">
                Upload real invoices and watch AI process them in seconds
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">Upload 20+ invoices in any format</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">Watch AI extract data in 30 seconds</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <FileCheck className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">Auto-reconcile with payroll systems</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">Export to QuickBooks/FieldCap</span>
              </div>
            </div>
            
            <Link href="/manager-intake" className="block">
              <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors group-hover:bg-blue-700">
                Try Live Demo
              </button>
            </Link>
            <p className="text-center text-blue-600 text-sm mt-3 font-medium">
              Real AI processing • 5 minutes
            </p>
          </div>

          {/* ROI Calculator */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                See Your Savings
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">ROI Calculator</h2>
              <p className="text-lg text-gray-600">
                Calculate your exact savings based on your current invoice volume
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">Time savings: 6+ hours weekly</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">Cost reduction: $50K+ annually</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">Scale with your team size</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">Custom ROI report generated</span>
              </div>
            </div>
            
            <Link href="/roi-calculator" className="block">
              <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors group-hover:bg-blue-700">
                Calculate My ROI
              </button>
            </Link>
            <p className="text-center text-blue-600 text-sm mt-3 font-medium">
              Personalized savings • Instant results
            </p>
          </div>
        </div>

        {/* Quick Preview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Manager Workflow Preview</h3>
            <p className="text-gray-600">
              See the complete invoice processing workflow in 60 seconds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Upload</div>
              <div className="text-xs text-gray-500 mt-1">Bulk invoice upload</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Process</div>
              <div className="text-xs text-gray-500 mt-1">AI extraction</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Review</div>
              <div className="text-xs text-gray-500 mt-1">Auto-validation</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Export</div>
              <div className="text-xs text-gray-500 mt-1">To accounting</div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/manager-demo" className="inline-block">
              <button className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Watch Workflow Preview
              </button>
            </Link>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mt-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Why Construction Managers Choose InvoicePatch</h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join 500+ construction companies that have eliminated invoice processing headaches
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">75%</div>
              <div className="text-lg opacity-90">Time Savings</div>
              <div className="text-sm opacity-75 mt-1">From 8 hours to 2 hours weekly</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$50K+</div>
              <div className="text-lg opacity-90">Annual Savings</div>
              <div className="text-sm opacity-75 mt-1">Reduced processing costs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-lg opacity-90">Accuracy Rate</div>
              <div className="text-sm opacity-75 mt-1">AI-powered validation</div>
            </div>
          </div>
        </div>

        {/* Bottom Support */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Ready to see how InvoicePatch transforms your invoice processing?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-sales" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
              Schedule Personal Demo
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <Link href="/manager-marketing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Learn More About Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
