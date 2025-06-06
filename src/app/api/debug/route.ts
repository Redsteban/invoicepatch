import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG API CALLED ===')
    
    // Check environment variables
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      nodeEnv: process.env.NODE_ENV
    }
    
    console.log('Environment check:', envCheck)
    
    // Test database connection
    const { data: testQuery, error: testError } = await supabaseAdmin
      .from('trial_invoices')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('Database test error:', testError)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: testError.message,
        envCheck
      })
    }
    
    // Test table structure
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('trial_invoices')
      .select('*')
      .limit(1)
    
    console.log('Table test result:', tableInfo)
    
    return NextResponse.json({
      success: true,
      message: 'All systems operational',
      envCheck,
      databaseConnected: true,
      tableAccessible: !tableError,
      sampleDataExists: tableInfo && tableInfo.length > 0,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Debug check failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 