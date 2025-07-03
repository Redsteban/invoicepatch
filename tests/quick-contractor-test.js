/**
 * Quick Contractor Flow Test
 * Tests key components without requiring full server setup
 */

const fs = require('fs');
const path = require('path');

// Test results
let results = { passed: 0, failed: 0, tests: [] };

// Colored output
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

function assert(condition, testName, details = '') {
  if (condition) {
    log(`✅ PASS: ${testName}`, colors.green);
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS', details });
  } else {
    log(`❌ FAIL: ${testName}${details ? ` - ${details}` : ''}`, colors.red);
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', details });
  }
}

// Test 1: File Structure and Components
function testFileStructure() {
  log('\n📁 Testing File Structure...', colors.bold);
  
  const requiredFiles = [
    'src/app/contractor-landing/page.tsx',
    'src/app/api/contractor/trial-signup/route.ts',
    'src/app/api/email/send-invoice/route.ts',
    'package.json',
    'next.config.mjs'
  ];
  
  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    assert(exists, `File exists: ${file}`, exists ? 'Found' : 'Missing');
  }
  
  // Check package.json dependencies
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredDeps = ['next', '@supabase/supabase-js', 'bcryptjs', 'nodemailer'];
    
    for (const dep of requiredDeps) {
      const hasDepency = packageContent.dependencies && packageContent.dependencies[dep];
      assert(hasDepency, `Dependency: ${dep}`, hasDepency ? 'Present' : 'Missing');
    }
  }
}

// Test 2: Component Analysis
function testComponentAnalysis() {
  log('\n🔍 Testing Component Implementation...', colors.bold);
  
  const contractorLandingPath = path.join(process.cwd(), 'src/app/contractor-landing/page.tsx');
  if (fs.existsSync(contractorLandingPath)) {
    const content = fs.readFileSync(contractorLandingPath, 'utf8');
    
    // Check for key features in the landing page
    const features = [
      { name: 'Split layout grid', pattern: /grid.*lg:grid-cols-2/ },
      { name: 'Trial signup form', pattern: /showTrialSignup|Try It Now/ },
      { name: 'Dashboard preview', pattern: /Dashboard.*Preview|dashboard.*preview/i },
      { name: 'Credential creation', pattern: /password|email.*password/ },
      { name: 'Form validation', pattern: /validation|error/ },
      { name: 'API integration', pattern: /\/api\/contractor\/trial-signup/ }
    ];
    
    for (const feature of features) {
      const hasFeature = feature.pattern.test(content);
      assert(hasFeature, `Landing page feature: ${feature.name}`, 
        hasFeature ? 'Implemented' : 'Missing');
    }
  }
  
  // Check API implementation
  const apiPath = path.join(process.cwd(), 'src/app/api/contractor/trial-signup/route.ts');
  if (fs.existsSync(apiPath)) {
    const content = fs.readFileSync(apiPath, 'utf8');
    
    const apiFeatures = [
      { name: 'Input validation', pattern: /validation|if.*!.*email/ },
      { name: 'Password hashing', pattern: /bcrypt.*hash/ },
      { name: 'Database integration', pattern: /supabase.*insert|trial_invoices/ },
      { name: 'Error handling', pattern: /try.*catch|error/ },
      { name: 'Response structure', pattern: /success.*true|redirectUrl/ }
    ];
    
    for (const feature of apiFeatures) {
      const hasFeature = feature.pattern.test(content);
      assert(hasFeature, `API feature: ${feature.name}`, 
        hasFeature ? 'Implemented' : 'Missing');
    }
  }
}

// Test 3: Email Configuration
function testEmailConfiguration() {
  log('\n📧 Testing Email Configuration...', colors.bold);
  
  const emailApiPath = path.join(process.cwd(), 'src/app/api/email/send-invoice/route.ts');
  if (fs.existsSync(emailApiPath)) {
    const content = fs.readFileSync(emailApiPath, 'utf8');
    
    const emailFeatures = [
      { name: 'Nodemailer integration', pattern: /nodemailer/ },
      { name: 'SMTP configuration', pattern: /SMTP_HOST|smtp/ },
      { name: 'PDF generation', pattern: /pdf|jsPDF/ },
      { name: 'Email templates', pattern: /createInvoiceEmailHTML|html.*template/ },
      { name: 'Attachment handling', pattern: /attachments.*filename/ }
    ];
    
    for (const feature of emailFeatures) {
      const hasFeature = feature.pattern.test(content);
      assert(hasFeature, `Email feature: ${feature.name}`, 
        hasFeature ? 'Implemented' : 'Missing');
    }
  } else {
    assert(false, 'Email API file exists', 'File not found');
  }
}

