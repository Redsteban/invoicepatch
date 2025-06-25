import React, { createContext, useContext } from 'react';
import { useTemplates } from '../lib/templates';

const TemplateContext = createContext<any>(null);

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useTemplates();
  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};

export function useTemplateContext() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error('useTemplateContext must be used within a TemplateProvider');
  return ctx;
} 