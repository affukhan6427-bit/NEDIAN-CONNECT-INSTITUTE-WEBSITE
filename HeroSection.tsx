import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Gift, Sparkles, Monitor, Users, Clock, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onOpenInquiry: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onOpenInquiry,
}) => {
  const [imageError, setImageError] = useState(false);
  const { config } = useTheme();

  return (
    <section id="home" className={`relative overflow-hidden bg-gradient-to-b ${config.heroGradient} pt-10 pb-16 lg:pt-16 lg:pb-24 transition-colors duration-500`}>
      {/* Subtle animated decorative background gradient spots */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 left-10 -z-10 w-80 h-80 bg-red-200/30 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Highlight Banner / Admission Kicker */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold shadow-xs"
            >
              <Gift className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Admissions Open 2026–2027</span>
              <span className="text-emerald-400 font-bold" aria-hidden="true">·</span>
              <span className="text-emerald-800 font-medium">Free Bag &amp; Smart ID Card Included</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.15]" style={{ textWrap: 'balance' }}>
                Official Computer Training Institute in{' '}
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-rose-700"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${config.primary}, ${config.accent})`,
                  }}
                >
                  Chakarchauda, Nepal
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Master job-ready IT skills with practical 1:1 computer workstation access. Offering certified ADCA, DCA, Tally Prime with VAT, Desktop Publishing, and Language courses designed for government Lok Sewa, banking, and commercial careers.
              </p>
            </div>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated 1:1 Computer (No sharing screens)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lok Sewa &amp; Banking Recognized Curriculum</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Admission from NPR 800 · Monthly from NPR 825</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Flexible Morning, Day &amp; Evening Batches</span>
              </div>
            </div>

            {/* Direct Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenInquiry}
                className={`px-6 py-3.5 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${config.btnPrimary}`}
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreCourses}
                className="px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
              >
                Explore Courses &amp; Fee Chart
              </motion.button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="font-bold text-emerald-800">NEDIAN CONNECT</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span>Mayadevi R.M. - 4, Kapilvastu (Chakarchauda)</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-rose-700 font-semibold">AI, Skills, Media</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-sky-800 font-semibold">Govt. Registered</span>
            </div>
          </motion.div>

          {/* Right Column: Visual Focal Carrier & Live Highlights */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group">
              {!imageError ? (
                <img
                  src="/src/assets/images/hero_computer_institute_1790687406817.jpg"
                  alt="Students learning in computer training lab at NEDIAN CONNECT INSTITUTE in Chakarchauda Nepal"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-80 sm:h-96 lg:h-[420px] bg-gradient-to-br from-slate-900 via-sky-950 to-emerald-950 flex flex-col items-center justify-center p-8 text-center text-white">
                  <Monitor className="w-16 h-16 text-sky-400 mb-3 opacity-80" />
                  <h3 className="text-xl font-bold font-display">Modern Computer Lab</h3>
                  <p className="text-sm text-slate-300 max-w-xs mt-1">
                    Hands-on practical training with individual workstations in Chakarchauda, Nepal
                  </p>
                </div>
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

              {/* In-Frame Feature Capsule with subtle floating motion */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Enrollee Welcome Kit</p>
                      <p className="text-[11px] text-slate-500">Official Institute Bag + Smart Student ID</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 rounded-md">
                    100% FREE
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Stat Counters Floater */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs transition-shadow"
              >
                <div className="text-lg sm:text-xl font-extrabold text-sky-700 font-mono tabular-nums">1,200+</div>
                <div className="text-[11px] text-slate-500 font-medium">Trained Alumni</div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs transition-shadow"
              >
                <div className="text-lg sm:text-xl font-extrabold text-emerald-700 font-mono tabular-nums">1:1</div>
                <div className="text-[11px] text-slate-500 font-medium">Workstation Ratio</div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs transition-shadow"
              >
                <div className="text-lg sm:text-xl font-extrabold text-slate-800 font-mono tabular-nums">94%</div>
                <div className="text-[11px] text-slate-500 font-medium">Placement Rate</div>
              </motion.div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
