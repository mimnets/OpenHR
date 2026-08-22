/**
 * Video prompt generator for the how-to guides.
 *
 * Guides are procedural — "how to clock in", "how to apply for leave" — which is
 * exactly the content people look for on video, and a guide page with an
 * embedded video earns a VideoObject rich result that a text-only page cannot.
 *
 * Videos are built clip by clip and assembled in an editor, so this emits a shot
 * list rather than one prompt per video: current text-to-video models cap out
 * around 8 seconds per generation, and a single prompt for a two-minute
 * explainer produces incoherent drift. Each clip is generated independently and
 * cut together.
 *
 * Clips are derived from each guide's own section headings, so the video follows
 * the same steps as the written guide instead of inventing a parallel structure.
 */

import { BRAND } from './cover-prompts.mjs';

/** Text-to-video models generate in short takes; 8s is the common ceiling. */
export const CLIP_SECONDS = 8;

/**
 * One visual grammar for every clip in every guide, so clips generated hours
 * apart still cut together. Drift between takes is the main failure mode of
 * assembled AI video, and a fixed style block is the cheapest defence.
 */
const VIDEO_STYLE =
  `Style: clean 2D motion-graphics explainer, flat vector shapes, no photorealism, no 3D render. ` +
  `Strict palette: muted slate blue ${BRAND.primary} dominant, pale blue ${BRAND.primaryLight} fills, ` +
  `deep slate ${BRAND.ink} line work, off-white ${BRAND.paper} background. ` +
  `Soft even lighting, no harsh shadows. Camera is locked off or moves very slowly — ` +
  `a gentle push in or a slow lateral drift, never a whip pan or an orbit. ` +
  `Motion is calm and continuous, one idea per shot.`;

const VIDEO_NEGATIVE =
  `no on-screen text, no captions, no lettering, no watermarks, no logos, no user interface ` +
  `chrome, no real device screens, no recognisable faces, no fast cuts within the clip, ` +
  `no camera shake, no lens flare, no neon colours, no crowds, no clutter`;

/**
 * On-screen text is added in the editor, never generated.
 *
 * Generated lettering is unreliable — misspelt, warped, or inconsistent between
 * takes — and burnt-in text cannot be corrected or translated later without
 * regenerating the clip.
 */
const TEXT_POLICY =
  'All on-screen text is added in the editor. The negative prompt forbids generated lettering.';

/* --------------------------------------------------------------- clip plan */

/** Strip markdown down to speakable prose. */
function toSpeech(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*\|.*\|\s*$/gm, ' ')          // tables do not narrate
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // keep link text, drop the URL
    .replace(/[*_`>#]/g, '')
    .replace(/^\s*[-+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** First one or two sentences, capped so a clip's narration fits its ~8 seconds. */
function draftNarration(body) {
  const prose = toSpeech(body);
  if (!prose) return '';

  const sentences = prose.match(/[^.!?]+[.!?]+/g) || [prose];
  let out = '';
  for (const s of sentences) {
    if (out && (out + s).trim().length > 220) break;
    out += s;
    if (out.trim().length > 120) break;
  }
  return out.trim();
}

/**
 * Pull the body's section headings with the prose beneath each one. The
 * headings are the guide's real steps; the prose becomes draft narration, so
 * the voiceover starts from what the guide actually says rather than a blank.
 */
function sectionsOf(markdown) {
  const re = /^(#{4,6})\s+(.+)$/gm;
  const found = [];
  let m;
  while ((m = re.exec(markdown)) !== null) found.push({ heading: m[2].trim(), start: m.index, end: re.lastIndex });

  return found
    .map((s, i) => ({
      heading: s.heading,
      body: markdown.slice(s.end, i + 1 < found.length ? found[i + 1].start : markdown.length),
    }))
    .filter((s) => !/^related guides?$/i.test(s.heading));
}

/**
 * A short establishing beat for the topic, reused as the opening clip.
 * Mirrors the cover-image motifs so a guide's video and cover feel related.
 */
const OPENERS = {
  attendance: 'a stylised clock face and a location pin easing into frame and settling side by side',
  leave: 'a calendar page turning gently, a few days softening into highlight',
  employees: 'a small grid of abstract profile cards assembling one by one',
  organization: 'connected nodes growing outward from a single root into a tidy chart',
  reports: 'a bar chart rising column by column, a line sweeping across above it',
  settings: 'interlocking gears beginning to turn, toggles switching in sequence',
  performance: 'a growth curve drawing itself across the frame beside a scorecard',
  announcements: 'a megaphone emitting slow concentric rings that widen and fade',
  'getting started': 'a path drawing itself forward, a checklist ticking its first item',
};

function openerFor(category) {
  const cat = String(category || '').toLowerCase();
  for (const k of Object.keys(OPENERS).sort((a, b) => b.length - a.length)) {
    if (cat.includes(k)) return OPENERS[k];
  }
  return 'simple geometric shapes assembling into a calm workspace scene';
}

/** Turn a heading into a description of motion rather than a static picture. */
function beatFor(heading) {
  const h = heading.replace(/[*_`]/g, '').trim();
  const lower = h.toLowerCase();

  if (/before you (start|begin)|prerequisite|requirement/.test(lower)) {
    return `a short checklist assembling itself, each item ticking in turn, representing "${h}"`;
  }
  if (/troubleshoot|problem|issue|error|fix|not work/.test(lower)) {
    return `a single shape briefly turning amber then resolving back to blue as a check mark settles beside it, representing "${h}"`;
  }
  if (/tip|best practice|note/.test(lower)) {
    return `a lightbulb shape brightening softly while small accent marks radiate outward, representing "${h}"`;
  }
  if (/approve|approval|review/.test(lower)) {
    return `a card passing between two abstract figures and receiving a check mark, representing "${h}"`;
  }
  if (/export|download|report/.test(lower)) {
    return `a document sliding out of a container with a download arrow tracing downward, representing "${h}"`;
  }
  if (/setting|configure|customis|customiz/.test(lower)) {
    return `toggles and sliders adjusting one after another in a neat column, representing "${h}"`;
  }
  return `an abstract flat-vector sequence illustrating "${h}", one clear action unfolding in the centre of frame`;
}

