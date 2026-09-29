import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Shield, Award, HardDrive } from 'lucide-react';
import { NedianLogo } from './NedianLogo';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenInquiry: (courseCode?: string) => void;
  onOpenVerify: () => void;
  onOpenDrive: () => void;
  urgentNotice?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenInquiry,
  onOpenVerify,
  onOpenDrive,
  urgentNotice,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Secret trigger: clicking logo 4 times opens admin portal
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 4) {
      setLogoClicks(0);
      onOpenAdmin();
    } else {
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Courses & Fees', href: '#courses' },
    { label: 'Placements', href: '#placements' },
    { label: 'Why Choose Us', href: '#why-us' },
    { label: 'Fee Calculator', href: '#calculator' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Notice Ribbon */}
      {urgentNotice && (
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-emerald-950 text-white text-xs py-1.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-xl">{urgentNotice}</span>
            <a
              href="tel:+9779705508838"
              className="ml-2 underline hover:text-sky-200 cursor-pointer font-semibold whitespace-nowrap"
            >
              Call for Info &rarr;
            </a>
          </div>
        </div>
      )}

      {/* Top Bar - 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Official Logo (Secret 4x click unlocks admin console) */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleLogoClick}
              className="group flex items-center focus:outline-none text-left cursor-pointer"
              title="NEDIAN CONNECT INSTITUTE PVT. LTD."
            >
              <NedianLogo size="md" variant="compact" showSubtitle={true} className="group-hover:opacity-95 transition-opacity" />
            </button>
          </div>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-700">
            {navLinks.slice(1, 6).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-sky-700 transition-colors hover:underline underline-offset-4 decoration-sky-500/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onOpenDrive}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
              title="Google Drive Cloud Storage"
            >
              <HardDrive className="w-3.5 h-3.5 text-sky-600" />
              <span>Drive</span>
            </button>

            <button
              onClick={onOpenVerify}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              title="Verify Student ID or Certificate"
            >
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verify ID</span>
            </button>

            <a
              href="tel:+9779705508838"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Call for Info"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-semibold text-slate-600">Call for Info:</span>
              <span className="font-mono tabular-nums">+977 9705508838</span>
            </a>

            <a
              href="https://wa.me/9779705508838?text=Hello%20NEDIAN%20CONNECT%20INSTITUTE%2C%20I%20would%20like%20to%20inquire%20about%20admissions%20and%20courses."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-all whitespace-nowrap active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Inquire</span>
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-base font-semibold text-slate-700 hover:text-sky-600 py-1.5 border-b border-slate-100"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDrive();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-sky-600" />
                <span>Google Drive Cloud Hub</span>
              </button>

              <a
                href="tel:+9779705508838"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg"
              >
                <Phone className="w-4 h-4 text-sky-600" />
                <span>Call for Info: +977 9705508838</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm"
              >
                Apply for Admission (Free Bag &amp; ID Card)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

