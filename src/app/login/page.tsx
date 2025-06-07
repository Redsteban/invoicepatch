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

const LoginPage = () => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<OTPStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const { signIn, user } = useAuth();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, try to sign in with Supabase to verify credentials
      const { error: authError } = await signIn(email, password);
      
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // If login successful, request OTP for additional security
      const response = await fetch('/api/auth/request-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setOtpStep({
          email,
          otpId: data.otpId,
          attempts: 0
        });
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send verification code');
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
      const response = await fetch('/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpStep?.email,
          code: otpCode,
          purpose: 'login'
        })
      });

      const data = await response.json();

      if (data.success) {
        // OTP verified - set recent auth flag and complete login
        sessionStorage.setItem('recentAuthFlow', Date.now().toString());
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid verification code');
        if (data.attemptsRemaining !== undefined) {
          setOtpStep({
            ...otpStep!,
            attempts: 3 - data.attemptsRemaining
          });
          
          if (data.attemptsRemaining === 0) {
            setStep('login');
            setOtpStep(null);
            setOtpCode('');
            setError('Too many failed attempts. Please log in again.');
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
      const response = await fetch('/api/auth/request-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpStep.email })
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

  // Login Step
  if (step === 'login') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your contractor dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">Don't have an account?</p>
            <Link 
              href="/signup" 
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Create Account
            </Link>
          </div>

          {/* Quick Access */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">💡 Trial Access</h3>
            <p className="text-sm text-gray-600 mb-3">
              Want to try our platform first? Start with a free trial.
            </p>
            <Link 
              href="/contractor-trial"
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Start Free Trial →
            </Link>
          </div>

          {/* Security Features */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🛡️ Enhanced Security</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Two-factor authentication with email verification</li>
              <li>• Encrypted data protection</li>
              <li>• Secure session management</li>
              <li>• Rate limiting and abuse prevention</li>
            </ul>
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
            Check Your Email
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
            {loading ? 'Verifying...' : 'Verify & Complete Login'}
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

        {/* Back to login */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setStep('login');
              setOtpStep(null);
              setOtpCode('');
              setError('');
            }}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Login
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your spam/junk folder if you don't see the email</li>
            <li>• The code expires in 10 minutes</li>
            <li>• Contact support if you continue having issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 