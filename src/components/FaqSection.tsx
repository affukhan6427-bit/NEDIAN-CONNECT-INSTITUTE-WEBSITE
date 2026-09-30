import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { FaqItem, InstituteInfo } from '../types';
import { INITIAL_FAQS } from '../data/instituteData';

interface FaqSectionProps {
  faqs?: FaqItem[];
  instituteInfo?: InstituteInfo;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  faqs = INITIAL_FAQS,
  instituteInfo,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight" style={{ textWrap: 'balance' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Everything you need to know about enrollments, curriculum standards, lab workstations, and certifications at our Chakarchauda campus.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none hover:bg-slate-50/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 font-display">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-sky-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Help Callout */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-2xs">
          <p className="text-sm font-semibold text-slate-800">
            Have a question not listed here? Talk directly to our admissions office.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${instituteInfo?.phone || '+9779705508838'}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Call for Info: {instituteInfo?.phone || '+977 9705508838'}</span>
            </a>
            <a
              href={`https://wa.me/${(instituteInfo?.whatsapp || '9705508838').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(instituteInfo?.name || 'NEDIAN CONNECT')}%2C%20I%20have%20an%20inquiry%20regarding%20admission.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
