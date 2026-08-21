import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../../data/faqs';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-dl-ground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-dl-teal uppercase tracking-wide">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-dl-ink mt-3 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-dl-muted text-lg">
            Everything you need to know about OpenHRApp.
          </p>
        </div>

        {/* FAQ Groups */}
        <div className="space-y-8">
          {faqs.map((group) => (
            <div key={group.category}>
              <h3 className="text-xs font-bold text-dl-muted uppercase tracking-wide mb-3 px-1">
                {group.category}
              </h3>
              <div className="space-y-2">
                {group.items.map((item, idx) => {
                  const key = `${group.category}-${idx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div
                      key={key}
                      className="bg-dl-surface border border-dl-hair-soft rounded-dl-md overflow-hidden"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-dl-ground transition-colors"
                      >
                        <span className="text-sm font-semibold text-dl-ink pr-4">{item.q}</span>
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className={`flex-shrink-0 text-dl-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 animate-in fade-in duration-200">
                          <p className="text-sm text-dl-muted leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
