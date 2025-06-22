'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HardHat, Clock, FileText, Camera, MapPin, Smartphone, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ContractorDemo() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
              <HardHat className="w-8 h-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-green-600">Invoice</span>Patch
              </span>
            </div>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
              Oil & Gas Contractor Demo Experience
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            See How You'll Work Smarter in the Field
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the mobile-first tools built specifically for oil & gas subcontractors. 
            Track service time, document well sites, and get paid faster by operators.
          </p>
        </div>

        {/* Main Demo Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Interactive Demo */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Interactive Demo</h2>
              <p className="text-lg text-gray-600">
                Try the actual mobile interface with real oilfield contractor workflows
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Clock className="w-6 h-6 text-green-600 mr-3" />
                <span className="text-gray-700">Start/stop service timer with GPS tracking at well sites</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Camera className="w-6 h-6 text-green-600 mr-3" />
                <span className="text-gray-700">Upload site photos and equipment inspection shots</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <FileText className="w-6 h-6 text-green-600 mr-3" />
                <span className="text-gray-700">Generate professional operator invoices instantly</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600 mr-3" />
                <span className="text-gray-700">Verify well site location and track equipment expenses</span>
              </div>
            </div>
            
            <Link href="/contractor/dashboard" className="block">
              <button className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors group-hover:bg-green-700">
                Try Interactive Demo
              </button>
            </Link>
            <p className="text-center text-green-600 text-sm mt-3 font-medium">
              Full mobile experience • 5 minutes
            </p>
          </div>

          {/* Guided Trial */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HardHat className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">14-Day Free Trial</h2>
              <p className="text-lg text-gray-600">
                Use InvoicePatch on your actual oilfield projects with full support
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span className="text-gray-700">Track real service hours on drilling/completion projects</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span className="text-gray-700">Create and send actual invoices to operators</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span className="text-gray-700">Personal onboarding and oilfield training</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span className="text-gray-700">No credit card required</span>
              </div>
            </div>
            
            <Link href="/contractor-trial" className="block">
              <button className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors group-hover:bg-green-700">
                Start Free Trial
              </button>
            </Link>
            <p className="text-center text-green-600 text-sm mt-3 font-medium">
              Real projects • Personal support • 14 days
            </p>
          </div>
        </div>

        {/* Quick Preview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Preview</h3>
            <p className="text-gray-600">
              See the oilfield contractor workflow in 60 seconds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Clock In</div>
              <div className="text-xs text-gray-500 mt-1">GPS verified at well site</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Document Service</div>
              <div className="text-xs text-gray-500 mt-1">Site photos & equipment</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Generate Invoice</div>
              <div className="text-xs text-gray-500 mt-1">One-tap operator invoice</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Get Paid</div>
              <div className="text-xs text-gray-500 mt-1">5 days faster</div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/payroll-demo" className="inline-block">
              <button className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Watch Quick Preview
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Support */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Questions about how InvoicePatch works for oil & gas contractors?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-sales" className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors">
              Talk to Oilfield Success Team
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <Link href="/contractor-marketing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Learn More About Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
