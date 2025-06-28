'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ContractorDashboard, 
  DailyEntry, 
  TimeEntry, 
  getContractorDashboard,
  createDailyEntry,
  updateDailyEntry,
  startTimeTracking,
  endTimeTracking,
  uploadPhoto,
  generateSimulationDashboardData,
  generateSimulationEntries,
  generateSimulationInvoices,
  generateSimulationScenarios
} from '@/lib/contractorService';

interface ContractorContextType {
  // State
  dashboard: ContractorDashboard | null;
  currentTimeEntry: TimeEntry | null;
  isLoading: boolean;
  error: string | null;
  
  // Simulation State
  isSimulationMode: boolean;
  simulationDay: number;
  simulationTemplate: 'oil_gas' | 'construction' | null;
  simulationData: {
    notifications: string[];
    events: string[];
    scenarios: any;
  };
  
  // Actions
  loadDashboard: (trialInvoiceId: string) => Promise<void>;
  createEntry: (entry: Omit<DailyEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<DailyEntry>) => Promise<void>;
  startTracking: (data: {
    trialInvoiceId: string;
    startTime: string;
    location: { lat: number; lng: number; address: string };
    equipment?: string;
    notes?: string;
  }) => Promise<void>;
  stopTracking: (entryId: string, endTime: string) => Promise<void>;
  uploadPhotoFile: (file: File) => Promise<string>;
  
  // Simulation Actions
  startSimulation: (templateType: 'oil_gas' | 'construction') => void;
  advanceSimulationDay: () => void;
  exitSimulation: () => void;
  
  // Utility
  refreshData: () => Promise<void>;
  clearError: () => void;
}

const ContractorContext = createContext<ContractorContextType | undefined>(undefined);

