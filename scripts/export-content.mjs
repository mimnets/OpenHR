/**
 * Content Exporter — public.tutorials  -> Others/<date>-guides-content-export.md
 *                    public.blog_posts -> Others/<date>-blog-content-export.md
 *
 * The inverse of scripts/import-content.mjs. It pulls what is actually live in
 * the database back out as clean markdown, in the same shape as the hand-written
 * Others/GUIDES_CONTENT.md, so the content can be edited as text — adding cover
 * images, internal links, and SEO/AEO polish — and republished.
 *
 * WHY: much of the live content was pasted in from GitHub's rendered markdown
 * view and carries its presentation layer (thousands of inline `style`
 * attributes hardcoding rgb(31,35,40), <span> wrappers, <font> tags, inline
 * <svg> anchor icons). That renders badly — near-black text in dark mode — and
 * is not editable. scripts/lib/html-to-markdown.mjs strips all of it back to
 * semantics; this script frames the result with each record's metadata.
 *
 * READ-ONLY. This script never writes to the database.
 *
 * Usage:
 *   node --env-file=.env.cloud scripts/export-content.mjs
 *   node --env-file=.env.cloud scripts/export-content.mjs --only=blog
 *   node --env-file=.env.cloud scripts/export-content.mjs --out=Others
 *   node --env-file=.env.cloud scripts/export-content.mjs --date=2026-08-21
 *
 * A third file, <date>-cover-image-prompts.md, is written alongside them with an
 * image generation prompt for every record that has no cover_image.
 *
 * Requires VITE_SUPABASE_URL. Uses SUPABASE_SERVICE_ROLE_KEY when present so
 * that drafts are included; otherwise falls back to VITE_SUPABASE_ANON_KEY and
 * exports only what an anonymous visitor can read.
 */

import fs from 'fs';
import path from 'path';
import { htmlToMarkdown } from './lib/html-to-markdown.mjs';
import { buildCoverPrompt, SPEC_NOTE } from './lib/cover-prompts.mjs';

const args = process.argv.slice(2);
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1] || 'all';
const OUT_DIR = (args.find((a) => a.startsWith('--out=')) || '').split('=')[1] || 'Others';

/**
 * Every export is stamped with the date it was taken and written to a new file,
 * so successive exports sit side by side in date order rather than overwriting
 * each other. That makes it possible to see what the content looked like before
 * an editing pass. Override with --date=YYYY-MM-DD to redo an earlier stamp.
 */
const DATE = (() => {
  const flag = (args.find((a) => a.startsWith('--date=')) || '').split('=')[1];
  if (flag) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(flag)) {
      console.error(`Invalid --date=${flag} — expected YYYY-MM-DD.`);
      process.exit(1);
    }
    return flag;
  }
  return new Date().toISOString().slice(0, 10);
})();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const KEY = SERVICE_KEY || ANON_KEY;

