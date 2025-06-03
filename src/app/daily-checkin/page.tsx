'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDailyAlbertaTax, formatCAD, type AlbertaInvoiceCalculation, STANDARD_TRAVEL_RATE_PER_KM, ALBERTA_GST_RATE } from '@/lib/albertaTax';
import { TrialManager, type DailyCheckInData, type TrialData } from '@/lib/trialManager';
import {
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TruckIcon,
  MapIcon,
  CakeIcon,
  MicrophoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  WifiIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  SignalSlashIcon,
  InformationCircleIcon,
  BookmarkIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

// Speech Recognition type declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

const DailyCheckInPage = () => {
  const [currentStep, setCurrentStep] = useState<'worked' | 'details' | 'summary'>('worked');
  const [darkMode, setDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  
  // Load trial setup data
  const [trialData, setTrialData] = useState<TrialData | null>(null);
  const [yesterdayData, setYesterdayData] = useState<DailyCheckInData | null>(null);
  
  const [checkInData, setCheckInData] = useState<DailyCheckInData>({
    workDate: new Date().toISOString().split('T')[0],
    workedToday: false,
    dayRate: 0,
    dayRateUsed: false,
    truckUsed: false,
    truckRate: 0,
    travelKMs: 0,
    subsistence: 0,
    additionalNotes: '',
    timestamp: new Date().toISOString(),
    synced: false
  });

  // Initialize data and check offline status
  useEffect(() => {
    // Load trial setup data using TrialManager
    const trial = TrialManager.getTrialData();
    if (trial) {
      setTrialData(trial);
      
      // Get today's check-in data or initialize from template
      const todayCheckIn = TrialManager.getTodaysCheckIn();
      setCheckInData(todayCheckIn);
      
      if (todayCheckIn.workedToday) {
        setCurrentStep('details');
      }
    }

    // Load yesterday's data
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayCheckIn = TrialManager.getDailyCheckIn(yesterday.toISOString().split('T')[0]);
    if (yesterdayCheckIn) {
      setYesterdayData(yesterdayCheckIn);
    }

    // Check offline status
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Check for dark mode based on time
    const hour = new Date().getHours();
    if (hour >= 18 || hour <= 6) {
      setDarkMode(true);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      TrialManager.saveDailyCheckIn(checkInData);
    }, 500);

    return () => clearTimeout(saveTimeout);
  }, [checkInData]);

  const handleWorkedToggle = (worked: boolean) => {
    setCheckInData(prev => ({ ...prev, workedToday: worked, dayRateUsed: worked }));
    if (worked) {
      setCurrentStep('details');
    } else {
      setCurrentStep('summary');
    }
  };

  const handleQuickAction = (action: 'yesterday' | 'standard' | 'different') => {
    switch (action) {
      case 'yesterday':
        if (yesterdayData) {
          setCheckInData(prev => ({
            ...prev,
            dayRate: yesterdayData.dayRate,
            dayRateUsed: yesterdayData.dayRateUsed,
            truckUsed: yesterdayData.truckUsed,
            truckRate: yesterdayData.truckRate,
            travelKMs: yesterdayData.travelKMs,
            subsistence: yesterdayData.subsistence
          }));
        }
        break;
      case 'standard':
        if (trialData) {
          setCheckInData(prev => ({
            ...prev,
            dayRate: parseFloat(trialData.dayRate.toString()),
            dayRateUsed: true,
            truckUsed: true,
            truckRate: parseFloat(trialData.truckRate.toString()),
            travelKMs: parseFloat(trialData.travelKMs.toString()),
            subsistence: parseFloat(trialData.taxFreeSubsistence.toString())
          }));
        }
        break;
      case 'different':
        // User will manually adjust values
        break;
    }
    setCurrentStep('summary');
  };

  const startVoiceInput = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setVoiceListening(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCheckInData(prev => ({
          ...prev,
          additionalNotes: prev.additionalNotes + (prev.additionalNotes ? ' ' : '') + transcript
        }));
        setVoiceListening(false);
      };

      recognition.onerror = () => {
        setVoiceListening(false);
      };

      recognition.onend = () => {
        setVoiceListening(false);
      };

      recognition.start();
    }
  };

  // Calculate totals using Alberta tax system
  const calculateTotals = (): AlbertaInvoiceCalculation => {
    return calculateDailyAlbertaTax({
      dayRate: checkInData.dayRate,
      dayRateUsed: checkInData.dayRateUsed,
      truckRate: checkInData.truckRate,
      truckUsed: checkInData.truckUsed,
      travelKMs: checkInData.travelKMs,
      subsistence: checkInData.subsistence
    });
  };

  const handleSaveWork = async () => {
    setIsSaving(true);
    
    try {
      const updatedData = {
        ...checkInData,
        timestamp: new Date().toISOString()
      };

      // Save using TrialManager
      TrialManager.saveDailyCheckIn(updatedData);

      // Simulate API sync if online
      if (!isOffline) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        updatedData.synced = true;
        TrialManager.saveDailyCheckIn(updatedData);
      }

      // Show success and redirect
      alert('Work logged successfully! See you tomorrow.');
      window.location.href = '/success?checkin=completed';
      
    } catch (error) {
      console.error('Error saving work:', error);
      alert('Error saving work. Data saved locally and will sync when online.');
    } finally {
      setIsSaving(false);
    }
  };

  const totals = calculateTotals();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold">Daily Check-in</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full touch-target"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              {isOffline ? (
                <SignalSlashIcon className="h-5 w-5 text-red-500" />
              ) : (
                <WifiIcon className="h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
          
          <div className="text-lg font-medium text-blue-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          {trialData && (
            <div className="mt-2 text-sm opacity-75">
              <div className="flex items-center justify-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{trialData.location}</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <DocumentTextIcon className="h-4 w-4" />
                <span>Ticket #{trialData.ticketNumber}</span>
              </div>
            </div>
          )}
          
          <div className="mt-2 text-xs opacity-60">
            Quick verification of today's charges • {currentTime}
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'worked' && (
            <motion.div
              key="worked"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Main Question */}
              <div className={`p-6 rounded-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border`}>
                <h2 className="text-2xl font-bold text-center mb-6">
                  Did you work today?
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleWorkedToggle(true)}
                    className={`py-4 px-6 rounded-lg text-lg font-bold transition-all touch-target ${
                      checkInData.workedToday
                        ? 'bg-green-600 text-white transform scale-105'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircleIcon className="h-8 w-8 mx-auto mb-2" />
                    YES
                  </button>
                  
                  <button
                    onClick={() => handleWorkedToggle(false)}
                    className={`py-4 px-6 rounded-lg text-lg font-bold transition-all touch-target ${
                      checkInData.workedToday === false && currentStep === 'worked'
                        ? 'bg-red-600 text-white transform scale-105'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ExclamationCircleIcon className="h-8 w-8 mx-auto mb-2" />
                    NO
                  </button>
                </div>
              </div>

              {/* Quick Actions for worked day */}
              {checkInData.workedToday && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}
                >
                  <h3 className="font-medium mb-4 text-center">Quick Actions:</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => handleQuickAction('standard')}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all touch-target ${
                        darkMode
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      <ClockIcon className="h-5 w-5 inline mr-2" />
                      Standard Day (Use Setup Defaults)
                    </button>
                    
                    {yesterdayData && (
                      <button
                        onClick={() => handleQuickAction('yesterday')}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all touch-target ${
                          darkMode
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        <BookmarkIcon className="h-5 w-5 inline mr-2" />
                        Same as Yesterday
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleQuickAction('different')}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all touch-target ${
                        darkMode
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      <PencilIcon className="h-5 w-5 inline mr-2" />
                      Different (Manual Entry)
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Day Rate */}
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                    <span className="font-medium">Day Rate</span>
                    <span className="text-xs ml-1 text-gray-500">(taxable)</span>
                  </div>
                  <span className="text-lg font-bold">{formatCAD(checkInData.dayRate)}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckInData(prev => ({ ...prev, dayRateUsed: true }))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all touch-target ${
                      checkInData.dayRateUsed
                        ? 'bg-green-600 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ✓ Correct
                  </button>
                  <button
                    onClick={() => {
                      const newRate = prompt('Enter day rate:', checkInData.dayRate.toString());
                      if (newRate && !isNaN(parseFloat(newRate))) {
                        setCheckInData(prev => ({ 
                          ...prev, 
                          dayRate: parseFloat(newRate),
                          dayRateUsed: true 
                        }));
                      }
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all touch-target ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ✎ Change
                  </button>
                </div>
              </div>

              {/* Truck Usage */}
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Used truck today?</span>
                    <span className="text-xs ml-1 text-gray-500">(taxable)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => setCheckInData(prev => ({ ...prev, truckUsed: true }))}
                    className={`py-2 px-3 rounded-lg font-medium transition-all touch-target ${
                      checkInData.truckUsed
                        ? 'bg-blue-600 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    onClick={() => setCheckInData(prev => ({ ...prev, truckUsed: false }))}
                    className={`py-2 px-3 rounded-lg font-medium transition-all touch-target ${
                      !checkInData.truckUsed
                        ? 'bg-red-600 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    NO
                  </button>
                </div>

                {checkInData.truckUsed && (
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span>Truck Rate:</span>
                      <span className="font-bold">{formatCAD(checkInData.truckRate)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all touch-target bg-green-600 text-white`}>
                        ✓ Correct
                      </button>
                      <button
                        onClick={() => {
                          const newRate = prompt('Enter truck rate:', checkInData.truckRate.toString());
                          if (newRate && !isNaN(parseFloat(newRate))) {
                            setCheckInData(prev => ({ ...prev, truckRate: parseFloat(newRate) }));
                          }
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all touch-target ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        ✎ Change
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Travel */}
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <MapIcon className="h-5 w-5 mr-2 text-purple-600" />
                    <span className="font-medium">Travel</span>
                    <span className="text-xs ml-1 text-green-600">(reimbursement)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{checkInData.travelKMs} km</div>
                    <div className="text-xs text-gray-500">${STANDARD_TRAVEL_RATE_PER_KM}/km</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button className={`py-2 px-3 rounded-lg font-medium transition-all touch-target bg-green-600 text-white`}>
                    ✓ Same
                  </button>
                  <button
                    onClick={() => {
                      const newKMs = prompt('Enter travel distance (km):', checkInData.travelKMs.toString());
                      if (newKMs && !isNaN(parseFloat(newKMs))) {
                        setCheckInData(prev => ({ ...prev, travelKMs: parseFloat(newKMs) }));
                      }
                    }}
                    className={`py-2 px-3 rounded-lg font-medium transition-all touch-target ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ✎ Different
                  </button>
                </div>
              </div>

              {/* Subsistence */}
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <CakeIcon className="h-5 w-5 mr-2 text-orange-600" />
                    <span className="font-medium">Subsistence</span>
                    <span className="text-xs ml-1 text-green-600">(tax-free)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCAD(checkInData.subsistence)}</div>
                    <div className="text-xs text-green-600">(meal allowance)</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all touch-target bg-green-600 text-white`}>
                    ✓ Correct
                  </button>
                  <button
                    onClick={() => {
                      const newAmount = prompt('Enter subsistence amount:', checkInData.subsistence.toString());
                      if (newAmount && !isNaN(parseFloat(newAmount))) {
                        setCheckInData(prev => ({ ...prev, subsistence: parseFloat(newAmount) }));
                      }
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all touch-target ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ✎ Change
                  </button>
                </div>
              </div>

              {/* Additional Notes */}
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border`}>
                <label className="block font-medium mb-2">Additional Notes:</label>
                <div className="relative">
                  <textarea
                    value={checkInData.additionalNotes}
                    onChange={(e) => setCheckInData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="Any additional notes or charges?"
                    className={`w-full p-3 rounded-lg border resize-none transition-colors ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    rows={3}
                  />
                  <button
                    onClick={startVoiceInput}
                    className={`absolute right-2 bottom-2 p-2 rounded-full transition-all touch-target ${
                      voiceListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : darkMode
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <MicrophoneIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setCurrentStep('summary')}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all touch-target ${
                  darkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Review Summary
                <ArrowRightIcon className="h-5 w-5 inline ml-2" />
              </button>
            </motion.div>
          )}

          {currentStep === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Tax Information Notice */}
              <div className={`p-3 rounded-lg border ${
                darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 dark:text-blue-100">Alberta Tax Structure</div>
                    <div className="text-blue-700 dark:text-blue-200">
                      GST {(ALBERTA_GST_RATE * 100).toFixed(0)}% on services • Travel & subsistence are tax-free reimbursements
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Summary */}
              <div className={`p-6 rounded-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border`}>
                <h2 className="text-xl font-bold text-center mb-4">Today's Total</h2>
                
                {checkInData.workedToday ? (
                  <div className="space-y-3">
                    {/* Taxable Services */}
                    <div className="pb-3 border-b border-gray-200 dark:border-gray-600">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Taxable Services (subject to {(ALBERTA_GST_RATE * 100).toFixed(0)}% GST)
                      </div>
                      
                      {checkInData.dayRateUsed && (
                        <div className="flex justify-between items-center">
                          <span>Labour Services:</span>
                          <span className="font-bold">{formatCAD(totals.dayRateTotal)}</span>
                        </div>
                      )}
                      
                      {checkInData.truckUsed && (
                        <div className="flex justify-between items-center">
                          <span>Equipment Services:</span>
                          <span className="font-bold">{formatCAD(totals.truckRateTotal)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center font-medium pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span>Subtotal (Taxable):</span>
                        <span className="font-bold">{formatCAD(totals.taxableSubtotal)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-red-600">
                        <span>GST ({(ALBERTA_GST_RATE * 100).toFixed(0)}%):</span>
                        <span className="font-bold">{formatCAD(totals.gst)}</span>
                      </div>
                    </div>

                    {/* Non-Taxable Reimbursements */}
                    <div className="pb-3">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Expense Reimbursements (tax-free)
                      </div>
                      
                      <div className="flex justify-between items-center text-green-600">
                        <span>Travel ({checkInData.travelKMs} km @ ${STANDARD_TRAVEL_RATE_PER_KM}):</span>
                        <span className="font-bold">{formatCAD(totals.travelReimbursement)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-green-600">
                        <span>Subsistence (meals):</span>
                        <span className="font-bold">{formatCAD(totals.subsistence)}</span>
                      </div>
                    </div>
                    
                    <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                    
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold">TOTAL INVOICE:</span>
                      <span className="font-bold text-green-600">{formatCAD(totals.grandTotal)}</span>
                    </div>

                    {checkInData.additionalNotes && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="font-medium mb-2">Notes:</div>
                        <div className="text-sm opacity-75">{checkInData.additionalNotes}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ExclamationCircleIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <div className="text-lg font-medium">No work today</div>
                    <div className="text-sm opacity-75">Your day off has been logged</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSaveWork}
                  disabled={isSaving}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all touch-target ${
                    isSaving
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block h-5 w-5 mr-2"
                      >
                        ⭘
                      </motion.div>
                      Saving Work...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                      Save Today's Work
                    </>
                  )}
                </button>
                
                {checkInData.workedToday && (
                  <button
                    onClick={() => setCurrentStep('details')}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all touch-target ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <PencilIcon className="h-5 w-5 inline mr-2" />
                    Edit Details
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Offline Status */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm text-center"
          >
            <SignalSlashIcon className="h-4 w-4 inline mr-1" />
            Offline - Data will sync when connection is restored
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DailyCheckInPage; 