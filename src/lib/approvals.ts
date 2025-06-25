import { useState, useCallback } from 'react';

export interface Approval {
  id: string;
  contractor_id: string;
  date: string;
  diff: any;
  status: string;
  notes?: string;
  daily_entries?: any;
  users?: any;
}

export function useApprovals(managerId: string) {
  const [list, setList] = useState<Approval[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`/api/approvals?manager_id=${managerId}`);
    const json = await res.json();
    setList(json.data || []);
    setIsLoading(false);
  }, [managerId]);

  const approve = async (change_id: string, notes?: string) => {
    setIsLoading(true);
    const res = await fetch('/api/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change_id, action: 'approve', notes }),
    });
    const json = await res.json();
    await fetchList();
    setIsLoading(false);
    return json;
  };

  const reject = async (change_id: string, notes?: string) => {
    setIsLoading(true);
    const res = await fetch('/api/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change_id, action: 'reject', notes }),
    });
    const json = await res.json();
    await fetchList();
    setIsLoading(false);
    return json;
  };

  return { list, approve, reject, isLoading, fetchList };
} 