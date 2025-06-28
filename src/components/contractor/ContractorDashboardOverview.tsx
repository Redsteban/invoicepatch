'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContractor } from '@/contexts/ContractorContext';
import { 
  DollarSign, MapPin, Zap, Play, Pause, CheckCircle, Activity, Fuel, Wrench, TrendingUp, Clock,
  Briefcase, Calendar, Check, Camera, Clipboard, Target, ArrowRight, Sparkles, Info
} from 'lucide-react';

interface ProjectInfo {
  name: string;
  location: string;
  company: string;
  rate: number;
  rateType: 'hourly' | 'daily';
}

interface Goal {
  text: string;
  completed: boolean;
  icon: React.ElementType;
}

interface ActivityItem {
  type: 'time' | 'photo' | 'note';
  text: string;
  time: string;
  icon: React.ElementType;
}

const ContractorDashboardOverview = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);
  
  // Simulation context
  const { 
    isSimulationMode, 
    simulationDay, 
    simulationData, 
    advanceSimulationDay 
  } = useContractor();
  
  const [goals, setGoals] = useState<Goal[]>([
    { text: 'Clock in at well site', completed: false, icon: Clock },
    { text: 'Complete safety checklist', completed: false, icon: CheckCircle },
    { text: 'Log equipment usage', completed: false, icon: Wrench },
    { text: 'Submit daily field ticket', completed: false, icon: Clipboard },
  ]);

  useEffect(() => {
    if (isWorking) {
      setGoals(g => g.map(goal => goal.text === 'Clock in at well site' ? { ...goal, completed: true } : goal));
    }
  }, [isWorking]);

  const getWorkDuration = () => {
    if (!workStartTime) return '00:00:00';
    const diff = new Date().getTime() - workStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [workDuration, setWorkDuration] = useState(getWorkDuration());

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWorking) {
      timer = setInterval(() => {
        setWorkDuration(getWorkDuration());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWorking, workStartTime]);


  const toggleWork = () => {
    if (isWorking) {
      setIsWorking(false);
    } else {
      setIsWorking(true);
      setWorkStartTime(new Date());
    }
  };

  const handleAdvanceDay = () => {
    advanceSimulationDay();
    // Reset work state for new day
    setIsWorking(false);
    setWorkStartTime(null);
    setGoals(g => g.map(goal => ({ ...goal, completed: false })));
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Get simulation scenario data
  const getCurrentScenario = () => {
    if (!isSimulationMode || !simulationData.scenarios) return null;
    return simulationData.scenarios[simulationDay] || null;
  };

  const currentScenario = getCurrentScenario();

  const currentProject: ProjectInfo = {
    name: isSimulationMode ? (currentScenario?.projectName || 'Demo Project') : 'Permian Basin Site 42',
    location: isSimulationMode ? (currentScenario?.location || 'Demo Location') : 'Midland, TX',
    company: isSimulationMode ? (currentScenario?.company || 'Demo Company') : 'Apex Drilling',
    rate: isSimulationMode ? (currentScenario?.rate || 72.50) : 72.50,
    rateType: 'hourly'
  };

  const payPeriod = {
    earnings: isSimulationMode ? (currentScenario?.earnings || 5220.00) : 5220.00,
    daysWorked: isSimulationMode ? simulationDay : 9,
    daysRemaining: isSimulationMode ? (15 - simulationDay) : 5,
    completion: isSimulationMode ? (simulationDay / 15) * 100 : (9/14) * 100,
    projectedEarnings: isSimulationMode ? (currentScenario?.projectedEarnings || 72.50 * 8 * 15) : 72.50 * 8 * 14,
  };

  const performanceMetrics = {
    quarterlyEarnings: isSimulationMode ? (currentScenario?.quarterlyEarnings || 15800.00) : 15800.00,
    quarterlyChange: isSimulationMode ? (currentScenario?.quarterlyChange || 12) : 12,
    attendanceRate: isSimulationMode ? (currentScenario?.attendanceRate || 99) : 99,
    efficiencyScore: isSimulationMode ? (currentScenario?.efficiencyScore || 97) : 97,
  };

  const recentActivity: ActivityItem[] = isSimulationMode ? [
    { type: 'time', text: currentScenario?.activities?.[0] || 'Started demo shift', time: '06:58 AM', icon: Clock },
    { type: 'photo', text: currentScenario?.activities?.[1] || 'Uploaded demo photos', time: '07:15 AM', icon: Camera },
    { type: 'note', text: currentScenario?.activities?.[2] || 'Demo note: System operational', time: '10:30 AM', icon: Clipboard },
  ] : [
    { type: 'time', text: 'Started shift', time: '06:58 AM', icon: Clock },
    { type: 'photo', text: 'Uploaded pre-shift inspection photos', time: '07:15 AM', icon: Camera },
    { type: 'note', text: 'Note: Frac pump #3 pressure nominal', time: '10:30 AM', icon: Clipboard },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Simulation Progress Overlay */}
      {isSimulationMode && (
        <motion.div 
          variants={fadeInUp} 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Demo Mode - Day {simulationDay} of 15</h3>
                <p className="text-sm text-blue-600">Interactive simulation in progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Demo Data</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-blue-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((simulationDay / 15) * 100)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <motion.div 
                className="bg-blue-600 h-3 rounded-full" 
                style={{ width: `${(simulationDay / 15) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${(simulationDay / 15) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Current Scenario */}
          {currentScenario && (
            <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-800 mb-2">Current Scenario</h4>
                  <p className="text-sm text-blue-700 mb-2">{currentScenario.description}</p>
                  {currentScenario.nextEvent && (
                    <div className="bg-blue-50 border border-blue-100 rounded p-2">
                      <p className="text-xs font-medium text-blue-800 mb-1">Next Event:</p>
                      <p className="text-xs text-blue-700">{currentScenario.nextEvent}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Advance Day Button */}
          <motion.button
            onClick={handleAdvanceDay}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Advance to Day {simulationDay + 1}</span>
          </motion.button>
        </motion.div>
      )}

      <motion.div variants={fadeInUp} className="bg-white border border-gray-200 text-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isSimulationMode ? 'Demo Dashboard' : 'Field Operations Dashboard'}
            </h2>
            <p className="text-gray-500 mt-1">
              {currentProject.name} - {currentProject.company}
            </p>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${
            isSimulationMode 
              ? 'bg-blue-100 text-blue-700 border-blue-200' 
              : 'bg-green-100 text-green-700 border-green-200'
          }`}>
            <Zap className="w-4 h-4" />
            <span>{isSimulationMode ? 'Demo Mode' : 'Active Site'}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin size={16} />
            <span>{currentProject.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign size={16} />
            <span>{formatCurrency(currentProject.rate)} / hour</span>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isSimulationMode ? 'Demo Shift Timer' : 'Live Shift Timer'}
              </h3>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-center my-6">
              <p className="text-6xl font-mono font-bold text-gray-900 tracking-tight">{workDuration}</p>
              <p className={`mt-2 text-sm font-medium ${isWorking ? 'text-green-600' : 'text-gray-500'}`}>
                {isWorking ? 'Shift in progress...' : 'Shift not started'}
              </p>
            </div>
            <motion.button
              onClick={toggleWork}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2
                ${isWorking ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} shadow-lg`}
            >
              {isWorking ? <Pause size={20} /> : <Play size={20} />}
              <span>{isWorking ? 'End Shift' : 'Start Shift'}</span>
            </motion.button>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isSimulationMode ? 'Demo Tasks' : 'Today\'s Tasks'}
            </h3>
            <ul className="space-y-3">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <goal.icon size={20} className={`${goal.completed ? 'text-green-500' : 'text-green-600'} transition-colors`} />
                    <span className={`ml-3 text-sm font-medium ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{goal.text}</span>
                  </div>
                  {!goal.completed && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isSimulationMode ? 'Demo Pay Period' : 'Current Pay Period'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(payPeriod.earnings)}</p>
                <p className="text-sm text-gray-500">Gross Earnings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{payPeriod.daysWorked}</p>
                <p className="text-sm text-gray-500">Days Worked</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{payPeriod.daysRemaining}</p>
                <p className="text-sm text-gray-500">Days Remaining</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{payPeriod.completion.toFixed(0)}%</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${payPeriod.completion}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${payPeriod.completion}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-right text-sm text-gray-500 mt-2">
                Projected Earnings: <span className="font-semibold text-gray-800">{formatCurrency(payPeriod.projectedEarnings)}</span>
              </p>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isSimulationMode ? 'Demo Performance' : 'Performance Metrics'}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500">Quarterly Earnings</p>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{formatCurrency(performanceMetrics.quarterlyEarnings)}</p>
                  <p className="text-xs text-green-600 flex items-center justify-end">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>{performanceMetrics.quarterlyChange}% vs. last quarter</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                <p className="font-semibold text-gray-800">{performanceMetrics.attendanceRate}%</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500">Efficiency Score</p>
                <p className="font-semibold text-gray-800">{performanceMetrics.efficiencyScore}/100</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isSimulationMode ? 'Demo Activity' : 'Recent Activity'}
            </h3>
            <ul className="space-y-4">
              {recentActivity.map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <item.icon size={16} className="text-gray-600" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm text-gray-700">{item.text}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContractorDashboardOverview; 