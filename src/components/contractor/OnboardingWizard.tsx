'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Calendar, DollarSign, MapPin, Briefcase } from 'lucide-react'

interface OnboardingData {
  // Step 1: Basic Info
  ticketNumber: string
  company: string
  location: string
  startDate: string
  
  // Step 2: Rates
  dayRate: number
  truckRate: number
  travelKms: number
  subsistence: number
  
  // Step 3: Work Schedule
  workDays: string[]
  firstPeriodEnd: string
  
  // Step 4: Review
  confirmed: boolean
}

const STEPS = [
  { id: 'basics', title: 'Project Details', icon: Briefcase },
  { id: 'rates', title: 'Your Rates', icon: DollarSign },
  { id: 'schedule', title: 'Work Schedule', icon: Calendar },
  { id: 'review', title: 'Review & Confirm', icon: ChevronRight }
]

const WORK_DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
]

export default function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [data, setData] = useState<OnboardingData>({
    ticketNumber: '',
    company: '',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    dayRate: 450,
    truckRate: 150,
    travelKms: 0,
    subsistence: 75,
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    firstPeriodEnd: '',
    confirmed: false
  })

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const toggleWorkDay = (day: string) => {
    const currentDays = [...data.workDays]
    const index = currentDays.indexOf(day)
    
    if (index > -1) {
      currentDays.splice(index, 1)
    } else {
      currentDays.push(day)
    }
    
    updateData('workDays', currentDays)
  }

  const calculatePeriodEnd = () => {
    if (!data.startDate) return ''
    
    const start = new Date(data.startDate)
    const periodEnd = new Date(start)
    periodEnd.setDate(start.getDate() + 13) // 14-day periods
    
    return periodEnd.toISOString().split('T')[0]
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return data.ticketNumber && data.company && data.location && data.startDate
      case 1:
        return data.dayRate > 0
      case 2:
        return data.workDays.length > 0
      case 3:
        return data.confirmed
      default:
        return true
    }
  }

  const nextStep = () => {
    if (!validateCurrentStep()) {
      setError('Please fill in all required fields')
      return
    }
    
    if (currentStep === 1 && !data.firstPeriodEnd) {
      updateData('firstPeriodEnd', calculatePeriodEnd())
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!data.confirmed) {
      setError('Please confirm your information')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contractor/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: '123e4567-e89b-12d3-a456-426614174000' // In real app, get from auth context
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error || 'Setup failed. Please try again.')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      setError('Setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const dailyTotal = data.dayRate + data.truckRate + (data.travelKms * 0.68) + data.subsistence
  const periodTotal = dailyTotal * data.workDays.length * 2 // 2 weeks

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-medium text-gray-900">Setup Your First Invoice</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                    ${index <= currentStep 
                      ? 'bg-gray-900 border-gray-900 text-white' 
                      : 'border-gray-200 text-gray-400'
                    }
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-2 transition-colors
                      ${index < currentStep ? 'bg-gray-900' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div 
              className="bg-gray-900 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            {STEPS[currentStep].title}
          </h2>
          <p className="text-gray-500">
            {currentStep === 0 && "Let's start with your project information"}
            {currentStep === 1 && "What are your agreed rates for this project?"}
            {currentStep === 2 && "When do you typically work?"}
            {currentStep === 3 && "Review your information before we create your first invoice"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket/Work Order Number *
              </label>
              <input
                type="text"
                value={data.ticketNumber}
                onChange={(e) => updateData('ticketNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., WO-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company/Client *
              </label>
              <input
                type="text"
                value={data.company}
                onChange={(e) => updateData('company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., ABC Construction Ltd."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Location *
              </label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => updateData('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., Calgary, AB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={data.startDate}
                onChange={(e) => updateData('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 2: Rates */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Rate *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={data.dayRate}
                  onChange={(e) => updateData('dayRate', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="450.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Truck/Equipment Rate
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={data.truckRate}
                  onChange={(e) => updateData('truckRate', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="150.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Travel Distance (km)
              </label>
              <input
                type="number"
                value={data.travelKms}
                onChange={(e) => updateData('travelKms', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">$0.68/km will be applied</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subsistence/Per Diem
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={data.subsistence}
                  onChange={(e) => updateData('subsistence', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="75.00"
                />
              </div>
            </div>

            {/* Daily Total Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Total</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Day Rate:</span>
                  <span>${data.dayRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Truck Rate:</span>
                  <span>${data.truckRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel ({data.travelKms}km):</span>
                  <span>${(data.travelKms * 0.68).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subsistence:</span>
                  <span>${data.subsistence.toFixed(2)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-medium text-gray-900">
                  <span>Total per day:</span>
                  <span>${dailyTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Work Schedule */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Which days do you typically work? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {WORK_DAYS.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleWorkDay(day.id)}
                    className={`
                      p-3 text-left border rounded-lg transition-colors
                      ${data.workDays.includes(day.id)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selected: {data.workDays.length} days per week
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Pay Period End Date
              </label>
              <input
                type="date"
                value={data.firstPeriodEnd || calculatePeriodEnd()}
                onChange={(e) => updateData('firstPeriodEnd', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 14 days from start date ({calculatePeriodEnd()})
              </p>
            </div>

            {/* Period Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">First Period Estimate</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Work days per week:</span>
                  <span>{data.workDays.length} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily rate:</span>
                  <span>${dailyTotal.toFixed(2)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-medium text-gray-900">
                  <span>2-week total:</span>
                  <span>${periodTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Project Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Ticket Number:</span>
                    <span>{data.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company:</span>
                    <span>{data.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span>{data.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{new Date(data.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Rates & Schedule</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Daily Total:</span>
                    <span>${dailyTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Work Days:</span>
                    <span>{data.workDays.length} days/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Period End:</span>
                    <span>{new Date(data.firstPeriodEnd || calculatePeriodEnd()).toLocaleDateString()}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-medium text-gray-900">
                    <span>Estimated Period Total:</span>
                    <span>${periodTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="confirm"
                checked={data.confirmed}
                onChange={(e) => updateData('confirmed', e.target.checked)}
                className="mt-1 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="confirm" className="text-sm text-gray-700">
                I confirm that the information above is correct and I'm ready to start tracking my work for this project.
              </label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`
              flex items-center px-6 py-3 text-sm font-medium transition-colors rounded-lg
              ${currentStep === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !data.confirmed}
              className={`
                flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-colors
                ${loading || !data.confirmed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }
              `}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}