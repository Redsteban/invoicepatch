'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Invoice {
  id: string
  invoice_number: string
  period_start: string
  period_end: string
  submission_deadline: string
  status: string
  company: string
  location: string
  ticket_number: string
  total_days_worked: number
  grand_total: number
  type: string
}

const ContractorHomePage = () => {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState('')
  
  // Updated to use current system email
  const [userEmail] = useState('invoices@invoicepatch.com')

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const response = await fetch(`/api/contractor/invoices?userEmail=${encodeURIComponent(userEmail)}`)
      const data = await response.json()
      
      if (data.success) {
        setInvoices(data.invoices)
      } else {
        setError(data.error || 'Failed to load invoices')
      }
    } catch (error) {
      console.error('Failed to load invoices:', error)
      setError('Failed to connect to database')
    } finally {
      setLoading(false)
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getTrialDaysRemaining = () => {
    // Calculate trial days based on the first trial invoice
    const trialInvoice = invoices.find(inv => inv.type === 'trial')
    if (!trialInvoice) return 15
    
    const trialStartDate = new Date(trialInvoice.period_start)
    const today = new Date()
    const daysUsed = Math.floor((today.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, 15 - daysUsed)
  }

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  const handleQuickLogWork = (invoiceId: string, pastDate?: string) => {
    if (pastDate) {
      router.push(`/contractor/invoice/${invoiceId}?date=${pastDate}`)
    } else {
      router.push(`/contractor/invoice/${invoiceId}`)
    }
  }

  const generateDateOptions = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const dates = []
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0])
    }
    
    return dates
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-lg font-medium text-red-800 mb-2">Connection Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={loadInvoices}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Get the most recent active trial invoice
  const currentInvoice = invoices
    .filter(inv => inv.type === 'trial' && inv.status === 'active')
    .sort((a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime())[0]

  const trialDaysLeft = getTrialDaysRemaining()
  const availableDates = currentInvoice ? generateDateOptions(currentInvoice.period_start, currentInvoice.period_end) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">InvoicePatch</h1>
              <p className="text-gray-600">Invoice tracking for your trial period</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">15-Day Trial</p>
                  <p className="text-xs text-gray-500">{trialDaysLeft} days remaining</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Trial Progress Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-blue-900 mb-1">🚀 Your 15-Day Trial</h3>
              <p className="text-blue-700">
                {15 - trialDaysLeft} of 15 days used • Full access to all features
              </p>
              {currentInvoice && (
                <p className="text-sm text-blue-600 mt-1">
                  Trial period: {formatPeriod(currentInvoice.period_start, currentInvoice.period_end)}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="w-32 bg-blue-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((15 - trialDaysLeft) / 15) * 100}%` }}
                />
              </div>
              <p className="text-sm text-blue-600">{trialDaysLeft} days left</p>
            </div>
          </div>
        </div>

        {/* Current Invoice */}
        {currentInvoice ? (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Current Trial Period: {formatPeriod(currentInvoice.period_start, currentInvoice.period_end)}
            </h2>
            
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {currentInvoice.invoice_number}
                  </h3>
                  <p className="text-gray-600 mb-1">{currentInvoice.company}</p>
                  <p className="text-sm text-gray-500">{currentInvoice.location}</p>
                  {currentInvoice.ticket_number && (
                    <p className="text-sm text-gray-500">Ticket: {currentInvoice.ticket_number}</p>
                  )}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    Trial Invoice
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Current Earnings</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${currentInvoice.grand_total?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentInvoice.total_days_worked} days worked
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Period</p>
                  <p className="font-medium">{formatPeriod(currentInvoice.period_start, currentInvoice.period_end)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Days Worked</p>
                  <p className="font-medium">{currentInvoice.total_days_worked} days</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Submission Due</p>
                  <p className="font-medium">{new Date(currentInvoice.submission_deadline).toLocaleDateString()}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Days Remaining</p>
                  <p className={`font-medium ${getDaysUntilDeadline(currentInvoice.submission_deadline) <= 3 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.max(0, getDaysUntilDeadline(currentInvoice.submission_deadline))} days
                  </p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleQuickLogWork(currentInvoice.id)}
                  className="p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-medium mb-1">Log Today's Work</div>
                  <div className="text-sm text-blue-100">Quick entry for today</div>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-left"
                  >
                    <div className="text-2xl mb-2">📅</div>
                    <div className="font-medium mb-1">Log Past Days</div>
                    <div className="text-sm text-gray-500">Select any date from your trial period</div>
                  </button>
                  
                  {showDatePicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10">
                      <p className="text-sm font-medium text-gray-700 mb-3">Select a date to log work:</p>
                      
                      {/* Date input */}
                      <input
                        type="date"
                        min={currentInvoice.period_start}
                        max={currentInvoice.period_end}
                        value={selectedStartDate}
                        onChange={(e) => setSelectedStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mb-3"
                      />
                      
                      {/* Quick date buttons */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {availableDates.slice(-6).map((date) => {
                          const dateObj = new Date(date)
                          const isToday = date === new Date().toISOString().split('T')[0]
                          const isPast = new Date(date) < new Date(new Date().toISOString().split('T')[0])
                          
                          return (
                            <button
                              key={date}
                              onClick={() => setSelectedStartDate(date)}
                              className={`p-2 text-xs rounded-lg border transition-colors ${
                                selectedStartDate === date 
                                  ? 'bg-blue-600 text-white border-blue-600' 
                                  : 'border-gray-200 hover:border-gray-300'
                              } ${isToday ? 'ring-2 ring-blue-200' : ''}`}
                            >
                              <div className="font-medium">
                                {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xs opacity-75">
                                {isToday ? 'Today' : isPast ? 'Past' : 'Future'}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (selectedStartDate) {
                              handleQuickLogWork(currentInvoice.id, selectedStartDate)
                            }
                          }}
                          disabled={!selectedStartDate}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Log Work for {selectedStartDate ? new Date(selectedStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Selected Date'}
                        </button>
                        <button
                          onClick={() => {
                            setShowDatePicker(false)
                            setSelectedStartDate('')
                          }}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => router.push(`/contractor/dashboard/${currentInvoice.id}`)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium mb-1">View Dashboard</div>
                  <div className="text-sm text-gray-500">Insights and analytics</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h2 className="text-lg font-medium text-yellow-800 mb-2">
                🎯 Ready to Start Your Trial?
              </h2>
              <p className="text-yellow-700 mb-4">
                No active trial invoice found. Create a new trial invoice to start tracking your work.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/setup')}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Start Trial
                </button>
                <button
                  onClick={loadInvoices}
                  className="px-6 py-3 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Invoices Table */}
        {invoices.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">All Invoices</h2>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.invoice_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.company}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPeriod(invoice.period_start, invoice.period_end)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.type === 'trial' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.type === 'trial' ? 'Trial' : 'Regular'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          invoice.status === 'active' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                          invoice.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${invoice.grand_total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        <button
                          onClick={() => router.push(`/contractor/dashboard/${invoice.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {invoice.status === 'active' && (
                          <button
                            onClick={() => router.push(`/contractor/invoice/${invoice.id}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Log Work
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {invoices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first trial invoice</p>
            <button
              onClick={() => router.push('/setup')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Your 15-Day Trial
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContractorHomePage 