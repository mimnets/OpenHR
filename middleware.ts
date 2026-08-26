/**
 * Vercel Edge Middleware — Crawler Prerender
 *
 * OpenHRApp's public site is a client-rendered SPA (src/App.tsx routes off `currentPath`
 * state, no router). Crawlers that don't execute JavaScript therefore see an empty
 * shell on every URL. This middleware detects crawlers and returns server-rendered
 * HTML instead.
 *
 * Two tiers, because they need different things:
 *
 *   SOCIAL_BOT_RE   — link-preview bots (Facebook, Slack, WhatsApp, ...). They only
 *                     read <head>, so they get metadata and an empty body. Cheap.
 *
 *   INDEX_BOT_RE    — search engines (Googlebot, Bingbot), the AdSense crawler
 *                     (Mediapartners-Google), and AI answer engines (GPTBot,
 *                     PerplexityBot, ClaudeBot, ...). These need the actual article
 *                     text, so they get a full semantic document plus JSON-LD.
 *
 * IMPORTANT — this is not cloaking. The prerendered document must contain the same
 * content the SPA renders for a human at the same URL, drawn from the same Supabase
 * rows. Never serve crawler-specific copy, keywords, or links from here.
 *
 * Real users always fall through to the SPA unchanged.
 */

export const config = {
  matcher: [
    '/',
    '/blog',
    '/blog/:slug+',
    '/how-to-use',
    '/how-to-use/:slug+',
    '/features',
    '/features/:slug+',
    '/contact',
    '/sitemap.xml',
  ],
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE_URL = 'https://openhrapp.com';
/**
 * Social preview image.
 *
 * Deliberately PNG, not WebP. Facebook, LinkedIn, X, and WhatsApp do not render
 * WebP in og:image — they support JPEG/PNG/GIF — so a .webp here silently
 * produces a preview card with no image at all.
 */
interface SocialImage {
  url: string;
  type: string;
  width?: number;
  height?: number;
  alt?: string;
}

const DEFAULT_IMAGE: SocialImage = {
  url: `${SITE_URL}/img/screenshot-wide.png`,
  type: 'image/png',
  width: 1920,
  height: 1080,
  alt: 'OpenHRApp — free open-source HR management software',
};

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
};

/**
 * Turns a storage path into a shareable image, falling back to the default when
 * the stored cover is a format link-preview crawlers cannot render.
 *
 * Blog covers are currently uploaded as WebP (src/utils/imageConvert.ts), so
 * existing posts fall back here. New uploads store a JPEG so the post's own
 * cover is used.
 */
function socialImageFor(coverPath: string | null | undefined, alt?: string): SocialImage {
  if (!coverPath) return { ...DEFAULT_IMAGE, alt: alt || DEFAULT_IMAGE.alt };

  const ext = (coverPath.split('.').pop() || '').toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) {
    // WebP/AVIF/unknown — crawlers would drop it, so serve something renderable.
    return { ...DEFAULT_IMAGE, alt: alt || DEFAULT_IMAGE.alt };
  }

  return {
    url: `${SUPABASE_URL}/storage/v1/object/public/content-images/${coverPath}`,
    type: mime,
    alt: alt || DEFAULT_IMAGE.alt,
  };
}
const DEFAULT_DESCRIPTION = 'Free, open-source HR management system with attendance tracking, leave management, employee directory, and compliance tools.';
const PUBLISHER_NAME = 'OpenHRApp';

// A byline matching the site's own name is the publishing organization, not a
// person. Anything else is treated as a named author.
// Must keep matching the legacy spellings too: rows written before the name was
// normalised carry bylines of "OpenHR" and "OpenHR Team", and treating those as
// a Person emits invalid structured data.
const AUTHOR_IS_ORGANIZATION = /^\s*OpenHR(App)?( Team)?\s*$/i;

// Link-preview crawlers — metadata only.
const SOCIAL_BOT_RE = /facebookexternalhit|LinkedInBot|Twitterbot|Slackbot-LinkExpanding|Slackbot|WhatsApp|TelegramBot|Discordbot|Pinterestbot|Embedly|Quora Link Preview|Rogerbot|Showyoubot|Outbrain|W3C_Validator/i;

