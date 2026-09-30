import React, { useState } from 'react';
import { Course, CourseCategory } from '../types';
import { CourseModal } from './CourseModal';
import { FeeCalculator } from './FeeCalculator';
import { ArrowUpRight, Gift, Clock, Check, Sparkles, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface FeeAndCoursesSectionProps {
  courses: Course[];
  onApplyForCourse: (courseCode: string) => void;
}

export const FeeAndCoursesSection: React.FC<FeeAndCoursesSectionProps> = ({
  courses,
  onApplyForCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const { config } = useTheme();

  const categories: { label: string; value: CourseCategory }[] = [
    { label: 'All Courses', value: 'all' },
    { label: 'Diplomas & IT', value: 'diploma' },
    { label: 'Accounting & Tally', value: 'accounting' },
    { label: 'Office & Foundation', value: 'office' },
    { label: 'Spoken Languages', value: 'language' },
  ];

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'office') {
      return course.category === 'office' || course.category === 'foundation';
    }
    return course.category === selectedCategory;
  });

  return (
    <section id="courses" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
              Official 2026–2027 Prospectus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight" style={{ textWrap: 'balance' }}>
              Confirmed Course Offerings &amp; Exact Fee Chart
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every course provides complete hands-on practical training on individual workstations. Includes an official institute bag, smart student ID card, and examination certificates with zero hidden lab charges.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl overflow-x-auto max-w-full shrink-0">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat.value)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Courses Grid with Animated Presence */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const regularTotal = course.admissionFee + (course.monthlyFee * course.durationMonths);
              const discountedTotal = Math.round(regularTotal * (1 - course.fullPayDiscountPercent / 100));

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group hover:border-sky-300"
                >
                  {/* Card Header & Content */}
                  <div className="p-6 space-y-4">
                    {/* Quiet Editorial Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono font-bold text-sky-700 tracking-wider">
                        {course.code}
                      </span>
                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.durationMonths} Months Duration</span>
                      </div>
                    </div>

                    {/* Course Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-sky-800 transition-colors">
                        {course.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Fee Summary Box */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Admission Fee:</span>
                        <span className="font-bold text-slate-800 font-mono tabular-nums">
                          NPR {course.admissionFee.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Monthly Tuition:</span>
                        <span className="font-bold text-slate-800 font-mono tabular-nums">
                          NPR {course.monthlyFee.toLocaleString()} / mo
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-800">
                          Full Payment ({course.fullPayDiscountPercent}% Off):
                        </span>
                        <span className="text-sm font-extrabold text-emerald-700 font-mono tabular-nums">
                          NPR {discountedTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Highlights Bullet Preview */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Core Syllabus Highlights:
                      </span>
                      {course.topics.slice(0, 3).map((topic, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          <span className="truncate">{topic}</span>
                        </div>
                      ))}
                    </div>

                    {/* Perk Notice */}
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium bg-emerald-50/80 px-2.5 py-1.5 rounded-lg">
                      <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Free Institute Bag &amp; Student ID Card</span>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveCourseModal(course)}
                      className="text-xs font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Full Syllabus</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onApplyForCourse(course.code)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer ${config.btnPrimary}`}
                    >
                      Apply Now
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Embedded Interactive Fee Calculator */}
        <div className="pt-8">
          <FeeCalculator
            courses={courses}
            onSelectCourseForAdmission={onApplyForCourse}
          />
        </div>

      </div>

      {/* Modal Popup */}
      <CourseModal
        course={activeCourseModal}
        onClose={() => setActiveCourseModal(null)}
        onApply={(code) => {
          setActiveCourseModal(null);
          onApplyForCourse(code);
        }}
      />
    </section>
  );
};
