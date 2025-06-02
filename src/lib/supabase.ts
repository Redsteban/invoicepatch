import { createClient } from '@supabase/supabase-js'
import type { Database, PreOrderCustomer, EmailSubscriber, AnalyticsEventInsert } from './types'

// Supabase URL and Keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Check if required environment variables are set
if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Client-side Supabase client (for browser/frontend)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side admin client (for API routes)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Helper function to get a properly typed Supabase client
export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not properly configured. Please check your environment variables.')
  }
  return supabase
}

// Helper function to get admin client (server-side only)
export const getSupabaseAdmin = () => {
  if (!supabaseServiceKey) {
    console.warn('Using anon key for admin operations. This is not recommended for production.')
  }
  return supabaseAdmin
}

// Utility functions for common database operations

// Customer operations
export const customerOperations = {
  // Get customer by email
  async getByEmail(email: string): Promise<PreOrderCustomer | null> {
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
    const { data, error } = await supabaseAdmin
      .from('daily_signups')
      .select('*')
      .limit(30);

    if (error) throw error;
    return data;
  },

  // Generate unique referral code
  async generateReferralCode(email: string): Promise<string> {
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
  }
};

// Database health check
export const healthCheck = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('pre_order_customers')
      .select('count')
      .limit(1);

    return {
      connected: !error,
      error: error?.message,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
};
