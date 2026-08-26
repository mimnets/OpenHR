// Branded wrapper for outbound email.
//
// Templates and the model produce only the inner content. The frame is applied
// here, so improving it once improves every message rather than requiring every
// template to be re-edited.
//
// Written to survive email clients, which is a different job from writing for a
// browser. Tables rather than flexbox, inline styles rather than a stylesheet,
// no shorthand Outlook mangles, explicit widths, and a light background painted
// on every layer so Gmail's dark mode cannot leave dark text on a dark ground.

export interface EmailLayoutOptions {
  /** Inner HTML: the message itself, without any wrapper. */
  content: string;
  /** Optional short line under the wordmark, e.g. the organization name. */
  preheader?: string;
  unsubscribeUrl?: string;
  /** Adds a visible test banner. Never set this for a real send. */
  isTest?: boolean;
  testNote?: string;
}

const BRAND = 'OpenHRApp';
const BRAND_URL = 'https://openhrapp.com';
const ACCENT = '#0e6f66';
const INK = '#0e1e1c';
const MUTED = '#6b807d';
const RULE = '#e2eae8';
const GROUND = '#f4f7f6';

/**
 * The preheader is the grey text a mail client shows next to the subject.
 * Left unset, clients grab the first words of the body — usually "Hi Monir",
 * which tells the reader nothing. The spacer characters stop the client
 * pulling body text in after it.
 */
function preheaderBlock(text?: string): string {
  if (!text) return '';
  const spacer = '&#847;&zwnj;&nbsp;'.repeat(60);
  return `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${GROUND};">${text}${spacer}</div>`;
}

export function renderEmail(opts: EmailLayoutOptions): string {
  const { content, preheader, unsubscribeUrl, isTest, testNote } = opts;

  const testBanner = isTest
    ? `<tr><td style="padding:12px 32px;background:#fff4d6;border-bottom:1px solid #f0dfae;">
         <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#7a5c10;">
           <strong>Test message.</strong> ${testNote ?? 'Sent from the dashboard. No customer received this.'}
         </p>
       </td></tr>`
    : '';

  const footerUnsub = unsubscribeUrl
    ? `<br><a href="${unsubscribeUrl}" style="color:${MUTED};text-decoration:underline;">Unsubscribe from these emails</a>`
    : '';

  return `<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${BRAND}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${GROUND};">
${preheaderBlock(preheader)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${GROUND};">
  <tr>
    <td align="center" style="padding:32px 16px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid ${RULE};border-radius:12px;overflow:hidden;">

        <!-- Wordmark -->
        <tr>
          <td style="padding:28px 32px 20px 32px;border-bottom:1px solid ${RULE};">
            <a href="${BRAND_URL}" style="text-decoration:none;">
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.3px;color:${INK};">Open</span><span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.3px;color:${ACCENT};">HRApp</span>
            </a>
          </td>
        </tr>

        ${testBanner}

        <!-- Message -->
        <tr>
          <td style="padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:${INK};">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px 28px 32px;border-top:1px solid ${RULE};background-color:#fbfcfc;">
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:19px;color:${MUTED};">
              Sent by <a href="${BRAND_URL}" style="color:${MUTED};text-decoration:underline;">${BRAND}</a>, because you created an account.${footerUnsub}
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
</body>
</html>`;
}

/**
 * Button colours offered in the composer. Each is a solid background with white
 * text; all clear 4.5:1 contrast so the label stays readable, including for
 * anyone viewing with a colour filter.
 */
export const BUTTON_COLORS: Record<string, string> = {
  teal:   '#0e6f66',   // brand
  blue:   '#1d4ed8',
  green:  '#15803d',
  amber:  '#b45309',
  rose:   '#be123c',
  slate:  '#334155',
};

/**
 * Expands the composer's button markup into a real email button.
 *
 * The composer stores a button as a plain anchor carrying data-btn, which means
 * it survives sanitising, stays a working link if anything downstream drops the
 * styling, and reads sensibly to a screen reader. Only here does it become the
 * table-with-bgcolor construction email needs — Outlook renders padding on an
 * anchor as a thin unclickable strip, so a styled <a> is not an option.
 */
const BUTTON_ANCHOR = /<a\b([^>]*\bdata-btn\b[^>]*)>([\s\S]*?)<\/a>/gi;
/** A button that is the entire contents of a paragraph. */
const BUTTON_PARAGRAPH = /<p>\s*(<a\b[^>]*\bdata-btn\b[^>]*>[\s\S]*?<\/a>)\s*<\/p>/gi;