/**
 * @param {{ title: string, slug: string, category: string, excerpt: string }} row
 * @param {string} markdown  the guide body, already converted
 */
export function buildVideoPlan(row, markdown) {
  const sections = sectionsOf(markdown);

  // Long guides make long videos nobody finishes. Cap the body at six beats and
  // report what was dropped rather than silently truncating the shot list.
  const MAX_BODY_CLIPS = 6;
  const used = sections.slice(0, MAX_BODY_CLIPS);
  const dropped = sections.slice(MAX_BODY_CLIPS).map((s) => s.heading);

  const clips = [];

  clips.push({
    label: 'Hook',
    purpose: 'State the problem the guide solves. Earns the next five seconds.',
    visual: openerFor(row.category),
    voiceover: `${String(row.excerpt || row.title).trim()}`,
    onScreen: row.title,
  });

  used.forEach((section, i) => {
    const { heading, body } = section;
    const narration = draftNarration(body);

    clips.push({
      label: `Step ${i + 1} — ${heading}`,
      purpose: `Covers the "${heading}" section of the written guide.`,
      visual: beatFor(heading),
      // Draft, not final: lifted from the guide's own prose so it is accurate,
      // but written to be read rather than spoken. Tighten before recording.
      voiceover: narration
        ? `${narration}  _(draft — from the guide; tighten for speech)_`
        : `[No prose under this heading — write one or two sentences for "${heading}".]`,
      onScreen: heading,
    });
  });

  clips.push({
    label: 'Close',
    purpose: 'Send the viewer to the written guide, which carries the detail.',
    visual: 'the elements from the opening shot drawing back together and settling into a calm final composition, with clear empty space in the lower third',
    voiceover: 'Full step-by-step instructions are in the written guide — link below.',
    onScreen: `openhrapp.com/how-to-use/${row.slug}`,
  });

  const runtime = clips.length * CLIP_SECONDS;

  return {
    slug: row.slug,
    title: String(row.title || '').trim(),
    category: row.category || '—',
    clips: clips.map((c, i) => ({
      ...c,
      index: i + 1,
      file: `${row.slug}-clip-${String(i + 1).padStart(2, '0')}.mp4`,
      prompt: `${c.visual}. ${VIDEO_STYLE} 16:9 landscape, ${CLIP_SECONDS} seconds, seamless loop-safe start and end.`,
      negative: VIDEO_NEGATIVE,
    })),
    runtime,
    dropped,
  };
}

export const VIDEO_SPEC_NOTE = `**How to use this file**

Each guide below is broken into clips of about ${CLIP_SECONDS} seconds. Generate them one at
a time, then cut them together in that order. Clips are short because current text-to-video
models cap out around ${CLIP_SECONDS} seconds per generation — asking one prompt for a
two-minute explainer produces drift, where the style wanders partway through and the result
cannot be cut with anything else.

**Output spec — the same for every clip:**

| Setting | Value | Why |
|---|---|---|
| Resolution | **1920 x 1080** | 16:9. Downscale for social later; never upscale. |
| Frame rate | 24 or 30 fps, **the same for every clip** | Mixing frame rates in one timeline causes visible judder at the cuts. |
| Clip length | ~${CLIP_SECONDS}s | The practical ceiling for a coherent single generation. |
| On-screen text | **None generated** | ${TEXT_POLICY} |
| Audio | **None generated** | Add voiceover and music in the editor so they can be revised without regenerating. |

**Why the style block is repeated in every prompt.** Clips generated in separate calls drift
apart — different palette, different line weight, different camera energy — and drifting
clips cannot be cut together. The identical style block in every prompt is what makes the
takes match.

**Assembly**

1. Generate each clip, keeping the suggested filename so the sort order *is* the edit order.
2. Drop them on the timeline in order. Straight cuts; no transitions. Cross-dissolves on
   flat vector motion look like a mistake.
3. Record the voiceover first, then trim each clip to the narration rather than the reverse.
   Clips can be slowed slightly to fit; speeding them up reads as nervous.
4. Add on-screen text in the editor, using the **On screen** value given for each clip.
5. Burn in captions or ship a \`.srt\`. Most viewers watch muted, and caption text is
   indexable in a way that spoken audio is not.
6. Export H.264 MP4, 1080p, and keep it under about 100 MB so it can be hosted directly.

**After publishing.** A guide page with an embedded video can carry \`VideoObject\` structured
data — thumbnail, duration, upload date, and a description — which is what produces a video
thumbnail in search results. The prerender middleware already emits \`TechArticle\` for guides;
\`VideoObject\` would be an addition to it, not a replacement.`;
