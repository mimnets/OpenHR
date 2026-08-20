/**
 * Vercel Edge Middleware — Crawler Prerender
 *
 * OpenHR's public site is a client-rendered SPA (src/App.tsx routes off `currentPath`
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
  ],
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE_URL = 'https://openhrapp.com';
const DEFAULT_IMAGE = `${SITE_URL}/img/screenshot-wide.webp`;
const DEFAULT_DESCRIPTION = 'Free, open-source HR management system with attendance tracking, leave management, employee directory, and compliance tools.';
const PUBLISHER_NAME = 'OpenHRApp';

// A byline matching the site's own name is the publishing organization, not a
// person. Anything else is treated as a named author.
const AUTHOR_IS_ORGANIZATION = /^\s*(OpenHRApp|OpenHR|OpenHR Team|OpenHRApp Team)\s*$/i;

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
    title: 'Attendance Tracking Software | OpenHR - Selfie & GPS Check-In',
    description: 'Track employee attendance with selfie-based check-in, GPS verification, and real-time dashboards. Supports office and factory shift modes. Free and open-source.',
  },
  'leave-management': {
    title: 'Leave Management System | OpenHR - Request, Approve & Track',
    description: 'Streamline leave requests, approvals, and balance tracking. Configure custom leave types with automatic calculations. Free HR leave management software.',
  },
  'performance-reviews': {
    title: 'Performance Review Software | OpenHR - Structured Review Cycles',
    description: 'Run structured performance reviews with self-assessment, manager evaluation, and HR finalization. Customizable competencies and rating scales. Free HRMS.',
  },
  'gps-geofencing': {
    title: 'GPS Attendance Tracking | OpenHR - Location Verified Check-In',
    description: 'Verify employee attendance with GPS location tracking. Ensure employees check in from approved locations. Ideal for remote teams and field workers.',
  },
  'biometric-selfie-verification': {
    title: 'Selfie-Based Attendance | OpenHR - Photo Verified Check-In',
    description: 'Prevent buddy punching with selfie-based attendance verification. Photo evidence ensures authentic check-ins. No special hardware needed.',
  },
  'employee-directory': {
    title: 'Employee Directory & HR Database | OpenHR - Centralized Team Management',
    description: 'Manage employee profiles, departments, and org structure in one place. Role-based access, bulk import, and searchable directory. Free open-source HRMS.',
  },
  'reports-analytics': {
    title: 'HR Reports & Analytics | OpenHR - Data-Driven HR Decisions',
    description: 'Generate attendance reports, leave utilization analytics, and team performance insights. Interactive charts and CSV export. Free open-source HR reporting.',
  },
};

interface PageMeta {
  title: string;
  description: string;
  image: string;
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
    image: meta.image,
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
  const i = escapeHtml(meta.image);
  const u = escapeHtml(meta.url);

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
<meta property="og:image" content="${i}">
<meta property="og:site_name" content="OpenHRApp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@openhrapp">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${i}">
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

  const image = p.cover_image
    ? `${SUPABASE_URL}/storage/v1/object/public/content-images/${p.cover_image}`
    : DEFAULT_IMAGE;
  const cleaned = wantContent ? sanitizeHtml(p.content || '') : '';
  const description = p.excerpt || (cleaned ? textExcerpt(cleaned) : DEFAULT_DESCRIPTION);

  const meta: PageMeta = {
    title: p.title ? `${p.title} | OpenHR Blog` : 'OpenHR Blog',
    description,
    image,
    url: `${SITE_URL}${pathname}`,
  };
  if (!wantContent) return { meta };

  return {
    meta,
    article: {
      html: cleaned,
      heading: p.title || 'OpenHR Blog',
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

  const image = p.cover_image
    ? `${SUPABASE_URL}/storage/v1/object/public/content-images/${p.cover_image}`
    : DEFAULT_IMAGE;
  const cleaned = wantContent ? sanitizeHtml(p.content || '') : '';
  const description = p.excerpt || (cleaned ? textExcerpt(cleaned) : DEFAULT_DESCRIPTION);

  const meta: PageMeta = {
    title: p.title ? `${p.title} | OpenHR Guides` : 'OpenHR Guides',
    description,
    image,
    url: `${SITE_URL}${pathname}`,
  };
  if (!wantContent) return { meta };

  return {
    meta,
    article: {
      html: cleaned,
      heading: p.title || 'OpenHR Guides',
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
    ? 'OpenHR Blog — HR management insights and product updates'
    : 'OpenHR Guides — How to use OpenHR';
  const description = kind === 'blog'
    ? 'Articles on attendance tracking, leave management, HR compliance, and running people operations with free open-source software.'
    : 'Step-by-step guides for setting up and running OpenHR: attendance, leave, employees, organization structure, reports, and performance reviews.';

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
      heading: 'OpenHR Features',
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
        '<h2>What OpenHR does</h2>',
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

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */

export default async function middleware(request: Request): Promise<Response | undefined> {
  const ua = request.headers.get('user-agent') ?? '';
  const isIndexBot = INDEX_BOT_RE.test(ua);
  const isSocialBot = !isIndexBot && SOCIAL_BOT_RE.test(ua);

  // Everyone else — real users included — gets the SPA untouched.
  if (!isIndexBot && !isSocialBot) return undefined;

  const { pathname } = new URL(request.url);

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
