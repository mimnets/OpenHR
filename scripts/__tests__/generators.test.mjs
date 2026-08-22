import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Regression guard for the sitemap/feed content queries.
 *
 * Both generators silently returned zero rows for months because of two mismatches
 * against the schema in supabase/migrations/0001_initial_schema.sql:
 *
 *   1. They filtered `status=eq.published` (lowercase). The CHECK constraint stores
 *      'DRAFT' | 'PUBLISHED' | 'ARCHIVED', and PostgREST `eq` is case-sensitive.
 *   2. They selected `updated_at` / `created_at`. The columns are `updated` / `created`,
 *      so PostgREST answered 400 and the loop swallowed it.
 *
 * The net effect was a sitemap containing only the 14 static marketing URLs — no blog
 * posts and no guides — which is invisible content as far as Google and AdSense are
 * concerned. These are source-level assertions on purpose: the scripts run `main()` on
 * import, so intercepting the live query would mean executing the generator.
 */

const SITEMAP = path.resolve('scripts', 'generate-sitemap.mjs');
const FEED = path.resolve('scripts', 'generate-feed.mjs');

const read = (p) => fs.readFileSync(p, 'utf-8');

describe.each([
  ['generate-sitemap.mjs', SITEMAP],
  ['generate-feed.mjs', FEED],
])('%s content query', (name, filePath) => {
  const source = read(filePath);

  it('filters on the uppercase PUBLISHED status', () => {
    expect(source).toContain("'eq.PUBLISHED'");
  });

  it('never filters on a lowercase status value', () => {
    // PostgREST eq is case-sensitive; eq.published matches nothing.
    expect(source).not.toMatch(/status:\s*['"]eq\.published['"]/);
  });

  it('does not select columns that do not exist on the content tables', () => {
    const selectLines = source
      .split('\n')
      .filter((line) => /select/i.test(line) && /slug/.test(line));

    expect(selectLines.length).toBeGreaterThan(0);
    for (const line of selectLines) {
      expect(line).not.toMatch(/\bupdated_at\b/);
      expect(line).not.toMatch(/\bcreated_at\b/);
    }
  });

  it('fails loudly instead of breaking out of the fetch loop on a non-OK response', () => {
    // The original `console.warn(...); break;` turned a 400 into an empty result set.
    expect(source).toMatch(/throw new Error\(`\$\{table\} query failed/);
  });

  it('exits non-zero when generation fails', () => {
    expect(source).toMatch(/process\.exit\(1\)/);
  });

  it('refuses to emit a content-free document', () => {
    expect(source).toMatch(/refusing to emit a (static-only sitemap|content-free feed)/);
  });

  it('offers a documented escape hatch so a genuinely empty DB cannot break deploys', () => {
    expect(source).toContain("process.env.ALLOW_EMPTY_CONTENT !== '1'");
    expect(source).toContain('set ALLOW_EMPTY_CONTENT=1');
  });
});

describe('generate-sitemap.mjs lastmod resolution', () => {
  const source = read(SITEMAP);

  it('reads the `updated` column rather than `updated_at`', () => {
    expect(source).toMatch(/post\.updated\b(?!_at)/);
    expect(source).toMatch(/tut\.updated\b(?!_at)/);
    expect(source).not.toMatch(/(post|tut)\.updated_at/);
  });
});
