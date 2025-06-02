import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
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
  try {
    const { 
      email, 
      firstName, 
      lastName,
      formId, 
      tags = [], 
      customFields = {},
      source = 'landing_page'
    }: SubscriptionRequest = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists in our database
    const { data: existingSubscriber, error: checkError } = await supabaseAdmin
      .from('email_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing subscriber:', checkError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    let subscriberData;
    let isNewSubscriber = !existingSubscriber;

    if (existingSubscriber) {
      // Update existing subscriber
      const updateData = {
        first_name: firstName || existingSubscriber.first_name,
        last_name: lastName || existingSubscriber.last_name,
        is_active: true,
        tags: Array.from(new Set([...existingSubscriber.tags, ...tags])), // Merge tags, remove duplicates
        updated_at: new Date().toISOString(),
      };

      const { data: updatedSubscriber, error: updateError } = await supabaseAdmin
        .from('email_subscribers')
        .update(updateData)
        .eq('email', email)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating subscriber:', updateError);
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        );
      }

      subscriberData = updatedSubscriber;
    } else {
      // Create new subscriber
      const newSubscriberData: EmailSubscriberInsert = {
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        subscription_source: source,
        is_active: true,
        tags,
      };

      const { data: newSubscriber, error: insertError } = await supabaseAdmin
        .from('email_subscribers')
        .insert(newSubscriberData)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating subscriber:', insertError);
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        );
      }

      subscriberData = newSubscriber;
    }

    // Add to ConvertKit (if configured)
    const convertkitResult = await addToConvertKit(
      email, 
      firstName, 
      formId, 
      tags, 
      customFields
    );

    // Update subscriber with ConvertKit ID if successful
    if (convertkitResult.success && convertkitResult.convertkit_subscriber_id) {
      await supabaseAdmin
        .from('email_subscribers')
        .update({ 
          convertkit_subscriber_id: convertkitResult.convertkit_subscriber_id 
        })
        .eq('email', email);
    }

    // Track analytics event
    const analyticsData = {
      event_name: 'email_subscription',
      event_data: {
        email,
        source,
        is_new_subscriber: isNewSubscriber,
        tags,
        convertkit_success: convertkitResult.success,
      },
      page_url: request.headers.get('referer'),
      user_agent: request.headers.get('user-agent'),
    };

    await supabaseAdmin
      .from('analytics_events')
      .insert(analyticsData);

    return NextResponse.json({
      success: true,
      message: isNewSubscriber ? 'Successfully subscribed!' : 'Subscription updated!',
      subscriber_id: subscriberData.id,
      is_new_subscriber: isNewSubscriber,
    });

  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
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
      .select('email, is_active, tags, subscription_source, created_at')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          subscribed: false,
          message: 'Email not found'
        });
      }
      
      console.error('Error checking subscription:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscribed: subscriber.is_active,
      subscription_date: subscriber.created_at,
      tags: subscriber.tags,
      source: subscriber.subscription_source,
    });

  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
} 