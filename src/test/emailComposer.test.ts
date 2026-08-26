import { describe, it, expect } from 'vitest';
import { sanitizeEmailHtml, BUTTON_COLORS } from '../components/superadmin/EmailComposer';

/**
 * Guards the composer's sanitising step.
 *
 * The composer stores a button as an anchor carrying data-btn, and the editor
 * paints it using an attribute-value selector (a[data-btn="teal"]). If the
 * value is lost anywhere in the round trip, the base rule still matches and
 * still sets white text, but no background is applied — producing a
 * button-shaped gap whose label only appears when you select it.
 */

const BUTTON = '<p><a href="https://openhrapp.com" data-btn="teal">Open your dashboard</a></p>';

describe('email composer sanitising', () => {
  it('keeps the button anchor and its label', () => {
    const out = sanitizeEmailHtml(BUTTON);
    expect(out).toContain('Open your dashboard');
    expect(out).toContain('href="https://openhrapp.com"');
  });

  it('keeps the data-btn VALUE, not just the attribute', () => {
    // The value is what selects the colour. Losing it is the invisible-label bug.
    const out = sanitizeEmailHtml(BUTTON);
    expect(out).toContain('data-btn="teal"');
  });

  it.each(Object.keys(BUTTON_COLORS))('keeps the %s colour value', (name) => {
    const out = sanitizeEmailHtml(`<p><a href="https://x.test" data-btn="${name}">Go</a></p>`);
    expect(out).toContain(`data-btn="${name}"`);
  });

  it('survives a second pass unchanged', () => {
    // emit() sanitises on every keystroke, so the output must be a fixed point.
    const once = sanitizeEmailHtml(BUTTON);
    expect(sanitizeEmailHtml(once)).toBe(once);
  });

  it('preserves placeholders', () => {
    const out = sanitizeEmailHtml('<p>Hi {{admin_name}} at {{org_name}}</p>');
    expect(out).toContain('{{admin_name}}');
    expect(out).toContain('{{org_name}}');
  });

  it('keeps the tags email clients render', () => {
    const out = sanitizeEmailHtml(
      '<h2>T</h2><p><strong>b</strong><em>i</em></p><ul><li>x</li></ul><ol><li>y</li></ol><blockquote>q</blockquote>',
    );
    for (const tag of ['h2', 'p', 'strong', 'em', 'ul', 'li', 'ol', 'blockquote']) {
      expect(out).toContain(`<${tag}>`);
    }
  });

  it('strips scripts and event handlers', () => {
    const out = sanitizeEmailHtml('<p onclick="steal()">hi</p><script>bad()</script><img src=x onerror=y>');
    expect(out).not.toContain('script');
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('onerror');
    expect(out).toContain('hi');
  });

  it('drops styles, since the send path applies its own', () => {
    const out = sanitizeEmailHtml('<p style="color:red">hi</p>');
    expect(out).not.toContain('style=');
    expect(out).toContain('hi');
  });
});
