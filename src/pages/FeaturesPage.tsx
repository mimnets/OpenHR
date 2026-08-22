import React, { useEffect } from 'react';
import { Shield, Smartphone, Globe, Bell, Settings, Check, ArrowRight } from 'lucide-react';
import BlogNavbar from '../components/blog/BlogNavbar';
import BlogFooter from '../components/blog/BlogFooter';
import { navigateTo, updatePageMeta, setJsonLd } from '../utils/seo';
import { features } from '../data/features';

const platformFeatures = [
  {
    icon: Smartphone,
    title: 'Works on Any Device',
    description: 'Progressive Web App that works on phones, tablets, and desktops. Install it like a native app — no app store needed.',
  },
  {
    icon: Globe,
    title: 'Cloud-Based & Always Available',
    description: 'Access your HR system from anywhere. All data is securely stored in the cloud with automatic backups.',
  },
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description: 'Email and in-app notifications for leave requests, approvals, attendance alerts, and announcements.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Role-based access control ensures employees only see what they should. All data is encrypted and protected.',
  },
  {
    icon: Settings,
    title: 'Customizable',
    description: 'Configure departments, designations, leave types, review cycles, themes, and more to match your organization.',
  },
];

const comparisonRows = [
  { feature: 'Attendance tracking', openhr: true, typical: true },
  { feature: 'Selfie + GPS verification', openhr: true, typical: false },
  { feature: 'Leave management', openhr: true, typical: true },
  { feature: 'Custom leave types', openhr: true, typical: 'Paid add-on' },
  { feature: 'Employee directory', openhr: true, typical: true },
  { feature: 'Performance reviews', openhr: true, typical: 'Paid add-on' },
  { feature: 'Reports & analytics', openhr: true, typical: true },
  { feature: 'Email notifications', openhr: true, typical: true },
  { feature: 'Mobile app (PWA)', openhr: true, typical: 'Paid add-on' },
  { feature: 'Open source', openhr: true, typical: false },
  { feature: 'Free tier available', openhr: true, typical: false },
  { feature: 'No per-user pricing', openhr: true, typical: false },
];

