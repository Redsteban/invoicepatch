import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required');
  }
  
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Get Supabase client at runtime
    const supabase = getSupabaseClient();

    // Create user account
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: name,
        phone: phone
      },
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: name
      }
    });

  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create account'
    }, { status: 500 });
  }
} 