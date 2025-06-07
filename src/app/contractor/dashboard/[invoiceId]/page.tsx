'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkEntryAccordion } from '@/components/ui/Accordion';

interface DashboardData {
  success: boolean;
  invoice: {
    id: string;
    contractor_name: string;
    contractor_email: string;
    contractor_phone: string;
    sequence_number: string;
    start_date: string;
    end_date: string;
    day_rate: number;
    truck_rate: number;
    travel_kms: number;
    rate_per_km: number;
    subsistence: number;
    location: string;
    company: string;
    total_earned: number;
    days_worked: number;
    status: string;
    trial_day: number;
    rate_type?: 'hourly' | 'daily';
    hourly_rate?: number;
    overtime_rate?: number;
    doubletime_rate?: number;
  };
  entries: Array<{
    id: string;
    entry_date: string;
    worked: boolean;
    day_rate_used: number;
    truck_used: boolean;
    truck_rate_used: number;
    travel_kms_actual: number;
    subsistence_actual: number;
    hours_worked?: number;
    overtime_hours?: number;
    doubletime_hours?: number;
    notes?: string;
    created_at: string;
  }>;
  summary: {
    totalEarned: number;
    daysWorked: number;
    currentDay: number;
    trialDaysRemaining: number;
    projectedTotal: number;
    averageDailyEarnings: number;
    completionRate: number;
    weeklyEarnings: number[];
    upcomingDeadline: number;
    totalTrialDays: number;
  };
  insights?: any;
  analytics?: any;
  payPeriods?: any[];
}

