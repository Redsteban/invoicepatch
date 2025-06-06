import { createClient } from '@supabase/supabase-js'
import type { Database, PreOrderCustomer, EmailSubscriber, AnalyticsEventInsert } from './types'

// Supabase URL and Keys with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUwMzU0MDAsImV4cCI6MTk2MDYxMTQwMH0.B-GxrZ2qFoJ-mPLO3F5B1WPzV4aQY_9Gq5WcOZOqGQw'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NTAzNTQwMCwiZXhwIjoxOTYwNjExNDAwfQ._4o5BZWlkQ5vZgA6wZNDbJ7bGQO8eGmSyI_1g5iIQP8'

// Check if we're in a build environment
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV

// Check if required environment variables are set (skip check during build)
if (!isBuildTime) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Missing env.NEXT_PUBLIC_SUPABASE_URL - using placeholder')
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY - using placeholder')
  }
}

// Client-side Supabase client (for browser/frontend)
export const supabase = createClient<Database>(
  supabaseUrl.includes('placeholder') ? 'https://placeholder.supabase.co' : supabaseUrl, 
  supabaseAnonKey === 'placeholder_key' ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUwMzU0MDAsImV4cCI6MTk2MDYxMTQwMH0.B-GxrZ2qFoJ-mPLO3F5B1WPzV4aQY_9Gq5WcOZOqGQw' : supabaseAnonKey, 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Server-side admin client (for API routes)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl.includes('placeholder') ? 'https://placeholder.supabase.co' : supabaseUrl,
  supabaseServiceKey === 'placeholder_key' ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NTAzNTQwMCwiZXhwIjoxOTYwNjExNDAwfQ._4o5BZWlkQ5vZgA6wZNDbJ7bGQO8eGmSyI_1g5iIQP8' : supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  )
}

// Helper function to get a properly typed Supabase client
export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not properly configured. Using placeholder client.')
  }
  return supabase
}

// Helper function to get admin client (server-side only)
export const getSupabaseAdmin = () => {
  if (!supabaseServiceKey || supabaseServiceKey === 'placeholder_key') {
    console.warn('Using placeholder for admin operations.')
  }
  return supabaseAdmin
}

// Utility functions for common database operations

// Customer operations
export const customerOperations = {
  // Get customer by email
  async getByEmail(email: string): Promise<PreOrderCustomer | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning null for getByEmail')
      return null
    }

    const { data, error } = await supabaseAdmin
      .from('pre_order_customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    return data;
  },

  // Get customer by Stripe session ID
  async getByStripeSession(sessionId: string): Promise<PreOrderCustomer | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning null for getByStripeSession')
      return null
    }

    const { data, error } = await supabaseAdmin
      .from('pre_order_customers')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  // Get customer stats
  async getStats() {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning empty stats')
      return []
    }

    const { data, error } = await supabaseAdmin
      .from('daily_signups')
      .select('*')
      .limit(30);

    if (error) throw error;
    return data;
  },

  // Generate unique referral code
  async generateReferralCode(email: string): Promise<string> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - generating simple referral code')
      return email.split('@')[0].slice(0, 6).toUpperCase() + Math.floor(Math.random() * 1000)
    }

    const baseCode = email.split('@')[0].slice(0, 6).toUpperCase();
    let referralCode = baseCode;
    let counter = 1;

    // Check if code exists, increment if needed
    while (true) {
      const { data } = await supabaseAdmin
        .from('pre_order_customers')
        .select('referral_code')
        .eq('referral_code', referralCode)
        .single();

      if (!data) break; // Code is unique
      
      referralCode = `${baseCode}${counter}`;
      counter++;
    }

    return referralCode;
  }
};

// Email subscriber operations
export const subscriberOperations = {
  // Get subscriber by email
  async getByEmail(email: string): Promise<EmailSubscriber | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning null for subscriber getByEmail')
      return null
    }

    const { data, error } = await supabaseAdmin
      .from('email_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  // Get subscriber count by source
  async getStatsBySource() {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning empty subscriber stats')
      return {}
    }

    const { data, error } = await supabaseAdmin
      .from('email_subscribers')
      .select('subscription_source')
      .eq('is_active', true);

    if (error) throw error;

    const stats = data.reduce((acc: Record<string, number>, subscriber) => {
      acc[subscriber.subscription_source] = (acc[subscriber.subscription_source] || 0) + 1;
      return acc;
    }, {});

    return stats;
  }
};

// Analytics operations
export const analyticsOperations = {
  // Track an event
  async trackEvent(eventData: AnalyticsEventInsert) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - skipping analytics event')
      return
    }

    const { error } = await supabaseAdmin
      .from('analytics_events')
      .insert(eventData);

    if (error) {
      console.error('Failed to track analytics event:', error);
      // Don't throw - analytics failures shouldn't break the app
    }
  },

  // Get event counts by name
  async getEventCounts(startDate?: string, endDate?: string) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning empty event counts')
      return {}
    }

    let query = supabaseAdmin
      .from('analytics_events')
      .select('event_name');

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    const counts = data.reduce((acc: Record<string, number>, event) => {
      acc[event.event_name] = (acc[event.event_name] || 0) + 1;
      return acc;
    }, {});

    return counts;
  },

  // Get user journey data
  async getUserJourney(sessionId: string) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning empty user journey')
      return []
    }

    const { data, error } = await supabaseAdmin
      .from('analytics_events')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return { status: 'warning', message: 'Supabase not configured' }
    }

    // Simple query to check if database is accessible
    const { error } = await supabaseAdmin
      .from('email_subscribers')
      .select('count')
      .limit(1);

    if (error) {
      return { status: 'error', message: error.message };
    }

    return { status: 'ok', message: 'Database connection successful' };
  } catch (error) {
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Export health check for API routes
export { healthCheck as checkSupabaseHealth };
