/**
 * Cover image prompt generator.
 *
 * 27 of the 47 live articles have no cover_image, so every shared link falls
 * back to the site default and looks generic. This turns each record's real
 * metadata — title, category, excerpt — into an image generation prompt.
 *
 * The prompts are deliberately built from a single shared house style with only
 * the subject varying per article. A blog whose covers are visibly one set reads
 * as a maintained publication; 47 individually-styled images read as clip art.
 */

/** Brand tokens, from src/index.css (--primary / --primary-hover / --primary-light). */
export const BRAND = {
  primary: '#4a6fa5',
  primaryHover: '#3b5d8c',
  primaryLight: '#d4e4f7',
  ink: '#1e293b',
  paper: '#f1f5f9',
};

const HOUSE_STYLE =
  `Flat vector editorial illustration, generous negative space, soft geometric shapes. ` +
  `Strict palette: muted slate blue ${BRAND.primary} as the dominant colour, ` +
  `pale blue ${BRAND.primaryLight} for fills, deep slate ${BRAND.ink} for line work, ` +
  `off-white ${BRAND.paper} background. One clear focal subject, calm and professional, ` +
  `no photorealism, no gradients heavier than a subtle two-stop, no drop shadows. ` +
  `Composition weighted to the left third, leaving the right side open.`;

/**
 * The right side is left open on purpose: link-preview cards and the blog index
 * crop covers unpredictably, and a subject centred in the frame loses its head.
 */
const NEGATIVE =
  `no text, no lettering, no watermarks, no logos, no UI screenshots, no faces in close-up, ` +
  `no stock-photo people, no clutter, no busy backgrounds, no neon colours, no 3D render, ` +
  `no drop shadows, nothing cropped at the right edge`;

/**
 * Visual motif per category. Keys are matched case-insensitively against the
 * record's category, longest key first, so 'Performance Reviews' wins over
 * 'Performance'.
 */
const MOTIFS = {
  'getting started': 'an open doorway or a first footstep on a path, a simple onboarding checklist with the first item ticked',
  attendance: 'a stylised clock face beside a location pin, or a simple check-in card being tapped',
  leave: 'a calendar page with a few days softly highlighted, a paper plane leaving the page',
  employees: 'a small grid of abstract profile cards, one gently lifted forward',
  organization: 'a clean org chart of connected nodes branching from a single root',
  reports: 'a simple bar and line chart on a document, an export arrow leaving the page',
  settings: 'interlocking gears beside a row of toggle switches',
  'performance reviews': 'a five-point rating scale and a growth curve rising across the frame',
  performance: 'a growth curve rising across the frame beside a simple scorecard',
  announcements: 'a megaphone emitting soft concentric rings, a pinned notice card',
  'feature guide': 'an abstract product surface with one feature panel highlighted',
  'industry insights': 'an abstract landscape of data shapes viewed from above, a magnifying lens',
  'hr management': 'a set of abstract people-shapes arranged around a shared workspace',
  product: 'a layered abstract interface, panels stacked in depth',
  company: 'a simple building silhouette with connected nodes radiating outward',
};

function motifFor(category) {
  const cat = String(category || '').toLowerCase().trim();
  const keys = Object.keys(MOTIFS).sort((a, b) => b.length - a.length);
  for (const k of keys) if (cat.includes(k)) return MOTIFS[k];
  return 'an abstract workplace scene built from simple geometric shapes';
}

/** Strip trailing punctuation and the product name, which the motif already implies. */
function subjectFrom(title) {
  return String(title || '')
    .replace(/\s*[—–-]\s*(For|Free|Your|The)\b.*$/i, '')
    .replace(/\bOpenHRApp\b|\bOpenHR\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s—–-]+|[\s—–:.-]+$/g, '')
    .trim();
}

/**
 * Alt text describes the image for a reader who cannot see it.
 *
 * It is built from the untouched title rather than the stripped subject: the
 * stripping is tuned for prompt phrasing and happily turns "The Complete Guide
 * to OpenHR: Free Open Source..." into "the Complete Guide to : Free Open
 * Source...", which is worse than no alt text at all.
 */
function altTextFor(title, category, kind) {
  const clean = String(title || '').trim().replace(/\s+/g, ' ');
  const cat = category && category !== '—' ? `, ${category}` : '';
  return `Cover illustration for the OpenHRApp ${kind === 'guide' ? 'guide' : 'article'} "${clean}"${cat}`;
}

/**
 * @param {object} row  a tutorials or blog_posts record
 * @param {'guide'|'post'} kind
 */
export function buildCoverPrompt(row, kind) {
  const subject = subjectFrom(row.title);
  const motif = motifFor(row.category);
  const slug = row.slug;

  const prompt =
    `Editorial cover illustration for ${kind === 'guide' ? 'a how-to guide' : 'a blog article'} titled ` +
    `"${String(row.title || '').trim()}". Subject: ${motif}. ${HOUSE_STYLE} 16:9 landscape.`;

  return {
    slug,
    title: String(row.title || '').trim(),
    category: row.category || '—',
    kind,
    hasCover: Boolean(row.cover_image),
    existingCover: row.cover_image || null,
    filename: `openhr-cover-${slug}.jpg`,
    alt: altTextFor(row.title, row.category, kind),
    subject,
    prompt,
    negative: NEGATIVE,
  };
}

export const SPEC_NOTE = `**Output spec — the same for every image:**

| Setting | Value | Why |
|---|---|---|
| Dimensions | **1200 x 630** (or 1920 x 1080) | Both are the 1.91:1 / 16:9 ratio link-preview cards expect. Below 600 x 315 the card degrades to a small square thumbnail. |
| Format to generate | **PNG or JPEG** | Either is fine — do not hand-convert. |
| Format actually stored | **JPEG**, automatically | \`convertFileToJpeg(file, 0.85, 1920)\` runs on every cover upload (\`blog.service.ts\`, \`tutorial.service.ts\`), re-encoding to JPEG at quality 0.85 and capping the long edge at 1920px. PNG transparency is composited onto white first, because JPEG has no alpha channel and transparent pixels would otherwise turn black. |
| Do not upload WebP | — | Facebook, LinkedIn, X, and WhatsApp do not render WebP in link previews. Shipping WebP is the exact bug that made every shared OpenHR link show a blank card. The conversion above protects you, but generating WebP wastes a step. |
| Text in image | **None** | Cards crop unpredictably and overlay their own title. Text baked into the image gets cut in half. |
| Safe area | Keep the subject in the **left two thirds** | The right side is where crops and overlays land. |

**Alt text matters.** Each entry below carries a suggested \`alt\` value. Set it when
uploading rather than leaving it blank: it is read by screen readers and is one of the
few remaining places to state what a page is about in plain language.`;
