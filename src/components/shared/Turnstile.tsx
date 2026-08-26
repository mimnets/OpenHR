import React, { useEffect, useId, useRef, useState } from 'react';

// Cloudflare Turnstile widget.
//
// Renders explicitly (not via the auto-render data-attribute scan) so React
// owns the lifecycle and we can reset the widget after a failed submit —
// Turnstile tokens are single-use, so a form that fails validation server-side
// must obtain a fresh token before it can be retried.

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    __turnstileLoading?: Promise<void>;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const loadScript = (): Promise<void> => {
  if (window.turnstile) return Promise.resolve();
  if (window.__turnstileLoading) return window.__turnstileLoading;

  window.__turnstileLoading = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed to load')));
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Turnstile script failed to load'));
    document.head.appendChild(s);
  });

  return window.__turnstileLoading;
};

export interface TurnstileHandle {
  reset: () => void;
}

interface Props {
  /** Called with a fresh token when the challenge is solved, and with '' when it expires. */
  onVerify: (token: string) => void;
  /** Bump this number to force a reset (e.g. after a rejected submit). */
  resetSignal?: number;
  className?: string;
}

const Turnstile: React.FC<Props> = ({ onVerify, resetSignal = 0, className = '' }) => {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const [loadError, setLoadError] = useState(false);
  const domId = useId();

  // Keep the latest callback without re-rendering the widget.
  useEffect(() => { onVerifyRef.current = onVerify; }, [onVerify]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onVerifyRef.current(''),
          'error-callback': () => onVerifyRef.current(''),
          // 'auto' follows the viewer's system theme, so the widget doesn't sit
          // as a white block on the app's dark mode.
          theme: 'auto',
          // Must match the expectedAction the edge function verifies against.
          action: 'register',
        });
      })
      .catch(() => { if (!cancelled) setLoadError(true); });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* already gone */ }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, domId]);

  // Parent asks for a fresh token after a rejected submission.
  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onVerifyRef.current('');
    }
  }, [resetSignal]);

  // Without a site key the widget is simply absent. The edge function is the
  // real gate — it rejects tokenless requests whenever its secret is set — so
  // failing open here only affects local dev, never production.
  if (!siteKey) return null;

  if (loadError) {
    return (
      <p className={`text-[11px] font-bold text-rose-500 ${className}`}>
        Could not load the anti-spam check. Please disable any content blocker and reload.
      </p>
    );
  }

  return <div ref={containerRef} className={className} />;
};

export default Turnstile;
