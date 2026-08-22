/**
 * Daylight shell vocabulary — plan item DL3.
 *
 * Six components (Navbar, Footer, BlogNavbar, BlogFooter, TutorialsNavbar, TutorialsFooter)
 * wrap all 12 public pages, and they are near-duplicates of each other. That duplication has
 * already produced one drift bug: Contact pointed at the homepage in two of the three footers
 * and not the third (F-N4). Restyling six copies by hand would have been the same trap with a
 * new coat of paint.
 *
 * So the class strings live here once and every shell imports them. The components stay
 * separate — consolidating them into one PublicNavbar/PublicFooter pair is item N6, deliberately
 * kept as its own change — but they can no longer drift *visually*, which is the property DL3
 * actually needs.
 *
 * ── Why there are almost no `dark:` variants ────────────────────────────────────────────────
 * `html.dark` in src/index.css redefines the same `--dl-*` custom properties with the dark
 * palette (src/index.css:161-181). A utility like `bg-dl-surface` therefore resolves to #FFFFFF
 * in light and #102026 in dark on its own. That is what takes these components out of the D2
 * failure class entirely: D2 exists because the override sheet has to *enumerate* every utility
 * it wants to remap, so anything it forgets (bg-white/95 — the sticky navbar) renders wrong.
 * Tokens that carry their own dark value cannot be forgotten.
 *
 * The exception is the footer, which is a dark slab in *both* themes. See DARK_SLAB below.
 *
 * ── Palette rules that are not negotiable ───────────────────────────────────────────────────
 * - `--dl-soft` is 3.3:1 and must never carry text. Hairlines, ticks and dividers only.
 * - dawn/noon/dusk are reserved for the arc and the logo mark (AC-DL3). Nothing here uses them.
 * - Teal is the interactive colour; ink is text. Two tones, no third accent.
 */

/** Page-level chrome. */
export const dlShell = {
  /** Fixed navigation bar, opaque. Used by the two content navbars. */
  nav: 'fixed top-0 left-0 right-0 z-50 bg-dl-surface/95 backdrop-blur-md border-b border-dl-hair-soft transition-all duration-300',
  /** Fixed navigation bar over a hero — transparent until scrolled. Landing only. */
  navFloating: 'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
  navFloatingAtTop: 'bg-transparent',
  navFloatingScrolled: 'bg-dl-surface/95 backdrop-blur-md shadow-dl-1 border-b border-dl-hair-soft',

  inner: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  row: 'flex items-center justify-between h-16 md:h-20',
  /** Matches `row` height so content clears the fixed bar. */
  spacer: 'h-16 md:h-20',
} as const;

/** Brand lockup. */
export const dlBrand = {
  trigger: 'flex items-center gap-2 cursor-pointer',
  frame:
    'w-12 h-12 bg-dl-surface rounded-dl-md flex items-center justify-center p-1.5 border border-dl-hair shadow-dl-1 overflow-hidden',
  frameSmall:
    'w-11 h-11 bg-dl-surface rounded-dl-md flex items-center justify-center p-1.5 shadow-dl-1 overflow-hidden',
  /**
   * Two-tone wordmark. The previous lockup used three unrelated hues (primary, amber #f59e0b,
   * emerald #10b981) — a third and fourth accent that Daylight has no room for, and that
   * commit 0508e82 already began removing when it dropped the selectable accent themes.
   */
  word: 'font-dl-display text-dl-lg font-semibold tracking-dl-head',
  wordInk: 'text-dl-ink',
  wordAccent: 'text-dl-teal',
  /**
   * The same wordmark for the footer slab, which is dark in BOTH themes
   * (--dl-ink in light, --dl-ground in dark). The pair above cannot be used
   * there: text-dl-ink on the light-mode slab is ink on ink — 1.0:1, so "Open"
   * and "App" simply vanished and the footer read as a floating "HR". The
   * accent needs the fixed slab tone for the same reason; --dl-teal is 2.6:1
   * against the light-mode slab. Locked by daylightTokens.test.ts.
   */
  wordOnSlab: 'text-dl-surface dark:text-dl-ink',
  wordAccentOnSlab: 'text-dl-teal-slab',
} as const;

/** Navigation links and controls. */
export const dlNav = {
  link: 'text-dl-sm font-semibold text-dl-muted hover:text-dl-teal transition-colors',
  linkActive: 'text-dl-sm font-semibold text-dl-teal transition-colors',

  iconButton: 'p-2.5 rounded-dl-md text-dl-muted hover:text-dl-teal hover:bg-dl-surface-2 transition-all',
  iconButtonCompact: 'p-2 rounded-dl-sm text-dl-muted hover:text-dl-teal transition-colors',

  /** The Ctrl+K search affordance on the landing bar. */
  searchTrigger:
    'flex items-center gap-2 px-3 py-1.5 text-dl-sm text-dl-muted bg-dl-surface-2 hover:bg-dl-hair-soft rounded-dl-sm transition-colors border border-dl-hair',
  searchKbd:
    'text-[10px] font-dl-mono font-medium text-dl-muted bg-dl-surface px-1.5 py-0.5 rounded border border-dl-hair',

  /** Secondary action — Login. */
  buttonQuiet:
    'px-5 py-2.5 text-dl-sm font-bold text-dl-ink bg-dl-surface-2 hover:bg-dl-hair-soft rounded-dl-md transition-colors border border-dl-hair',
  /** Secondary action rendered without a chip, used by the content navbars. */
  buttonBare: 'px-5 py-2.5 text-dl-sm font-bold text-dl-muted hover:text-dl-teal transition-colors',
  /**
   * Primary action — Get Started. Teal is the action colour on the public surface.
   * Carries the same dl-cta-pulse halo and sheen as the hero button, so the one
   * conversion action looks the same wherever a visitor meets it. Defined in
   * src/index.css; stops under prefers-reduced-motion.
   */
  buttonPrimary:
    'dl-cta-pulse px-5 py-2.5 bg-dl-teal hover:bg-dl-teal-deep text-dl-surface text-dl-sm font-bold rounded-dl-md transition-colors shadow-dl-1',

  mobilePanel: 'md:hidden bg-dl-surface border-t border-dl-hair-soft shadow-dl-2',
  mobilePanelInner: 'px-4 py-4 space-y-1',
  mobileLink:
    'flex items-center gap-2 w-full text-left px-4 py-3 text-dl-sm font-semibold text-dl-muted hover:text-dl-teal hover:bg-dl-surface-2 rounded-dl-md transition-colors',
  mobileLinkActive:
    'flex items-center gap-2 w-full text-left px-4 py-3 text-dl-sm font-semibold text-dl-teal bg-dl-teal/5 rounded-dl-md transition-colors',
  mobileDivider: 'pt-3 mt-3 border-t border-dl-hair-soft space-y-2',
  mobileButtonQuiet:
    'block w-full px-4 py-3 text-dl-sm font-bold text-dl-muted hover:bg-dl-surface-2 rounded-dl-md text-center transition-colors',
  mobileButtonPrimary:
    'dl-cta-pulse block w-full px-4 py-3 bg-dl-teal hover:bg-dl-teal-deep text-dl-surface text-dl-sm font-bold rounded-dl-md text-center transition-colors',
} as const;

/**
 * The footer is a dark slab in BOTH themes, which is the one place the automatic token flip
 * works against us: `--dl-ink` is near-black in light and near-white in dark, so `bg-dl-ink`
 * alone would render a white footer in dark mode.
 *
 * Each pair below therefore names the light-theme token first and the dark-theme token in a
 * `dark:` variant, chosen so both sides land dark-on-dark. These `dark:` variants are correct
 * *because* D1 landed — before `@custom-variant dark` was declared they would have followed the
 * OS rather than the in-app toggle, which is precisely the D1 bug.
 */
export const dlFooter = {
  root: 'bg-dl-ink dark:bg-dl-ground text-dl-surface dark:text-dl-ink pt-16 pb-8',
  inner: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: 'grid grid-cols-2 md:grid-cols-4 gap-8 mb-12',
  brandCol: 'col-span-2 md:col-span-1',
  /** Body copy on the slab. Deliberately not --dl-soft, which may never carry text. */
  blurb: 'text-dl-sm text-dl-surface/70 dark:text-dl-muted leading-relaxed',
  columnHead:
    'text-dl-xs font-bold uppercase tracking-dl-label text-dl-surface/80 dark:text-dl-muted mb-4',
  list: 'space-y-3 max-sm:space-y-0',
  /**
   * `min-h-11` below `sm` only. These render 21px tall at 375, under the 24px
   * WCAG 2.2 2.5.8 minimum and well under a comfortable thumb target; the
   * desktop footer is unchanged, and `max-sm:space-y-0` absorbs most of the
   * added height so the mobile footer does not grow by 11 rows × 23px.
   */
  link: 'inline-flex items-center max-sm:min-h-11 text-dl-sm text-dl-surface/70 dark:text-dl-muted hover:text-dl-surface dark:hover:text-dl-ink transition-colors',
  bottomBar:
    'border-t border-dl-surface/15 dark:border-dl-hair pt-8 flex flex-col sm:flex-row items-center justify-between gap-4',
  fine: 'text-dl-xs text-dl-surface/60 dark:text-dl-muted',
  /** "Back to top" measured 18px tall — the smallest target on any public page. */
  fineAction: 'inline-flex items-center min-h-6 max-sm:min-h-11 text-dl-xs text-dl-surface/60 dark:text-dl-muted hover:text-dl-surface dark:hover:text-dl-ink transition-colors',
  social:
    'p-2 rounded-dl-sm text-dl-surface/70 dark:text-dl-muted hover:text-dl-surface dark:hover:text-dl-ink hover:bg-dl-surface/10 dark:hover:bg-dl-hair transition-all',
} as const;
