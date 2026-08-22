/**
 * Content Importer — Others/GUIDES_CONTENT.md -> public.tutorials
 *                    Others/blog-openhr-complete-guide.md -> public.blog_posts
 *
 * The guides were written as markdown in the repo but never made it into the
 * database, so they are invisible to the app, the sitemap, and search crawlers.
 * This script parses them and loads them in.
 *
 * SAFETY MODEL — this script is deliberately hard to use destructively:
 *
 *   - Dry run is the DEFAULT. Nothing is written without --apply.
 *   - Insert-only by default. A slug that already exists is SKIPPED and reported,
 *     never modified. Existing content you have edited in the admin panel is safe.
 *   - --update-existing is opt-in, and it dumps the current rows to a timestamped
 *     JSON backup before touching anything.
 *   - Nothing is ever deleted.
 *
 * Usage:
 *   node scripts/import-content.mjs                     # dry run, shows the plan
 *   node scripts/import-content.mjs --apply             # insert new slugs only
 *   node scripts/import-content.mjs --apply --update-existing
 *   node scripts/import-content.mjs --only=tutorials    # or --only=blog
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (writes bypass RLS) and VITE_SUPABASE_URL.
 */

import fs from 'fs';
import path from 'path';
import { parseGuides, parseBlogPost } from './lib/parse-content.mjs';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const UPDATE_EXISTING = args.includes('--update-existing');
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1] || 'all';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const GUIDES_PATH = path.resolve('Others', 'GUIDES_CONTENT.md');
const BLOG_PATH = path.resolve('Others', 'blog-openhr-complete-guide.md');
const BACKUP_DIR = path.resolve('Others', 'import-backups');

/**
 * Byline written to author_name. Override per-run with IMPORT_AUTHOR_NAME.
 *
 * A named person is the stronger authorship signal for Google's E-E-A-T and for
 * AdSense review. The prerender middleware emits this as a schema.org Person;
 * if it is ever set to the site's own name it emits an Organization instead —
 * see AUTHOR_IS_ORGANIZATION in middleware.ts.
 */
const DEFAULT_AUTHOR = 'Monirul Islam';

