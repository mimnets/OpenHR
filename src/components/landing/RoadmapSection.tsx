import React from 'react';
import { Banknote, TrendingUp, Smartphone, Shield, ExternalLink } from 'lucide-react';

const roadmapItems = [
  {
    icon: Banknote,
    title: 'Payroll Engine',
    description: 'Basic salary calculation with export to common payroll formats. Streamline your payroll processing directly within OpenHRApp.',
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    description: 'Deeper HR metrics dashboards with customizable reports, trend analysis, and data-driven workforce insights.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Native Android & iOS apps for a richer mobile experience with push notifications and offline support — beyond the current PWA.',
  },
  {
    icon: Shield,
    title: 'SSO / SAML',
    description: 'Single sign-on for enterprise — integrate with your existing identity provider for seamless and secure authentication.',
  },
];

const RoadmapSection: React.FC = () => {
  return (
    <section id="roadmap" className="py-20 md:py-28 bg-dl-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-dl-xs font-bold text-dl-teal uppercase tracking-dl-label">Roadmap</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-dl-ink mt-3 mb-4">
            Coming Soon
          </h2>
          <p className="text-dl-muted text-lg">
            We're always working on new features to make OpenHRApp even better. Here's what's on the horizon — vote for the ones you care about most.
          </p>
        </div>

        {/* Roadmap Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {roadmapItems.map((item) => (
            <div
              key={item.title}
              className="relative group p-6 bg-dl-ground border border-dl-hair-soft rounded-dl-lg hover:bg-dl-surface hover:shadow-dl-2 hover:border-dl-hair transition-all duration-300 text-left"
            >
              {/* Coming Soon badge */}
              <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-dl-teal bg-dl-teal/10 rounded-full border border-dl-teal/25 select-none">
                Coming Soon
              </span>

              <div className="w-12 h-12 bg-dl-teal/10 rounded-dl-md flex items-center justify-center mb-5 transition-transform group-hover:scale-105">
                <item.icon size={22} className="text-dl-teal" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-dl-ink mb-2 pr-20">{item.title}</h3>
              <p className="text-sm text-dl-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Request a Feature CTA */}
        <div className="text-center mt-10">
          <a
            href="https://github.com/mimnets/openhrapp/issues/new?labels=feature-request&template=feature_request.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-dl-teal border border-dl-teal/25 rounded-dl-md hover:bg-dl-teal/5 transition-colors"
          >
            Request a Feature <ExternalLink size={14} />
          </a>
          <p className="text-xs text-dl-muted mt-3">
            Vote on existing ideas or suggest new ones on GitHub
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
