import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Function to ping Supabase REST API directly
async function pingSupabaseRestAPI() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      error: 'Missing Supabase credentials',
      response_time: null
    };
  }

  try {
    const startTime = Date.now();
    
    // Ping the Supabase REST API root endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        response_time: responseTime,
        api_version: response.headers.get('server') || 'unknown'
      };
    } else {
      return {
        success: false,
        status: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
        response_time: responseTime
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      response_time: null
    };
  }
}

// Database health check
async function checkDatabaseHealth() {
  try {
    // Check if main tables exist and are accessible
    const { data: preordersTest, error: preordersError } = await supabaseAdmin
      .from('preorders')
      .select('count')
      .limit(1);

    const { data: subscribersTest, error: subscribersError } = await supabaseAdmin
      .from('email_subscribers')
      .select('count')
      .limit(1);

    const { data: analyticsTest, error: analyticsError } = await supabaseAdmin
      .from('analytics_events')
      .select('count')
      .limit(1);

    const tablesWorking = {
      preorders: !preordersError,
      email_subscribers: !subscribersError,
      analytics_events: !analyticsError
    };

    const allTablesWorking = Object.values(tablesWorking).every(Boolean);

    return {
      connected: allTablesWorking,
      tables: tablesWorking,
      error: allTablesWorking ? null : 'Some tables not accessible',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      connected: false,
      tables: { preorders: false, email_subscribers: false, analytics_events: false },
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

// Test basic operations
async function testDatabaseOperations() {
  try {
    // Test preorders stats
    const { data: preordersStats, error: preordersError } = await supabaseAdmin
      .from('preorders')
      .select('plan_type, status')
      .limit(10);

    // Test email subscribers stats
    const { data: subscribersStats, error: subscribersError } = await supabaseAdmin
      .from('email_subscribers')
      .select('source')
      .limit(10);

    // Test analytics events
    const { data: analyticsStats, error: analyticsError } = await supabaseAdmin
      .from('analytics_events')
      .select('event_name')
      .limit(10);

    return {
      operations_working: !preordersError && !subscribersError && !analyticsError,
      stats: {
        preorders_count: preordersStats?.length || 0,
        subscribers_count: subscribersStats?.length || 0,
        analytics_events_count: analyticsStats?.length || 0
      },
      errors: {
        preorders: preordersError?.message,
        subscribers: subscribersError?.message,
        analytics: analyticsError?.message
      }
    };
  } catch (error) {
    return {
      operations_working: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check database connectivity
    const dbHealth = await checkDatabaseHealth();

    // Ping Supabase REST API directly
    const restApiPing = await pingSupabaseRestAPI();

    // Test basic operations if database is connected
    let testResults = {};
    
    if (dbHealth.connected) {
      testResults = await testDatabaseOperations();
    }

    // Environment check
    const envCheck = {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      stripe_configured: !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      convertkit_configured: !!process.env.CONVERTKIT_API_KEY,
    };

    const allSystemsOperational = dbHealth.connected && 
                                 restApiPing.success &&
                                 envCheck.supabase_url && 
                                 envCheck.supabase_anon_key && 
                                 envCheck.supabase_service_key;

    return NextResponse.json({
      status: allSystemsOperational ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      rest_api: restApiPing,
      environment: envCheck,
      operations: testResults,
      integration_status: {
        supabase: dbHealth.connected ? '✅ Connected' : '❌ Disconnected',
        rest_api: restApiPing.success ? '✅ Responding' : '❌ Not responding',
        stripe: envCheck.stripe_configured ? '✅ Configured' : '⚠️ Not configured',
        convertkit: envCheck.convertkit_configured ? '✅ Configured' : '⚠️ Not configured',
      },
      performance: {
        rest_api_response_time: restApiPing.response_time ? `${restApiPing.response_time}ms` : 'N/A',
      },
      next_steps: allSystemsOperational ? 
        ['🎉 Supabase integration is complete and working!'] :
        [
          !envCheck.supabase_url && '1. Set NEXT_PUBLIC_SUPABASE_URL in .env.local',
          !envCheck.supabase_anon_key && '2. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
          !envCheck.supabase_service_key && '3. Set SUPABASE_SERVICE_ROLE_KEY in .env.local',
          !dbHealth.connected && '4. Run the database migration from supabase/migrations/20241201000000_initial_schema.sql',
          !restApiPing.success && '5. Check Supabase project status and network connectivity',
          !envCheck.stripe_configured && '6. Configure Stripe keys (optional for testing)',
          !envCheck.convertkit_configured && '7. Configure ConvertKit (optional)'
        ].filter(Boolean)
    }, {
      status: allSystemsOperational ? 200 : 503
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Supabase integration health check failed'
    }, {
      status: 500
    });
  }
} 