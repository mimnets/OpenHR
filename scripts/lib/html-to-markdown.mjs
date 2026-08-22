/**
 * HTML -> Markdown converter, scoped to the tag set that actually appears in
 * public.blog_posts.content and public.tutorials.content.
 *
 * WHY THIS EXISTS
 *
 * Much of the content in the database was pasted in from GitHub's rendered
 * markdown view, so it arrived carrying GitHub's presentation layer: 4600+
 * inline `style` attributes, hundreds of layout-only <span> and <div>
 * wrappers, <font> tags, `tabindex`/`data-view-component` attributes, and
 * inline <svg> anchor icons. Those hardcode colours like rgb(31,35,40), which
 * render as near-black text in dark mode, and they make the source unusable as
 * an editing format.
 *
 * This converter throws all of it away and keeps only semantics. It is
 * deliberately NOT a general-purpose HTML-to-markdown library: it handles the
 * surveyed tag inventory and nothing else, because a narrow converter that is
 * correct on the real corpus beats a broad one that is approximately right.
 *
 * The output is intended to round-trip: scripts/import-content.mjs renders it
 * back to HTML with `marked`.
 */

/* ---------------------------------------------------------------- parsing */

const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source']);

/** Tags dropped entirely, contents and all — presentation with no meaning. */
const DROP_WITH_CONTENT = new Set(['svg', 'script', 'style', 'noscript', 'path', 'g', 'defs', 'use']);

/** Tags whose children are kept but whose own markup is discarded. */
const UNWRAP = new Set(['span', 'div', 'font', 'section', 'article', 'main', 'header', 'footer', 'nav', 'figure', 'figcaption', 'tbody', 'thead', 'tfoot', 'small', 'sup', 'sub', 'abbr', 'u', 'ins', 'mark']);

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…',
  mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’', ldquo: '“',
  rdquo: '”', middot: '·', bull: '•', times: '×', deg: '°', trade: '™',
  copy: '©', reg: '®', euro: '€', pound: '£', laquo: '«', raquo: '»',
  larr: '←', rarr: '→', harr: '↔', check: '✓', dagger: '†',
};

function decodeEntities(s) {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, body) => {
    if (body[0] === '#') {
      const cp = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      if (!Number.isFinite(cp) || cp < 0 || cp > 0x10ffff) return m;
      try { return String.fromCodePoint(cp); } catch { return m; }
    }
    const key = body.toLowerCase();
    return Object.prototype.hasOwnProperty.call(ENTITIES, key) ? ENTITIES[key] : m;
  });
}

function parseAttrs(raw) {
  const out = {};
  for (const m of raw.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    out[m[1].toLowerCase()] = decodeEntities(m[3] ?? m[4] ?? m[5] ?? '');
  }
  return out;
}

/**
 * Build a DOM-ish tree. Unclosed tags are tolerated: a close tag that does not
 * match the open element unwinds the stack to the nearest matching ancestor and
 * is otherwise ignored, which is what browsers effectively do for the sloppy
 * pasted markup in this corpus.
 */
function parse(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][a-zA-Z0-9]*)\s*>|<([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let last = 0;
  let m;

  const text = (s) => {
    if (s) stack[stack.length - 1].children.push({ tag: '#text', text: decodeEntities(s) });
  };

  while ((m = re.exec(html)) !== null) {
    text(html.slice(last, m.index));
    last = re.lastIndex;

    if (m[0].startsWith('<!--')) continue;

    if (m[1]) {
      const name = m[1].toLowerCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === name) { stack.length = i; break; }
      }
      continue;
    }

    const name = m[2].toLowerCase();
    const node = { tag: name, attrs: parseAttrs(m[3] || ''), children: [] };
    stack[stack.length - 1].children.push(node);
    if (!VOID.has(name) && !/\/\s*$/.test(m[3] || '')) stack.push(node);
  }
  text(html.slice(last));
  return root;
}

/* -------------------------------------------------------------- rendering */

