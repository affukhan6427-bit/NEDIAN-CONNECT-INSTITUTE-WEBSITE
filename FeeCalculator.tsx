import React, { useState } from 'react';
import { Calculator, Check, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { Course } from '../types';

interface FeeCalculatorProps {
  courses: Course[];
  onSelectCourseForAdmission: (courseCode: string) => void;
}

export const FeeCalculator: React.FC<FeeCalculatorProps> = ({
  courses,
  onSelectCourseForAdmission,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'adca');
  const [paymentPlan, setPaymentPlan] = useState<'lump_sum' | 'monthly'>('lump_sum');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const duration = selectedCourse.durationMonths;
  const admission = selectedCourse.admissionFee;
  const monthly = selectedCourse.monthlyFee;
  const monthlyTotal = monthly * duration;
  const regularTotal = admission + monthlyTotal;

  const discountRate = selectedCourse.fullPayDiscountPercent;
  const discountedTotal = Math.round(regularTotal * (1 - discountRate / 100));
  const totalSavings = regularTotal - discountedTotal;

  return (
    <div id="calculator" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-sky-600" />
            <span>Chakarchauda Campus Fee Estimator</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-display">
            Transparent Fee &amp; Scholarship Calculator
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Calculate your exact educational investment. All enrollments include our official institute backpack, smart ID card, and unlimited practical lab hours.
          </p>
        </div>

        {/* Course Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Course Program:
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all cursor-pointer"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} – {course.name} ({course.durationMonths} Months)
              </option>
            ))}
          </select>
        </div>

        {/* Payment Plan Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Choose Payment Method:
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setPaymentPlan('lump_sum')}
              className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                paymentPlan === 'lump_sum'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Full Advance Payment</span>
              <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded">
                Save {discountRate}%
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentPlan('monthly')}
              className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                paymentPlan === 'monthly'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Monthly Installments</span>
              <span className="text-[10px] opacity-80">Pay as you learn</span>
            </button>
          </div>
        </div>

        {/* Calculation Result Card */}
        <div className="bg-slate-50 rounded-xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Payable Amount</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                  NPR {paymentPlan === 'lump_sum' ? discountedTotal.toLocaleString() : regularTotal.toLocaleString()}
                </span>
                {paymentPlan === 'lump_sum' && (
                  <span className="text-sm line-through text-slate-400 font-mono tabular-nums">
                    NPR {regularTotal.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {paymentPlan === 'lump_sum' ? (
              <div className="bg-emerald-100 text-emerald-900 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>You Save NPR {totalSavings.toLocaleString()} instantly!</span>
              </div>
            ) : (
              <div className="bg-sky-100 text-sky-900 px-3.5 py-2 rounded-lg text-xs font-semibold self-start sm:self-auto">
                NPR {admission.toLocaleString()} today + NPR {monthly.toLocaleString()} / month
              </div>
            )}
          </div>

          {/* Breakdown items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Registration &amp; Admission</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                NPR {admission.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">One-time registration</span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Tuition &amp; Lab Access</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                NPR {monthly.toLocaleString()} &times; {duration} Mos.
              </span>
              <span className="text-[10px] text-slate-400 block">NPR {monthlyTotal.toLocaleString()} regular tuition</span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Free Kit Provided</span>
              <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                <span>Bag &amp; Student ID</span>
              </span>
              <span className="text-[10px] text-emerald-600 block">Worth NPR 1,200 (FREE)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              * Payment methods accepted: Cash, eSewa, Khalti, Mobile Banking, and Bank Deposit.
            </p>
            <button
              onClick={() => onSelectCourseForAdmission(selectedCourse.code)}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Apply for {selectedCourse.code}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