// Indexing and answer-engine crawlers — full content.
// Mediapartners-Google is the AdSense crawler; it is the one that decides whether
// this site has content worth serving ads against.
const INDEX_BOT_RE = /Googlebot|Google-InspectionTool|Mediapartners-Google|AdsBot-Google|Storebot-Google|Google-Extended|Bingbot|BingPreview|Slurp|DuckDuckBot|Baiduspider|YandexBot|Applebot|GPTBot|OAI-SearchBot|ChatGPT-User|PerplexityBot|Perplexity-User|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|CCBot|Amazonbot|meta-externalagent|cohere-ai|Diffbot|Bytespider/i;

const SUPABASE_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'User-Agent': 'OpenHRApp-Prerender/2.0',
};

// Static feature metadata — mirrors src/data/features.ts FEATURES array.
// Inlined here because Edge Runtime cannot import from src/.
const FEATURE_META: Record<string, { title: string; description: string }> = {
  'attendance-tracking': {
    title: 'Attendance Tracking Software | OpenHRApp - Selfie & GPS Check-In',
    description: 'Track employee attendance with selfie-based check-in, GPS verification, and real-time dashboards. Supports office and factory shift modes. Free and open-source.',
  },
  'leave-management': {
    title: 'Leave Management System | OpenHRApp - Request, Approve & Track',
    description: 'Streamline leave requests, approvals, and balance tracking. Configure custom leave types with automatic calculations. Free HR leave management software.',
  },
  'performance-reviews': {
    title: 'Performance Review Software | OpenHRApp - Structured Review Cycles',
    description: 'Run structured performance reviews with self-assessment, manager evaluation, and HR finalization. Customizable competencies and rating scales. Free HRMS.',
  },
  'gps-geofencing': {
    title: 'GPS Attendance Tracking | OpenHRApp - Location Verified Check-In',
    description: 'Verify employee attendance with GPS location tracking. Ensure employees check in from approved locations. Ideal for remote teams and field workers.',
  },
  'biometric-selfie-verification': {
    title: 'Selfie-Based Attendance | OpenHRApp - Photo Verified Check-In',
    description: 'Prevent buddy punching with selfie-based attendance verification. Photo evidence ensures authentic check-ins. No special hardware needed.',
  },
  'employee-directory': {
    title: 'Employee Directory & HR Database | OpenHRApp - Centralized Team Management',
    description: 'Manage employee profiles, departments, and org structure in one place. Role-based access, bulk import, and searchable directory. Free open-source HRMS.',
  },
  'reports-analytics': {
    title: 'HR Reports & Analytics | OpenHRApp - Data-Driven HR Decisions',
    description: 'Generate attendance reports, leave utilization analytics, and team performance insights. Interactive charts and CSV export. Free open-source HR reporting.',
  },
};

interface PageMeta {
  title: string;
  description: string;
  image: SocialImage;
  url: string;
}

interface ArticleBody {
  /** Sanitized HTML for the article content. */
  html: string;
  heading: string;
  author?: string;
  publishedAt?: string;
  category?: string;
  readingTime?: number;
  /** Drives the JSON-LD @type and the breadcrumb trail. */
  kind: 'blog' | 'guide' | 'feature' | 'index';
  breadcrumb: { name: string; url: string }[];
}

/* ------------------------------------------------------------------ *
 * Escaping and sanitization
 * ------------------------------------------------------------------ */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * XML escaping for sitemap output.
 *
 * Distinct from escapeHtml because XML has no named entities beyond the five
 * predefined ones, and an apostrophe in a slug or title must be numeric or
 * `&apos;` — `&#39;` is the safe choice in both.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** JSON-LD lives inside a <script> block; `<` and `&` must not break out of it. */
function jsonLdSafe(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'span', 'div',
  'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'small',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'pre', 'code',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  th: new Set(['colspan', 'rowspan', 'scope']),
  td: new Set(['colspan', 'rowspan']),
};

/** Tags whose *contents* are dropped, not just the tag itself. */
const STRIP_WITH_CONTENT = /<(script|style|iframe|object|embed|noscript|template|svg|math|form|input|button|select|textarea)\b[\s\S]*?<\/\1\s*>/gi;