/** Escape characters that would otherwise be read as markdown syntax. */
function escapeText(s) {
  return s
    .replace(/([\\`*_[\]])/g, '\\$1')
    .replace(/^(\s*)([-+*])(\s)/gm, '$1\\$2$3')
    .replace(/^(\s*)(\d+)\.(\s)/gm, '$1$2\\.$3')
    .replace(/^(\s*)(#{1,6})(\s)/gm, '$1\\$2$3')
    .replace(/^(\s*)>/gm, '$1\\>');
}

const collapse = (s) => s.replace(/[ \t\r\n]+/g, ' ');
const isBlock = (t) => /^(p|div|h[1-6]|ul|ol|li|table|tr|blockquote|pre|hr|section|article)$/.test(t);

/**
 * Recover emphasis that a WYSIWYG paste encoded as presentation.
 *
 * GitHub's rendered HTML expresses bold as <span style="font-weight: 600">
 * rather than <strong>. Unwrapping those spans — which we must, to shed the
 * colours and font stacks riding along in the same attribute — would silently
 * drop every bold run in the document, so read the emphasis back out of the
 * style first. Returns the semantic tag to substitute, or null.
 */
function emphasisFromStyle(attrs) {
  const style = (attrs.style || '').toLowerCase();
  if (!style) return null;

  const weight = /font-weight\s*:\s*([a-z0-9]+)/.exec(style);
  if (weight) {
    const v = weight[1];
    const numeric = Number(v);
    if (v === 'bold' || v === 'bolder' || (Number.isFinite(numeric) && numeric >= 600)) return 'strong';
  }
  if (/font-style\s*:\s*italic/.test(style)) return 'em';
  if (/text-decoration[^;]*line-through/.test(style)) return 'del';
  return null;
}

/**
 * @param {object} node
 * @param {{ headingBase: number, listDepth: number, inTable: boolean }} ctx
 */
function render(node, ctx) {
  const out = [];

  for (const child of node.children) {
    if (child.tag === '#text') {
      // Whitespace between block elements is layout, not content.
      const t = collapse(child.text);
      if (!t.trim() && out.length === 0) continue;
      out.push({ type: 'inline', text: escapeText(t) });
      continue;
    }
    if (DROP_WITH_CONTENT.has(child.tag)) continue;
    if (UNWRAP.has(child.tag)) {
      const as = emphasisFromStyle(child.attrs);
      if (as) { out.push(...renderElement({ ...child, tag: as }, ctx)); continue; }
      out.push(...render(child, ctx));
      continue;
    }
    out.push(...renderElement(child, ctx));
  }
  return out;
}

function inlineOf(node, ctx) {
  return render(node, ctx)
    .map((p) => (p.type === 'inline' ? p.text : p.text))
    .join('')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function renderElement(el, ctx) {
  const t = el.tag;

  switch (t) {
    case 'br':
      return [{ type: 'inline', text: '  \n' }];

    case 'hr':
      return [{ type: 'block', text: '---' }];

    case 'img': {
      const src = el.attrs.src || '';
      if (!src) return [];
      const alt = escapeText(el.attrs.alt || '').replace(/[[\]]/g, '');
      const title = el.attrs.title ? ` "${el.attrs.title.replace(/"/g, '')}"` : '';
      return [{ type: ctx.inTable ? 'inline' : 'block', text: `![${alt}](${src}${title})` }];
    }

    case 'a': {
      const href = el.attrs.href || '';
      const label = inlineOf(el, ctx);
      if (!label) return [];
      if (!href || href.startsWith('#')) return [{ type: 'inline', text: label }];
      return [{ type: 'inline', text: `[${label}](${href})` }];
    }

    case 'strong':
    case 'b': {
      const s = inlineOf(el, ctx);
      return s ? [{ type: 'inline', text: `**${s}**` }] : [];
    }

    case 'em':
    case 'i': {
      const s = inlineOf(el, ctx);
      return s ? [{ type: 'inline', text: `*${s}*` }] : [];
    }

    case 'del':
    case 's': {
      const s = inlineOf(el, ctx);
      return s ? [{ type: 'inline', text: `~~${s}~~` }] : [];
    }

    case 'code': {
      // Inside <pre> the parent handles fencing.
      const raw = textContent(el);
      if (!raw.trim()) return [];
      const fence = raw.includes('`') ? '``' : '`';
      const pad = raw.startsWith('`') || raw.endsWith('`') ? ' ' : '';
      return [{ type: 'inline', text: `${fence}${pad}${raw}${pad}${fence}` }];
    }

    case 'pre': {
      const raw = textContent(el).replace(/\n+$/, '');
      if (!raw.trim()) return [];
      return [{ type: 'block', text: '```\n' + raw + '\n```' }];
    }

    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
      const level = Math.min(6, Math.max(1, Number(t[1]) + ctx.headingBase));
      const s = inlineOf(el, ctx);
      return s ? [{ type: 'block', text: '#'.repeat(level) + ' ' + s }] : [];
    }

    case 'blockquote': {
      const inner = blocksToMarkdown(render(el, ctx));
      if (!inner.trim()) return [];
      return [{ type: 'block', text: inner.split('\n').map((l) => (l ? '> ' + l : '>')).join('\n') }];
    }

    case 'ul':
    case 'ol':
      return [{ type: 'block', text: renderList(el, ctx) }];

    case 'table':
      return [{ type: 'block', text: renderTable(el, ctx) }];

    case 'p': {
      const inner = blocksToMarkdown(render(el, ctx));
      return inner.trim() ? [{ type: 'block', text: inner.trim() }] : [];
    }

    default: {
      // Unknown tag: keep the children, drop the wrapper.
      const parts = render(el, ctx);
      return isBlock(t) && parts.length
        ? [{ type: 'block', text: blocksToMarkdown(parts).trim() }]
        : parts;
    }
  }
}