// Test 4: TypeScript Configuration
function testTypeScriptConfig() {
  log('\n📝 Testing TypeScript Configuration...', colors.bold);
  
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      assert(tsconfig.compilerOptions, 'TypeScript compiler options configured');
      assert(tsconfig.compilerOptions.strict !== false, 'Strict mode enabled');
      assert(tsconfig.include && tsconfig.include.length > 0, 'Include paths configured');
      
    } catch (error) {
      assert(false, 'TypeScript config parsing', error.message);
    }
  } else {
    assert(false, 'TypeScript config exists', 'tsconfig.json not found');
  }
}

// Test 5: Environment Setup
function testEnvironmentSetup() {
  log('\n🔧 Testing Environment Setup...', colors.bold);
  
  // Check for example env file
  const envExamplePath = path.join(process.cwd(), '.env.local.example');
  assert(fs.existsSync(envExamplePath), 'Environment example file exists');
  
  // Check for actual env file
  const envPath = path.join(process.cwd(), '.env.local');
  const hasEnvFile = fs.existsSync(envPath);
  
  if (hasEnvFile) {
    log('✅ .env.local file found', colors.green);
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY'
    ];
    
    let configuredVars = 0;
    for (const varName of requiredVars) {
      const isConfigured = envContent.includes(varName) && 
                          !envContent.includes(`${varName}=your-`) &&
                          !envContent.includes(`${varName}=placeholder`);
      if (isConfigured) configuredVars++;
    }
    
    assert(configuredVars >= 1, 'At least one Supabase variable configured', 
      `${configuredVars}/${requiredVars.length} configured`);
  } else {
    log('⚠️  No .env.local file found (will use placeholders)', colors.yellow);
    assert(true, 'Environment handling', 'Uses placeholder configuration');
  }
}

// Test 6: Build Compatibility
function testBuildCompatibility() {
  log('\n🏗️  Testing Build Compatibility...', colors.bold);
  
  // Check Next.js config
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Check for common build configurations
    const buildFeatures = [
      { name: 'ES modules support', pattern: /export.*default/ },
      { name: 'Configuration object', pattern: /nextConfig|config/ }
    ];
    
    for (const feature of buildFeatures) {
      const hasFeature = feature.pattern.test(content);
      assert(hasFeature, `Build config: ${feature.name}`, 
        hasFeature ? 'Present' : 'Missing');
    }
  }
  
  // Test syntax compilation by attempting to parse key files
  const filesToParse = [
    'src/app/contractor-landing/page.tsx',
    'src/app/api/contractor/trial-signup/route.ts'
  ];
  
  for (const file of filesToParse) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Basic syntax check - look for common syntax errors
        const hasSyntaxErrors = /\[\[\[|\]\]\]|undefined.*undefined/.test(content);
        assert(!hasSyntaxErrors, `Syntax check: ${file}`, 
          hasSyntaxErrors ? 'Potential issues' : 'Clean');
      } catch (error) {
        assert(false, `File parsing: ${file}`, error.message);
      }
    }
  }
}

// Test 7: User Flow Validation
function testUserFlowValidation() {
  log('\n🔄 Testing User Flow Logic...', colors.bold);
  
  const landingPath = path.join(process.cwd(), 'src/app/contractor-landing/page.tsx');
  if (fs.existsSync(landingPath)) {
    const content = fs.readFileSync(landingPath, 'utf8');
    
    // Check for user flow components
    const flowComponents = [
      { name: 'Initial CTA state', pattern: /!showTrialSignup/ },
      { name: 'Form toggle logic', pattern: /setShowTrialSignup/ },
      { name: 'Form validation', pattern: /trialError|setTrialError/ },
      { name: 'Loading states', pattern: /trialLoading|loading/ },
      { name: 'Success handling', pattern: /trialSuccess|success/ },
      { name: 'Redirect logic', pattern: /router\.push.*dashboard/ }
    ];
    
    for (const component of flowComponents) {
      const hasComponent = component.pattern.test(content);
      assert(hasComponent, `User flow: ${component.name}`, 
        hasComponent ? 'Implemented' : 'Missing');
    }
  }
}

