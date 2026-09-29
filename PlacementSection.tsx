import React, { useState } from 'react';
import { PlacementStory } from '../types';
import { Briefcase, Building2, MapPin, CheckCircle2, Quote, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface PlacementSectionProps {
  stories: PlacementStory[];
}

export const PlacementSection: React.FC<PlacementSectionProps> = ({ stories }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="placements" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Proven Student Success &amp; Careers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight" style={{ textWrap: 'balance' }}>
              Where Our Graduates Work Across Nepal
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              From commercial banks and local municipalities to publishing presses and trading corporations, Nedian Connect alumni secure verified career roles through practical mastery.
            </p>
          </div>

          {/* Hiring Partners Strip */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Alumni active in: Banks · Cooperatives · Lok Sewa · IT Press</span>
          </div>
        </div>

        {/* Feature Spotlight Banner with Generated Image Asset */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-emerald-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white grid grid-cols-1 lg:grid-cols-12">
          
          <div className="p-8 sm:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" />
                <span>Job Readiness &amp; Certification Guarantee</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white" style={{ textWrap: 'balance' }}>
                Practical Training Built for Nepal’s High-Demand Job Markets
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We bridge the gap between classroom theory and real office expectations. Every student completes hands-on mock projects: preparing live Tally VAT returns, Nepali Preeti typing exams for Lok Sewa, and professional business documentation.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Average Starting</span>
                <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  NPR 30k–45k
                </span>
                <span className="text-[10px] text-slate-400 block">per month salary</span>
              </div>
              <div>
                <span className="text-slate-400 block">Lok Sewa Success</span>
                <span className="text-lg font-bold font-mono text-sky-400 tabular-nums">
                  92% Pass
                </span>
                <span className="text-[10px] text-slate-400 block">in practical typing</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mock Interviews</span>
                <span className="text-lg font-bold font-mono text-white tabular-nums">
                  100% Free
                </span>
                <span className="text-[10px] text-slate-400 block">with diploma courses</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[260px] bg-slate-900">
            {!imageError ? (
              <img
                src="/src/assets/images/student_success_alumni_1790687447406.jpg"
                alt="Nedian Connect Institute successful alumni graduates holding certificates and bags"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <Briefcase className="w-12 h-12 text-emerald-400 mb-2" />
                <span className="font-semibold text-white">Graduates Serving Nepal</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 text-[11px] text-slate-300 font-medium">
              Chakarchauda graduates recognized in banking &amp; civil service
            </div>
          </div>

        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Header: Student Name & Verified Flag */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-display">
                      {story.studentName}
                    </h4>
                    <span className="text-xs text-sky-800 font-medium">
                      {story.courseTaken} · Class of {story.completionYear}
                    </span>
                  </div>

                  {story.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Alumni</span>
                    </span>
                  )}
                </div>

                {/* Company & Role */}
                <div className="bg-white rounded-xl p-3 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Briefcase className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                    <span>{story.role}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{story.company}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{story.location}</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums">
                      {story.salaryMonthly}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative pt-1">
                  <Quote className="w-4 h-4 text-slate-300 absolute -top-1 -left-1" />
                  <p className="text-xs text-slate-600 italic pl-4 leading-relaxed">
                    "{story.quote}"
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200/60 flex items-center justify-between">
                <span>Nedian Connect Alumni Network</span>
                <span>Chakarchauda, Nepal</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