export function isSafeUrl(value: string): boolean {
  // Browsers ignore control characters and spaces embedded in a scheme, so
  // `java\tscript:alert(1)` is live markup. Strip everything at or below U+0020
  // plus DEL before matching. Written as a codepoint filter rather than a regex
  // range so no literal control bytes end up in this file.
  const normalized = Array.from(value)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 0x20 && code !== 0x7f;
    })
    .join('');

  // Allowlist, not denylist: anything unrecognised is rejected, so novel
  // obfuscations fail closed.
  if (/^(https?:|mailto:|tel:)/i.test(normalized)) return true;
  // Relative links (internal guide/feature cross-links) are fine.
  if (/^[/#]/.test(normalized)) return true;
  return false;
}

/**
 * Allowlist sanitizer for Edge Runtime.
 *
 * We cannot reuse src/utils/sanitize.ts here: it wraps DOMPurify, which needs a DOM,
 * and the isomorphic build pulls in jsdom, which does not run on Edge. This response
 * is served to crawlers, but a mis-detected user agent would receive it too, so the
 * article HTML coming out of the database is treated as untrusted either way.
 *
 * Strategy: drop dangerous elements with their contents, then rebuild every remaining
 * tag from an allowlist, discarding all attributes that are not explicitly permitted
 * (which removes every on* handler by construction) and rejecting unsafe URL schemes.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  let html = dirty;

  // Comments can hide conditional-comment payloads; remove them first.
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Remove dangerous elements along with everything inside them. Run repeatedly so
  // nested or reconstructed pairs (e.g. <scr<script>ipt>) cannot survive a single pass.
  let previous: string;
  do {
    previous = html;
    html = html.replace(STRIP_WITH_CONTENT, '');
  } while (html !== previous);

  // Any unclosed dangerous opener that survived above loses everything after it.
  html = html.replace(/<(script|style|iframe|object|embed|noscript|template|svg|math)\b[\s\S]*$/gi, '');

  // Rebuild each tag from the allowlist.
  html = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (_match, rawName: string, rawAttrs: string) => {
    const name = rawName.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) return '';

    const isClosing = _match.startsWith('</');
    if (isClosing) return `</${name}>`;

    const permitted = ALLOWED_ATTRS[name];
    if (!permitted) {
      return `<${name}>`;
    }

    const kept: string[] = [];
    const attrRe = /([a-zA-Z_:][a-zA-Z0-9_.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
    let attr: RegExpExecArray | null;
    while ((attr = attrRe.exec(rawAttrs)) !== null) {
      const attrName = attr[1].toLowerCase();
      if (!permitted.has(attrName)) continue;
      const attrValue = attr[2] ?? attr[3] ?? attr[4] ?? '';
      if ((attrName === 'href' || attrName === 'src') && !isSafeUrl(attrValue)) continue;
      kept.push(`${attrName}="${escapeHtml(attrValue)}"`);
    }

    // Outbound links from user-authored content get rel protection.
    if (name === 'a') {
      const href = kept.find((a) => a.startsWith('href='));
      if (href && /https?:/i.test(href) && !href.includes('openhrapp.com')) {
        kept.push('rel="nofollow ugc noopener"');
      }
    }

    return kept.length ? `<${name} ${kept.join(' ')}>` : `<${name}>`;
  });

  return html;
}

/** Plain-text excerpt used for meta descriptions when the row has none. */
function textExcerpt(html: string, max = 300): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/* ------------------------------------------------------------------ *
 * Document rendering
 * ------------------------------------------------------------------ */

function buildJsonLd(meta: PageMeta, article: ArticleBody): string {
  const blocks: unknown[] = [];

  const typeByKind: Record<ArticleBody['kind'], string> = {
    blog: 'BlogPosting',
    guide: 'TechArticle',
    feature: 'WebPage',
    index: 'CollectionPage',
  };

  const main: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': typeByKind[article.kind],
    headline: article.heading,
    name: article.heading,
    description: meta.description,
    url: meta.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url },
    image: meta.image.url,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/logo.png` },
    },
  };
  // An author byline that is the site's own name is the organization publishing,
  // not a person. Emitting Person for an organization is invalid structured data
  // and Rich Results Test flags it, so pick the type from the name.
  if (article.author) {
    main.author = AUTHOR_IS_ORGANIZATION.test(article.author)
      ? { '@type': 'Organization', name: article.author, url: SITE_URL }
      : { '@type': 'Person', name: article.author };
  }
  if (article.publishedAt) {
    main.datePublished = article.publishedAt;
    main.dateModified = article.publishedAt;
  }
  if (article.category) main.articleSection = article.category;
  blocks.push(main);

  if (article.breadcrumb.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: article.breadcrumb.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  return blocks
    .map((block) => `<script type="application/ld+json">${jsonLdSafe(block)}</script>`)
    .join('\n');
}

function buildHtml(meta: PageMeta, article?: ArticleBody): string {
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  const u = escapeHtml(meta.url);

  // Facebook and LinkedIn render the card more reliably on first scrape when the
  // image carries explicit dimensions and a MIME type, and secure_url is what
  // several crawlers actually read.
  const img = meta.image;
  const imageTags = [
    `<meta property="og:image" content="${escapeHtml(img.url)}">`,
    `<meta property="og:image:secure_url" content="${escapeHtml(img.url)}">`,
    `<meta property="og:image:type" content="${escapeHtml(img.type)}">`,
    img.width ? `<meta property="og:image:width" content="${img.width}">` : '',
    img.height ? `<meta property="og:image:height" content="${img.height}">` : '',
    img.alt ? `<meta property="og:image:alt" content="${escapeHtml(img.alt)}">` : '',
    `<meta name="twitter:image" content="${escapeHtml(img.url)}">`,
    img.alt ? `<meta name="twitter:image:alt" content="${escapeHtml(img.alt)}">` : '',
  ].filter(Boolean).join('\n');

  const jsonLd = article ? buildJsonLd(meta, article) : '';

  let body = '';
  if (article) {
    const crumbs = article.breadcrumb
      .map((c, idx) =>
        idx === article.breadcrumb.length - 1
          ? `<span aria-current="page">${escapeHtml(c.name)}</span>`
          : `<a href="${escapeHtml(c.url)}">${escapeHtml(c.name)}</a>`
      )
      .join(' <span aria-hidden="true">/</span> ');

    const byline: string[] = [];
    if (article.author) byline.push(`<span class="author">By ${escapeHtml(article.author)}</span>`);
    if (article.publishedAt) {
      const day = article.publishedAt.split('T')[0];
      byline.push(`<time datetime="${escapeHtml(article.publishedAt)}">${escapeHtml(day)}</time>`);
    }
    if (article.readingTime) byline.push(`<span>${article.readingTime} min read</span>`);
    if (article.category) byline.push(`<span class="category">${escapeHtml(article.category)}</span>`);

    body = [
      '<nav aria-label="Breadcrumb">' + crumbs + '</nav>',
      '<main>',
      '<article>',
      `<h1>${escapeHtml(article.heading)}</h1>`,
      byline.length ? `<p class="byline">${byline.join(' · ')}</p>` : '',
      article.html,
      '</article>',
      '</main>',
    ].filter(Boolean).join('\n');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${u}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta property="og:type" content="${article && article.kind === 'blog' ? 'article' : 'website'}">
<meta property="og:url" content="${u}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:site_name" content="OpenHRApp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@openhrapp">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
${imageTags}
${jsonLd}
</head>
<body>
${body}
</body>
</html>`;
}

