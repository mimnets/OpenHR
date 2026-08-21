import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { dlShell, dlBrand, dlNav, dlFooter } from '../components/shared/daylightShell';

/**
 * Drift guard for the six public shell components — plan item DL3.
 *
 * These six wrap all 12 public pages and are near-duplicates of one another. They have already
 * drifted once: Contact pointed at the homepage in two of the three footers and not the third
 * (F-N4). DL3's whole premise is that they must look identical, so "identical" is asserted here
 * rather than left to a screenshot pass nobody will repeat.
 *
 * Consolidating the six into one pair is item N6 and is deliberately still outstanding. Until
 * then this is what holds the line.
 */

const SHELLS = [
  ['landing/Navbar', 'src/components/landing/Navbar.tsx'],
  ['landing/Footer', 'src/components/landing/Footer.tsx'],
  ['blog/BlogNavbar', 'src/components/blog/BlogNavbar.tsx'],
  ['blog/BlogFooter', 'src/components/blog/BlogFooter.tsx'],
  ['tutorials/TutorialsNavbar', 'src/components/tutorials/TutorialsNavbar.tsx'],
  ['tutorials/TutorialsFooter', 'src/components/tutorials/TutorialsFooter.tsx'],
] as const;

const read = (p: string) => fs.readFileSync(path.resolve(p), 'utf-8');

describe.each(SHELLS)('%s', (_name, file) => {
  const src = read(file);

  it('draws its styling from the shared Daylight vocabulary', () => {
    expect(src).toContain("from '../shared/daylightShell'");
  });

  it('carries no legacy slate/primary utilities', () => {
    // Anything left here is a surface the restyle missed, which is how half-themed pages happen.
    const legacy = src.match(/slate-\d|text-primary\b|bg-primary\b|primary-hover|#f59e0b|#10b981/g);
    expect(legacy ?? []).toEqual([]);
  });

  it('does not hardcode a hex colour', () => {
    // The token layer is the single source of truth; a literal hex bypasses both palettes.
    expect(src.match(/#[0-9a-fA-F]{6}\b/g) ?? []).toEqual([]);
  });
});

describe('Daylight shell vocabulary', () => {
  const all = [
    ...Object.values(dlShell),
    ...Object.values(dlBrand),
    ...Object.values(dlNav),
    ...Object.values(dlFooter),
  ];

  it('never puts text on --dl-soft', () => {
    // --dl-soft is 3.3:1. It is for hairlines, ticks and dividers only, and the token contract
    // test asserts it stays below AA — so it must never be reachable as a text colour.
    for (const cls of all) {
      expect(cls).not.toMatch(/\btext-dl-soft\b/);
    }
  });

  it('reserves dawn/noon/dusk for the arc and the logo mark (AC-DL3)', () => {
    for (const cls of all) {
      expect(cls).not.toMatch(/dl-(dawn|noon|dusk)/);
    }
  });

  it('keeps the footer dark in both themes', () => {
    // --dl-ink is near-black in light and near-white in dark, so a bare bg-dl-ink footer would
    // render white in dark mode. Both halves of the pair must be present.
    expect(dlFooter.root).toContain('bg-dl-ink');
    expect(dlFooter.root).toContain('dark:bg-dl-ground');
  });

  it('uses teal, not the app primary, as the public action colour', () => {
    expect(dlNav.buttonPrimary).toContain('bg-dl-teal');
    expect(dlNav.buttonPrimary).not.toContain('bg-primary');
  });

  it('keeps the nav spacer the same height as the nav row', () => {
    // A spacer that drifts from the row height hides content behind the fixed bar.
    expect(dlShell.spacer).toBe('h-16 md:h-20');
    expect(dlShell.row).toContain('h-16 md:h-20');
  });
});

describe('shell consistency', () => {
  it('gives both content navbars the same styling vocabulary', () => {
    const blog = read('src/components/blog/BlogNavbar.tsx');
    const tut = read('src/components/tutorials/TutorialsNavbar.tsx');
    const tokens = (s: string) => [...new Set(s.match(/dl(?:Shell|Brand|Nav|Footer)\.\w+/g) ?? [])].sort();
    expect(tokens(tut)).toEqual(tokens(blog));
  });

  it('gives all three footers the same styling vocabulary', () => {
    const tokens = (p: string) =>
      [...new Set(read(p).match(/dl(?:Shell|Brand|Nav|Footer)\.\w+/g) ?? [])].sort();
    const blog = tokens('src/components/blog/BlogFooter.tsx');
    expect(tokens('src/components/tutorials/TutorialsFooter.tsx')).toEqual(blog);
    expect(tokens('src/components/landing/Footer.tsx')).toEqual(blog);
  });
});
