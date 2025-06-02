'use client';

import React, { useState, useEffect } from 'react';
import { 
  testDatabaseConnection,
  addEmailSubscriber,
  getEmailSubscriber,
  createPreOrder,
  trackAnalyticsEvent,
  cleanupTestData,
  type DatabaseResponse,
  type EmailSubscriberData,
  type PreOrderData,
  type AnalyticsEventData
} from '@/lib/supabase-utils';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error' | 'running';
  message: string;
  data?: any;
  timestamp?: string;
}

interface ConnectionStatus {
  isConnected: boolean;
  tablesAccessible: boolean;
  lastChecked?: string;
  error?: string;
}

export default function SupabaseTest() {
  // Hydration handling
  const [isMounted, setIsMounted] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  
  // Existing state
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    tablesAccessible: false
  });
  const [isRunning, setIsRunning] = useState(false);
  const [autoCleanup, setAutoCleanup] = useState(true);

  // Handle client-side mounting and generate test email
  useEffect(() => {
    setIsMounted(true);
    setTestEmail(`test-${Date.now()}@invoicepatch.com`);
  }, []);

  // Check connection status only after mounting
  useEffect(() => {
    if (isMounted) {
      checkConnectionStatus();
    }
  }, [isMounted]);

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Supabase test...</p>
          </div>
        </div>
      </div>
    );
  }

  // Status indicator component
  const StatusIndicator = ({ status }: { status: 'pending' | 'success' | 'error' | 'running' }) => {
    const getColor = () => {
      switch (status) {
        case 'success': return 'text-green-600';
        case 'error': return 'text-red-600';
        case 'running': return 'text-blue-600';
        default: return 'text-gray-400';
      }
    };

    const getIcon = () => {
      switch (status) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'running': return '🔄';
        default: return '⏳';
      }
    };

    return (
      <span className={`inline-flex items-center ${getColor()}`}>
        <span className="mr-2">{getIcon()}</span>
      </span>
    );
  };

  // Add test result helper
  const addTestResult = (step: string, status: TestResult['status'], message: string, data?: any) => {
    const result: TestResult = {
      step,
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    
    setTestResults(prev => {
      const existingIndex = prev.findIndex(r => r.step === step);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  // Check initial connection status
  const checkConnectionStatus = async () => {
    try {
      const result = await testDatabaseConnection();
      
      setConnectionStatus({
        isConnected: result.success,
        tablesAccessible: result.success && result.data ? 
          Object.values(result.data.tables).every(Boolean) : false,
        lastChecked: new Date().toISOString(),
        error: result.error
      });

      return result;
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        tablesAccessible: false,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Connection check failed'
      });
      
      return { success: false, error: 'Connection check failed' };
    }
  };

  // Run comprehensive tests
  const runSupabaseTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Generate a fresh test email for this test run
    const currentTestEmail = `test-${Date.now()}@invoicepatch.com`;

    try {
      // Step 1: Test database connection
      addTestResult('connection', 'running', 'Testing database connection...');
      const connectionResult = await checkConnectionStatus();
      
      if (!connectionResult.success) {
        addTestResult('connection', 'error', `Database connection failed: ${connectionResult.error}`);
        setIsRunning(false);
        return;
      }

      addTestResult('connection', 'success', 'Database connection successful', connectionResult.data);

      // Step 2: Test email subscriber insertion
      addTestResult('email_insert', 'running', 'Testing email subscriber insertion...');
      const subscriberData: EmailSubscriberData = {
        email: currentTestEmail,
        source: 'test_component',
        tags: ['test', 'supabase_test']
      };

      const insertResult = await addEmailSubscriber(subscriberData);
      
      if (!insertResult.success) {
        addTestResult('email_insert', 'error', `Failed to insert subscriber: ${insertResult.error}`);
      } else {
        addTestResult('email_insert', 'success', 'Email subscriber inserted successfully', insertResult.data);
      }

      // Step 3: Test email subscriber retrieval
      addTestResult('email_read', 'running', 'Testing email subscriber retrieval...');
      const readResult = await getEmailSubscriber(currentTestEmail);
      
      if (!readResult.success) {
        addTestResult('email_read', 'error', `Failed to read subscriber: ${readResult.error}`);
      } else {
        addTestResult('email_read', 'success', 'Email subscriber retrieved successfully', readResult.data);
      }

      // Step 4: Test preorder creation
      addTestResult('preorder_insert', 'running', 'Testing preorder creation...');
      const preorderData: PreOrderData = {
        email: currentTestEmail,
        stripe_session_id: `test_session_${Date.now()}`,
        company_name: 'Test Company',
        contractor_count: 5,
        current_system: 'manual',
        biggest_pain_point: 'late_payments',
        amount_paid: 29.99,
        plan_type: 'monthly',
        discount_percentage: 90,
        status: 'paid'
      };

      const preorderResult = await createPreOrder(preorderData);
      
      if (!preorderResult.success) {
        addTestResult('preorder_insert', 'error', `Failed to create preorder: ${preorderResult.error}`);
      } else {
        addTestResult('preorder_insert', 'success', 'Preorder created successfully', preorderResult.data);
      }

      // Step 5: Test analytics event tracking
      addTestResult('analytics_insert', 'running', 'Testing analytics event tracking...');
      const analyticsData: AnalyticsEventData = {
        event_name: 'supabase_test_event',
        email: currentTestEmail,
        properties: {
          test_type: 'component_test',
          timestamp: new Date().toISOString(),
          success: true
        },
        page_url: '/test-component'
      };

      const analyticsResult = await trackAnalyticsEvent(analyticsData);
      
      if (!analyticsResult.success) {
        addTestResult('analytics_insert', 'error', `Failed to track analytics: ${analyticsResult.error}`);
      } else {
        addTestResult('analytics_insert', 'success', 'Analytics event tracked successfully', analyticsResult.data);
      }

      // Step 6: Cleanup test data (if enabled)
      if (autoCleanup) {
        addTestResult('cleanup', 'running', 'Cleaning up test data...');
        const cleanupResult = await cleanupTestData(currentTestEmail);
        
        if (!cleanupResult.success) {
          addTestResult('cleanup', 'error', `Failed to cleanup test data: ${cleanupResult.error}`);
        } else {
          addTestResult('cleanup', 'success', 'Test data cleaned up successfully');
        }
      }

      // Final connection check
      await checkConnectionStatus();

    } catch (error) {
      addTestResult('error', 'error', `Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🧪 Supabase Database Connection Test
        </h2>
        
        {/* Connection Status Card */}
        <div className={`p-4 rounded-lg border-2 ${
          connectionStatus.isConnected 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <StatusIndicator status={connectionStatus.isConnected ? 'success' : 'error'} />
              <span className="font-semibold">
                {connectionStatus.isConnected ? 'Database Connected' : 'Database Disconnected'}
              </span>
            </div>
            <button
              onClick={checkConnectionStatus}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Status
            </button>
          </div>
          
          {connectionStatus.lastChecked && (
            <p className="text-sm text-gray-600 mt-2">
              Last checked: {new Date(connectionStatus.lastChecked).toLocaleString()}
            </p>
          )}
          
          {connectionStatus.error && (
            <p className="text-sm text-red-600 mt-2">
              Error: {connectionStatus.error}
            </p>
          )}
        </div>
      </div>

      {/* Test Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Test Suite Controls</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoCleanup}
                onChange={(e) => setAutoCleanup(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Auto-cleanup test data</span>
            </label>
            <button
              onClick={runSupabaseTests}
              disabled={isRunning || !connectionStatus.isConnected}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                isRunning || !connectionStatus.isConnected
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          Test email: <code className="bg-gray-200 px-1 rounded">{testEmail}</code>
        </p>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Results</h3>
          
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.status === 'success' 
                  ? 'bg-green-50 border-green-200'
                  : result.status === 'error'
                  ? 'bg-red-50 border-red-200'
                  : result.status === 'running'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start">
                <StatusIndicator status={result.status} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 capitalize">
                      {result.step.replace('_', ' ')}
                    </h4>
                    {result.timestamp && (
                      <span className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  
                  <p className={`mt-1 ${
                    result.status === 'error' ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {result.message}
                  </p>
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                        View data
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          🔧 Troubleshooting Tips
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• If connection fails, check your environment variables in .env.local</li>
          <li>• If tables don't exist, run the migration in your Supabase dashboard</li>
          <li>• Check the /api/health endpoint for detailed system status</li>
          <li>• Make sure your Supabase service role key has the correct permissions</li>
        </ul>
      </div>
    </div>
  );
} 