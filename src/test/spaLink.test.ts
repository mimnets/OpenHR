import { describe, it, expect, vi, afterEach } from 'vitest';
import type React from 'react';
import { isModifiedClick, spaLinkProps, STRETCHED_LINK } from '../utils/spaLink';

/**
 * The app routes off `currentPath` state rather than a router, so cards used to
 * navigate via `onClick` on plain `<div>` and `<article>` elements. Those were
 * unreachable by keyboard, unannounced by screen readers, impossible to open in
 * a new tab, and unfollowable by crawlers.
 *
 * What matters most here is the modifier-key path: a handler that calls
 * preventDefault unconditionally silently breaks ctrl-click, which people use
 * constantly to open articles in background tabs.
 */

vi.mock('../utils/seo', () => ({ navigateTo: vi.fn() }));
import { navigateTo } from '../utils/seo';

function clickEvent(overrides: Partial<React.MouseEvent> = {}): React.MouseEvent {
  return {
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
    preventDefault: vi.fn(),
    ...overrides,
  } as unknown as React.MouseEvent;
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('spaLinkProps', () => {
  it('exposes a real href a crawler can follow', () => {
    expect(spaLinkProps('/blog/some-post').href).toBe('/blog/some-post');
  });

  it('routes in place on a plain left click', () => {
    const e = clickEvent();
    spaLinkProps('/blog/some-post').onClick(e);

    expect(e.preventDefault).toHaveBeenCalled();
    expect(navigateTo).toHaveBeenCalledWith('/blog/some-post');
  });

  it.each([
    ['ctrl-click (new tab)', { ctrlKey: true }],
    ['cmd-click (new tab, macOS)', { metaKey: true }],
    ['shift-click (new window)', { shiftKey: true }],
    ['alt-click (download)', { altKey: true }],
    ['middle click (new tab)', { button: 1 }],
  ])('lets the browser handle %s', (_name, overrides) => {
    const e = clickEvent(overrides);
    spaLinkProps('/blog/some-post').onClick(e);

    expect(e.preventDefault).not.toHaveBeenCalled();
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('bows out when something upstream already handled the event', () => {
    const e = clickEvent({ defaultPrevented: true });
    spaLinkProps('/blog/some-post').onClick(e);
    expect(navigateTo).not.toHaveBeenCalled();
  });
});

describe('isModifiedClick', () => {
  it('is false for an ordinary left click', () => {
    expect(isModifiedClick(clickEvent())).toBe(false);
  });

  it('is true for every modifier', () => {
    expect(isModifiedClick(clickEvent({ ctrlKey: true }))).toBe(true);
    expect(isModifiedClick(clickEvent({ metaKey: true }))).toBe(true);
    expect(isModifiedClick(clickEvent({ button: 1 }))).toBe(true);
  });
});

describe('STRETCHED_LINK', () => {
  it('expands the hit area and keeps a visible focus ring', () => {
    // Without the focus ring the card is reachable by keyboard but gives no
    // indication of where focus is, which is worse than not being reachable.
    expect(STRETCHED_LINK).toContain('after:absolute');
    expect(STRETCHED_LINK).toContain('after:inset-0');
    expect(STRETCHED_LINK).toContain('focus-visible:ring-2');
  });
});
