import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * AC-DL9 — the prerender's feature metadata must not drift from the app's.
 *
 * `middleware.ts` runs on the Vercel Edge runtime and cannot import from `src/`, so it inlines
 * its own `FEATURE_META` copy of the feature list. That mirror is what Googlebot and the AdSense
 * crawler receive for every `/features/*` URL.
 *
 * Nothing keeps the two in sync. DL6 restyles the features pages, and Phase 4 item 48 will
 * rewrite this exact copy ("no fingerprint scanners needed" becomes a contradiction once device
 * support ships). If a slug is added to `src/data/features.ts` and not to the mirror, that page
 * prerenders with the site-wide default title and quietly declares itself a duplicate — which is
 * precisely the failure §10 found on production, one URL at a time instead of all of them.
 *
 * Divergence here is silent, which is why it is asserted rather than reviewed.
 */

const read = (p: string) => fs.readFileSync(path.resolve(p), 'utf-8');

/** Slugs the app routes to, from the shared feature data. */
const appSlugs = (): string[] => {
  const src = read('src/data/features.ts');
  return [...new Set([...src.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]))].sort();
};

/** Slugs the Edge middleware can prerender. */
const prerenderSlugs = (): string[] => {
  const src = read('middleware.ts');
  const start = src.indexOf('const FEATURE_META');
  expect(start).toBeGreaterThan(-1);
  // The object literal ends at the first line that closes it at column 0.
  const end = src.indexOf('\n};', start);
  const block = src.slice(start, end);
  return [...new Set([...block.matchAll(/^\s{2}'([a-z0-9-]+)':\s*\{/gm)].map((m) => m[1]))].sort();
};

describe('AC-DL9 — FEATURE_META mirrors src/data/features.ts', () => {
  it('prerenders every feature the app can route to', () => {
    const missing = appSlugs().filter((s) => !prerenderSlugs().includes(s));
    expect(missing).toEqual([]);
  });

  it('does not prerender features the app no longer has', () => {
    const orphaned = prerenderSlugs().filter((s) => !appSlugs().includes(s));
    expect(orphaned).toEqual([]);
  });

  it('gives every prerendered feature a distinct title and description', () => {
    // A duplicated title across two feature URLs is the same duplicate-content signal the
    // homepage-for-every-URL bug produced, just narrower.
    const src = read('middleware.ts');
    const block = src.slice(src.indexOf('const FEATURE_META'), src.indexOf('\n};', src.indexOf('const FEATURE_META')));
    const titles = [...block.matchAll(/title:\s*'([^']+)'/g)].map((m) => m[1]);
    const descriptions = [...block.matchAll(/description:\s*'([^']+)'/g)].map((m) => m[1]);
    expect(titles.length).toBeGreaterThan(0);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('keeps every feature reachable from the sitemap', () => {
    // A prerendered page nothing links to is a page Google will not find.
    const sitemap = read('scripts/generate-sitemap.mjs');
    for (const slug of appSlugs()) {
      expect(sitemap).toContain(`/features/${slug}`);
    }
  });
});
