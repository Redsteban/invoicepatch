import { useState, useCallback } from 'react';
import { Template } from '../types/supabase'; // Replace with PayPeriod type when available

export type PayPeriod = {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
};

export function usePayPeriods() {
  const [list, setList] = useState<PayPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pay-periods');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load pay periods');
      setList(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadOne = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pay-periods/${id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load pay period');
      return json.data as PayPeriod;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: Partial<PayPeriod>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pay-periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to create pay period');
      await fetchList(); // refresh list
      return json.data as PayPeriod;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchList]);

  const close = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pay-periods/${id}/close`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to close pay period');
      await fetchList();
      return json.data as PayPeriod;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchList]);

  return { list, loadOne, create, close, isLoading, error };
} 