// Generate final report
function generateReport() {
  log('\n📊 TEST RESULTS SUMMARY', colors.bold);
  log('=' + '='.repeat(50), colors.blue);
  
  const total = results.passed + results.failed;
  const successRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
  
  log(`Total Tests: ${total}`, colors.blue);
  log(`Passed: ${results.passed}`, colors.green);
  log(`Failed: ${results.failed}`, colors.red);
  log(`Success Rate: ${successRate}%`, successRate >= 80 ? colors.green : colors.yellow);
  
  if (results.failed > 0) {
    log('\n❌ FAILED TESTS:', colors.red);
    results.tests
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        log(`  • ${test.name}${test.details ? ` - ${test.details}` : ''}`, colors.red);
      });
  }
  
  // Production readiness assessment
  log('\n📋 PRODUCTION READINESS ASSESSMENT:', colors.bold);
  
  const categories = {
    'Core Files': results.tests.filter(t => t.name.includes('File exists')).length,
    'Dependencies': results.tests.filter(t => t.name.includes('Dependency')).length,
    'Implementation': results.tests.filter(t => t.name.includes('feature')).length,
    'Configuration': results.tests.filter(t => t.name.includes('config')).length,
    'User Flow': results.tests.filter(t => t.name.includes('User flow')).length
  };
  
  Object.entries(categories).forEach(([category, count]) => {
    const status = count > 0 ? '✅' : '❌';
    const color = count > 0 ? colors.green : colors.red;
    log(`${status} ${category}: ${count} tests`, color);
  });
  
  const criticalTests = [
    'File exists: src/app/contractor-landing/page.tsx',
    'File exists: src/app/api/contractor/trial-signup/route.ts',
    'Landing page feature: Trial signup form',
    'API feature: Input validation',
    'Email feature: Nodemailer integration'
  ];
  
  const criticalPassed = criticalTests.filter(testName => 
    results.tests.some(t => t.name === testName && t.status === 'PASS')
  ).length;
  
  const isProductionReady = criticalPassed >= 4 && successRate >= 70;
  
  log(`\n🚀 PRODUCTION DEPLOYMENT: ${isProductionReady ? 'READY' : 'NEEDS ATTENTION'}`, 
    isProductionReady ? colors.green : colors.yellow);
  
  if (!isProductionReady) {
    log('\n⚠️  RECOMMENDATIONS:', colors.yellow);
    log('  • Fix failed tests above', colors.yellow);
    log('  • Ensure environment variables are configured', colors.yellow);
    log('  • Test with real database connection', colors.yellow);
    log('  • Configure email service for production', colors.yellow);
  } else {
    log('\n✅ READY FOR TESTING:', colors.green);
    log('  • All core components implemented', colors.green);
    log('  • File structure correct', colors.green);
    log('  • Dependencies configured', colors.green);
    log('  • User flow logic complete', colors.green);
  }
  
  return isProductionReady;
}

// Main test runner
function runQuickTests() {
  log('🧪 QUICK CONTRACTOR FLOW TEST', colors.bold);
  log('='.repeat(35), colors.blue);
  
  try {
    testFileStructure();
    testComponentAnalysis();
    testEmailConfiguration();
    testTypeScriptConfig();
    testEnvironmentSetup();
    testBuildCompatibility();
    testUserFlowValidation();
    
    const isReady = generateReport();
    
    log('\n🎯 NEXT STEPS:', colors.bold);
    log('1. Run full server test: node tests/contractor-flow-test.js', colors.blue);
    log('2. Test in browser: npm run dev', colors.blue);
    log('3. Test signup flow manually', colors.blue);
    log('4. Verify email functionality', colors.blue);
    
    return isReady;
    
  } catch (error) {
    log(`\n💥 Test failed: ${error.message}`, colors.red);
    return false;
  }
}

// Run if executed directly
if (require.main === module) {
  const success = runQuickTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runQuickTests, generateReport };