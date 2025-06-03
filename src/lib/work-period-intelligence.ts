// Intelligent Work Period Detection and Management System
// Handles Stack Production Testing's Saturday-Friday 14-day work periods

import { 
  PayrollPeriod, 
  stackPayrollCalendar, 
  formatDate, 
  getDaysUntil 
} from './payroll-calendar';

export interface TimeEntry {
  id: string;
  contractorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  totalHours: number;
  overtimeHours: number;
  projectCode: string;
  afeCode: string;
  siteLocation: string;
  description: string;
  verified: boolean;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  weatherConditions?: string;
  equipmentUsed?: string[];
  photos?: string[];
  status: 'draft' | 'submitted' | 'approved' | 'disputed';
}

export interface WorkPattern {
  contractorId: string;
  typicalStartTime: string;
  typicalEndTime: string;
  usualBreakMinutes: number;
  standardWorkDays: number[]; // 0=Sunday, 1=Monday, etc.
  averageHoursPerDay: number;
  commonProjects: string[];
  frequentSites: Array<{
    name: string;
    coordinates: { latitude: number; longitude: number };
    averageTravelTime: number;
    frequency: number;
  }>;
  overtimeThreshold: number;
  holidayPreferences: {
    worksHolidays: boolean;
    typicalHolidayRate: number;
  };
}

export interface MissingTimeAlert {
  id: string;
  contractorId: string;
  date: Date;
  type: 'missing_day' | 'incomplete_entry' | 'unusual_pattern' | 'overtime_warning';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestedAction: string;
  autoFillData?: Partial<TimeEntry>;
  requiresAttention: boolean;
}

export interface SmartSuggestion {
  id: string;
  type: 'time_entry' | 'expense' | 'travel' | 'equipment' | 'project_code';
  confidence: number; // 0-100
  suggestion: string;
  data: any;
  reasoning: string;
}

export class WorkPeriodIntelligence {
  private timeEntries: Map<string, TimeEntry[]> = new Map();
  private workPatterns: Map<string, WorkPattern> = new Map();
  private missingAlerts: MissingTimeAlert[] = [];

  constructor() {
    this.initializeStackDefaults();
  }

  // Initialize Stack Production Testing defaults
  private initializeStackDefaults() {
    const defaultPattern: WorkPattern = {
      contractorId: 'default',
      typicalStartTime: '07:00',
      typicalEndTime: '15:00',
      usualBreakMinutes: 30,
      standardWorkDays: [1, 2, 3, 4, 5], // Monday-Friday
      averageHoursPerDay: 8,
      commonProjects: [
        'Montney Horizontal Drilling',
        'Pipeline Integrity Assessment',
        'Well Site Maintenance',
        'Production Testing Services',
        'Safety Compliance Audit'
      ],
      frequentSites: [
        {
          name: 'Montney Field Site A',
          coordinates: { latitude: 55.2345, longitude: -120.1234 },
          averageTravelTime: 45,
          frequency: 0.3
        },
        {
          name: 'Pipeline Station B',
          coordinates: { latitude: 55.3456, longitude: -120.2345 },
          averageTravelTime: 60,
          frequency: 0.2
        }
      ],
      overtimeThreshold: 8,
      holidayPreferences: {
        worksHolidays: false,
        typicalHolidayRate: 1.5
      }
    };

    this.workPatterns.set('default', defaultPattern);
  }

  // Detect current work period boundaries
  detectCurrentWorkPeriod(contractorId: string, date: Date = new Date()): PayrollPeriod | null {
    return stackPayrollCalendar.getCurrentPeriod();
  }

  // Get work period boundaries for any date
  getWorkPeriodBoundaries(date: Date): { start: Date; end: Date } | null {
    const period = stackPayrollCalendar.getCurrentPeriod();
    if (!period) return null;

    return {
      start: period.workPeriodStart,
      end: period.workPeriodEnd
    };
  }

