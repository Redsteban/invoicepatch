'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  CogIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface NotificationSchedule {
  firstReminder: string; // "18:00"
  secondReminder: string; // "20:00"
  finalReminder: string; // "22:00"
  enabled: boolean;
}

export const NotificationSystem = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [schedule, setSchedule] = useState<NotificationSchedule>({
    firstReminder: '18:00',
    secondReminder: '20:00',
    finalReminder: '22:00',
    enabled: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      
      // Check current permission status
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        default: currentPermission === 'default'
      });

      // Load saved settings
      const savedSchedule = localStorage.getItem('notification-schedule');
      if (savedSchedule) {
        setSchedule(JSON.parse(savedSchedule));
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission({
        granted: result === 'granted',
        denied: result === 'denied',
        default: result === 'default'
      });

      if (result === 'granted') {
        setSchedule(prev => ({ ...prev, enabled: true }));
        scheduleNotifications();
        
        // Show test notification
        new Notification('InvoicePatch Notifications Enabled', {
          body: 'You\'ll receive daily reminders to log your work at 6 PM.',
          icon: '/favicon.ico',
          tag: 'test-notification'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const scheduleNotifications = () => {
    if (!permission.granted || !schedule.enabled) return;

    // Schedule notifications for today
    const now = new Date();
    const scheduleTimes = [
      { time: schedule.firstReminder, message: 'Time to log today\'s work - 2 minutes' },
      { time: schedule.secondReminder, message: 'Don\'t forget to log today\'s work' },
      { time: schedule.finalReminder, message: 'Final reminder - log today\'s work' }
    ];

    scheduleTimes.forEach(({ time, message }) => {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      setTimeout(() => {
        if (permission.granted && schedule.enabled) {
          const notification = new Notification('InvoicePatch Daily Check-in', {
            body: message,
            icon: '/favicon.ico',
            tag: `checkin-reminder-${time}`,
            requireInteraction: true
          });

          // Handle notification click
          notification.onclick = () => {
            window.focus();
            window.location.href = '/daily-checkin';
            notification.close();
          };
        }
      }, timeUntilNotification);
    });
  };

  const updateSchedule = (field: keyof NotificationSchedule, value: string | boolean) => {
    const newSchedule = { ...schedule, [field]: value };
    setSchedule(newSchedule);
    localStorage.setItem('notification-schedule', JSON.stringify(newSchedule));
    
    if (permission.granted && newSchedule.enabled) {
      scheduleNotifications();
    }
  };

  const disableNotifications = () => {
    setSchedule(prev => ({ ...prev, enabled: false }));
    localStorage.setItem('notification-schedule', JSON.stringify({ ...schedule, enabled: false }));
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
        <DevicePhoneMobileIcon className="h-5 w-5 inline mr-2" />
        Notifications not supported on this device
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Permission Status */}
      <div className="p-4 rounded-lg border bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <BellIcon className="h-5 w-5 mr-2 text-blue-600" />
            <span className="font-medium">Daily Reminders</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors touch-target"
          >
            <CogIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {permission.default && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Get reminded to log your daily work at 6 PM, 8 PM, and 10 PM.
            </p>
            <button
              onClick={requestPermission}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-target"
            >
              Enable Notifications
            </button>
          </div>
        )}

        {permission.granted && (
          <div className="space-y-3">
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Notifications enabled
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily reminders:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {schedule.firstReminder}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {schedule.secondReminder}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {schedule.finalReminder}
                </span>
              </div>
            </div>
            {schedule.enabled && (
              <button
                onClick={disableNotifications}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Disable reminders
              </button>
            )}
          </div>
        )}

        {permission.denied && (
          <div className="text-sm text-red-600">
            Notifications blocked. Enable in your browser settings to receive daily reminders.
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg border bg-gray-50">
              <h3 className="font-medium mb-3">Notification Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Reminder (Work day ends)
                  </label>
                  <input
                    type="time"
                    value={schedule.firstReminder}
                    onChange={(e) => updateSchedule('firstReminder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Second Reminder
                  </label>
                  <input
                    type="time"
                    value={schedule.secondReminder}
                    onChange={(e) => updateSchedule('secondReminder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Final Reminder
                  </label>
                  <input
                    type="time"
                    value={schedule.finalReminder}
                    onChange={(e) => updateSchedule('finalReminder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-sm font-medium text-gray-700">
                    Enable daily reminders
                  </label>
                  <button
                    onClick={() => updateSchedule('enabled', !schedule.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      schedule.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        schedule.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook for handling notification clicks
export const useNotificationHandler = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Handle notification clicks
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
        const { action } = event.data;
        
        if (action === 'checkin') {
          window.location.href = '/daily-checkin';
        }
      }
    });
  }, []);
};

// Service Worker registration for notifications
export const registerNotificationServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered for notifications:', registration);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

// Simple notification component for in-app reminders
export const InAppNotification = ({ 
  show, 
  message, 
  onDismiss, 
  onAction 
}: {
  show: boolean;
  message: string;
  onDismiss: () => void;
  onAction: () => void;
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">{message}</span>
            </div>
            <button
              onClick={onDismiss}
              className="p-1 rounded-full hover:bg-blue-700 transition-colors touch-target"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={onAction}
              className="flex-1 py-2 px-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors touch-target"
            >
              Log Work Now
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 py-2 px-4 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors touch-target"
            >
              Later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 