'use client'

import React, { useState, useMemo } from 'react'
import { LogOut, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { generateContractorInvoices, calculateStats } from '@/lib/mockData'

// Enhanced mock data generator
const generateDashboardData = () => {
  const today = new Date()
  const nextCutoff = new Date(today)
  nextCutoff.setDate(today.getDate() + ((4 - today.getDay() + 7) % 7)) // Next Thursday
  
  const currentPeriodStart = new Date(nextCutoff)
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 13)
  
  // Generate realistic invoice data
  const allInvoices = generateContractorInvoices(30)
  
  // Mark some as processed for demo
  const processedInvoices = allInvoices.slice(0, 20).map(inv => ({ ...inv, processed: true }))
  const pendingInvoices = allInvoices.slice(20)
  
  const invoices = [...processedInvoices, ...pendingInvoices]
  const stats = calculateStats(invoices)
  
  return {
    nextCutoff: nextCutoff.toISOString(),
    currentPeriod: {
      start: currentPeriodStart.toISOString(),
      end: nextCutoff.toISOString()
    },
    invoices,
    stats: {
      pending: stats.pending,
      pendingAmount: stats.pendingAmount,
      reconciled: stats.reconciled,
      reconciledAmount: stats.reconciledAmount,
      issues: stats.flagged,
      avgProcessingTime: '12 minutes'
    },
    recentActivity: pendingInvoices.slice(0, 4).map(inv => ({
      contractor: inv.contractor,
      amount: inv.amount,
      status: inv.status === 'flagged' ? 'flagged' : 'pending',
      confidence: inv.confidence,
      issue: inv.issues
    }))
  }
}

export default function ManagerDashboard() {
  const data = useMemo(() => generateDashboardData(), [])
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Calculate days until cutoff
  const daysUntilCutoff = Math.ceil(
    (new Date(data.nextCutoff).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-sm font-medium">InvoicePatch Manager</h1>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Info Bar */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Next Cutoff */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Next submission deadline</p>
              <p className="text-2xl font-light">
                {formatDate(data.nextCutoff)}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {daysUntilCutoff} days remaining
              </p>
            </div>

            {/* Current Period */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Current pay period</p>
              <p className="text-2xl font-light">
                {formatDate(data.currentPeriod.start)} - {formatDate(data.currentPeriod.end)}
              </p>
            </div>

            {/* Quick Action */}
            <div className="flex items-end">
              <button className="w-full md:w-auto px-6 py-3 bg-black text-white font-medium hover:bg-gray-900 transition-colors flex items-center justify-center">
                Process Invoices
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Pending */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-2xl font-light">{data.stats.pending}</span>
            </div>
            <p className="text-sm text-gray-600">Pending review</p>
            <p className="text-xs text-gray-500 mt-1">
              ${data.stats.pendingAmount.toLocaleString()}
            </p>
          </div>

          {/* Reconciled */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-light">{data.stats.reconciled}</span>
            </div>
            <p className="text-sm text-gray-600">Reconciled</p>
            <p className="text-xs text-gray-500 mt-1">
              ${data.stats.reconciledAmount.toLocaleString()}
            </p>
          </div>

          {/* Issues */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-2xl font-light">{data.stats.issues}</span>
            </div>
            <p className="text-sm text-gray-600">Need attention</p>
            <p className="text-xs text-gray-500 mt-1">
              Resolve today
            </p>
          </div>

          {/* Efficiency */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="w-5 h-5" /> {/* Empty div for alignment */}
              <span className="text-2xl font-light">{data.stats.avgProcessingTime}</span>
            </div>
            <p className="text-sm text-gray-600">Avg. processing</p>
            <p className="text-xs text-gray-500 mt-1">
              vs 6 hours manual
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-900">Recent submissions</h2>
            <button className="text-sm text-gray-500 hover:text-black transition-colors">
              View all →
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {data.recentActivity.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0">
                    <td className="py-4 px-6">
                      <p className="font-medium text-sm">{item.contractor}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ${item.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <p className="text-sm text-gray-600">
                        {item.confidence}% match
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {item.status === 'pending' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          {item.issue}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 