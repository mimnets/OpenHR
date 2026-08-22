import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Regression guard for the AI-answer-engine surface (plan items 17-19, Phase 1D).
 *
 * Asserted at source level for the same reason as generators.test.mjs: the script runs
 * `main()` on import, so exercising it would mean hitting the live database.
 *
 * The failure mode being guarded is the one that produced F1/F2 — a content query that
 * silently matches nothing, shipping an empty corpus that looks like a working build.
 */

const LLMS = path.resolve('scripts', 'generate-llms.mjs');
const read = (p) => fs.readFileSync(p, 'utf-8');

describe('generate-llms.mjs content query', () => {
  const src = read(LLMS);

  it('filters on the uppercase status the CHECK constraint actually stores', () => {
    expect(src).toContain("'eq.PUBLISHED'");
    expect(src).not.toContain('eq.published');
  });

  it('never selects the _at column names that do not exist on these tables', () => {
    // The columns are `created` / `updated`. Selecting `created_at` / `updated_at` makes
    // PostgREST answer 400, which is what hid the broken sitemap query for months.
    expect(src).not.toMatch(/\bcreated_at\b/);
    expect(src).not.toMatch(/\bupdated_at\b/);
  });

  it('fails loudly on a PostgREST error instead of returning an empty list', () => {
    expect(src).toMatch(/throw new Error\(`\$\{table\} query failed/);
  });

  it('refuses to write an empty corpus', () => {
    expect(src).toMatch(/tutorials\.length === 0 && posts\.length === 0/);
    expect(src).toMatch(/Refusing to write an empty/);
  });

  it('writes both the index and the full-text file', () => {
    expect(src).toContain("writeFileSync('public/llms.txt'");
    expect(src).toContain("writeFileSync('public/llms-full.txt'");
  });
});

describe('build wiring', () => {
  const pkg = JSON.parse(read(path.resolve('package.json')));

  it('runs the llms generator as part of the build', () => {
    expect(pkg.scripts.build).toContain('scripts/generate-llms.mjs');
  });

  it('exposes a standalone llms script alongside sitemap and feed', () => {
    expect(pkg.scripts.llms).toBe('node scripts/generate-llms.mjs');
  });
});

describe('robots.txt AI crawler surface (item 18)', () => {
  const robots = read(path.resolve('public', 'robots.txt'));

  it.each([
    'GPTBot',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-User',
    'PerplexityBot',
    'Google-Extended',
    'CCBot',
  ])('allows %s', (agent) => {
    expect(robots).toMatch(new RegExp(`^User-agent: ${agent}$`, 'm'));
  });

  it('points answer engines at the plain-text corpus', () => {
    expect(robots).toContain('llms.txt');
    expect(robots).toContain('llms-full.txt');
  });

  it('still keeps the authenticated app out of every crawler', () => {
    expect(robots).toMatch(/^Disallow: \/dashboard$/m);
    expect(robots).toMatch(/^Disallow: \/super-admin$/m);
  });

  it('keeps the sitemap directive last so it stays outside any user-agent group', () => {
    const sitemapAt = robots.indexOf('Sitemap:');
    const lastAgentAt = robots.lastIndexOf('User-agent:');
    expect(sitemapAt).toBeGreaterThan(lastAgentAt);
  });
});
