import React from 'react';
import { MapPin, Calendar, Users, BarChart3, ClipboardCheck, ArrowRight } from 'lucide-react';
import { navigateTo } from '../../utils/seo';

const features = [
  {
    icon: MapPin,
    title: 'Attendance Tracking',
    slug: 'attendance-tracking',
    description: 'Selfie-based check-in with GPS geofencing and real-time monitoring. Supports office and factory shift modes with biometric verification.',
  },
  {
    icon: Calendar,
    title: 'Leave Management',
    slug: 'leave-management',
    description: 'Custom leave types, automated balance calculations, and configurable approval workflows. Employees apply in seconds, managers approve with one click.',
  },
  {
    icon: Users,
    title: 'Employee Directory',
    slug: 'employee-directory',
    description: 'Complete employee profiles with department, designation, and role-based access. Self-service portal lets employees update their own information.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    slug: 'reports-analytics',
    description: 'Comprehensive attendance summaries, leave reports, and data-driven insights. Export to CSV for payroll integration and compliance audits.',
  },
  {
    icon: ClipboardCheck,
    title: 'Performance Reviews',
    slug: 'performance-reviews',
    description: 'Structured review cycles with self-assessments, manager evaluations, and HR finalization. Customizable competencies and rating scales to match your values.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-dl-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-dl-xs font-bold text-dl-teal uppercase tracking-dl-label">Features</span>
          <h2 className="font-dl-display text-dl-3xl sm:text-dl-4xl font-semibold text-dl-ink tracking-dl-display mt-3 mb-5">
            Everything you need, and nothing you have to pay to unlock
          </h2>
          <p className="text-dl-lg text-dl-muted leading-relaxed">
            HR software usually fails in one of two ways: it does too little and you end up back in
            spreadsheets, or it does too much and nobody can find the one screen they actually
            needed. OpenHRApp covers the five things every organisation genuinely has to track —
            who was here, who is away, who works where, how the year went, and what the numbers say
            — and it treats each of them as a first-class feature rather than an upsell.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <a
              key={feature.title}
              href={`/features/${feature.slug}`}
              onClick={(e) => { e.preventDefault(); navigateTo(`/features/${feature.slug}`); }}
              className="group p-6 bg-dl-surface-2 border border-dl-hair rounded-dl-lg hover:bg-dl-surface hover:shadow-dl-2 hover:border-dl-teal/30 transition-all duration-300 text-left cursor-pointer block"
            >
              <div className="w-12 h-12 bg-dl-teal/10 rounded-dl-md flex items-center justify-center mb-5 transition-transform group-hover:scale-105">
                <feature.icon size={22} className="text-dl-teal" aria-hidden="true" />
              </div>
              <h3 className="font-dl-display text-dl-base font-semibold text-dl-ink tracking-dl-head mb-2">{feature.title}</h3>
              <p className="text-dl-sm text-dl-muted leading-relaxed mb-3">{feature.description}</p>
              <span className="inline-flex items-center gap-1 text-dl-xs font-semibold text-dl-teal opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight size={14} />
              </span>
            </a>
          ))}
        </div>

        {/* View All Features */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigateTo('/features')}
            className="inline-flex items-center gap-2 px-6 py-3 text-dl-sm font-bold text-dl-teal border border-dl-teal/30 rounded-dl-md hover:bg-dl-teal/5 transition-colors"
          >
            View All Features <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
