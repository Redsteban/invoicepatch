import { NextRequest, NextResponse } from 'next/server';
import {
  testDatabaseConnection,
  addEmailSubscriber,
  getEmailSubscriber,
  createPreOrder,
  trackAnalyticsEvent,
  cleanupTestData,
  type EmailSubscriberData,
  type PreOrderData,
  type AnalyticsEventData
} from '@/lib/supabase-utils';

export async function GET(request: NextRequest) {
  try {
    const testEmail = `api-test-${Date.now()}@invoicepatch.com`;
    const results = [];

    // Test 1: Database Connection
    const connectionTest = await testDatabaseConnection();
    results.push({
      test: 'database_connection',
      success: connectionTest.success,
      data: connectionTest.data,
      error: connectionTest.error
    });

    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        results
      }, { status: 500 });
    }

    // Test 2: Email Subscriber Operations
    const subscriberData: EmailSubscriberData = {
      email: testEmail,
      source: 'api_test',
      tags: ['test', 'api']
    };

    const addSubscriberResult = await addEmailSubscriber(subscriberData);
    results.push({
      test: 'add_email_subscriber',
      success: addSubscriberResult.success,
      data: addSubscriberResult.data,
      error: addSubscriberResult.error
    });

    if (addSubscriberResult.success) {
      const getSubscriberResult = await getEmailSubscriber(testEmail);
      results.push({
        test: 'get_email_subscriber',
        success: getSubscriberResult.success,
        data: getSubscriberResult.data,
        error: getSubscriberResult.error
      });
    }

    // Test 3: Pre-order Operations
    const preorderData: PreOrderData = {
      email: testEmail,
      stripe_session_id: `api_test_${Date.now()}`,
      company_name: 'API Test Company',
      contractor_count: 3,
      current_system: 'manual',
      biggest_pain_point: 'late_payments',
      amount_paid: 19.99,
      plan_type: 'monthly',
      discount_percentage: 90,
      status: 'paid'
    };

    const createPreorderResult = await createPreOrder(preorderData);
    results.push({
      test: 'create_preorder',
      success: createPreorderResult.success,
      data: createPreorderResult.data,
      error: createPreorderResult.error
    });

    // Test 4: Analytics Event Tracking
    const analyticsData: AnalyticsEventData = {
      event_name: 'api_test_event',
      email: testEmail,
      properties: {
        test_type: 'server_api_test',
        timestamp: new Date().toISOString(),
        endpoint: '/api/test-supabase'
      },
      page_url: '/api/test-supabase'
    };

    const trackAnalyticsResult = await trackAnalyticsEvent(analyticsData);
    results.push({
      test: 'track_analytics_event',
      success: trackAnalyticsResult.success,
      data: trackAnalyticsResult.data,
      error: trackAnalyticsResult.error
    });

    // Test 5: Cleanup
    const cleanupResult = await cleanupTestData(testEmail);
    results.push({
      test: 'cleanup_test_data',
      success: cleanupResult.success,
      error: cleanupResult.error
    });

    // Summary
    const successfulTests = results.filter(r => r.success).length;
    const totalTests = results.length;
    const allPassed = successfulTests === totalTests;

    return NextResponse.json({
      success: allPassed,
      summary: {
        total_tests: totalTests,
        successful: successfulTests,
        failed: totalTests - successfulTests,
        test_email: testEmail
      },
      results,
      timestamp: new Date().toISOString(),
      message: allPassed 
        ? '✅ All Supabase utility functions working correctly!'
        : `❌ ${totalTests - successfulTests} test(s) failed`
    });

  } catch (error) {
    console.error('Supabase API test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'API test failed with exception',
      timestamp: new Date().toISOString()
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