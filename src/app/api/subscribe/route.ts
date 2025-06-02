import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import type { EmailSubscriberInsert, SubscriptionSource } from '@/lib/types';

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;

// Default form IDs for different subscription types
const DEFAULT_FORM_IDS = {
  newsletter: process.env.CONVERTKIT_NEWSLETTER_FORM_ID,
  founder_updates: process.env.CONVERTKIT_FOUNDER_UPDATES_FORM_ID,
  beta_access: process.env.CONVERTKIT_BETA_ACCESS_FORM_ID,
  referral_program: process.env.CONVERTKIT_REFERRAL_FORM_ID,
};

interface SubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  formId?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  source?: SubscriptionSource;
}

async function addToConvertKit(
  email: string, 
  firstName?: string, 
  formId?: string, 
  tags: string[] = [],
  customFields: Record<string, string> = {}
) {
  if (!CONVERTKIT_API_KEY) {
    console.log('ConvertKit not configured, skipping email automation');
    return { success: false, error: 'ConvertKit not configured' };
  }

  // Use default newsletter form if no specific form is provided
  const targetFormId = formId || DEFAULT_FORM_IDS.newsletter;

  if (!targetFormId) {
    console.log('No ConvertKit form ID configured');
    return { success: false, error: 'No form ID configured' };
  }

  try {
    const payload = {
      api_key: CONVERTKIT_API_KEY,
      email: email,
      first_name: firstName || '',
      tags: [...tags, 'invoicepatch-subscriber'],
      fields: {
        ...customFields,
        subscription_date: new Date().toISOString(),
      },
    };

    const response = await fetch(`https://api.convertkit.com/v3/forms/${targetFormId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('ConvertKit subscription failed:', result);
      return { success: false, error: result.message || 'ConvertKit subscription failed' };
    }

    console.log('Successfully added to ConvertKit:', email);
    return { 
      success: true, 
      convertkit_subscriber_id: result.subscription?.subscriber?.id?.toString() 
    };
  } catch (error) {
    console.error('Error adding to ConvertKit:', error);
    return { success: false, error: 'ConvertKit API error' };
  }
}

export async function POST(request: NextRequest) {
  // Check if during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    console.log('Build time detected - skipping email subscription');
    return NextResponse.json({ 
      success: true, 
      message: 'Build time - subscription skipped' 
    });
  }

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - cannot process email subscription');
    return NextResponse.json({ 
      success: false, 
      message: 'Email subscription service not configured' 
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { email, source = 'website' } = body;

    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const { data: existingSubscriber, error: checkError } = await supabaseAdmin
      .from('email_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscriber:', checkError);
      return NextResponse.json(
        { success: false, message: 'Failed to process subscription' },
        { status: 500 }
      );
    }

    if (existingSubscriber) {
      // Update existing subscriber if inactive
      if (!existingSubscriber.is_active) {
        const { data: updatedSubscriber, error: updateError } = await supabaseAdmin
          .from('email_subscribers')
          .update({
            is_active: true,
            subscription_source: source,
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)
          .select()
          .single();

        if (updateError) {
          console.error('Error reactivating subscriber:', updateError);
          return NextResponse.json(
            { success: false, message: 'Failed to update subscription' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          subscriber: updatedSubscriber,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          subscriber: existingSubscriber,
        });
      }
    }

    // Create new subscriber
    const { data: newSubscriber, error: insertError } = await supabaseAdmin
      .from('email_subscribers')
      .insert({
        email,
        subscription_source: source,
        is_active: true,
        subscription_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating subscriber:', insertError);
      return NextResponse.json(
        { success: false, message: 'Failed to process subscription' },
        { status: 500 }
      );
    }

    // Track subscription event
    try {
      await supabaseAdmin
        .from('analytics_events')
        .insert({
          event_name: 'email_subscription',
          page_url: request.headers.get('referer') || '/',
          user_agent: request.headers.get('user-agent') || '',
          event_data: {
            source,
            subscriber_id: newSubscriber.id,
          },
        });
    } catch (analyticsError) {
      console.error('Failed to track subscription analytics:', analyticsError);
      // Don't fail the subscription if analytics fails
    }

    // Send welcome email (if email service is configured)
    try {
      await sendWelcomeEmail(email, source);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for a welcome message.',
      subscriber: newSubscriber,
    });

  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email: string, source: string) {
  // Check if email service is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('Email service not configured - skipping welcome email');
    return;
  }

  try {
    // You can implement actual email sending here using Resend or another service
    console.log(`Would send welcome email to ${email} from source: ${source}`);
    
    // Example with Resend (uncomment if you want to use it):
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'InvoicePatch <noreply@invoicepatch.com>',
        to: email,
        subject: 'Welcome to InvoicePatch!',
        html: `
          <h1>Welcome to InvoicePatch!</h1>
          <p>Thanks for subscribing to our newsletter. We'll keep you updated on our progress and launch.</p>
          <p>Best regards,<br>The InvoicePatch Team</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }
    */
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

// Get subscriber by email endpoint
export async function GET(request: NextRequest) {
  // Check if during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    console.log('Build time detected - skipping subscriber lookup');
    return NextResponse.json({ subscriber: null });
  }

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - cannot lookup subscriber');
    return NextResponse.json({ subscriber: null });
  }

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const { data: subscriber, error } = await supabaseAdmin
      .from('email_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscriber:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscriber' },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriber: subscriber || null });
  } catch (error) {
    console.error('Error in GET subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriber' },
      { status: 500 }
    );
  }
} 