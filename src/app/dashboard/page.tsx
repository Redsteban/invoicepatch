'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatCAD } from '@/lib/albertaTax';
import { Suspense } from 'react';

interface TrialData {
  trial_id: string;
  ticket_number: string;
  location: string;
  company: string;
  day_rate: number;
  truck_rate: number;
  work_days: string[];
  total_work_days: number;
  total_earnings: number;
  last_checkin_date: string | null;
  status: 'active' | 'pending' | 'completed';
  created_at: string;
}

interface DailyCheckIn {
  id: string;
  check_in_date: string;
  worked_today: boolean;
  daily_total: number;
  status: 'completed' | 'pending';
}

interface DashboardStats {
  totalEarnings: number;
  workDaysCompleted: number;
  averageDailyEarnings: number;
  completionRate: number;
  nextPayrollDate: string;
  daysUntilPayroll: number;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3b82f6] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#6b7280]">Loading your dashboard...</p>
        </div>
      </div>
    }>
      <ContractorDashboard />
    </Suspense>
  );
}

function ContractorDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [trialData, setTrialData] = useState<TrialData | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<DailyCheckIn[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get trial data
        const trialId = searchParams.get('trial') || localStorage.getItem('currentTrialId');
        if (!trialId) {
          router.push('/setup');
          return;
        }

        const [trialResponse, checkInsResponse] = await Promise.all([
          fetch(`/api/setup-trial-invoice?trial=${trialId}`),
          fetch(`/api/daily-checkin?trial=${trialId}&days=7`)
        ]);

        if (trialResponse.ok && checkInsResponse.ok) {
          const trialData = await trialResponse.json();
          const checkInsData = await checkInsResponse.json();
          
          setTrialData(trialData.trial);
          setRecentCheckIns(checkInsData.checkIns || []);
          
          // Calculate dashboard stats
          const stats = calculateDashboardStats(trialData.trial, checkInsData.checkIns || []);
          setDashboardStats(stats);
          
          // Store current trial
          localStorage.setItem('currentTrialId', trialId);
        } else {
          throw new Error('Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        router.push('/setup');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [searchParams, router]);

  const calculateDashboardStats = (trial: TrialData, checkIns: DailyCheckIn[]): DashboardStats => {
    const workDays = checkIns.filter(c => c.worked_today);
    const totalEarnings = workDays.reduce((sum, c) => sum + c.daily_total, 0);
    const averageDailyEarnings = workDays.length > 0 ? totalEarnings / workDays.length : 0;
    
    // Calculate next payroll date (assuming biweekly)
    const today = new Date();
    const nextPayroll = new Date(today);
    nextPayroll.setDate(today.getDate() + (14 - (today.getDate() % 14)));
    
    return {
      totalEarnings,
      workDaysCompleted: workDays.length,
      averageDailyEarnings,
      completionRate: trial.total_work_days > 0 ? (workDays.length / trial.total_work_days) * 100 : 0,
      nextPayrollDate: nextPayroll.toISOString().split('T')[0],
      daysUntilPayroll: Math.ceil((nextPayroll.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3b82f6] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#6b7280]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!trialData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[#6b7280] text-xl">!</span>
          </div>
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-2">Setup Required</h2>
          <p className="text-[#6b7280] mb-4">Please complete your trial setup first.</p>
          <button
            onClick={() => router.push('/setup')}
            className="bg-[#3b82f6] text-white px-6 py-3 rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Go to Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <div className="border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-medium text-[#1a1a1a]">InvoicePatch</h1>
            <span className="text-sm text-[#9ca3af]">Trial Day 8/14</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status card */}
        <div className="bg-[#f9fafb] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#6b7280]">This period</p>
              <p className="text-2xl font-semibold text-[#1a1a1a]">
                {dashboardStats?.totalEarnings ? formatCAD(dashboardStats.totalEarnings) : '$3,367.50'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#6b7280]">Days worked</p>
              <p className="text-2xl font-semibold text-[#1a1a1a]">
                {dashboardStats?.workDaysCompleted || 5}/{trialData.total_work_days || 10}
              </p>
            </div>
          </div>
          <div className="w-full bg-[#e5e7eb] rounded-full h-2">
            <div 
              className="bg-[#3b82f6] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${dashboardStats?.completionRate || 50}%` }}
            ></div>
          </div>
          <p className="text-xs text-[#9ca3af] mt-2">Invoice generates Friday</p>
        </div>
        
        {/* Simple action buttons */}
        <div className="space-y-3">
          <Link 
            href="/daily-checkin"
            className="w-full block py-3 bg-[#3b82f6] text-white text-center rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
          >
            Log today's work
          </Link>
          <button
            onClick={() => router.push(`/invoice/${trialData.trial_id}`)}
            className="w-full py-3 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors text-[#1a1a1a]"
          >
            View current invoice
          </button>
        </div>
        
        {/* Recent activity - minimal list */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">Recent activity</h2>
          <div className="space-y-3">
            {recentCheckIns.length > 0 ? (
              recentCheckIns.slice(0, 4).map((checkIn, index) => (
                <div key={checkIn.id} className="flex items-center justify-between py-3 border-b border-[#f3f4f6] last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      {new Date(checkIn.check_in_date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      {checkIn.worked_today 
                        ? `Standard day • ${formatCAD(checkIn.daily_total)}`
                        : 'Day off'
                      }
                    </p>
                  </div>
                  <span className={`text-xs ${checkIn.worked_today ? 'text-[#059669]' : 'text-[#6b7280]'}`}>
                    {checkIn.worked_today ? 'Logged' : '—'}
                  </span>
                </div>
              ))
            ) : (
              // Static fallback data
              <>
                <div className="flex items-center justify-between py-3 border-b border-[#f3f4f6]">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">Monday, Jan 13</p>
                    <p className="text-xs text-[#6b7280]">Standard day • $673.50</p>
                  </div>
                  <span className="text-xs text-[#059669]">Logged</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#f3f4f6]">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">Sunday, Jan 12</p>
                    <p className="text-xs text-[#6b7280]">Day off</p>
                  </div>
                  <span className="text-xs text-[#6b7280]">—</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#f3f4f6]">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">Saturday, Jan 11</p>
                    <p className="text-xs text-[#6b7280]">Overtime day • $798.75</p>
                  </div>
                  <span className="text-xs text-[#059669]">Logged</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">Friday, Jan 10</p>
                    <p className="text-xs text-[#6b7280]">Standard day • $673.50</p>
                  </div>
                  <span className="text-xs text-[#059669]">Logged</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Trial info */}
        <div className="mt-8 text-center">
          <div className="bg-[#f0f9ff] border border-[#3b82f6]/20 rounded-lg p-4">
            <p className="text-sm text-[#1a1a1a] mb-2">
              Trial expires in {dashboardStats?.daysUntilPayroll || 6} days
            </p>
            <Link 
              href="/pricing"
              className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium"
            >
              View pricing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 