#!/usr/bin/env node
/**
 * Pre-merge / post-deploy verification — R19 and R25.
 *
 *   node scripts/verify-canonical-and-prerender.mjs
 *   node scripts/verify-canonical-and-prerender.mjs https://openhrapp-git-dev-<scope>.vercel.app
 *
 * Two questions, both of which have to be answered before the sitemap is submitted:
 *
 *   R25  Does every canonical signal point at a host that actually serves 200?
 *        As of 2026-08-22 it did not: www served the site, the apex 307-redirected to
 *        www, and yet every canonical tag, the sitemap and robots.txt all named the
 *        apex. Google was being told to consolidate on a URL that redirects away.
 *        The agreed fix is to make the apex primary in Vercel and redirect www -> apex
 *        with a 308, which needs no code change because the code already says apex.
 *
 *   R19  Does a crawler get a real document rather than an empty SPA shell?
 *        This is a big-bang merge to production, so the prerender path is checked as
 *        Googlebot before merging, not after.
 *
 * Exit code is 0 only if every check passes, so this can gate a deploy.
 */

const APEX = 'https://openhrapp.com';
const WWW = 'https://www.openhrapp.com';
const BASE = process.argv[2] || APEX;
const IS_PREVIEW = BASE !== APEX;

const GOOGLEBOT =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const BROWSER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

let failures = 0;
let checks = 0;

const pass = (msg) => { checks++; console.log(`  [32mPASS[0m  ${msg}`); };
const fail = (msg) => { checks++; failures++; console.log(`  [31mFAIL[0m  ${msg}`); };
const info = (msg) => console.log(`  [2m....  ${msg}[0m`);
const head = (msg) => console.log(`\n[1m${msg}[0m`);

async function fetchNoRedirect(url, ua = BROWSER) {
  return fetch(url, { redirect: 'manual', headers: { 'User-Agent': ua } });
}

/** Follow the chain by hand so every hop is visible, not just the destination. */
async function chain(url, ua = BROWSER, max = 5) {
  const hops = [];
  let current = url;
  for (let i = 0; i < max; i++) {
    const res = await fetchNoRedirect(current, ua);
    hops.push({ url: current, status: res.status, location: res.headers.get('location') });
    if (res.status < 300 || res.status >= 400) break;
    const loc = res.headers.get('location');
    if (!loc) break;
    current = new URL(loc, current).toString();
  }
  return hops;
}

// ── R25: canonical host ─────────────────────────────────────────────────────
async function checkCanonicalHost() {
  head('R25 — canonical host');

  if (IS_PREVIEW) {
    info(`preview target (${BASE}) — apex/www checks skipped, they only apply to production`);
  } else {
    const apexHops = await chain(APEX + '/');
    const apexFinal = apexHops[apexHops.length - 1];
    if (apexHops[0].status === 200) {
      pass('apex serves 200 directly');
    } else {
      fail(`apex does not serve 200 — ${apexHops.map((h) => h.status).join(' -> ')} (ends ${apexFinal.url})`);
      info('Vercel: Settings -> Domains -> set openhrapp.com as primary');
    }

    const wwwHops = await chain(WWW + '/');
    if (wwwHops[0].status === 308 || wwwHops[0].status === 301) {
      pass(`www redirects to the apex permanently (${wwwHops[0].status})`);
    } else if (wwwHops[0].status === 307 || wwwHops[0].status === 302) {
      fail(`www redirects with a TEMPORARY ${wwwHops[0].status} — use 308/301 so the redirect consolidates`);
    } else if (wwwHops[0].status === 200) {
      fail('www still serves 200 — both hosts are live, so neither is canonical');
    } else {
      fail(`www returned an unexpected ${wwwHops[0].status}`);
    }
  }

  // The canonical tag has to name a URL that serves 200, not one that redirects.
  const res = await fetch(BASE + '/', { headers: { 'User-Agent': BROWSER } });
  const html = await res.text();
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];

  if (!canonical) {
    fail('no canonical tag on the home page');
    return;
  }
  info(`canonical tag: ${canonical}`);

  const canonHops = await chain(canonical);
  if (canonHops[0].status === 200) {
    pass('the canonical URL serves 200 — it does not point at a redirect');
  } else {
    fail(
      `the canonical URL does not serve 200 (${canonHops.map((h) => h.status).join(' -> ')}) — ` +
      'this is the R25 contradiction: the page tells Google to consolidate on a URL that redirects away',
    );
  }
}

