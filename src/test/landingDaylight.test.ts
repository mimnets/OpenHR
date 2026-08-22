import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';


/**
 * Acceptance tests for the landing page rebuild — plan item DL4, which also absorbs
 * Addendum 1's N4 (remove the fabricated testimonials) and N5 (section reorder + real prose).
 *
 * These assert the criteria the plan actually wrote down: AC-N4, AC-N5, AC-DL2, AC-DL3, AC-DL5.
 */

const read = (p: string) => fs.readFileSync(path.resolve(p), 'utf-8');
/** Test files reference the very strings under test; they must not count as offenders. */
const isTestFile = (p: string) => p.includes('__tests__') || p.includes('src' + path.sep + 'test');
const LANDING_DIR = path.resolve('src/components/landing');
const landingFiles = fs
  .readdirSync(LANDING_DIR)
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => path.join(LANDING_DIR, f));

describe('AC-N4 — no fabricated testimonials anywhere', () => {
  const INVENTED = ['TechCorp Solutions', 'Nexus Labs', 'GreenPath Initiative', 'Rajesh Kumar', 'Sarah Chen', 'David Okafor'];

  it.each(INVENTED)('no trace of %s in src/', (needle) => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(tsx?|css)$/.test(entry.name) && !isTestFile(full) && read(full).includes(needle)) hits.push(full);
      }
    };
    walk(path.resolve('src'));
    expect(hits).toEqual([]);
  });

  it('the TestimonialsSection component is gone, not merely unmounted', () => {
    expect(fs.existsSync(path.join(LANDING_DIR, 'TestimonialsSection.tsx'))).toBe(false);
  });

  it('renders no star-rating markup on the landing page', () => {
    // Fabricated review stars are their own policy violation, separate from the invented quotes.
    for (const f of landingFiles) {
      expect(read(f)).not.toMatch(/fill-amber-400|aria-label="[0-9] out of 5"/);
    }
  });
});

describe('AC-N5 — section order and real prose', () => {
  const landing = read('src/pages/LandingPage.tsx');

  it('orders sections so the product is explained before it is vouched for', () => {
    const order = ['HeroSection', 'FeaturesSection', 'HowItWorksSection', 'ShowcaseSection', 'ProofSection', 'PricingSection', 'FAQSection', 'RoadmapSection', 'CTASection'];
    const positions = order.map((name) => landing.indexOf(`<${name}`));
    expect(positions.every((p) => p > -1)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('places the proof block immediately after the showcase', () => {
    expect(landing.indexOf('<ProofSection')).toBeGreaterThan(landing.indexOf('<ShowcaseSection'));
    expect(landing.indexOf('<ProofSection')).toBeLessThan(landing.indexOf('<PricingSection'));
  });

  it('no longer duplicates the contact form inline', () => {
    // /contact is a distinct page (N1); the inline copy gave two routes to the same submission.
    expect(landing).not.toContain('<ContactSection');
  });

  it('carries at least 300 words of prose outside headings and card labels', () => {
    // F-L3: the page previously had exactly one text block over 40 characters that was not a
    // heading or a card label, which gives search and answer engines nothing to extract.
    const prose: string[] = [];
    for (const f of [...landingFiles, path.resolve('src/pages/LandingPage.tsx')]) {
      const src = read(f);
      // Text inside <p> elements, plus the `description` fields the cards render.
      for (const m of src.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) prose.push(m[1]);
      for (const m of src.matchAll(/(?:description|body):\s*'([^']{40,})'/g)) prose.push(m[1]);
    }
    const words = prose
      .join(' ')
      .replace(/\{[^}]*\}/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-zA-Z]/.test(w));
    expect(words.length).toBeGreaterThanOrEqual(300);
  });
});

describe('AC-DL2 / AC-DL3 — the arc is the one motif, in one place', () => {
  it('is imported exactly once across the whole codebase', () => {
    const importers: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tsx$/.test(entry.name) && /from '.*ShiftArc'/.test(read(full))) importers.push(full);
      }
    };
    walk(path.resolve('src'));
    expect(importers).toHaveLength(1);
    expect(importers[0]).toMatch(/HeroSection\.tsx$/);
  });

  it('confines the dawn/noon/dusk gradient to the arc', () => {
    // The gradient id is the grep handle AC-DL3 names.
    const arc = read('src/components/landing/ShiftArc.tsx');
    expect(arc).toContain('id="dl-day-arc"');

    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(tsx?|css)$/.test(entry.name) && !/ShiftArc\.tsx$/.test(full) && !isTestFile(full)) {
          const src = read(full);
          // index.css legitimately *defines* the tokens; nothing else may consume them.
          if (/ShiftArc/.test(src)) continue;
          if (/dl-day-arc/.test(src)) offenders.push(full);
          if (/(?:bg|text|fill|stroke)-dl-(?:dawn|noon|dusk)\b/.test(src)) offenders.push(full);
        }
      }
    };
    walk(path.resolve('src'));
    // No exceptions. The hero's ambient wash was briefly dl-dusk/5; it is dl-ink/5 now
    // precisely so this list can stay empty rather than acquire a carve-out.
    expect(offenders).toEqual([]);
  });
});

