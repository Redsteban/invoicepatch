import { supabaseAdmin, supabase } from './supabase';

// TypeScript interfaces for database operations
export interface EmailSubscriberData {
  email: string;
  source?: string;
  tags?: string[];
}

export interface PreOrderData {
  email: string;
  stripe_session_id?: string;
  company_name?: string;
  contractor_count?: number;
  current_system?: string;
  biggest_pain_point?: string;
  amount_paid: number;
  plan_type: 'monthly' | 'annual' | 'lifetime';
  discount_percentage?: number;
  status?: string;
}

export interface AnalyticsEventData {
  event_name: string;
  user_id?: string;
  email?: string;
  properties?: Record<string, any>;
  page_url?: string;
}

export interface DatabaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Utility function for consistent error handling
function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown database error occurred';
}

// Email Subscriber Operations
export async function addEmailSubscriber(
  subscriberData: EmailSubscriberData
): Promise<DatabaseResponse<any>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('email_subscribers')
      .insert({
        email: subscriberData.email,
        source: subscriberData.source || 'landing_page',
        tags: subscriberData.tags || []
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

export async function getEmailSubscriber(email: string): Promise<DatabaseResponse<any>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('email_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

export async function updateEmailSubscriber(
  email: string,
  updates: Partial<EmailSubscriberData>
): Promise<DatabaseResponse<any>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('email_subscribers')
      .update(updates)
      .eq('email', email)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

// Pre-order Operations
export async function createPreOrder(orderData: PreOrderData): Promise<DatabaseResponse<any>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('preorders')
      .insert({
        email: orderData.email,
        stripe_session_id: orderData.stripe_session_id,
        company_name: orderData.company_name,
        contractor_count: orderData.contractor_count,
        current_system: orderData.current_system,
        biggest_pain_point: orderData.biggest_pain_point,
        amount_paid: orderData.amount_paid,
        plan_type: orderData.plan_type,
        discount_percentage: orderData.discount_percentage || 90,
        status: orderData.status || 'paid'
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

export async function getPreOrder(email: string): Promise<DatabaseResponse<any>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('preorders')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

export async function getPreOrderBySession(sessionId: string): Promise<DatabaseResponse<any>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('preorders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

// Analytics Operations
export async function trackAnalyticsEvent(
  eventData: AnalyticsEventData
): Promise<DatabaseResponse<any>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('analytics_events')
      .insert({
        event_name: eventData.event_name,
        user_id: eventData.user_id,
        email: eventData.email,
        properties: eventData.properties || {},
        page_url: eventData.page_url
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

export async function getAnalyticsEvents(
  filters: {
    event_name?: string;
    email?: string;
    user_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}
): Promise<DatabaseResponse<any[]>> {
  try {
    let query = supabaseAdmin
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.event_name) {
      query = query.eq('event_name', filters.event_name);
    }
    if (filters.email) {
      query = query.eq('email', filters.email);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.start_date) {
      query = query.gte('created_at', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('created_at', filters.end_date);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

// Database Health Check
export async function testDatabaseConnection(): Promise<DatabaseResponse<{
  tables: { [key: string]: boolean };
  total_records: { [key: string]: number };
}>> {
  try {
    // Test all three main tables
    const [preordersTest, subscribersTest, analyticsTest] = await Promise.all([
      supabaseAdmin.from('preorders').select('count').limit(1),
      supabaseAdmin.from('email_subscribers').select('count').limit(1),
      supabaseAdmin.from('analytics_events').select('count').limit(1)
    ]);

    const tables = {
      preorders: !preordersTest.error,
      email_subscribers: !subscribersTest.error,
      analytics_events: !analyticsTest.error
    };

    // Get total record counts
    const [preordersCount, subscribersCount, analyticsCount] = await Promise.all([
      supabaseAdmin.from('preorders').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('email_subscribers').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('analytics_events').select('id', { count: 'exact', head: true })
    ]);

    const total_records = {
      preorders: preordersCount.count || 0,
      email_subscribers: subscribersCount.count || 0,
      analytics_events: analyticsCount.count || 0
    };

    const allTablesWorking = Object.values(tables).every(Boolean);

    if (!allTablesWorking) {
      const failedTables = Object.entries(tables)
        .filter(([_, working]) => !working)
        .map(([table]) => table);
      
      return {
        success: false,
        error: `Tables not accessible: ${failedTables.join(', ')}`
      };
    }

    return {
      success: true,
      data: {
        tables,
        total_records
      }
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
}

// Clean up test data (useful for development)
export async function cleanupTestData(testEmail: string): Promise<DatabaseResponse<void>> {
  try {
    await Promise.all([
      supabaseAdmin.from('preorders').delete().eq('email', testEmail),
      supabaseAdmin.from('email_subscribers').delete().eq('email', testEmail),
      supabaseAdmin.from('analytics_events').delete().eq('email', testEmail)
    ]);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error)
    };
  }
} 