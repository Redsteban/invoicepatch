'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OTPStep {
  email: string;
  otpId: string;
  attempts: number;
}

const TrialAccessPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<OTPStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer effect
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contractor/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          purpose: 'trial_access'
        }),
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
        if (data.cooldownRemaining) {
          setResendCooldown(data.cooldownRemaining * 60);
        }
      }
    } catch (error) {
      console.error('OTP request error:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contractor/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: otpStep!.email,
          code: otpCode,
          purpose: 'trial_access'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Set authentication flag and redirect to trial dashboard
        sessionStorage.setItem('recentAuthFlow', Date.now().toString());
        router.push(`/contractor/dashboard/${data.trialId}`);
      } else {
        setError(data.error || 'Invalid verification code');
        if (otpStep) {
          setOtpStep({
            ...otpStep,
            attempts: otpStep.attempts + 1
          });
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contractor/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: otpStep!.email,
          purpose: 'trial_access'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpStep({
          email: otpStep!.email,
          otpId: data.otpId,
          attempts: 0
        });
        setOtpCode('');
        setError('');
        // Show success message briefly
        const successMessage = 'New verification code sent!';
        setError(''); // Clear any existing error
        setTimeout(() => {
          // Clear success message after 3 seconds
        }, 3000);
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

  if (step === 'email') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Secure Trial Access
            </h1>
            <p className="text-gray-600">
              Enter your email to receive a verification code
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
              {resendCooldown > 0 && (
                <p className="text-sm mt-1">
                  You can request a new code in {Math.floor(resendCooldown / 60)}:{(resendCooldown % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                placeholder="Enter the email you used for your trial"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send a 6-digit verification code to this email
              </p>
            </div>
            
            <button 
              type="submit"
              disabled={loading || resendCooldown > 0}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">Don't have a trial yet?</p>
            <button
              onClick={() => router.push('/contractor-trial')}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Start Your 15-Day Trial
            </button>
          </div>

          {/* Security Features */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🛡️ Enhanced Security</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Two-factor verification with email codes</li>
              <li>• Encrypted trial data protection</li>
              <li>• Rate limiting and abuse prevention</li>
              <li>• Secure session management</li>
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

        <form onSubmit={handleOTPSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input 
              type="text" 
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-center text-2xl font-mono letter-spacing-wide"
              placeholder="000000"
              maxLength={6}
              pattern="\d{6}"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>
          
          <button 
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Access My Trial'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={loading || resendCooldown > 0}
            className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
          >
            {resendCooldown > 0 
              ? `Resend code in ${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, '0')}`
              : 'Resend Code'
            }
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <button
            onClick={() => {
              setStep('email');
              setOtpStep(null);
              setOtpCode('');
              setError('');
            }}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Change Email Address
          </button>
        </div>

        {/* Code Input Tips */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• The code expires in 10 minutes</li>
            <li>• You have {3 - (otpStep?.attempts || 0)} attempts remaining</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrialAccessPage; 