'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, User, Mail, Building, Phone } from 'lucide-react';

interface OTPStep {
  email: string;
  otpId: string;
  attempts: number;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Optional contractor fields
  phone?: string;
  company?: string;
  isContractor?: boolean;
}

const SignupPage = () => {
  const searchParams = useSearchParams();
  const isContractorFlow = searchParams.get('type') === 'contractor';
  
  const [step, setStep] = useState<'signup' | 'otp' | 'success'>('signup');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    isContractor: isContractorFlow
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<OTPStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { signUp, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (isContractorFlow) {
        router.push('/contractor-dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router, isContractorFlow]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
    }
    return { valid: true };
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message!);
      return false;
    }

    // Contractor-specific validation
    if (formData.isContractor) {
      if (!formData.phone?.trim()) {
        setError('Phone number is required for contractors');
        return false;
      }
      if (!formData.company?.trim()) {
        setError('Company name is required for contractors');
        return false;
      }
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Request OTP for account verification
      const otpResponse = await fetch('/api/auth/request-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          name: formData.name,
          type: formData.isContractor ? 'contractor' : 'user'
        })
      });

      const otpData = await otpResponse.json();

      if (otpData.success) {
        setOtpStep({
          email: formData.email,
          otpId: otpData.otpId,
          attempts: 0
        });
        setStep('otp');
        setSuccess('Verification code sent to your email!');
      } else {
        setError(otpData.message || 'Failed to send verification code');
      }
    } catch (error: any) {
      setError('An unexpected error occurred');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting OTP verification with:', {
        email: otpStep?.email,
        code: otpCode,
        purpose: 'account_verification'
      });
      
      // Verify the OTP
      const verifyResponse = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpStep?.email,
          code: otpCode,
          purpose: 'account_verification'
        })
      });

      console.log('Response status:', verifyResponse.status);
      console.log('Response headers:', verifyResponse.headers);
      
      const verifyData = await verifyResponse.json();
      console.log('Response data:', verifyData);

      if (verifyData.success) {
        // OTP verified - create the account
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.name,
          phone: formData.phone,
          company: formData.company,
          user_type: formData.isContractor ? 'contractor' : 'user',
          email_verified: true
        });
        
        if (error) {
          setError(error.message);
        } else {
          setStep('success');
          setSuccess('Account created successfully!');
          
          // Set recent auth flag and redirect after a short delay
          sessionStorage.setItem('recentAuthFlow', Date.now().toString());
          setTimeout(() => {
            if (formData.isContractor) {
              router.push('/contractor-dashboard');
            } else {
              router.push('/dashboard');
            }
          }, 2000);
        }
      } else {
        setError(verifyData.error || 'Invalid verification code');
        if (verifyData.attemptsRemaining !== undefined) {
          setOtpStep({
            ...otpStep!,
            attempts: 3 - verifyData.attemptsRemaining
          });
          
          if (verifyData.attemptsRemaining === 0) {
            setStep('signup');
            setOtpStep(null);
            setOtpCode('');
            setError('Too many failed attempts. Please try again.');
          }
        }
      }
    } catch (error: any) {
      setError('Verification failed. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || !otpStep) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/request-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: otpStep.email,
          name: formData.name,
          type: formData.isContractor ? 'contractor' : 'user'
        })
      });

      const data = await response.json();

      if (data.success) {
        setOtpStep({
          ...otpStep,
          otpId: data.otpId
        });
        setResendCooldown(120); // 2 minute cooldown
        setSuccess('New verification code sent!');
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (error) {
      setError('Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const checks = [
      formData.password.length >= 8,
      /(?=.*[a-z])/.test(formData.password),
      /(?=.*[A-Z])/.test(formData.password),
      /(?=.*\d)/.test(formData.password),
      /(?=.*[@$!%*?&])/.test(formData.password)
    ];
    return checks.filter(Boolean).length;
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 'signup' && !formData.isContractor && 'Create your account'}
            {step === 'signup' && formData.isContractor && 'Create contractor account'}
            {step === 'otp' && 'Verify your email'}
            {step === 'success' && 'Welcome aboard!'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'signup' && !formData.isContractor && 'Join thousands of satisfied users'}
            {step === 'signup' && formData.isContractor && 'Start your contractor trial'}
            {step === 'otp' && `We sent a verification code to ${formData.email}`}
            {step === 'success' && 'Your account has been created successfully'}
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'signup' ? 'bg-blue-600 text-white' : 
                step === 'otp' || step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-300'
              }`}>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step === 'otp' || step === 'success' ? 'bg-green-600' : 'bg-gray-300'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'otp' ? 'bg-blue-600 text-white' : 
                step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-300'
              }`}>
                <span className="text-sm font-medium">2</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step === 'success' ? 'bg-green-600' : 'bg-gray-300'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-300'
              }`}>
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Details</span>
              <span>Verify</span>
              <span>Complete</span>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Account Type Toggle */}
          {step === 'signup' && (
            <div className="mb-6">
              <div className="flex rounded-lg border border-gray-300 p-1 account-type-toggle">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isContractor: false})}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    !formData.isContractor 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Regular User
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isContractor: true})}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    formData.isContractor 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Contractor
                </button>
              </div>
            </div>
          )}

          {/* Signup Form */}
          {step === 'signup' && (
            <form className="space-y-6" onSubmit={handleSignup}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Contractor Fields */}
              {formData.isContractor && (
                <>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <div className="mt-1 relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company || ''}
                        onChange={handleChange}
                        className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                          style={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Password must contain:</p>
                      <ul className="grid grid-cols-1 gap-1 mt-1">
                        <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                          ✓ At least 8 characters
                        </li>
                        <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                          ✓ One lowercase letter
                        </li>
                        <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                          ✓ One uppercase letter
                        </li>
                        <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                          ✓ One number
                        </li>
                        <li className={/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                          ✓ One special character
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* OTP Verification Form */}
          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleOTPVerification}>
              <div>
                <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="otpCode"
                    name="otpCode"
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResendOTP}
                  className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 
                    ? `Resend code in ${resendCooldown}s`
                    : 'Resend verification code'
                  }
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('signup');
                    setOtpStep(null);
                    setOtpCode('');
                    setError('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  ← Back to signup
                </button>
              </div>
            </form>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Created Successfully!</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {formData.isContractor 
                    ? 'You will be redirected to the contractor dashboard shortly...'
                    : 'You will be redirected to your dashboard shortly...'
                  }
                </p>
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            </div>
          )}

          {/* Login Link */}
          {step === 'signup' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 