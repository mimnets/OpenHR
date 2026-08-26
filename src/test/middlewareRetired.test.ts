import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import middleware from '../../middleware';

/**
 * Retired guide URLs.
 *
 * When a published guide is archived rather than replaced, its row stops
 * matching `status=eq.PUBLISHED`, so it leaves the sitemap and resolveTutorial
 * returns null. The middleware then falls through to the SPA — which renders
 * its not-found state with a 200. That is a soft 404, and it is the worst of
 * the three options: the URL keeps its place in the index, serves nothing
 * useful, and passes none of its authority to whatever replaced it.
 *
 * theme-customization is the first case. It is in the live sitemap today and
 * prerenders for Googlebot, so it will be indexed; it documents a fourteen-
 * palette theme picker, an organization default theme, and cross-device sync,
 * all removed in 0508e82. Its surviving content moved into
 * managing-profile-settings.
 */

const req = (url: string) => new Request(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });

describe('retired guide URLs redirect instead of soft-404ing', () => {
  it('theme-customization permanently redirects to the guide that absorbed it', async () => {
    const res = await middleware(req('https://openhrapp.com/how-to-use/theme-customization'));
    expect(res).toBeDefined();
    expect(res!.status).toBe(301);
    expect(res!.headers.get('Location')).toBe('/how-to-use/managing-profile-settings');
  });

  it('a trailing slash redirects the same way', async () => {
    const res = await middleware(req('https://openhrapp.com/how-to-use/theme-customization/'));
    expect(res!.status).toBe(301);
    expect(res!.headers.get('Location')).toBe('/how-to-use/managing-profile-settings');
  });

  it('301, not 302 — a temporary redirect passes no authority and is re-checked forever', async () => {
    const res = await middleware(req('https://openhrapp.com/how-to-use/theme-customization'));
    expect(res!.status).not.toBe(302);
    expect(res!.status).not.toBe(307);
  });

  it('redirects before the crawler check, so humans and bots are treated alike', async () => {
    const bot = new Request('https://openhrapp.com/how-to-use/theme-customization', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
    });
    const res = await middleware(bot);
    expect(res!.status).toBe(301);
  });

  it('a live guide is untouched', async () => {
    // Not in the retired map, so it must not short-circuit into a redirect.
    const res = await middleware(req('https://openhrapp.com/how-to-use/managing-profile-settings'));
    if (res) expect(res.status).not.toBe(301);
  });

  /**
   * The redirect target has to be a guide that actually exists. A redirect into
   * a 404 is not an improvement on the soft 404 it replaced.
   */
  it('every retired path points at a different, non-retired path', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../../middleware.ts'), 'utf8');
    const block = src.slice(src.indexOf('const RETIRED_PATHS'), src.indexOf('export default async function middleware'));
    const pairs = [...block.matchAll(/'([^']+)':\s*'([^']+)'/g)].map((m) => [m[1], m[2]]);

    expect(pairs.length).toBeGreaterThan(0);
    const froms = new Set(pairs.map(([f]) => f));
    for (const [from, to] of pairs) {
      expect(to, `${from} redirects to itself`).not.toBe(from);
      expect(froms.has(to), `${from} redirects to ${to}, which is itself retired`).toBe(false);
      expect(to.startsWith('/'), `${to} must be root-relative`).toBe(true);
    }
  });
});
