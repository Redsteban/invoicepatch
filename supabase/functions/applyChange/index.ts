import { serve } from 'std/server';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), { status: 405 });
  }

  const auth = req.headers.get('authorization') || '';
  const jwt = auth.replace('Bearer ', '');
  if (!jwt || jwt.length < 32) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing or invalid service-role JWT' }), { status: 401 });
  }

  let change_id: string | undefined;
  try {
    const body = await req.json();
    change_id = body.change_id;
    if (!change_id) throw new Error('Missing change_id');
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON or missing change_id' }), { status: 400 });
  }

  // Begin transaction
  const client = (globalThis as any).supabaseClient;
  if (!client) return new Response(JSON.stringify({ ok: false, error: 'No supabase client' }), { status: 500 });

  try {
    await client.rpc('begin');
    // a) Read change_notifications row
    const { data: change, error: changeErr } = await client
      .from('change_notifications')
      .select('*')
      .eq('id', change_id)
      .single();
    if (changeErr || !change) throw changeErr || new Error('Change not found');
    const diff = change.diff;
    const entry_id = change.entry_id;
    // b) Apply diff to daily_entries
    const { error: updateErr } = await client
      .from('daily_entries')
      .update(diff)
      .eq('id', entry_id);
    if (updateErr) throw updateErr;
    // c) Update status/acknowledged_at
    const { error: statusErr } = await client
      .from('change_notifications')
      .update({ status: 'applied', acknowledged_at: new Date().toISOString() })
      .eq('id', change_id);
    if (statusErr) throw statusErr;
    // d) Call refresh_period_summary
    const { error: sumErr } = await client.rpc('refresh_period_summary', { arg_pay_period_id: change.pay_period_id });
    if (sumErr) throw sumErr;
    await client.rpc('commit');
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    await client.rpc('rollback');
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400 });
  }
}); 