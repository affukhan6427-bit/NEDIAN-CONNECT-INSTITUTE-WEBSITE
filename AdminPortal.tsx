import React, { useState } from 'react';
import { 
  X, Lock, Shield, Users, BookOpen, Award, Bell, 
  Plus, Trash2, Edit2, Check, Download, MessageCircle, Phone, Sparkles, KeyRound, Upload, RefreshCw,
  BarChart3, IdCard, Database, Search, Filter, Calendar
} from 'lucide-react';
import { Course, PlacementStory, StudentInquiry, InstituteNotice, StudentCertificateRecord } from '../types';
import { INITIAL_CERTIFICATES } from '../data/instituteData';
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
}) => {
  // Password authentication state
  const [pinInput, setPinInput] = useState('');
  const [storedPin, setStoredPin] = useState(() => localStorage.getItem('nedian_admin_password') || localStorage.getItem('nedian_admin_pin') || '@FZ@LKH@N1100');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  // Active sub-tab
  type TabType = 'overview' | 'leads' | 'certificates' | 'courses' | 'placements' | 'notices' | 'logo' | 'backup' | 'security';
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
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'courses'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Course &amp; Fees</span>
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
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-display">
                      Course Curriculum &amp; Fee Management
                    </h4>
                    <p className="text-xs text-slate-500">
                      Update admission fees, monthly tuition, and payment discounts with immediate campus effect.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {courses.map((course) => {
                      const isEditing = editingCourseId === course.id;

                      return (
                        <div
                          key={course.id}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sky-800 text-xs">
                                  {course.code}
                                </span>
                                <h5 className="font-bold text-slate-900 text-sm">
                                  {course.name}
                                </h5>
                              </div>
                              <span className="text-xs text-slate-500">
                                Duration: {course.durationMonths} Months · Category: {course.category}
                              </span>
                            </div>

                            {!isEditing ? (
                              <button
                                onClick={() => {
                                  setEditingCourseId(course.id);
                                  setEditAdmissionFee(course.admissionFee);
                                  setEditMonthlyFee(course.monthlyFee);
                                  setEditDiscount(course.fullPayDiscountPercent);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit Rates</span>
                              </button>
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

                        <button
                          onClick={() => handleDeletePlacement(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove alumni"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
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
