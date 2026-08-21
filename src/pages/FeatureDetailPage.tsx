import React, { useEffect } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import BlogNavbar from '../components/blog/BlogNavbar';
import BlogFooter from '../components/blog/BlogFooter';
import { navigateTo, updatePageMeta, setJsonLd } from '../utils/seo';
import { FEATURES } from '../data/features';

const FEATURE_SLUGS = FEATURES.map(f => f.slug);

interface FeatureDetailPageProps {
  slug: string;
  onBack: () => void;
  onRegisterClick?: () => void;
}

const FeatureDetailPage: React.FC<FeatureDetailPageProps> = ({ slug, onBack, onRegisterClick }) => {
  const feature = FEATURES.find(f => f.slug === slug);

  const currentIndex = FEATURE_SLUGS.indexOf(slug);
  const prevFeature = currentIndex > 0 ? FEATURES[currentIndex - 1] : null;
  const nextFeature = currentIndex < FEATURES.length - 1 ? FEATURES[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (feature) {
      updatePageMeta(
        feature.metaTitle,
        feature.metaDescription,
        `https://openhrapp.com/features/${feature.slug}`
      );
      setJsonLd({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareApplication',
            name: `OpenHRApp — ${feature.title}`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, Android, iOS',
            description: feature.metaDescription,
            url: `https://openhrapp.com/features/${feature.slug}`,
            image: 'https://openhrapp.com/img/screenshot-wide.png',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: feature.sections.flatMap(s => s.bullets).join(', '),
            isPartOf: {
              '@type': 'SoftwareApplication',
              name: 'OpenHRApp',
              url: 'https://openhrapp.com',
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://openhrapp.com/' },
              { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://openhrapp.com/features' },
              { '@type': 'ListItem', position: 3, name: feature.title, item: `https://openhrapp.com/features/${feature.slug}` },
            ],
          },
        ],
      });
    }
    return () => { setJsonLd(null); };
  }, [slug, feature]);

  if (!feature) {
    return (
      <div className="min-h-screen bg-dl-ground flex flex-col">
        <BlogNavbar onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-dl-ink mb-2">Feature Not Found</h2>
            <p className="text-dl-muted mb-6">The feature page you're looking for doesn't exist.</p>
            <button
              onClick={() => navigateTo('/features')}
              className="px-6 py-3 bg-dl-teal text-dl-surface rounded-dl-md font-bold hover:bg-dl-teal-deep transition-all"
            >
              View All Features
            </button>
          </div>
        </div>
        <BlogFooter />
      </div>
    );
  }

  const FeatureIcon = feature.icon;

  return (
    <div className="min-h-screen bg-dl-ground flex flex-col">
      <BlogNavbar onBack={onBack} />

      {/* Breadcrumb */}
      <div className="bg-dl-surface border-b border-dl-hair-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-dl-muted">
            <button onClick={() => navigateTo('/')} className="hover:text-dl-teal transition-colors font-medium">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('/features')} className="hover:text-dl-teal transition-colors font-medium">Features</button>
            <span>/</span>
            <span className="text-dl-ink font-semibold">{feature.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className={`${feature.bg} border-b ${feature.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className={`w-16 h-16 bg-dl-surface rounded-dl-lg flex items-center justify-center mb-6 shadow-dl-1 border ${feature.border}`}>
              <FeatureIcon size={32} className={feature.color} />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-dl-ink tracking-tight mb-6">
              {feature.title}
            </h1>
            <p className="text-lg md:text-xl text-dl-muted leading-relaxed">
              {feature.heroDescription}
            </p>
            <div className="mt-8">
              <button
                onClick={() => onRegisterClick ? onRegisterClick() : navigateTo('/')}
                className="px-8 py-3.5 bg-dl-teal text-dl-surface font-bold rounded-dl-md hover:bg-dl-teal-deep transition-colors shadow-dl-1 text-sm"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="space-y-20">
            {feature.sections.map((section, i) => (
              <section key={i}>
                <div className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-start`}>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-dl-ink mb-4">{section.heading}</h2>
                    <p className="text-dl-muted text-base leading-relaxed mb-8">{section.description}</p>
                    <ul className="space-y-3">
                      {section.bullets.map(bullet => (
                        <li key={bullet} className="flex items-start gap-3">
                          <Check size={18} className={`${feature.color} mt-0.5 flex-shrink-0`} />
                          <span className="text-sm text-dl-ink">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className={`${feature.bg} ${feature.border} border rounded-dl-lg p-8 md:p-12 flex flex-col items-center justify-center min-h-[280px]`}>
                      <FeatureIcon size={56} className={`${feature.color} opacity-15 mb-3`} />
                      <p className="text-sm font-medium text-dl-muted">{section.heading}</p>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-dl-surface border-y border-dl-hair-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-dl-ink">Who Is This For?</h2>
              <p className="text-dl-muted mt-3">Common use cases for {feature.title.toLowerCase()}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {feature.useCases.map(uc => (
                <div key={uc.title} className="text-center">
                  <div className={`w-14 h-14 ${feature.bg} rounded-dl-lg flex items-center justify-center mx-auto mb-4`}>
                    <FeatureIcon size={24} className={feature.color} />
                  </div>
                  <h3 className="text-base font-bold text-dl-ink mb-2">{uc.title}</h3>
                  <p className="text-sm text-dl-muted leading-relaxed">{uc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prev / Next Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevFeature ? (
              <button
                onClick={() => navigateTo(`/features/${prevFeature.slug}`)}
                className="flex items-center gap-3 p-5 bg-dl-surface border border-dl-hair rounded-dl-md hover:border-dl-teal hover:shadow-dl-1 transition-all text-left"
              >
                <ArrowLeft size={18} className="text-dl-muted flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-dl-muted font-medium">Previous Feature</p>
                  <p className="text-sm font-bold text-dl-ink">{prevFeature.title}</p>
                </div>
              </button>
            ) : <div />}
            {nextFeature && (
              <button
                onClick={() => navigateTo(`/features/${nextFeature.slug}`)}
                className="flex items-center justify-end gap-3 p-5 bg-dl-surface border border-dl-hair rounded-dl-md hover:border-dl-teal hover:shadow-dl-1 transition-all text-right"
              >
                <div className="min-w-0">
                  <p className="text-xs text-dl-muted font-medium">Next Feature</p>
                  <p className="text-sm font-bold text-dl-ink">{nextFeature.title}</p>
                </div>
                <ArrowRight size={18} className="text-dl-muted flex-shrink-0" />
              </button>
            )}
          </div>

          {/* Back to all features */}
          <div className="mt-8 pt-8 border-t border-dl-hair">
            <button
              onClick={() => navigateTo('/features')}
              className="flex items-center gap-2 text-sm font-semibold text-dl-muted hover:text-dl-teal transition-colors"
            >
              <ArrowLeft size={16} /> View all features
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-dl-teal/5 border-y border-dl-teal/15">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-dl-ink mb-4">
              Ready to try {feature.title.toLowerCase()}?
            </h2>
            <p className="text-lg text-dl-muted mb-8">
              Get started for free. No credit card required.
            </p>
            <button
              onClick={() => onRegisterClick ? onRegisterClick() : navigateTo('/')}
              className="px-8 py-3.5 bg-dl-teal text-dl-surface font-bold rounded-dl-md hover:bg-dl-teal-deep transition-colors shadow-dl-1 text-sm"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>

      <BlogFooter />
    </div>
  );
};

export default FeatureDetailPage;
