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
  uploadPhoto
} from '@/lib/contractorService';
import { 
  generateSimulationData, 
  generateTimeTrackingData, 
  generateNotificationData, 
  generateEventData,
  SimulationTemplate 
} from '@/lib/simulationDataGenerator';

interface ContractorContextType {
  // State
  dashboard: ContractorDashboard | null;
  currentTimeEntry: TimeEntry | null;
  isLoading: boolean;
  error: string | null;
  
  // Simulation State
  isSimulationMode: boolean;
  simulationDay: number;
  simulationTemplate: SimulationTemplate | null;
  simulationData: {
    notifications: string[];
    events: string[];
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
  startSimulation: (templateType: SimulationTemplate) => void;
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
  const [simulationTemplate, setSimulationTemplate] = useState<SimulationTemplate | null>(null);
  const [simulationData, setSimulationData] = useState({
    notifications: [] as string[],
    events: [] as string[]
  });

  // Load dashboard data (real or simulation)
  const loadDashboard = async (trialInvoiceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isSimulationMode && simulationTemplate) {
        // Load simulation data
        const simData = generateSimulationData(simulationTemplate, simulationDay);
        setDashboard(simData);
        setCurrentTrialInvoiceId(trialInvoiceId);
        
        // Update simulation notifications and events
        const notifications = generateNotificationData(simulationTemplate, simulationDay);
        const events = generateEventData(simulationTemplate, simulationDay);
        setSimulationData({ notifications, events });
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
      
      if (isSimulationMode && simulationTemplate) {
        // Simulate time tracking
        const timeEntries = generateTimeTrackingData(simulationTemplate, simulationDay);
        const activeEntry = timeEntries.find(entry => entry.status === 'active');
        if (activeEntry) {
          setCurrentTimeEntry(activeEntry);
        }
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
  const startSimulation = (templateType: SimulationTemplate) => {
    setIsSimulationMode(true);
    setSimulationDay(1);
    setSimulationTemplate(templateType);
    setCurrentTimeEntry(null);
    setError(null);
    
    // Load initial simulation data
    const simData = generateSimulationData(templateType, 1);
    setDashboard(simData);
    
    // Set initial notifications and events
    const notifications = generateNotificationData(templateType, 1);
    const events = generateEventData(templateType, 1);
    setSimulationData({ notifications, events });
  };

  const advanceSimulationDay = () => {
    if (simulationDay < 15 && simulationTemplate) {
      const newDay = simulationDay + 1;
      setSimulationDay(newDay);
      
      // Reload simulation data for new day
      const simData = generateSimulationData(simulationTemplate, newDay);
      setDashboard(simData);
      
      // Update notifications and events
      const notifications = generateNotificationData(simulationTemplate, newDay);
      const events = generateEventData(simulationTemplate, newDay);
      setSimulationData({ notifications, events });
    }
  };

  const exitSimulation = () => {
    setIsSimulationMode(false);
    setSimulationDay(1);
    setSimulationTemplate(null);
    setDashboard(null);
    setCurrentTimeEntry(null);
    setSimulationData({ notifications: [], events: [] });
    setError(null);
  };

  // Refresh data (real or simulation)
  const refreshData = async () => {
    if (isSimulationMode && simulationTemplate) {
      // Refresh simulation data
      const simData = generateSimulationData(simulationTemplate, simulationDay);
      setDashboard(simData);
      
      const notifications = generateNotificationData(simulationTemplate, simulationDay);
      const events = generateEventData(simulationTemplate, simulationDay);
      setSimulationData({ notifications, events });
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