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