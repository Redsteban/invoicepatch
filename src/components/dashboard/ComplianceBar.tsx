import React from 'react';

export interface ComplianceBarProps {
  verified: number;
  flagged: number;
}

export const ComplianceBar: React.FC<ComplianceBarProps> = ({ verified, flagged }) => {
  const total = verified + flagged;
  const verifiedPct = total ? (verified / total) * 100 : 0;
  const flaggedPct = total ? (flagged / total) * 100 : 0;
  return (
    <div className="bg-white rounded-lg shadow p-4 my-4">
      <div className="text-sm font-semibold mb-2">Compliance Progress</div>
      <div className="h-4 w-full bg-gray-200 rounded overflow-hidden flex">
        <div
          className="h-4 bg-green-400"
          style={{ width: `${verifiedPct}%` }}
          title={`Verified: ${verified}`}
        />
        <div
          className="h-4 bg-red-400"
          style={{ width: `${flaggedPct}%` }}
          title={`Flagged: ${flagged}`}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-green-600">Verified: {verified}</span>
        <span className="text-red-600">Flagged: {flagged}</span>
      </div>
    </div>
  );
}; 