import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  addEmailSubscriber,
  getEmailSubscriber,
  createPreOrder,
  trackAnalyticsEvent,
  getAnalyticsEvents,
  cleanupTestData,
  testDatabaseConnection,
  type EmailSubscriberData,
  type PreOrderData,
  type AnalyticsEventData
} from '@/lib/supabase-utils';

export async function GET(request: NextRequest) {
  // Check if during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    return NextResponse.json({
      success: true,
      message: 'Build time - Supabase test skipped',
      timestamp: new Date().toISOString(),
    });
  }

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: false,
      message: 'Supabase is not properly configured',
      details: 'Please check your environment variables',
      next_steps: [
        '1. Set NEXT_PUBLIC_SUPABASE_URL in your environment',
        '2. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment',
        '3. Set SUPABASE_SERVICE_ROLE_KEY in your environment',
      ],
    }, { status: 503 });
  }

  const testResults: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      passed: 0,
      failed: 0,
      total: 0,
    },
  };

  // Helper function to add test result
  const addTestResult = (name: string, success: boolean, data?: any, error?: string) => {
    testResults.tests.push({
      name,
      success,
      data,
      error,
      timestamp: new Date().toISOString(),
    });
    
    if (success) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
    }
    testResults.summary.total++;
  };

  try {
    const testEmail = `test-${Date.now()}@example.com`;

    // Test 1: Database connection
    try {
      const connectionResult = await testDatabaseConnection();
      addTestResult('Database Connection', connectionResult.success, connectionResult.data, connectionResult.error);
    } catch (error) {
      addTestResult('Database Connection', false, null, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 2: Add email subscriber
    try {
      const subscriberData: EmailSubscriberData = {
        email: testEmail,
        source: 'api_test',
        tags: ['test', 'api']
      };
      const result = await addEmailSubscriber(subscriberData);
      addTestResult('Add Email Subscriber', result.success, result.data, result.error);
    } catch (error) {
      addTestResult('Add Email Subscriber', false, null, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 3: Get email subscriber
    try {
      const result = await getEmailSubscriber(testEmail);
      addTestResult('Get Email Subscriber', result.success, result.data, result.error);
    } catch (error) {
      addTestResult('Get Email Subscriber', false, null, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 4: Create pre-order
    try {
      const preOrderData: PreOrderData = {
        email: testEmail,
        stripe_session_id: `test_session_${Date.now()}`,
        company_name: 'Test Company',
        contractor_count: 5,
        current_system: 'manual',
        biggest_pain_point: 'late_payments',
        amount_paid: 0,
        plan_type: 'monthly',
        status: 'pending'
      };
      const result = await createPreOrder(preOrderData);
      addTestResult('Create Pre-order', result.success, result.data, result.error);
    } catch (error) {
      addTestResult('Create Pre-order', false, null, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 5: Track analytics event
    try {
      const analyticsData: AnalyticsEventData = {
        event_name: 'test_event',
        email: testEmail,
        properties: {
          test: true,
          endpoint: '/api/test-supabase'
        },
        page_url: '/api/test-supabase'
      };
      const result = await trackAnalyticsEvent(analyticsData);
      addTestResult('Track Analytics Event', result.success, result.data, result.error);
    } catch (error) {
      addTestResult('Track Analytics Event', false, null, error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 6: Get analytics events
    try {
      const result = await getAnalyticsEvents({ event_name: 'test_event' });
      addTestResult('Get Analytics Events', result.success, { count: result.data?.length || 0 }, result.error);
    } catch (error) {
      addTestResult('Get Analytics Events', false, null, error instanceof Error ? error.message : 'Unknown error');
    }

    // Clean up test data
    try {
      const result = await cleanupTestData(testEmail);
      addTestResult('Cleanup Test Data', result.success, { message: 'Test data cleaned up' }, result.error);
    } catch (error) {
      addTestResult('Cleanup Test Data', false, null, error instanceof Error ? error.message : 'Unknown error');
    }

    // Final assessment
    const allTestsPassed = testResults.summary.failed === 0;
    const overallMessage = allTestsPassed 
      ? '✅ All Supabase utility functions working correctly!'
      : `⚠️ ${testResults.summary.failed} out of ${testResults.summary.total} tests failed`;

    return NextResponse.json({
      success: allTestsPassed,
      message: overallMessage,
      ...testResults,
    }, { 
      status: allTestsPassed ? 200 : 500 
    });

  } catch (error) {
    console.error('Supabase API test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Supabase test suite failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'add_subscriber':
        const result = await addEmailSubscriber(data);
        return NextResponse.json(result);

      case 'create_preorder':
        const preorderResult = await createPreOrder(data);
        return NextResponse.json(preorderResult);

      case 'track_event':
        const analyticsResult = await trackAnalyticsEvent(data);
        return NextResponse.json(analyticsResult);

      case 'test_connection':
        const connectionResult = await testDatabaseConnection();
        return NextResponse.json(connectionResult);

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 