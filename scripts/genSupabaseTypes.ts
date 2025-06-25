import { execSync } from 'child_process';
import { writeFileSync, appendFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.resolve(__dirname, '../src/types/supabase.ts');

function runSupabaseGenTypes(): string {
  try {
    return execSync('supabase gen types typescript --schema public', { encoding: 'utf-8' });
  } catch (err) {
    console.error('Error running supabase gen types:', err);
    process.exit(1);
  }
}

function extractTableJsonFromTypes(types: string): any[] {
  // This is a placeholder. In a real implementation, you would parse the types or use the database schema directly.
  // For now, we assume the user will manually update this if needed.
  return [];
}

function main() {
  // 1. Generate Supabase types
  const types = runSupabaseGenTypes();

  // 2. Write types to file (overwrite)
  writeFileSync(OUT_PATH, types, 'utf-8');
  console.log(`Wrote Supabase types to ${OUT_PATH}`);

  // 3. Generate Zod schemas (placeholder: user must update with real table info)
  // In a real implementation, you would introspect the DB or parse the types to get table info.
  const tables = extractTableJsonFromTypes(types); // [] for now
  if (tables.length > 0) {
    appendFileSync(OUT_PATH, '\n// TODO: Add Zod schemas for tables using zod-to-ts.\n', 'utf-8');
    console.log('No tables found for Zod schema generation.');
  } else {
    appendFileSync(OUT_PATH, '\n// TODO: Add Zod schemas for tables using zod-to-ts.\n', 'utf-8');
    console.log('No tables found for Zod schema generation.');
  }
}

main(); 