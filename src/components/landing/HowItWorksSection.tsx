import React from 'react';
import { Building2, UserPlus, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Building2,
    step: '01',
    title: 'Register Organization',
    description: 'Create your organization account in seconds. Just your name, email, and company details.',
  },
  {
    icon: UserPlus,
    step: '02',
    title: 'Add Your Employees',
    description: 'Invite team members and set up departments, designations, and leave policies.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Start Managing',
    description: 'Track attendance, manage leave requests, run performance reviews, and generate reports — all from day one.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-dl-ground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-dl-xs font-bold text-dl-teal uppercase tracking-dl-label">How It Works</span>
          <h2 className="font-dl-display text-dl-3xl sm:text-dl-4xl font-semibold text-dl-ink tracking-dl-display mt-3 mb-5">
            Running by lunchtime, not next quarter
          </h2>
          <p className="text-dl-lg text-dl-muted leading-relaxed">
            Most HR rollouts stall at the import step, waiting on a data template and a call with
            an onboarding specialist. There is no such step here. You create an organisation, add
            the people in it, and the product starts recording from that moment — no installation,
            no card, and nothing to migrate before you can see whether it suits you. If it does
            not, the export button gives your data straight back.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, idx) => (
            <div key={s.step} className="relative text-center">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-dl-hair"></div>
              )}

              <div className="w-20 h-20 bg-dl-teal/10 rounded-dl-lg flex items-center justify-center mx-auto mb-5 relative">
                <s.icon size={28} className="text-dl-teal" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-dl-surface border border-dl-hair rounded-full flex items-center justify-center font-dl-mono text-dl-xs font-medium text-dl-muted tabular-nums">
                  {s.step}
                </span>
              </div>
              <h3 className="font-dl-display text-dl-base font-semibold text-dl-ink tracking-dl-head mb-2">{s.title}</h3>
              <p className="text-dl-sm text-dl-muted leading-relaxed max-w-xs mx-auto">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
