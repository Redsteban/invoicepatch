'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

interface DailyEntry {
  id?: string
  entry_date: string
  worked: boolean
  day_rate_actual?: number
  truck_used: boolean
  truck_rate_actual?: number
  travel_kms_actual: number
  subsistence_actual: number
  hours_worked?: number
  notes?: string
  weather_conditions?: string
}

interface TrialInvoice {
  id: string
  company: string
  start_date: string
  end_date: string
  day_rate: number
  truck_rate: number
}

const DailyWorkEntry = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0]
  
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [currentEntry, setCurrentEntry] = useState({
    entry_date: selectedDate,
    worked: false,
    truck_used: false,
    travel_kms_actual: 45, // Default from typical commute
    subsistence_actual: 75, // Default rate
    hours_worked: 8,
    notes: '',
    weather_conditions: 'clear'
  })
  const [entries, setEntries] = useState<any[]>([])
  const [trialInvoice, setTrialInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false)
  const [showDateSelector, setShowDateSelector] = useState(false)

  // Load trial invoice and entries data
  useEffect(() => {
    loadTrialData()
  }, [params.id])

  // Update current entry when date changes
  useEffect(() => {
    loadEntryForDate(selectedDate)
  }, [selectedDate, entries])

  const loadTrialData = async () => {
    try {
      setLoading(true)
      
      // Load trial invoice data
      const dashboardResponse = await fetch(`/api/contractor/dashboard?trialInvoiceId=${params.id}`)
      const dashboardData = await dashboardResponse.json()
      
      if (dashboardData.success) {
        setTrialInvoice(dashboardData.invoice)
      }
      
      // Load existing entries
      const entriesResponse = await fetch(`/api/contractor/entries?invoiceId=${params.id}`)
      const entriesData = await entriesResponse.json()
      
      if (entriesData.success) {
        setEntries(entriesData.entries)
      }
    } catch (error) {
      console.error('Failed to load trial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEntryForDate = (date: string) => {
    const existingEntry = entries.find(e => e.entry_date === date)
    
    if (existingEntry) {
      setCurrentEntry({
        ...existingEntry,
        entry_date: date
      })
    } else {
      setCurrentEntry({
        entry_date: date,
        worked: false,
        truck_used: false,
        travel_kms_actual: 45,
        subsistence_actual: 75,
        hours_worked: 8,
        notes: '',
        weather_conditions: 'clear'
      })
    }
  }

  const generateDateRange = () => {
    if (!trialInvoice) return []
    
    const start = new Date(trialInvoice.start_date)
    const end = new Date(trialInvoice.end_date)
    const dates = []
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0])
    }
    
    return dates
  }

  // Smart suggestions based on patterns
  const getSmartSuggestions = () => {
    const workEntries = entries.filter(e => e.worked)
    if (workEntries.length === 0) {
      return {
        suggestedHours: 8.5,
        suggestedTravel: 45,
        suggestedSubsistence: 75,
        reason: "Default suggested values"
      }
    }

    const avgHours = workEntries.reduce((sum, e) => sum + (e.hours_worked || 8), 0) / workEntries.length
    const avgTravel = workEntries.reduce((sum, e) => sum + (e.travel_kms_actual || 0), 0) / workEntries.length
    const avgSubsistence = workEntries.reduce((sum, e) => sum + (e.subsistence_actual || 0), 0) / workEntries.length

    return {
      suggestedHours: Math.round(avgHours * 2) / 2, // Round to nearest 0.5
      suggestedTravel: Math.round(avgTravel),
      suggestedSubsistence: Math.round(avgSubsistence),
      reason: `Based on your ${workEntries.length} previous work day(s)`
    }
  }

  const applySmartSuggestions = () => {
    const suggestions = getSmartSuggestions()
    setCurrentEntry({
      ...currentEntry,
      hours_worked: suggestions.suggestedHours,
      travel_kms_actual: suggestions.suggestedTravel,
      subsistence_actual: suggestions.suggestedSubsistence
    })
    setShowSmartSuggestions(false)
  }

  const calculateDayEarnings = () => {
    if (!currentEntry.worked) return 0
    
    const dayRate = 450
    const truckRate = currentEntry.truck_used ? 150 : 0
    const taxableAmount = dayRate + truckRate
    const gst = taxableAmount * 0.05
    const travel = currentEntry.travel_kms_actual * 0.68
    const subsistence = currentEntry.subsistence_actual
    
    return taxableAmount + gst + travel + subsistence
  }

  const saveEntry = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/contractor/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialInvoiceId: params.id,
          date: currentEntry.entry_date,
          worked: currentEntry.worked,
          dayRate: 450,
          truckUsed: currentEntry.truck_used,
          truckRate: 150,
          travelKms: currentEntry.travel_kms_actual,
          subsistence: currentEntry.subsistence_actual,
          hoursWorked: currentEntry.hours_worked,
          notes: currentEntry.notes,
          weatherConditions: currentEntry.weather_conditions
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh the data
        await loadTrialData()
        // Show success message
        alert('✅ Work entry saved successfully!')
        // Auto-redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push(`/contractor/dashboard/${params.id}`)
        }, 2000)
      } else {
        alert('❌ Failed to save entry: ' + data.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('❌ Failed to save entry')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading work entry...</p>
        </div>
      </div>
    )
  }

  const dateRange = generateDateRange()
  const today = new Date().toISOString().split('T')[0]
  const existingEntry = entries.find(e => e.entry_date === selectedDate)
  const workDays = entries.filter(e => e.worked).length
  const totalEarned = entries.reduce((sum, e) => {
    if (!e.worked) return sum
    const dayRate = e.day_rate_actual || 450
    const truckRate = e.truck_used ? (e.truck_rate_actual || 150) : 0
    const taxableAmount = dayRate + truckRate
    const gst = taxableAmount * 0.05
    const travel = (e.travel_kms_actual || 0) * 0.68
    const subsistence = e.subsistence_actual || 0
    return sum + taxableAmount + gst + travel + subsistence
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/contractor/dashboard/${params.id}`)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </button>
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {trialInvoice?.company || 'Trial Invoice'}
              </p>
              <p className="text-sm text-gray-500">Work Entry</p>
            </div>
            <div className="text-sm text-gray-500">
              Quick Entry
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Date Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dateRange.map((date) => {
                  const entry = entries.find(e => e.entry_date === date)
                  const isToday = date === today
                  const isSelected = date === selectedDate
                  
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          {isToday && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                              TODAY
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {entry?.worked ? (
                            <span className="text-green-600 text-sm">✓ Worked</span>
                          ) : entry?.worked === false ? (
                            <span className="text-gray-500 text-sm">Day off</span>
                          ) : (
                            <span className="text-gray-400 text-sm">Not logged</span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h4 className="font-medium text-gray-900 mb-3">📊 Trial Progress</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days Worked</span>
                  <span className="font-medium">{workDays}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Earned</span>
                  <span className="font-medium text-green-600">${totalEarned.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg/Day</span>
                  <span className="font-medium">
                    ${workDays > 0 ? (totalEarned / workDays).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Entry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                  Work Entry for {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h1>
                <div className="flex items-center gap-2">
                  {selectedDate === today && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      Today
                    </span>
                  )}
                  {existingEntry && (
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      Previously Logged
                    </span>
                  )}
                </div>
              </div>

              {/* Smart Suggestions Banner */}
              {!showSmartSuggestions && entries.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">💡 Smart Suggestions Available</p>
                      <p className="text-sm text-blue-700">{getSmartSuggestions().reason}</p>
                    </div>
                    <button
                      onClick={() => setShowSmartSuggestions(true)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Use Smart Fill
                    </button>
                  </div>
                </div>
              )}

              {/* Smart Suggestions Panel */}
              {showSmartSuggestions && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-green-900 mb-2">🎯 Smart Suggestions</h4>
                  <div className="space-y-2 text-sm text-green-800 mb-3">
                    <p>• Hours: {getSmartSuggestions().suggestedHours} (suggested)</p>
                    <p>• Travel: {getSmartSuggestions().suggestedTravel}km (typical)</p>
                    <p>• Subsistence: ${getSmartSuggestions().suggestedSubsistence} (average)</p>
                    <p>• {getSmartSuggestions().reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={applySmartSuggestions}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Apply All
                    </button>
                    <button
                      onClick={() => setShowSmartSuggestions(false)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                      Manual Entry
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Work Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Did you work today?
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentEntry({...currentEntry, worked: true})}
                      className={`flex-1 py-3 rounded-lg border font-medium ${
                        currentEntry.worked
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ✅ Yes, I worked
                    </button>
                    <button
                      onClick={() => setCurrentEntry({...currentEntry, worked: false})}
                      className={`flex-1 py-3 rounded-lg border font-medium ${
                        !currentEntry.worked
                          ? 'border-gray-500 bg-gray-50 text-gray-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      🏠 Day off
                    </button>
                  </div>
                </div>

                {currentEntry.worked && (
                  <>
                    {/* Quick Entry Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hours Worked
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          value={currentEntry.hours_worked}
                          onChange={(e) => setCurrentEntry({
                            ...currentEntry, 
                            hours_worked: parseFloat(e.target.value)
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Travel (km)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={currentEntry.travel_kms_actual}
                          onChange={(e) => setCurrentEntry({
                            ...currentEntry, 
                            travel_kms_actual: parseFloat(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Truck & Subsistence */}
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={currentEntry.truck_used}
                          onChange={(e) => setCurrentEntry({
                            ...currentEntry, 
                            truck_used: e.target.checked
                          })}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Used company truck (+$150)
                        </span>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subsistence/Meals ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={currentEntry.subsistence_actual}
                          onChange={(e) => setCurrentEntry({
                            ...currentEntry, 
                            subsistence_actual: parseFloat(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Weather */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weather Conditions
                      </label>
                      <select
                        value={currentEntry.weather_conditions}
                        onChange={(e) => setCurrentEntry({
                          ...currentEntry, 
                          weather_conditions: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="clear">☀️ Clear/Sunny</option>
                        <option value="cloudy">☁️ Cloudy</option>
                        <option value="light_rain">🌦️ Light Rain</option>
                        <option value="heavy_rain">🌧️ Heavy Rain</option>
                        <option value="snow">❄️ Snow</option>
                        <option value="extreme_cold">🥶 Extreme Cold</option>
                        <option value="high_wind">💨 High Wind</option>
                      </select>
                    </div>

                    {/* Real-time Earnings Preview */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">💰 Today's Earnings Preview</h4>
                      <div className="text-2xl font-bold text-green-600">
                        ${calculateDayEarnings().toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Day rate + truck + GST + travel + subsistence
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={currentEntry.notes}
                    onChange={(e) => setCurrentEntry({
                      ...currentEntry, 
                      notes: e.target.value
                    })}
                    placeholder="Any notes about today's work..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveEntry}
                    disabled={saving}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? '💾 Saving...' : existingEntry ? '✅ Update Entry' : '✅ Save Entry'}
                  </button>
                  <button
                    onClick={() => router.push(`/contractor/dashboard/${params.id}`)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyWorkEntry 