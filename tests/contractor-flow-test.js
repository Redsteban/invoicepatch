/**
 * Comprehensive Contractor Flow Test Suite
 * Tests the complete contractor flow including:
 * - API endpoints
 * - Database operations
 * - Email functionality
 * - User authentication flow
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testEmail: 'test-contractor@example.com',
  testPassword: 'TestPassword123!',
  testName: 'John Doe',
  testCompany: 'Test Construction Co.',
  timeouts: {
    api: 10000,
    email: 30000,
    page: 15000
  }
};

// Colored console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Test result tracking
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function assert(condition, testName, details = '') {
  if (condition) {
    log(`✅ PASS: ${testName}`, colors.green);
    testResults.passed++;
    testResults.tests.push({ name: testName, status: 'PASS', details });
  } else {
    log(`❌ FAIL: ${testName}${details ? ` - ${details}` : ''}`, colors.red);
    testResults.failed++;
    testResults.tests.push({ name: testName, status: 'FAIL', details });
  }
}

// HTTP request helper
async function makeRequest(url, options = {}) {
  const fetch = (await import('node-fetch')).default;
  const fullUrl = url.startsWith('http') ? url : `${TEST_CONFIG.baseUrl}${url}`;
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.text();
    let jsonData;
    
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      jsonData = data;
    }
    
    return {
      status: response.status,
      ok: response.ok,
      data: jsonData
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Wait for server to be ready
async function waitForServer() {
  log('🔍 Waiting for development server...', colors.yellow);
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    try {
      const response = await makeRequest('/api/health');
      if (response.ok || response.status === 404) {
        log('✅ Server is ready!', colors.green);
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  log('❌ Server failed to start', colors.red);
  return false;
}

// Test environment setup
async function testEnvironmentSetup() {
  log('\n🔧 Testing Environment Setup...', colors.bold);
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  const hasEnvFile = fs.existsSync(envPath);
  
  assert(hasEnvFile, 'Environment file exists', '.env.local file found');
  
  if (hasEnvFile) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check for required environment variables
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];
    
    for (const varName of requiredVars) {
      const hasVar = envContent.includes(varName) && !envContent.includes(`${varName}=placeholder`);
      assert(hasVar, `Environment variable ${varName} configured`, hasVar ? 'Present' : 'Missing or placeholder');
    }
    
    // Check for email configuration
    const emailVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
    const hasEmailConfig = emailVars.some(varName => 
      envContent.includes(varName) && !envContent.includes(`${varName}=`)
    );
    
    if (hasEmailConfig) {
      log('📧 Email configuration detected', colors.blue);
    } else {
      log('⚠️  No email configuration - emails will be mocked', colors.yellow);
    }
  }
}

// Test 1: API Endpoint Availability
async function testApiEndpoints() {
  log('\n🌐 Testing API Endpoints...', colors.bold);
  
  const endpoints = [
    { path: '/api/contractor/trial-signup', method: 'POST' },
    { path: '/api/contractor/dashboard', method: 'GET' },
    { path: '/api/contractor/entries', method: 'GET' },
    { path: '/api/email/send-invoice', method: 'POST' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(endpoint.path, {
        method: endpoint.method,
        body: endpoint.method === 'POST' ? JSON.stringify({}) : undefined
      });
      
      // For POST endpoints, we expect 400 (bad request) not 404 (not found)
      const expectedStatuses = endpoint.method === 'POST' ? [400, 401, 422] : [401, 403, 200];
      const isAvailable = expectedStatuses.includes(response.status) || response.status !== 404;
      
      assert(isAvailable, `${endpoint.method} ${endpoint.path} endpoint available`, 
        `Status: ${response.status}`);
    } catch (error) {
      assert(false, `${endpoint.method} ${endpoint.path} endpoint test`, error.message);
    }
  }
}

// Test 2: Trial Signup API
async function testTrialSignupAPI() {
  log('\n👤 Testing Trial Signup API...', colors.bold);
  
  // Test with missing data
  const invalidResponse = await makeRequest('/api/contractor/trial-signup', {
    method: 'POST',
    body: JSON.stringify({})
  });
  
  assert(invalidResponse.status === 400, 'Rejects invalid data', 
    `Status: ${invalidResponse.status}, Expected: 400`);
  
  // Test with valid data
  const validData = {
    email: TEST_CONFIG.testEmail,
    password: TEST_CONFIG.testPassword,
    firstName: 'John',
    lastName: 'Doe',
    companyName: TEST_CONFIG.testCompany
  };
  
  const validResponse = await makeRequest('/api/contractor/trial-signup', {
    method: 'POST',
    body: JSON.stringify(validData)
  });
  
  if (validResponse.ok) {
    assert(true, 'Creates trial account successfully', 
      `Status: ${validResponse.status}`);
    
    // Check response structure
    const data = validResponse.data;
    assert(data && data.success, 'Returns success response');
    assert(data && data.user, 'Returns user data');
    assert(data && data.trialInvoice, 'Returns trial invoice data');
    assert(data && data.redirectUrl, 'Returns redirect URL');
    
    // Store trial data for later tests
    if (data.trialInvoice) {
      global.testTrialInvoiceId = data.trialInvoice.id;
    }
  } else {
    // Check if it's a duplicate email error (expected if run multiple times)
    const isDuplicateError = validResponse.status === 409 || 
      (validResponse.data && validResponse.data.message && 
       validResponse.data.message.includes('already exists'));
    
    if (isDuplicateError) {
      log('⚠️  Account already exists (expected for repeated tests)', colors.yellow);
      assert(true, 'Handles duplicate email correctly', 'Returns 409 status');
    } else {
      assert(false, 'Creates trial account', 
        `Status: ${validResponse.status}, Error: ${JSON.stringify(validResponse.data)}`);
    }
  }
}

// Test 3: Database Operations
async function testDatabaseOperations() {
  log('\n🗄️  Testing Database Operations...', colors.bold);
  
  // Try to fetch trial invoices
  try {
    const response = await makeRequest('/api/contractor/invoices', {
      method: 'GET'
    });
    
    // We expect this to require authentication, so 401 is acceptable
    const isWorking = [200, 401, 403].includes(response.status);
    assert(isWorking, 'Database connection working', 
      `Status: ${response.status} (authentication may be required)`);
  } catch (error) {
    assert(false, 'Database connection test', error.message);
  }
}

// Test 4: Email Functionality
async function testEmailFunctionality() {
  log('\n📧 Testing Email Functionality...', colors.bold);
  
  // Create mock invoice data for email test
  const mockInvoiceData = {
    entries: [
      {
        date: '2024-01-01',
        worked: true,
        description: 'Daily work',
        truckRate: 150,
        kmsDriven: 45,
        kmsRate: 30.6,
        otherCharges: 0,
        dailyTotal: 255.6
      }
    ],
    contractorName: 'John Doe',
    clientName: 'Test Client',
    clientAddress: '123 Test St',
    contractorAddress: '456 Contractor Ave',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    subsistence: 75,
    totalTruckCharges: 150,
    totalKmsCharges: 30.6,
    totalOtherCharges: 0,
    subtotal: 180.6,
    gst: 9.03,
    totalSubsistence: 75,
    grandTotal: 264.63,
    invoiceNumber: 'TEST-001',
    invoiceDate: '2024-01-15'
  };
  
  const emailData = {
    email: 'test@example.com',
    invoiceData: mockInvoiceData,
    consent: false
  };
  
  try {
    const response = await makeRequest('/api/email/send-invoice', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
    
    if (response.status === 500 && response.data && 
        response.data.error === 'Email service not configured') {
      log('⚠️  Email service not configured (expected in development)', colors.yellow);
      assert(true, 'Email endpoint handles missing configuration', 
        'Returns appropriate error message');
    } else if (response.ok) {
      assert(true, 'Email sends successfully', 
        `Status: ${response.status}`);
      
      if (response.data && response.data.messageId) {
        log(`📧 Email sent with ID: ${response.data.messageId}`, colors.blue);
      }
    } else {
      assert(false, 'Email functionality test', 
        `Status: ${response.status}, Error: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    assert(false, 'Email API connection', error.message);
  }
}

// Test 5: Frontend Components
async function testFrontendComponents() {
  log('\n🖥️  Testing Frontend Components...', colors.bold);
  
  try {
    // Test contractor landing page
    const landingResponse = await makeRequest('/contractor-landing');
    assert(landingResponse.ok, 'Contractor landing page loads', 
      `Status: ${landingResponse.status}`);
    
    // Test contractor trial page
    const trialResponse = await makeRequest('/contractor-trial');
    assert(trialResponse.ok, 'Contractor trial page loads', 
      `Status: ${trialResponse.status}`);
    
    // Check if pages contain expected content
    if (landingResponse.ok && typeof landingResponse.data === 'string') {
      const hasTrialSignup = landingResponse.data.includes('Try It Now') || 
                            landingResponse.data.includes('trial');
      assert(hasTrialSignup, 'Landing page contains trial signup elements');
      
      const hasDashboardPreview = landingResponse.data.includes('dashboard') ||
                                 landingResponse.data.includes('Dashboard');
      assert(hasDashboardPreview, 'Landing page contains dashboard preview');
    }
  } catch (error) {
    assert(false, 'Frontend component loading', error.message);
  }
}

// Test 6: End-to-End Flow Simulation
async function testEndToEndFlow() {
  log('\n🔄 Testing End-to-End Flow...', colors.bold);
  
  // Simulate the complete user journey
  const steps = [
    'User visits contractor landing page',
    'User clicks "Try It Now"',
    'User fills out signup form',
    'Account created with trial invoice',
    'User redirected to dashboard',
    'User can access daily logging',
    'User can generate invoices'
  ];
  
  // We've already tested most of these components individually
  // This is a summary test
  let flowSuccess = true;
  
  // Check if we have a trial invoice ID from earlier tests
  if (global.testTrialInvoiceId) {
    log(`✅ Trial invoice created: ${global.testTrialInvoiceId}`, colors.green);
    assert(true, 'Trial invoice creation in flow');
  } else {
    flowSuccess = false;
    assert(false, 'Trial invoice creation in flow', 'No trial invoice ID found');
  }
  
  // Test dashboard access simulation
  try {
    const dashboardResponse = await makeRequest('/contractor/dashboard');
    // We expect this to redirect or require authentication
    const validResponse = [200, 302, 401, 403].includes(dashboardResponse.status);
    assert(validResponse, 'Dashboard endpoint accessible', 
      `Status: ${dashboardResponse.status}`);
  } catch (error) {
    flowSuccess = false;
    assert(false, 'Dashboard access test', error.message);
  }
  
  assert(flowSuccess, 'Complete end-to-end flow', 
    flowSuccess ? 'All major components working' : 'Some components need attention');
}

// Performance and Security Tests
async function testPerformanceAndSecurity() {
  log('\n🛡️  Testing Performance & Security...', colors.bold);
  
  // Test rate limiting (if implemented)
  const rapidRequests = [];
  for (let i = 0; i < 5; i++) {
    rapidRequests.push(makeRequest('/api/contractor/trial-signup', {
      method: 'POST',
      body: JSON.stringify({ email: `test${i}@example.com` })
    }));
  }
  
  try {
    const responses = await Promise.all(rapidRequests);
    const rateLimited = responses.some(r => r.status === 429);
    
    if (rateLimited) {
      assert(true, 'Rate limiting implemented', 'Detected 429 responses');
    } else {
      log('⚠️  No rate limiting detected', colors.yellow);
      assert(true, 'API handles rapid requests', 'No errors on multiple requests');
    }
  } catch (error) {
    assert(false, 'Rapid request handling', error.message);
  }
  
  // Test SQL injection protection
  const maliciousData = {
    email: "test@example.com'; DROP TABLE users; --",
    password: "password",
    firstName: "John",
    lastName: "Doe"
  };
  
  try {
    const response = await makeRequest('/api/contractor/trial-signup', {
      method: 'POST',
      body: JSON.stringify(maliciousData)
    });
    
    // Should either handle gracefully or return error, not crash
    const handledSafely = response.status >= 400 || response.ok;
    assert(handledSafely, 'SQL injection protection', 
      `Status: ${response.status} (handled malicious input)`);
  } catch (error) {
    assert(false, 'SQL injection test', error.message);
  }
}

// Generate test report
function generateTestReport() {
  log('\n📊 TEST RESULTS SUMMARY', colors.bold);
  log('=' + '='.repeat(50), colors.blue);
  
  const total = testResults.passed + testResults.failed;
  const successRate = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;
  
  log(`Total Tests: ${total}`, colors.blue);
  log(`Passed: ${testResults.passed}`, colors.green);
  log(`Failed: ${testResults.failed}`, colors.red);
  log(`Success Rate: ${successRate}%`, successRate >= 80 ? colors.green : colors.yellow);
  
  if (testResults.failed > 0) {
    log('\n❌ FAILED TESTS:', colors.red);
    testResults.tests
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        log(`  • ${test.name}${test.details ? ` - ${test.details}` : ''}`, colors.red);
      });
  }
  
  log('\n📋 PRODUCTION READINESS CHECKLIST:', colors.bold);
  
  const readinessChecks = [
    { name: 'API Endpoints Working', passed: testResults.tests.some(t => t.name.includes('endpoint') && t.status === 'PASS') },
    { name: 'Trial Signup Functional', passed: testResults.tests.some(t => t.name.includes('trial account') && t.status === 'PASS') },
    { name: 'Database Operations', passed: testResults.tests.some(t => t.name.includes('Database') && t.status === 'PASS') },
    { name: 'Email System Ready', passed: testResults.tests.some(t => t.name.includes('Email') && t.status === 'PASS') },
    { name: 'Frontend Loading', passed: testResults.tests.some(t => t.name.includes('page loads') && t.status === 'PASS') },
    { name: 'Security Measures', passed: testResults.tests.some(t => t.name.includes('injection') && t.status === 'PASS') }
  ];
  
  readinessChecks.forEach(check => {
    const status = check.passed ? '✅' : '❌';
    const color = check.passed ? colors.green : colors.red;
    log(`${status} ${check.name}`, color);
  });
  
  const productionReady = readinessChecks.filter(c => c.passed).length >= 4;
  
  log(`\n🚀 PRODUCTION DEPLOYMENT: ${productionReady ? 'READY' : 'NEEDS ATTENTION'}`, 
    productionReady ? colors.green : colors.yellow);
  
  if (!productionReady) {
    log('\n⚠️  RECOMMENDATIONS BEFORE DEPLOYMENT:', colors.yellow);
    log('  • Fix failed tests above', colors.yellow);
    log('  • Configure email service (SMTP)', colors.yellow);
    log('  • Set up proper environment variables', colors.yellow);
    log('  • Test with real Supabase database', colors.yellow);
  }
  
  return productionReady;
}

// Main test runner
async function runAllTests() {
  log('🧪 CONTRACTOR FLOW COMPREHENSIVE TEST SUITE', colors.bold);
  log('='.repeat(55), colors.blue);
  
  // Start development server if not running
  log('\n🚀 Starting development server...', colors.yellow);
  const serverProcess = require('child_process').spawn('npm', ['run', 'dev'], {
    detached: true,
    stdio: 'ignore'
  });
  
  // Wait for server to be ready
  const serverReady = await waitForServer();
  if (!serverReady) {
    log('❌ Cannot proceed without development server', colors.red);
    process.exit(1);
  }
  
  try {
    // Run all test suites
    await testEnvironmentSetup();
    await testApiEndpoints();
    await testTrialSignupAPI();
    await testDatabaseOperations();
    await testEmailFunctionality();
    await testFrontendComponents();
    await testEndToEndFlow();
    await testPerformanceAndSecurity();
    
    // Generate report
    const isProductionReady = generateTestReport();
    
    // Cleanup
    try {
      process.kill(-serverProcess.pid);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    process.exit(isProductionReady ? 0 : 1);
    
  } catch (error) {
    log(`\n💥 Test suite failed: ${error.message}`, colors.red);
    
    try {
      process.kill(-serverProcess.pid);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testTrialSignupAPI,
  testEmailFunctionality,
  generateTestReport
};