/* ------------------------------------------------------------------ *
 * Supabase resolvers
 * ------------------------------------------------------------------ */

async function query(table: string, params: URLSearchParams): Promise<any[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { headers: SUPABASE_HEADERS });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

interface Resolved {
  meta: PageMeta;
  article?: ArticleBody;
}

async function resolveBlogPost(slug: string, pathname: string, wantContent: boolean): Promise<Resolved | null> {
  const select = wantContent
    ? 'title,excerpt,cover_image,content,author_name,published_at,category,reading_time'
    : 'title,excerpt,cover_image';
  const rows = await query('blog_posts', new URLSearchParams({
    slug: `eq.${slug}`,
    status: 'eq.PUBLISHED',
    select,
    limit: '1',
  }));
  if (!rows?.length) return null;
  const p = rows[0];

  const image = socialImageFor(p.cover_image, p.title);
  const cleaned = wantContent ? sanitizeHtml(p.content || '') : '';
  const description = p.excerpt || (cleaned ? textExcerpt(cleaned) : DEFAULT_DESCRIPTION);

  const meta: PageMeta = {
    title: p.title ? `${p.title} | OpenHRApp Blog` : 'OpenHRApp Blog',
    description,
    image,
    url: `${SITE_URL}${pathname}`,
  };
  if (!wantContent) return { meta };

  return {
    meta,
    article: {
      html: cleaned,
      heading: p.title || 'OpenHRApp Blog',
      author: p.author_name || undefined,
      publishedAt: p.published_at || undefined,
      category: p.category || undefined,
      readingTime: p.reading_time || undefined,
      kind: 'blog',
      breadcrumb: [
        { name: 'Home', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: p.title || 'Post', url: `${SITE_URL}${pathname}` },
      ],
    },
  };
}

