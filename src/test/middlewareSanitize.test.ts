import { describe, it, expect } from 'vitest';
import { sanitizeHtml, isSafeUrl } from '../../middleware';

/**
 * The prerender middleware embeds article HTML straight out of Supabase into a
 * server-rendered response. That content is authored through the Super Admin rich
 * text editor, but it is still untrusted input at this boundary — and unlike the SPA
 * path, there is no DOMPurify available in the Edge runtime.
 *
 * These tests pin the allowlist behaviour of the hand-rolled sanitizer.
 */

describe('sanitizeHtml', () => {
  it('keeps ordinary article markup intact', () => {
    const html = '<h2>Heading</h2><p>Some <strong>bold</strong> and <em>italic</em> text.</p><ul><li>One</li></ul>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('removes script elements along with their contents', () => {
    const out = sanitizeHtml('<p>before</p><script>alert(1)</script><p>after</p>');
    expect(out).not.toMatch(/alert/);
    expect(out).not.toMatch(/script/i);
    expect(out).toContain('before');
    expect(out).toContain('after');
  });

  it.each([
    ['style', '<style>body{display:none}</style>'],
    ['iframe', '<iframe src="https://evil.test"></iframe>'],
    ['object', '<object data="x"></object>'],
    ['embed', '<embed src="x"></embed>'],
    ['form', '<form action="https://evil.test"><input name="pw"></form>'],
    ['svg', '<svg><use href="x"/></svg>'],
  ])('removes %s elements with their contents', (_name, payload) => {
    const out = sanitizeHtml(`<p>keep</p>${payload}<p>keep2</p>`);
    expect(out).toContain('keep');
    expect(out).toContain('keep2');
    expect(out).not.toMatch(/evil\.test/);
    expect(out).not.toMatch(/<(style|iframe|object|embed|form|input|svg|use)\b/i);
  });

  it('survives nested/reconstructed script tags', () => {
    // A single non-global pass would leave a working <script> behind here.
    const out = sanitizeHtml('<scr<script>ipt>alert(1)</script>');
    expect(out.toLowerCase()).not.toContain('<script');
  });

  it('drops an unclosed dangerous opener and everything after it', () => {
    const out = sanitizeHtml('<p>safe</p><script>alert(1)');
    expect(out).toContain('safe');
    expect(out).not.toMatch(/alert/);
  });

  it('strips event handler attributes', () => {
    const out = sanitizeHtml('<p onclick="steal()">text</p><a href="/x" onmouseover="steal()">link</a>');
    expect(out).not.toMatch(/onclick/i);
    expect(out).not.toMatch(/onmouseover/i);
    expect(out).not.toMatch(/steal/);
    expect(out).toContain('text');
    expect(out).toContain('href="/x"');
  });

  it('removes javascript: and data: URLs', () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a><img src="data:text/html;base64,PHNjcmlwdD4=">');
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/data:/i);
  });

  it('rejects obfuscated javascript URLs containing control characters', () => {
    // Browsers ignore embedded tabs/newlines in scheme names.
    expect(isSafeUrl('java\tscript:alert(1)')).toBe(false);
    expect(isSafeUrl('java\nscript:alert(1)')).toBe(false);
  });

  it('allows http, https, mailto, tel, and relative URLs', () => {
    expect(isSafeUrl('https://openhrapp.com')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('mailto:hi@openhrapp.com')).toBe(true);
    expect(isSafeUrl('tel:+8801000000')).toBe(true);
    expect(isSafeUrl('/how-to-use/welcome-to-openhr')).toBe(true);
    expect(isSafeUrl('#section')).toBe(true);
  });

  it('rejects unknown schemes', () => {
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>')).toBe(false);
  });

  it('unwraps disallowed tags but keeps their text', () => {
    const out = sanitizeHtml('<marquee>still readable</marquee>');
    expect(out).not.toMatch(/marquee/i);
    expect(out).toContain('still readable');
  });

  it('drops attributes that are not on the per-tag allowlist', () => {
    const out = sanitizeHtml('<img src="/a.png" alt="ok" srcset="evil" loading="lazy">');
    expect(out).toContain('src="/a.png"');
    expect(out).toContain('alt="ok"');
    expect(out).not.toMatch(/srcset/);
    expect(out).not.toMatch(/loading/);
  });

  it('adds rel protection to outbound links only', () => {
    const external = sanitizeHtml('<a href="https://example.com">out</a>');
    expect(external).toContain('rel="nofollow ugc noopener"');

    const internal = sanitizeHtml('<a href="/how-to-use/x">in</a>');
    expect(internal).not.toContain('rel=');
  });

  it('removes HTML comments', () => {
    const out = sanitizeHtml('<p>a</p><!-- <script>alert(1)</script> --><p>b</p>');
    expect(out).not.toMatch(/alert/);
    expect(out).toBe('<p>a</p><p>b</p>');
  });

  it('handles empty and undefined-ish input', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null as unknown as string)).toBe('');
  });
});
