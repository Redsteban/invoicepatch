import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs/edge';

const MAX_TRIAL_INVOICES = 5; // Set your trial invoice cap here

export async function planGuard(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    // Not authenticated
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user record
  const { data: user, error } = await supabase
    .from('users')
    .select('plan_type, invoices_created')
    .eq('id', session.user.id)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }

  if (
    user.plan_type === 'trial' &&
    user.invoices_created >= MAX_TRIAL_INVOICES
  ) {
    // If API route, return JSON 402
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ paywalled: true }, { status: 402 });
    }
    // If page route, redirect to billing
    return NextResponse.redirect(
      new URL('/billing?paywall=1', req.nextUrl.origin)
    );
  }

  // Allow request
  return res;
} 