function textContent(node) {
  if (node.tag === '#text') return node.text;
  if (DROP_WITH_CONTENT.has(node.tag)) return '';
  return node.children.map(textContent).join('');
}

function renderList(el, ctx) {
  const ordered = el.tag === 'ol';
  const indent = '  '.repeat(ctx.listDepth);
  const start = Number(el.attrs.start) || 1;
  const lines = [];
  let n = start;

  for (const li of el.children) {
    if (li.tag !== 'li') continue;
    const inner = blocksToMarkdown(
      render(li, { ...ctx, listDepth: ctx.listDepth + 1 }),
    ).trim();
    if (!inner) continue;

    const marker = ordered ? `${n}. ` : '- ';
    n += 1;
    const pad = ' '.repeat(marker.length);
    const [first, ...rest] = inner.split('\n');
    lines.push(indent + marker + first);
    for (const line of rest) lines.push(line ? indent + pad + line : '');
  }
  return lines.join('\n');
}

function renderTable(el, ctx) {
  const rows = [];
  const walk = (n) => {
    for (const c of n.children) {
      if (c.tag === 'tr') rows.push(c);
      else if (c.children) walk(c);
    }
  };
  walk(el);
  if (!rows.length) return '';

  const cellCtx = { ...ctx, inTable: true };
  const grid = rows.map((tr) =>
    tr.children
      .filter((c) => c.tag === 'td' || c.tag === 'th')
      .map((c) => inlineOf(c, cellCtx).replace(/\|/g, '\\|').replace(/\n+/g, ' ')),
  );

  const width = Math.max(...grid.map((r) => r.length));
  if (!width) return '';
  for (const r of grid) while (r.length < width) r.push('');

  const headerIsTh = rows[0].children.some((c) => c.tag === 'th');
  const header = headerIsTh ? grid.shift() : new Array(width).fill('');
  const sep = new Array(width).fill('---');

  const line = (cells) => '| ' + cells.join(' | ') + ' |';
  return [line(header), line(sep), ...grid.map(line)].join('\n');
}

/** Join rendered parts, separating blocks with a blank line. */
function blocksToMarkdown(parts) {
  const out = [];
  let buf = '';

  const flush = () => {
    const s = buf.replace(/[ \t]+$/gm, '').trim();
    if (s) out.push(s);
    buf = '';
  };

  for (const p of parts) {
    if (p.type === 'block') { flush(); out.push(p.text); }
    else buf += p.text;
  }
  flush();
  return out.join('\n\n');
}

/**
 * Rebase heading levels so the shallowest heading in the document sits at
 * `target`, preserving the relative hierarchy beneath it.
 *
 * A flat shift is wrong here: bodies in this corpus start at h2, h3, or h4
 * depending on who pasted them, so adding a fixed offset pushes some documents
 * to h6 and leaves others at h4. Rebasing to the shallowest heading keeps every
 * document consistent while never inverting its own structure.
 *
 * Guides need target=4 because scripts/lib/parse-content.mjs splits records on
 * h1-h3 — a body heading at those levels would swallow the next record on
 * re-import.
 */
function rebaseHeadings(md, target) {
  const levels = [...md.matchAll(/^(#{1,6})\s+\S/gm)].map((m) => m[1].length);
  if (!levels.length) return md;

  const shift = target - Math.min(...levels);
  if (shift === 0) return md;

  return md.replace(/^(#{1,6})(\s+)(.*)$/gm, (line, hashes, sp, text) => {
    const level = Math.min(6, Math.max(1, hashes.length + shift));
    return '#'.repeat(level) + sp + text;
  });
}

/** A heading is already emphatic; bold inside it is noise from the paste. */
function stripHeadingEmphasis(md) {
  return md.replace(/^(#{1,6}\s+)(.*)$/gm, (line, prefix, text) => {
    const t = text.trim();
    const unwrapped = /^\*\*(.+)\*\*$/.exec(t) || /^\*(.+)\*$/.exec(t);
    return prefix + (unwrapped && !unwrapped[1].includes('**') ? unwrapped[1].trim() : t);
  });
}

/**
 * Convert an HTML fragment to markdown.
 *
 * @param {string} html
 * @param {{ minHeadingLevel?: number }} [opts] minHeadingLevel rebases headings
 *   so the shallowest one lands at that level. See rebaseHeadings.
 */
export function htmlToMarkdown(html, opts = {}) {
  if (!html || !html.trim()) return '';
  const tree = parse(html);
  const parts = render(tree, { headingBase: 0, listDepth: 0, inTable: false });

  let md = blocksToMarkdown(parts)
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();

  md = stripHeadingEmphasis(md);
  if (opts.minHeadingLevel) md = rebaseHeadings(md, opts.minHeadingLevel);
  return md;
}
