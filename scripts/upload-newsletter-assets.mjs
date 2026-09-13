#!/usr/bin/env node
/**
 * Upload a folder of images to the sp-newsletter bucket in Supabase Storage.
 *   node scripts/upload-newsletter-assets.mjs <local-folder> <bucket-prefix>
 * e.g. node scripts/upload-newsletter-assets.mjs ./tmp/issue1-assets 2026-09-issue-1
 * Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env (never prints them)
 * and prints the public URL of every uploaded file.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const [folder, prefix] = process.argv.slice(2);
if (!folder || !prefix) {
  console.error('usage: upload-newsletter-assets.mjs <local-folder> <bucket-prefix>');
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]),
);
const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env');
  process.exit(1);
}
const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
const supabase = createClient(url, key, { auth: { persistSession: false } });
const files = readdirSync(folder).filter((f) => types[extname(f).toLowerCase()] && statSync(join(folder, f)).isFile());
let failed = 0;
for (const f of files) {
  const path = `${prefix}/${basename(f)}`;
  const { error } = await supabase.storage
    .from('sp-newsletter')
    .upload(path, readFileSync(join(folder, f)), { contentType: types[extname(f).toLowerCase()], upsert: true, cacheControl: '31536000' });
  if (error) {
    failed += 1;
    console.error(`FAILED ${path}: ${error.message}`);
  } else {
    console.log(supabase.storage.from('sp-newsletter').getPublicUrl(path).data.publicUrl);
  }
}
console.log(`${files.length - failed}/${files.length} uploaded`);
process.exit(failed ? 1 : 0);
