import React, { useState, useEffect } from 'react';
import { PayPeriodProvider } from '../../context/PayPeriodProvider';
import { useApprovals } from '../../lib/approvals';
import { SummaryCard } from '../../components/dashboard/SummaryCard';
import { ComplianceBar } from '../../components/dashboard/ComplianceBar';
import { CheckCircle, XCircle, FileDiff } from 'lucide-react';

// Stub: get managerId from session/auth
const managerId = 'manager-1';

const AuditDrawer = ({ open, onClose, approval }: any) => (
  open ? (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button className="absolute top-2 right-2 btn btn-sm btn-ghost" onClick={onClose}>Close</button>
        <h2 className="text-lg font-bold mb-2">Audit Trail</h2>
        <div className="mb-2">Contractor: {approval?.users?.name || approval?.contractor_id}</div>
        <div className="mb-2">Date: {approval?.date}</div>
        <div className="mb-2">Status: {approval?.status}</div>
        <div className="mb-2">Notes: {approval?.notes}</div>
        <div className="mb-2">Diff:</div>
        <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(approval?.diff, null, 2)}</pre>
        {/* TODO: Add history if available */}
      </div>
    </div>
  ) : null
);

const ManagerApprovals = () => {
  const { list, approve, reject, isLoading, fetchList } = useApprovals(managerId);
  const [drawer, setDrawer] = useState<{ open: boolean, approval: any } | null>(null);

  useEffect(() => { fetchList(); }, [fetchList]);

  return (
    <PayPeriodProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-2">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard icon={<CheckCircle className="text-green-500" />} label="Pending" value={list.length} />
            <SummaryCard icon={<FileDiff className="text-blue-500" />} label="Reviewed" value={0} />
            <SummaryCard icon={<XCircle className="text-red-500" />} label="Rejected" value={0} />
            <SummaryCard icon={<CheckCircle className="text-gray-400" />} label="Approved" value={0} />
          </div>
          <ComplianceBar verified={10} flagged={2} />
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <div className="text-lg font-semibold mb-2">Pending Approvals</div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-1">Contractor</th>
                  <th className="text-left py-1">Date</th>
                  <th className="text-left py-1">Diff</th>
                  <th className="text-left py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8">No pending approvals.</td></tr>
                ) : (
                  list.map((a: any) => (
                    <tr key={a.id} className="border-t">
                      <td className="py-1">{a.users?.name || a.contractor_id}</td>
                      <td className="py-1">{a.date}</td>
                      <td className="py-1">
                        <button className="btn btn-xs btn-outline" onClick={() => setDrawer({ open: true, approval: a })}>View</button>
                      </td>
                      <td className="py-1 flex gap-2">
                        <button className="btn btn-xs btn-success" onClick={() => approve(a.id)}>Approve</button>
                        <button className="btn btn-xs btn-error" onClick={() => reject(a.id)}>Reject</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AuditDrawer open={!!drawer?.open} onClose={() => setDrawer(null)} approval={drawer?.approval} />
        </div>
      </div>
    </PayPeriodProvider>
  );
};

export default ManagerApprovals; 