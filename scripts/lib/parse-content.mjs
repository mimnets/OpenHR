/**
 * Parsers for the repo's authored markdown content.
 *
 * Kept separate from import-content.mjs so the parsing can be tested exhaustively
 * against the real files without a database, credentials, or network.
 *
 * GUIDES_CONTENT.md record shape:
 *
 *   ### Tutorial 7: How to Apply for Leave
 *
 *   **Slug:** `how-to-apply-for-leave`
 *   **Category:** Leave
 *   **Display Order:** 1
 *   **Parent:** None (Top-level)
 *   **Excerpt:** One-line summary.
 *
 *   ---
 *
 *   **Content:**
 *
 *   <markdown body, until the next ### Tutorial or ## heading>
 */

import { marked } from 'marked';

/** Trailing section of GUIDES_CONTENT.md that lists unwritten ideas, not content. */
const IDEAS_HEADING = '## Additional Tutorial Ideas';

const FIELD_RE = {
  slug: /^\*\*Slug:\*\*\s*`?([^`\n]+?)`?\s*$/m,
  category: /^\*\*Category:\*\*\s*(.+?)\s*$/m,
  displayOrder: /^\*\*Display Order:\*\*\s*(\d+)\s*$/m,
  parent: /^\*\*Parent:\*\*\s*(.+?)\s*$/m,
  excerpt: /^\*\*Excerpt:\*\*[ \t]*([\s\S]+?)(?=\n\s*\n|\n\*\*|$)/m,
};

/**
 * These files are checked in with CRLF terminators on Windows. Normalising once
 * here avoids every downstream regex having to account for a stray \r, which is
 * exactly the kind of detail that silently truncates a field.
 */
function normalize(source) {
  return source.replace(/\r\n?/g, '\n');
}

marked.setOptions({ gfm: true, breaks: false });

/**
 * The app renders tutorial/blog `content` with dangerouslySetInnerHTML, so the
 * database must hold HTML, not markdown. TutorialPage also derives HowTo schema
 * by looking for <ol> and <li>, which GFM list output satisfies.
 */
export function markdownToHtml(md) {
  return marked.parse(md.trim(), { async: false }).trim();
}

/** Mirrors src/utils/readingTime.ts semantics closely enough for an import default. */
export function readingTimeFor(md) {
  const words = md.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function cleanBody(raw) {
  let body = raw;

  // Records are split on `### Tutorial N:`, so a record that is followed by a new
  // `## Category:` section would otherwise swallow that heading into its body.
  // Tutorial content only ever uses h4/h5 — every h1/h2/h3 in the file is
  // structural — so the first one marks the end of this record.
  const boundary = body.search(/^#{1,3} /m);
  if (boundary >= 0) body = body.slice(0, boundary);

  // Records are separated by horizontal rules; drop the trailing ones so they do
  // not render as stray <hr> at the end of every guide.
  body = body.replace(/(?:\s*^---[ \t]*$)+\s*$/m, '');
  return body.trim();
}

export function parseGuides(rawSource) {
  const source = normalize(rawSource);

  // Everything after the ideas heading is a backlog list, not publishable content.
  const ideasAt = source.indexOf(IDEAS_HEADING);
  const scoped = ideasAt >= 0 ? source.slice(0, ideasAt) : source;

  // Split on the tutorial headers, keeping the header line with its record.
  const parts = scoped.split(/^(?=### Tutorial \d+:)/m).filter((p) => /^### Tutorial \d+:/.test(p));

  const seen = new Set();
  return parts.map((part, index) => {
    const titleMatch = part.match(/^### Tutorial \d+:\s*(.+?)\s*$/m);
    if (!titleMatch) throw new Error(`Record ${index + 1}: could not read title`);
    const title = titleMatch[1];

    const contentAt = part.indexOf('**Content:**');
    if (contentAt < 0) throw new Error(`"${title}": no **Content:** marker`);

    const head = part.slice(0, contentAt);
    const body = cleanBody(part.slice(contentAt + '**Content:**'.length));

    const read = (key, required = true) => {
      const m = head.match(FIELD_RE[key]);
      if (!m) {
        if (required) throw new Error(`"${title}": missing **${key}**`);
        return null;
      }
      return m[1].trim();
    };

    const slug = read('slug');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`"${title}": slug "${slug}" is not URL-safe`);
    }
    if (seen.has(slug)) throw new Error(`Duplicate slug "${slug}"`);
    seen.add(slug);

    if (!body) throw new Error(`"${title}": content body is empty`);

    const parentRaw = read('parent', false);
    const parentTitle = !parentRaw || /^none\b/i.test(parentRaw) ? null : parentRaw;

    return {
      title,
      slug,
      category: read('category'),
      displayOrder: Number(read('displayOrder')),
      parentTitle,
      excerpt: read('excerpt').replace(/\s+/g, ' '),
      markdown: body,
      html: markdownToHtml(body),
      readingTime: readingTimeFor(body),
    };
  });
}

/**
 * The blog markdown is a single article. Its title is the leading `# ` heading;
 * everything after is the body. Front matter is tolerated but not required.
 */
export function parseBlogPost(rawSource, fallbackSlug = 'openhr-complete-guide') {
  let text = normalize(rawSource).trim();

  let front = {};
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    for (const line of fm[1].split('\n')) {
      const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
      if (kv) front[kv[1].toLowerCase()] = kv[2].trim().replace(/^["']|["']$/g, '');
    }
    text = text.slice(fm[0].length).trim();
  }

  const h1 = text.match(/^#\s+(.+?)\s*$/m);
  const title = front.title || (h1 ? h1[1] : 'OpenHR — The Complete Guide');

  // Drop the H1 from the body; the page renders the title separately.
  const body = h1 ? text.replace(h1[0], '').trim() : text;
  if (!body) throw new Error('Blog post body is empty');

  const firstPara = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('-'));

  const excerpt = (front.excerpt || firstPara || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);

  return {
    title,
    slug: front.slug || fallbackSlug,
    excerpt,
    markdown: body,
    html: markdownToHtml(body),
    readingTime: readingTimeFor(body),
  };
}
