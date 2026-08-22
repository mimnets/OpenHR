import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import BlogNavbar from '../components/blog/BlogNavbar';
import BlogFooter from '../components/blog/BlogFooter';
import { updatePageMeta, setJsonLd } from '../utils/seo';
import { changelog, ChangelogEntryType } from '../data/changelog';

const typeConfig: Record<ChangelogEntryType, { label: string; bg: string; text: string }> = {
  feature: { label: 'Feature', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  fix: { label: 'Fix', bg: 'bg-red-100', text: 'text-red-700' },
  improvement: { label: 'Improvement', bg: 'bg-blue-100', text: 'text-blue-700' },
  security: { label: 'Security', bg: 'bg-amber-100', text: 'text-amber-700' },
  breaking: { label: 'Breaking', bg: 'bg-purple-100', text: 'text-purple-700' },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

interface ChangelogPageProps {
  onBack: () => void;
}

const ChangelogPage: React.FC<ChangelogPageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageMeta(
      'Changelog — What\'s New in OpenHR | OpenHRApp',
      'See all the latest updates, new features, bug fixes, and improvements to OpenHRApp. Track our development progress and stay up to date.',
      'https://openhrapp.com/changelog'
    );
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'OpenHRApp Changelog',
      description: 'Complete history of updates, features, and fixes for OpenHRApp.',
      url: 'https://openhrapp.com/changelog',
      isPartOf: { '@type': 'WebSite', name: 'OpenHRApp', url: 'https://openhrapp.com' },
    });
    return () => setJsonLd(null);
  }, []);

  return (
    <div className="min-h-screen bg-dl-surface">
      <BlogNavbar onBack={onBack} />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-dl-ground to-dl-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 min-h-6 max-sm:min-h-11 text-sm text-dl-muted hover:text-dl-teal mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-dl-ink mb-3">
            Changelog
          </h1>
          <p className="text-lg text-dl-muted max-w-2xl">
            All the updates, new features, and fixes shipped in OpenHRApp. We release improvements regularly to make HR management easier for your team.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-dl-hair" />

            <div className="space-y-10">
              {changelog.map((release, idx) => (
                <div key={idx} className="relative pl-12 sm:pl-16">
                  {/* Dot on timeline */}
                  <div className="absolute left-2.5 sm:left-4.5 top-1.5 w-3 h-3 rounded-full bg-dl-teal border-2 border-dl-surface ring-2 ring-dl-teal/20" />

                  {/* Date & Title header */}
                  <div className="mb-3">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <time className="text-sm font-semibold text-dl-muted">{formatDate(release.date)}</time>
                      {release.version && (
                        <span className="text-xs font-mono font-medium bg-dl-hair-soft text-dl-muted px-2 py-0.5 rounded-full">
                          v{release.version}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-dl-ink">{release.title}</h2>
                  </div>

                  {/* Entries */}
                  <ul className="space-y-2">
                    {release.entries.map((entry, eidx) => {
                      const cfg = typeConfig[entry.type];
                      return (
                        <li key={eidx} className="flex items-start gap-2.5">
                          <span className={`inline-flex items-center shrink-0 mt-0.5 px-2 py-0.5 rounded text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                          {/* min-w-0 + break-words: entries quote paths like
                              supabase/migrations/0027_… whose min-content width is
                              wider than a 375px viewport. Without both, the flex
                              item refuses to shrink and the page scrolls sideways. */}
                          <span className="min-w-0 break-words text-sm text-dl-ink leading-relaxed">{entry.description}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BlogFooter />
    </div>
  );
};

export default ChangelogPage;
