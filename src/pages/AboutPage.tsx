import React, { useEffect } from 'react';
import { Info, Heart, Globe, Code, Users, GitBranch, ArrowRight } from 'lucide-react';
import BlogNavbar from '../components/blog/BlogNavbar';
import BlogFooter from '../components/blog/BlogFooter';
import { navigateTo, updatePageMeta, setJsonLd } from '../utils/seo';

interface AboutPageProps {
  onBack: () => void;
  onRegisterClick?: () => void;
}

const stats = [
  { icon: Users, value: '50+', label: 'Organizations Using OpenHRApp' },
  { icon: Code, value: '100%', label: 'Open Source (MIT License)' },
  { icon: Globe, value: 'PWA', label: 'Works on Any Device' },
];

const values = [
  {
    icon: Heart,
    title: 'Free Forever',
    description: 'We believe that essential HR tools should be accessible to every organization, regardless of budget. The core platform is and always will be free.',
  },
  {
    icon: Globe,
    title: 'Open Source',
    description: 'Transparency builds trust. Our code is public, our roadmap is open, and anyone can contribute. No vendor lock-in, no hidden fees, no surprises.',
  },
  {
    icon: Users,
    title: 'Community-Driven',
    description: 'OpenHRApp is shaped by the people who use it. Feature requests, bug reports, and community contributions directly influence our development priorities.',
  },
  {
    icon: GitBranch,
    title: 'Built for Scale',
    description: 'Whether you have 5 employees or 500, OpenHRApp scales with you. Role-based access control, multi-department support, and configurable workflows adapt to your needs.',
  },
];

const AboutPage: React.FC<AboutPageProps> = ({ onBack, onRegisterClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageMeta(
      'About OpenHRApp — Free Open-Source HR Management Platform',
      'Learn about the team, mission, and values behind OpenHRApp. A free, open-source HR platform built to make HR management accessible to organizations of every size.',
      'https://openhrapp.com/about'
    );
    setJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          name: 'About OpenHRApp',
          description: 'Learn about the team, mission, and values behind OpenHRApp — the free, open-source HR management platform.',
          url: 'https://openhrapp.com/about',
          isPartOf: {
            '@type': 'WebSite',
            name: 'OpenHRApp',
            url: 'https://openhrapp.com',
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://openhrapp.com/' },
            { '@type': 'ListItem', position: 2, name: 'About', item: 'https://openhrapp.com/about' },
          ],
        },
      ],
    });
    return () => { setJsonLd(null); };
  }, []);

  const handleGetStarted = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      navigateTo('/');
    }
  };

  return (
    <div className="min-h-screen bg-dl-ground flex flex-col">
      <BlogNavbar onBack={onBack} onRegisterClick={onRegisterClick} />

      {/* Hero */}
      <div className="bg-dl-surface border-b border-dl-hair-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-dl-lg bg-dl-teal/10 mb-6">
            <Info className="text-dl-teal" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-dl-ink tracking-tight mb-6">
            About OpenHRApp
          </h1>
          <p className="text-lg md:text-xl text-dl-muted max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make HR management accessible, transparent, and free for organizations everywhere. OpenHRApp is a community-driven, open-source HR platform built for the modern workplace.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="space-y-20">
            {/* Story Section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-dl-ink mb-6">Our Story</h2>
              <div className="prose prose-slate prose-lg max-w-none">
                <p className="text-dl-muted leading-relaxed mb-4">
                  OpenHRApp was born out of a simple frustration: HR software is too expensive and too complicated for most organizations. Small businesses, startups, non-profits, and growing teams were being priced out of tools they desperately needed — forced to choose between overpriced enterprise platforms and error-prone spreadsheets.
                </p>
                <p className="text-dl-muted leading-relaxed mb-4">
                  We asked a different question: <em>What if essential HR tools were free, open-source, and actually easy to use?</em>
                </p>
                <p className="text-dl-muted leading-relaxed mb-4">
                  Starting in 2024, we began building OpenHRApp as an open-source project — a Progressive Web App that works on any device, with no downloads, no per-user pricing, and no hidden costs. Attendance tracking with selfie verification. Leave management with one-click approvals. Employee directories. Performance reviews. Reports. Everything a growing team needs, completely free.
                </p>
                <p className="text-dl-muted leading-relaxed">
                  Today, OpenHRApp is used by organizations across multiple countries, helping HR teams save hours every week and giving employees a modern, intuitive experience. And because it's open source, the community continuously improves it — fixing bugs, adding features, and making it better for everyone.
                </p>
              </div>
            </section>

            {/* Mission Section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-dl-ink mb-6">Our Mission</h2>
              <div className="bg-dl-teal/5 border border-dl-teal/15 rounded-dl-lg p-6 sm:p-10">
                <p className="text-lg md:text-xl text-dl-ink leading-relaxed font-medium text-center">
                  To democratize HR technology by building the world's most accessible, transparent, and community-driven human resources platform — freely available to every organization, everywhere.
                </p>
              </div>
            </section>

            {/* Values Section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-dl-ink mb-8">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="bg-dl-surface rounded-dl-lg border border-dl-hair-soft shadow-dl-1 p-6 hover:shadow-dl-1 transition-shadow"
                  >
                    <div className="w-12 h-12 bg-dl-teal/10 rounded-dl-md flex items-center justify-center mb-4">
                      <value.icon size={22} className="text-dl-teal" />
                    </div>
                    <h3 className="text-lg font-bold text-dl-ink mb-2">{value.title}</h3>
                    <p className="text-sm text-dl-muted leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Stats Section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-dl-ink mb-8 text-center">OpenHRApp by the Numbers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-8 bg-dl-surface rounded-dl-lg border border-dl-hair-soft shadow-dl-1"
                  >
                    <stat.icon size={28} className="text-dl-teal mx-auto mb-4" />
                    <p className="text-3xl font-bold text-dl-ink mb-1">{stat.value}</p>
                    <p className="text-sm text-dl-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Open Source Callout */}
            <section className="bg-dl-ink dark:bg-dl-ground text-dl-surface dark:text-dl-ink rounded-dl-lg p-8 sm:p-12 text-center">
              <Code size={40} className="mx-auto mb-4 text-dl-teal" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Proudly Open Source</h2>
              <p className="text-dl-surface/70 dark:text-dl-muted text-dl-base leading-relaxed max-w-2xl mx-auto mb-8">
                OpenHRApp is licensed under the MIT license. Our entire codebase is available on GitHub. You can inspect the code, suggest improvements, report issues, or even self-host your own instance. We believe that HR software should be transparent — and that the best tools are built in the open.
              </p>
              <a
                href="https://github.com/mimnets/openhrapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-dl-surface text-dl-ink font-bold rounded-dl-md hover:bg-dl-hair-soft transition-colors text-sm"
              >
                <GitBranch size={18} /> View on GitHub
              </a>
            </section>

            {/* CTA */}
            <section className="text-center bg-dl-teal/5 border border-dl-teal/15 rounded-dl-lg p-8 sm:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-dl-ink mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-dl-muted text-lg max-w-2xl mx-auto mb-8">
                Join organizations around the world that use OpenHRApp to manage their HR. Free forever, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-3.5 bg-dl-teal text-dl-surface font-bold rounded-dl-md hover:bg-dl-teal-deep transition-colors shadow-dl-1 text-sm flex items-center gap-2"
                >
                  Get Started Free <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigateTo('/features')}
                  className="px-8 py-3.5 bg-dl-surface text-dl-ink font-bold rounded-dl-md hover:bg-dl-ground transition-colors text-sm border border-dl-hair"
                >
                  Explore Features
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <BlogFooter />
    </div>
  );
};

export default AboutPage;
