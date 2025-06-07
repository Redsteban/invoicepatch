import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    console.log('=== TRIAL ACCESS API STARTED ===');
    
    const body = await request.json();
    const { email } = body;
    
    console.log('Access request:', { email });
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }
    
    // Find active trial by email
    const { data: trial, error: trialError } = await supabase
      .from('trial_invoices')
      .select('*')
      .eq('contractor_email', email.toLowerCase())
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (trialError || !trial) {
      console.log('No active trial found:', trialError);
      return NextResponse.json({
        success: false,
        error: 'No active trial found for this email address. Please check your email or start a new trial.'
      }, { status: 404 });
    }
    
    console.log('Trial found:', trial.id);
    
    return NextResponse.json({
      success: true,
      trial: {
        id: trial.id,
        contractor_name: trial.contractor_name,
        company: trial.company,
        location: trial.location,
        start_date: trial.start_date,
        end_date: trial.end_date,
        sequence_number: trial.sequence_number
      }
    });
    
  } catch (error: any) {
    console.error('Trial access error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to access trial'
    }, { status: 500 });
  }
} 