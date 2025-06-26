'use client';
import { useState } from 'react';

export default function EmailDebugger() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [testEmail, setTestEmail] = useState('');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setDebugInfo(prev => [...prev, logMessage]);
    console.log(logMessage);
  };

  const testEmailAPI = async () => {
    setDebugInfo([]);
    addLog('🔍 Starting email API debug test...');

    try {
      // Test 1: Check if API endpoint exists
      addLog('📡 Testing API endpoint availability...');
      
      const testData = {
        email: testEmail || 'test@example.com',
        invoiceData: {
          invoiceNumber: 'DEBUG-001',
          total: 1000,
          period: 'Debug Test'
        },
        consent: true
      };

      addLog(`📤 Sending request data: ${JSON.stringify(testData, null, 2)}`);

      const response = await fetch('/api/email/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      addLog(`📨 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`❌ Error response: ${errorText}`);
        
        if (response.status === 404) {
          addLog('🚨 API endpoint not found! Need to create /api/email/send-invoice');
        } else if (response.status === 400) {
          addLog('🚨 Bad request - check request format and validation');
        } else if (response.status === 500) {
          addLog('🚨 Server error - check email configuration');
        }
      } else {
        const result = await response.json();
        addLog(`✅ Success response: ${JSON.stringify(result, null, 2)}`);
      }

    } catch (error: any) {
      addLog(`💥 Network error: ${error.message}`);
      addLog('🚨 This usually means the API endpoint doesn\'t exist');
    }
  };

  const checkEnvironmentVars = () => {
    addLog('🔧 Checking environment configuration...');
    
    // These would be checked on the server side, but we can at least log what we expect
    const requiredVars = [
      'SMTP_HOST',
      'SMTP_PORT', 
      'SMTP_USER',
      'SMTP_PASS',
      'FROM_EMAIL'
    ];

    addLog('📋 Required environment variables:');
    requiredVars.forEach(varName => {
      addLog(`   - ${varName}`);
    });
    
    addLog('⚠️  Check your .env.local file has these variables set');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 Email Debug Tool</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address:
          </label>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={testEmailAPI}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            🧪 Test Email API
          </button>
          
          <button
            onClick={checkEnvironmentVars}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            🔧 Check Config
          </button>
        </div>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {debugInfo.length === 0 ? (
          <div className="text-gray-500">Click "Test Email API" to start debugging...</div>
        ) : (
          debugInfo.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))
        )}
      </div>
    </div>
  );
} 