async function resolveTutorial(slug: string, pathname: string, wantContent: boolean): Promise<Resolved | null> {
  const select = wantContent
    ? 'title,excerpt,cover_image,content,author_name,published_at,category'
    : 'title,excerpt,cover_image';
  const rows = await query('tutorials', new URLSearchParams({
    slug: `eq.${slug}`,
    status: 'eq.PUBLISHED',
    select,
    limit: '1',
  }));
  if (!rows?.length) return null;
  const p = rows[0];

  const image = socialImageFor(p.cover_image, p.title);
  const cleaned = wantContent ? sanitizeHtml(p.content || '') : '';
  const description = p.excerpt || (cleaned ? textExcerpt(cleaned) : DEFAULT_DESCRIPTION);

  const meta: PageMeta = {
    title: p.title ? `${p.title} | OpenHRApp Guides` : 'OpenHRApp Guides',
    description,
    image,
    url: `${SITE_URL}${pathname}`,
  };
  if (!wantContent) return { meta };

  return {
    meta,
    article: {
      html: cleaned,
      heading: p.title || 'OpenHRApp Guides',
      author: p.author_name || undefined,
      publishedAt: p.published_at || undefined,
      category: p.category || undefined,
      kind: 'guide',
      breadcrumb: [
        { name: 'Home', url: SITE_URL },
        { name: 'Guides', url: `${SITE_URL}/how-to-use` },
        { name: p.title || 'Guide', url: `${SITE_URL}${pathname}` },
      ],
    },
  };
}

async function resolveFeature(slug: string, pathname: string): Promise<Resolved | null> {
  const feature = FEATURE_META[slug];
  if (!feature) return null;
  const url = `${SITE_URL}${pathname}`;
  return {
    meta: { title: feature.title, description: feature.description, image: DEFAULT_IMAGE, url },
    article: {
      html: `<p>${escapeHtml(feature.description)}</p>`,
      heading: feature.title.split('|')[0].trim(),
      kind: 'feature',
      breadcrumb: [
        { name: 'Home', url: SITE_URL },
        { name: 'Features', url: `${SITE_URL}/features` },
        { name: feature.title.split('|')[0].trim(), url },
      ],
    },
  };
}

/**
 * Index pages. `/blog` and `/how-to-use` are in the sitemap but render nothing to a
 * crawler, so they currently look like empty categories. Listing the published items
 * gives them substance and, just as importantly, gives crawlers internal links to
 * follow into the individual articles.
 */
