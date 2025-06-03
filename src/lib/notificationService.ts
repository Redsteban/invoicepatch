/**
 * Notification Service for Daily Check-in Reminders
 * 
 * Handles scheduling and delivery of daily check-in notifications
 * - Push notifications
 * - Email backup notifications  
 * - In-app notification banners
 */

interface NotificationSchedule {
  time: string; // HH:MM format
  title: string;
  message: string;
  type: 'primary' | 'reminder' | 'final';
}

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  workDays: string[];
  timezone: string;
}

interface ScheduledNotification {
  id: string;
  trialId: string;
  type: 'checkin_primary' | 'checkin_reminder' | 'checkin_final';
  scheduledFor: string; // ISO timestamp
  status: 'pending' | 'sent' | 'failed';
  content: {
    title: string;
    message: string;
    actionUrl: string;
  };
  channels: ('push' | 'email' | 'in_app')[];
}

// Daily check-in notification schedule
export const DAILY_NOTIFICATION_SCHEDULE: NotificationSchedule[] = [
  {
    time: '18:00',
    title: 'Time to log today\'s work',
    message: 'Quick 2-minute check-in to verify your daily charges',
    type: 'primary'
  },
  {
    time: '20:00', 
    title: 'Reminder: Don\'t forget to log today\'s work',
    message: 'Keep your invoicing on track with a quick daily log',
    type: 'reminder'
  },
  {
    time: '22:00',
    title: 'Final reminder - Log today\'s work',
    message: 'Last chance to log today\'s work to stay on track',
    type: 'final'
  }
];

export class NotificationService {
  private static instance: NotificationService;
  private vapidPublicKey: string = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Register for push notifications
   */
  async registerPushNotifications(): Promise<PushSubscription | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return null;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      // Save subscription to backend
      await this.savePushSubscription(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Error registering push notifications:', error);
      return null;
    }
  }

  /**
   * Schedule daily check-in notifications for a trial
   */
  async scheduleDailyNotifications(
    trialId: string, 
    workDays: string[], 
    preferences: NotificationPreferences
  ): Promise<void> {
    try {
      const response = await fetch('/api/notifications/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialId,
          workDays,
          preferences,
          schedule: DAILY_NOTIFICATION_SCHEDULE
        })
      });

      if (!response.ok) {
        throw new Error('Failed to schedule notifications');
      }

      console.log('Daily notifications scheduled successfully');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  /**
   * Send immediate notification
   */
  async sendImmediateNotification(
    trialId: string,
    type: string,
    content: { title: string; message: string; actionUrl: string }
  ): Promise<void> {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialId,
          type,
          content,
          immediate: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Check if daily check-in notification should be shown
   */
  shouldShowDailyReminder(
    lastCheckInDate: string | null,
    workDays: string[]
  ): boolean {
    const today = new Date();
    const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Check if today is a work day
    if (!workDays.includes(todayDayName)) {
      return false;
    }

    // Check if already logged today
    const todayStr = today.toISOString().split('T')[0];
    if (lastCheckInDate === todayStr) {
      return false;
    }

    // Check time range (6 PM - 10 PM)
    const currentHour = today.getHours();
    return currentHour >= 18 && currentHour <= 22;
  }

  /**
   * Show in-app notification banner
   */
  showInAppNotification(
    title: string,
    message: string,
    actionUrl: string,
    duration: number = 10000
  ): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-lg z-50 transform -translate-y-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="max-w-md mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
          </svg>
          <div>
            <p class="font-medium">${title}</p>
            <p class="text-xs text-blue-200">${message}</p>
          </div>
        </div>
        <button class="text-blue-200 hover:text-white ml-4" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;

    // Add click handler to navigate to action URL
    notification.addEventListener('click', (e) => {
      if (e.target !== notification.querySelector('button')) {
        window.location.href = actionUrl;
      }
    });

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100);

    // Auto-remove after duration
    setTimeout(() => {
      notification.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, duration);
  }

  /**
   * Get notification preferences for a trial
   */
  async getNotificationPreferences(trialId: string): Promise<NotificationPreferences | null> {
    try {
      const response = await fetch(`/api/notifications/preferences?trial=${trialId}`);
      if (response.ok) {
        const data = await response.json();
        return data.preferences;
      }
      return null;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    trialId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialId,
          preferences
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  }

  /**
   * Check for missed check-ins and show catch-up notifications
   */
  async checkMissedCheckIns(trialId: string): Promise<void> {
    try {
      const response = await fetch(`/api/daily-checkin?trial=${trialId}&days=7`);
      if (!response.ok) return;

      const { checkIns } = await response.json();
      const today = new Date();
      const workDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']; // Default work days

      // Check last 3 work days for missed check-ins
      let missedDays = 0;
      for (let i = 1; i <= 3; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (!workDays.includes(dayName)) continue;

        const dateStr = checkDate.toISOString().split('T')[0];
        const hasCheckIn = checkIns.some((c: any) => c.check_in_date === dateStr);
        
        if (!hasCheckIn) {
          missedDays++;
        }
      }

      // Show catch-up notification if missed days found
      if (missedDays > 0) {
        this.showInAppNotification(
          `Catch up on ${missedDays} missed check-in${missedDays > 1 ? 's' : ''}`,
          'Keep your invoicing accurate by logging missed work days',
          `/daily-checkin?trial=${trialId}&backfill=true`,
          15000
        );
      }
    } catch (error) {
      console.error('Error checking missed check-ins:', error);
    }
  }

  /**
   * Utility functions
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async savePushSubscription(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/notifications/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Error saving push subscription:', error);
    }
  }
}

/**
 * Hook for using notification service in React components
 */
export function useNotifications(trialId?: string) {
  const notificationService = NotificationService.getInstance();

  const scheduleNotifications = async (workDays: string[], preferences: NotificationPreferences) => {
    if (trialId) {
      await notificationService.scheduleDailyNotifications(trialId, workDays, preferences);
    }
  };

  const checkForReminders = async () => {
    if (trialId) {
      await notificationService.checkMissedCheckIns(trialId);
    }
  };

  const requestPermission = async () => {
    return await notificationService.registerPushNotifications();
  };

  return {
    scheduleNotifications,
    checkForReminders,
    requestPermission,
    showNotification: notificationService.showInAppNotification.bind(notificationService),
    shouldShowReminder: notificationService.shouldShowDailyReminder.bind(notificationService)
  };
}

export default NotificationService; 