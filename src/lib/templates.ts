import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Template, TemplateSchema } from '../types/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useTemplates() {
  const [data, setData] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    if (!userId) {
      setError('Not authenticated');
      setIsLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    setData(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const create = async (payload: Partial<Template>) => {
    const parse = TemplateSchema.omit({ id: true, created_at: true, updated_at: true }).safeParse(payload);
    if (!parse.success) throw new Error('Validation failed');
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    if (!userId) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('templates')
      .insert([{ ...parse.data, user_id: userId, is_active: true }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    fetchTemplates();
    return data;
  };

  const update = async (id: string, payload: Partial<Template>) => {
    const parse = TemplateSchema.omit({ id: true, created_at: true, updated_at: true }).safeParse(payload);
    if (!parse.success) throw new Error('Validation failed');
    const { data, error } = await supabase
      .from('templates')
      .update({ ...parse.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    fetchTemplates();
    return data;
  };

  const remove = async (id: string) => {
    const { error } = await supabase
      .from('templates')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(error.message);
    fetchTemplates();
  };

  return { data, isLoading, error, create, update, remove };
} 