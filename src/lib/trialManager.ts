/**
 * Trial Manager - Comprehensive trial lifecycle management
 * 
 * Handles trial setup, data persistence, daily check-ins, 
 * notification scheduling, and trial completion workflows.
 */

export interface TrialData {
  // Basic setup information
  ticketNumber: string;
  location: string;
  company: string;
  dayRate: string;
  truckRate: string;
  travelKMs: string;
  taxFreeSubsistence: string;
  workStartDate: string;
  workDays: string[];
  invoiceFrequency: string;
  
  // Trial metadata
  trialStartDate: string;
  trialStatus: 'draft' | 'active' | 'completed' | 'expired';
  trialDaysRemaining: number;
  notificationsEnabled: boolean;
  dailyCheckInsCompleted: number;
}

export interface DailyCheckInData {
  workDate: string;
  workedToday: boolean;
  dayRate: number;
  dayRateUsed: boolean;
  truckUsed: boolean;
  truckRate: number;
  travelKMs: number;
  subsistence: number;
  additionalNotes: string;
  timestamp: string;
  synced: boolean;
}

export interface TrialStats {
  totalDays: number;
  daysCompleted: number;
  daysRemaining: number;
  completionRate: number;
  totalEarnings: number;
  averageDailyEarnings: number;
}

// Storage keys
const STORAGE_KEYS = {
  TRIAL_DATA: 'invoicepatch-trial-data',
  TRIAL_DRAFT: 'invoicepatch-trial-draft',
  TRIAL_STARTED: 'trial-started',
  TRIAL_START_DATE: 'trial-start-date',
  CHECKIN_TEMPLATE: 'checkin-template',
  NOTIFICATION_SETTINGS: 'notification-schedule'
} as const;

export class TrialManager {
  
  /**
   * Initialize a new trial with the provided setup data
   */
  static initializeTrial(setupData: Omit<TrialData, 'trialStartDate' | 'trialStatus' | 'trialDaysRemaining' | 'notificationsEnabled' | 'dailyCheckInsCompleted'>): TrialData {
    const trialData: TrialData = {
      ...setupData,
      trialStartDate: new Date().toISOString(),
      trialStatus: 'active',
      trialDaysRemaining: 14,
      notificationsEnabled: false,
      dailyCheckInsCompleted: 0
    };

    // Save trial data
    localStorage.setItem(STORAGE_KEYS.TRIAL_DATA, JSON.stringify(trialData));
    localStorage.setItem(STORAGE_KEYS.TRIAL_STARTED, 'true');
    localStorage.setItem(STORAGE_KEYS.TRIAL_START_DATE, trialData.trialStartDate);

    // Clear any existing draft
    localStorage.removeItem(STORAGE_KEYS.TRIAL_DRAFT);

    // Initialize daily check-in template
    this.initializeDailyTemplate(trialData);

    return trialData;
  }

  /**
   * Load current trial data from storage
   */
  static getTrialData(): TrialData | null {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.TRIAL_DATA);
      if (!savedData) return null;

      const trialData = JSON.parse(savedData) as TrialData;
      
