'use client'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

const ContractorNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/contractor/dashboard', 
      icon: '📊',
      active: pathname === '/contractor/dashboard'
    },
    { 
      name: 'Current Invoice', 
      href: '/contractor/invoice/current', 
      icon: '📝',
      active: pathname.includes('/contractor/invoice/')
    },
    { 
      name: 'Work History', 
      href: '/contractor/history', 
      icon: '📅',
      active: pathname === '/contractor/history'
    },
    { 
      name: 'Settings', 
      href: '/contractor/settings', 
      icon: '⚙️',
      active: pathname === '/contractor/settings'
    }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/contractor/dashboard')}
              className="text-xl font-bold text-blue-600 hover:text-blue-800"
            >
              InvoicePatch
            </button>
          </div>
          
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Trial User</p>
              <p className="text-xs text-gray-500">4 days remaining</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default ContractorNavigation 