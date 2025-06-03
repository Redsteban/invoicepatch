import { NextRequest, NextResponse } from 'next/server';

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only import and initialize Supabase if environment variables are present
let supabase: any = null;

if (supabaseUrl && supabaseServiceKey) {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// Define the trial invoice interface
interface TrialInvoice {
  trial_id: string;
  company: string;
  location: string;
  ticket_number: string;
  contact_person?: string;
  contact_email?: string;
  day_rate: number;
  truck_rate: number;
  travel_rate?: number;
  work_days: string[];
  start_date?: string;
  expected_duration?: number;
  travel_kms?: number;
  subsistence?: number;
  include_gst?: boolean;
  contractor_name: string;
  contractor_address: string;
  gst_number?: string;
  status: 'active' | 'pending' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export async function POST(request: NextRequest) {
  // Return error if Supabase is not configured
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Please set up Supabase environment variables.' },
      { status: 503 }
    );
  }

  try {
    const trialData: TrialInvoice = await request.json();

    // Validate required fields
    const requiredFields = ['trial_id', 'company', 'location', 'ticket_number', 'day_rate', 'truck_rate', 'contractor_name', 'contractor_address'];
    const missingFields = requiredFields.filter(field => !trialData[field as keyof TrialInvoice]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if trial already exists
    const { data: existingTrial, error: checkError } = await supabase
      .from('trial_invoices')
      .select('trial_id')
      .eq('trial_id', trialData.trial_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing trial:', checkError);
      return NextResponse.json(
        { error: 'Database error checking existing trial' },
        { status: 500 }
      );
    }

    // Prepare data for database
    const dbData = {
      ...trialData,
      work_days: JSON.stringify(trialData.work_days), // Convert array to JSON string
      created_at: trialData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let result;
    if (existingTrial) {
      // Update existing trial
      const { data: updatedTrial, error: updateError } = await supabase
        .from('trial_invoices')
        .update(dbData)
        .eq('trial_id', trialData.trial_id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating trial:', updateError);
        return NextResponse.json(
          { error: 'Failed to update trial invoice setup' },
          { status: 500 }
        );
      }
      result = updatedTrial;
    } else {
      // Insert new trial
      const { data: newTrial, error: insertError } = await supabase
        .from('trial_invoices')
        .insert([dbData])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting trial:', insertError);
        return NextResponse.json(
          { error: 'Failed to save trial invoice setup' },
          { status: 500 }
        );
      }
      result = newTrial;
    }

    // Convert work_days back to array for response
    if (result.work_days && typeof result.work_days === 'string') {
      result.work_days = JSON.parse(result.work_days);
    }

    return NextResponse.json({
      success: true,
      trial: result,
      message: existingTrial ? 'Trial invoice setup updated successfully' : 'Trial invoice setup created successfully'
    });

  } catch (error) {
    console.error('Trial setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update existing trial
export async function PUT(request: NextRequest) {
  // Return error if Supabase is not configured
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Please set up Supabase environment variables.' },
      { status: 503 }
    );
  }

  try {
    const trialData: TrialInvoice = await request.json();

    if (!trialData.trial_id) {
      return NextResponse.json(
        { error: 'Trial ID is required for updates' },
        { status: 400 }
      );
    }

    // Prepare data for database
    const dbData = {
      ...trialData,
      work_days: JSON.stringify(trialData.work_days), // Convert array to JSON string
      updated_at: new Date().toISOString()
    };

    const { data: updatedTrial, error: updateError } = await supabase
      .from('trial_invoices')
      .update(dbData)
      .eq('trial_id', trialData.trial_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating trial:', updateError);
      return NextResponse.json(
        { error: 'Failed to update trial invoice setup' },
        { status: 500 }
      );
    }

    // Convert work_days back to array for response
    if (updatedTrial.work_days && typeof updatedTrial.work_days === 'string') {
      updatedTrial.work_days = JSON.parse(updatedTrial.work_days);
    }

    return NextResponse.json({
      success: true,
      trial: updatedTrial,
      message: 'Trial invoice setup updated successfully'
    });

  } catch (error) {
    console.error('Trial update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve trial data
export async function GET(request: NextRequest) {
  // Return error if Supabase is not configured
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Please set up Supabase environment variables.' },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const trialId = searchParams.get('trial');

    if (!trialId) {
      return NextResponse.json(
        { error: 'Trial ID is required' },
        { status: 400 }
      );
    }

    const { data: trial, error } = await supabase
      .from('trial_invoices')
      .select('*')
      .eq('trial_id', trialId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json(
          { error: 'Trial not found' },
          { status: 404 }
        );
      }
      console.error('Error retrieving trial:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve trial data' },
        { status: 500 }
      );
    }

    // Convert work_days back to array
    if (trial.work_days && typeof trial.work_days === 'string') {
      trial.work_days = JSON.parse(trial.work_days);
    }

    return NextResponse.json({
      success: true,
      trial
    });

  } catch (error) {
    console.error('Error retrieving trial:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 