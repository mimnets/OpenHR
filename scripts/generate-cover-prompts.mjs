#!/usr/bin/env node
/**
 * R24 / 4c — regenerate the cover-image prompt sheet for articles that still have none.
 *
 *   node --env-file=.env.cloud scripts/generate-cover-prompts.mjs
 *
 * The previous sheet (Others/2026-08-21-cover-image-prompts.md) was built before two
 * things changed:
 *
 *   - the public surface moved to Daylight, so the house style it specifies is the
 *     app's indigo (#4a6fa5 on #f1f5f9). Covers appear on /blog and /how-to-use cards
 *     and in link previews, all of which are now teal on white. Generating to the old
 *     sheet produces 23 images that clash with the pages carrying them.
 *   - the guides were rewritten, so titles and excerpts have moved.
 *
 * This writes a fresh sheet covering only what is still missing a cover, in the current
 * palette, from current metadata. It generates prompts, not images — the images are made
 * externally and then uploaded with scripts/upload-cover-images.mjs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { buildCoverPrompt, SPEC_NOTE } from './lib/cover-prompts.mjs';

const URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Run with:  node --env-file=.env.cloud scripts/generate-cover-prompts.mjs');
  process.exit(2);
}

/** Slugs deliberately excluded — archived, or replaced by another guide. */
const EXCLUDE = new Set(['theme-customization']);

const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const fetchRows = async (table) => {
  const res = await fetch(
    `${URL}/rest/v1/${table}?select=slug,title,excerpt,category,cover_image&status=eq.PUBLISHED&limit=500`,
    { headers: H },
  );
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  return res.json();
};

const guides = (await fetchRows('tutorials')).filter((r) => !r.cover_image && !EXCLUDE.has(r.slug));
const posts = (await fetchRows('blog_posts')).filter((r) => !r.cover_image && !EXCLUDE.has(r.slug));

const entries = [
  ...posts.map((r) => buildCoverPrompt(r, 'post')),
  ...guides.map((r) => buildCoverPrompt(r, 'guide')),
];

const today = new Date().toISOString().slice(0, 10);
const out = [];

out.push('# OpenHRApp — Cover Image Prompts');
out.push('');
out.push(`> Regenerated ${today}. ${entries.length} articles still have no cover image`);
out.push('> — 1 blog post and ' + guides.length + ' guides.');
out.push('>');
out.push('> **The palette changed.** These prompts use the Daylight palette the public');
out.push('> pages now use (deep teal #1C6E7E on white), not the app indigo the previous');
out.push('> sheet specified. Covers sit inside Daylight cards and link previews; an indigo');
out.push('> cover on a teal page is the clash that had to be removed from the blog sidebar.');
out.push('> Do not mix sheets — regenerate rather than reusing older prompts.');
out.push('');
out.push('---');
out.push('');
out.push(SPEC_NOTE.trim());
out.push('');
out.push('---');
out.push('');

for (const e of entries) {
  out.push(`## ${e.title}`);
  out.push('');
  out.push(`- **Slug:** \`${e.slug}\``);
  out.push(`- **Kind:** ${e.kind}`);
  if (e.category) out.push(`- **Category:** ${e.category}`);
  out.push(`- **Filename to save as:** \`${e.slug}.png\``);
  // Alt text is shown for reference only. OpenHRApp has no cover_alt field — every
  // cover renders with the article title as its alt, so there is nothing to paste this
  // into. It is here for anyone reusing an image somewhere that does need it.
  if (e.alt) out.push(`- **Alt text** (reference only — the app uses the title): ${e.alt}`);
  out.push('');
  out.push('**Prompt**');
  out.push('');
  out.push('```');
  out.push(e.prompt);
  out.push('```');
  if (e.promptWatermarkSafe && e.promptWatermarkSafe !== e.prompt) {
    out.push('');
    out.push('<details><summary>Watermark-safe variant (for generators that stamp a corner)</summary>');
    out.push('');
    out.push('```');
    out.push(e.promptWatermarkSafe);
    out.push('```');
    out.push('');
    out.push('</details>');
  }
  out.push('');
  out.push('---');
  out.push('');
}

out.push('## After generating');
out.push('');
out.push('Save each image as `<slug>.png` into one folder, then upload them all at once:');
out.push('');
out.push('```');
out.push('node --env-file=.env.cloud scripts/upload-cover-images.mjs ./covers          # dry run');
out.push('node --env-file=.env.cloud scripts/upload-cover-images.mjs ./covers --apply  # write');
out.push('```');
out.push('');
out.push('The uploader matches files to articles by filename, so the slug in the filename');
out.push('has to be exact. It reports anything it cannot match rather than guessing.');
out.push('');

const file = path.join('Others', `${today}-cover-image-prompts.md`);
fs.writeFileSync(file, out.join('\n'));

console.log(`${entries.length} prompts written to ${file}`);
console.log(`  ${posts.length} post(s), ${guides.length} guide(s)`);
console.log(`  excluded: ${[...EXCLUDE].join(', ') || '(none)'}`);