describe('AC-DL5 — motion stops under prefers-reduced-motion', () => {
  const css = read('src/index.css');

  it('animates the arc only when motion is welcome', () => {
    const block = css.slice(css.indexOf('.dl-arc__stroke'));
    expect(block).toContain('@media (prefers-reduced-motion: no-preference)');
    const animIndex = block.indexOf('animation: dl-arc-draw');
    const guardIndex = block.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(guardIndex).toBeGreaterThan(-1);
    expect(animIndex).toBeGreaterThan(guardIndex);
  });

  it('renders the arc fully drawn when unanimated', () => {
    // stroke-dashoffset must default to 0, or a reduced-motion visitor sees no arc at all.
    const arcAt = css.indexOf('.dl-arc__stroke');
    const base = css.slice(arcAt, css.indexOf('@media (prefers-reduced-motion', arcAt));
    expect(base).toMatch(/stroke-dashoffset:\s*0/);
  });

  it('does not loop', () => {
    expect(css).not.toMatch(/dl-arc-draw[^;]*infinite/);
  });
});

describe('contrast — text on the teal action colour', () => {
  it('never puts pure white on teal', () => {
    // --dl-teal inverts to a light cyan (#5FBDCE) in dark mode, where white text falls to
    // roughly 1.7:1. text-dl-surface flips with the palette and stays legible in both.
    for (const f of [...landingFiles, path.resolve('src/components/shared/daylightShell.ts')]) {
      const src = read(f);
      for (const m of src.matchAll(/class[nN]ame[^\n]*bg-dl-teal\b[^\n]*/g)) {
        expect(m[0]).not.toMatch(/\btext-white\b/);
      }
    }
  });
});

