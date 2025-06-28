// Simulation Data Generator - Creates realistic demo scenarios for contractor dashboard

import { ContractorDashboard, DailyEntry, TimeEntry, PayPeriod } from './contractorService';

export type SimulationTemplate = 'oil_gas' | 'construction';

interface SimulationScenario {
  template: SimulationTemplate;
  day: number;
  entries: DailyEntry[];
  timeEntries: TimeEntry[];
  notifications: string[];
  events: string[];
}

// Base simulation data for different templates
const OIL_GAS_TEMPLATE = {
  clientName: 'Acme Energy Ltd.',
  clientAddress: '123 Main St, Calgary, AB',
  contractorName: 'John Doe',
  contractorAddress: '456 Contractor Rd, Edmonton, AB',
  dayRate: 650,
  truckRate: 150,
  subsistenceRate: 60,
  ratePerKm: 0.75,
  locations: [
    'Fort McMurray Site A',
    'Syncrude Plant',
    'Suncor Facility',
    'CNRL Horizon',
    'Imperial Oil Kearl'
  ],
  equipment: [
    'F-150 Work Truck',
    'Excavator CAT 320',
    'Bulldozer D6T',
    'Crane 50-ton',
    'Welding Equipment'
  ],
  workTypes: [
    'Pipeline Maintenance',
    'Equipment Repair',
    'Site Preparation',
    'Safety Inspection',
    'Emergency Response'
  ]
};

const CONSTRUCTION_TEMPLATE = {
  clientName: 'BuildRight Construction',
  clientAddress: '789 Construction Ave, Toronto, ON',
  contractorName: 'Mike Johnson',
  contractorAddress: '321 Builder St, Mississauga, ON',
  dayRate: 550,
  truckRate: 120,
  subsistenceRate: 50,
  ratePerKm: 0.65,
  locations: [
    'Downtown Office Tower',
    'Residential Complex',
    'Shopping Center',
    'Highway Bridge Project',
    'Industrial Warehouse'
  ],
  equipment: [
    'Skid Steer Loader',
    'Concrete Mixer',
    'Scaffolding Setup',
    'Power Tools',
    'Safety Equipment'
  ],
  workTypes: [
    'Foundation Work',
    'Framing',
    'Electrical Installation',
    'Plumbing',
    'Finishing Work'
  ]
};

