'use client'

'use client'

import React, { useState } from 'react'

const DailyCheckIn = () => {
  const [worked, setWorked] = useState<boolean | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  
  const handleBackToDashboard = () => {
    window.location.href = '/contractor-dashboard'
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Simple back navigation */}
      <header className="header-minimal">
        <div className="max-w-md mx-auto px-4 py-4">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to dashboard
          </button>
        </div>
      </header>
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500">Daily check-in</p>
          <h1 className="text-2xl font-light text-gray-900 mt-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </h1>
        </div>
        
        {!worked && (
          <div className="space-y-3">
            <button 
              onClick={() => setWorked(true)}
              className="btn-primary w-full py-4"
            >
              I worked today
            </button>
            <button 
              onClick={() => setWorked(false)}
              className="btn-secondary w-full py-4"
            >
              Day off
            </button>
          </div>
        )}
        
        {worked === true && (
          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Standard day?</h3>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {showDetails ? 'Hide' : 'Edit'}
                </button>
              </div>
              
              {!showDetails ? (
                <div className="text-2xl font-light">$673.50</div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Day rate</span>
                    <input type="text" defaultValue="$450" className="text-right w-20 px-2 py-1 border rounded" />
                  </div>
                  <div className="flex justify-between">
                    <span>Truck</span>
                    <input type="text" defaultValue="$150" className="text-right w-20 px-2 py-1 border rounded" />
                  </div>
                  <div className="flex justify-between">
                    <span>Travel</span>
                    <input type="text" defaultValue="45km" className="text-right w-20 px-2 py-1 border rounded" />
                  </div>
                </div>
              )}
            </div>
            
            <button className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Save
            </button>
          </div>
        )}
        
        {worked === false && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600">Saved. See you tomorrow.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyCheckIn 