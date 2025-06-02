#!/usr/bin/env node

/**
 * InvoicePatch Database Migration Runner
 * 
 * This script helps run the Supabase migration programmatically.
 * Run with: node supabase/run-migration.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  console.log('🚀 Starting InvoicePatch database migration...\n');

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease add these to your .env.local file and try again.\n');
    process.exit(1);
  }

  console.log('✅ Environment variables check passed');

  // Read migration file
  const migrationPath = path.join(__dirname, 'migrations', '20241201000000_initial_schema.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  console.log('✅ Migration file loaded');

  // Try to run migration via Supabase API
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('📡 Attempting to run migration...');

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      },
      body: JSON.stringify({ sql: migrationSQL })
    });

    if (response.ok) {
      console.log('✅ Migration completed successfully!');
      console.log('\n📊 Database schema created:');
      console.log('   - preorders table');
      console.log('   - email_subscribers table'); 
      console.log('   - analytics_events table');
      console.log('   - RLS policies enabled');
      console.log('   - Performance indexes added');
      console.log('   - Sample data inserted\n');
      
      console.log('🎯 Next steps:');
      console.log('   1. Test your health endpoint: curl http://localhost:3000/api/health');
      console.log('   2. Check your Supabase dashboard to see the new tables');
      console.log('   3. Start building your application!\n');
    } else {
      console.error('❌ Migration failed with HTTP status:', response.status);
      console.error('Response:', await response.text());
      console.log('\n💡 Try running the migration manually:');
      console.log('   1. Go to your Supabase dashboard');
      console.log('   2. Open SQL Editor');
      console.log('   3. Copy and paste the contents of:');
      console.log('      supabase/migrations/20241201000000_initial_schema.sql');
      console.log('   4. Click "Run" to execute\n');
    }

  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.log('\n💡 Manual migration instructions:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Select your InvoicePatch project');
    console.log('   3. Click "SQL Editor" in the sidebar');
    console.log('   4. Copy the contents of: supabase/migrations/20241201000000_initial_schema.sql');
    console.log('   5. Paste and click "Run"\n');
  }
}

// Run the migration
runMigration().catch(console.error); 