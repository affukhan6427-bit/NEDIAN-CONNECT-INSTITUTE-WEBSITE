import React from 'react';
import { X, CheckCircle, Clock, Calendar, Gift, Award, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Course } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onApply: (courseCode: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onApply,
}) => {
  if (!course) return null;

  const totalMonthlyOnly = course.monthlyFee * course.durationMonths;
  const standardTotal = course.admissionFee + totalMonthlyOnly;
  const discountedTotal = Math.round(standardTotal * (1 - course.fullPayDiscountPercent / 100));
  const totalSavings = standardTotal - discountedTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-sky-200 uppercase tracking-wider mb-1">
            <span>Course Code: {course.code}</span>
            <span aria-hidden="true">·</span>
            <span>{course.durationMonths} Months Duration</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display pr-8 text-white">
            {course.name}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Fee & Perks Breakdown Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Official Fee Breakdown (Chakarchauda Campus)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Admission Fee</span>
                <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                  NPR {course.admissionFee.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-700 block font-medium">One-time only</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Monthly Fee</span>
                <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                  NPR {course.monthlyFee.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">per month</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Regular Total</span>
                <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                  NPR {standardTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">Installments</span>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-semibold block">Full Payment</span>
                <span className="text-sm font-extrabold font-mono text-emerald-700 tabular-nums">
                  NPR {discountedTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-800 font-bold block">Save NPR {totalSavings}</span>
              </div>
            </div>

            {/* Free items */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Includes Free Official Bag &amp; Smart Student ID Card</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">No Hidden Lab Fees</span>
            </div>
          </div>

          {/* Curriculum / Syllabus Topics */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              <span>Syllabus &amp; Practical Lab Modules</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.topics.map((topic, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Shifts */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Available Batch Shifts</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {course.shifts.map((shift, idx) => (
                <span key={idx} className="text-xs bg-sky-50 text-sky-900 px-3 py-1.5 rounded-md border border-sky-200 font-medium">
                  {shift}
                </span>
              ))}
            </div>
          </div>

          {/* Career Opportunities */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Target Career Opportunities
            </h4>
            <div className="flex flex-wrap gap-2 text-xs text-slate-700">
              {course.careerProspects.map((career, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                  {career}
                </span>
              ))}
            </div>
          </div>

          {/* Certification standard */}
          <div className="text-xs text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
            <span className="font-semibold text-blue-900">Certificate:</span>
            <span>{course.certificateType} (Valid for Nepal Lok Sewa, Bank examinations, &amp; private firms)</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`https://wa.me/9779705508838?text=Hello%20NEDIAN%20CONNECT%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(course.name)}%20(${course.code}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Inquire on WhatsApp</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href="tel:+9779705508838"
              className="px-3.5 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Call Institute for Course Info"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call for Info</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onApply(course.code);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
