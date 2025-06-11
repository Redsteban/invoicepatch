'use client';

import React, { useState } from 'react'
import { MoreVertical, ChevronDown } from 'lucide-react'

const ContractorDashboard = () => {
  const [showActions, setShowActions] = useState(false)
  
  const handleLogWork = () => {
    window.location.href = '/daily-checkin'
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <header className="header-minimal">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-sm font-medium text-gray-900">InvoicePatch</h1>
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </header>
      
      <div className="container py-8">
        {/* Primary info only */}
        <div className="mb-12">
          <p className="text-sm text-gray-500 mb-2">Current period earnings</p>
          <h2 className="text-display">$3,367.50</h2>
          
          {/* Minimal progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>5 of 10 days worked</span>
              <span>Invoice generates Friday</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div className="bg-gray-900 h-1 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Single primary action */}
        <button 
          onClick={handleLogWork}
          className="btn-primary w-full"
        >
          Log Today's Work
        </button>
        
        {/* Dropdown menu for secondary actions */}
        {showActions && (
          <div className="absolute right-4 top-16 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              View current invoice
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Previous invoices
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Tax documents
            </button>
            <hr className="my-1 border-gray-100" />
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Settings
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Help
            </button>
            <hr className="my-1 border-gray-100" />
            <button 
              onClick={() => window.location.href = '/manager-dashboard'}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-blue-600"
            >
              Manager View
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContractorDashboard 