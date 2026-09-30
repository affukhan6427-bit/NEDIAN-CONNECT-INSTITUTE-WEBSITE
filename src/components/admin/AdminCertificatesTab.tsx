import React, { useState } from 'react';
import { 
  IdCard, Plus, Trash2, Printer, CheckCircle2, Search, 
  ExternalLink, User, BookOpen, Calendar, Clock, Award, ShieldCheck, X, Edit3 
} from 'lucide-react';
import { StudentCertificateRecord } from '../../types';
import { NedianLogo } from '../NedianLogo';

interface AdminCertificatesTabProps {
  certificates: StudentCertificateRecord[];
  onUpdateCertificates: (certificates: StudentCertificateRecord[]) => void;
}

export const AdminCertificatesTab: React.FC<AdminCertificatesTabProps> = ({
  certificates,
  onUpdateCertificates,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [previewStudent, setPreviewStudent] = useState<StudentCertificateRecord | null>(null);
  const [editingCert, setEditingCert] = useState<StudentCertificateRecord | null>(null);

  // New Certificate Form State
  const [newStudentId, setNewStudentId] = useState(`NED-2026-${100 + certificates.length + 1}`);
  const [newName, setNewName] = useState('');
  const [newCourse, setNewCourse] = useState('ADCA (Advanced Diploma in Computer Applications)');
  const [newDuration, setNewDuration] = useState('12 Months');
  const [newGrade, setNewGrade] = useState('Distinction (A+)');
  const [newShift, setNewShift] = useState('Morning (6:30 AM)');
  const [newStatus, setNewStatus] = useState('Certified & Verified');
  const [newCompletionDate, setNewCompletionDate] = useState('March 2026');

  const filtered = certificates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newStudentId.trim()) return;

    const newRecord: StudentCertificateRecord = {
      id: 'cert-' + Date.now(),
      studentId: newStudentId.trim().toUpperCase(),
      name: newName.trim(),
      course: newCourse,
      duration: newDuration,
      completionDate: newCompletionDate,
      grade: newGrade,
      shift: newShift,
      location: 'Chakarchauda Central Campus',
      status: newStatus,
      issueDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newRecord, ...certificates];
    onUpdateCertificates(updated);
    setShowIssueModal(false);

    // Reset Form
    setNewName('');
    setNewStudentId(`NED-2026-${100 + updated.length + 1}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to revoke this student ID / certificate record?')) {
      onUpdateCertificates(certificates.filter((c) => c.id !== id));
    }
  };

  const handleSaveEditedCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    const updated = certificates.map((c) =>
      c.id === editingCert.id ? editingCert : c
    );
    onUpdateCertificates(updated);
    setEditingCert(null);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-900 font-display">
            Student Smart ID Cards &amp; Verified Certificates
          </h4>
          <p className="text-xs text-slate-500">
            Official institute credentials verifiable on the public portal. ({certificates.length} registered)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIssueModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue New Student ID</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Student Name, ID (e.g. NED-2026-101), or Course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        />
      </div>

      {/* Certificates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
            No student certificate records matched your search.
          </div>
        ) : (
          filtered.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {cert.studentId}
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm mt-1">{cert.name}</h5>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cert.status.includes('Certified')
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-sky-100 text-sky-800'
                }`}>
                  {cert.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800 line-clamp-1">{cert.course}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Duration: {cert.duration}</span>
                  <span className="font-medium text-emerald-700">{cert.grade}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Shift: {cert.shift}</span>
                  <span className="font-mono">{cert.issueDate || cert.completionDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setPreviewStudent(cert)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 cursor-pointer"
                >
                  <IdCard className="w-3.5 h-3.5" />
                  <span>Preview ID</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCert({ ...cert })}
                    className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Certificate / Student ID Record"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Revoke / Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Issue New ID Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-emerald-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <IdCard className="w-4 h-4 text-emerald-300" />
                <span>Issue Student ID &amp; Certificate</span>
              </h4>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chaudhary"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Enrolled Course</label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                >
                  <option value="ADCA (Advanced Diploma in Computer Applications)">ADCA (12 Months Diploma)</option>
                  <option value="DCA (Diploma in Computer Application)">DCA (6 Months Diploma)</option>
                  <option value="Tally Prime with GST & VAT">Tally Prime Accounting (3 Months)</option>
                  <option value="CCC (Course on Computer Concepts)">CCC Foundation (3 Months)</option>
                  <option value="Graphic Designing & DTP">Graphic Designing &amp; DTP (6 Months)</option>
                  <option value="Fast Nepali & English Touch Typing">Fast Typing Specialist (2 Months)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade / Standing</label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift</label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Morning (6:30 AM)">Morning (6:30 AM)</option>
                    <option value="Day (10:00 AM)">Day (10:00 AM)</option>
                    <option value="Evening (3:00 PM)">Evening (3:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Verification Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Certified & Verified">Certified &amp; Verified</option>
                    <option value="Currently Enrolled (Active ID)">Currently Enrolled (Active ID)</option>
                    <option value="Completed - Awaiting Certificate">Completed - Awaiting Certificate</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Issue &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ID Card Print / Preview Modal */}
      {previewStudent && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Smart ID Card Print Preview</span>
              </h4>
              <button
                onClick={() => setPreviewStudent(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center bg-slate-100">
              
              {/* The Printable Student ID Card Badge */}
              <div className="w-80 bg-white rounded-2xl shadow-lg border-2 border-emerald-800 overflow-hidden relative">
                
                {/* ID Card Top Banner */}
                <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white p-3 text-center border-b-2 border-rose-600">
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <NedianLogo size="sm" variant="compact" showSubtitle={false} />
                  </div>
                  <h6 className="text-[11px] font-extrabold tracking-wide uppercase font-display">
                    Nedian Connect Institute
                  </h6>
                  <p className="text-[8px] text-emerald-200">
                    Chakarchauda, Mayadevi-4, Kapilvastu, Nepal
                  </p>
                </div>

                {/* ID Card Body */}
                <div className="p-4 flex flex-col items-center text-center space-y-2.5">
                  {/* Photo Frame */}
                  <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-800 font-extrabold text-2xl shadow-inner">
                    {previewStudent.name.charAt(0)}
                  </div>

                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900 font-display">
                      {previewStudent.name}
                    </h5>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                      {previewStudent.studentId}
                    </span>
                  </div>

                  <div className="w-full text-left text-[11px] space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Course:</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{previewStudent.course.split('(')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Batch / Shift:</span>
                      <span className="font-semibold text-slate-800">{previewStudent.shift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Standing:</span>
                      <span className="font-bold text-emerald-700">{previewStudent.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Valid Thru:</span>
                      <span className="font-mono text-slate-700">2026 – 2027</span>
                    </div>
                  </div>

                  {/* Simulated barcode / magnetic strip */}
                  <div className="w-full flex flex-col items-center pt-1">
                    <div className="font-mono text-[9px] tracking-widest text-slate-400">
                      ||| | | |||| || | ||||| | || | |||
                    </div>
                    <span className="text-[8px] text-slate-400 mt-0.5 uppercase tracking-wider">
                      Authorized Signature &amp; Institute Stamp
                    </span>
                  </div>
                </div>

                {/* ID Bottom Accent Ribbon */}
                <div className="h-1.5 bg-gradient-to-r from-emerald-700 via-rose-600 to-emerald-700" />
              </div>

            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Ready for laser card printing</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintCard}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print ID Card</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Edit Certificate & Student ID Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-sky-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-300" />
                <span>Edit Certificate &amp; Student ID</span>
              </h4>
              <button
                onClick={() => setEditingCert(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedCertificate} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student ID / Roll</label>
                  <input
                    type="text"
                    required
                    value={editingCert.studentId}
                    onChange={(e) => setEditingCert({ ...editingCert, studentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingCert.name}
                    onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editingCert.course}
                  onChange={(e) => setEditingCert({ ...editingCert, course: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={editingCert.duration}
                    onChange={(e) => setEditingCert({ ...editingCert, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade / Standing</label>
                  <input
                    type="text"
                    required
                    value={editingCert.grade}
                    onChange={(e) => setEditingCert({ ...editingCert, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Shift</label>
                  <input
                    type="text"
                    value={editingCert.shift}
                    onChange={(e) => setEditingCert({ ...editingCert, shift: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingCert.status}
                    onChange={(e) => setEditingCert({ ...editingCert, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="Certified & Verified">Certified &amp; Verified</option>
                    <option value="Currently Enrolled (Active ID)">Currently Enrolled (Active ID)</option>
                    <option value="Course Completed (Awaiting Exam)">Course Completed (Awaiting Exam)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Completion / Issue Date</label>
                <input
                  type="text"
                  value={editingCert.completionDate}
                  onChange={(e) => setEditingCert({ ...editingCert, completionDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
