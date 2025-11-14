#!/usr/bin/env node

// Simple script to query Supabase tables from terminal
// Usage: node query-db.js [table_name]

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tableName = process.argv[2];

const availableTables = [
  'menu_items',
  'orders',
  'order_items',
  'reservations',
  'testimonials',
  'restaurant_history'
];

async function queryTable(table) {
  console.log(`\n📊 Fetching data from "${table}" table...\n`);

  const { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact' })
    .limit(100);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Found ${count} record(s)\n`);

  if (data && data.length > 0) {
    console.table(data);
  } else {
    console.log('(empty table)');
  }
}

async function showAllTables() {
  console.log('\n📚 Available tables:\n');

  for (const table of availableTables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`  - ${table.padEnd(25)} (${count} records)`);
    }
  }

  console.log('\n💡 Usage: node query-db.js [table_name]');
  console.log('   Example: node query-db.js menu_items\n');
}

// Main
if (!tableName) {
  await showAllTables();
} else if (availableTables.includes(tableName)) {
  await queryTable(tableName);
} else {
  console.error(`❌ Unknown table: "${tableName}"`);
  console.log('\n📚 Available tables:', availableTables.join(', '));
}
