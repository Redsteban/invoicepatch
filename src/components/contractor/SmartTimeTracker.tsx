'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  PhotoIcon,
  MicrophoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CloudIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { 
  workPeriodIntelligence, 
  TimeEntry, 
  MissingTimeAlert, 
  SmartSuggestion,
  WorkPattern 
} from '../../lib/work-period-intelligence';
import { 
  stackPayrollCalendar, 
  formatDate, 
  formatDateShort, 
  getDaysUntil 
} from '../../lib/payroll-calendar';

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  elapsedTime: number;
  breakTime: number;
  isOnBreak: boolean;
}

const SmartTimeTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    breakTime: 0,
    isOnBreak: false
  });
  const [gpsLocation, setGpsLocation] = useState<GPSLocation | null>(null);
  const [missingAlerts, setMissingAlerts] = useState<MissingTimeAlert[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeEntry, setTimeEntry] = useState<Partial<TimeEntry>>({
    startTime: '',
    endTime: '',
    breakMinutes: 30,
    projectCode: '',
    siteLocation: '',
    description: '',
    weatherConditions: ''
  });
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [isGPSEnabled, setIsGPSEnabled] = useState(false);

  const contractorId = 'contractor-001'; // In real app, get from auth

  useEffect(() => {
    // Initialize GPS tracking
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          });
          setIsGPSEnabled(true);
        },
        (error) => {
          console.error('GPS Error:', error);
          setIsGPSEnabled(false);
        }
      );
    }

    // Load missing time alerts
    const alerts = workPeriodIntelligence.getMissingTimeAlerts(contractorId);
    setMissingAlerts(alerts);

    // Load smart suggestions for today
    const suggestions = workPeriodIntelligence.getSmartSuggestions(contractorId, new Date());
    setSmartSuggestions(suggestions);

    // Timer update interval
    const interval = setInterval(() => {
      if (timerState.isRunning && timerState.startTime) {
        const elapsed = Math.floor((Date.now() - timerState.startTime.getTime()) / 1000);
        setTimerState(prev => ({ ...prev, elapsedTime: elapsed }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.startTime]);

  const startTimer = () => {
    const now = new Date();
    setTimerState({
      isRunning: true,
      startTime: now,
      elapsedTime: 0,
      breakTime: 0,
      isOnBreak: false
    });
    
    // Auto-fill start time
    setTimeEntry(prev => ({
      ...prev,
      startTime: now.toTimeString().slice(0, 5)
    }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isOnBreak: true
    }));
  };

  const resumeTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isOnBreak: false
    }));
  };

  const stopTimer = () => {
    if (timerState.startTime) {
      const endTime = new Date();
      const totalHours = Math.round(((timerState.elapsedTime - timerState.breakTime) / 3600) * 100) / 100;
      
      setTimeEntry(prev => ({
        ...prev,
        endTime: endTime.toTimeString().slice(0, 5),
        totalHours,
        breakMinutes: Math.floor(timerState.breakTime / 60)
      }));
    }
    
    setTimerState({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      breakTime: 0,
      isOnBreak: false
    });
  };

  const applySuggestion = (suggestion: SmartSuggestion) => {
    switch (suggestion.type) {
      case 'time_entry':
        setTimeEntry(prev => ({ ...prev, ...suggestion.data }));
        break;
      case 'project_code':
        setTimeEntry(prev => ({ ...prev, projectCode: suggestion.data.projectCode }));
        break;
      case 'travel':
        // Add travel time to description
        setTimeEntry(prev => ({
          ...prev,
          description: `${prev.description || ''} (Travel: ${suggestion.data.travelTime}min to ${suggestion.data.site})`.trim()
        }));
        break;
    }
  };

  const autoFillMissingDay = (alert: MissingTimeAlert) => {
    if (alert.autoFillData) {
      setSelectedDate(alert.date);
      setTimeEntry({
        ...alert.autoFillData,
        date: alert.date
      });
      setShowQuickEntry(true);
    }
  };

  const verifyLocation = () => {
    if (gpsLocation && timeEntry.siteLocation) {
      const verification = workPeriodIntelligence.verifyWorkLocation(
        timeEntry as TimeEntry,
        { latitude: gpsLocation.latitude, longitude: gpsLocation.longitude }
      );
      
      return verification;
    }
    return null;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentPeriod = stackPayrollCalendar.getCurrentPeriod();
  const locationVerification = verifyLocation();

  return (
    <div className="space-y-6">
      {/* Live Timer */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ClockIcon className="h-6 w-6" />
              Smart Time Tracker
            </h2>
            <p className="text-blue-100">
              {currentPeriod ? 
                `Current period: ${stackPayrollCalendar.formatPeriod(currentPeriod)}` :
                'No active work period'
              }
            </p>
          </div>
          
          {isGPSEnabled && gpsLocation && (
            <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
              <MapPinIcon className="h-5 w-5" />
              <span className="text-sm">GPS Active</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Timer Display */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold mb-2">
                {formatTime(timerState.elapsedTime)}
              </div>
              <div className="text-sm text-blue-100">
                {timerState.isOnBreak ? 'On Break' : timerState.isRunning ? 'Working' : 'Stopped'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex justify-center gap-2">
              {!timerState.isRunning && !timerState.startTime && (
                <button
                  onClick={startTimer}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg"
                >
                  <PlayIcon className="h-6 w-6" />
                </button>
              )}
              
              {timerState.isRunning && (
                <button
                  onClick={pauseTimer}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg"
                >
                  <PauseIcon className="h-6 w-6" />
                </button>
              )}
              
              {timerState.isOnBreak && (
                <button
                  onClick={resumeTimer}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                >
                  <PlayIcon className="h-6 w-6" />
                </button>
              )}
              
              {timerState.startTime && (
                <button
                  onClick={stopTimer}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
                >
                  <StopIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-center">
              <div className="text-lg font-semibold">
                {timeEntry.totalHours ? `${timeEntry.totalHours}h` : '0h'}
              </div>
              <div className="text-sm text-blue-100">Today's Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Time Alerts */}
      {missingAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
        >
          <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            Missing Time Entries ({missingAlerts.length})
          </h3>
          
          <div className="space-y-2">
            {missingAlerts.slice(0, 3).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-white rounded-lg p-3"
              >
                <div>
                  <div className="font-medium text-gray-900">{alert.message}</div>
                  <div className="text-sm text-gray-600">{alert.suggestedAction}</div>
                </div>
                
                <button
                  onClick={() => autoFillMissingDay(alert)}
                  className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  Quick Add
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            Smart Suggestions
          </h3>
          
          <div className="space-y-2">
            {smartSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-white rounded-lg p-3"
              >
                <div>
                  <div className="font-medium text-gray-900">{suggestion.suggestion}</div>
                  <div className="text-sm text-gray-600">
                    {suggestion.reasoning} (Confidence: {suggestion.confidence}%)
                  </div>
                </div>
                
                <button
                  onClick={() => applySuggestion(suggestion)}
                  className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors"
                >
                  Apply
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Time Entry Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Time Entry for {formatDate(selectedDate)}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={timeEntry.startTime}
              onChange={(e) => setTimeEntry(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={timeEntry.endTime}
              onChange={(e) => setTimeEntry(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Break Time (minutes)
            </label>
            <input
              type="number"
              value={timeEntry.breakMinutes}
              onChange={(e) => setTimeEntry(prev => ({ ...prev, breakMinutes: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="480"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Code
            </label>
            <select
              value={timeEntry.projectCode}
              onChange={(e) => setTimeEntry(prev => ({ ...prev, projectCode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Project</option>
              <option value="MONTNEY-DRILL">Montney Horizontal Drilling</option>
              <option value="PIPELINE-INTEGRITY">Pipeline Integrity Assessment</option>
              <option value="WELL-MAINTENANCE">Well Site Maintenance</option>
              <option value="PRODUCTION-TEST">Production Testing Services</option>
              <option value="SAFETY-AUDIT">Safety Compliance Audit</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Location
            </label>
            <input
              type="text"
              value={timeEntry.siteLocation}
              onChange={(e) => setTimeEntry(prev => ({ ...prev, siteLocation: e.target.value }))}
              placeholder="e.g., Montney Field Site A"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weather Conditions
            </label>
            <select
              value={timeEntry.weatherConditions}
              onChange={(e) => setTimeEntry(prev => ({ ...prev, weatherConditions: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Weather</option>
              <option value="Clear">Clear</option>
              <option value="Partly Cloudy">Partly Cloudy</option>
              <option value="Overcast">Overcast</option>
              <option value="Light Rain">Light Rain</option>
              <option value="Heavy Rain">Heavy Rain</option>
              <option value="Snow">Snow</option>
              <option value="Extreme Cold">Extreme Cold (-30°C or below)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Description
          </label>
          <textarea
            value={timeEntry.description}
            onChange={(e) => setTimeEntry(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the work performed..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Location Verification */}
        {locationVerification && (
          <div className={`mt-4 p-3 rounded-lg ${
            locationVerification.verified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className={`flex items-center gap-2 ${
              locationVerification.verified ? 'text-green-800' : 'text-yellow-800'
            }`}>
              <MapPinIcon className="h-5 w-5" />
              <span className="font-medium">Location Verification</span>
            </div>
            <p className={`text-sm mt-1 ${
              locationVerification.verified ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {locationVerification.message} (Confidence: {locationVerification.confidence}%)
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Save Entry
          </button>
          <button className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
            Save as Draft
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-emerald-600 text-white p-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
          <CalendarDaysIcon className="h-5 w-5" />
          Bulk Week Entry
        </button>
        
        <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
          <PhotoIcon className="h-5 w-5" />
          Add Photos
        </button>
        
        <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
          <MicrophoneIcon className="h-5 w-5" />
          Voice Notes
        </button>
      </div>
    </div>
  );
};

export default SmartTimeTracker; 