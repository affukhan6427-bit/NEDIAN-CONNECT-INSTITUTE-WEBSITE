import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Shield, Users, BookOpen, Award, Bell, 
  Plus, Trash2, Edit2, Edit3, Check, Download, MessageCircle, Phone, Sparkles, KeyRound, Upload, RefreshCw,
  BarChart3, IdCard, Database, Search, Filter, Calendar, Building2, MapPin, Mail, Clock, CheckCircle2
} from 'lucide-react';
import { Course, PlacementStory, StudentInquiry, InstituteNotice, StudentCertificateRecord, InstituteInfo } from '../types';
import { INITIAL_CERTIFICATES, DEFAULT_INSTITUTE_INFO } from '../data/instituteData';
import { NedianLogo } from './NedianLogo';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminCertificatesTab } from './admin/AdminCertificatesTab';
import { AdminBackupTab } from './admin/AdminBackupTab';
import { motion } from 'motion/react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  placements: PlacementStory[];
  onUpdatePlacements: (placements: PlacementStory[]) => void;
  notices: InstituteNotice[];
  onUpdateNotices: (notices: InstituteNotice[]) => void;
  inquiries: StudentInquiry[];
  onUpdateInquiries: (inquiries: StudentInquiry[]) => void;
  instituteInfo?: InstituteInfo;
  onUpdateInstituteInfo?: (info: InstituteInfo) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  courses,
  onUpdateCourses,
  placements,
  onUpdatePlacements,
  notices,
  onUpdateNotices,
  inquiries,
  onUpdateInquiries,
  instituteInfo = DEFAULT_INSTITUTE_INFO,
  onUpdateInstituteInfo,
}) => {
  // Password authentication state
  const [pinInput, setPinInput] = useState('');
  const [storedPin, setStoredPin] = useState(() => localStorage.getItem('nedian_admin_password') || localStorage.getItem('nedian_admin_pin') || '@FZ@LKH@N1100');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  // Active sub-tab
  type TabType = 'overview' | 'institute' | 'courses' | 'placements' | 'notices' | 'leads' | 'certificates' | 'logo' | 'backup' | 'security';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Certificates state with persistence
  const [certificates, setCertificates] = useState<StudentCertificateRecord[]>(() => {
    const saved = localStorage.getItem('nedian_verified_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CERTIFICATES;
  });

  const handleUpdateCertificates = (newCertificates: StudentCertificateRecord[]) => {
    setCertificates(newCertificates);
    localStorage.setItem('nedian_verified_students', JSON.stringify(newCertificates));
  };

  // Leads search and filter state
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'new' | 'contacted' | 'enrolled'>('all');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCourse, setNewLeadCourse] = useState('adca');
  const [newLeadShift, setNewLeadShift] = useState<'Morning (6:30 AM - 9:30 AM)' | 'Day (10:00 AM - 2:00 PM)' | 'Evening (3:00 PM - 7:00 PM)'>('Morning (6:30 AM - 9:30 AM)');
  const [newLeadAddress, setNewLeadAddress] = useState('Chakarchauda, Kapilvastu');
  const [newLeadNote, setNewLeadNote] = useState('');

  const [customLogoPreview, setCustomLogoPreview] = useState<string | null>(() => localStorage.getItem('nedian_custom_logo'));
  const [logoStatusMsg, setLogoStatusMsg] = useState('');

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        localStorage.setItem('nedian_custom_logo', result);
        setCustomLogoPreview(result);
        setLogoStatusMsg('Logo image successfully updated! Refreshing view...');
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    localStorage.removeItem('nedian_custom_logo');
    setCustomLogoPreview(null);
    setLogoStatusMsg('Restored official vector logo.');
    window.location.reload();
  };

  // Course edit state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editAdmissionFee, setEditAdmissionFee] = useState<number>(800);
  const [editMonthlyFee, setEditMonthlyFee] = useState<number>(825);
  const [editDiscount, setEditDiscount] = useState<number>(10);

  // New Placement modal state
  const [showAddPlacement, setShowAddPlacement] = useState(false);
  const [newAlumniName, setNewAlumniName] = useState('');
  const [newAlumniCourse, setNewAlumniCourse] = useState('ADCA (12 Months)');
  const [newAlumniRole, setNewAlumniRole] = useState('');
  const [newAlumniCompany, setNewAlumniCompany] = useState('');
  const [newAlumniSalary, setNewAlumniSalary] = useState('NPR 35,000 / month');
  const [newAlumniLocation, setNewAlumniLocation] = useState('Chakarchauda, Nepal');
  const [newAlumniQuote, setNewAlumniQuote] = useState('');

  // New Notice state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeUrgent, setNewNoticeUrgent] = useState(false);

  // Institute Info Form State
  const [infoForm, setInfoForm] = useState<InstituteInfo>(instituteInfo);
  const [infoSavedMsg, setInfoSavedMsg] = useState('');
  useEffect(() => {
    setInfoForm(instituteInfo);
  }, [instituteInfo]);

  const handleSaveInstituteInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateInstituteInfo) {
      onUpdateInstituteInfo(infoForm);
      setInfoSavedMsg('Institute information and schedule successfully saved!');
      setTimeout(() => setInfoSavedMsg(''), 4000);
    }
  };

  // Full Course Edit and Add Modals State
  const [editingFullCourse, setEditingFullCourse] = useState<Course | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState<'diploma' | 'accounting' | 'office' | 'language' | 'foundation'>('diploma');
  const [newCourseDuration, setNewCourseDuration] = useState(6);
  const [newCourseAdmission, setNewCourseAdmission] = useState(800);
  const [newCourseMonthly, setNewCourseMonthly] = useState(850);
  const [newCourseDiscount, setNewCourseDiscount] = useState(15);
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseTopics, setNewCourseTopics] = useState('');
  const [newCourseCareer, setNewCourseCareer] = useState('');

  const handleSaveFullCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFullCourse) return;
    const updated = courses.map((c) =>
      c.id === editingFullCourse.id ? editingFullCourse : c
    );
    onUpdateCourses(updated);
    setEditingFullCourse(null);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode.trim() || !newCourseName.trim()) return;

    const topicsArray = newCourseTopics
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const careerArray = newCourseCareer
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const totalCalculated = Number(newCourseAdmission) + (Number(newCourseMonthly) * Number(newCourseDuration));

    const newCourseObj: Course = {
      id: newCourseCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'),
      code: newCourseCode.trim().toUpperCase(),
      name: newCourseName.trim(),
      category: newCourseCategory,
      durationMonths: Number(newCourseDuration),
      admissionFee: Number(newCourseAdmission),
      monthlyFee: Number(newCourseMonthly),
      totalFee: totalCalculated,
      fullPayDiscountPercent: Number(newCourseDiscount),
      description: newCourseDesc.trim() || `${newCourseName} practical program in Chakarchauda.`,
      topics: topicsArray.length > 0 ? topicsArray : ['Practical Lab Training', 'Workstation 1:1 Exercises'],
      shifts: ['Morning (6:30 AM - 9:30 AM)', 'Day (10:00 AM - 2:00 PM)', 'Evening (3:00 PM - 7:00 PM)'],
      careerProspects: careerArray.length > 0 ? careerArray : ['Computer Operator', 'Office Assistant'],
      certificateType: 'Institute Diploma Certificate',
      isPopular: false,
    };

    onUpdateCourses([...courses, newCourseObj]);
    setShowAddCourseModal(false);
    // Reset
    setNewCourseCode('');
    setNewCourseName('');
    setNewCourseDesc('');
    setNewCourseTopics('');
    setNewCourseCareer('');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this course?')) {
      onUpdateCourses(courses.filter((c) => c.id !== courseId));
    }
  };

  // Full Placement Edit State
  const [editingPlacement, setEditingPlacement] = useState<PlacementStory | null>(null);

  const handleSavePlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlacement) return;
    const updated = placements.map((p) =>
      p.id === editingPlacement.id ? editingPlacement : p
    );
    onUpdatePlacements(updated);
    setEditingPlacement(null);
  };

  // Full Notice Edit State
  const [editingNotice, setEditingNotice] = useState<InstituteNotice | null>(null);

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    const updated = notices.map((n) =>
      n.id === editingNotice.id ? editingNotice : n
    );
    onUpdateNotices(updated);
    setEditingNotice(null);
  };

  // Full Lead Edit State
  const [editingLead, setEditingLead] = useState<StudentInquiry | null>(null);

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    const updated = inquiries.map((inq) =>
      inq.id === editingLead.id ? editingLead : inq
    );
    onUpdateInquiries(updated);
    setEditingLead(null);
  };

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === storedPin) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect Password. Please try again.');
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length >= 6) {
      setStoredPin(newPinInput);
      localStorage.setItem('nedian_admin_password', newPinInput);
      setPinChangeMsg('Admin password updated successfully!');
      setNewPinInput('');
      setTimeout(() => setPinChangeMsg(''), 3000);
    } else {
      setPinChangeMsg('Password must be at least 6 characters.');
    }
  };

  const handleSaveCourseFee = (courseId: string) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          admissionFee: editAdmissionFee,
          monthlyFee: editMonthlyFee,
          fullPayDiscountPercent: editDiscount,
        };
      }
      return c;
    });
    onUpdateCourses(updated);
    setEditingCourseId(null);
  };

  const handleAddPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumniName || !newAlumniRole || !newAlumniCompany) return;

    const newStory: PlacementStory = {
      id: 'place-' + Date.now(),
      studentName: newAlumniName,
      courseTaken: newAlumniCourse,
      completionYear: new Date().getFullYear(),
      role: newAlumniRole,
      company: newAlumniCompany,
      salaryMonthly: newAlumniSalary,
      location: newAlumniLocation,
      quote: newAlumniQuote || 'Practical computer training at Nedian Connect changed my life.',
      verified: true,
      avatarSeed: newAlumniName.toLowerCase().replace(/\s+/g, '-'),
    };

    onUpdatePlacements([newStory, ...placements]);
    setShowAddPlacement(false);
    setNewAlumniName('');
    setNewAlumniRole('');
    setNewAlumniCompany('');
    setNewAlumniQuote('');
  };

  const handleDeletePlacement = (id: string) => {
    onUpdatePlacements(placements.filter((p) => p.id !== id));
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    const newN: InstituteNotice = {
      id: 'notice-' + Date.now(),
      title: newNoticeTitle.trim(),
      content: newNoticeContent.trim(),
      date: 'Latest Notice',
      isUrgent: newNoticeUrgent,
      isActive: true,
    };

    onUpdateNotices([newN, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeUrgent(false);
  };

  const handleToggleNotice = (id: string) => {
    onUpdateNotices(
      notices.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n))
    );
  };

  const handleDeleteNotice = (id: string) => {
    onUpdateNotices(notices.filter((n) => n.id !== id));
  };

  const handleUpdateInquiryStatus = (id: string, newStatus: 'new' | 'contacted' | 'enrolled') => {
    onUpdateInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  };

  const handleDeleteInquiry = (id: string) => {
    onUpdateInquiries(inquiries.filter((inq) => inq.id !== id));
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) return;

    const newLead: StudentInquiry = {
      id: 'inq-' + Date.now(),
      fullName: newLeadName.trim(),
      phone: newLeadPhone.trim(),
      whatsapp: newLeadPhone.trim(),
      courseId: newLeadCourse,
      preferredShift: newLeadShift,
      educationLevel: 'Direct Campus Admission / Call',
      address: newLeadAddress,
      message: newLeadNote.trim() || 'Recorded via Institute Management Portal',
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdateInquiries([newLead, ...inquiries]);
    setShowAddLeadModal(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadNote('');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Phone', 'WhatsApp', 'Course Code', 'Shift', 'Education', 'Address', 'Status', 'Date'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.fullName}"`,
      `"${i.phone}"`,
      `"${i.whatsapp}"`,
      `"${i.courseId}"`,
      `"${i.preferredShift}"`,
      `"${i.educationLevel}"`,
      `"${i.address}"`,
      i.status,
      i.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nedian_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[90vh]"
      >
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-white px-2 py-1 rounded-lg">
              <NedianLogo size="sm" variant="compact" showSubtitle={false} />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                Institute Management Console
              </h3>
              <p className="text-[11px] text-slate-400">
                Mayadevi R.M. - 4, Kapilvastu (Chakarchauda), Nepal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-md font-semibold">
                Admin Session Active
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier Screen if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center space-y-5 max-w-md mx-auto my-auto">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto border border-sky-100">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 font-display">
                Authorized Personnel Access
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter your institute management password to view admission leads and edit fees.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                autoFocus
                placeholder="Enter Password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono tracking-wide text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              {authError && (
                <p className="text-xs text-rose-600 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Unlock Management Console
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Body */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Insights &amp; KPIs</span>
              </button>

              <button
                onClick={() => setActiveTab('institute')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'institute'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Institute Info &amp; Hours</span>
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'courses'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Courses ({courses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('placements')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'placements'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Placements ({placements.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notices')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'notices'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>Announcements ({notices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-sky-600" />
                <span>Student Leads ({inquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'certificates'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <IdCard className="w-3.5 h-3.5 text-purple-600" />
                <span>Smart IDs &amp; Certs ({certificates.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('logo')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'logo'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>Logo &amp; Brand</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>Backup &amp; Data</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Security Password</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
              
              {/* Tab 0: Overview / Insights */}
              {activeTab === 'overview' && (
                <AdminOverviewTab
                  inquiries={inquiries}
                  courses={courses}
                  placements={placements}
                  notices={notices}
                  certificatesCount={certificates.length}
                  onSwitchTab={(tab) => setActiveTab(tab)}
                  onExportCSV={handleExportCSV}
                />
              )}

              {/* Tab: Institute Info & Hours Settings */}
              {activeTab === 'institute' && (
                <div className="max-w-3xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        Institute Profile, Contacts &amp; Class Schedule
                      </h4>
                      <p className="text-xs text-slate-500">
                        Edit campus contact numbers, working days, Sunday holiday status, and official identity.
                      </p>
                    </div>

                    {infoSavedMsg && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{infoSavedMsg}</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSaveInstituteInfo} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Institute Name
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.name}
                          onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Division / Department
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.division}
                          onChange={(e) => setInfoForm({ ...infoForm, division: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Institute Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        required
                        value={infoForm.tagline}
                        onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Direct Phone Number
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.phone}
                          onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Official WhatsApp Number
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.whatsapp}
                          onChange={(e) => setInfoForm({ ...infoForm, whatsapp: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          required
                          value={infoForm.email}
                          onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Campus Physical Location / Address
                      </label>
                      <input
                        type="text"
                        required
                        value={infoForm.address}
                        onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-sky-50/50 rounded-xl border border-sky-100">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                          <span>Working Days &amp; Daily Class Timetable</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.workingDays}
                          onChange={(e) => setInfoForm({ ...infoForm, workingDays: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          e.g. Monday – Saturday: 6:30 AM – 7:00 PM
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-rose-800 mb-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-rose-600" />
                          <span>Sunday Holiday / Weekly Off Notice</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.sundayNotice}
                          onChange={(e) => setInfoForm({ ...infoForm, sundayNotice: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg font-medium text-rose-900"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={() => setInfoForm({ ...infoForm, sundayNotice: 'Sunday Closed (आइतबार साप्ताहिक बिदा / Sunday Holiday)' })}
                            className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded text-[10px] font-semibold border border-rose-200 cursor-pointer"
                          >
                            Sunday Closed (बिदा)
                          </button>
                          <button
                            type="button"
                            onClick={() => setInfoForm({ ...infoForm, sundayNotice: 'Sunday ko Chutty Rha Ga (आइतबार छुट्टी / Sunday Holiday)' })}
                            className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded text-[10px] font-semibold border border-rose-200 cursor-pointer"
                          >
                            "Sunday ko Chutty Rha Ga"
                          </button>
                          <button
                            type="button"
                            onClick={() => setInfoForm({ ...infoForm, sundayNotice: 'Sunday Open 9:00 AM – 2:00 PM (Special Weekend Batches)' })}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[10px] font-semibold border border-slate-300 cursor-pointer"
                          >
                            Sunday Special Batch
                          </button>
                        </div>
                        <span className="text-[10px] text-rose-600 mt-1 block">
                          Current status is live across website navbar, hero badge, inquiry form, and footer.
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Campus Director / Head Name
                        </label>
                        <input
                          type="text"
                          value={infoForm.directorName}
                          onChange={(e) => setInfoForm({ ...infoForm, directorName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Govt. Registration Subtext
                        </label>
                        <input
                          type="text"
                          value={infoForm.registeredNotice}
                          onChange={(e) => setInfoForm({ ...infoForm, registeredNotice: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Batch Shifts Section */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>Daily Class Shift Timetable</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Morning Shift</label>
                          <input
                            type="text"
                            value={infoForm.morningShift || '6:30 AM – 9:30 AM'}
                            onChange={(e) => setInfoForm({ ...infoForm, morningShift: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Day Shift</label>
                          <input
                            type="text"
                            value={infoForm.dayShift || '10:00 AM – 2:00 PM'}
                            onChange={(e) => setInfoForm({ ...infoForm, dayShift: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Evening Shift</label>
                          <input
                            type="text"
                            value={infoForm.eveningShift || '3:00 PM – 7:00 PM'}
                            onChange={(e) => setInfoForm({ ...infoForm, eveningShift: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Section & Headline Customizer */}
                    <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
                      <h5 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Homepage Hero Banner &amp; Headline Texts</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hero Admission Kicker Badge</label>
                          <input
                            type="text"
                            value={infoForm.heroKicker || 'Admissions Open 2026–2027'}
                            onChange={(e) => setInfoForm({ ...infoForm, heroKicker: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hero Sub-Kicker (Offer / Perk)</label>
                          <input
                            type="text"
                            value={infoForm.heroSubKicker || 'Free Bag & Smart ID Card Included'}
                            onChange={(e) => setInfoForm({ ...infoForm, heroSubKicker: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hero Main Headline Prefix</label>
                          <input
                            type="text"
                            value={infoForm.heroHeadline || 'Official Computer Training Institute in'}
                            onChange={(e) => setInfoForm({ ...infoForm, heroHeadline: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hero Highlight Word</label>
                          <input
                            type="text"
                            value={infoForm.heroHighlightWord || 'Chakarchauda, Nepal'}
                            onChange={(e) => setInfoForm({ ...infoForm, heroHighlightWord: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hero Description Paragraph</label>
                        <textarea
                          rows={2}
                          value={infoForm.heroDescription || 'Master job-ready IT skills with practical 1:1 computer workstation access. Offering certified ADCA, DCA, Tally Prime with VAT, Desktop Publishing, and Spoken Language courses designed for government Lok Sewa, banking, and commercial careers.'}
                          onChange={(e) => setInfoForm({ ...infoForm, heroDescription: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed resize-none"
                        />
                      </div>
                    </div>

                    {/* Campus Statistics Customizer */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                        <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Homepage Live Statistics &amp; Metrics</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Students Trained Count</label>
                          <input
                            type="number"
                            value={infoForm.studentsTrainedCount || 1250}
                            onChange={(e) => setInfoForm({ ...infoForm, studentsTrainedCount: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Batches Completed Count</label>
                          <input
                            type="number"
                            value={infoForm.batchesCompletedCount || 180}
                            onChange={(e) => setInfoForm({ ...infoForm, batchesCompletedCount: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">1:1 Workstations / PCs Count</label>
                          <input
                            type="number"
                            value={infoForm.workstationsCount || 45}
                            onChange={(e) => setInfoForm({ ...infoForm, workstationsCount: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Institute Details</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 1: Enhanced Leads */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        Online Admission Inquiries &amp; Leads
                      </h4>
                      <p className="text-xs text-slate-500">
                        Total {inquiries.length} inquiries received from website visitors and walk-ins.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAddLeadModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Walk-in Lead</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search leads by student name, phone, or address..."
                        value={leadsSearch}
                        onChange={(e) => setLeadsSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl shrink-0 overflow-x-auto">
                      {(['all', 'new', 'contacted', 'enrolled'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setLeadsFilter(status)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                            leadsFilter === status
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {status} ({status === 'all' ? inquiries.length : inquiries.filter((i) => i.status === status).length})
                        </button>
                      ))}
                    </div>
                  </div>

                  {inquiries.filter((inq) => {
                    const matchesSearch =
                      inq.fullName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                      inq.phone.includes(leadsSearch) ||
                      inq.courseId.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                      inq.address.toLowerCase().includes(leadsSearch.toLowerCase());
                    const matchesFilter = leadsFilter === 'all' || inq.status === leadsFilter;
                    return matchesSearch && matchesFilter;
                  }).length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center text-slate-500 border border-slate-200 text-xs">
                      No student inquiries found matching your filters.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries
                        .filter((inq) => {
                          const matchesSearch =
                            inq.fullName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                            inq.phone.includes(leadsSearch) ||
                            inq.courseId.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                            inq.address.toLowerCase().includes(leadsSearch.toLowerCase());
                          const matchesFilter = leadsFilter === 'all' || inq.status === leadsFilter;
                          return matchesSearch && matchesFilter;
                        })
                        .map((inq) => (
                          <div
                            key={inq.id}
                            className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{inq.fullName}</span>
                                <span className="text-xs bg-sky-50 text-sky-800 px-2 py-0.5 rounded font-medium">
                                  {inq.courseId.toUpperCase()}
                                </span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  inq.status === 'enrolled'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : inq.status === 'contacted'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {inq.status}
                                </span>
                              </div>

                              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span className="font-mono tabular-nums">{inq.phone}</span>
                                </span>
                                <span>Shift: {inq.preferredShift}</span>
                                <span>Qualification: {inq.educationLevel}</span>
                                <span>Location: {inq.address}</span>
                                <span className="text-slate-400">Date: {inq.createdAt}</span>
                              </div>

                              {inq.message && (
                                <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                                  Note: "{inq.message}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Direct Phone Dial */}
                              <a
                                href={`tel:+977${inq.phone}`}
                                className="p-2 text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
                                title="Call Student Directly"
                              >
                                <Phone className="w-4 h-4" />
                              </a>

                              {/* WhatsApp link with personalized greeting */}
                              <a
                                href={`https://wa.me/977${inq.whatsapp}?text=Namaste%20${encodeURIComponent(inq.fullName)}%20ji%2C%20greetings%20from%20NEDIAN%20CONNECT%20INSTITUTE%20Chakarchauda%20regarding%20your%20inquiry%20for%20${encodeURIComponent(inq.courseId.toUpperCase())}.%20Admissions%20are%20open%20now.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {/* Status changer */}
                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="enrolled">Enrolled</option>
                              </select>

                              {/* Edit Lead */}
                              <button
                                onClick={() => setEditingLead(inq)}
                                className="p-2 text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                                title="Edit Student Lead Details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Add Walk-in Lead Modal */}
                  {showAddLeadModal && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
                        <div className="bg-sky-900 text-white px-5 py-3.5 flex items-center justify-between">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-sky-300" />
                            <span>Add Walk-in Student Lead</span>
                          </h4>
                          <button
                            onClick={() => setShowAddLeadModal(false)}
                            className="text-slate-300 hover:text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleAddLead} className="p-5 space-y-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Roshan Yadav"
                              value={newLeadName}
                              onChange={(e) => setNewLeadName(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                              <input
                                type="text"
                                required
                                placeholder="98XXXXXXXX"
                                value={newLeadPhone}
                                onChange={(e) => setNewLeadPhone(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Target Course</label>
                              <select
                                value={newLeadCourse}
                                onChange={(e) => setNewLeadCourse(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                              >
                                {courses.map((c) => (
                                  <option key={c.id} value={c.code.toLowerCase()}>
                                    {c.code} - {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Preferred Shift</label>
                              <select
                                value={newLeadShift}
                                onChange={(e) => setNewLeadShift(e.target.value as any)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              >
                                <option value="Morning (6:30 AM - 9:30 AM)">Morning (6:30 AM)</option>
                                <option value="Day (10:00 AM - 2:00 PM)">Day (10:00 AM)</option>
                                <option value="Evening (3:00 PM - 7:00 PM)">Evening (3:00 PM)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Address / Ward</label>
                              <input
                                type="text"
                                value={newLeadAddress}
                                onChange={(e) => setNewLeadAddress(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Counselor Note / Message</label>
                            <textarea
                              rows={2}
                              placeholder="Visited campus desk, interested in installment fee..."
                              value={newLeadNote}
                              onChange={(e) => setNewLeadNote(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddLeadModal(false)}
                              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
                            >
                              Save Lead
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Edit Student Lead Modal */}
                  {editingLead && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
                        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <Edit2 className="w-4 h-4 text-sky-400" />
                            <span>Edit Student Lead Details</span>
                          </h4>
                          <button
                            onClick={() => setEditingLead(null)}
                            className="text-slate-300 hover:text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveLead} className="p-5 space-y-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                            <input
                              type="text"
                              required
                              value={editingLead.fullName}
                              onChange={(e) => setEditingLead({ ...editingLead, fullName: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                              <input
                                type="text"
                                required
                                value={editingLead.phone}
                                onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
                              <input
                                type="text"
                                required
                                value={editingLead.whatsapp}
                                onChange={(e) => setEditingLead({ ...editingLead, whatsapp: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Target Course</label>
                              <select
                                value={editingLead.courseId}
                                onChange={(e) => setEditingLead({ ...editingLead, courseId: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                              >
                                {courses.map((c) => (
                                  <option key={c.id} value={c.code.toLowerCase()}>
                                    {c.code} - {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Status</label>
                              <select
                                value={editingLead.status}
                                onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as any })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold capitalize"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="enrolled">Enrolled</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Preferred Shift</label>
                              <select
                                value={editingLead.preferredShift}
                                onChange={(e) => setEditingLead({ ...editingLead, preferredShift: e.target.value as any })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              >
                                <option value="Morning (6:30 AM - 9:30 AM)">Morning (6:30 AM)</option>
                                <option value="Day (10:00 AM - 2:00 PM)">Day (10:00 AM)</option>
                                <option value="Evening (3:00 PM - 7:00 PM)">Evening (3:00 PM)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Address / Ward</label>
                              <input
                                type="text"
                                value={editingLead.address}
                                onChange={(e) => setEditingLead({ ...editingLead, address: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Qualification / Education</label>
                            <input
                              type="text"
                              value={editingLead.educationLevel}
                              onChange={(e) => setEditingLead({ ...editingLead, educationLevel: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Counselor Note / Message</label>
                            <textarea
                              rows={2}
                              value={editingLead.message || ''}
                              onChange={(e) => setEditingLead({ ...editingLead, message: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingLead(null)}
                              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
                            >
                              Save Lead
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Tab: Certificates & IDs */}
              {activeTab === 'certificates' && (
                <AdminCertificatesTab
                  certificates={certificates}
                  onUpdateCertificates={handleUpdateCertificates}
                />
              )}

              {/* Tab 2: Courses & Fee Editor */}
              {activeTab === 'courses' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        Course Curriculum &amp; Fee Management
                      </h4>
                      <p className="text-xs text-slate-500">
                        Edit course names, syllabus topics, tuition fees, discounts, or create new programs. ({courses.length} active)
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddCourseModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add New Course</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {courses.map((course) => {
                      const isEditing = editingCourseId === course.id;

                      return (
                        <div
                          key={course.id}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sky-800 text-xs bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                                  {course.code}
                                </span>
                                <h5 className="font-bold text-slate-900 text-sm">
                                  {course.name}
                                </h5>
                                {course.badge && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                    {course.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 mt-0.5 block">
                                Duration: {course.durationMonths} Months · Category: <span className="capitalize">{course.category}</span> · Topics: {course.topics?.length || 0} modules
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {!isEditing ? (
                                <>
                                  <button
                                    onClick={() => setEditingFullCourse(course)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                                    title="Edit Full Course Curriculum & Info"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Full Edit</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setEditingCourseId(course.id);
                                      setEditAdmissionFee(course.admissionFee);
                                      setEditMonthlyFee(course.monthlyFee);
                                      setEditDiscount(course.fullPayDiscountPercent);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                                    title="Quick Edit Fees"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit Rates</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Course"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleSaveCourseFee(course.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save Changes</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingCourseId(null)}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Admission Fee (NPR)
                                </label>
                                <input
                                  type="number"
                                  value={editAdmissionFee}
                                  onChange={(e) => setEditAdmissionFee(Number(e.target.value))}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Monthly Tuition (NPR)
                                </label>
                                <input
                                  type="number"
                                  value={editMonthlyFee}
                                  onChange={(e) => setEditMonthlyFee(Number(e.target.value))}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Full-Pay Discount (%)
                                </label>
                                <input
                                  type="number"
                                  value={editDiscount}
                                  onChange={(e) => setEditDiscount(Number(e.target.value))}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <div>
                                <span className="text-slate-400 block text-[11px]">Admission</span>
                                <span className="font-mono font-bold text-slate-800">
                                  NPR {course.admissionFee.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px]">Monthly</span>
                                <span className="font-mono font-bold text-slate-800">
                                  NPR {course.monthlyFee.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px]">Full-Pay Discount</span>
                                <span className="font-mono font-bold text-emerald-700">
                                  {course.fullPayDiscountPercent}% OFF
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Course Modal */}
                  {showAddCourseModal && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden my-6">
                        <div className="bg-sky-900 text-white px-5 py-3.5 flex items-center justify-between">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-sky-300" />
                            <span>Create New Course Curriculum</span>
                          </h4>
                          <button
                            onClick={() => setShowAddCourseModal(false)}
                            className="text-slate-300 hover:text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleAddCourse} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Course Code</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. ADCA, DCA, TALLY"
                                value={newCourseCode}
                                onChange={(e) => setNewCourseCode(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Category</label>
                              <select
                                value={newCourseCategory}
                                onChange={(e) => setNewCourseCategory(e.target.value as any)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                              >
                                <option value="diploma">Diploma</option>
                                <option value="accounting">Accounting</option>
                                <option value="office">Office & Automation</option>
                                <option value="language">Language Fluency</option>
                                <option value="foundation">Foundation / Basic</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Full Course Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Advanced Diploma in Computer Application"
                              value={newCourseName}
                              onChange={(e) => setNewCourseName(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                            />
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Duration (Mo.)</label>
                              <input
                                type="number"
                                required
                                min={1}
                                max={24}
                                value={newCourseDuration}
                                onChange={(e) => setNewCourseDuration(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Admission Fee</label>
                              <input
                                type="number"
                                required
                                value={newCourseAdmission}
                                onChange={(e) => setNewCourseAdmission(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Monthly Fee</label>
                              <input
                                type="number"
                                required
                                value={newCourseMonthly}
                                onChange={(e) => setNewCourseMonthly(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                              <input
                                type="number"
                                required
                                min={0}
                                max={50}
                                value={newCourseDiscount}
                                onChange={(e) => setNewCourseDiscount(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                            <textarea
                              rows={2}
                              placeholder="Comprehensive course outline and learning outcomes..."
                              value={newCourseDesc}
                              onChange={(e) => setNewCourseDesc(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Syllabus Topics Covered (One topic per line)
                            </label>
                            <textarea
                              rows={3}
                              placeholder={"MS Office 365 Professional\nAdvanced Excel & Dashboards\nTally Prime with VAT\nGraphic Design Photoshop"}
                              value={newCourseTopics}
                              onChange={(e) => setNewCourseTopics(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Career Prospects / Job Roles (One per line)
                            </label>
                            <textarea
                              rows={2}
                              placeholder={"Computer Operator\nAccountant\nOffice Assistant"}
                              value={newCourseCareer}
                              onChange={(e) => setNewCourseCareer(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                            <button
                              type="button"
                              onClick={() => setShowAddCourseModal(false)}
                              className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer flex items-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Course</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Full Edit Course Modal */}
                  {editingFullCourse && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden my-6">
                        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-sky-400" />
                            <span>Edit Course: {editingFullCourse.name}</span>
                          </h4>
                          <button
                            onClick={() => setEditingFullCourse(null)}
                            className="text-slate-300 hover:text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveFullCourse} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Course Code</label>
                              <input
                                type="text"
                                required
                                value={editingFullCourse.code}
                                onChange={(e) => setEditingFullCourse({ ...editingFullCourse, code: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Category</label>
                              <select
                                value={editingFullCourse.category}
                                onChange={(e) => setEditingFullCourse({ ...editingFullCourse, category: e.target.value as any })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                              >
                                <option value="diploma">Diploma</option>
                                <option value="accounting">Accounting</option>
                                <option value="office">Office & Automation</option>
                                <option value="language">Language Fluency</option>
                                <option value="foundation">Foundation / Basic</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Full Course Title</label>
                            <input
                              type="text"
                              required
                              value={editingFullCourse.name}
                              onChange={(e) => setEditingFullCourse({ ...editingFullCourse, name: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                            />
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Duration (Mo.)</label>
                              <input
                                type="number"
                                required
                                min={1}
                                max={24}
                                value={editingFullCourse.durationMonths}
                                onChange={(e) => {
                                  const dur = Number(e.target.value);
                                  const total = editingFullCourse.admissionFee + (editingFullCourse.monthlyFee * dur);
                                  setEditingFullCourse({ ...editingFullCourse, durationMonths: dur, totalFee: total });
                                }}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Admission Fee</label>
                              <input
                                type="number"
                                required
                                value={editingFullCourse.admissionFee}
                                onChange={(e) => {
                                  const adm = Number(e.target.value);
                                  const total = adm + (editingFullCourse.monthlyFee * editingFullCourse.durationMonths);
                                  setEditingFullCourse({ ...editingFullCourse, admissionFee: adm, totalFee: total });
                                }}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Monthly Tuition</label>
                              <input
                                type="number"
                                required
                                value={editingFullCourse.monthlyFee}
                                onChange={(e) => {
                                  const mon = Number(e.target.value);
                                  const total = editingFullCourse.admissionFee + (mon * editingFullCourse.durationMonths);
                                  setEditingFullCourse({ ...editingFullCourse, monthlyFee: mon, totalFee: total });
                                }}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                              <input
                                type="number"
                                required
                                min={0}
                                max={50}
                                value={editingFullCourse.fullPayDiscountPercent}
                                onChange={(e) => setEditingFullCourse({ ...editingFullCourse, fullPayDiscountPercent: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-emerald-700"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                              <input
                                type="text"
                                placeholder="e.g. Most Comprehensive, Job Oriented"
                                value={editingFullCourse.badge || ''}
                                onChange={(e) => setEditingFullCourse({ ...editingFullCourse, badge: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Certificate Award Title</label>
                              <input
                                type="text"
                                value={editingFullCourse.certificateType}
                                onChange={(e) => setEditingFullCourse({ ...editingFullCourse, certificateType: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Course Description</label>
                            <textarea
                              rows={2}
                              value={editingFullCourse.description}
                              onChange={(e) => setEditingFullCourse({ ...editingFullCourse, description: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Syllabus Topics (One module per line)
                            </label>
                            <textarea
                              rows={4}
                              value={editingFullCourse.topics.join('\n')}
                              onChange={(e) => {
                                const lines = e.target.value.split('\n');
                                setEditingFullCourse({ ...editingFullCourse, topics: lines });
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Career Prospects / Placement Roles (One per line)
                            </label>
                            <textarea
                              rows={2}
                              value={editingFullCourse.careerProspects.join('\n')}
                              onChange={(e) => {
                                const lines = e.target.value.split('\n');
                                setEditingFullCourse({ ...editingFullCourse, careerProspects: lines });
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                            <button
                              type="button"
                              onClick={() => setEditingFullCourse(null)}
                              className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Save All Course Changes</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Tab 3: Placements */}
              {activeTab === 'placements' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        Alumni Career Placements
                      </h4>
                      <p className="text-xs text-slate-500">
                        Manage testimonials and employer verification displayed on the website.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddPlacement(!showAddPlacement)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Alumni</span>
                    </button>
                  </div>

                  {showAddPlacement && (
                    <form onSubmit={handleAddPlacement} className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm space-y-3">
                      <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                        New Alumni Placement Record
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <input
                          type="text"
                          required
                          placeholder="Student Name (e.g. Ramesh Kumar Yadav)"
                          value={newAlumniName}
                          onChange={(e) => setNewAlumniName(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Course Taken (e.g. ADCA - 12 Months)"
                          value={newAlumniCourse}
                          onChange={(e) => setNewAlumniCourse(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Role (e.g. Accounts Officer)"
                          value={newAlumniRole}
                          onChange={(e) => setNewAlumniRole(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Company (e.g. Global IME Bank Ltd.)"
                          value={newAlumniCompany}
                          onChange={(e) => setNewAlumniCompany(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Salary (e.g. NPR 38,000 / month)"
                          value={newAlumniSalary}
                          onChange={(e) => setNewAlumniSalary(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Location (e.g. Chakarchauda, Nepal)"
                          value={newAlumniLocation}
                          onChange={(e) => setNewAlumniLocation(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Student Testimonial Quote..."
                        value={newAlumniQuote}
                        onChange={(e) => setNewAlumniQuote(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddPlacement(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                        >
                          Save Record
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {placements.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{p.studentName}</span>
                            <span className="text-slate-500">({p.courseTaken})</span>
                            <span className="text-emerald-700 font-mono font-semibold">{p.salaryMonthly}</span>
                          </div>
                          <span className="text-slate-600 block mt-0.5">
                            {p.role} @ {p.company} ({p.location})
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingPlacement(p)}
                            className="p-1.5 text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                            title="Edit Alumni Story"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlacement(p.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove alumni"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Placement Modal */}
                  {editingPlacement && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
                        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <Award className="w-4 h-4 text-emerald-400" />
                            <span>Edit Alumni Placement Record</span>
                          </h4>
                          <button
                            onClick={() => setEditingPlacement(null)}
                            className="text-slate-300 hover:text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSavePlacement} className="p-5 space-y-3 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                              <input
                                type="text"
                                required
                                value={editingPlacement.studentName}
                                onChange={(e) => setEditingPlacement({ ...editingPlacement, studentName: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Course Completed</label>
                              <input
                                type="text"
                                required
                                value={editingPlacement.courseTaken}
                                onChange={(e) => setEditingPlacement({ ...editingPlacement, courseTaken: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Job Role / Title</label>
                              <input
                                type="text"
                                required
                                value={editingPlacement.role}
                                onChange={(e) => setEditingPlacement({ ...editingPlacement, role: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Hiring Organization / Firm</label>
                              <input
                                type="text"
                                required
                                value={editingPlacement.company}
                                onChange={(e) => setEditingPlacement({ ...editingPlacement, company: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Monthly Salary (NPR)</label>
                              <input
                                type="text"
                                value={editingPlacement.salaryMonthly}
                                onChange={(e) => setEditingPlacement({ ...editingPlacement, salaryMonthly: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Work Location</label>
                              <input
                                type="text"
                                value={editingPlacement.location}
                                onChange={(e) => setEditingPlacement({ ...editingPlacement, location: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Student Testimonial Quote</label>
                            <textarea
                              rows={2}
                              value={editingPlacement.quote}
                              onChange={(e) => setEditingPlacement({ ...editingPlacement, quote: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                            <button
                              type="button"
                              onClick={() => setEditingPlacement(null)}
                              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Tab 4: Notices */}
              {activeTab === 'notices' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-display">
                      Institute Announcements &amp; Website Notice Ticker
                    </h4>
                    <p className="text-xs text-slate-500">
                      The active notice will be featured across the top banner of the website.
                    </p>
                  </div>

                  <form onSubmit={handleAddNotice} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Create New Announcement
                    </h5>
                    <div className="space-y-2 text-xs">
                      <input
                        type="text"
                        required
                        placeholder="Notice Title (e.g. Free Bag & ID Card with 2026 Admissions)"
                        value={newNoticeTitle}
                        onChange={(e) => setNewNoticeTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                      <textarea
                        rows={2}
                        required
                        placeholder="Notice description..."
                        value={newNoticeContent}
                        onChange={(e) => setNewNoticeContent(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                          <input
                            type="checkbox"
                            checked={newNoticeUrgent}
                            onChange={(e) => setNewNoticeUrgent(e.target.checked)}
                            className="rounded text-sky-600"
                          />
                          <span>Mark as Urgent Notice</span>
                        </label>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
                        >
                          Publish Notice
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                          n.isActive ? 'bg-white border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{n.title}</span>
                            {n.isUrgent && (
                              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                Urgent
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400">({n.date})</span>
                          </div>
                          <p className="text-slate-600 line-clamp-1">{n.content}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingNotice(n)}
                            className="p-1.5 text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 cursor-pointer"
                            title="Edit Announcement"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleNotice(n.id)}
                            className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                              n.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {n.isActive ? 'Active on Banner' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(n.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Notice Modal */}
                  {editingNotice && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
                        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <Bell className="w-4 h-4 text-amber-400" />
                            <span>Edit Announcement</span>
                          </h4>
                          <button
                            onClick={() => setEditingNotice(null)}
                            className="text-slate-300 hover:text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveNotice} className="p-5 space-y-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Notice Title</label>
                            <input
                              type="text"
                              required
                              value={editingNotice.title}
                              onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Notice Content</label>
                            <textarea
                              rows={3}
                              required
                              value={editingNotice.content}
                              onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Date / Tag</label>
                              <input
                                type="text"
                                value={editingNotice.date}
                                onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                              />
                            </div>

                            <div className="flex flex-col justify-end space-y-1.5">
                              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={editingNotice.isUrgent}
                                  onChange={(e) => setEditingNotice({ ...editingNotice, isUrgent: e.target.checked })}
                                  className="rounded text-rose-600"
                                />
                                <span>Urgent Notice</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={editingNotice.isActive}
                                  onChange={(e) => setEditingNotice({ ...editingNotice, isActive: e.target.checked })}
                                  className="rounded text-emerald-600"
                                />
                                <span>Active on Banner</span>
                              </label>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                            <button
                              type="button"
                              onClick={() => setEditingNotice(null)}
                              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                            >
                              Save Notice
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Tab: Logo & Branding */}
              {activeTab === 'logo' && (
                <div className="max-w-xl space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-display">
                      Institute Logo &amp; Identity Settings
                    </h4>
                    <p className="text-xs text-slate-500">
                      Manage official logo rendering or upload your original PNG graphic file.
                    </p>
                  </div>

                  {logoStatusMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
                      {logoStatusMsg}
                    </div>
                  )}

                  {/* Current Active Logo Preview */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Current Active Logo Preview:
                    </span>
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center min-h-[90px]">
                      <NedianLogo size="lg" variant="compact" showSubtitle={true} />
                    </div>
                    <p className="text-[11px] text-slate-500 text-center">
                      Displayed on Desktop Navigation, Mobile Header, Footer, and Inquiries Desk.
                    </p>
                  </div>

                  {/* Upload Image Option */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-900 block">
                        Upload Custom Logo File (PNG / JPEG)
                      </span>
                      <p className="text-xs text-slate-500">
                        Upload your exact <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-800">download.png</code> or official design asset. It will replace the vector logo with 100% pixel fidelity across the entire website.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <label className="flex-1 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-xl text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>Select download.png file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoFileUpload}
                        />
                      </label>

                      {customLogoPreview && (
                        <button
                          type="button"
                          onClick={handleResetLogo}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset to Vector Logo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Database Backup & Recovery */}
              {activeTab === 'backup' && (
                <AdminBackupTab
                  courses={courses}
                  onUpdateCourses={onUpdateCourses}
                  placements={placements}
                  onUpdatePlacements={onUpdatePlacements}
                  notices={notices}
                  onUpdateNotices={onUpdateNotices}
                  inquiries={inquiries}
                  onUpdateInquiries={onUpdateInquiries}
                  certificates={certificates}
                  onUpdateCertificates={handleUpdateCertificates}
                  instituteInfo={instituteInfo}
                  onUpdateInstituteInfo={onUpdateInstituteInfo}
                />
              )}

              {/* Tab 5: Security Password */}
              {activeTab === 'security' && (
                <div className="max-w-md space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-display">
                      Security Password Configuration
                    </h4>
                    <p className="text-xs text-slate-500">
                      Change the administrative password used to access this management dashboard.
                    </p>
                  </div>

                  <form onSubmit={handleUpdatePin} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        New Security Password (at least 6 characters)
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Enter new password"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono tracking-wider"
                      />
                    </div>

                    {pinChangeMsg && (
                      <p className="text-xs font-medium text-emerald-700">{pinChangeMsg}</p>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Update Security Password
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
