'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface OTPStep {
  email: string;
  otpId: string;
  attempts: number;
}

const SignupPage = () => {
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<OTPStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const { signUp, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message!);
      setLoading(false);
      return;
    }

    try {
      // First, request OTP for account verification
      const otpResponse = await fetch('/api/auth/request-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          name: formData.name 
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
      } else {
        setError(otpData.message || 'Failed to send verification code');
      }
    } catch (error: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First verify the OTP
      const verifyResponse = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpStep?.email,
          code: otpCode,
          purpose: 'account_verification'
        })
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // OTP verified - now create the account
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.name,
          email_verified: true
        });
        
        if (error) {
          setError(error.message);
        } else {
          // Success - set recent auth flag and redirect to dashboard
          sessionStorage.setItem('recentAuthFlow', Date.now().toString());
          router.push('/dashboard');
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
          name: formData.name 
        })
      });

      const data = await response.json();

      if (data.success) {
        setOtpStep({
          ...otpStep,
          otpId: data.otpId
        });
        setResendCooldown(120); // 2 minute cooldown
      } else {
        setError(data.message || 'Failed to resend code');
        if (data.cooldownRemaining) {
          setResendCooldown(data.cooldownRemaining * 60);
        }
      }
    } catch (error) {
      setError('Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  // Signup Step
  if (step === 'signup') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join InvoicePatch and streamline your contracting
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Create a strong password"
              />
              <div className="mt-2 text-xs text-gray-500">
                Must include uppercase, lowercase, number, and special character (@$!%*?&)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link 
              href="/login" 
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🛡️ Secure Registration</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Email verification required</li>
              <li>• Strong password protection</li>
              <li>• Encrypted data storage</li>
              <li>• GDPR compliant</li>
            </ul>
          </div>

          {/* Trial option */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">💡 Try Before You Commit</h3>
            <p className="text-sm text-gray-600 mb-3">
              Want to explore our features first? Start with a free trial.
            </p>
            <Link 
              href="/contractor-trial"
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification Step
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-gray-900">{otpStep?.email}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleOTPVerification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter 6-Digit Verification Code
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-4 text-center text-2xl font-mono border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Email & Create Account'}
          </button>
        </form>

        {/* Attempts remaining */}
        {otpStep && otpStep.attempts > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-red-600">
              {3 - otpStep.attempts} attempt{3 - otpStep.attempts !== 1 ? 's' : ''} remaining
            </p>
          </div>
        )}

        {/* Resend option */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={resendCooldown > 0 || loading}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium disabled:opacity-50"
          >
            {resendCooldown > 0 
              ? `Resend in ${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, '0')}`
              : 'Resend Code'
            }
          </button>
        </div>

        {/* Back to signup */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setStep('signup');
              setOtpStep(null);
              setOtpCode('');
              setError('');
            }}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Sign Up
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your spam/junk folder if you don't see the email</li>
            <li>• The code expires in 10 minutes</li>
            <li>• Make sure to use the email address you just entered</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 