  // Analyze missing time entries for current period
  analyzeMissingTime(contractorId: string): MissingTimeAlert[] {
    const currentPeriod = this.detectCurrentWorkPeriod(contractorId);
    if (!currentPeriod) return [];

    const alerts: MissingTimeAlert[] = [];
    const entries = this.timeEntries.get(contractorId) || [];
    const pattern = this.getWorkPattern(contractorId);
    
    const today = new Date();
    const periodStart = currentPeriod.workPeriodStart;
    const periodEnd = new Date(Math.min(today.getTime(), currentPeriod.workPeriodEnd.getTime()));

    // Check each day in the period
    for (let d = new Date(periodStart); d <= periodEnd; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const isWorkDay = pattern.standardWorkDays.includes(dayOfWeek);
      const dateStr = d.toDateString();
      
      const dayEntries = entries.filter(entry => 
        entry.date.toDateString() === dateStr
      );

      if (isWorkDay && dayEntries.length === 0 && d < today) {
        alerts.push({
          id: `missing-${contractorId}-${d.getTime()}`,
          contractorId,
          date: new Date(d),
          type: 'missing_day',
          severity: getDaysUntil(currentPeriod.cutOffDate) <= 2 ? 'high' : 'medium',
          message: `Missing time entry for ${formatDate(d)}`,
          suggestedAction: 'Add time entry for this work day',
          autoFillData: this.generateSuggestedTimeEntry(contractorId, new Date(d)),
          requiresAttention: true
        });
      }

      // Check for incomplete entries
      dayEntries.forEach(entry => {
        if (!entry.endTime || entry.totalHours === 0) {
          alerts.push({
            id: `incomplete-${entry.id}`,
            contractorId,
            date: entry.date,
            type: 'incomplete_entry',
            severity: 'medium',
            message: `Incomplete time entry for ${formatDate(entry.date)}`,
            suggestedAction: 'Complete missing end time or hours',
            requiresAttention: true
          });
        }
      });

      // Check for unusual patterns
      if (dayEntries.length > 0) {
        const totalHours = dayEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
        if (totalHours > pattern.overtimeThreshold + 4) {
          alerts.push({
            id: `overtime-warning-${contractorId}-${d.getTime()}`,
            contractorId,
            date: new Date(d),
            type: 'overtime_warning',
            severity: 'low',
            message: `Unusual overtime hours (${totalHours}) on ${formatDate(d)}`,
            suggestedAction: 'Verify overtime hours and add justification',
            requiresAttention: false
          });
        }
      }
    }

    return alerts;
  }

  // Generate smart suggestions for time entry
  generateSmartSuggestions(contractorId: string, date: Date): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const pattern = this.getWorkPattern(contractorId);
    const entries = this.getTimeEntriesForPeriod(contractorId, date);
    
    // Time entry suggestion
    if (pattern.standardWorkDays.includes(date.getDay())) {
      suggestions.push({
        id: `time-suggestion-${date.getTime()}`,
        type: 'time_entry',
        confidence: 85,
        suggestion: `Add typical ${pattern.averageHoursPerDay}-hour work day`,
        data: this.generateSuggestedTimeEntry(contractorId, date),
        reasoning: `Based on your usual ${pattern.typicalStartTime}-${pattern.typicalEndTime} schedule`
      });
    }

    // Project code suggestion
    const recentEntries = entries.slice(-5);
    if (recentEntries.length > 0) {
      const mostCommonProject = this.getMostFrequentProject(recentEntries);
      suggestions.push({
        id: `project-suggestion-${date.getTime()}`,
        type: 'project_code',
        confidence: 70,
        suggestion: `Continue with "${mostCommonProject}"`,
        data: { projectCode: mostCommonProject },
        reasoning: 'Most frequently used in recent entries'
      });
    }

    // Travel time suggestion
    const nearestSite = this.findNearestFrequentSite(pattern);
    if (nearestSite) {
      suggestions.push({
        id: `travel-suggestion-${date.getTime()}`,
        type: 'travel',
        confidence: 60,
        suggestion: `Add ${nearestSite.averageTravelTime} minutes travel time`,
        data: { 
          travelTime: nearestSite.averageTravelTime,
          site: nearestSite.name 
        },
        reasoning: `Typical travel time to ${nearestSite.name}`
      });
    }