const ContractorDashboard = () => {
  const params = useParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayWorked, setTodayWorked] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [entryLoading, setEntryLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [bulkEntryMode, setBulkEntryMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true); // SECURITY: Default to requiring authentication
  const [showAuthRequired, setShowAuthRequired] = useState(false);

  useEffect(() => {
    console.log('Dashboard component mounted with ID:', params.invoiceId);
    
    // SECURITY: ALWAYS require authentication for trial dashboard access
    // Check multiple security layers
    const hasRecentAuth = sessionStorage.getItem('recentAuthFlow');
    const authTimestamp = hasRecentAuth ? parseInt(hasRecentAuth) : 0;
    const currentTime = Date.now();
    const authAge = currentTime - authTimestamp;
    const maxAuthAge = 60 * 60 * 1000; // 1 hour
    
    console.log('🔒 SECURITY CHECK:', {
      hasRecentAuth: !!hasRecentAuth,
      authTimestamp,
      currentTime,
      authAge: authAge / 1000 / 60, // minutes
      maxAgeMinutes: maxAuthAge / 1000 / 60,
      isValid: hasRecentAuth && authAge <= maxAuthAge && !isNaN(authTimestamp)
    });
    
    // ALWAYS FORCE AUTHENTICATION - MAXIMUM SECURITY
    // This ensures the password/OTP section always appears for returning customers
    console.log('🔒 SECURITY: ALWAYS requiring authentication - showing modal');
    setShowAuthModal(true);
    setLoading(false); // Stop loading state that causes "Loading..." screen
    return;
    
    // Original logic - keeping for reference but disabled for maximum security
    // if (!hasRecentAuth || authAge > maxAuthAge || isNaN(authTimestamp)) {
    //   console.log('🔒 SECURITY: Authentication required - showing modal');
    //   setShowAuthModal(true);
    //   return;
    // }
    
    // console.log('✅ SECURITY: Authentication verified, loading dashboard');
    // setShowAuthModal(false); // Explicitly hide modal when authenticated
    // loadDashboardData();
  }, [params.invoiceId]);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data for:', params.invoiceId);
      
      const response = await fetch(`/api/contractor/dashboard?trialInvoiceId=${params.invoiceId}`);
      console.log('Dashboard API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Dashboard API result:', result);
      
      if (result.success) {
        setData(result);
        
        // Check if today's work is logged
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = result.entries.find((e: any) => e.entry_date === today);
        setTodayWorked(todayEntry?.worked || null);
      } else {
        setError(result.error || 'Failed to load dashboard');
      }
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
      setError(`Failed to load dashboard: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate list of available dates within trial period
  const getAvailableDates = () => {
    if (!data) return [];
    
    const startDate = new Date(data.invoice.start_date);
    const endDate = new Date(data.invoice.end_date);
    const today = new Date();
    
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate && currentDate <= today) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates.reverse(); // Most recent first
  };

  // Toggle date selection for bulk entry
  const toggleDateSelection = (date: string) => {
    setSelectedDates(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  // Enhanced work logging function for specific dates
  const logWorkForDate = async (date: string, worked: boolean) => {
    setEntryLoading(true);
    try {
      console.log('Logging work for date:', { date, worked, trialId: params.invoiceId });
      
      const response = await fetch('/api/contractor/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialInvoiceId: params.invoiceId,
          date: date,
          worked,
          dayRate: worked ? data?.invoice.day_rate : 0,
          truckUsed: worked,
          truckRate: worked ? data?.invoice.truck_rate : 0,
          travelKms: worked ? data?.invoice.travel_kms : 0,
          subsistence: worked ? data?.invoice.subsistence : 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update today's work status if we logged today
        const today = new Date().toISOString().split('T')[0];
        if (date === today) {
          setTodayWorked(worked);
        }
        
        setShowDatePicker(false);
        setSelectedDate('');
        loadDashboardData(); // Refresh data
      } else {
        setError(result.error || 'Failed to log work');
      }
    } catch (error: any) {
      console.error('Failed to log work:', error);
      setError(`Failed to log work: ${error.message}`);
    } finally {
      setEntryLoading(false);
    }
  };

  // Bulk work logging function for multiple dates
  const logBulkWork = async (worked: boolean) => {
    if (selectedDates.length === 0) return;
    
    setEntryLoading(true);
    try {
      console.log('Logging bulk work:', { dates: selectedDates, worked, trialId: params.invoiceId });
      
      // Process all dates in parallel
      const promises = selectedDates.map(date => 
        fetch('/api/contractor/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trialInvoiceId: params.invoiceId,
            date: date,
            worked,
            dayRate: worked ? data?.invoice.day_rate : 0,
            truckUsed: worked,
            truckRate: worked ? data?.invoice.truck_rate : 0,
            travelKms: worked ? data?.invoice.travel_kms : 0,
            subsistence: worked ? data?.invoice.subsistence : 0
          })
        })
      );

      const responses = await Promise.all(promises);
      
      // Check if all requests were successful
      const results = await Promise.all(responses.map(r => r.json()));
      const failedEntries = results.filter(r => !r.success);
      
      if (failedEntries.length === 0) {
        // Update today's work status if today was included
        const today = new Date().toISOString().split('T')[0];
        if (selectedDates.includes(today)) {
          setTodayWorked(worked);
        }
        
        // Reset bulk selection
        setSelectedDates([]);
        setBulkEntryMode(false);
        setShowDatePicker(false);
        
        // Refresh data
        loadDashboardData();
      } else {
        setError(`Failed to log work for ${failedEntries.length} date(s)`);
      }
    } catch (error: any) {
      console.error('Failed to log bulk work:', error);
      setError(`Failed to log bulk work: ${error.message}`);
    } finally {
      setEntryLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDayEarnings = (entry: any) => {
    if (!entry) return 0;
    
    if (data?.invoice.rate_type === 'hourly') {
      // Hourly calculations with overtime/doubletime
      const regularHours = Math.min(entry.hours_worked || 0, 8);
      const overtimeHours = Math.max(0, Math.min((entry.hours_worked || 0) - 8, 4));
      const doubletimeHours = Math.max(0, (entry.hours_worked || 0) - 12);
      
      const regularPay = regularHours * (data.invoice.hourly_rate || 0);
      const overtimePay = overtimeHours * (data.invoice.overtime_rate || data.invoice.hourly_rate || 0) * 1.5;
      const doubletimePay = doubletimeHours * (data.invoice.doubletime_rate || data.invoice.hourly_rate || 0) * 2;
      
      const hourlyTotal = regularPay + overtimePay + doubletimePay;
      const truckRate = entry.truck_used ? entry.truck_rate_used : 0;
      const travelPay = (entry.travel_kms_actual || 0) * (data?.invoice.rate_per_km || 0.68);
      const subsistence = entry.subsistence_actual || 0;
      
      return hourlyTotal + truckRate + travelPay + subsistence;
    } else {
      // Daily rate calculations
      const dayRate = entry.worked ? entry.day_rate_used : 0;
      const truckRate = entry.truck_used ? entry.truck_rate_used : 0;
      const travelPay = (entry.travel_kms_actual || 0) * (data?.invoice.rate_per_km || 0.68);
      const subsistence = entry.subsistence_actual || 0;
      return dayRate + truckRate + travelPay + subsistence;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-sm">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const todayEntry = data.entries.find(e => e.entry_date === new Date().toISOString().split('T')[0]);
  const todaysEarnings = todayWorked && todayEntry ? calculateDayEarnings(todayEntry) : 0;

  // MANDATORY AUTHENTICATION MODAL - MAXIMUM SECURITY
  if (showAuthModal) {
    return (
      <div className="min-h-screen bg-gray-900 bg-opacity-95 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center border-4 border-red-500">
          <div className="text-6xl mb-6">🛡️</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            🔐 SECURITY CHECKPOINT
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold mb-2">
              ⚠️ PROTECTED TRIAL DATA
            </p>
            <p className="text-red-700 text-sm">
              This dashboard contains sensitive financial information. Multi-factor authentication is required for access.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">🔑 Already have an account?</h3>
              <p className="text-blue-700 text-sm mb-3">
                Sign in with your email, password, and receive an OTP code for secure access.
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                🔐 Sign In + OTP Verification
              </button>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-green-900 mb-2">✨ New user?</h3>
              <p className="text-green-700 text-sm mb-3">
                Create a secure account with email verification and OTP protection.
              </p>
              <button
                onClick={() => window.location.href = '/signup'}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                📝 Create Secure Account
              </button>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-xs font-medium">
              🛡️ BANK-LEVEL SECURITY: Two-factor authentication • Rate limiting • Encrypted data • Session management
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">InvoicePatch Trial</h1>
              <p className="text-gray-600 mt-1">Welcome back, {data.invoice.contractor_name}</p>
            </div>
            <div className="text-right">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Day {data.summary?.currentDay || 1} of {data.summary?.totalTrialDays || 15}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {data.summary?.trialDaysRemaining || 0} days remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-3xl font-bold text-green-600">
                  ${(data.summary?.totalEarned || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 text-2xl">💰</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Projected 15-day: ${(data.summary?.projectedTotal || 0).toFixed(2)}
            </p>
          </div>

          {/* Days Worked */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Worked</p>
                <p className="text-3xl font-bold text-blue-600">
                  {data.summary?.daysWorked || 0}/{data.summary?.totalTrialDays || 15}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-2xl">📅</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all" 
                  style={{ width: `${((data.summary?.daysWorked || 0) / (data.summary?.totalTrialDays || 15)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Today's Earnings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${todaysEarnings.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 text-2xl">⭐</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {todayWorked === null ? 'Not logged yet' : todayWorked ? 'Work day logged' : 'Day off logged'}
            </p>
          </div>
        </div>

        {/* Enhanced Work Entry Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              📋 Log Your Work Days
            </h2>
            <p className="text-gray-600">
              Enter work for any day within your trial period ({formatDate(data.invoice.start_date)} - {formatDate(data.invoice.end_date)})
            </p>
          </div>

          {/* Today's Quick Entry */}
          {todayWorked === null && (
            <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Did you work today?
                </h3>
                <p className="text-gray-600 mb-4">
                  Quick entry for {formatDate(new Date().toISOString())}
                </p>
                <div className="flex gap-4 justify-center max-w-md mx-auto">
                  <button 
                    onClick={() => logWorkForDate(new Date().toISOString().split('T')[0], true)}
                    disabled={entryLoading}
                    className="flex-1 py-3 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {entryLoading ? 'Saving...' : '✅ Yes, I worked'}
                  </button>
                  <button 
                    onClick={() => logWorkForDate(new Date().toISOString().split('T')[0], false)}
                    disabled={entryLoading}
                    className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {entryLoading ? 'Saving...' : '🏠 Day off'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Past Days Entry with Multiple Selection */}
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Enter Past Work Days
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setBulkEntryMode(!bulkEntryMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    bulkEntryMode 
                      ? 'bg-purple-500 text-white hover:bg-purple-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {bulkEntryMode ? 'Single Date' : 'Multiple Dates'}
                </button>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  {showDatePicker ? 'Hide Dates' : 'Select Date'}
                </button>
              </div>
            </div>

            {/* Bulk Entry Controls */}
            {bulkEntryMode && selectedDates.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-purple-800 font-medium mb-3">
                    {selectedDates.length} date(s) selected
                  </p>
                  <div className="flex gap-4 justify-center max-w-md mx-auto">
                    <button
                      onClick={() => logBulkWork(true)}
                      disabled={entryLoading}
                      className="flex-1 py-2 px-4 bg-green-500 text-white rounded font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {entryLoading ? 'Saving...' : '✅ All Worked'}
                    </button>
                    <button
                      onClick={() => logBulkWork(false)}
                      disabled={entryLoading}
                      className="flex-1 py-2 px-4 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      {entryLoading ? 'Saving...' : '🏠 All Day Off'}
                    </button>
                    <button
                      onClick={() => setSelectedDates([])}
                      className="px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showDatePicker && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  {bulkEntryMode 
                    ? 'Select multiple dates to apply work status to all at once.' 
                    : 'Select a date to log work. You can only enter work for dates within your trial period and up to today.'
                  }
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                  {getAvailableDates().map((date) => {
                    const existingEntry = data.entries.find(e => e.entry_date === date);
                    const isToday = date === new Date().toISOString().split('T')[0];
                    const isSelected = selectedDates.includes(date);
                    
                    return (
                      <div key={date} className={`border rounded-lg p-3 ${
                        bulkEntryMode && isSelected 
                          ? 'border-purple-400 bg-purple-50' 
                          : 'border-gray-200'
                      }`}>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {bulkEntryMode && (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleDateSelection(date)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                            )}
                            <p className="font-medium text-gray-900">
                              {formatDate(date)}
                              {isToday && <span className="text-blue-600 text-sm ml-1">(Today)</span>}
                            </p>
                          </div>
                          {existingEntry && (
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                existingEntry.worked 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {existingEntry.worked ? '✅ Worked' : '🏠 Day off'}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                ${calculateDayEarnings(existingEntry).toFixed(2)}
                                {data.invoice.rate_type === 'hourly' && existingEntry.hours_worked && (
                                  <span className="block">{existingEntry.hours_worked}h</span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {!bulkEntryMode && !existingEntry && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => logWorkForDate(date, true)}
                              disabled={entryLoading}
                              className="flex-1 py-2 px-3 text-xs bg-green-500 text-white rounded font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              Worked
                            </button>
                            <button
                              onClick={() => logWorkForDate(date, false)}
                              disabled={entryLoading}
                              className="flex-1 py-2 px-3 text-xs bg-gray-500 text-white rounded font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                              Day off
                            </button>
                          </div>
                        )}
                        
                        {!bulkEntryMode && existingEntry && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => logWorkForDate(date, true)}
                              disabled={entryLoading}
                              className={`flex-1 py-2 px-3 text-xs rounded font-medium transition-colors disabled:opacity-50 ${
                                existingEntry.worked 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'
                              }`}
                            >
                              Worked
                            </button>
                            <button
                              onClick={() => logWorkForDate(date, false)}
                              disabled={entryLoading}
                              className={`flex-1 py-2 px-3 text-xs rounded font-medium transition-colors disabled:opacity-50 ${
                                !existingEntry.worked 
                                  ? 'bg-gray-500 text-white' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-500 hover:text-white'
                              }`}
                            >
                              Day off
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {getAvailableDates().length === 0 && (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📅</span>
                    <p className="text-gray-500">No available dates to enter work for</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {todayWorked === true && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <div>
                <p className="text-green-800 font-medium">Today's work logged!</p>
                <p className="text-green-600 text-sm">Earned ${todaysEarnings.toFixed(2)} today</p>
              </div>
            </div>
          </div>
        )}

        {todayWorked === false && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-gray-500 text-xl mr-3">🏠</span>
              <p className="text-gray-600">Day off logged for today</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work History - Modern Accordion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Work History</h3>
                  <p className="text-sm text-gray-600">Your daily work log organized by week</p>
                </div>
                <div className="text-sm text-gray-500">
                  {data.entries.length} entries
                </div>
              </div>
            </div>
            <div className="p-6">
              {data.entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No work entries yet</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Start logging your work days using the entry form above to see your progress here.
                  </p>
                </div>
              ) : (
                <WorkEntryAccordion
                  entries={data.entries}
                  calculateDayEarnings={calculateDayEarnings}
                  formatDate={formatDate}
                  rateType={data.invoice.rate_type}
                />
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Trial Invoice Details</h3>
                  <p className="text-sm text-gray-600">#{data.invoice.sequence_number}</p>
                </div>
                <button
                  onClick={() => setShowInvoiceDetails(!showInvoiceDetails)}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  {showInvoiceDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-medium text-gray-900">{data.invoice.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{data.invoice.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trial Period</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(data.invoice.start_date)} - {formatDate(data.invoice.end_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rate Type</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                    data.invoice.rate_type === 'hourly' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {data.invoice.rate_type === 'hourly' ? 'Hourly' : 'Daily'} Rate
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {data.invoice.status}
                  </span>
                </div>
              </div>

              {showInvoiceDetails && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Rate Structure</h4>
                  <div className="space-y-3">
                    {data.invoice.rate_type === 'hourly' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Regular Rate (1-8h)</span>
                          <span className="font-medium">${data.invoice.hourly_rate || 0}/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Overtime Rate (8-12h)</span>
                          <span className="font-medium">${((data.invoice.hourly_rate || 0) * 1.5).toFixed(2)}/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Double Time (12+h, BC)</span>
                          <span className="font-medium">${((data.invoice.hourly_rate || 0) * 2).toFixed(2)}/hour</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Day Rate</span>
                        <span className="font-medium">${data.invoice.day_rate}/day</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Truck Rate</span>
                      <span className="font-medium">${data.invoice.truck_rate}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travel ({data.invoice.travel_kms} km)</span>
                      <span className="font-medium">${(data.invoice.travel_kms * data.invoice.rate_per_km).toFixed(2)}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subsistence</span>
                      <span className="font-medium">${data.invoice.subsistence}/day</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>
                          {data.invoice.rate_type === 'hourly' 
                            ? 'Daily Total (8h regular)' 
                            : 'Daily Total (when working)'
                          }
                        </span>
                        <span>
                          ${data.invoice.rate_type === 'hourly' 
                            ? ((data.invoice.hourly_rate || 0) * 8 + data.invoice.truck_rate + (data.invoice.travel_kms * data.invoice.rate_per_km) + data.invoice.subsistence).toFixed(2)
                            : (data.invoice.day_rate + data.invoice.truck_rate + (data.invoice.travel_kms * data.invoice.rate_per_km) + data.invoice.subsistence).toFixed(2)
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to continue with InvoicePatch?</h3>
          <p className="text-blue-100 mb-6">
            Complete your trial and upgrade to manage full invoicing workflows
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Learn More
            </button>
            <button className="bg-blue-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-300 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard; 