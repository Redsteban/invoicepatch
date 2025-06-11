'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Shield, Lock, User } from 'lucide-react'

interface LoginData {
  username: string
  password: string
  otp: string
}

type LoginStep = 'credentials' | 'otp'

const ContractorTrialPage = () => {
  const router = useRouter()
  const [showExistingLogin, setShowExistingLogin] = useState(false)
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [emailOnlyAccess, setEmailOnlyAccess] = useState('')
  const [emailAccessLoading, setEmailAccessLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [resetPasswordData, setResetPasswordData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showConfirmResetPassword, setShowConfirmResetPassword] = useState(false)

  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
    otp: ''
  })

  const handleExistingLogin = async () => {
    setError('')
    setLoginLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password
        })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Login failed')
        return
      }

      if (data.requiresOtp) {
        setMessage('Check your email for verification code.')
        setLoginStep('otp')
      } else {
        setMessage('Login successful! Redirecting...')
        setTimeout(() => router.push('/contractor-dashboard'), 1500)
      }
      
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleVerifyLoginOTP = async () => {
    setError('')
    setLoginLoading(true)
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginData.username,
          otp: loginData.otp,
          purpose: 'login'
        })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'OTP verification failed')
        return
      }

      setMessage('Login successful! Redirecting...')
      setTimeout(() => router.push('/contractor-dashboard'), 1500)
      
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleResendLoginOTP = async () => {
    setError('')
    setLoginLoading(true)
    
    try {
      const response = await fetch('/api/auth/resend-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginData.username
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('New verification code sent to your email.')
      } else {
        setError(data.message || 'Failed to resend code')
      }
      
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleEmailOnlyAccess = async () => {
    setError('')
    setEmailAccessLoading(true)
    
    try {
      const response = await fetch('/api/contractor/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailOnlyAccess
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Access link sent to your email! Check your inbox.')
        setEmailOnlyAccess('')
      } else {
        setError(data.message || 'Access request failed')
      }
      
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setEmailAccessLoading(false)
    }
  }

  const handleForgotPasswordRequest = async () => {
    setError('')
    setForgotPasswordLoading(true)
    
    try {
      const response = await fetch('/api/auth/request-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotPasswordEmail
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Password reset code sent to your email.')
        setForgotPasswordStep('otp')
      } else {
        setError(data.message || 'Failed to send reset code')
      }
      
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const handleVerifyResetOTP = async () => {
    setError('')
    setForgotPasswordLoading(true)
    
    try {
      const response = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotPasswordEmail,
          otp: resetPasswordData.otp
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('OTP verified! Please set your new password.')
        setForgotPasswordStep('reset')
      } else {
        setError(data.message || 'Invalid verification code')
      }
      
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setError('')
    
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (resetPasswordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setForgotPasswordLoading(true)
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotPasswordEmail,
          otp: resetPasswordData.otp,
          newPassword: resetPasswordData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Password reset successful! You can now login with your new password.')
        setShowForgotPassword(false)
        setForgotPasswordStep('email')
        setResetPasswordData({ otp: '', newPassword: '', confirmPassword: '' })
        setForgotPasswordEmail('')
      } else {
        setError(data.message || 'Password reset failed')
      }
      
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Contractor Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your contractor dashboard and manage your work
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}

          {/* New Contractor Signup */}
          {!showExistingLogin && !showForgotPassword && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Get Started
                </h3>
              </div>

              {/* Primary CTA - New Contractor Signup */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <Shield className="mx-auto h-12 w-12 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900 mt-2">
                    Start Your Free Trial
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Create your contractor account and start tracking work immediately
                  </p>
                </div>
                
                <Link
                  href="/signup?type=contractor"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Contractor Account
                </Link>
                
                <div className="mt-3 text-center">
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>✓ 15-day free trial</li>
                    <li>✓ Complete payroll management</li>
                    <li>✓ Automated invoicing</li>
                    <li>✓ No credit card required</li>
                  </ul>
                </div>
              </div>

              {/* Secondary Options */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowExistingLogin(true)}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign in to existing account
                </button>

                {/* Quick Email Access */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Quick Email Access
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Don't remember your login? We'll send you a direct access link.
                  </p>
                  
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={emailOnlyAccess}
                      onChange={(e) => setEmailOnlyAccess(e.target.value)}
                      placeholder="your.email@example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleEmailOnlyAccess}
                      disabled={emailAccessLoading || !emailOnlyAccess}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                      {emailAccessLoading ? 'Sending...' : 'Send Link'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Existing User Login */}
          {showExistingLogin && !showForgotPassword && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Sign In to Your Account
                </h3>
              </div>

              {loginStep === 'credentials' && (
                <form onSubmit={(e) => { e.preventDefault(); handleExistingLogin(); }} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username or Email
                    </label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="username"
                        type="text"
                        required
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter username or email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loginLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}

              {loginStep === 'otp' && (
                <form onSubmit={(e) => { e.preventDefault(); handleVerifyLoginOTP(); }} className="space-y-4">
                  <div>
                    <label htmlFor="loginOtp" className="block text-sm font-medium text-gray-700">
                      Verification Code
                    </label>
                    <div className="mt-1">
                      <input
                        id="loginOtp"
                        type="text"
                        maxLength={6}
                        required
                        value={loginData.otp}
                        onChange={(e) => setLoginData({...loginData, otp: e.target.value.replace(/\D/g, '')})}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-2xl tracking-widest"
                        placeholder="000000"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading || loginData.otp.length !== 6}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loginLoading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendLoginOTP}
                      disabled={loginLoading}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Resend verification code
                    </button>
                  </div>
                </form>
              )}

              <div className="text-center space-y-2">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </button>
                <br />
                <button
                  onClick={() => {
                    setShowExistingLogin(false)
                    setLoginStep('credentials')
                    setLoginData({ username: '', password: '', otp: '' })
                    setError('')
                    setMessage('')
                  }}
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  ← Back to main options
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Flow */}
          {showForgotPassword && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Reset Your Password
                </h3>
              </div>

              {forgotPasswordStep === 'email' && (
                <form onSubmit={(e) => { e.preventDefault(); handleForgotPasswordRequest(); }} className="space-y-4">
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="forgotEmail"
                        type="email"
                        required
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {forgotPasswordLoading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>
              )}

              {forgotPasswordStep === 'otp' && (
                <form onSubmit={(e) => { e.preventDefault(); handleVerifyResetOTP(); }} className="space-y-4">
                  <div>
                    <label htmlFor="resetOtp" className="block text-sm font-medium text-gray-700">
                      Verification Code
                    </label>
                    <div className="mt-1">
                      <input
                        id="resetOtp"
                        type="text"
                        maxLength={6}
                        required
                        value={resetPasswordData.otp}
                        onChange={(e) => setResetPasswordData({...resetPasswordData, otp: e.target.value.replace(/\D/g, '')})}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-2xl tracking-widest"
                        placeholder="000000"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Enter the code sent to {forgotPasswordEmail}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotPasswordLoading || resetPasswordData.otp.length !== 6}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {forgotPasswordLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </form>
              )}

              {forgotPasswordStep === 'reset' && (
                <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }} className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="newPassword"
                        type={showResetPassword ? 'text' : 'password'}
                        required
                        value={resetPasswordData.newPassword}
                        onChange={(e) => setResetPasswordData({...resetPasswordData, newPassword: e.target.value})}
                        className="pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowResetPassword(!showResetPassword)}
                      >
                        {showResetPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="confirmNewPassword"
                        type={showConfirmResetPassword ? 'text' : 'password'}
                        required
                        value={resetPasswordData.confirmPassword}
                        onChange={(e) => setResetPasswordData({...resetPasswordData, confirmPassword: e.target.value})}
                        className="pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmResetPassword(!showConfirmResetPassword)}
                      >
                        {showConfirmResetPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setForgotPasswordStep('email')
                    setResetPasswordData({ otp: '', newPassword: '', confirmPassword: '' })
                    setForgotPasswordEmail('')
                    setError('')
                    setMessage('')
                  }}
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  ← Back to sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContractorTrialPage 