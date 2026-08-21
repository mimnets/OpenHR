import React, { useState, useEffect } from 'react';
import { Scale, GitBranch, Server, Star, ArrowUpRight } from 'lucide-react';
import { navigateTo } from '../../utils/seo';

/**
 * Verifiable proof — replaces the fabricated testimonials (plan Addendum 1, N4 / finding F-L1).
 *
 * The section this supersedes carried three named people at named companies — none of them
 * customers — alongside five-star ratings and unverifiable figures ("50+ Organizations",
 * "99.9% Uptime"). Invented testimonials attributed to named individuals are deceptive content
 * under Google's policies and unlawful advertising in most jurisdictions, and fake review
 * markup is its own violation. All of it is gone.
 *
 * The rule for anything added here: a visitor must be able to check it themselves in under a
 * minute. Every claim below resolves to a public artefact — the licence file, the repository,
 * the Dockerfile, the changelog. The star count is fetched live and simply does not render if
 * the request fails; a hardcoded number would be the same lie in a smaller font.
 *
 * Real testimonials may return here only with genuine quotes and written permission to publish.
 */

const REPO = 'mimnets/openhrapp';

const proofPoints = [
  {
    icon: Scale,
    title: 'MIT licensed',
    body: 'The most permissive common licence. Use it commercially, modify it, run it for a thousand employees — no fee, no seat count, no rug-pull clause.',
    href: `https://github.com/${REPO}/blob/main/LICENSE`,
    linkLabel: 'Read the licence',
  },
  {
    icon: GitBranch,
    title: 'The whole source is public',
    body: 'Not a stripped "community edition" with the useful parts behind a paywall. What runs on this site is what is in the repository, and you can read every line of it before you trust it with employee records.',
    href: `https://github.com/${REPO}`,
    linkLabel: 'Browse the code',
  },
  {
    icon: Server,
    title: 'Runs on your own server',
    body: 'A Docker Compose file and a Postgres database. If you would rather your attendance data never left your building, it does not have to — the self-hosted install is the same product, not a limited one.',
    href: `https://github.com/${REPO}#self-hosting`,
    linkLabel: 'See the setup',
  },
];

export const ProofSection: React.FC = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    // If GitHub is unreachable or rate-limits us, the count simply never appears.
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && typeof d?.stargazers_count === 'number') setStars(d.stargazers_count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20 md:py-28 bg-dl-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-dl-xs font-bold text-dl-teal uppercase tracking-dl-label">
            Open source, verifiably
          </span>
          <h2 className="font-dl-display text-dl-3xl sm:text-dl-4xl font-semibold text-dl-ink tracking-dl-display mt-3 mb-5">
            Don&rsquo;t take our word for any of this
          </h2>
          <p className="text-dl-lg text-dl-muted leading-relaxed">
            Most HR platforms ask you to trust a sales page. Because OpenHRApp is open source, you
            don&rsquo;t have to trust ours — you can go and check. The licence, the source, the
            deployment setup and the full development history are all public, and every claim on
            this page points at the artefact that proves it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {proofPoints.map(({ icon: Icon, title, body, href, linkLabel }) => (
            <div
              key={title}
              className="bg-dl-surface-2 border border-dl-hair rounded-dl-lg p-6 md:p-7 shadow-dl-1 flex flex-col"
            >
              <div className="w-11 h-11 rounded-dl-md bg-dl-teal/10 text-dl-teal flex items-center justify-center mb-5">
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3 className="font-dl-display text-dl-lg font-semibold text-dl-ink tracking-dl-head mb-3">
                {title}
              </h3>
              <p className="text-dl-sm text-dl-muted leading-relaxed mb-5 grow">{body}</p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-dl-sm font-semibold text-dl-teal hover:text-dl-teal-deep transition-colors"
              >
                {linkLabel}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          {stars !== null && (
            <a
              href={`https://github.com/${REPO}/stargazers`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-dl-sm text-dl-muted hover:text-dl-teal transition-colors"
            >
              <Star size={15} aria-hidden="true" />
              <span className="font-dl-mono tabular-nums font-medium">{stars.toLocaleString()}</span>
              <span>stars on GitHub</span>
            </a>
          )}
          <button
            onClick={() => navigateTo('/changelog')}
            className="inline-flex items-center gap-1.5 text-dl-sm text-dl-muted hover:text-dl-teal transition-colors"
          >
            Every release, written down
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