// ── R25: sitemap and robots ─────────────────────────────────────────────────
async function checkSitemap() {
  head('R25 — sitemap and robots.txt');

  const robotsRes = await fetch(BASE + '/robots.txt', { headers: { 'User-Agent': BROWSER } });
  const robots = await robotsRes.text();
  const sitemapLine = robots.match(/^\s*Sitemap:\s*(\S+)/im)?.[1];

  if (!sitemapLine) {
    fail('robots.txt names no sitemap');
    return;
  }
  info(`robots.txt sitemap: ${sitemapLine}`);

  const smHops = await chain(sitemapLine);
  if (smHops[0].status === 200) {
    pass('the sitemap URL in robots.txt serves 200');
  } else {
    fail(`the sitemap URL in robots.txt redirects (${smHops.map((h) => h.status).join(' -> ')})`);
  }

  const smRes = await fetch(BASE + '/sitemap.xml', { headers: { 'User-Agent': BROWSER } });
  const xml = await smRes.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (!locs.length) {
    fail('sitemap.xml contains no <loc> entries');
    return;
  }
  info(`sitemap lists ${locs.length} URLs`);

  // Every listed URL must serve 200. A sitemap of redirects spends the crawl budget
  // the merge exists to unlock.
  const limit = 8;
  const redirects = [];
  const errors = [];
  for (let i = 0; i < locs.length; i += limit) {
    const slice = locs.slice(i, i + limit);
    const results = await Promise.all(
      slice.map(async (u) => {
        try {
          const r = await fetchNoRedirect(u);
          return { u, status: r.status, location: r.headers.get('location') };
        } catch (e) {
          return { u, status: 0, error: String(e).slice(0, 80) };
        }
      }),
    );
    for (const r of results) {
      if (r.status >= 300 && r.status < 400) redirects.push(r);
      else if (r.status !== 200) errors.push(r);
    }
  }

  if (!redirects.length) {
    pass(`all ${locs.length} sitemap URLs serve 200 — no crawl budget spent on redirects`);
  } else {
    fail(`${redirects.length} of ${locs.length} sitemap URLs redirect`);
    for (const r of redirects.slice(0, 5)) info(`${r.status}  ${r.u} -> ${r.location}`);
    if (redirects.length > 5) info(`...and ${redirects.length - 5} more`);
  }

  if (errors.length) {
    fail(`${errors.length} sitemap URLs did not return 200 or a redirect`);
    for (const r of errors.slice(0, 5)) info(`${r.status || r.error}  ${r.u}`);
  } else {
    pass('no sitemap URL errored');
  }
}

// ── R19: prerender as Googlebot ─────────────────────────────────────────────
async function checkPrerender() {
  head('R19 — prerender as Googlebot');

  // One of each kind the middleware handles, so a regression in any resolver shows up.
  const targets = [
    { path: '/', label: 'home' },
    { path: '/blog', label: 'blog index' },
    { path: '/how-to-use', label: 'guides index' },
    { path: '/features', label: 'features index' },
    { path: '/contact', label: 'contact' },
  ];

  for (const t of targets) {
    const url = BASE + t.path;
    let res;
    try {
      res = await fetch(url, { headers: { 'User-Agent': GOOGLEBOT } });
    } catch (e) {
      fail(`${t.label}: request failed — ${String(e).slice(0, 60)}`);
      continue;
    }

    const marker = res.headers.get('x-prerender');
    const body = await res.text();

    // The shell ships a static hero, so "has text" is not enough to prove prerendering.
    // The X-Prerender header is what distinguishes a real prerender from the SPA shell.
    if (marker === 'index-bot') {
      pass(`${t.label}: prerendered (X-Prerender: index-bot)`);
    } else {
      fail(`${t.label}: NOT prerendered — X-Prerender was ${marker ?? 'absent'}, Googlebot got the SPA shell`);
      continue;
    }

    // A prerendered document that is only chrome is worse than none: it looks like content.
    const text = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words >= 60) pass(`${t.label}: document carries ${words} words of text`);
    else fail(`${t.label}: prerendered document has only ${words} words — near-empty`);

    if (/<h1[^>]*>/i.test(body)) pass(`${t.label}: has an <h1>`);
    else fail(`${t.label}: no <h1> in the prerendered document`);
  }

  // Cloaking guard: the crawler document and the human document must describe the same
  // page. Comparing titles is the cheap version of that check.
  const botRes = await fetch(BASE + '/', { headers: { 'User-Agent': GOOGLEBOT } });
  const humanRes = await fetch(BASE + '/', { headers: { 'User-Agent': BROWSER } });
  const botTitle = (await botRes.text()).match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
  const humanTitle = (await humanRes.text()).match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();

  if (botTitle && humanTitle && botTitle === humanTitle) {
    pass('crawler and browser get the same <title> — no cloaking signal');
  } else {
    fail(`<title> differs between crawler and browser:\n        bot:   ${botTitle}\n        human: ${humanTitle}`);
  }
}

// ── run ─────────────────────────────────────────────────────────────────────
console.log(`\nVerifying ${BASE}${IS_PREVIEW ? '  (preview)' : '  (production)'}`);

try {
  await checkCanonicalHost();
  await checkSitemap();
  await checkPrerender();
} catch (e) {
  console.error(`\nAborted: ${e}`);
  process.exit(2);
}

head('Result');
if (failures === 0) {
  console.log(`  [32mAll ${checks} checks passed.[0m\n`);
  process.exit(0);
} else {
  console.log(`  [31m${failures} of ${checks} checks failed.[0m\n`);
  process.exit(1);
}
