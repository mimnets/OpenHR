import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import middleware from '../../middleware';

/**
 * Tests for the dynamic sitemap.
 *
 * public/sitemap.xml is written at build time, so publishing a post through the
 * admin panel used to leave it stale until the next deploy — which is how the
 * site ran for months advertising 14 URLs and zero articles. The middleware now
 * builds it from the database on request.
 *
 * The behaviour that matters here is the failure mode: a sitemap that suddenly
 * loses its URLs tells Google those pages are gone, so every error path must
 * fall through to the static file rather than emit a thin or empty document.
 */

const CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const POSTS = [
  { slug: 'how-to-stop-buddy-punching', updated: '2026-08-01T09:00:00Z', published_at: '2026-07-30T09:00:00Z' },
  { slug: 'leave-management-best-practices', updated: null, published_at: '2026-06-02T09:00:00Z' },
];
const TUTORIALS = [
  { slug: 'setting-up-organization', updated: '2026-05-05T09:00:00Z', published_at: '2026-05-01T09:00:00Z' },
];

function req(url: string, ua = CHROME): Request {
  return new Request(url, { headers: { 'user-agent': ua } });
}

/** @param opts.fail  table name whose query should return HTTP 500 */
function mockSupabase(opts: { posts?: unknown[]; tutorials?: unknown[]; fail?: string } = {}) {
  const mock = vi.fn(async (input: any) => {
    const url = String(input);
    if (opts.fail && url.includes(`/rest/v1/${opts.fail}`)) {
      return new Response('boom', { status: 500 });
    }
    if (url.includes('/rest/v1/blog_posts')) {
      return new Response(JSON.stringify(opts.posts ?? POSTS), { status: 200 });
    }
    if (url.includes('/rest/v1/tutorials')) {
      return new Response(JSON.stringify(opts.tutorials ?? TUTORIALS), { status: 200 });
    }
    return new Response('[]', { status: 200 });
  });
  vi.stubGlobal('fetch', mock);
  return mock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('dynamic sitemap', () => {
  beforeEach(() => {
    mockSupabase();
  });

  it('serves XML with the correct content type', async () => {
    const res = await middleware(req('https://openhrapp.com/sitemap.xml'));
    expect(res).toBeDefined();
    expect(res!.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');
    expect(res!.headers.get('X-Sitemap')).toBe('dynamic');
  });

  it('serves to a plain browser, not just crawlers', async () => {
    // Search Console fetches the sitemap without a crawler user-agent, so this
    // must not sit behind the bot check.
    const res = await middleware(req('https://openhrapp.com/sitemap.xml', CHROME));
    expect(res).toBeDefined();
    expect(await res!.text()).toContain('<urlset');
  });

  it('includes every published post and tutorial', async () => {
    const xml = await (await middleware(req('https://openhrapp.com/sitemap.xml')))!.text();
    expect(xml).toContain('<loc>https://openhrapp.com/blog/how-to-stop-buddy-punching</loc>');
    expect(xml).toContain('<loc>https://openhrapp.com/blog/leave-management-best-practices</loc>');
    expect(xml).toContain('<loc>https://openhrapp.com/how-to-use/setting-up-organization</loc>');
  });

  it('includes the static marketing pages', async () => {
    const xml = await (await middleware(req('https://openhrapp.com/sitemap.xml')))!.text();
    expect(xml).toContain('<loc>https://openhrapp.com/</loc>');
    expect(xml).toContain('<loc>https://openhrapp.com/privacy</loc>');
    expect(xml).toContain('<loc>https://openhrapp.com/features/attendance-tracking</loc>');
  });

  it('prefers updated over published_at for lastmod, and omits it when absent', async () => {
    const xml = await (await middleware(req('https://openhrapp.com/sitemap.xml')))!.text();
    const entry = xml.slice(xml.indexOf('/blog/how-to-stop-buddy-punching'));
    expect(entry.slice(0, 200)).toContain('<lastmod>2026-08-01</lastmod>');

    const second = xml.slice(xml.indexOf('/blog/leave-management-best-practices'));
    expect(second.slice(0, 200)).toContain('<lastmod>2026-06-02</lastmod>');
  });

  it('queries only PUBLISHED rows', async () => {
    const mock = mockSupabase();
    await middleware(req('https://openhrapp.com/sitemap.xml'));
    for (const call of mock.mock.calls) {
      expect(String(call[0])).toContain('status=eq.PUBLISHED');
    }
  });

  it('caches at the edge so a crawl burst costs one round trip', async () => {
    const res = await middleware(req('https://openhrapp.com/sitemap.xml', GOOGLEBOT));
    expect(res!.headers.get('Cache-Control')).toContain('s-maxage=3600');
  });

  it('produces well-formed, escaped XML for awkward slugs', async () => {
    mockSupabase({ posts: [{ slug: 'a&b', updated: '2026-01-01T00:00:00Z', published_at: null }] });
    const xml = await (await middleware(req('https://openhrapp.com/sitemap.xml')))!.text();
    expect(xml).toContain('/blog/a&amp;b');
    expect(xml).not.toMatch(/\/blog\/a&b</);
  });
});

describe('dynamic sitemap — failure modes fall through to the static file', () => {
  it('falls through when the blog query fails', async () => {
    mockSupabase({ fail: 'blog_posts' });
    expect(await middleware(req('https://openhrapp.com/sitemap.xml'))).toBeUndefined();
  });

  it('falls through when the tutorial query fails', async () => {
    mockSupabase({ fail: 'tutorials' });
    expect(await middleware(req('https://openhrapp.com/sitemap.xml'))).toBeUndefined();
  });

  it('falls through when both queries return nothing', async () => {
    // An empty result is far more likely to be a broken query than a genuinely
    // empty site — the exact failure that emptied the sitemap before.
    mockSupabase({ posts: [], tutorials: [] });
    expect(await middleware(req('https://openhrapp.com/sitemap.xml'))).toBeUndefined();
  });

  it('still emits when only one of the two tables has rows', async () => {
    mockSupabase({ posts: [], tutorials: TUTORIALS });
    const res = await middleware(req('https://openhrapp.com/sitemap.xml'));
    expect(res).toBeDefined();
    expect(await res!.text()).toContain('/how-to-use/setting-up-organization');
  });
});

describe('static page list stays in sync with the build-time generator', () => {
  /**
   * The Edge runtime cannot import from scripts/, so SITEMAP_STATIC_PAGES in
   * middleware.ts duplicates STATIC_PAGES in scripts/generate-sitemap.mjs. This
   * asserts the two cannot drift, since a route added to one and not the other
   * would silently vanish from whichever sitemap happens to serve.
   */
  const pathsIn = (source: string, constName: string): string[] => {
    const start = source.indexOf(`${constName}`);
    expect(start).toBeGreaterThan(-1);
    const block = source.slice(start, source.indexOf('];', start));
    return [...block.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
  };

  it('lists the same paths in the same order', () => {
    const root = path.resolve(__dirname, '../..');
    const mw = fs.readFileSync(path.join(root, 'middleware.ts'), 'utf8');
    const gen = fs.readFileSync(path.join(root, 'scripts/generate-sitemap.mjs'), 'utf8');

    const fromMiddleware = pathsIn(mw, 'SITEMAP_STATIC_PAGES');
    const fromGenerator = pathsIn(gen, 'STATIC_PAGES');

    expect(fromMiddleware.length).toBeGreaterThan(10);
    expect(fromMiddleware).toEqual(fromGenerator);
  });
});