// Generate realistic daily entries based on template and day
function generateDailyEntries(template: SimulationTemplate, day: number): DailyEntry[] {
  const config = template === 'oil_gas' ? OIL_GAS_TEMPLATE : CONSTRUCTION_TEMPLATE;
  const entries: DailyEntry[] = [];
  
  // Generate entries for the current day and previous days
  for (let d = 1; d <= day; d++) {
    const isWorkDay = Math.random() > 0.2; // 80% chance of working
    const isCompleted = d < day || (d === day && Math.random() > 0.3); // Previous days completed, current day 70% chance
    
    if (isWorkDay) {
      const travelKms = Math.floor(Math.random() * 150) + 50; // 50-200 km
      const otherCharges = Math.random() > 0.7 ? Math.floor(Math.random() * 200) + 50 : 0; // 30% chance of other charges
      
      entries.push({
        id: `sim-entry-${d}`,
        entryDate: new Date(Date.now() - (day - d) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        worked: true,
        dayRateUsed: config.dayRate,
        truckRateUsed: Math.random() > 0.4 ? config.truckRate : 0, // 60% chance of truck usage
        travelKmsActual: travelKms,
        subsistenceActual: config.subsistenceRate,
        notes: `${config.workTypes[Math.floor(Math.random() * config.workTypes.length)]} at ${config.locations[Math.floor(Math.random() * config.locations.length)]}`,
        location: config.locations[Math.floor(Math.random() * config.locations.length)],
        photos: Math.random() > 0.5 ? [`sim-photo-${d}-1.jpg`, `sim-photo-${d}-2.jpg`] : [],
        startTime: `08:00`,
        endTime: `17:00`
      });
    } else {
      entries.push({
        id: `sim-entry-${d}`,
        entryDate: new Date(Date.now() - (day - d) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        worked: false,
        notes: 'Day Off',
        location: '',
        photos: [],
        startTime: '',
        endTime: ''
      });
    }
  }
  
  return entries;
}

// Generate time tracking entries
function generateTimeEntries(template: SimulationTemplate, day: number): TimeEntry[] {
  const config = template === 'oil_gas' ? OIL_GAS_TEMPLATE : CONSTRUCTION_TEMPLATE;
  const entries: TimeEntry[] = [];
  
  // Generate time entries for the current day
  const isWorkDay = Math.random() > 0.2;
  
  if (isWorkDay) {
    entries.push({
      id: `sim-time-${day}`,
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: Math.random() > 0.7 ? '17:00' : undefined, // 30% chance of active tracking
      location: {
        lat: 53.5461 + (Math.random() - 0.5) * 0.1, // Calgary area
        lng: -113.4938 + (Math.random() - 0.5) * 0.1,
        address: config.locations[Math.floor(Math.random() * config.locations.length)]
      },
      equipment: Math.random() > 0.5 ? config.equipment[Math.floor(Math.random() * config.equipment.length)] : undefined,
      photos: Math.random() > 0.6 ? [`sim-time-photo-${day}.jpg`] : [],
      notes: `${config.workTypes[Math.floor(Math.random() * config.workTypes.length)]} - ${Math.random() > 0.5 ? 'Morning shift' : 'Full day'}`,
      status: Math.random() > 0.7 ? 'completed' : 'active'
    });
  }
  
  return entries;
}

// Generate notifications based on day and template
function generateNotifications(template: SimulationTemplate, day: number): string[] {
  const notifications = [];
  
  if (day === 1) {
    notifications.push('Welcome to your simulation! Start tracking your work to see earnings.');
    notifications.push('Complete your first time entry to unlock advanced features.');
  }
  
  if (day === 3) {
    notifications.push('Great progress! You\'ve completed 3 days of work.');
    notifications.push('Consider adding photos to your entries for better documentation.');
  }
  
  if (day === 7) {
    notifications.push('Week 1 complete! Review your earnings summary.');
    notifications.push('Your first invoice is ready for submission.');
  }
  
  if (day === 10) {
    notifications.push('You\'re approaching the end of your pay period.');
    notifications.push('Finalize your entries before submission deadline.');
  }
  
  if (day === 14) {
    notifications.push('Pay period ends tomorrow! Submit your invoice.');
    notifications.push('All entries have been reviewed and approved.');
  }
  
  return notifications;
}

// Generate events based on day and template
function generateEvents(template: SimulationTemplate, day: number): string[] {
  const events = [];
  
  if (day === 1) {
    events.push('Contractor account activated');
    events.push('First work day started');
  }
  
  if (day === 5) {
    events.push('Equipment inspection completed');
    events.push('Safety training updated');
  }
  
  if (day === 10) {
    events.push('Mid-period review scheduled');
    events.push('Client feedback received');
  }
  
  if (day === 15) {
    events.push('Pay period completed');
    events.push('Invoice submitted for approval');
  }
  
  return events;
}

// Generate pay periods
function generatePayPeriods(template: SimulationTemplate): PayPeriod[] {
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

// Generate analytics data
function generateAnalytics(template: SimulationTemplate, day: number) {
  const config = template === 'oil_gas' ? OIL_GAS_TEMPLATE : CONSTRUCTION_TEMPLATE;
  const workedDays = Math.floor(day * 0.8); // 80% of days worked
  const totalEarned = workedDays * (config.dayRate + config.truckRate + config.subsistenceRate);
  
  return {
    weeklyEarnings: Array.from({ length: 3 }, () => Math.floor(Math.random() * 2000) + 3000),
    bestDay: {
      date: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      earnings: config.dayRate + config.truckRate + config.subsistenceRate
    },
    totalHours: workedDays * 8,
    avgHoursPerDay: 8
  };
}

// Main function to generate complete simulation data
export function generateSimulationData(template: SimulationTemplate, day: number): ContractorDashboard {
  const config = template === 'oil_gas' ? OIL_GAS_TEMPLATE : CONSTRUCTION_TEMPLATE;
  const entries = generateDailyEntries(template, day);
  const workedEntries = entries.filter(e => e.worked);
  const totalEarned = workedEntries.reduce((sum, entry) => {
    return sum + (entry.dayRateUsed || 0) + (entry.truckRateUsed || 0) + (entry.subsistenceActual || 0);
  }, 0);
  
  return {
    trialInvoice: {
      id: `sim-invoice-${template}-${day}`,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ratePerKm: config.ratePerKm,
      dayRate: config.dayRate,
      truckRate: config.truckRate,
      subsistenceRate: config.subsistenceRate
    },
    entries,
    summary: {
      totalEarned,
      daysWorked: workedEntries.length,
      daysRemaining: 15 - day,
      completionRate: (day / 15) * 100,
      projectedTotal: totalEarned * (15 / day),
      avgDailyEarnings: totalEarned / workedEntries.length || 0,
      efficiencyScore: Math.floor(Math.random() * 20) + 80 // 80-100
    },
    payPeriods: generatePayPeriods(template),
    analytics: generateAnalytics(template, day)
  };
}

// Generate time tracking data
export function generateTimeTrackingData(template: SimulationTemplate, day: number): TimeEntry[] {
  return generateTimeEntries(template, day);
}

// Generate notifications
export function generateNotificationData(template: SimulationTemplate, day: number): string[] {
  return generateNotifications(template, day);
}

// Generate events
export function generateEventData(template: SimulationTemplate, day: number): string[] {
  return generateEvents(template, day);
}

// Get template configuration
export function getTemplateConfig(template: SimulationTemplate) {
  return template === 'oil_gas' ? OIL_GAS_TEMPLATE : CONSTRUCTION_TEMPLATE;
} 