interface FeaturesPageProps {
  onBack: () => void;
  onRegisterClick?: () => void;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onBack, onRegisterClick }) => {
  useEffect(() => {
    updatePageMeta(
      'Features | OpenHRApp',
      'Explore all OpenHRApp features: selfie-based attendance with GPS, leave management, employee directory, performance reviews, reports, and more. Free and open-source.',
      'https://openhrapp.com/features',
      'https://openhrapp.com/img/screenshot-wide.png'
    );
    setJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: 'OpenHRApp Features',
          description: 'Complete list of OpenHRApp HRMS features including attendance management, leave management, employee directory, performance reviews, and analytics.',
          url: 'https://openhrapp.com/features',
          isPartOf: { '@type': 'WebSite', name: 'OpenHRApp', url: 'https://openhrapp.com' },
        },
        {
          '@type': 'ItemList',
          name: 'OpenHRApp Feature List',
          url: 'https://openhrapp.com/features',
          numberOfItems: features.length,
          itemListElement: features.map((f, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: f.title,
            url: `https://openhrapp.com/features/${f.slug}`,
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://openhrapp.com/' },
            { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://openhrapp.com/features' },
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
      <BlogNavbar onBack={onBack} />

      {/* Hero */}
      <div className="bg-dl-surface border-b border-dl-hair-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="text-xs font-bold text-dl-teal uppercase tracking-widest">Features</span>
          <h1 className="text-4xl md:text-5xl font-semibold text-dl-ink tracking-tight mt-4 mb-6">
            All-in-One HR Management
          </h1>
          <p className="text-lg md:text-xl text-dl-muted max-w-3xl mx-auto leading-relaxed">
            Everything you need to manage attendance, leave, employees, performance reviews, and reports — in one free, open-source platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3.5 bg-dl-teal text-dl-surface font-bold rounded-dl-md hover:bg-dl-teal-deep transition-colors shadow-dl-1 text-sm"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigateTo('/how-to-use')}
              className="px-8 py-3.5 bg-dl-hair-soft text-dl-ink font-bold rounded-dl-md hover:bg-dl-hair transition-colors text-sm border border-dl-hair"
            >
              View Guides
            </button>
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="space-y-24">
            {features.map((feature, index) => (
              <section key={feature.title} id={feature.title.toLowerCase().replace(/\s+/g, '-')}>
                <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-start`}>
                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 ${feature.bg} rounded-dl-md flex items-center justify-center`}>
                        <feature.icon size={22} className={feature.color} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-dl-ink">{feature.title}</h2>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-dl-teal mb-4">{feature.subtitle}</p>
                    <p className="text-dl-muted text-base leading-relaxed mb-8">
                      {feature.description}
                    </p>

                    {/* Sub-features list */}
                    <ul className="space-y-3">
                      {feature.subFeatures.map(sub => (
                        <li key={sub} className="flex items-start gap-3">
                          <Check size={18} className={`${feature.color} mt-0.5 flex-shrink-0`} />
                          <span className="text-sm text-dl-ink">{sub}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => navigateTo(`/features/${feature.slug}`)}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-dl-teal hover:text-dl-teal-deep transition-colors"
                    >
                      Learn more about {feature.title.toLowerCase()} <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Visual Placeholder */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className={`${feature.bg} ${feature.border} border rounded-dl-lg p-8 md:p-12 flex flex-col items-center justify-center min-h-[320px]`}>
                      <feature.icon size={64} className={`${feature.color} opacity-20 mb-4`} />
                      <p className="text-sm font-semibold text-dl-muted">{feature.title}</p>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-dl-surface border-y border-dl-hair-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-dl-teal uppercase tracking-widest">Platform</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-dl-ink mt-3 mb-4">
                Built for Modern Teams
              </h2>
              <p className="text-dl-muted text-lg">
                Beyond core HR features, OpenHRApp is designed to be fast, accessible, and customizable.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformFeatures.map(pf => (
                <div
                  key={pf.title}
                  className="p-6 bg-dl-ground border border-dl-hair-soft rounded-dl-lg hover:bg-dl-surface hover:shadow-dl-2 hover:border-dl-hair transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-dl-teal/10 rounded-dl-md flex items-center justify-center mb-5">
                    <pf.icon size={22} className="text-dl-teal" />
                  </div>
                  <h3 className="text-base font-bold text-dl-ink mb-2">{pf.title}</h3>
                  <p className="text-sm text-dl-muted leading-relaxed">{pf.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-dl-teal uppercase tracking-widest">Comparison</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-dl-ink mt-3 mb-4">
              OpenHRApp vs Typical Paid HRMS
            </h2>
            <p className="text-dl-muted text-lg">
              Get more features out of the box — without the per-user pricing.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-dl-surface rounded-dl-lg border border-dl-hair-soft shadow-dl-1 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-dl-ground border-b border-dl-hair-soft">
                <div className="px-6 py-4 text-sm font-bold text-dl-ink">Feature</div>
                <div className="px-6 py-4 text-sm font-bold text-dl-teal text-center">OpenHRApp</div>
                <div className="px-6 py-4 text-sm font-bold text-dl-muted text-center">Typical Paid HRMS</div>
              </div>
              {/* Table Rows */}
              {comparisonRows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 ${i < comparisonRows.length - 1 ? 'border-b border-dl-hair-soft' : ''} hover:bg-dl-ground/50 transition-colors`}
                >
                  <div className="px-6 py-3.5 text-sm text-dl-ink">{row.feature}</div>
                  <div className="px-6 py-3.5 flex justify-center">
                    {row.openhr === true ? (
                      <Check size={18} className="text-dl-teal" />
                    ) : (
                      <span className="text-sm text-dl-muted">{String(row.openhr)}</span>
                    )}
                  </div>
                  <div className="px-6 py-3.5 flex justify-center">
                    {row.typical === true ? (
                      <Check size={18} className="text-dl-muted" />
                    ) : row.typical === false ? (
                      <span className="text-sm text-dl-muted">-</span>
                    ) : (
                      <span className="text-xs text-dl-teal font-medium bg-dl-teal/10 px-2 py-0.5 rounded-full">{String(row.typical)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-dl-teal/5 border-y border-dl-teal/15">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-dl-ink mb-4">
              Ready to simplify your HR?
            </h2>
            <p className="text-lg text-dl-muted mb-8 max-w-2xl mx-auto">
              Join organizations already using OpenHRApp. Free to start, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-3.5 bg-dl-teal text-dl-surface font-bold rounded-dl-md hover:bg-dl-teal-deep transition-colors shadow-dl-1 text-sm flex items-center gap-2"
              >
                Get Started Free <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigateTo('/blog')}
                className="px-8 py-3.5 bg-dl-surface text-dl-ink font-bold rounded-dl-md hover:bg-dl-ground transition-colors text-sm border border-dl-hair"
              >
                Read Our Blog
              </button>
            </div>
          </div>
        </div>
      </div>

      <BlogFooter />
    </div>
  );
};

export default FeaturesPage;
