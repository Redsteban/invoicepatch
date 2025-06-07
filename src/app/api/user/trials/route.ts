import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSecureApi } from '../../../../lib/secure-api';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function handleGetUserTrials(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get user's trials
    const { data: trials, error: trialsError } = await supabase
      .from('trial_invoices')
      .select('*')
      .eq('contractor_email', user.email)
      .order('created_at', { ascending: false });

    if (trialsError) {
      console.error('Error fetching trials:', trialsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch trials' },
        { status: 500 }
      );
    }

    // Categorize trials
    const now = new Date();
    const active = trials?.filter(trial => {
      const endDate = new Date(trial.end_date);
      return trial.status === 'active' && endDate >= now;
    }) || [];

    const completed = trials?.filter(trial => {
      const endDate = new Date(trial.end_date);
      return trial.status === 'completed' || endDate < now;
    }) || [];

    return NextResponse.json({
      success: true,
      trials: {
        active,
        completed,
        total: trials?.length || 0
      }
    });

  } catch (error) {
    console.error('User trials API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = createSecureApi(handleGetUserTrials, 'authenticated'); 