import { describe, it, expect } from 'vitest';
import {
  renderEmail,
  styleInlineContent,
  ctaButton,
  BUTTON_COLORS,
} from '../../supabase/functions/_shared/emailLayout';

/**
 * Guards the outbound email layout.
 *
 * Written after a real bug: buttons were expanded into their final markup and
 * THEN passed through the blunt `<a ` tag rule, which prepended a second style
 * attribute. HTML keeps the first style attribute and discards the duplicate, so
 * the label inherited the link colour and rendered teal on a teal background —
 * a button whose text was invisible in the inbox.
 *
 * The module is deliberately free of Deno APIs so it can be tested here rather
 * than only in production.
 */

const BUTTON = '<p><a href="https://openhrapp.com" data-btn="teal">Open your dashboard</a></p>';

describe('email layout', () => {
  describe('buttons', () => {
    it('keeps the label', () => {
      const out = styleInlineContent(BUTTON);
      expect(out).toContain('Open your dashboard');
    });

    it('gives the button exactly one style attribute', () => {
      // This is the regression. Two style attributes meant the browser used the
      // first — link styling — and threw away the white text and padding.
      const out = styleInlineContent(BUTTON);
      const anchors = out.match(/<a\b[^>]*>/g) ?? [];
      expect(anchors.length).toBeGreaterThan(0);
      for (const a of anchors) {
        expect((a.match(/style\s*=/g) ?? []).length).toBe(1);
      }
    });

    it('keeps the label white rather than the link colour', () => {
      const out = styleInlineContent(BUTTON);
      const anchor = (out.match(/<a\b[^>]*>/g) ?? [])[0];
      expect(anchor).toContain('color:#ffffff');
      expect(anchor).not.toContain(BUTTON_COLORS.teal + ';text-decoration');
    });

    it('carries the chosen colour through to the cell', () => {
      for (const [name, hex] of Object.entries(BUTTON_COLORS)) {
        const out = styleInlineContent(
          `<p><a href="https://x.test" data-btn="${name}">Go</a></p>`,
        );
        expect(out).toContain(`bgcolor="${hex}"`);
      }
    });

    it('falls back to the brand colour for an unknown name', () => {
      const out = styleInlineContent('<p><a href="https://x.test" data-btn="chartreuse">Go</a></p>');
      expect(out).toContain(`bgcolor="${BUTTON_COLORS.teal}"`);
    });

    it('does not leave a table inside a paragraph', () => {
      // A <table> inside a <p> is invalid; some clients close the paragraph
      // early and strand the button outside the layout.
      const out = styleInlineContent(BUTTON);
      expect(out).not.toMatch(/<p\b[^>]*>\s*<table/i);
    });

    it('leaves an ordinary link as a link', () => {
      const out = styleInlineContent('<p>See <a href="https://x.test">the guide</a>.</p>');
      expect(out).not.toContain('<table');
      expect(out).toContain('text-decoration:underline');
      expect(out).toContain('the guide');
    });

    it('leaves a data-btn anchor with no href alone', () => {
      const out = styleInlineContent('<p><a data-btn="teal">no target</a></p>');
      expect(out).not.toContain('<table');
      expect(out).toContain('no target');
    });

    it('handles two buttons in one message', () => {
      const out = styleInlineContent(
        '<p><a href="https://a.test" data-btn="teal">First</a></p>' +
        '<p><a href="https://b.test" data-btn="rose">Second</a></p>',
      );
      expect(out).toContain('First');
      expect(out).toContain('Second');
      expect(out).toContain(`bgcolor="${BUTTON_COLORS.teal}"`);
      expect(out).toContain(`bgcolor="${BUTTON_COLORS.rose}"`);
      expect(out).not.toContain('<!--BTN');
    });

    it('leaves no markers behind', () => {
      expect(styleInlineContent(BUTTON)).not.toContain('<!--BTN');
    });
  });

  describe('content styling', () => {
    it('styles paragraphs, lists and headings', () => {
      const out = styleInlineContent('<h2>Title</h2><p>Body</p><ul><li>One</li></ul>');
      expect(out).toContain('<h2 style=');
      expect(out).toContain('<p style=');
      expect(out).toContain('<ul style=');
      expect(out).toContain('<li style=');
    });

    it('preserves placeholders untouched', () => {
      const out = styleInlineContent('<p>Hi {{admin_name}} at {{org_name}}</p>');
      expect(out).toContain('{{admin_name}}');
      expect(out).toContain('{{org_name}}');
    });
  });

  describe('frame', () => {
    it('paints an explicit background so dark mode cannot invert it', () => {
      const out = renderEmail({ content: '<p>Hi</p>' });
      expect(out).toContain('background-color:#f4f7f6');
      expect(out).toContain('color-scheme');
    });

    it('includes the unsubscribe link when given one', () => {
      const out = renderEmail({ content: '<p>Hi</p>', unsubscribeUrl: 'https://u.test/x' });
      expect(out).toContain('https://u.test/x');
      expect(out).toContain('Unsubscribe');
    });

    it('omits the unsubscribe line when there is no link', () => {
      expect(renderEmail({ content: '<p>Hi</p>' })).not.toContain('Unsubscribe from these emails');
    });

    it('shows the test banner only for a test', () => {
      expect(renderEmail({ content: '<p>Hi</p>', isTest: true })).toContain('Test message');
      expect(renderEmail({ content: '<p>Hi</p>' })).not.toContain('Test message');
    });

    it('hides the preheader from the visible body', () => {
      const out = renderEmail({ content: '<p>Hi</p>', preheader: 'Acme Ltd' });
      expect(out).toContain('Acme Ltd');
      expect(out).toContain('display:none');
    });
  });

  describe('ctaButton', () => {
    it('uses a table with bgcolor rather than a styled anchor', () => {
      // Outlook renders padding on an <a> as a thin unclickable strip.
      const out = ctaButton('Go', 'https://x.test', '#123456');
      expect(out).toContain('<table');
      expect(out).toContain('bgcolor="#123456"');
      expect(out).toContain('>Go</a>');
    });
  });
});
