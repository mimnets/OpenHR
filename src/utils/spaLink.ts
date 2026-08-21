import type React from 'react';
import { navigateTo } from './seo';

/**
 * Helpers for links inside the SPA.
 *
 * The app routes off `currentPath` state rather than a router, so navigation
 * has historically been done with `onClick` handlers on plain `<div>` and
 * `<article>` elements. That works for a mouse and nothing else: such a card is
 * not focusable, is not announced as a link by a screen reader, cannot be
 * opened in a new tab, and cannot be followed by a crawler.
 *
 * These helpers keep client-side routing while restoring a real `<a href>`.
 */

/**
 * True when the browser should handle the click itself.
 *
 * Ctrl/Cmd-click and middle-click open a new tab, Shift-click opens a window,
 * and Alt-click downloads. Calling preventDefault on those breaks behaviour
 * people rely on, so the handler must bow out rather than intercept.
 */
export function isModifiedClick(e: React.MouseEvent): boolean {
  return (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  );
}

/**
 * Props for an internal link: a real `href` a crawler can follow and a browser
 * can open in a new tab, with an `onClick` that routes in-place for a plain
 * left click.
 *
 * @example
 *   <a {...spaLinkProps(`/blog/${post.slug}`)}>{post.title}</a>
 */
export function spaLinkProps(path: string): {
  href: string;
  onClick: (e: React.MouseEvent) => void;
} {
  return {
    href: path,
    onClick: (e: React.MouseEvent) => {
      if (isModifiedClick(e)) return;
      e.preventDefault();
      navigateTo(path);
    },
  };
}

/**
 * Tailwind classes that expand a link's hit area to its nearest positioned
 * ancestor, so the whole card is clickable while only the title is the link.
 *
 * The card must be `relative`. Anything else inside the card that needs to be
 * clickable on its own has to sit above the overlay with `relative z-10`.
 */
export const STRETCHED_LINK =
  'after:absolute after:inset-0 after:content-[""] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm';
