#!/usr/bin/env node
/**
 * R24 / 4a — convert absolute internal links in published content to root-relative.
 *
 *   node --env-file=.env.cloud scripts/relativize-internal-links.mjs            # dry run
 *   node --env-file=.env.cloud scripts/relativize-internal-links.mjs --apply    # write
 *
 * Why this exists. On 2026-08-22 the canonical host became the apex and `www` began
 * 308-redirecting to it. 351 internal links inside published articles still point at
 * `https://www.openhrapp.com/...`, so every one of them now costs a redirect hop — on
 * exactly the internal linking that was added to make the corpus crawlable. Root-relative
 * links resolve directly and are host-agnostic, so a future canonical change cannot
 * reintroduce the problem.
 *
 * Scope, deliberately narrow:
 *   - Only inside `href="..."` and `src="..."` attributes. A bare URL sitting in prose
 *     ("visit https://openhrapp.com/blog") is left alone — rewriting it to "/blog" would
 *     read as a typo to a human.
 *   - Only the two internal hosts. Anything else is untouched.
 *   - Targeted UPDATE of the `content` column, one row at a time. Never a re-import:
 *     the export files in Others/ predate remediation and would overwrite it.
 *
 * --apply writes a full backup of every original `content` value to
 * scripts/.backups/relativize-<timestamp>.json before the first UPDATE, so the change
 * can be reversed exactly.
 */

import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Run with:  node --env-file=.env.cloud scripts/relativize-internal-links.mjs');
  process.exit(2);
}

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const TABLES = ['tutorials', 'blog_posts'];

/**
 * Matches the internal host only inside an href/src attribute, capturing the path.
 * The path may be empty (a bare domain link), which becomes "/".
 */
const ATTR_RE = /(\b(?:href|src)\s*=\s*")https?:\/\/(?:www\.)?openhrapp\.com(\/[^"]*)?"/gi;

/** Any occurrence of the host at all, for the "what are we leaving behind" report. */
const ANY_RE = /https?:\/\/(?:www\.)?openhrapp\.com[^\s"'<>)]*/gi;

const rewrite = (html) => {
  let count = 0;
  const out = (html || '').replace(ATTR_RE, (_m, attr, pathPart) => {
    count++;
    return `${attr}${pathPart || '/'}"`;
  });
  return { out, count };
};

const get = async (table) => {
  const res = await fetch(
    `${URL}/rest/v1/${table}?select=id,slug,title,content&status=eq.PUBLISHED&limit=500`,
    { headers: H },
  );
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  return res.json();
};

const patch = async (table, id, content) => {
  const res = await fetch(`${URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`${table} ${id}: ${res.status} ${await res.text()}`);
};

console.log(APPLY ? '\n*** APPLY MODE — this will write to the database ***\n' : '\nDRY RUN — nothing will be written\n');

const changes = [];
const backup = [];
let leftoverTotal = 0;

for (const table of TABLES) {
  const rows = await get(table);
  for (const r of rows) {
    const before = r.content || '';
    const { out, count } = rewrite(before);
    if (!count) continue;

    // Anything still absolute after the rewrite is, by design, a bare URL in prose.
    const leftover = [...out.matchAll(ANY_RE)].map((m) => m[0]);
    leftoverTotal += leftover.length;

    changes.push({ table, id: r.id, slug: r.slug, title: r.title, count, before, after: out, leftover });
    backup.push({ table, id: r.id, slug: r.slug, content: before });
  }
}

// ── report ──────────────────────────────────────────────────────────────────
const total = changes.reduce((a, c) => a + c.count, 0);
console.log(`${changes.length} rows would change, ${total} links rewritten\n`);

for (const c of changes.sort((a, b) => b.count - a.count)) {
  console.log(`  ${String(c.count).padStart(3)}  [${c.table === 'tutorials' ? 'guide' : 'post '}] ${c.slug}`);
}

// A few real before/after pairs, so the transformation is visible rather than described.
console.log('\n── sample rewrites ─────────────────────────────────────────────');
let shown = 0;
for (const c of changes) {
  for (const m of c.before.matchAll(ATTR_RE)) {
    if (shown >= 6) break;
    const from = m[0];
    const to = `${m[1]}${m[2] || '/'}"`;
    console.log(`  ${c.slug}`);
    console.log(`    -  ${from}`);
    console.log(`    +  ${to}`);
    shown++;
  }
  if (shown >= 6) break;
}

// ── safety checks ───────────────────────────────────────────────────────────
console.log('\n── safety checks ───────────────────────────────────────────────');

let failed = 0;
const check = (ok, msg) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failed++; };

