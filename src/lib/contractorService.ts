// Contractor Service - Handles all contractor-related API calls and data management

export interface ContractorDashboard {
  trialInvoice: {
    id: string;
    startDate: string;
    endDate: string;
    ratePerKm: number;
    dayRate: number;
    truckRate: number;
    subsistenceRate: number;
  };
  entries: DailyEntry[];
  summary: {
    totalEarned: number;
    daysWorked: number;
    daysRemaining: number;
    completionRate: number;
    projectedTotal: number;
    avgDailyEarnings: number;
    efficiencyScore: number;
  };
  payPeriods: PayPeriod[];
  analytics: {
    weeklyEarnings: number[];
    bestDay: { date: string; earnings: number };
    totalHours: number;
    avgHoursPerDay: number;
  };
}

export interface DailyEntry {
  id: string;
  entryDate: string;
  worked: boolean;
  dayRateUsed?: number;
  truckRateUsed?: number;
  travelKmsActual?: number;
  subsistenceActual?: number;
  notes?: string;
  location?: string;
  photos?: string[];
  startTime?: string;
  endTime?: string;
}

export interface PayPeriod {
  period: number;
  workStart: string;
  cutoffDate: string;
  submissionDate: string;
  type: 'initial' | 'regular';
}

export interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  equipment?: string;
  photos: string[];
  notes: string;
  status: 'active' | 'completed' | 'break';
}

