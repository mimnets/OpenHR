import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseGuides, parseBlogPost, markdownToHtml, readingTimeFor } from '../lib/parse-content.mjs';

/**
 * These run against the REAL content files, not fixtures. The whole point of the
 * importer is to move 25 hand-written guides into the database without mangling
 * them, so the tests need to fail if the source file drifts into a shape the
 * parser mishandles.
 */

const GUIDES = fs.readFileSync(path.resolve('Others', 'GUIDES_CONTENT.md'), 'utf-8');
const BLOG = fs.readFileSync(path.resolve('Others', 'blog-openhr-complete-guide.md'), 'utf-8');

const guides = parseGuides(GUIDES);

describe('parseGuides — real GUIDES_CONTENT.md', () => {
  it('parses every tutorial in the file', () => {
    const headerCount = (GUIDES.match(/^### Tutorial \d+:/gm) || []).length;
    expect(guides).toHaveLength(headerCount);
    expect(guides.length).toBeGreaterThanOrEqual(25);
  });

  it('excludes the trailing "Additional Tutorial Ideas" backlog', () => {
    expect(GUIDES).toContain('## Additional Tutorial Ideas');
    // Those ideas are bullet lines, not tutorials — none should surface as records.
    expect(guides.some((g) => /Multi-Location Setup|Year-End Leave Balance Reset/.test(g.title))).toBe(false);
  });

  it('gives every record the fields the tutorials table requires', () => {
    for (const g of guides) {
      expect(g.title, `title for ${g.slug}`).toBeTruthy();
      expect(g.slug).toBeTruthy();
      expect(g.category).toBeTruthy();
      expect(g.excerpt).toBeTruthy();
      expect(g.html).toBeTruthy();
      expect(Number.isInteger(g.displayOrder)).toBe(true);
      expect(g.displayOrder).toBeGreaterThan(0);
    }
  });

  it('produces URL-safe, unique slugs', () => {
    const slugs = guides.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it('resolves every declared parent to another tutorial title', () => {
    const titles = new Set(guides.map((g) => g.title));
    const unresolved = guides
      .filter((g) => g.parentTitle && !titles.has(g.parentTitle))
      .map((g) => `${g.slug} -> ${g.parentTitle}`);
    expect(unresolved).toEqual([]);
  });

  it('treats "None (Top-level)" as no parent', () => {
    const top = guides.find((g) => g.slug === 'welcome-to-openhr');
    expect(top.parentTitle).toBeNull();
    expect(guides.some((g) => g.parentTitle !== null)).toBe(true);
  });

  it('never leaves the title prefix in the parsed title', () => {
    for (const g of guides) expect(g.title).not.toMatch(/^### |^Tutorial \d+:/);
  });
});

describe('parseGuides — markdown conversion fidelity', () => {
  const allHtml = guides.map((g) => g.html).join('\n');

  it('converts every source heading', () => {
    // The header/ideas sections sit outside tutorial records, so compare against
    // headings that fall inside the parsed bodies.
    const sourceH4 = guides.reduce((n, g) => n + (g.markdown.match(/^#### /gm) || []).length, 0);
    const renderedH4 = (allHtml.match(/<h4[ >]/g) || []).length;
    expect(renderedH4).toBe(sourceH4);
  });

  it('converts GFM tables', () => {
    expect((allHtml.match(/<table>/g) || []).length).toBeGreaterThan(0);
    expect(allHtml).toContain('<thead>');
    expect(allHtml).toContain('<td>');
  });

  it('emits ordered lists, which TutorialPage uses to derive HowTo schema', () => {
    // src/pages/TutorialPage.tsx looks for <ol> and <li> to build structured data.
    expect((allHtml.match(/<ol>/g) || []).length).toBeGreaterThan(0);
    expect((allHtml.match(/<li>/g) || []).length).toBeGreaterThan(0);
  });

  it('preserves internal cross-links', () => {
    expect(allHtml).toMatch(/href="\/how-to-use\/[a-z0-9-]+"/);
    expect(allHtml).toMatch(/href="\/features\/[a-z0-9-]+"/);
  });

  it('leaves no unconverted markdown syntax behind', () => {
    expect(allHtml).not.toMatch(/\*\*/);
    expect(allHtml).not.toMatch(/\]\(/);
    expect(allHtml).not.toMatch(/\|\s*---/);
  });

  it('does not emit a trailing horizontal rule from the record separator', () => {
    for (const g of guides) expect(g.html.trimEnd()).not.toMatch(/<hr\s*\/?>$/);
  });

  it('does not leak the next section\'s "## Category:" heading into a body', () => {
    // Records are split on "### Tutorial N:", so without an explicit end boundary
    // a record swallows the "## Category: X" header that introduces the next
    // section. Tutorial bodies only use h4/h5, so any h1-h3 is leaked structure.
    for (const g of guides) {
      expect(g.markdown, `body of ${g.slug}`).not.toMatch(/^#{1,3} /m);
      expect(g.html, `html of ${g.slug}`).not.toMatch(/<h[123][ >]/);
      expect(g.html).not.toMatch(/Category:/);
    }
  });

  it('keeps every body strictly between its own header and the next boundary', () => {
    // A leak would inflate content; truncating too early would lose it. Compare
    // the summed body length against the file's total tutorial region.
    // Measured at ~79.7k across 25 guides; the floor guards against gross
    // truncation without being brittle to ordinary content edits.
    const total = guides.reduce((n, g) => n + g.markdown.length, 0);
    expect(total).toBeGreaterThan(75_000);
    for (const g of guides) expect(g.markdown.length).toBeGreaterThan(500);
  });
});

describe('parseGuides — error handling', () => {
  const valid = [
    '### Tutorial 1: Example Guide',
    '',
    '**Slug:** `example-guide`',
    '**Category:** Getting Started',
    '**Display Order:** 1',
    '**Parent:** None (Top-level)',
    '**Excerpt:** A short summary.',
    '',
    '---',
    '',
    '**Content:**',
    '',
    'Body text here.',
    '',
  ].join('\n');

  it('parses a minimal well-formed record', () => {
    const [g] = parseGuides(valid);
    expect(g.slug).toBe('example-guide');
    expect(g.excerpt).toBe('A short summary.');
    expect(g.html).toBe('<p>Body text here.</p>');
  });

  it('handles CRLF line endings identically to LF', () => {
    const crlf = parseGuides(valid.replace(/\n/g, '\r\n'));
    expect(crlf).toEqual(parseGuides(valid));
  });

  it('rejects a duplicate slug rather than silently overwriting', () => {
    expect(() => parseGuides(valid + '\n' + valid.replace('Tutorial 1', 'Tutorial 2')))
      .toThrow(/Duplicate slug/);
  });

  it('rejects a missing required field', () => {
    expect(() => parseGuides(valid.replace('**Category:** Getting Started\n', '')))
      .toThrow(/missing \*\*category\*\*/);
  });

  it('rejects a record with no content marker', () => {
    expect(() => parseGuides(valid.replace('**Content:**', '')))
      .toThrow(/no \*\*Content:\*\* marker/);
  });

  it('rejects an empty body', () => {
    expect(() => parseGuides(valid.replace('Body text here.', '')))
      .toThrow(/content body is empty/);
  });

  it('rejects a slug that is not URL-safe', () => {
    expect(() => parseGuides(valid.replace('`example-guide`', '`Example Guide!`')))
      .toThrow(/not URL-safe/);
  });

  it('returns an empty array for input with no tutorials', () => {
    expect(parseGuides('# Just a document\n\nNo records here.')).toEqual([]);
  });
});

describe('parseBlogPost — real blog file', () => {
  const post = parseBlogPost(BLOG);

  it('extracts the title from the H1 and removes it from the body', () => {
    expect(post.title).toBeTruthy();
    expect(post.title).not.toMatch(/^#/);
    expect(post.html).not.toContain(`<h1>${post.title}</h1>`);
  });

  it('derives a plain-text excerpt with markdown stripped', () => {
    expect(post.excerpt.length).toBeGreaterThan(20);
    expect(post.excerpt.length).toBeLessThanOrEqual(300);
    expect(post.excerpt).not.toMatch(/[*_`]|\]\(/);
  });

  it('produces a slug and a sensible reading time', () => {
    expect(post.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(post.readingTime).toBeGreaterThan(0);
  });

  it('fully converts the body to HTML', () => {
    expect(post.html).toContain('<p>');
    expect(post.html).not.toMatch(/\*\*/);
    expect(post.html).not.toMatch(/\]\(/);
  });
});

describe('parseBlogPost — front matter', () => {
  it('prefers front matter over derived values', () => {
    const src = [
      '---',
      'title: Custom Title',
      'slug: custom-slug',
      'excerpt: Custom excerpt.',
      '---',
      '',
      '# Ignored Heading',
      '',
      'Body.',
    ].join('\n');

    const p = parseBlogPost(src);
    expect(p.title).toBe('Custom Title');
    expect(p.slug).toBe('custom-slug');
    expect(p.excerpt).toBe('Custom excerpt.');
  });

  it('falls back to the supplied slug when none is given', () => {
    expect(parseBlogPost('# T\n\nBody.', 'fallback-slug').slug).toBe('fallback-slug');
  });

  it('rejects an empty body', () => {
    expect(() => parseBlogPost('# Only a title')).toThrow(/body is empty/);
  });
});

describe('helpers', () => {
  it('markdownToHtml handles the constructs used by the guides', () => {
    expect(markdownToHtml('**bold**')).toContain('<strong>bold</strong>');
    expect(markdownToHtml('- a\n- b')).toContain('<li>a</li>');
    expect(markdownToHtml('1. one\n2. two')).toContain('<ol>');
    expect(markdownToHtml('[x](/y)')).toContain('href="/y"');
    expect(markdownToHtml('| a | b |\n| --- | --- |\n| 1 | 2 |')).toContain('<table>');
  });

  it('readingTime is at least one minute and scales with length', () => {
    expect(readingTimeFor('word')).toBe(1);
    expect(readingTimeFor(Array(1000).fill('word').join(' '))).toBe(5);
  });
});
