import React from 'react';
import { 
  Users, BookOpen, Award, Bell, TrendingUp, DollarSign, 
  ArrowUpRight, CheckCircle2, Clock, Calendar, Download, Plus, IdCard 
} from 'lucide-react';
import { Course, PlacementStory, StudentInquiry, InstituteNotice } from '../../types';

interface AdminOverviewTabProps {
  inquiries: StudentInquiry[];
  courses: Course[];
  placements: PlacementStory[];
  notices: InstituteNotice[];
  certificatesCount: number;
  onSwitchTab: (tab: any) => void;
  onExportCSV: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  inquiries,
  courses,
  placements,
  notices,
  certificatesCount,
  onSwitchTab,
  onExportCSV,
}) => {
  // Compute analytics
  const totalInquiries = inquiries.length;
  const newLeads = inquiries.filter((i) => i.status === 'new').length;
  const contactedLeads = inquiries.filter((i) => i.status === 'contacted').length;
  const enrolledStudents = inquiries.filter((i) => i.status === 'enrolled').length;

  const conversionRate = totalInquiries > 0 
    ? Math.round((enrolledStudents / totalInquiries) * 100) 
    : 0;

  // Approximate revenue pipeline based on inquiries and course fees
  const pipelineValue = inquiries.reduce((acc, inq) => {
    const course = courses.find((c) => c.code.toLowerCase() === inq.courseId.toLowerCase() || c.id === inq.courseId);
    return acc + (course ? course.totalFee : 6000);
  }, 0);

  const enrolledRevenue = inquiries
    .filter((i) => i.status === 'enrolled')
    .reduce((acc, inq) => {
      const course = courses.find((c) => c.code.toLowerCase() === inq.courseId.toLowerCase() || c.id === inq.courseId);
      return acc + (course ? course.totalFee : 6000);
    }, 0);

  // Course popularity
  const courseCounts: Record<string, number> = {};
  inquiries.forEach((inq) => {
    const key = inq.courseId.toUpperCase();
    courseCounts[key] = (courseCounts[key] || 0) + 1;
  });

  const sortedCourses = Object.entries(courseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Shift preferences
  const morningShifts = inquiries.filter((i) => i.preferredShift?.includes('Morning')).length;
  const dayShifts = inquiries.filter((i) => i.preferredShift?.includes('Day')).length;
  const eveningShifts = inquiries.filter((i) => i.preferredShift?.includes('Evening')).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            Executive Control &amp; Analytics
          </span>
          <h3 className="text-xl font-extrabold font-display">
            Nedian Connect Institute Performance
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time admissions pipeline, course interest, and student records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-700/80 hover:bg-slate-700 rounded-xl border border-slate-600 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onSwitchTab('certificates')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
          >
            <IdCard className="w-3.5 h-3.5" />
            <span>Issue Student ID</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Inquiries */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {totalInquiries}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{newLeads} pending action</span>
            <span className="text-blue-600 font-bold cursor-pointer" onClick={() => onSwitchTab('leads')}>
              View &rarr;
            </span>
          </div>
        </div>

        {/* Enrolled Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            {enrolledStudents}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{conversionRate}% conversion</span>
            <span className="text-emerald-700 font-bold">Confirmed</span>
          </div>
        </div>

        {/* Realized / Pipeline Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Value</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            NPR {pipelineValue.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>NPR {enrolledRevenue.toLocaleString()} enrolled</span>
            <span className="text-amber-600 font-bold">Fee Est.</span>
          </div>
        </div>

        {/* Active Issued IDs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Issued IDs</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <IdCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">
            {certificatesCount}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Verified in database</span>
            <span className="text-purple-600 font-bold cursor-pointer" onClick={() => onSwitchTab('certificates')}>
              Manage &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Middle Analytical Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Course Interest Breakdown */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">
                Top Course Inquiries &amp; Demand
              </h4>
              <p className="text-xs text-slate-500">
                Most applied programs by prospective students
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {courses.length} active courses
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {sortedCourses.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No inquiry course data available yet.</p>
            ) : (
              sortedCourses.map(([courseCode, count]) => {
                const percent = totalInquiries > 0 ? Math.round((count / totalInquiries) * 100) : 0;
                return (
                  <div key={courseCode} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="font-bold text-slate-800">{courseCode}</span>
                      <span className="text-slate-500 font-mono">{count} leads ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Shift Preference & Lead Status Funnel */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Shift Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-display">
              Preferred Shift Distribution
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100">
                <span className="text-[10px] text-sky-800 font-bold uppercase block">Morning</span>
                <span className="text-base font-extrabold text-sky-900 font-mono mt-0.5 block">{morningShifts}</span>
                <span className="text-[10px] text-sky-600 font-mono">6:30 - 9:30</span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-amber-800 font-bold uppercase block">Day</span>
                <span className="text-base font-extrabold text-amber-900 font-mono mt-0.5 block">{dayShifts}</span>
                <span className="text-[10px] text-amber-600 font-mono">10:00 - 2:00</span>
              </div>
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                <span className="text-[10px] text-purple-800 font-bold uppercase block">Evening</span>
                <span className="text-base font-extrabold text-purple-900 font-mono mt-0.5 block">{eveningShifts}</span>
                <span className="text-[10px] text-purple-600 font-mono">3:00 - 7:00</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Management Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onSwitchTab('courses')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-200 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Edit Course Fees</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onSwitchTab('notices')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-200 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Post Notice</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onSwitchTab('placements')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-200 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Add Alumni Story</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onSwitchTab('backup')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-200 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Backup Database</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