async function resolveContentIndex(kind: 'blog' | 'guide', pathname: string): Promise<Resolved | null> {
  const table = kind === 'blog' ? 'blog_posts' : 'tutorials';
  const base = kind === 'blog' ? '/blog' : '/how-to-use';
  const label = kind === 'blog' ? 'Blog' : 'Guides';

  const rows = await query(table, new URLSearchParams({
    status: 'eq.PUBLISHED',
    select: 'slug,title,excerpt,published_at,category',
    order: 'published_at.desc',
    limit: '200',
  }));
  if (!rows) return null;

  const items = rows
    .filter((r) => r.slug && r.title)
    .map((r) => {
      const href = `${base}/${r.slug}`;
      const excerpt = r.excerpt ? `<p>${escapeHtml(r.excerpt)}</p>` : '';
      const when = r.published_at
        ? `<time datetime="${escapeHtml(r.published_at)}">${escapeHtml(String(r.published_at).split('T')[0])}</time>`
        : '';
      return `<li><h2><a href="${escapeHtml(href)}">${escapeHtml(r.title)}</a></h2>${when}${excerpt}</li>`;
    })
    .join('\n');

  const heading = kind === 'blog'
    ? 'OpenHRApp Blog — HR management insights and product updates'
    : 'OpenHRApp Guides — How to use OpenHRApp';
  const description = kind === 'blog'
    ? 'Articles on attendance tracking, leave management, HR compliance, and running people operations with free open-source software.'
    : 'Step-by-step guides for setting up and running OpenHRApp: attendance, leave, employees, organization structure, reports, and performance reviews.';

  return {
    meta: {
      title: `${label} | OpenHRApp`,
      description,
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}${pathname}`,
    },
    article: {
      html: `<p>${escapeHtml(description)}</p><ul class="content-index">${items}</ul>`,
      heading,
      kind: 'index',
      breadcrumb: [
        { name: 'Home', url: SITE_URL },
        { name: label, url: `${SITE_URL}${base}` },
      ],
    },
  };
}

function resolveFeatureIndex(pathname: string): Resolved {
  const items = Object.entries(FEATURE_META)
    .map(([slug, f]) =>
      `<li><h2><a href="/features/${escapeHtml(slug)}">${escapeHtml(f.title.split('|')[0].trim())}</a></h2><p>${escapeHtml(f.description)}</p></li>`
    )
    .join('\n');

  return {
    meta: {
      title: 'Features | OpenHRApp — Free Open-Source HR Management Software',
      description: 'Attendance tracking, leave management, performance reviews, GPS geofencing, selfie verification, employee directory, and HR reporting — all free and open-source.',
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}${pathname}`,
    },
    article: {
      html: `<ul class="content-index">${items}</ul>`,
      heading: 'OpenHRApp Features',
      kind: 'index',
      breadcrumb: [
        { name: 'Home', url: SITE_URL },
        { name: 'Features', url: `${SITE_URL}/features` },
      ],
    },
  };
}

function resolveHome(): Resolved {
  const description = DEFAULT_DESCRIPTION;
  const links = Object.entries(FEATURE_META)
    .map(([slug, f]) => `<li><a href="/features/${escapeHtml(slug)}">${escapeHtml(f.title.split('|')[0].trim())}</a></li>`)
    .join('\n');

  return {
    meta: {
      title: 'OpenHRApp — Free Open-Source HR Management Software',
      description,
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}/`,
    },
    article: {
      html: [
        `<p>${escapeHtml(description)}</p>`,
        '<h2>What OpenHRApp does</h2>',
        `<ul>${links}</ul>`,
        '<h2>Learn more</h2>',
        '<ul><li><a href="/how-to-use">Guides</a></li><li><a href="/blog">Blog</a></li><li><a href="/features">Features</a></li></ul>',
      ].join('\n'),
      heading: 'OpenHRApp — Free Open-Source HR Management Software',
      kind: 'index',
      breadcrumb: [{ name: 'Home', url: SITE_URL }],
    },
  };
}

/**
 * Contact is a static page — no database row backs it — so it resolves from
 * literals here rather than a query. It is prerendered anyway because AdSense
 * reviewers and search crawlers specifically look for a reachable contact page,
 * and without this it would be the usual empty SPA shell.
 */
function resolveContact(): Resolved {
  const description =
    'Get in touch with the OpenHRApp team. Email support, report a bug on GitHub, or send a message directly.';

  return {
    meta: {
      title: 'Contact OpenHRApp — Support, Questions, and Feedback',
      description,
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}/contact`,
    },
    article: {
      html: [
        `<p>${escapeHtml(description)}</p>`,
        '<h2>Ways to reach us</h2>',
        '<ul>',
        '<li><a href="mailto:support@openhrapp.com">support@openhrapp.com</a> — account questions, billing, anything needing a reply from a person.</li>',
        '<li><a href="https://github.com/mimnets/openhrapp/issues" rel="nofollow">GitHub Issues</a> — bug reports and feature requests.</li>',
        '<li><a href="/how-to-use">Guides</a> — step-by-step instructions for everyday tasks.</li>',
        '</ul>',
      ].join('\n'),
      heading: 'Get in touch',
      kind: 'index',
      breadcrumb: [
        { name: 'Home', url: SITE_URL },
        { name: 'Contact', url: `${SITE_URL}/contact` },
      ],
    },
  };
}

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Dynamic sitemap
 * ------------------------------------------------------------------ */

/**
 * Static routes, mirroring STATIC_PAGES in scripts/generate-sitemap.mjs.
 *
 * Kept in sync deliberately rather than shared: the Edge runtime cannot import
 * from scripts/, and duplicating fifteen literals is cheaper than the
 * indirection needed to share them. scripts/__tests__ asserts the two lists
 * match so they cannot drift silently.
 */
const SITEMAP_STATIC_PAGES: ReadonlyArray<{ path: string; changefreq: string; priority: string }> = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/blog', changefreq: 'daily', priority: '0.8' },
  { path: '/features', changefreq: 'monthly', priority: '0.8' },
  { path: '/features/attendance-tracking', changefreq: 'monthly', priority: '0.7' },
  { path: '/features/leave-management', changefreq: 'monthly', priority: '0.7' },
  { path: '/features/performance-reviews', changefreq: 'monthly', priority: '0.7' },
  { path: '/features/gps-geofencing', changefreq: 'monthly', priority: '0.7' },
  { path: '/features/biometric-selfie-verification', changefreq: 'monthly', priority: '0.7' },
  { path: '/features/employee-directory', changefreq: 'monthly', priority: '0.7' },
  { path: '/features/reports-analytics', changefreq: 'monthly', priority: '0.7' },
  { path: '/changelog', changefreq: 'weekly', priority: '0.7' },
  { path: '/how-to-use', changefreq: 'weekly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.3' },
  { path: '/terms', changefreq: 'monthly', priority: '0.3' },
];

function sitemapEntry(loc: string, lastmod: string | null, changefreq: string, priority: string): string {
  const lines = ['  <url>', `    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`, `    <priority>${priority}</priority>`, '  </url>');
  return lines.join('\n');
}

/** ISO timestamp -> YYYY-MM-DD, or null if absent or unparseable. */
function lastmodOf(row: { updated?: string; published_at?: string }): string | null {
  const raw = row.updated || row.published_at || '';
  const day = String(raw).split('T')[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
}

/**
 * Build sitemap.xml from the database on request.
 *
 * The static public/sitemap.xml is written at build time, so publishing a post
 * through the admin panel left it stale until the next deploy — which is how the
 * site ran for months advertising 14 URLs and zero articles.
 *
 * Returns null on any query failure so the caller can fall through to the static
 * file. A stale sitemap is far better than a 500 or an empty one: Google treats a
 * sitemap that suddenly loses its URLs as a signal those pages are gone.
 */
async function buildSitemap(): Promise<string | null> {
  const select = 'slug,updated,published_at';
  const params = (extra: Record<string, string>) =>
    new URLSearchParams({ select, status: 'eq.PUBLISHED', order: 'published_at.desc', limit: '1000', ...extra });

  const [posts, tutorials] = await Promise.all([
    query('blog_posts', params({})),
    query('tutorials', params({})),
  ]);

  // Either query failing means an incomplete document. Serve the static file
  // instead of publishing a sitemap that silently drops half the site.
  if (posts === null || tutorials === null) return null;

  // A zero result almost always means a broken query rather than an empty site —
  // the same failure mode the build-time generator now refuses to write.
  if (posts.length === 0 && tutorials.length === 0) return null;

  const today = new Date().toISOString().split('T')[0];
  const entries = SITEMAP_STATIC_PAGES.map((p) =>
    sitemapEntry(`${SITE_URL}${p.path}`, today, p.changefreq, p.priority),
  );

  for (const post of posts) {
    if (!post?.slug) continue;
    entries.push(sitemapEntry(`${SITE_URL}/blog/${post.slug}`, lastmodOf(post), 'weekly', '0.6'));
  }
  for (const tut of tutorials) {
    if (!tut?.slug) continue;
    entries.push(sitemapEntry(`${SITE_URL}/how-to-use/${tut.slug}`, lastmodOf(tut), 'monthly', '0.6'));
  }

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('\n') +
    '\n</urlset>\n'
  );
}

/**
 * Retired content, and where it went.
 *
 * Archiving a guide removes it from the sitemap and from resolveTutorial, which
 * makes the middleware fall through to the SPA — and the SPA renders its
 * not-found state with a 200. That is a soft 404: the URL keeps its place in
 * the index while serving nothing, and any authority it had is thrown away
 * rather than passed on.
 *
 * A permanent redirect to the guide that absorbed the content fixes both. Add a
 * line here whenever a published guide is archived rather than replaced.
 *
 * theme-customization documented three features removed in 0508e82 ("one brand
 * colour, remove selectable accent themes"): a fourteen-palette picker, an
 * organization default theme, and a claim that the preference syncs across
 * devices. What survives is light/dark/system, which now lives in
 * managing-profile-settings.
 */
const RETIRED_PATHS: Record<string, string> = {
  '/how-to-use/theme-customization': '/how-to-use/managing-profile-settings',
};

export default async function middleware(request: Request): Promise<Response | undefined> {
  const { pathname } = new URL(request.url);

  // Before everything else: a retired URL must never reach the SPA, or it
  // answers 200 with a not-found page.
  const retiredTarget = RETIRED_PATHS[pathname.replace(/\/+$/, '') || '/'];
  if (retiredTarget) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: retiredTarget,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // Handled before the user-agent check: a sitemap is served to everyone who
  // asks, and Search Console fetches it without a crawler UA.
  if (pathname === '/sitemap.xml') {
    const xml = await buildSitemap();

    // Fall through to the static build-time file when the database is
    // unreachable or answers with nothing.
    if (!xml) return undefined;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // Cached at the edge for an hour, so a burst of crawler requests costs
        // one database round trip rather than thousands. A newly published post
        // appears within the hour without a deploy.
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        'X-Sitemap': 'dynamic',
      },
    });
  }

  const ua = request.headers.get('user-agent') ?? '';
  const isIndexBot = INDEX_BOT_RE.test(ua);
  const isSocialBot = !isIndexBot && SOCIAL_BOT_RE.test(ua);

  // Everyone else — real users included — gets the SPA untouched.
  if (!isIndexBot && !isSocialBot) return undefined;

  const blogPost = pathname.match(/^\/blog\/([^/]+)\/?$/);
  const tutorial = pathname.match(/^\/how-to-use\/([^/]+)\/?$/);
  const feature = pathname.match(/^\/features\/([^/]+)\/?$/);

  let resolved: Resolved | null = null;

  if (blogPost) {
    resolved = await resolveBlogPost(blogPost[1], pathname, isIndexBot);
  } else if (tutorial) {
    resolved = await resolveTutorial(tutorial[1], pathname, isIndexBot);
  } else if (feature) {
    resolved = await resolveFeature(feature[1], pathname);
  } else if (isIndexBot) {
    // Index pages are only worth prerendering for indexing crawlers; link-preview
    // bots are served fine by the static metadata already in index.html.
    if (/^\/blog\/?$/.test(pathname)) {
      resolved = await resolveContentIndex('blog', pathname);
    } else if (/^\/how-to-use\/?$/.test(pathname)) {
      resolved = await resolveContentIndex('guide', pathname);
    } else if (/^\/features\/?$/.test(pathname)) {
      resolved = resolveFeatureIndex(pathname);
    } else if (/^\/contact\/?$/.test(pathname)) {
      resolved = resolveContact();
    } else if (pathname === '/') {
      resolved = resolveHome();
    }
  }

  // Unknown slug, unpublished row, or an API error — fall through to the SPA rather
  // than serving a wrong or empty document.
  if (!resolved) return undefined;

  // Social bots read <head> only, so skip the body work for them.
  const html = buildHtml(resolved.meta, isIndexBot ? resolved.article : undefined);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      'X-Prerender': isIndexBot ? 'index-bot' : 'social-bot',
      'Vary': 'User-Agent',
    },
  });
}