      // Update trial status based on elapsed time
      return this.updateTrialStatus(trialData);
    } catch (error) {
      console.error('Error loading trial data:', error);
      return null;
    }
  }

  /**
   * Check if trial is currently active
   */
  static isTrialActive(): boolean {
    const trialData = this.getTrialData();
    return trialData?.trialStatus === 'active' && trialData.trialDaysRemaining > 0;
  }

  /**
   * Get trial statistics and progress
   */
  static getTrialStats(): TrialStats | null {
    const trialData = this.getTrialData();
    if (!trialData) return null;

    const startDate = new Date(trialData.trialStartDate);
    const currentDate = new Date();
    const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate earnings from completed check-ins
    const dailyCheckIns = this.getAllDailyCheckIns();
    const totalEarnings = dailyCheckIns.reduce((sum, checkIn) => {
      if (!checkIn.workedToday) return sum;
      
      const dayRate = checkIn.dayRateUsed ? checkIn.dayRate : 0;
      const truckRate = checkIn.truckUsed ? checkIn.truckRate : 0;
      const subsistence = checkIn.subsistence;
      
      const subtotal = dayRate + truckRate + subsistence;
      const gst = subtotal * 0.05;
      return sum + subtotal + gst;
    }, 0);

    return {
      totalDays: 14,
      daysCompleted: Math.min(daysPassed, 14),
      daysRemaining: Math.max(14 - daysPassed, 0),
      completionRate: Math.min(daysPassed / 14 * 100, 100),
      totalEarnings,
      averageDailyEarnings: dailyCheckIns.length > 0 ? totalEarnings / dailyCheckIns.length : 0
    };
  }

  /**
   * Save daily check-in data
   */
  static saveDailyCheckIn(checkInData: DailyCheckInData): void {
    const key = `checkin-${checkInData.workDate}`;
    localStorage.setItem(key, JSON.stringify(checkInData));

    // Update trial completion count
    const trialData = this.getTrialData();
    if (trialData) {
      trialData.dailyCheckInsCompleted = this.getAllDailyCheckIns().length;
      localStorage.setItem(STORAGE_KEYS.TRIAL_DATA, JSON.stringify(trialData));
    }
  }

  /**
   * Get daily check-in data for a specific date
   */
  static getDailyCheckIn(date: string): DailyCheckInData | null {
    try {
      const key = `checkin-${date}`;
      const savedData = localStorage.getItem(key);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error loading daily check-in:', error);
      return null;
    }
  }

  /**
   * Get all daily check-ins for the trial period
   */
  static getAllDailyCheckIns(): DailyCheckInData[] {
    const checkIns: DailyCheckInData[] = [];
    const trialData = this.getTrialData();
    
    if (!trialData) return checkIns;

    const startDate = new Date(trialData.trialStartDate);
    const currentDate = new Date();
    
    // Check each day from trial start to now (max 14 days)
    for (let i = 0; i < 14 && startDate <= currentDate; i++) {
      const dateString = startDate.toISOString().split('T')[0];
      const checkIn = this.getDailyCheckIn(dateString);
      
      if (checkIn) {
        checkIns.push(checkIn);
      }
      
      startDate.setDate(startDate.getDate() + 1);
    }

    return checkIns.sort((a, b) => new Date(a.workDate).getTime() - new Date(b.workDate).getTime());
  }

  /**
   * Get today's check-in data or create from template
   */
  static getTodaysCheckIn(): DailyCheckInData {
    const today = new Date().toISOString().split('T')[0];
    const existingCheckIn = this.getDailyCheckIn(today);
    
    if (existingCheckIn) {
      return existingCheckIn;
    }

    // Create from template
    const template = this.getDailyTemplate();
    return {
      ...template,
      workDate: today,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Initialize daily check-in template from trial data
   */
  private static initializeDailyTemplate(trialData: TrialData): void {
    const template: DailyCheckInData = {
      workDate: '',
      workedToday: false,
      dayRate: parseFloat(trialData.dayRate),
      dayRateUsed: false,
      truckUsed: false,
      truckRate: parseFloat(trialData.truckRate),
      travelKMs: parseFloat(trialData.travelKMs),
      subsistence: parseFloat(trialData.taxFreeSubsistence),
      additionalNotes: '',
      timestamp: '',
      synced: false
    };

    localStorage.setItem(STORAGE_KEYS.CHECKIN_TEMPLATE, JSON.stringify(template));
  }

  /**
   * Get daily check-in template
   */
  static getDailyTemplate(): DailyCheckInData {
    try {
      const template = localStorage.getItem(STORAGE_KEYS.CHECKIN_TEMPLATE);
      if (template) {
        return JSON.parse(template);
      }

      // Fallback template
      return {
        workDate: '',
        workedToday: false,
        dayRate: 750,
        dayRateUsed: false,
        truckUsed: false,
        truckRate: 200,
        travelKMs: 50,
        subsistence: 75,
        additionalNotes: '',
        timestamp: '',
        synced: false
      };
    } catch (error) {
      console.error('Error loading daily template:', error);
      // Return fallback template
      return {
        workDate: '',
        workedToday: false,
        dayRate: 750,
        dayRateUsed: false,
        truckUsed: false,
        truckRate: 200,
        travelKMs: 50,
        subsistence: 75,
        additionalNotes: '',
        timestamp: '',
        synced: false
      };
    }
  }

  /**
   * Update trial status based on elapsed time
   */
  private static updateTrialStatus(trialData: TrialData): TrialData {
    const startDate = new Date(trialData.trialStartDate);
    const currentDate = new Date();
    const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const updatedData = {
      ...trialData,
      trialDaysRemaining: Math.max(14 - daysPassed, 0)
    };

    // Update status if trial period ended
    if (updatedData.trialDaysRemaining === 0 && trialData.trialStatus === 'active') {
      updatedData.trialStatus = 'completed';
    }

    // Save updated data if changed
    if (updatedData.trialDaysRemaining !== trialData.trialDaysRemaining || 
        updatedData.trialStatus !== trialData.trialStatus) {
      localStorage.setItem(STORAGE_KEYS.TRIAL_DATA, JSON.stringify(updatedData));
    }

    return updatedData;
  }

  /**
   * Complete the trial and prepare for conversion
   */
  static completeTrial(): void {
    const trialData = this.getTrialData();
    if (!trialData) return;

    const completedData = {
      ...trialData,
      trialStatus: 'completed' as const,
      trialDaysRemaining: 0
    };

    localStorage.setItem(STORAGE_KEYS.TRIAL_DATA, JSON.stringify(completedData));

    // Generate final trial report
    this.generateTrialReport();
  }

  /**
   * Generate trial completion report
   */
  private static generateTrialReport(): void {
    const stats = this.getTrialStats();
    const checkIns = this.getAllDailyCheckIns();
    
    if (!stats) return;

    const report = {
      trialPeriod: {
        startDate: this.getTrialData()?.trialStartDate,
        endDate: new Date().toISOString(),
        totalDays: stats.totalDays,
        completedDays: stats.daysCompleted
      },
      earnings: {
        total: stats.totalEarnings,
        average: stats.averageDailyEarnings,
        breakdown: checkIns.map(checkIn => ({
          date: checkIn.workDate,
          worked: checkIn.workedToday,
          amount: checkIn.workedToday ? 
            (checkIn.dayRateUsed ? checkIn.dayRate : 0) + 
            (checkIn.truckUsed ? checkIn.truckRate : 0) + 
            checkIn.subsistence : 0
        }))
      },
      efficiency: {
        checkInRate: (stats.daysCompleted / stats.totalDays) * 100,
        workDays: checkIns.filter(c => c.workedToday).length,
        averageTimeToComplete: '< 2 minutes' // This would be tracked in real implementation
      }
    };

    localStorage.setItem('trial-completion-report', JSON.stringify(report));
  }

  /**
   * Reset trial (for testing purposes)
   */
  static resetTrial(): void {
    // Clear all trial-related data
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear daily check-ins
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('checkin-')) {
        localStorage.removeItem(key);
      }
    }

    // Clear trial reports
    localStorage.removeItem('trial-completion-report');
  }

  /**
   * Export trial data for backup or migration
   */
  static exportTrialData(): string {
    const trialData = this.getTrialData();
    const checkIns = this.getAllDailyCheckIns();
    const stats = this.getTrialStats();

    return JSON.stringify({
      trialData,
      checkIns,
      stats,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Enable notifications for the trial
   */
  static enableNotifications(): void {
    const trialData = this.getTrialData();
    if (!trialData) return;

    trialData.notificationsEnabled = true;
    localStorage.setItem(STORAGE_KEYS.TRIAL_DATA, JSON.stringify(trialData));
  }

  /**
   * Check if user should be reminded today
   */
  static shouldRemindToday(): boolean {
    const trialData = this.getTrialData();
    if (!trialData || !this.isTrialActive()) return false;

    const today = new Date().toISOString().split('T')[0];
    const todaysCheckIn = this.getDailyCheckIn(today);

    // Don't remind if already completed today
    return !todaysCheckIn;
  }

  /**
   * Get next reminder time based on current time
   */
  static getNextReminderTime(): Date | null {
    if (!this.shouldRemindToday()) return null;

    const now = new Date();
    const reminderTimes = ['18:00', '20:00', '22:00'];

    for (const timeStr of reminderTimes) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      if (reminderTime > now) {
        return reminderTime;
      }
    }

    // If all times have passed, return first time tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    return tomorrow;
  }
}

// Utility functions for common operations
export const TrialUtils = {
  // Format currency for display
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  },

  // Format date for display
  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Check if date is a work day
  isWorkDay: (date: string, workDays: string[]): boolean => {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return workDays.includes(dayOfWeek);
  },

  // Calculate working days in trial period
  getWorkingDaysInPeriod: (startDate: string, endDate: string, workDays: string[]): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (TrialUtils.isWorkDay(dateStr, workDays)) {
        count++;
      }
    }

    return count;
  }
} as const; 