// API Functions
export async function getContractorDashboard(trialInvoiceId: string): Promise<ContractorDashboard> {
  const response = await fetch(`/api/contractor/dashboard?trialInvoiceId=${trialInvoiceId}`, {
    headers: {
      'x-auth-verified': 'otp-verified', // This should come from auth context
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}

export async function createDailyEntry(entry: Omit<DailyEntry, 'id'>): Promise<DailyEntry> {
  const response = await fetch('/api/contractor/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-verified': 'otp-verified',
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error('Failed to create daily entry');
  }

  return response.json();
}

export async function updateDailyEntry(id: string, entry: Partial<DailyEntry>): Promise<DailyEntry> {
  const response = await fetch(`/api/contractor/entries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-verified': 'otp-verified',
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error('Failed to update daily entry');
  }

  return response.json();
}

export async function startTimeTracking(data: {
  trialInvoiceId: string;
  startTime: string;
  location: { lat: number; lng: number; address: string };
  equipment?: string;
  notes?: string;
}): Promise<TimeEntry> {
  const response = await fetch('/api/contractor/checkin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-verified': 'otp-verified',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to start time tracking');
  }

  return response.json();
}

export async function endTimeTracking(entryId: string, endTime: string): Promise<TimeEntry> {
  const response = await fetch(`/api/contractor/checkin/${entryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-verified': 'otp-verified',
    },
    body: JSON.stringify({ endTime }),
  });

  if (!response.ok) {
    throw new Error('Failed to end time tracking');
  }

  return response.json();
}

export async function uploadPhoto(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/api/contractor/upload-photo', {
    method: 'POST',
    headers: {
      'x-auth-verified': 'otp-verified',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload photo');
  }

  return response.json();
}

// Utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(amount);
}

export function formatDuration(start: Date, end: Date = new Date()): string {
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getCurrentLocation(): Promise<{ lat: number; lng: number; address: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          const address = data.results[0]?.formatted_address || 'Unknown location';
          
          resolve({ lat: latitude, lng: longitude, address });
        } catch (error) {
          resolve({ lat: latitude, lng: longitude, address: 'Location found' });
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// ============================================================================
// SIMULATION DATA GENERATION FUNCTIONS
// ============================================================================

// Base simulation configuration
const SIMULATION_CONFIG = {
  baseDayRate: 550,
  baseTruckRate: 120,
  baseSubsistenceRate: 50,
  ratePerKm: 0.65,
  locations: [
    'Downtown Office Tower',
    'Residential Complex',
    'Shopping Center',
    'Highway Bridge Project',
    'Industrial Warehouse',
    'Fort McMurray Site A',
    'Syncrude Plant',
    'Suncor Facility'
  ],
  workTypes: [
    'Foundation Work',
    'Framing',
    'Electrical Installation',
    'Plumbing',
    'Finishing Work',
    'Pipeline Maintenance',
    'Equipment Repair',
    'Site Preparation',
    'Safety Inspection',
    'Emergency Response'
  ],
  equipment: [
    'Skid Steer Loader',
    'Concrete Mixer',
    'Scaffolding Setup',
    'Power Tools',
    'Safety Equipment',
    'F-150 Work Truck',
    'Excavator CAT 320',
    'Bulldozer D6T',
    'Crane 50-ton',
    'Welding Equipment'
  ]
};

// Generate simulation entries based on day and scenario
export function generateSimulationEntries(day: number): DailyEntry[] {
  const entries: DailyEntry[] = [];
  
  for (let d = 1; d <= day; d++) {
    const entryDate = new Date(Date.now() - (day - d) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const scenario = getDayScenario(d);
    
    if (scenario.worked) {
      entries.push({
        id: `sim-entry-${d}`,
        entryDate,
        worked: true,
        dayRateUsed: scenario.dayRate,
        truckRateUsed: scenario.truckRate,
        travelKmsActual: scenario.travelKms,
        subsistenceActual: scenario.subsistenceRate,
        notes: scenario.notes,
        location: scenario.location,
        photos: scenario.photos,
        startTime: scenario.startTime,
        endTime: scenario.endTime
      });
    } else {
      entries.push({
        id: `sim-entry-${d}`,
        entryDate,
        worked: false,
        notes: scenario.notes || 'Day Off',
        location: '',
        photos: [],
        startTime: '',
        endTime: ''
      });
    }
  }
  
  return entries;
}

// Generate simulation dashboard data
export function generateSimulationDashboardData(day: number): ContractorDashboard {
  const entries = generateSimulationEntries(day);
  const workedEntries = entries.filter(e => e.worked);
  
  const totalEarned = workedEntries.reduce((sum, entry) => {
    return sum + (entry.dayRateUsed || 0) + (entry.truckRateUsed || 0) + (entry.subsistenceActual || 0);
  }, 0);
  
  const avgDailyEarnings = workedEntries.length > 0 ? totalEarned / workedEntries.length : 0;
  const projectedTotal = totalEarned * (15 / day);
  
  return {
    trialInvoice: {
      id: `sim-invoice-${day}`,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ratePerKm: SIMULATION_CONFIG.ratePerKm,
      dayRate: SIMULATION_CONFIG.baseDayRate,
      truckRate: SIMULATION_CONFIG.baseTruckRate,
      subsistenceRate: SIMULATION_CONFIG.baseSubsistenceRate
    },
    entries,
    summary: {
      totalEarned,
      daysWorked: workedEntries.length,
      daysRemaining: 15 - day,
      completionRate: (day / 15) * 100,
      projectedTotal,
      avgDailyEarnings,
      efficiencyScore: Math.floor(Math.random() * 20) + 80 // 80-100
    },
    payPeriods: generateSimulationPayPeriods(),
    analytics: generateSimulationAnalytics(day, workedEntries.length)
  };
}

// Generate simulation invoices
export function generateSimulationInvoices(day: number) {
  const entries = generateSimulationEntries(day);
  const workedEntries = entries.filter(e => e.worked);
  
  const subtotal = workedEntries.reduce((sum, entry) => {
    return sum + (entry.dayRateUsed || 0) + (entry.truckRateUsed || 0);
  }, 0);
  
  const gst = subtotal * 0.05;
  const totalSubsistence = workedEntries.reduce((sum, entry) => sum + (entry.subsistenceActual || 0), 0);
  const grandTotal = subtotal + gst + totalSubsistence;
  
  return {
    invoiceNumber: `INV-${day.toString().padStart(3, '0')}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtotal,
    gst,
    totalSubsistence,
    grandTotal,
    status: day >= 15 ? 'submitted' : 'draft',
    entries: workedEntries
  };
}

// Generate simulation scenarios based on day
export function generateSimulationScenarios(day: number) {
  const scenario = getDayScenario(day);
  
  return {
    day,
    scenario: scenario.name,
    description: scenario.description,
    events: scenario.events,
    notifications: scenario.notifications,
    challenges: scenario.challenges,
    opportunities: scenario.opportunities
  };
}

// Helper function to get day-specific scenario
function getDayScenario(day: number) {
  const baseConfig = {
    worked: true,
    dayRate: SIMULATION_CONFIG.baseDayRate,
    truckRate: SIMULATION_CONFIG.baseTruckRate,
    subsistenceRate: SIMULATION_CONFIG.baseSubsistenceRate,
    travelKms: Math.floor(Math.random() * 150) + 50,
    location: SIMULATION_CONFIG.locations[Math.floor(Math.random() * SIMULATION_CONFIG.locations.length)],
    workType: SIMULATION_CONFIG.workTypes[Math.floor(Math.random() * SIMULATION_CONFIG.workTypes.length)],
    startTime: '08:00',
    endTime: '17:00',
    photos: Math.random() > 0.5 ? [`sim-photo-${day}-1.jpg`, `sim-photo-${day}-2.jpg`] : [],
    notes: '',
    events: [],
    notifications: [],
    challenges: [],
    opportunities: []
  };

  switch (day) {
    case 1:
      return {
        ...baseConfig,
        name: 'First Day',
        description: 'Normal operations, basic time tracking',
        notes: `${baseConfig.workType} at ${baseConfig.location} - First day on the job`,
        events: ['Contractor account activated', 'First work day started'],
        notifications: ['Welcome to your simulation! Start tracking your work to see earnings.', 'Complete your first time entry to unlock advanced features.'],
        challenges: ['Learning new site protocols'],
        opportunities: ['Establish good work habits']
      };

    case 2:
      return {
        ...baseConfig,
        name: 'Settling In',
        description: 'Normal operations, basic time tracking',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Getting familiar with the site`,
        events: ['Site orientation completed'],
        notifications: ['Great progress! You\'ve completed your first full day.'],
        challenges: ['Adapting to site-specific requirements'],
        opportunities: ['Build relationships with team members']
      };

    case 3:
      return {
        ...baseConfig,
        name: 'First Overtime',
        description: 'First overtime scenario',
        endTime: '19:00', // 2 hours overtime
        notes: `${baseConfig.workType} at ${baseConfig.location} - Extended hours due to project deadline`,
        events: ['First overtime hours logged', 'Project deadline approaching'],
        notifications: ['Overtime hours detected! You\'re earning extra for your dedication.', 'Consider tracking overtime separately for better records.'],
        challenges: ['Managing extended work hours'],
        opportunities: ['Increased earnings through overtime']
      };

    case 4:
      return {
        ...baseConfig,
        name: 'Regular Day',
        description: 'Normal operations',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Standard work day`,
        events: ['Regular work day completed'],
        notifications: ['Keep up the good work!'],
        challenges: ['Maintaining consistent quality'],
        opportunities: ['Improve efficiency']
      };

    case 5:
      return {
        ...baseConfig,
        dayRate: SIMULATION_CONFIG.baseDayRate + 50, // Rate increase
        name: 'Rate Increase',
        description: 'Rate increase from client',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Rate increased to $${SIMULATION_CONFIG.baseDayRate + 50}/day due to excellent performance`,
        events: ['Rate increase approved', 'Client recognized performance'],
        notifications: ['Congratulations! Your day rate has been increased by $50.', 'Your excellent work has been recognized by the client.'],
        challenges: ['Maintaining high performance standards'],
        opportunities: ['Potential for further rate increases']
      };

    case 6:
      return {
        ...baseConfig,
        name: 'Equipment Day',
        description: 'Normal operations with equipment',
        truckRate: SIMULATION_CONFIG.baseTruckRate + 30, // Additional equipment
        notes: `${baseConfig.workType} at ${baseConfig.location} - Using specialized equipment`,
        events: ['Equipment training completed'],
        notifications: ['Equipment charges applied for specialized tools.'],
        challenges: ['Learning new equipment'],
        opportunities: ['Expanding skill set']
      };

    case 7:
      return {
        ...baseConfig,
        name: 'Client Change Request',
        description: 'Client change request',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Client requested changes to project scope`,
        events: ['Client change request received', 'Project scope modified'],
        notifications: ['Client has requested changes to the project scope.', 'Additional work may be required.'],
        challenges: ['Adapting to scope changes'],
        opportunities: ['Additional billable work']
      };

    case 8:
      return {
        ...baseConfig,
        name: 'Regular Day',
        description: 'Normal operations',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Implementing client changes`,
        events: ['Change implementation in progress'],
        notifications: ['Changes are being implemented successfully.'],
        challenges: ['Ensuring quality with changes'],
        opportunities: ['Demonstrating flexibility']
      };

    case 9:
      return {
        ...baseConfig,
        name: 'Regular Day',
        description: 'Normal operations',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Continuing with project`,
        events: ['Project progressing well'],
        notifications: ['Project is on track.'],
        challenges: ['Maintaining momentum'],
        opportunities: ['Building client trust']
      };

    case 10:
      return {
        ...baseConfig,
        name: 'Payment Received',
        description: 'Payment received notification',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Previous invoice payment received`,
        events: ['Payment received for previous invoice', 'Client payment processed'],
        notifications: ['Payment received for invoice INV-009!', 'Your earnings have been deposited to your account.'],
        challenges: ['Managing cash flow'],
        opportunities: ['Financial planning with regular income']
      };

    case 11:
      return {
        ...baseConfig,
        name: 'Regular Day',
        description: 'Normal operations',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Continuing project work`,
        events: ['Project work continuing'],
        notifications: ['Project is progressing well.'],
        challenges: ['Maintaining quality standards'],
        opportunities: ['Building reputation']
      };

    case 12:
      return {
        ...baseConfig,
        name: 'Complex Multi-Day Project',
        description: 'Complex multi-day project',
        endTime: '18:00', // Extended hours
        notes: `${baseConfig.workType} at ${baseConfig.location} - Complex project requiring extended hours and specialized skills`,
        events: ['Complex project started', 'Specialized skills required'],
        notifications: ['Complex project detected! This may require additional time and resources.', 'Consider documenting all additional work for billing.'],
        challenges: ['Managing complex project requirements'],
        opportunities: ['Higher billing potential', 'Skill development']
      };

    case 13:
      return {
        ...baseConfig,
        name: 'Project Continuation',
        description: 'Continuing complex project',
        endTime: '18:00',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Continuing complex project work`,
        events: ['Complex project continuing'],
        notifications: ['Complex project is progressing well.'],
        challenges: ['Maintaining quality under pressure'],
        opportunities: ['Demonstrating expertise']
      };

    case 14:
      return {
        ...baseConfig,
        name: 'Project Completion',
        description: 'Completing complex project',
        endTime: '19:00', // Final push
        notes: `${baseConfig.workType} at ${baseConfig.location} - Final day of complex project, completing all requirements`,
        events: ['Complex project completed', 'Client satisfaction achieved'],
        notifications: ['Complex project completed successfully!', 'Client is satisfied with the work.'],
        challenges: ['Ensuring all requirements met'],
        opportunities: ['Future project opportunities', 'Client referrals']
      };

    case 15:
      return {
        ...baseConfig,
        name: 'Period Completion',
        description: 'Period completion and final invoice',
        notes: `${baseConfig.workType} at ${baseConfig.location} - Final day of pay period, preparing final invoice`,
        events: ['Pay period completed', 'Final invoice prepared'],
        notifications: ['Pay period ends today! Submit your final invoice.', 'All entries have been reviewed and approved.'],
        challenges: ['Ensuring all work is documented'],
        opportunities: ['Complete invoice submission', 'Plan for next period']
      };

    default:
      return {
        ...baseConfig,
        name: 'Regular Day',
        description: 'Normal operations',
        notes: `${baseConfig.workType} at ${baseConfig.location}`,
        events: ['Regular work day'],
        notifications: ['Keep up the good work!'],
        challenges: ['Maintaining quality'],
        opportunities: ['Improving efficiency']
      };
  }
}

// Helper function to generate pay periods
function generateSimulationPayPeriods(): PayPeriod[] {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 14);
  
  return [
    {
      period: 1,
      workStart: startDate.toISOString().split('T')[0],
      cutoffDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      submissionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'initial'
    }
  ];
}

// Helper function to generate analytics
function generateSimulationAnalytics(day: number, daysWorked: number) {
  const totalHours = daysWorked * 8;
  const avgHoursPerDay = daysWorked > 0 ? totalHours / daysWorked : 0;
  
  return {
    weeklyEarnings: Array.from({ length: 3 }, () => Math.floor(Math.random() * 2000) + 3000),
    bestDay: {
      date: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      earnings: SIMULATION_CONFIG.baseDayRate + SIMULATION_CONFIG.baseTruckRate + SIMULATION_CONFIG.baseSubsistenceRate
    },
    totalHours,
    avgHoursPerDay
  };
} 