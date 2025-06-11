'use client'
import React, { useState } from 'react'
import { X, Shield, Lock, Mail, User } from 'lucide-react'

interface SecurityModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthenticated: (sessionToken: string) => void
}

type AuthStep = 'choose' | 'login' | 'signup' | 'otp'
type AuthMode = 'login' | 'signup'

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  otp: string
}

const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const [step, setStep] = useState<AuthStep>('choose')
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  })

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep('choose')
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
      })
      setError('')
      setMessage('')
      setOtpSent(false)
    }
  }, [isOpen])

  // Check password requirements in real-time
  React.useEffect(() => {
    setPasswordRequirements({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    })
  }, [formData.password])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleChooseAuth = (authMode: AuthMode) => {
    setMode(authMode)
    setStep(authMode)
  }

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      // Step 1: Verify username/password
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })

      const loginData = await loginResponse.json()

      if (!loginData.success) {
        setError(loginData.message || 'Login failed')
        return
      }

      // Step 2: Request OTP
      const otpResponse = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          type: 'login'
        })
      })

      const otpData = await otpResponse.json()

      if (!otpData.success) {
        setError(otpData.message || 'Failed to send OTP')
        return
      }

      setMessage('OTP sent to your email!')
      setOtpSent(true)
      setStep('otp')

    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    setLoading(true)
    setError('')

    // Validate password requirements
    const allRequirementsMet = Object.values(passwordRequirements).every(req => req)
    if (!allRequirementsMet) {
      setError('Please meet all password requirements')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Signup failed')
        return
      }

      setMessage('Account created! OTP sent to your email.')
      setOtpSent(true)
      setStep('otp')

    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          type: mode
        })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Invalid OTP')
        return
      }

      // Authentication successful
      setMessage('Authentication successful!')
      onAuthenticated(data.sessionToken)
      onClose()

    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          type: mode
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('New OTP sent!')
      } else {
        setError(data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-900">Security Checkpoint</h2>
              <p className="text-sm text-red-700">Authentication required to continue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Choose Auth Method */}
          {step === 'choose' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Authentication Method</h3>
                <p className="text-sm text-gray-600">Secure access with username + password + OTP</p>
              </div>

              <button
                onClick={() => handleChooseAuth('login')}
                className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Sign In</p>
                    <p className="text-sm text-gray-600">I have an existing account</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleChooseAuth('signup')}
                className="w-full p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Create Account</p>
                    <p className="text-sm text-gray-600">I'm new to InvoicePatch</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Login Form */}
          {step === 'login' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sign In</h3>
                <p className="text-sm text-gray-600">Enter your credentials to continue</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('choose')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleLogin}
                  disabled={loading || !formData.username || !formData.password}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing In...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Signup Form */}
          {step === 'signup' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create Account</h3>
                <p className="text-sm text-gray-600">Set up your secure account</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a strong password"
                />
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-700">Password Requirements:</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={`flex items-center gap-1 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                        <span>{passwordRequirements.length ? '✓' : '○'}</span>
                        <span>8+ characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                        <span>{passwordRequirements.uppercase ? '✓' : '○'}</span>
                        <span>Uppercase</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                        <span>{passwordRequirements.lowercase ? '✓' : '○'}</span>
                        <span>Lowercase</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                        <span>{passwordRequirements.number ? '✓' : '○'}</span>
                        <span>Number</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordRequirements.special ? 'text-green-600' : 'text-gray-400'}`}>
                        <span>{passwordRequirements.special ? '✓' : '○'}</span>
                        <span>Special char</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('choose')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSignup}
                  disabled={loading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          {/* OTP Verification */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Enter Verification Code</h3>
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit code to {formData.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Didn't receive the code? Resend
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setStep(mode)
                    setOtpSent(false)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || formData.otp.length !== 6}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SecurityModal 