/**
 * Nothing outside a link target may move. Blank the *value* of every href/src in both
 * versions — absolute in `before`, relative in `after` — and the remaining documents must
 * be byte-identical. Comparing with ATTR_RE would be meaningless: it only matches the
 * absolute form, so it would strip from `before` and not from `after`.
 */
const ANY_ATTR = /\b(href|src)\s*=\s*"[^"]*"/gi;
const blankAttrs = (s) => s.replace(ANY_ATTR, '$1=""');
check(
  changes.every((c) => blankAttrs(c.before) === blankAttrs(c.after)),
  'every byte outside the link targets is unchanged',
);

/**
 * The size change must be exactly the sum of each individual rewrite. Computing it per
 * match rather than from a formula covers http:// as well as https://, and the
 * bare-domain case where `…openhrapp.com"` becomes `/"` — which removes the host but
 * adds a slash, so a prefix-length formula is off by one.
 */
check(
  changes.every((c) => {
    let expected = 0;
    for (const m of c.before.matchAll(ATTR_RE)) {
      const replacement = `${m[1]}${m[2] || '/'}"`;
      expected += m[0].length - replacement.length;
    }
    return c.before.length - c.after.length === expected;
  }),
  'the byte reduction equals the sum of the individual rewrites — nothing else was dropped',
);

// The set of link targets must be identical once the host is discounted.
check(
  changes.every((c) => {
    const paths = (s) =>
      [...s.matchAll(ANY_ATTR)]
        .map((m) => m[0].replace(/^\w+\s*=\s*"/, '').replace(/"$/, ''))
        .map((u) => u.replace(/^https?:\/\/(?:www\.)?openhrapp\.com/i, '') || '/');
    return JSON.stringify(paths(c.before)) === JSON.stringify(paths(c.after));
  }),
  'every link still points at the same path, in the same order',
);

// No external host may be caught.
check(
  !changes.some((c) => /(href|src)\s*=\s*"\/\//i.test(c.after)),
  'no protocol-relative or external link was turned into a path',
);

// Every produced path must start with a single slash.
const badPaths = changes.flatMap((c) =>
  [...c.after.matchAll(/\b(?:href|src)\s*=\s*"(\/[^"]*)"/gi)].map((m) => m[1]).filter((p) => p.startsWith('//')),
);
check(badPaths.length === 0, `every rewritten link is a single-slash path${badPaths.length ? ` (bad: ${badPaths.slice(0, 3)})` : ''}`);

console.log(`\n  ${leftoverTotal} absolute URL(s) deliberately left in prose (not in an href/src)`);
if (leftoverTotal) {
  const sample = changes.flatMap((c) => c.leftover.map((l) => `${c.slug}: ${l}`)).slice(0, 5);
  for (const s of sample) console.log(`    ${s}`);
}

if (failed) {
  console.log(`\n${failed} safety check(s) failed — not writing.\n`);
  process.exit(1);
}

// ── apply ───────────────────────────────────────────────────────────────────
if (!APPLY) {
  console.log('\nDry run complete. Re-run with --apply to write.\n');
  process.exit(0);
}

const dir = path.resolve('scripts/.backups');
fs.mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(dir, `relativize-${stamp}.json`);
fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
console.log(`\nBackup of ${backup.length} original rows: ${backupPath}`);

let done = 0;
for (const c of changes) {
  await patch(c.table, c.id, c.after);
  done++;
  process.stdout.write(`\r  updated ${done}/${changes.length}`);
}
console.log(`\n\nDone. ${total} links rewritten across ${changes.length} rows.`);
console.log('To revert: PATCH each row in the backup file back into its content column.\n');
