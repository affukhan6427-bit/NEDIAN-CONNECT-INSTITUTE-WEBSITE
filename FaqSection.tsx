import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are certificates from NEDIAN CONNECT INSTITUTE recognized for Nepal Government Lok Sewa Aayog?',
      a: 'Yes, absolutely. Our 6-Month DCA and 1-Year ADCA diplomas and computer certifications are officially registered and compliant with standard curricula required by the Public Service Commission (Lok Sewa Aayog), Teachers Service Commission, Nepal Police, and nationalized commercial banks across Nepal.'
    },
    {
      q: 'Do students have to share computers during practical lab sessions?',
      a: 'No. At Nedian Connect Institute, we strictly enforce a 1:1 student-to-computer ratio. Every student gets their own dedicated desktop workstation with a mouse, keyboard, and independent screen for the full duration of every practical class.'
    },
    {
      q: 'How does the Free Bag & Smart ID Card perk work?',
      a: 'Every newly enrolled student in any regular diploma or certificate course receives a durable institute backpack and a laminated photo student identity card at no extra cost on their first day of class.'
    },
    {
      q: 'What are the available daily class timings?',
      a: 'We operate continuous batch shifts from 6:30 AM to 7:00 PM, Sunday through Friday. Morning shifts (6:30 AM - 9:30 AM) are popular with school & college students, Day shifts (10:00 AM - 2:00 PM) for general learners, and Evening shifts (3:00 PM - 7:00 PM) for employees and business owners.'
    },
    {
      q: 'What is the full-payment discount and how can fees be paid?',
      a: 'Students paying their full course fee upfront in a single installment receive an immediate 10% to 15% concession depending on the course. We accept cash at the admissions counter, eSewa, Khalti, Mobile Banking QR, and direct bank transfers.'
    },
    {
      q: 'Can non-technical students or beginners join courses like Tally Prime or ADCA?',
      a: 'Yes. Our instructors start from the very basics of computer fundamentals, operating systems, and keyboard familiarity before advancing to accounting formulas, VAT calculations, or graphic design. We also provide extra practice lab hours at no extra charge.'
    }
  ];

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
              href="tel:+9779705508838"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Call for Info: +977 9705508838</span>
            </a>
            <a
              href="https://wa.me/9779705508838?text=Hello%20NEDIAN%20CONNECT%2C%20I%20have%20an%20inquiry%20regarding%20admission."
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
