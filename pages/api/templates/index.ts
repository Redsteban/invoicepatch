import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { TemplateSchema, Template } from '../../../src/types/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List templates for current user
    const userId = req.query.user_id as string;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user_id' });
    }
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    // Create template (validate via Zod)
    const parse = TemplateSchema.omit({ id: true, created_at: true, updated_at: true }).safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: parse.error.errors });
    }
    const payload = {
      ...parse.data,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('templates')
      .insert([payload])
      .select()
      .single();
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(201).json({ success: true, data });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
} 