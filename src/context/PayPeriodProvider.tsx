import React, { createContext, useContext } from 'react';
import { usePayPeriods } from '../lib/payPeriods';

const PayPeriodContext = createContext<any>(null);

export const PayPeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = usePayPeriods();
  return <PayPeriodContext.Provider value={value}>{children}</PayPeriodContext.Provider>;
};

export function usePayPeriodCtx() {
  const ctx = useContext(PayPeriodContext);
  if (!ctx) throw new Error('usePayPeriodCtx must be used within a PayPeriodProvider');
  return ctx;
} 