describe('DL5 — the four content pages', () => {
  const PAGES = [
    'src/pages/BlogPage.tsx',
    'src/pages/BlogPostPage.tsx',
    'src/pages/TutorialsPage.tsx',
    'src/pages/TutorialPage.tsx',
  ];

  it.each(PAGES)('%s carries no legacy slate/primary utilities', (page) => {
    const legacy = read(page).match(
      /(?:bg|text|border|shadow|from|to|via|ring|divide)-(?:slate|primary|white)-?[0-9/]*/g
    );
    expect(legacy ?? []).toEqual([]);
  });

  it.each(PAGES)('%s hardcodes no hex colour', (page) => {
    expect(read(page).match(/#[0-9a-fA-F]{6}/g) ?? []).toEqual([]);
  });

  it('keeps the article body on prose-slate + dark:prose-invert', () => {
    // This pairing renders the crawlable article content and the .dark .prose overrides in
    // index.css are tuned to it. Restyling the shell must not disturb the body.
    for (const page of ['src/pages/BlogPostPage.tsx', 'src/pages/TutorialPage.tsx']) {
      const src = read(page);
      expect(src).toContain('prose prose-slate');
      expect(src).toContain('dark:prose-invert');
    }
  });

  it('passes real article length to the thin-content ad guard', () => {
    // Item 28's guard falls back to measuring the DOM, which can run before the article has
    // rendered. The post knows its own length, so it says so.
    const src = read('src/pages/BlogPostPage.tsx');
    for (const m of src.matchAll(/<PublicAdBanner slot="blog-post-[a-z]+"[^/]*\/>/g)) {
      expect(m[0]).toContain('contentLength=');
    }
  });
});

describe('DL6 — the features pages', () => {
  const PAGES = ['src/pages/FeaturesPage.tsx', 'src/pages/FeatureDetailPage.tsx'];

  it.each(PAGES)('%s carries no legacy slate/primary utilities', (page) => {
    const legacy = read(page).match(
      /(?:bg|text|border|shadow|from|to|via|ring|divide)-(?:slate|primary|white|amber|emerald)-?[0-9/]*/g
    );
    expect(legacy ?? []).toEqual([]);
  });

  it.each(PAGES)('%s hardcodes no hex colour', (page) => {
    expect(read(page).match(/#[0-9a-fA-F]{6}/g) ?? []).toEqual([]);
  });

  it.each(PAGES)('%s needs no dark: overrides', (page) => {
    // Daylight tokens carry their own dark values, so a dark: variant here would mean a
    // surface that had to be remembered rather than one that flips on its own (D2).
    const overrides = read(page).match(/dark:(?!prose-invert)[a-z:0-9./-]+/g);
    expect(overrides ?? []).toEqual([]);
  });
});

describe('DL7 — trust and policy pages', () => {
  const PAGES = [
    'src/pages/AboutPage.tsx',
    'src/pages/ContactPage.tsx',
    'src/pages/ChangelogPage.tsx',
    'src/pages/PrivacyPolicyPage.tsx',
    'src/pages/TermsOfServicePage.tsx',
    'src/components/landing/ContactSection.tsx',
  ];

  it.each(PAGES)('%s carries no legacy slate/primary utilities', (page) => {
    const legacy = read(page).match(
      /(?:bg|text|border|shadow|from|to|via|ring|divide)-(?:slate|primary|white)-?[0-9/]*/g
    );
    expect(legacy ?? []).toEqual([]);
  });

  it('keeps the About dark slab dark in both themes', () => {
    // Same trap as the footer: --dl-ink is near-white in dark, so a bare bg-dl-ink panel
    // would invert to a white slab with white text on it.
    const src = read('src/pages/AboutPage.tsx');
    expect(src).toContain('bg-dl-ink dark:bg-dl-ground');
    expect(src).toContain('text-dl-surface dark:text-dl-ink');
  });

  it('keeps the required-field marker red rather than recolouring it to brand', () => {
    // Daylight's two-tone rule governs interactive colour, not semantic state. A required
    // marker that reads as brand no longer reads as "required".
    const src = read('src/components/landing/ContactSection.tsx');
    expect(src).toContain('text-red-600 dark:text-red-400');
  });
});

describe('the whole public surface', () => {
  // Every page a logged-out visitor can reach. If a thirteenth is added, add it here.
  const PUBLIC_PAGES = [
    'src/pages/LandingPage.tsx',
    'src/pages/BlogPage.tsx',
    'src/pages/BlogPostPage.tsx',
    'src/pages/TutorialsPage.tsx',
    'src/pages/TutorialPage.tsx',
    'src/pages/FeaturesPage.tsx',
    'src/pages/FeatureDetailPage.tsx',
    'src/pages/AboutPage.tsx',
    'src/pages/ContactPage.tsx',
    'src/pages/ChangelogPage.tsx',
    'src/pages/PrivacyPolicyPage.tsx',
    'src/pages/TermsOfServicePage.tsx',
  ];

  it('has twelve pages, all on Daylight', () => {
    expect(PUBLIC_PAGES).toHaveLength(12);
    for (const page of PUBLIC_PAGES) {
      const legacy = read(page).match(
        /(?:bg|text|border|shadow|from|to|via|ring|divide)-(?:slate|primary|white)-?[0-9/]*/g
      );
      expect(legacy ?? [], `${page} still has legacy utilities`).toEqual([]);
    }
  });

  it('never sets white text on the teal action colour anywhere public', () => {
    // --dl-teal inverts to a light cyan in dark mode; white on it is roughly 1.7:1.
    for (const page of PUBLIC_PAGES) {
      for (const m of read(page).matchAll(/class[nN]ame[^\n]*bg-dl-teal\b[^\n]*/g)) {
        expect(m[0], `${page}`).not.toMatch(/text-white/);
      }
    }
  });

  it('leaves the logged-in app untouched (AC-DL6)', () => {
    // Daylight is for the public surface only. The app keeps its own --primary tokens; if
    // dl- utilities start appearing in the dashboard, the scope has quietly widened.
    const appPages = ['src/pages/Dashboard.tsx', 'src/pages/Reports.tsx'].filter((p) =>
      fs.existsSync(path.resolve(p))
    );
    for (const page of appPages) {
      expect(read(page)).not.toMatch(/(?:bg|text|border)-dl-/);
    }
  });
});
