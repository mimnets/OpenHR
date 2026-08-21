import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * The Daylight token contract.
 *
 * Daylight applies to the 12 public pages; the logged-in app keeps its own
 * --primary set. Both live in src/index.css, which is why every token here is
 * --dl- prefixed — the two systems coexist rather than one replacing the other.
 *
 * These tests exist because the contrast figures quoted in the design were
 * measured, and a comment claiming "5.9:1" rots the moment somebody nudges a
 * hex. Here the ratios are recomputed from the stylesheet on every run.
 */

const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');

/** Pull a custom property from a specific block of the stylesheet. */
function token(name: string, scope: 'light' | 'dark'): string {
  const start = scope === 'light' ? css.indexOf(':root {\n  /* — surface — */') : css.indexOf('html.dark {');
  expect(start, `${scope} token block not found`).toBeGreaterThan(-1);
  const block = css.slice(start, css.indexOf('\n}', start));
  const m = new RegExp(`--${name}:\\s*([^;]+);`).exec(block);
  expect(m, `--${name} missing from the ${scope} block`).not.toBeNull();
  return m![1].trim();
}

const srgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));

const luminance = (hex: string) => {
  const [r, g, b] = srgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const AA_NORMAL = 4.5;

describe('Daylight tokens exist in both palettes', () => {
  const required = [
    'dl-ground', 'dl-surface', 'dl-surface-2', 'dl-hair', 'dl-hair-soft',
    'dl-ink', 'dl-muted', 'dl-soft',
    'dl-teal', 'dl-teal-deep',
    'dl-dawn', 'dl-noon', 'dl-dusk',
    'dl-lift-1', 'dl-lift-2',
  ];

  it.each(required)('%s is defined in light', (name) => {
    expect(token(name, 'light')).toMatch(/\S/);
  });

  it.each(required)('%s is defined in dark', (name) => {
    expect(token(name, 'dark')).toMatch(/\S/);
  });

  it('shape tokens are light-only — radius does not change with theme', () => {
    expect(token('dl-r-sm', 'light')).toBe('8px');
    expect(token('dl-r-md', 'light')).toBe('14px');
    expect(token('dl-r-lg', 'light')).toBe('22px');
  });
});

describe('text tokens clear WCAG AA on their own surface', () => {
  it.each([
    ['ink', 'dl-ink'],
    ['muted', 'dl-muted'],
    ['teal', 'dl-teal'],
  ])('light: %s on --dl-surface', (_label, name) => {
    const ratio = contrast(token(name, 'light'), token('dl-surface', 'light'));
    expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it.each([
    ['ink', 'dl-ink'],
    ['muted', 'dl-muted'],
    ['teal', 'dl-teal'],
  ])('dark: %s on --dl-surface', (_label, name) => {
    const ratio = contrast(token(name, 'dark'), token('dl-surface', 'dark'));
    expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('text tokens also clear AA on the page ground, not just on cards', () => {
    for (const scope of ['light', 'dark'] as const) {
      for (const name of ['dl-ink', 'dl-muted', 'dl-teal']) {
        expect(contrast(token(name, scope), token('dl-ground', scope))).toBeGreaterThanOrEqual(AA_NORMAL);
      }
    }
  });
});

describe('--dl-soft is decorative and must stay that way', () => {
  it('is below AA, which is why it is reserved for hairlines and ticks', () => {
    // Not a defect — a deliberate low-contrast value. The test records the
    // intent so nobody "fixes" it into a text colour later.
    expect(contrast(token('dl-soft', 'light'), token('dl-surface', 'light'))).toBeLessThan(AA_NORMAL);
  });

  it('is documented as non-text at its definition', () => {
    expect(css).toMatch(/never text\.\s*\*\/\s*\n\s*--dl-soft:/);
  });
});

describe('the day gradient stays out of the general palette', () => {
  it('dawn, noon and dusk are defined but carry a reservation comment', () => {
    expect(css).toMatch(/Only inside the arc and the logo mark/);
    for (const name of ['dl-dawn', 'dl-noon', 'dl-dusk']) {
      expect(token(name, 'light')).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('is not registered as a Tailwind background utility by accident', () => {
    // The gradient belongs to one component. Exposing bg-dl-dawn would make it
    // one autocomplete away from appearing on a button.
    const theme = css.slice(css.indexOf('@theme {'), css.indexOf('\n}', css.indexOf('@theme {')));
    expect(theme).toContain('--color-dl-teal');
  });
});

describe('elevation is always two layers', () => {
  it.each(['light', 'dark'] as const)('%s: both lift tokens stack a contact and a soft shadow', (scope) => {
    // A single blurred drop shadow is the most reliable tell of an interface
    // nobody looked at closely.
    for (const name of ['dl-lift-1', 'dl-lift-2']) {
      expect(token(name, scope).split('),').length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('the app keeps its own tokens', () => {
  it('--primary is untouched, so the logged-in app is unaffected', () => {
    expect(css).toContain('--primary: #4a6fa5;');
    expect(css).toContain('--primary-hover: #3b5d8c;');
  });

  it('no Daylight token overwrites a --primary one', () => {
    expect(css).not.toMatch(/--primary:\s*var\(--dl-/);
  });
});
