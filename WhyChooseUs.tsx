import React, { useState } from 'react';
import { Gift, DollarSign, Monitor, Clock, ShieldCheck, Zap, Award, CheckCircle, Users, GraduationCap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { StatCounter } from './StatCounter';

export const WhyChooseUs: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  const stats = [
    {
      icon: Users,
      value: 1250,
      suffix: '+',
      label: 'Students Trained',
      sublabel: 'Empowered with job-ready digital IT skills',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      icon: GraduationCap,
      value: 180,
      suffix: '+',
      label: 'Batches Completed',
      sublabel: 'Across morning, day & evening shifts',
      color: 'text-sky-700 bg-sky-50 border-sky-200',
    },
    {
      icon: TrendingUp,
      value: 94.6,
      decimals: 1,
      suffix: '%',
      label: 'Placement & Exam Rate',
      sublabel: 'Lok Sewa, banking & local enterprise placements',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      icon: CheckCircle2,
      value: 100,
      suffix: '%',
      label: '1:1 Practical Ratio',
      sublabel: 'Dedicated desktop PC for every student (no sharing)',
      color: 'text-teal-700 bg-teal-50 border-teal-200',
    },
  ];

  const features = [
    {
      icon: Gift,
      title: 'Free Official Institute Bag & Smart ID Card',
      description: 'Every newly enrolled student receives our durable, branded institute backpack and official photo student ID card completely free of charge upon registration.',
      tag: 'Guaranteed Welcome Perk'
    },
    {
      icon: DollarSign,
      title: '100% Transparent Fee Structure',
      description: 'Fair pricing with NPR 800 standard admission and monthly tuition from NPR 825. Zero hidden computer maintenance or extra examination fees.',
      tag: 'No Hidden Fees'
    },
    {
      icon: Monitor,
      title: 'Individual Workstation Access (1:1 Ratio)',
      description: 'Never share a monitor or keyboard. Every student is assigned their own high-speed desktop workstation throughout every single practical lab session.',
      tag: 'Hands-on Guarantee'
    },
    {
      icon: Clock,
      title: 'Flexible Shifts: Morning, Day & Evening',
      description: 'Operating six days a week from 6:30 AM to 7:00 PM. Easily choose batch times that fit around school schedules, college lectures, or job duties.',
      tag: '6:30 AM – 7:00 PM'
    },
    {
      icon: Zap,
      title: 'High-Speed Internet & Uninterrupted Power',
      description: 'Dedicated fiber internet connection and reliable solar/inverter backup power ensure your practical classes and exam exercises never pause during local power outages.',
      tag: 'Zero Downtime'
    },
    {
      icon: ShieldCheck,
      title: 'Government Lok Sewa & ISO Certified Standard',
      description: 'Curriculum carefully aligned with Nepal Public Service Commission (Lok Sewa Aayog) requirements, national banks, and modern accounting standards.',
      tag: 'Nationally Valid'
    }
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            The Nedian Connect Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight" style={{ textWrap: 'balance' }}>
            Why Chakarchauda Chooses Nedian Connect Institute
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We are dedicated to practical technological empowerment. Our facilities, instructors, and student amenities are engineered to ensure you graduate with employable real-world competence.
          </p>
        </div>

        {/* Animated Statistics Counter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color} transition-transform group-hover:scale-108 duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display tracking-tight flex items-baseline">
                    <StatCounter
                      value={stat.value}
                      decimals={stat.decimals || 0}
                      suffix={stat.suffix}
                      duration={2200}
                    />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                    {stat.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    {stat.sublabel}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Grid with Facility Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Grid: Features list */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Lab Facility Image & Live Highlights */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 relative group">
              {!imageError ? (
                <img
                  src="/src/assets/images/lab_workstations_facility_1790687428795.jpg"
                  alt="Modern computer laboratory workstation setup at Nedian Connect Institute Chakarchauda"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-80 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-80 bg-slate-800 flex flex-col items-center justify-center p-6 text-center text-white">
                  <Monitor className="w-12 h-12 text-sky-400 mb-2" />
                  <span className="font-bold">Air-Conditioned Practical IT Lab</span>
                  <p className="text-xs text-slate-300 mt-1">Individual Computer Workstations in Chakarchauda</p>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Chakarchauda Central Campus Lab</span>
                </div>
                <p className="text-xs text-slate-200 mt-1">
                  Air-conditioned, modern dual-core &amp; i5 desktop systems with updated Windows 11 and high-speed fiber broadband.
                </p>
              </div>
            </div>

            {/* Quick Shift Schedule Widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Daily Shift Timetable</span>
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Sunday – Friday
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-900 block">Morning</span>
                  <span className="text-[11px] text-slate-500 font-mono">6:30 AM – 9:30 AM</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-900 block">Day</span>
                  <span className="text-[11px] text-slate-500 font-mono">10:00 AM – 2:00 PM</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-900 block">Evening</span>
                  <span className="text-[11px] text-slate-500 font-mono">3:00 PM – 7:00 PM</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
