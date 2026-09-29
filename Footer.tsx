import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Shield, Gift, Mail, ArrowUp } from 'lucide-react';
import { NedianLogo } from './NedianLogo';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenInquiry: (courseCode?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenInquiry }) => {
  const [footerClicks, setFooterClicks] = React.useState(0);

  const handleSecretFooterClick = () => {
    const next = footerClicks + 1;
    setFooterClicks(next);
    if (next >= 3) {
      setFooterClicks(0);
      onOpenAdmin();
    } else {
      setTimeout(() => setFooterClicks(0), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand & Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
              <NedianLogo size="md" variant="compact" showSubtitle={true} />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier practical computer training academy in Chakarchauda, Mayadevi R.M. - 4, Kapilvastu, Nepal. Providing certified diplomas in computer applications, accounting with Tally Prime, graphic design, and language fluencies with dedicated individual workstations.
            </p>

            <div className="inline-flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-emerald-300">
              <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free Bag &amp; Smart Student ID Card with every enrollment</span>
            </div>
          </div>

          {/* Col 3: Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Featured Programs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onOpenInquiry('ADCA')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  ADCA (12 Months Diploma)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('DCA')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  DCA (6 Months Lok Sewa)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('TALLY')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tally Prime &amp; ERP 9 with VAT
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('CCA')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  CCA (Computer Accounting)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('DTP')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  DTP (Graphics &amp; Press Design)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('ENG-PRO')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Spoken English &amp; Arabic
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Campus Information
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#courses" className="hover:text-white transition-colors">Course Fee Chart</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Fee &amp; Concession Calculator</a></li>
              <li><a href="#placements" className="hover:text-white transition-colors">Alumni Placements</a></li>
              <li><a href="#why-us" className="hover:text-white transition-colors">Why Choose Us &amp; Lab</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ &amp; Lok Sewa Validity</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Online Admission Form</a></li>
            </ul>
          </div>

          {/* Col 5: Contact Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Campus Contact Desk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Chakarchauda Main Bazar, Near Central Chowk, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:+9779705508838" className="hover:text-white font-mono font-bold">
                  +977 9705508838
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/9779705508838"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-mono font-bold text-emerald-400"
                >
                  +977 9705508838 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>6:30 AM – 7:00 PM (Sun–Fri)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Discreet Secret Portal Trigger */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} NEDIAN CONNECT INSTITUTE PVT. LTD. All rights reserved. Chakarchauda, Nepal
            <button
              type="button"
              onClick={handleSecretFooterClick}
              className="text-slate-400 hover:text-slate-200 cursor-default focus:outline-none"
              title=""
            >
              .
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Floating Action Bar (Responsive Mobile/Desktop Quick Access) */}
      {/* 15% Mobile Sticky Cap respected */}
      <aside aria-label="Quick Actions" className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2 sm:p-3 shadow-lg lg:hidden">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          <a
            href="tel:+9779705508838"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
          >
            <Phone className="w-4 h-4 text-sky-700" />
            <span>Call for Info</span>
          </a>

          <a
            href="https://wa.me/9779705508838?text=Hello%20NEDIAN%20CONNECT%20INSTITUTE%2C%20I%20want%20to%20inquire%20about%202026-2027%20admissions."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Chat</span>
          </a>
        </div>
      </aside>
    </footer>
  );
};
