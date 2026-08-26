#!/usr/bin/env node
/**
 * R24 / 4c — upload generated cover images and attach them to their articles.
 *
 *   node --env-file=.env.cloud scripts/upload-cover-images.mjs ./covers           # dry run
 *   node --env-file=.env.cloud scripts/upload-cover-images.mjs ./covers --apply   # write
 *
 * Files are matched to articles by filename: `<slug>.png` (or .jpg/.jpeg/.webp).
 * Anything that does not match a published article is reported rather than guessed at.
 *
 * Why a script rather than the admin UI: there are 23 of these, each needing an upload
 * and a save. Doing it by hand is an hour of clicking, and a mis-paired cover is easy to
 * make and hard to spot afterwards.
 *
 * Alt text is not set here and needs no flag. There is no cover_alt column: all four
 * render sites already use the article title (BlogPage.tsx:239, BlogPostPage.tsx:154,
 * TutorialsPage.tsx:150, TutorialPage.tsx:208), and the prerendered document derives
 * og:image:alt the same way. Decided 2026-08-22 to leave that as it is.
 *
 * Format. This mirrors the app's own upload path exactly: covers are re-encoded to
 * JPEG at quality 0.85 with the long edge capped at 1920px, matching
 * convertFileToJpeg() in tutorial.service.ts and blog.service.ts. Covers become the
 * og:image, and Facebook, LinkedIn, X and WhatsApp do not render WebP in link previews
 * — shipping WebP is what produced blank preview cards before.
 *
 * Storage. Both kinds live in the public `content-images` bucket, under
 * `tutorial-covers/` or `blog-covers/`, and `cover_image` holds that path. The app
 * names files by timestamp; this uses the slug instead, so re-running replaces an
 * article's cover rather than accumulating orphans.
 */

import sharp from 'sharp';

import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2];
const APPLY = process.argv.includes('--apply');
const URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DIR || DIR.startsWith('--')) {
  console.error('Usage: node --env-file=.env.cloud scripts/upload-cover-images.mjs <folder> [--apply]');
  process.exit(2);
}
if (!URL || !KEY) {
  console.error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(2);
}
if (!fs.existsSync(DIR)) {
  console.error(`Folder not found: ${DIR}`);
  process.exit(2);
}

const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const MAX_BYTES = 10 * 1024 * 1024; // content-images bucket limit, 0005_storage_buckets.sql
const BUCKET = 'content-images';

const fetchRows = async (table) => {
  const res = await fetch(
    `${URL}/rest/v1/${table}?select=id,slug,title,cover_image&status=eq.PUBLISHED&limit=500`,
    { headers: H },
  );
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  return (await res.json()).map((r) => ({ ...r, table }));
};

const articles = new Map();
for (const r of [...(await fetchRows('tutorials')), ...(await fetchRows('blog_posts'))]) {
  articles.set(r.slug, r);
}

const files = fs.readdirSync(DIR).filter((f) => TYPES[path.extname(f).toLowerCase()] || /\.webp$/i.test(f));

const plan = [];
const problems = [];

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const slug = path.basename(file, path.extname(file));
  const full = path.join(DIR, file);
  const size = fs.statSync(full).size;

  if (ext === '.webp') {
    problems.push(`${file}: WebP is not usable — link previews on Facebook, LinkedIn, X and WhatsApp do not render it. Export as PNG or JPEG.`);
    continue;
  }
  const article = articles.get(slug);
  if (!article) {
    problems.push(`${file}: no published article with slug "${slug}"`);
    continue;
  }
  if (size > MAX_BYTES) {
    problems.push(`${file}: ${(size / 1024 / 1024).toFixed(1)}MB exceeds the 10MB bucket limit`);
    continue;
  }
  plan.push({ file, full, ext, slug, size, article });
}

const missing = [...articles.values()].filter(
  (a) => !a.cover_image && !plan.some((p) => p.slug === a.slug),
);

console.log(APPLY ? '\n*** APPLY MODE — uploading and updating rows ***\n' : '\nDRY RUN — nothing will be uploaded\n');
console.log(`${plan.length} image(s) matched to articles`);

for (const p of plan) {
  const replacing = p.article.cover_image ? '  (REPLACES an existing cover)' : '';
  console.log(`  ${p.slug.padEnd(40)} ${(p.size / 1024).toFixed(0).padStart(5)}KB  [${p.article.table === 'tutorials' ? 'guide' : 'post '}]${replacing}`);
}

if (problems.length) {
  console.log(`\n${problems.length} file(s) skipped:`);
  for (const s of problems) console.log(`  ${s}`);
}

if (missing.length) {
  console.log(`\n${missing.length} published article(s) still have no cover and no matching file:`);
  for (const a of missing) console.log(`  ${a.slug}`);
}

if (!plan.length) {
  console.log('\nNothing to upload.\n');
  process.exit(problems.length ? 1 : 0);
}

if (!APPLY) {
  console.log('\nDry run complete. Re-run with --apply to upload.\n');
  process.exit(0);
}

let done = 0;
const failed = [];

for (const p of plan) {
  const folder = p.article.table === 'tutorials' ? 'tutorial-covers' : 'blog-covers';
  const objectPath = `${folder}/${p.slug}.jpg`;

  try {
    // Same treatment the app applies on upload: JPEG q0.85, long edge <= 1920.
    // flatten() composites any transparency onto white — JPEG has no alpha, and
    // without this transparent pixels come out black.
    const body = await sharp(p.full)
      .flatten({ background: '#ffffff' })
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const up = await fetch(`${URL}/storage/v1/object/${BUCKET}/${objectPath}`, {
      method: 'POST',
      headers: { ...H, 'Content-Type': 'image/jpeg', 'x-upsert': 'true' },
      body,
    });
    if (!up.ok) throw new Error(`storage ${up.status}: ${(await up.text()).slice(0, 160)}`);

    const patch = await fetch(`${URL}/rest/v1/${p.article.table}?id=eq.${p.article.id}`, {
      method: 'PATCH',
      headers: { ...H, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ cover_image: objectPath }),
    });
    if (!patch.ok) throw new Error(`row ${patch.status}: ${(await patch.text()).slice(0, 160)}`);

    done++;
    console.log(`  uploaded ${p.slug}`);
  } catch (e) {
    failed.push(`${p.slug}: ${e.message}`);
    console.log(`  FAILED   ${p.slug} — ${e.message}`);
  }
}

console.log(`\n${done}/${plan.length} uploaded.`);
if (failed.length) {
  console.log('\nFailures:');
  for (const f of failed) console.log(`  ${f}`);
  process.exit(1);
}
console.log('Check a card on /blog or /how-to-use to confirm they render.\n');
