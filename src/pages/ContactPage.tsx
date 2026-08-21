import React, { useEffect } from 'react';
import { Mail, Github, BookOpen, LifeBuoy } from 'lucide-react';
import BlogNavbar from '../components/blog/BlogNavbar';
import BlogFooter from '../components/blog/BlogFooter';
import ContactSection from '../components/landing/ContactSection';
import { navigateTo, updatePageMeta, setJsonLd } from '../utils/seo';

/**
 * Public Contact page.
 *
 * Contact previously existed only as `#contact`, a scroll anchor into the
 * landing page's ContactSection. That resolved on the landing page and nowhere
 * else: BlogFooter and TutorialsFooter both wired Contact to `goHome`, so from
 * any article the link silently dropped the visitor on the homepage.
 *
 * A distinct, linkable Contact page is also one of the pages AdSense reviewers
 * look for alongside About, Privacy, and Terms.
 *
 * The form itself is the same ContactSection component the landing page uses —
 * one implementation, including its honeypot and timing spam checks.
 */

interface ContactPageProps {
  onBack: () => void;
  onRegisterClick?: () => void;
}

const SUPPORT_EMAIL = 'support@openhrapp.com';

const channels = [
  {
    icon: Mail,
    title: 'Email',
    body: 'For account questions, billing, or anything that needs a reply from a person.',
    action: { label: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
  },
  {
    icon: Github,
    title: 'GitHub Issues',
    body: 'Bug reports and feature requests. Public, tracked, and the fastest route for anything technical.',
    action: { label: 'github.com/mimnets/openhrapp', href: 'https://github.com/mimnets/openhrapp/issues' },
  },
  {
    icon: BookOpen,
    title: 'Guides',
    body: 'Step-by-step instructions for everyday tasks — clocking in, applying for leave, running reports.',
    action: { label: 'Browse the guides', href: '/how-to-use' },
  },
];

const ContactPage: React.FC<ContactPageProps> = ({ onBack, onRegisterClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageMeta(
      'Contact OpenHRApp — Support, Questions, and Feedback',
      'Get in touch with the OpenHRApp team. Email support, report a bug on GitHub, or send a message directly — we read everything.',
      'https://openhrapp.com/contact',
    );
    setJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          name: 'Contact OpenHRApp',
          description: 'Get in touch with the OpenHRApp team for support, questions, or feedback.',
          url: 'https://openhrapp.com/contact',
          isPartOf: {
            '@type': 'WebSite',
            name: 'OpenHRApp',
            url: 'https://openhrapp.com',
          },
        },
        {
          '@type': 'Organization',
          name: 'OpenHRApp',
          url: 'https://openhrapp.com',
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: SUPPORT_EMAIL,
              availableLanguage: ['English'],
            },
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://openhrapp.com/' },
            { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://openhrapp.com/contact' },
          ],
        },
      ],
    });
    return () => { setJsonLd(null); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <BlogNavbar onBack={onBack} onRegisterClick={onRegisterClick} />

      <main className="pt-24 md:pt-32">
        <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigateTo('/'); }}
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </a>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900" aria-current="page">Contact</span>
          </nav>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
            <LifeBuoy className="w-4 h-4" aria-hidden="true" />
            Contact
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight mt-3 mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Questions about setting OpenHRApp up, something behaving oddly, or an idea for what it
            should do next — all of it is welcome. Messages go to a real inbox and we read every one.
          </p>
        </header>

        <section aria-label="Ways to reach us" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {channels.map(({ icon: Icon, title, body, action }) => {
              const isInternal = action.href.startsWith('/');
              return (
                <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-slate-700" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">{body}</p>
                  <a
                    href={action.href}
                    onClick={isInternal ? (e) => { e.preventDefault(); navigateTo(action.href); } : undefined}
                    {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    className="mt-4 text-sm font-medium text-slate-900 hover:underline break-words"
                  >
                    {action.label}
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Same form component the landing page uses — one implementation, including
            its honeypot and submission-timing spam checks. */}
        <ContactSection />
      </main>

      <BlogFooter />
    </div>
  );
};

export default ContactPage;
