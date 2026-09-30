import React, { useState } from 'react';
import { 
  Database, Download, Upload, RefreshCw, AlertTriangle, 
  CheckCircle2, HardDrive, FileJson, ShieldAlert 
} from 'lucide-react';
import { Course, PlacementStory, StudentInquiry, InstituteNotice, StudentCertificateRecord, InstituteInfo, FaqItem } from '../../types';

interface AdminBackupTabProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  placements: PlacementStory[];
  onUpdatePlacements: (placements: PlacementStory[]) => void;
  notices: InstituteNotice[];
  onUpdateNotices: (notices: InstituteNotice[]) => void;
  inquiries: StudentInquiry[];
  onUpdateInquiries: (inquiries: StudentInquiry[]) => void;
  certificates: StudentCertificateRecord[];
  onUpdateCertificates: (certificates: StudentCertificateRecord[]) => void;
  instituteInfo?: InstituteInfo;
  onUpdateInstituteInfo?: (info: InstituteInfo) => void;
  faqs?: FaqItem[];
  onUpdateFaqs?: (faqs: FaqItem[]) => void;
}

export const AdminBackupTab: React.FC<AdminBackupTabProps> = ({
  courses,
  onUpdateCourses,
  placements,
  onUpdatePlacements,
  notices,
  onUpdateNotices,
  inquiries,
  onUpdateInquiries,
  certificates,
  onUpdateCertificates,
  instituteInfo,
  onUpdateInstituteInfo,
  faqs,
  onUpdateFaqs,
}) => {
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Calculate approximate storage usage
  const calculateStorage = () => {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('nedian_')) {
        total += (localStorage[key].length * 2); // 2 bytes per char
      }
    }
    return (total / 1024).toFixed(2);
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        institute: 'Nedian Connect Computer Training Institute',
        location: 'Chakarchauda, Mayadevi-4, Kapilvastu, Nepal',
        data: {
          instituteInfo: instituteInfo || undefined,
          courses,
          placements,
          notices,
          inquiries,
          certificates,
          faqs: faqs || undefined,
          adminPassword: localStorage.getItem('nedian_admin_password') || '@FZ@LKH@N1100',
        },
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nedian_institute_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage('Complete system backup downloaded successfully!');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage('Failed to generate backup: ' + err.message);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data) {
          throw new Error('Invalid backup file format: missing data payload.');
        }

        const { instituteInfo: impInfo, courses: impCourses, placements: impPlacements, notices: impNotices, inquiries: impInquiries, certificates: impCerts, faqs: impFaqs, adminPassword } = parsed.data;

        if (impInfo && onUpdateInstituteInfo) {
          onUpdateInstituteInfo(impInfo);
        }
        if (impCourses) onUpdateCourses(impCourses);
        if (impPlacements) onUpdatePlacements(impPlacements);
        if (impNotices) onUpdateNotices(impNotices);
        if (impInquiries) onUpdateInquiries(impInquiries);
        if (impCerts) onUpdateCertificates(impCerts);
        if (impFaqs && onUpdateFaqs) onUpdateFaqs(impFaqs);
        if (adminPassword) localStorage.setItem('nedian_admin_password', adminPassword);

        setStatusMessage('System database successfully restored from JSON backup! Reloading page...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err: any) {
        setErrorMessage('Restore failed: ' + err.message);
        setTimeout(() => setErrorMessage(''), 5000);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Warning: This will clear locally customized courses, inquiries, and restore institute defaults. Are you sure?')) {
      localStorage.removeItem('nedian_courses');
      localStorage.removeItem('nedian_placements');
      localStorage.removeItem('nedian_notices');
      localStorage.removeItem('nedian_inquiries');
      localStorage.removeItem('nedian_verified_students');
      setStatusMessage('Data reset to factory defaults. Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-base font-bold text-slate-900 font-display">
          Database Management &amp; System Backups
        </h4>
        <p className="text-xs text-slate-500">
          Export all institute records, admission leads, certificates, and course fees into portable JSON files.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Storage and System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Storage Used</span>
          <div className="text-xl font-extrabold text-slate-900 font-mono flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-sky-600" />
            <span>~{calculateStorage()} KB</span>
          </div>
          <span className="text-[11px] text-slate-500">Local persistent cache</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Stored Records</span>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">
            {courses.length + placements.length + notices.length + inquiries.length + certificates.length} items
          </div>
          <span className="text-[11px] text-slate-500">Leads, courses, alumni &amp; IDs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">System Status</span>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-emerald-700">Healthy &amp; Synced</span>
          </div>
          <span className="text-[11px] text-slate-500">Offline-ready database</span>
        </div>
      </div>

      {/* Backup & Restore Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Export Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm font-display">Export Complete Backup</h5>
            <p className="text-xs text-slate-500 mt-0.5">
              Download all student inquiries, customized fee packages, certificates, and alumni records in a single JSON file.
            </p>
          </div>
          <button
            onClick={handleExportBackup}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm font-display">Restore from Backup</h5>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a previously exported institute JSON file to restore all admissions, fees, and certificate records.
            </p>
          </div>
          <label className="w-full py-2.5 px-4 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Upload JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h6 className="font-bold text-rose-900 text-xs">Reset to Factory Institute Data</h6>
            <p className="text-[11px] text-rose-700">Clear custom edits and revert back to standard syllabus fees.</p>
          </div>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-3 py-2 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          Reset All Data
        </button>
      </div>

    </div>
  );
};
