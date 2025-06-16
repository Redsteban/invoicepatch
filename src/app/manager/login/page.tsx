'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type AuthStep = 'email' | 'password' | 'otp'

export default function ManagerLogin() {
  const router = useRouter()
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  // Mock credentials for demo
  const DEMO_EMAIL = 'manager@demo.com'
  const DEMO_PASSWORD = 'demo123'
  const DEMO_OTP = '123456'

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.toLowerCase() === DEMO_EMAIL) {
      setStep('password')
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === DEMO_PASSWORD) {
      setStep('otp')
      // In real app, send OTP here
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
      
      // Check if complete
      if (newOtp.join('') === DEMO_OTP) {
        setIsLoading(true)
        setTimeout(() => {
          // Set authentication session
          sessionStorage.setItem('manager_authenticated', 'true')
          router.push('/manager/dashboard')
        }, 1000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-black">InvoicePatch</h1>
          <p className="text-sm text-gray-500 mt-2">Manager Portal</p>
        </div>

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-black focus:outline-none transition-colors"
                autoFocus
                required
              />
              <p className="text-xs text-gray-400 mt-2">
                Demo: manager@demo.com
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-medium hover:bg-gray-900 transition-colors"
            >
              Continue
            </button>
          </form>
        )}

        {/* Password Step */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-black focus:outline-none transition-colors"
                autoFocus
                required
              />
              <p className="text-xs text-gray-400 mt-2">
                Demo: demo123
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-medium hover:bg-gray-900 transition-colors"
            >
              Sign in
            </button>
            
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-gray-500 hover:text-black transition-colors"
            >
              Use different email
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Enter verification code
              </label>
              <p className="text-xs text-gray-400 mb-6">
                We sent a code to {email}
              </p>
              
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center border border-gray-200 focus:border-black focus:outline-none transition-colors text-lg"
                    maxLength={1}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <p className="text-xs text-gray-400 mt-4">
                Demo code: 123456
              </p>
            </div>
            
            {isLoading && (
              <div className="text-center">
                <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 