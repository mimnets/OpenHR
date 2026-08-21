import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Theme boot behaviour.
 *
 * OpenHRApp has one brand colour, defined once in src/index.css. The selectable
 * accent theme it used to carry — fourteen palettes, a super-admin picker, and a
 * `default_theme` row fetched from Supabase — has been removed, along with the
 * three defects that came with it: a bulk "apply to all organizations" write
 * with no confirmation that had already restyled 119 real customer orgs; a
 * colour repaint on load because the theme arrived over the network after first
 * paint; and the same palette table duplicated in three places, free to drift.
 *
 * Dark mode is kept. It is a local accessibility preference with no network
 * round trip, and these tests guard the part of it that is easy to break: the
 * ordering that keeps it from flashing between two states on refresh.
 */

const root = path.resolve(__dirname, '../..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
const themeContext = fs.readFileSync(path.join(root, 'src/context/ThemeContext.tsx'), 'utf8');

const BRAND = { primary: '#4a6fa5', hover: '#3b5d8c', light: '#d4e4f7' };

describe('brand colour is defined once, in CSS', () => {
  it('sets the brand custom properties on :root', () => {
    expect(indexCss).toContain(`--primary: ${BRAND.primary};`);
    expect(indexCss).toContain(`--primary-hover: ${BRAND.hover};`);
    expect(indexCss).toContain(`--primary-light: ${BRAND.light};`);
  });

  it('defines --primary-light-dark, which the dark rules consume', () => {
    // Previously written from JS as `${primary}20`. With the provider no longer
    // setting custom properties, leaving it undefined would silently break
    // .dark .bg-primary-light.
    expect(indexCss).toContain('--primary-light-dark:');
    expect(indexCss).toContain('.dark .bg-primary-light { background-color: var(--primary-light-dark)');
  });

  it('no longer ships a palette table in the boot script', () => {
    expect(indexHtml).not.toContain('arctic-frost');
    expect(indexHtml).not.toContain('charcoal-slate');
    expect(indexHtml).not.toContain("localStorage.getItem('openhr-global-theme')");
  });

  it('no longer fetches a theme over the network', () => {
    // The fetch ran on an idle callback, again every 60s, and again on every
    // visibilitychange — repainting the accent colour after first paint.
    // Asserted against code rather than prose: the file's own comment explains
    // the removal and names default_theme.
    expect(themeContext).not.toMatch(/^import .*organizationService/m);
    expect(themeContext).not.toContain('setInterval');
    expect(themeContext).not.toContain('requestIdleCallback');
    expect(themeContext).not.toMatch(/addEventListener\(['"]visibilitychange/);
  });

  it('exposes no accent-theme API', () => {
    expect(themeContext).not.toContain('setTheme');
    expect(themeContext).not.toContain('currentTheme');
    expect(themeContext).not.toContain('THEMES');
  });
});

describe('dark mode does not flash between two states on refresh', () => {
  it('reads the stored preference in the state initialiser, not an effect', () => {
    // index.html sets the .dark class from this key before first paint. If the
    // first render assumed a different value it would remove that class and
    // re-add it a render later, which is visible.
    expect(themeContext).toContain('useState<DarkModePreference>(getStoredDarkPreference)');
    expect(themeContext).not.toMatch(/useEffect\(\(\) => \{\s*const saved(Dark)? = localStorage/);
  });

  it('applies the dark class before paint', () => {
    const block = themeContext.slice(themeContext.indexOf('useLayoutEffect'));
    expect(block).toContain("classList.toggle('dark'");
  });

  it('keeps the pre-paint boot script that sets the class', () => {
    expect(indexHtml).toContain('Dark mode preload');
    expect(indexHtml).toContain("localStorage.getItem('openhr-dark-mode')");
  });

  it('reads and writes the same localStorage key as the boot script', () => {
    // A mismatch here means the boot script and React disagree on every load.
    const keyInContext = /const DARK_MODE_KEY = '([^']+)'/.exec(themeContext)?.[1];
    expect(keyInContext).toBe('openhr-dark-mode');
    expect(indexHtml).toContain(`localStorage.getItem('${keyInContext}')`);
  });

  it('keeps the system preference live rather than sampling it once', () => {
    expect(themeContext).toContain("matchMedia('(prefers-color-scheme: dark)')");
    expect(themeContext).toContain("mq.addEventListener('change', handler)");
  });
});

describe('dark: variant is bound to the .dark class, not the OS', () => {
  it('declares the custom variant', () => {
    // Tailwind v4 defaults `dark:` to @media (prefers-color-scheme: dark), but
    // this app toggles a .dark class and index.css's override rules key on it.
    // Without this the two disagree and the page renders half-themed for anyone
    // whose OS scheme differs from their choice. Verified by A/B build: without
    // it the bundle emits a prefers-color-scheme query wrapping every dark:
    // utility; with it, none remain.
    expect(indexCss).toMatch(/@custom-variant\s+dark\s+\(&:where\(\.dark,\s*\.dark\s*\*\)\)/);
  });

  it('declares it after the tailwind import, where it takes effect', () => {
    expect(indexCss.indexOf('@custom-variant')).toBeGreaterThan(indexCss.indexOf('@import "tailwindcss"'));
  });
});
