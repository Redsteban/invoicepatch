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

interface ContractorContextType {
  // State
  dashboard: ContractorDashboard | null;
  currentTimeEntry: TimeEntry | null;
  isLoading: boolean;
  error: string | null;
  
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

  const loadDashboard = async (trialInvoiceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getContractorDashboard(trialInvoiceId);
      setDashboard(data);
      setCurrentTrialInvoiceId(trialInvoiceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const createEntry = async (entry: Omit<DailyEntry, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const newEntry = await createDailyEntry(entry);
      
      // Update local state
      if (dashboard) {
        setDashboard({
          ...dashboard,
          entries: [...dashboard.entries, newEntry],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create entry');
    } finally {
      setIsLoading(false);
    }
  };

  const updateEntry = async (id: string, entry: Partial<DailyEntry>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedEntry = await updateDailyEntry(id, entry);
      
      // Update local state
      if (dashboard) {
        setDashboard({
          ...dashboard,
          entries: dashboard.entries.map(e => e.id === id ? updatedEntry : e),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update entry');
    } finally {
      setIsLoading(false);
    }
  };

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
      const timeEntry = await startTimeTracking(data);
      setCurrentTimeEntry(timeEntry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start time tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const stopTracking = async (entryId: string, endTime: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const timeEntry = await endTimeTracking(entryId, endTime);
      setCurrentTimeEntry(null);
      
      // Refresh dashboard data
      if (currentTrialInvoiceId) {
        await loadDashboard(currentTrialInvoiceId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop time tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhotoFile = async (file: File): Promise<string> => {
    try {
      setError(null);
      const result = await uploadPhoto(file);
      return result.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload photo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refreshData = async () => {
    if (currentTrialInvoiceId) {
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
    loadDashboard,
    createEntry,
    updateEntry,
    startTracking,
    stopTracking,
    uploadPhotoFile,
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