if (!SUPABASE_URL || !KEY) {
  console.error('Missing required env vars: VITE_SUPABASE_URL and one of SUPABASE_SERVICE_ROLE_KEY / VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const SITE = 'https://openhrapp.com';

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/* ------------------------------------------------------------------ fetch */

async function fetchAll(table, select) {
  const rows = [];
  const pageSize = 200;

  for (let from = 0; ; from += pageSize) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&order=created.asc`;
    const res = await fetch(url, {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        Range: `${from}-${from + pageSize - 1}`,
      },
    });
    if (!res.ok) {
      // Fail loudly. The generators used to swallow this and emit empty files,
      // which is exactly the bug that left the sitemap with no articles.
      throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`);
    }
    const page = await res.json();
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

/* ------------------------------------------------------------------ audit */

const LINK_RE = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

/** Hosts that are this site, however the author happened to write them. */
const OWN_HOST_RE = /^https?:\/\/(?:www\.)?openhrapp\.com(?=\/|$)/i;

/**
 * Internal links are counted whether written relative (/how-to-use/x) or
 * absolute (https://www.openhrapp.com/how-to-use/x) — both point at this site.
 *
 * The absolute form is worth flagging separately though: the apex 307-redirects
 * to www, so an absolute apex link costs a redirect hop, and in the SPA an
 * absolute URL triggers a full page reload instead of client-side routing.
 */
function classifyLinks(md) {
  const internal = [];
  const external = [];
  const absoluteInternal = [];

  for (const m of md.matchAll(LINK_RE)) {
    const href = m[1];
    if (/^(mailto:|tel:|#)/i.test(href)) continue;

    if (OWN_HOST_RE.test(href)) {
      internal.push(href);
      absoluteInternal.push(href);
    } else if (/^https?:\/\//i.test(href)) {
      external.push(href);
    } else if (href.startsWith('/')) {
      internal.push(href);
    }
  }
  return { internal, external, absoluteInternal };
}

/**
 * Signals that matter for search ranking and for answer engines (AEO).
 *
 * Answer engines extract self-contained passages, so what counts is whether the
 * body actually poses and answers questions under scannable headings — not just
 * length. A page with no headings is one undifferentiated block and rarely gets
 * quoted.
 */
function audit(md, row) {
  const words = md.split(/\s+/).filter(Boolean).length;
  const { internal, external, absoluteInternal } = classifyLinks(md);
  const headings = [...md.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((m) => m[2].trim());
  const questionHeadings = headings.filter((h) => /\?$/.test(h) || /^(how|what|why|when|where|who|can|does|do|is|are|should)\b/i.test(h));

  const flags = [];
  if (!row.cover_image) flags.push('no cover image');
  if (!row.excerpt || row.excerpt.trim().length < 50) flags.push('excerpt missing or thin');
  if (internal.length === 0) flags.push('no internal links');
  else if (internal.length < 3) flags.push(`only ${internal.length} internal link${internal.length === 1 ? '' : 's'}`);
  if (headings.length === 0) flags.push('no headings');
  if (questionHeadings.length === 0 && headings.length > 0) flags.push('no question-style headings (AEO)');
  if (words < 300) flags.push(`thin content (${words} words)`);
  if ((row.title || '').length > 60) flags.push(`title ${row.title.length} chars (>60 truncates in SERP)`);
  if (absoluteInternal.length) {
    flags.push(`${absoluteInternal.length} internal link(s) written as absolute URLs — make them relative`);
  }

  return { words, internal, external, absoluteInternal, headings, questionHeadings, flags };
}

/* --------------------------------------------------------------- emitting */

const esc = (s) => String(s ?? '').replace(/\r/g, '').trim();
const fmtDate = (d) => (d ? String(d).slice(0, 10) : '—');

function metaLine(label, value) {
  return `**${label}:** ${value}`;
}

function renderRecord({ heading, meta, body, audited }) {
  const lines = [heading, ''];
  lines.push(...meta.map(([k, v]) => metaLine(k, v)));

  const flagText = audited.flags.length
    ? audited.flags.join('; ')
    : 'none — has cover image, excerpt, internal links, and scannable headings';
  lines.push(metaLine('SEO/AEO to fix', flagText));
  lines.push(
    metaLine(
      'Stats',
      `${audited.words} words · ${audited.internal.length} internal link(s) · ${audited.external.length} external · ${audited.headings.length} heading(s)`,
    ),
  );

  lines.push('', '---', '', '**Content:**', '', body, '', '---', '');
  return lines.join('\n');
}

function summaryTable(items) {
  const rows = items.filter((i) => i.audited.flags.length);
  if (!rows.length) return '> Every record passes the checks below. Nothing outstanding.\n';

  const out = [
    '| # | Slug | Words | Internal links | Cover | Needs work |',
    '|---|------|-------|----------------|-------|------------|',
  ];
  for (const i of rows) {
    out.push(
      `| ${i.index} | \`${i.slug}\` | ${i.audited.words} | ${i.audited.internal.length} | ${i.cover ? 'yes' : '**no**'} | ${i.audited.flags.join('; ')} |`,
    );
  }
  return out.join('\n') + '\n';
}

const HEADER_NOTE = (kind, count, generatedFrom) => `> Exported from the live database (${generatedFrom}) — ${count} ${kind}.
> This file is the editing surface: revise here, add cover images and internal
> links, then republish. It is regenerated by \`node --env-file=.env.cloud scripts/export-content.mjs\`,
> so save your edits elsewhere before re-running, or the re-run will overwrite them.
>
> **Internal links** use \`/how-to-use/{slug}\` for guides, \`/blog/{slug}\` for posts,
> and \`/features/{feature}\` for feature pages. All three are clickable in-app.
>
> **Cover Image** is the \`cover_image\` column. Records marked \`— MISSING —\` render
> the site default in social previews, which is why shared links look generic.
>
> The **SEO/AEO to fix** line on each record is generated, not authored — it lists
> what that record is missing, and disappears once addressed.`;

/* ------------------------------------------------------------- guides file */

function buildGuides(rows) {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const sorted = [...rows].sort((a, b) => {
    const cat = (a.category || '').localeCompare(b.category || '');
    if (cat !== 0) return cat;
    return (a.display_order ?? 999) - (b.display_order ?? 999);
  });

  const items = [];
  const parts = [
    '# OpenHR Guides — Live Content Export',
    '',
    HEADER_NOTE('guides', rows.length, 'public.tutorials'),
    '',
    '---',
    '',
    '## Needs Work',
    '',
  ];

  let currentCategory = null;
  const bodyParts = [];
  let n = 0;

  for (const row of sorted) {
    n += 1;
    if (row.category !== currentCategory) {
      currentCategory = row.category;
      bodyParts.push('', `## Category: ${currentCategory || 'Uncategorised'}`, '', '---', '');
    }

    // parse-content.mjs splits records on h1-h3, so a body heading at those
    // levels would swallow the next record on re-import. Force everything to h4+.
    const md = htmlToMarkdown(row.content || '', { minHeadingLevel: 4 });
    const audited = audit(md, row);
    const parent = row.parent_id ? byId.get(row.parent_id) : null;

    items.push({ index: n, slug: row.slug, cover: row.cover_image, audited });

    bodyParts.push(
      renderRecord({
        heading: `### Tutorial ${n}: ${esc(row.title)}`,
        meta: [
          ['Slug', `\`${esc(row.slug)}\``],
          ['Category', esc(row.category) || '—'],
          ['Display Order', row.display_order ?? '—'],
          ['Parent', parent ? `${esc(parent.title)} (\`${parent.slug}\`)` : 'None (Top-level)'],
          ['Status', esc(row.status)],
          ['Published', fmtDate(row.published_at)],
          ['Author', esc(row.author_name) || '—'],
          ['Cover Image', row.cover_image ? `\`${row.cover_image}\`` : '`— MISSING —`'],
          ['URL', `${SITE}/how-to-use/${esc(row.slug)}`],
          ['Excerpt', esc(row.excerpt) || '`— MISSING —`'],
        ],
        body: md || '_(empty)_',
        audited,
      }),
    );
  }

  parts.push(summaryTable(items), '', bodyParts.join('\n'));
  return { text: parts.join('\n'), items };
}

/* --------------------------------------------------------------- blog file */

function buildBlog(rows) {
  const sorted = [...rows].sort((a, b) => String(b.published_at || b.created).localeCompare(String(a.published_at || a.created)));

  const items = [];
  const parts = [
    '# OpenHRApp Blog — Live Content Export',
    '',
    HEADER_NOTE('posts', rows.length, 'public.blog_posts'),
    '',
    '> Posts are ordered newest first.',
    '',
    '---',
    '',
    '## Needs Work',
    '',
  ];

  const bodyParts = [];
  let n = 0;

  for (const row of sorted) {
    n += 1;
    const md = htmlToMarkdown(row.content || '', { minHeadingLevel: 4 });
    const audited = audit(md, row);
    items.push({ index: n, slug: row.slug, cover: row.cover_image, audited });

    bodyParts.push(
      renderRecord({
        heading: `### Post ${n}: ${esc(row.title)}`,
        meta: [
          ['Slug', `\`${esc(row.slug)}\``],
          ['Category', esc(row.category) || '—'],
          ['Status', esc(row.status)],
          ['Published', fmtDate(row.published_at)],
          ['Author', esc(row.author_name) || '—'],
          ['Reading Time', row.reading_time ? `${row.reading_time} min` : '—'],
          ['Cover Image', row.cover_image ? `\`${row.cover_image}\`` : '`— MISSING —`'],
          ['URL', `${SITE}/blog/${esc(row.slug)}`],
          ['Excerpt', esc(row.excerpt) || '`— MISSING —`'],
        ],
        body: md || '_(empty)_',
        audited,
      }),
    );
  }

  parts.push(summaryTable(items), '', bodyParts.join('\n'));
  return { text: parts.join('\n'), items };
}

/* ------------------------------------------------------------------- main */

function report(label, items) {
  const flagged = items.filter((i) => i.audited.flags.length).length;
  const noCover = items.filter((i) => !i.cover).length;
  const noLinks = items.filter((i) => i.audited.internal.length === 0).length;
  const words = items.reduce((s, i) => s + i.audited.words, 0);

  console.log(c.bold(`\n${label}`));
  console.log(`  records: ${items.length}   words: ${words.toLocaleString()}`);
  console.log(
    `  ${flagged ? c.yellow(`needs work: ${flagged}`) : c.green('needs work: 0')}` +
      `   ${noCover ? c.red(`no cover image: ${noCover}`) : c.green('no cover image: 0')}` +
      `   ${noLinks ? c.red(`no internal links: ${noLinks}`) : c.green('no internal links: 0')}`,
  );
}


/* ------------------------------------------------- cover image prompt file */

function buildCoverPrompts(guideRows, blogRows) {
  const entries = [
    ...blogRows.map((r) => buildCoverPrompt(r, 'post')),
    ...guideRows.map((r) => buildCoverPrompt(r, 'guide')),
  ];
  const missing = entries.filter((e) => !e.hasCover);
  const have = entries.filter((e) => e.hasCover);

  const parts = [
    '# OpenHRApp — Cover Image Prompts',
    '',
    `> Generated from the live database. ${missing.length} of ${entries.length} articles have no cover image.`,
    '> Every shared link to those falls back to the site default, which is why they look generic.',
    '>',
    '> Prompts are built from each article title, category, and excerpt against one shared house',
    '> style, so the finished covers read as a single set rather than 47 unrelated pictures.',
    '',
    '---',
    '',
    SPEC_NOTE,
    '',
    '---',
    '',
    `## Needs a cover (${missing.length})`,
    '',
  ];

  let n = 0;
  for (const e of missing) {
    n += 1;
    parts.push(
      `### ${n}. ${e.title}`,
      '',
      `**Slug:** \`${e.slug}\`  |  **Type:** ${e.kind}  |  **Category:** ${e.category}`,
      `**Save as:** \`${e.filename}\``,
      `**Alt text:** ${e.alt}`,
      '',
      '**Prompt:**',
      '',
      '```text',
      e.prompt,
      '```',
      '',
      '**Negative prompt:**',
      '',
      '```text',
      e.negative,
      '```',
      '',
      '---',
      '',
    );
  }

  if (have.length) {
    parts.push('', `## Already has a cover (${have.length})`, '', '| Slug | Type | Current cover |', '|---|---|---|');
    for (const e of have) parts.push(`| \`${e.slug}\` | ${e.kind} | ${e.existingCover} |`);
    parts.push('');
  }

  return { text: parts.join('\n'), missing: missing.length, total: entries.length };
}

async function main() {
  console.log(c.bold('OpenHR content exporter'));
  console.log(c.dim(`  source: ${SUPABASE_URL}  (${SERVICE_KEY ? 'service role — includes drafts' : 'anon key — published only'})`));
  console.log(c.dim('  READ-ONLY — the database is never written to.'));

  fs.mkdirSync(path.resolve(OUT_DIR), { recursive: true });

  let guideRows = [];
  let blogRows = [];

  if (ONLY === 'all' || ONLY === 'tutorials' || ONLY === 'guides') {
    guideRows = await fetchAll('tutorials', '*');
    const { text, items } = buildGuides(guideRows);
    const out = path.resolve(OUT_DIR, `${DATE}-guides-content-export.md`);
    fs.writeFileSync(out, text, 'utf8');
    report(`Guides -> ${path.relative(process.cwd(), out)}`, items);
  }

  if (ONLY === 'all' || ONLY === 'blog') {
    blogRows = await fetchAll('blog_posts', '*');
    const { text, items } = buildBlog(blogRows);
    const out = path.resolve(OUT_DIR, `${DATE}-blog-content-export.md`);
    fs.writeFileSync(out, text, 'utf8');
    report(`Blog -> ${path.relative(process.cwd(), out)}`, items);
  }

  // Only on a full run. A partial run knows about half the corpus, and writing
  // it to the same filename would silently replace a complete prompt file with
  // one covering just guides or just posts.
  if (ONLY === 'all') {
    const prompts = buildCoverPrompts(guideRows, blogRows);
    const promptOut = path.resolve(OUT_DIR, `${DATE}-cover-image-prompts.md`);
    fs.writeFileSync(promptOut, prompts.text, 'utf8');
    console.log(c.bold(`\nCover prompts -> ${path.relative(process.cwd(), promptOut)}`));
    console.log(`  ${prompts.missing} of ${prompts.total} articles need a cover image`);
  } else {
    console.log(c.dim('\n  Cover prompts skipped — only written on a full run (no --only=).'));
  }

  console.log(c.green('\n  Export complete.\n'));
}

main().catch((err) => {
  console.error(c.red(`\nExport failed: ${err.message}`));
  process.exit(1);
});
