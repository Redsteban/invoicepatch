import React, { useEffect, useState } from 'react';

interface AuditDrawerProps {
  changeId: string | null;
  onClose: () => void;
}

export const AuditDrawer: React.FC<AuditDrawerProps> = ({ changeId, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!changeId) return;
    setLoading(true);
    fetch(`/api/approvals/${changeId}`)
      .then(res => res.json())
      .then(json => setData(json.data))
      .finally(() => setLoading(false));
  }, [changeId]);

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `change_${changeId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple JSON diff highlighter (before/after)
  function renderDiff(diff: any) {
    if (!diff) return null;
    return (
      <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">
        {Object.entries(diff).map(([key, value]: any) => (
          <div key={key} className="flex gap-2 items-center">
            <span className="font-mono text-gray-500">{key}:</span>
            {value && typeof value === 'object' && 'before' in value && 'after' in value ? (
              <>
                <span className="bg-red-100 text-red-700 px-1 rounded">{JSON.stringify(value.before)}</span>
                <span className="mx-1">→</span>
                <span className="bg-green-100 text-green-700 px-1 rounded">{JSON.stringify(value.after)}</span>
              </>
            ) : (
              <span>{JSON.stringify(value)}</span>
            )}
          </div>
        ))}
      </pre>
    );
  }

  if (!changeId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button className="absolute top-2 right-2 btn btn-sm btn-ghost" onClick={onClose}>Close</button>
        <h2 className="text-lg font-bold mb-2">Audit Trail</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : !data ? (
          <div className="text-center py-8 text-red-500">No data found.</div>
        ) : (
          <>
            <div className="mb-2">Change ID: {changeId}</div>
            <div className="mb-2">Status: {data.status}</div>
            <div className="mb-2">Diff:</div>
            {renderDiff(data.diff_detail)}
            <div className="mt-4 flex gap-2">
              <button className="btn btn-outline btn-sm" onClick={handleExport}>Export JSON</button>
            </div>
            {/* TODO: Render audit log/history if available */}
          </>
        )}
      </div>
    </div>
  );
}; 