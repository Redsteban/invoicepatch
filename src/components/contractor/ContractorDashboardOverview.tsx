'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Truck,
  AlertCircle,
  CheckCircle,
  Camera,
  FileText,
  Play,
  Pause,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface WorkPeriod {
  id: string;
  startDate: string;
  endDate: string;
  daysWorked: number;
  totalDays: number;
  earnings: number;
  status: 'active' | 'completed' | 'upcoming';
}

interface ProjectInfo {
  name: string;
  location: string;
  company: string;
  rate: number;
  rateType: 'hourly' | 'daily';
}

const ContractorDashboardOverview = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorking, setIsWorking] = useState(false);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const currentProject: ProjectInfo = {
    name: 'Leduc County Well Site',
    location: 'Site 12-24-049-25W4 - Drilling Operations',
    company: 'Suncor Energy Services',
    rate: 52.50,
    rateType: 'hourly'
  };

  const currentPeriod: WorkPeriod = {
    id: 'period-2024-01-15',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    daysWorked: 8,
    totalDays: 10,
    earnings: 3367.50,
    status: 'active'
  };

  const recentPeriods: WorkPeriod[] = [
    {
      id: 'period-2024-01-01',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      daysWorked: 10,
      totalDays: 10,
      earnings: 4250.00,
      status: 'completed'
    },
    {
      id: 'period-2023-12-15',
      startDate: '2023-12-15',
      endDate: '2023-12-31',
      daysWorked: 9,
      totalDays: 10,
      earnings: 3825.00,
      status: 'completed'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (period: WorkPeriod) => {
    return (period.daysWorked / period.totalDays) * 100;
  };

  const getDaysUntilPeriodEnd = () => {
    const endDate = new Date(currentPeriod.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getTotalEarningsThisQuarter = () => {
    return recentPeriods.reduce((sum, period) => sum + period.earnings, 0) + currentPeriod.earnings;
  };

  const getWorkDuration = () => {
    if (!workStartTime) return '00:00';
    const diff = currentTime.getTime() - workStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const toggleWork = () => {
    if (isWorking) {
      setIsWorking(false);
      setWorkStartTime(null);
    } else {
      setIsWorking(true);
      setWorkStartTime(new Date());
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Good morning, Field Contractor!</h2>
            <p className="text-emerald-100 mb-4">
              Ready for another productive day at the {currentProject.name}?
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{currentProject.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(currentProject.rate)}/{currentProject.rateType}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{formatDate(currentTime.toISOString())}</div>
            <div className="text-emerald-100">{currentTime.toLocaleDateString('en-CA', { weekday: 'long' })}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Timer */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Work Timer</h3>
            <div className={`w-3 h-3 rounded-full ${isWorking ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
              {getWorkDuration()}
            </div>
            <p className="text-gray-600">
              {isWorking ? 'Currently working' : 'Not started today'}
            </p>
          </div>
          
          <button
            onClick={toggleWork}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              isWorking 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isWorking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isWorking ? 'End Work' : 'Start Work'}</span>
          </button>
        </div>

        {/* Today's Goals */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Goals</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-900">Clock in on time</span>
              </div>
              <span className="text-sm text-emerald-600 font-medium">Completed</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">Work 8 hours</span>
              </div>
              <span className="text-sm text-gray-500">In Progress</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Camera className="w-5 h-5 text-orange-600" />
                <span className="text-gray-900">Upload 3 progress photos</span>
              </div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-gray-900">Submit timesheet</span>
              </div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Period Overview */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Pay Period</h3>
          <span className="text-sm text-gray-600">
            {formatDate(currentPeriod.startDate)} - {formatDate(currentPeriod.endDate)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(currentPeriod.earnings)}</div>
            <div className="text-sm text-gray-600">Current Earnings</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentPeriod.daysWorked}</div>
            <div className="text-sm text-gray-600">Days Worked</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{getDaysUntilPeriodEnd()}</div>
            <div className="text-sm text-gray-600">Days Remaining</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{getProgressPercentage(currentPeriod).toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Period Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Period Progress</span>
            <span>{currentPeriod.daysWorked} of {currentPeriod.totalDays} days</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${getProgressPercentage(currentPeriod)}%` }}
            />
          </div>
        </div>

        {/* Projected Earnings */}
        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Projected Period Total</p>
              <p className="text-xs text-emerald-600">Based on current rate and remaining days</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-emerald-700">
                {formatCurrency((currentPeriod.earnings / currentPeriod.daysWorked) * currentPeriod.totalDays)}
              </div>
              <div className="text-xs text-emerald-600">
                +{formatCurrency((currentPeriod.earnings / currentPeriod.daysWorked) * (currentPeriod.totalDays - currentPeriod.daysWorked))} remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Quarterly Earnings</h4>
              <p className="text-sm text-gray-600">Jan - Mar 2024</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatCurrency(getTotalEarningsThisQuarter())}
          </div>
          <div className="flex items-center space-x-1 text-sm text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs last quarter</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Attendance Rate</h4>
              <p className="text-sm text-gray-600">Last 30 days</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">96%</div>
          <div className="flex items-center space-x-1 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            <span>Excellent performance</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Efficiency Score</h4>
              <p className="text-sm text-gray-600">Task completion</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">94%</div>
          <div className="flex items-center space-x-1 text-sm text-purple-600">
            <Zap className="w-4 h-4" />
            <span>Above average</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Timesheet submitted for Jan 1-14</p>
              <p className="text-sm text-gray-600">Payment processed - {formatCurrency(4250.00)}</p>
            </div>
            <div className="text-sm text-gray-500">2 days ago</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Progress photos uploaded</p>
              <p className="text-sm text-gray-600">Foundation work - east section (5 photos)</p>
            </div>
            <div className="text-sm text-gray-500">Yesterday</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Worked 8.5 hours</p>
              <p className="text-sm text-gray-600">Calgary Downtown Tower - Site A</p>
            </div>
            <div className="text-sm text-gray-500">Yesterday</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboardOverview; 