/* ------------------------------------------------------------------ */

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function headers(extra = {}) {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function rest(method, pathAndQuery, body, extraHeaders = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    method,
    headers: headers(extraHeaders),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${method} ${pathAndQuery} -> HTTP ${res.status} ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function fetchExisting(table) {
  return rest('GET', `${table}?select=id,slug,title,status&limit=1000`);
}

function backup(table, rows) {
  if (!rows.length) return null;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  // Timestamp comes from the filesystem clock at run time; this is a one-shot
  // operational script, not part of a reproducible build.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(BACKUP_DIR, `${table}-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(rows, null, 2), 'utf-8');
  return file;
}

/* ------------------------------------------------------------------ */

async function importTutorials(parsed) {
  console.log(c.bold(`\nTutorials (${parsed.length} parsed from GUIDES_CONTENT.md)`));

  const existing = await fetchExisting('tutorials');
  const bySlug = new Map(existing.map((r) => [r.slug, r]));

  const toInsert = [];
  const toUpdate = [];
  const skipped = [];

  for (const t of parsed) {
    const hit = bySlug.get(t.slug);
    if (!hit) toInsert.push(t);
    else if (UPDATE_EXISTING) toUpdate.push({ ...t, id: hit.id });
    else skipped.push({ ...t, existingStatus: hit.status });
  }

  console.log(`  ${c.green(`insert: ${toInsert.length}`)}   ${c.yellow(`update: ${toUpdate.length}`)}   ${c.dim(`skip (already exists): ${skipped.length}`)}`);

  for (const t of toInsert) console.log(`    ${c.green('+')} ${t.slug}  ${c.dim(`(${t.category}, order ${t.displayOrder})`)}`);
  for (const t of toUpdate) console.log(`    ${c.yellow('~')} ${t.slug}  ${c.dim('will overwrite existing row')}`);
  for (const t of skipped) console.log(`    ${c.dim(`= ${t.slug}  (exists as ${t.existingStatus} — left untouched)`)}`);

  if (!APPLY) return { inserted: 0, updated: 0, skipped: skipped.length };

  if (toUpdate.length) {
    const affected = existing.filter((r) => toUpdate.some((t) => t.slug === r.slug));
    const full = await rest('GET', `tutorials?select=*&slug=in.(${affected.map((a) => `"${a.slug}"`).join(',')})`);
    const file = backup('tutorials', full);
    if (file) console.log(c.dim(`  backup written: ${path.relative(process.cwd(), file)}`));
  }

  // Pass 1 — write rows without parent_id (parents are referenced by title and
  // may not exist yet).
  const rowFor = (t) => ({
    title: t.title,
    slug: t.slug,
    content: t.html,
    excerpt: t.excerpt,
    category: t.category,
    display_order: t.displayOrder,
    status: 'PUBLISHED',
    author_name: process.env.IMPORT_AUTHOR_NAME || DEFAULT_AUTHOR,
    published_at: new Date().toISOString(),
  });

  let inserted = 0;
  if (toInsert.length) {
    await rest('POST', 'tutorials', toInsert.map(rowFor), { Prefer: 'return=minimal' });
    inserted = toInsert.length;
  }

  let updated = 0;
  for (const t of toUpdate) {
    await rest('PATCH', `tutorials?id=eq.${t.id}`, rowFor(t), { Prefer: 'return=minimal' });
    updated++;
  }

  // Pass 2 — resolve parent titles to ids now that every row exists.
  const after = await rest('GET', 'tutorials?select=id,slug,title&limit=1000');
  const idByTitle = new Map(after.map((r) => [r.title, r.id]));
  const idBySlug = new Map(after.map((r) => [r.slug, r.id]));

  let linked = 0;
  const unresolved = [];
  for (const t of parsed) {
    if (!t.parentTitle) continue;
    const childId = idBySlug.get(t.slug);
    const parentId = idByTitle.get(t.parentTitle);
    if (!childId) continue;
    if (!parentId) {
      unresolved.push(`${t.slug} -> "${t.parentTitle}"`);
      continue;
    }
    await rest('PATCH', `tutorials?id=eq.${childId}`, { parent_id: parentId }, { Prefer: 'return=minimal' });
    linked++;
  }
  console.log(c.dim(`  parent links resolved: ${linked}`));
  for (const u of unresolved) console.log(c.yellow(`  ! unresolved parent: ${u}`));

  return { inserted, updated, skipped: skipped.length };
}

async function importBlog(post) {
  console.log(c.bold('\nBlog (1 parsed from blog-openhr-complete-guide.md)'));

  const existing = await fetchExisting('blog_posts');
  const hit = existing.find((r) => r.slug === post.slug);

  if (hit && !UPDATE_EXISTING) {
    console.log(`    ${c.dim(`= ${post.slug}  (exists as ${hit.status} — left untouched)`)}`);
    return { inserted: 0, updated: 0, skipped: 1 };
  }
  console.log(`    ${hit ? c.yellow('~') : c.green('+')} ${post.slug}`);

  if (!APPLY) return { inserted: 0, updated: 0, skipped: 0 };

  const row = {
    title: post.title,
    slug: post.slug,
    content: post.html,
    excerpt: post.excerpt,
    status: 'PUBLISHED',
    author_name: process.env.IMPORT_AUTHOR_NAME || DEFAULT_AUTHOR,
    published_at: new Date().toISOString(),
    reading_time: post.readingTime,
  };

  if (hit) {
    const full = await rest('GET', `blog_posts?select=*&slug=eq.${post.slug}`);
    const file = backup('blog_posts', full);
    if (file) console.log(c.dim(`  backup written: ${path.relative(process.cwd(), file)}`));
    await rest('PATCH', `blog_posts?id=eq.${hit.id}`, row, { Prefer: 'return=minimal' });
    return { inserted: 0, updated: 1, skipped: 0 };
  }

  await rest('POST', 'blog_posts', [row], { Prefer: 'return=minimal' });
  return { inserted: 1, updated: 0, skipped: 0 };
}

/* ------------------------------------------------------------------ */

async function main() {
  console.log(c.bold('OpenHR content importer'));
  console.log(APPLY ? c.yellow('  MODE: APPLY — changes will be written') : c.green('  MODE: DRY RUN — nothing will be written (pass --apply to commit)'));
  if (UPDATE_EXISTING) console.log(c.yellow('  --update-existing: existing rows WILL be overwritten (a backup is taken first)'));
  else console.log(c.dim('  existing slugs will be skipped, not modified'));

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(c.red('\nMissing env vars. Need VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'));
    console.error(c.dim('The service role key is required because inserts bypass RLS. Never commit it.'));
    process.exit(1);
  }

  const totals = { inserted: 0, updated: 0, skipped: 0 };

  if (ONLY === 'all' || ONLY === 'tutorials') {
    const guides = parseGuides(fs.readFileSync(GUIDES_PATH, 'utf-8'));
    const r = await importTutorials(guides);
    totals.inserted += r.inserted; totals.updated += r.updated; totals.skipped += r.skipped;
  }

  if (ONLY === 'all' || ONLY === 'blog') {
    const post = parseBlogPost(fs.readFileSync(BLOG_PATH, 'utf-8'));
    const r = await importBlog(post);
    totals.inserted += r.inserted; totals.updated += r.updated; totals.skipped += r.skipped;
  }

  console.log(c.bold('\nSummary'));
  console.log(`  inserted: ${totals.inserted}   updated: ${totals.updated}   skipped: ${totals.skipped}`);
  if (!APPLY) {
    console.log(c.green('\n  Dry run complete — no changes were made.'));
    console.log(c.dim('  Re-run with --apply to write these changes.'));
  } else {
    console.log(c.green('\n  Done. Next: npm run sitemap && npm run feed'));
  }
}

main().catch((err) => {
  console.error(c.red(`\nImport failed: ${err.message}`));
  process.exit(1);
});