export function ContractorProvider({ children }: { children: ReactNode }) {
  const [dashboard, setDashboard] = useState<ContractorDashboard | null>(null);
  const [currentTimeEntry, setCurrentTimeEntry] = useState<TimeEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrialInvoiceId, setCurrentTrialInvoiceId] = useState<string | null>(null);

  // Simulation state
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulationDay, setSimulationDay] = useState(1);
  const [simulationTemplate, setSimulationTemplate] = useState<'oil_gas' | 'construction' | null>(null);
  const [simulationData, setSimulationData] = useState({
    notifications: [] as string[],
    events: [] as string[],
    scenarios: null as any
  });

  // Load dashboard data (real or simulation)
  const loadDashboard = async (trialInvoiceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isSimulationMode) {
        // Load simulation data using contractorService functions
        const simData = generateSimulationDashboardData(simulationDay);
        setDashboard(simData);
        setCurrentTrialInvoiceId(trialInvoiceId);
        
        // Update simulation scenarios and notifications
        const scenarios = generateSimulationScenarios(simulationDay);
        setSimulationData({
          notifications: scenarios.notifications || [],
          events: scenarios.events || [],
          scenarios
        });
      } else {
        // Load real data
        const data = await getContractorDashboard(trialInvoiceId);
        setDashboard(data);
        setCurrentTrialInvoiceId(trialInvoiceId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Create entry (real or simulation)
  const createEntry = async (entry: Omit<DailyEntry, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isSimulationMode) {
        // Simulate entry creation
        const newEntry: DailyEntry = {
          ...entry,
          id: `sim-entry-${Date.now()}`
        };
        
        // Update local state
        if (dashboard) {
          setDashboard({
            ...dashboard,
            entries: [...dashboard.entries, newEntry],
          });
        }
      } else {
        // Real API call
        const newEntry = await createDailyEntry(entry);
        
        // Update local state
        if (dashboard) {
          setDashboard({
            ...dashboard,
            entries: [...dashboard.entries, newEntry],
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create entry');
    } finally {
      setIsLoading(false);
    }
  };

  // Update entry (real or simulation)
  const updateEntry = async (id: string, entry: Partial<DailyEntry>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isSimulationMode) {
        // Simulate entry update
        if (dashboard) {
          const updatedEntry = dashboard.entries.find(e => e.id === id);
          if (updatedEntry) {
            const newEntry = { ...updatedEntry, ...entry };
            setDashboard({
              ...dashboard,
              entries: dashboard.entries.map(e => e.id === id ? newEntry : e),
            });
          }
        }
      } else {
        // Real API call
        const updatedEntry = await updateDailyEntry(id, entry);
        
        // Update local state
        if (dashboard) {
          setDashboard({
            ...dashboard,
            entries: dashboard.entries.map(e => e.id === id ? updatedEntry : e),
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update entry');
    } finally {
      setIsLoading(false);
    }
  };

  // Start time tracking (real or simulation)
  const startTracking = async (data: {
    trialInvoiceId: string;
    startTime: string;
    location: { lat: number; lng: number; address: string };
    equipment?: string;
    notes?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isSimulationMode) {
        // Simulate time tracking
        const timeEntry: TimeEntry = {
          id: `sim-time-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          startTime: data.startTime,
          endTime: undefined,
          location: data.location,
          equipment: data.equipment,
          photos: [],
          notes: data.notes || '',
          status: 'active'
        };
        setCurrentTimeEntry(timeEntry);
      } else {
        // Real API call
        const timeEntry = await startTimeTracking(data);
        setCurrentTimeEntry(timeEntry);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start time tracking');
    } finally {
      setIsLoading(false);
    }
  };

  // Stop time tracking (real or simulation)
  const stopTracking = async (entryId: string, endTime: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isSimulationMode) {
        // Simulate stopping time tracking
        if (currentTimeEntry) {
          const updatedEntry = { ...currentTimeEntry, endTime, status: 'completed' as const };
          setCurrentTimeEntry(updatedEntry);
        }
        setCurrentTimeEntry(null);
        
        // Refresh dashboard data
        if (currentTrialInvoiceId) {
          await loadDashboard(currentTrialInvoiceId);
        }
      } else {
        // Real API call
        const timeEntry = await endTimeTracking(entryId, endTime);
        setCurrentTimeEntry(null);
        
        // Refresh dashboard data
        if (currentTrialInvoiceId) {
          await loadDashboard(currentTrialInvoiceId);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop time tracking');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload photo (real or simulation)
  const uploadPhotoFile = async (file: File): Promise<string> => {
    try {
      setError(null);
      
      if (isSimulationMode) {
        // Simulate photo upload
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        return `sim-photo-${Date.now()}.jpg`;
      } else {
        // Real API call
        const result = await uploadPhoto(file);
        return result.url;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload photo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Simulation methods
  const startSimulation = (templateType: 'oil_gas' | 'construction') => {
    setIsSimulationMode(true);
    setSimulationDay(1);
    setSimulationTemplate(templateType);
    setCurrentTimeEntry(null);
    setError(null);
    
    // Load initial simulation data
    const simData = generateSimulationDashboardData(1);
    setDashboard(simData);
    
    // Set initial scenarios and notifications
    const scenarios = generateSimulationScenarios(1);
    setSimulationData({
      notifications: scenarios.notifications || [],
      events: scenarios.events || [],
      scenarios
    });
  };

  const advanceSimulationDay = () => {
    if (simulationDay < 15) {
      const newDay = simulationDay + 1;
      setSimulationDay(newDay);
      
      // Reload simulation data for new day
      const simData = generateSimulationDashboardData(newDay);
      setDashboard(simData);
      
      // Update scenarios and notifications
      const scenarios = generateSimulationScenarios(newDay);
      setSimulationData({
        notifications: scenarios.notifications || [],
        events: scenarios.events || [],
        scenarios
      });
    }
  };

  const exitSimulation = () => {
    setIsSimulationMode(false);
    setSimulationDay(1);
    setSimulationTemplate(null);
    setDashboard(null);
    setCurrentTimeEntry(null);
    setSimulationData({ notifications: [], events: [], scenarios: null });
    setError(null);
  };

  // Refresh data (real or simulation)
  const refreshData = async () => {
    if (isSimulationMode) {
      // Refresh simulation data
      const simData = generateSimulationDashboardData(simulationDay);
      setDashboard(simData);
      
      const scenarios = generateSimulationScenarios(simulationDay);
      setSimulationData({
        notifications: scenarios.notifications || [],
        events: scenarios.events || [],
        scenarios
      });
    } else if (currentTrialInvoiceId) {
      // Refresh real data
      await loadDashboard(currentTrialInvoiceId);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: ContractorContextType = {
    dashboard,
    currentTimeEntry,
    isLoading,
    error,
    isSimulationMode,
    simulationDay,
    simulationTemplate,
    simulationData,
    loadDashboard,
    createEntry,
    updateEntry,
    startTracking,
    stopTracking,
    uploadPhotoFile,
    startSimulation,
    advanceSimulationDay,
    exitSimulation,
    refreshData,
    clearError,
  };

  return (
    <ContractorContext.Provider value={value}>
      {children}
    </ContractorContext.Provider>
  );
}

export function useContractor() {
  const context = useContext(ContractorContext);
  if (context === undefined) {
    throw new Error('useContractor must be used within a ContractorProvider');
  }
  return context;
} 