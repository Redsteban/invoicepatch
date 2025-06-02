import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Function to ping Supabase REST API directly
async function pingSupabaseRestAPI() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
    return {
      success: false,
      error: 'Missing Supabase credentials',
      status: 'not_configured'
    };
  }

  try {
    // Ping the Supabase REST API root endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

async function checkDatabaseTables() {
  // Skip if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase not configured',
      tables: {
        pre_order_customers: false,
        email_subscribers: false,
        analytics_events: false,
      }
    };
  }

  try {
    // Test basic connectivity with each table
    const [preordersTest, subscribersTest, analyticsTest] = await Promise.allSettled([
      supabaseAdmin.from('pre_order_customers').select('count').limit(1),
      supabaseAdmin.from('email_subscribers').select('count').limit(1),
      supabaseAdmin.from('analytics_events').select('count').limit(1),
    ]);

    return {
      connected: true,
      tables: {
        pre_order_customers: preordersTest.status === 'fulfilled' && !preordersTest.value.error,
        email_subscribers: subscribersTest.status === 'fulfilled' && !subscribersTest.value.error,
        analytics_events: analyticsTest.status === 'fulfilled' && !analyticsTest.value.error,
      }
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      tables: {
        pre_order_customers: false,
        email_subscribers: false,
        analytics_events: false,
      }
    };
  }
}

async function getDatabaseStats() {
  // Skip if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return {
      pre_order_customers: 0,
      email_subscribers: 0,
      analytics_events: 0,
    };
  }

  try {
    const [preordersStats, subscribersStats, analyticsStats] = await Promise.allSettled([
      supabaseAdmin.from('pre_order_customers').select('id', { count: 'exact' }),
      supabaseAdmin.from('email_subscribers').select('id', { count: 'exact' }),
      supabaseAdmin.from('analytics_events').select('id', { count: 'exact' }),
    ]);

    return {
      pre_order_customers: preordersStats.status === 'fulfilled' ? preordersStats.value.count || 0 : 0,
      email_subscribers: subscribersStats.status === 'fulfilled' ? subscribersStats.value.count || 0 : 0,
      analytics_events: analyticsStats.status === 'fulfilled' ? analyticsStats.value.count || 0 : 0,
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      pre_order_customers: 0,
      email_subscribers: 0,
      analytics_events: 0,
    };
  }
}

export async function GET(request: NextRequest) {
  // Check if during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    return NextResponse.json({
      status: 'build_time',
      message: 'Health check skipped during build',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const startTime = Date.now();

    // Check database connectivity
    const dbHealth = await checkDatabaseTables();
    
    // Get database stats (if connected)
    const dbStats = await getDatabaseStats();

    // Ping Supabase REST API directly
    const restApiPing = await pingSupabaseRestAPI();

    const responseTime = Date.now() - startTime;

    // Environment variables check
    const envCheck = {
      next_public_app_url: !!process.env.NEXT_PUBLIC_APP_URL,
      stripe_secret_key: !!process.env.STRIPE_SECRET_KEY,
      stripe_webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
      resend_api_key: !!process.env.RESEND_API_KEY,
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    // Overall health status
    const isHealthy = 
      envCheck.supabase_url &&
      envCheck.supabase_anon_key &&
      envCheck.supabase_service_key;

    const healthStatus = isHealthy ? 200 : 503;

    const healthData = {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime,
      services: {
        database: dbHealth.connected ? '✅ Connected' : '❌ Disconnected',
        supabase: restApiPing.success ? '✅ API Reachable' : '❌ API Unreachable',
        environment: isHealthy ? '✅ Configured' : '⚠️ Missing variables',
      },
      database: {
        connected: dbHealth.connected,
        tables: dbHealth.tables,
        stats: dbStats,
      },
      environment: envCheck,
      recommendations: isHealthy ? 
        ['🎉 Supabase integration is complete and working!'] :
        [
          !envCheck.supabase_url && '1. Set NEXT_PUBLIC_SUPABASE_URL in .env.local',
          !envCheck.supabase_anon_key && '2. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
          !envCheck.supabase_service_key && '3. Set SUPABASE_SERVICE_ROLE_KEY in .env.local',
          !dbHealth.connected && '4. Run the database migration from supabase/migrations/20241201000000_initial_schema.sql',
          !restApiPing.success && '5. Check Supabase project status and network connectivity',
        ].filter(Boolean),
    };

    return NextResponse.json(healthData, { status: healthStatus });

  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Supabase integration health check failed'
    }, { status: 500 });
  }
} 