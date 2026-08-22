import React, { useState, useEffect } from 'react';
import { AdConfig, AdSlot } from './AdBanner';
import { sanitizeHtml } from '../../utils/sanitize';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

interface PublicAdBannerProps {
  slot: AdSlot;
  className?: string;
  /**
   * Visible article text length, when the caller already knows it (a blog post knows its own
   * body length). Falls back to measuring the rendered page when omitted.
   */
  contentLength?: number;
}

/**
 * Minimum visible text required on a page before an ad slot is requested — plan item 28.
 *
 * AdSense policy prohibits ads on pages with little or no original content, and a thin page
 * carrying ads is exactly the profile that draws a "Low value content" rejection. Index pages
 * that are mostly navigation should not request a slot at all.
 */
export const MIN_CONTENT_CHARS = 1200;

/**
 * Slots that live on listing/index pages rather than on an article. These are exempt from the
 * content-length guard because their host page is legitimately not an article — but they are
 * still subject to every other policy check.
 */
const INDEX_PAGE_SLOTS: readonly string[] = ['landing-hero', 'landing-mid', 'blog-header', 'blog-feed'];

const measureRenderedContentLength = (): number => {
  if (typeof document === 'undefined') return 0;
  const region = document.querySelector('article') ?? document.querySelector('main');
  return region?.textContent?.trim().length ?? 0;
};

const SLOT_SIZES: Record<string, { width: number; height: number }> = {
  'landing-hero': { width: 728, height: 90 },
  'landing-mid': { width: 728, height: 90 },
  'blog-header': { width: 728, height: 90 },
  'blog-feed': { width: 728, height: 90 },
  'blog-post-top': { width: 728, height: 90 },
  'blog-post-content': { width: 300, height: 250 },
};

export const PublicAdBanner: React.FC<PublicAdBannerProps> = ({ slot, className = '', contentLength }) => {
  const [adConfig, setAdConfig] = useState<AdConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdConfig = async () => {
      // Thin-content guard (item 28). Checked before the fetch so a thin page never even
      // requests a slot. Article slots only — index pages are exempt by design.
      if (!INDEX_PAGE_SLOTS.includes(slot)) {
        const measured = contentLength ?? measureRenderedContentLength();
        if (measured < MIN_CONTENT_CHARS) {
          setIsLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/public-ad-config/${slot}`,
          { headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.enabled) {
          setAdConfig(data as AdConfig);
        }
      } catch (e) {
        // Ad config not found, silently fail
      } finally {
        setIsLoading(false);
      }
    };

    loadAdConfig();
  }, [slot, contentLength]);

  const size = SLOT_SIZES[slot] || { width: 728, height: 90 };
  const aspectRatio = size.width / size.height;

  if (isLoading) {
    return (
      <div
        className={`${className} mx-auto animate-pulse rounded-lg bg-slate-100`}
        style={{
          width: '100%',
          maxWidth: size.width,
          aspectRatio: `${aspectRatio}`,
        }}
      />
    );
  }

  if (!adConfig?.enabled) return null;

  const renderAd = () => {
    switch (adConfig.adType) {
      case 'adsense':
        if (!adConfig.adsenseClient || !adConfig.adsenseSlot) return null;
        return (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={adConfig.adsenseClient}
            data-ad-slot={adConfig.adsenseSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        );

      case 'custom':
        if (!adConfig.customHtml) return null;
        return (
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(adConfig.customHtml) }}
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
          />
        );

      case 'image':
        if (!adConfig.imageUrl) return null;
        const imgContent = (
          <img
            src={adConfig.imageUrl}
            alt={adConfig.altText || 'Advertisement'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="rounded-lg"
          />
        );
        if (adConfig.linkUrl) {
          let finalUrl = adConfig.linkUrl;
          if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
          }
          return (
            <a
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block w-full h-full"
              onClick={(e) => {
                e.stopPropagation();
                window.open(finalUrl, '_blank', 'noopener,noreferrer');
                e.preventDefault();
              }}
            >
              {imgContent}
            </a>
          );
        }
        return imgContent;

      default:
        return null;
    }
  };

  const adContent = renderAd();
  if (!adContent) return null;

  return (
    <div
      className={`ad-banner ad-slot-${slot} ${className} relative overflow-hidden mx-auto`}
      style={{
        width: '100%',
        maxWidth: size.width,
        aspectRatio: `${aspectRatio}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {adContent}
      <span className="text-[9px] text-slate-400 absolute bottom-1 right-2">Ad</span>
    </div>
  );
};