    return suggestions;
  }

  // Generate suggested time entry based on patterns
  private generateSuggestedTimeEntry(contractorId: string, date: Date): Partial<TimeEntry> {
    const pattern = this.getWorkPattern(contractorId);
    const recentEntries = this.getRecentTimeEntries(contractorId, 5);
    
    const endTime = this.calculateEndTime(
      pattern.typicalStartTime, 
      pattern.averageHoursPerDay, 
      pattern.usualBreakMinutes
    );

    return {
      contractorId,
      date,
      startTime: pattern.typicalStartTime,
      endTime,
      breakMinutes: pattern.usualBreakMinutes,
      totalHours: pattern.averageHoursPerDay,
      overtimeHours: Math.max(0, pattern.averageHoursPerDay - pattern.overtimeThreshold),
      projectCode: recentEntries.length > 0 ? recentEntries[0].projectCode : pattern.commonProjects[0],
      siteLocation: pattern.frequentSites[0]?.name || 'Stack Field Site',
      description: 'Production testing services',
      verified: false,
      status: 'draft'
    };
  }

  // Learn and update work patterns
  updateWorkPattern(contractorId: string, entries: TimeEntry[]): void {
    if (entries.length < 5) return; // Need minimum data

    const pattern = this.getWorkPattern(contractorId);
    
    // Calculate averages
    const workDays = new Set<number>();
    let totalHours = 0;
    let totalBreakMinutes = 0;
    const startTimes: string[] = [];
    const endTimes: string[] = [];
    const projects: string[] = [];

    entries.forEach(entry => {
      workDays.add(entry.date.getDay());
      totalHours += entry.totalHours;
      totalBreakMinutes += entry.breakMinutes;
      startTimes.push(entry.startTime);
      endTimes.push(entry.endTime);
      projects.push(entry.projectCode);
    });

    // Update pattern
    const updatedPattern: WorkPattern = {
      ...pattern,
      standardWorkDays: Array.from(workDays),
      averageHoursPerDay: Math.round((totalHours / entries.length) * 2) / 2, // Round to nearest 0.5
      usualBreakMinutes: Math.round(totalBreakMinutes / entries.length),
      typicalStartTime: this.getMostCommonTime(startTimes),
      typicalEndTime: this.getMostCommonTime(endTimes),
      commonProjects: this.getTopFrequentItems(projects, 5)
    };

    this.workPatterns.set(contractorId, updatedPattern);
  }

  // Validate time entry for anomalies
  validateTimeEntry(entry: TimeEntry): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const pattern = this.getWorkPattern(entry.contractorId);

    // Check for excessive hours
    if (entry.totalHours > 16) {
      warnings.push('Extremely long work day - verify hours');
    }

    // Check for unusual start/end times
    const startHour = parseInt(entry.startTime.split(':')[0]);
    const endHour = parseInt(entry.endTime.split(':')[0]);
    
    if (startHour < 4 || startHour > 10) {
      warnings.push('Unusual start time - confirm accuracy');
    }

    if (endHour > 22 || endHour < 12) {
      warnings.push('Unusual end time - verify schedule');
    }

    // Check overtime
    if (entry.overtimeHours > 8) {
      warnings.push('High overtime hours - manager approval may be required');
    }

    // Check weekend work
    const dayOfWeek = entry.date.getDay();
    if ((dayOfWeek === 0 || dayOfWeek === 6) && entry.totalHours > 0) {
      warnings.push('Weekend work detected - confirm with project requirements');
    }

    return {
      valid: warnings.length === 0,
      warnings
    };
  }

  // GPS-based work verification
  verifyWorkLocation(entry: TimeEntry, gpsCoordinates: { latitude: number; longitude: number }): {
    verified: boolean;
    confidence: number;
    message: string;
  } {
    const pattern = this.getWorkPattern(entry.contractorId);
    const knownSites = pattern.frequentSites;

    // Find closest known site
    let closestSite: { name: string; coordinates: { latitude: number; longitude: number }; averageTravelTime: number; frequency: number; } | null = null;
    let minDistance = Infinity;

    knownSites.forEach(site => {
      const distance = this.calculateDistance(
        gpsCoordinates.latitude,
        gpsCoordinates.longitude,
        site.coordinates.latitude,
        site.coordinates.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestSite = site;
      }
    });

    // Within 1km of known site
    if (minDistance < 1 && closestSite) {
      return {
        verified: true,
        confidence: 95,
        message: `Verified at ${closestSite.name}`
      };
    }

    // Within 5km - probably legitimate
    if (minDistance < 5 && closestSite) {
      return {
        verified: true,
        confidence: 75,
        message: `Near known site (${closestSite.name})`
      };
    }

    // Too far from known sites
    return {
      verified: false,
      confidence: 30,
      message: 'Location not recognized - verify work site'
    };
  }

  // Bulk time entry for week completion
  generateWeekBulkEntry(contractorId: string, weekStart: Date): TimeEntry[] {
    const pattern = this.getWorkPattern(contractorId);
    const entries: TimeEntry[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      
      const dayOfWeek = date.getDay();
      if (pattern.standardWorkDays.includes(dayOfWeek)) {
        const suggested = this.generateSuggestedTimeEntry(contractorId, date);
        const timeEntry: TimeEntry = {
          id: `bulk-${contractorId}-${date.getTime()}`,
          contractorId: suggested.contractorId!,
          date: suggested.date!,
          startTime: suggested.startTime!,
          endTime: suggested.endTime!,
          breakMinutes: suggested.breakMinutes!,
          totalHours: suggested.totalHours!,
          overtimeHours: suggested.overtimeHours!,
          projectCode: suggested.projectCode!,
          afeCode: suggested.afeCode || '',
          siteLocation: suggested.siteLocation!,
          description: suggested.description!,
          verified: suggested.verified!,
          status: 'draft'
        };
        entries.push(timeEntry);
      }
    }

    return entries;
  }

  // Helper methods
  private getWorkPattern(contractorId: string): WorkPattern {
    return this.workPatterns.get(contractorId) || this.workPatterns.get('default')!;
  }

  private getTimeEntriesForPeriod(contractorId: string, date: Date): TimeEntry[] {
    const allEntries = this.timeEntries.get(contractorId) || [];
    const period = this.detectCurrentWorkPeriod(contractorId, date);
    
    if (!period) return [];

    return allEntries.filter(entry =>
      entry.date >= period.workPeriodStart && entry.date <= period.workPeriodEnd
    );
  }

  private getRecentTimeEntries(contractorId: string, count: number): TimeEntry[] {
    const entries = this.timeEntries.get(contractorId) || [];
    return entries
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, count);
  }

  private calculateEndTime(startTime: string, hours: number, breakMinutes: number): string {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(startDate.getTime() + (hours * 60 + breakMinutes) * 60000);
    
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  }

  private getMostCommonTime(times: string[]): string {
    const timeCount = new Map<string, number>();
    times.forEach(time => {
      timeCount.set(time, (timeCount.get(time) || 0) + 1);
    });

    let mostCommon = times[0];
    let maxCount = 0;

    timeCount.forEach((count, time) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = time;
      }
    });

    return mostCommon;
  }

  private getMostFrequentProject(entries: TimeEntry[]): string {
    const projectCount = new Map<string, number>();
    entries.forEach(entry => {
      projectCount.set(entry.projectCode, (projectCount.get(entry.projectCode) || 0) + 1);
    });

    let mostCommon = entries[0]?.projectCode || 'Production Testing Services';
    let maxCount = 0;

    projectCount.forEach((count, project) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = project;
      }
    });

    return mostCommon;
  }

  private getTopFrequentItems(items: string[], count: number): string[] {
    const itemCount = new Map<string, number>();
    items.forEach(item => {
      itemCount.set(item, (itemCount.get(item) || 0) + 1);
    });

    return Array.from(itemCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(entry => entry[0]);
  }

  private findNearestFrequentSite(pattern: WorkPattern) {
    return pattern.frequentSites.length > 0 ? pattern.frequentSites[0] : null;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Public API methods
  addTimeEntry(entry: TimeEntry): void {
    const entries = this.timeEntries.get(entry.contractorId) || [];
    entries.push(entry);
    this.timeEntries.set(entry.contractorId, entries);
    
    // Update pattern learning
    this.updateWorkPattern(entry.contractorId, entries);
  }

  getTimeEntriesForContractor(contractorId: string): TimeEntry[] {
    return this.timeEntries.get(contractorId) || [];
  }

  getMissingTimeAlerts(contractorId: string): MissingTimeAlert[] {
    return this.analyzeMissingTime(contractorId);
  }

  getSmartSuggestions(contractorId: string, date: Date): SmartSuggestion[] {
    return this.generateSmartSuggestions(contractorId, date);
  }
}

// Global instance
export const workPeriodIntelligence = new WorkPeriodIntelligence(); 