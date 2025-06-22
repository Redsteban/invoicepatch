'use client';

import { ReactNode } from 'react';
import ContractorSidebar from '@/components/contractor/ContractorSidebar';

interface ContractorLayoutProps {
  children: ReactNode;
}

export default function ContractorLayout({ children }: ContractorLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ContractorSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 