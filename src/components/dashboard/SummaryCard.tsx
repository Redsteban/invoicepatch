import React from 'react';

export interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center min-h-[100px]">
    <div className="mb-2">{icon}</div>
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
); 