function buildButton(tag: string): string | null {
  const m = /<a\b([^>]*)>([\s\S]*?)<\/a>/i.exec(tag);
  if (!m) return null;
  const [, attrs, label] = m;
  const href = /href\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
  if (!href) return null;
  const key = /data-btn\s*=\s*["']([^"']*)["']/i.exec(attrs)?.[1]?.toLowerCase() ?? 'teal';
  const bg = BUTTON_COLORS[key] ?? BUTTON_COLORS.teal;
  const text = label.replace(/<[^>]+>/g, '').trim() || 'Open';
  return ctaButton(text, href, bg);
}

/**
 * Lifts every button out of the content, leaving an HTML comment in its place.
 *
 * A comment is used as the marker because none of the tag rules below can match
 * one, DOMPurify has already stripped any comment a person could have written,
 * and it keeps the source plain ASCII — an earlier version used NUL bytes,
 * which made the file register as binary to git and grep.
 *
 * Extracting rather than expanding in place is the whole point. The tag rules
 * in styleInlineContent are blunt string replacements, and an earlier version
 * expanded buttons first — so the generic `<a ` rule then prepended a SECOND
 * style attribute to the finished button. HTML keeps the first style attribute
 * and discards the duplicate, so the label inherited the link colour and
 * rendered teal on a teal background: a button with invisible text.
 *
 * A marker cannot be matched by any of those rules, so finished markup stays
 * finished no matter what is added to the pipeline later.
 *
 * A button alone in a paragraph consumes the paragraph too, because the
 * expansion is a <table> and a table inside a <p> is invalid — some clients
 * close the paragraph early and strand the button outside the layout.
 */
function extractButtons(html: string): { html: string; buttons: string[] } {
  const buttons: string[] = [];
  const mark = () => `<!--BTN${buttons.length - 1}-->`;

  let out = html.replace(BUTTON_PARAGRAPH, (whole, anchor: string) => {
    const built = buildButton(anchor);
    if (!built) return whole;
    buttons.push(built);
    return mark();
  });

  out = out.replace(BUTTON_ANCHOR, (whole) => {
    const built = buildButton(whole);
    if (!built) return whole;
    buttons.push(built);
    return mark();
  });

  return { html: out, buttons };
}

/**
 * Styles the bare tags a template or the model produces.
 *
 * Email clients ignore <style> blocks often enough that anything unstyled
 * inherits browser defaults — which is why an unwrapped <p> reads as a plain
 * document rather than as a designed message. Applied to the inner content
 * before it goes into the frame.
 */
export function styleInlineContent(html: string): string {
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  // Buttons come out first and go back in last. Everything between is blunt
  // string replacement that must not touch already-finished markup.
  const { html: work, buttons } = extractButtons(html);

  const styled = work
    .replace(/<p>/g, `<p style="margin:0 0 16px 0;font-family:${font};font-size:15px;line-height:24px;color:${INK};">`)
    .replace(/<h1>/g, `<h1 style="margin:0 0 16px 0;font-family:${font};font-size:22px;line-height:30px;font-weight:700;color:${INK};">`)
    .replace(/<h2>/g, `<h2 style="margin:24px 0 12px 0;font-family:${font};font-size:18px;line-height:26px;font-weight:700;color:${INK};">`)
    .replace(/<ul>/g, `<ul style="margin:0 0 16px 0;padding-left:22px;font-family:${font};font-size:15px;line-height:24px;color:${INK};">`)
    .replace(/<ol>/g, `<ol style="margin:0 0 16px 0;padding-left:22px;font-family:${font};font-size:15px;line-height:24px;color:${INK};">`)
    .replace(/<li>/g, `<li style="margin:0 0 6px 0;">`)
    .replace(/<a /g, `<a style="color:${ACCENT};text-decoration:underline;" `)
    .replace(/<blockquote>/g, `<blockquote style="margin:0 0 16px 0;padding:12px 16px;border-left:3px solid ${RULE};color:${MUTED};font-family:${font};font-size:15px;line-height:24px;">`);

  // Put the finished buttons back, untouched by any of the above.
  return styled.replace(/<!--BTN(\d+)-->/g, (whole, i: string) => buttons[Number(i)] ?? whole);
}

/**
 * A call-to-action button.
 *
 * Uses a table with VML for Outlook rather than a styled <a>, because Outlook
 * renders padding on an anchor as a thin unclickable strip.
 */
export function ctaButton(label: string, url: string, bg: string = ACCENT): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px 0;"><tr><td align="center" bgcolor="${bg}" style="border-radius:8px;"><a href="${url}" style="display:inline-block;padding:13px 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${label}</a></td></tr></table>`;
}
