import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Guards against theme flashing on load.
 *
 * Three separate flashes were reported as "two different themes on refresh":
 *
 *  A. index.html's boot script bailed when no theme was cached, so the first
 *     paint used index.css's --primary (#4a6fa5, arctic-frost) while React then
 *     applied getCachedTheme()'s fallback (charcoal-slate, #475569).
 *  B. ThemeContext initialised darkModePreference to 'system' and read the real
 *     preference in a useEffect, so React's first commit removed the .dark class
 *     the boot script had already set, then re-added it a render later.
 *  C. The platform default re-fetched on idle, every 60s, and on every
 *     visibilitychange, re-applying an identical theme each time.
 *
 * The boot script duplicates the theme table because it must run before any
 * module loads. These assertions keep the copy honest.
 */

const root = path.resolve(__dirname, '../..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const themeContext = fs.readFileSync(path.join(root, 'src/context/ThemeContext.tsx'), 'utf8');

/** `{ id: 'x', name: '...', colors: { primary: '#hex', hover: '#hex', light: '#hex' } }` */
function themesFromContext(): Record<string, { p: string; h: string; l: string }> {
  const out: Record<string, { p: string; h: string; l: string }> = {};
  const re = /\{\s*id:\s*'([^']+)',\s*name:\s*'[^']*',\s*colors:\s*\{\s*primary:\s*'([^']+)',\s*hover:\s*'([^']+)',\s*light:\s*'([^']+)'\s*\}\s*\}/g;
  for (const m of themeContext.matchAll(re)) {
    out[m[1]] = { p: m[2], h: m[3], l: m[4] };
  }
  return out;
}

/** `'x': { p: '#hex', h: '#hex', l: '#hex' }` */
function themesFromBootScript(): Record<string, { p: string; h: string; l: string }> {
  const out: Record<string, { p: string; h: string; l: string }> = {};
  const re = /'([a-z-]+)':\s*\{\s*p:\s*'([^']+)',\s*h:\s*'([^']+)',\s*l:\s*'([^']+)'\s*\}/g;
  for (const m of indexHtml.matchAll(re)) {
    out[m[1]] = { p: m[2], h: m[3], l: m[4] };
  }
  return out;
}

describe('boot script theme table matches ThemeContext', () => {
  it('finds both tables', () => {
    expect(Object.keys(themesFromContext()).length).toBeGreaterThan(10);
    expect(Object.keys(themesFromBootScript()).length).toBeGreaterThan(10);
  });

  it('defines exactly the same themes', () => {
    expect(Object.keys(themesFromBootScript()).sort()).toEqual(Object.keys(themesFromContext()).sort());
  });

  it('uses identical colours for every theme', () => {
    // A mismatch here paints one colour before React mounts and a different one
    // after — the flash this whole file exists to prevent.
    expect(themesFromBootScript()).toEqual(themesFromContext());
  });
});

describe('cold load paints the same theme React will pick', () => {
  it('the boot script falls back to a default instead of bailing', () => {
    expect(indexHtml).toMatch(/localStorage\.getItem\('openhr-global-theme'\)\s*\|\|\s*'([a-z-]+)'/);
    expect(indexHtml).not.toMatch(/var themeId = localStorage\.getItem\('openhr-global-theme'\);\s*\n\s*if \(!themeId\) return;/);
  });

  it('the boot script default is the same theme ThemeContext falls back to', () => {
    const bootDefault = /localStorage\.getItem\('openhr-global-theme'\)\s*\|\|\s*'([a-z-]+)'/.exec(indexHtml)?.[1];
    const contextDefault = /THEMES\.find\(t => t\.id === '([a-z-]+)'\)/.exec(themeContext)?.[1];

    expect(bootDefault).toBeDefined();
    expect(contextDefault).toBeDefined();
    expect(bootDefault).toBe(contextDefault);
  });

  it('an unknown cached id falls back rather than leaving the stylesheet default', () => {
    expect(indexHtml).toMatch(/themes\[themeId\]\s*\|\|\s*themes\['[a-z-]+'\]/);
  });
});

describe('theme is applied before paint, not after', () => {
  it('reads the dark preference in the state initialiser, not an effect', () => {
    expect(themeContext).toContain('useState<DarkModePreference>(getStoredDarkPreference)');
    // The old effect-based read is what caused React to undo the boot script.
    expect(themeContext).not.toMatch(/useEffect\(\(\) => \{\s*const savedDark = localStorage/);
  });

  it('applies the dark class and CSS variables in a layout effect', () => {
    // useEffect runs after paint, so the correction itself would be visible.
    const darkBlock = themeContext.slice(themeContext.indexOf('// Apply dark class'));
    expect(darkBlock.slice(0, 400)).toContain('useLayoutEffect');

    const varsBlock = themeContext.slice(themeContext.indexOf('// Apply CSS variables'));
    expect(varsBlock.slice(0, 400)).toContain('useLayoutEffect');
  });

  it('does not re-apply an unchanged theme after the platform fetch', () => {
    expect(themeContext).toContain('prev.id === themeId ? prev : found');
  });
});

describe('dark: variant is bound to the .dark class, not the OS', () => {
  const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');

  it('declares the custom variant', () => {
    // Tailwind v4 defaults `dark:` to @media (prefers-color-scheme: dark). This
    // app toggles a .dark class instead, and index.css's override rules are keyed
    // on that class. Without this line the two disagree and any user whose OS
    // scheme differs from their chosen theme gets a half-themed page.
    //
    // Verified by building both ways: without the declaration the bundle emits a
    // prefers-color-scheme media query wrapping every dark: utility; with it,
    // none remain and all 194 rules are scoped to .dark.
    expect(indexCss).toMatch(/@custom-variant\s+dark\s+\(&:where\(\.dark,\s*\.dark\s*\*\)\)/);
  });

  it('declares it after the tailwind import, where it takes effect', () => {
    expect(indexCss.indexOf('@custom-variant')).toBeGreaterThan(indexCss.indexOf('@import "tailwindcss"'));
  });
});
