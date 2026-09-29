import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Phone, CheckCircle, Sparkles, Gift } from 'lucide-react';
import { Course, StudentInquiry } from '../types';
import { useTheme } from '../context/ThemeContext';

interface InquirySectionProps {
  courses: Course[];
  preselectedCourseCode?: string;
  onInquirySubmitted: (inquiry: StudentInquiry) => void;
}

export const InquirySection: React.FC<InquirySectionProps> = ({
  courses,
  preselectedCourseCode,
  onInquirySubmitted,
}) => {
  const { config } = useTheme();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [courseCode, setCourseCode] = useState(preselectedCourseCode || 'ADCA');
  const [preferredShift, setPreferredShift] = useState<'Morning (6:30 AM - 9:30 AM)' | 'Day (10:00 AM - 2:00 PM)' | 'Evening (3:00 PM - 7:00 PM)'>('Morning (6:30 AM - 9:30 AM)');
  const [educationLevel, setEducationLevel] = useState('SEE / 10th Passed');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (preselectedCourseCode) {
      setCourseCode(preselectedCourseCode);
    }
  }, [preselectedCourseCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setValidationError('Please enter a valid phone number (at least 8-10 digits).');
      return;
    }

    const selectedCourseObj = courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());

    const newInquiry: StudentInquiry = {
      id: 'inq-' + Date.now(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      courseId: selectedCourseObj?.id || courseCode,
      preferredShift,
      educationLevel,
      address: address.trim() || 'Chakarchauda area',
      message: message.trim(),
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onInquirySubmitted(newInquiry);
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const selectedCourseObj = courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());
    const courseTitle = selectedCourseObj ? `${selectedCourseObj.name} (${selectedCourseObj.code})` : courseCode;
    
    const text = encodeURIComponent(
      `Hello NEDIAN CONNECT INSTITUTE,\nI would like to apply for admission:\n- Name: ${fullName || 'Interested Student'}\n- Phone: ${phone || 'Not provided'}\n- Course: ${courseTitle}\n- Shift: ${preferredShift}\n- Education: ${educationLevel}\n- Address: ${address || 'Chakarchauda'}\n${message ? `- Note: ${message}` : ''}`
    );
    window.open(`https://wa.me/9779705508838?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Institute Contact Info & Assurance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                Official Admissions Desk
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight" style={{ textWrap: 'balance' }}>
                Join Nedian Connect Institute Today
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take the first step toward career-ready computer skills. Fill in the enrollment application or contact our desk directly via call or WhatsApp.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Direct Telephone</h4>
                  <a
                    href="tel:+9779705508838"
                    className="text-sky-700 font-mono font-bold hover:underline"
                  >
                    +977 9705508838
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Direct line to Campus Director</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950">Official WhatsApp</h4>
                  <a
                    href="https://wa.me/9779705508838"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-800 font-mono font-bold hover:underline"
                  >
                    +977 9705508838
                  </a>
                  <p className="text-xs text-emerald-700 mt-0.5">Quick inquiries &amp; syllabus PDFs</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">Institute Campus Address</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  NEDIAN CONNECT INSTITUTE PVT. LTD.<br />
                  Mayadevi R.M. - 4, Kapilvastu (Chakarchauda Bazar), Nepal<br />
                  <span className="font-semibold text-rose-700">AI, Skills, Media Division</span>
                </p>
                <div className="pt-2 text-xs text-slate-500 font-medium">
                  Class Hours: Sunday – Friday (6:30 AM – 7:00 PM)
                </div>
              </div>
            </div>

            {/* Free Gift Reminder */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-emerald-200 flex items-center gap-3">
              <Gift className="w-8 h-8 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Complimentary Student Kit</span>
                <span className="text-slate-600">
                  Get your official institute backpack &amp; ID card on your first day of class!
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Admission Application Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">
                  Admission Inquiry Submitted!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-slate-900">{fullName}</span>. Our admissions counselor will contact you at <span className="font-mono font-bold text-slate-900">{phone}</span> to confirm your batch shift and registration.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Details to WhatsApp Now</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFullName('');
                      setPhone('');
                      setWhatsapp('');
                      setMessage('');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    Online Admission &amp; Course Application
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reserve your dedicated computer workstation in the upcoming 2026–2027 batch.
                  </p>
                </div>

                {validationError && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                    {validationError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Student Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar Yadav"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9801234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9801234567"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    />
                  </div>

                  {/* Course Selected */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Select Course Program <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer font-medium"
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.code}>
                          {course.code} – {course.name} ({course.durationMonths} Mos)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Shift */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Preferred Batch Shift
                    </label>
                    <select
                      value={preferredShift}
                      onChange={(e) => setPreferredShift(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
                    >
                      <option value="Morning (6:30 AM - 9:30 AM)">Morning (6:30 AM - 9:30 AM)</option>
                      <option value="Day (10:00 AM - 2:00 PM)">Day (10:00 AM - 2:00 PM)</option>
                      <option value="Evening (3:00 PM - 7:00 PM)">Evening (3:00 PM - 7:00 PM)</option>
                    </select>
                  </div>

                  {/* Education level */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Educational Qualification
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
                    >
                      <option value="Under SEE / Class 8-9">Under SEE / Class 8-9</option>
                      <option value="SEE / 10th Passed">SEE / 10th Passed</option>
                      <option value="+2 / Intermediate (Running/Passed)">+2 / Intermediate (Running/Passed)</option>
                      <option value="Bachelor Degree (Running/Passed)">Bachelor Degree (Running/Passed)</option>
                      <option value="Working Professional / Business Owner">Working Professional / Business Owner</option>
                    </select>
                  </div>
                </div>

                {/* Village / Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Location / Village / Ward
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chakarchauda Ward 2, Near Hospital Chowk"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  />
                </div>

                {/* Optional Message */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Questions or Specific Goals (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Preparing for Lok Sewa computer operator exam, need fast typing practice."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className={`w-full sm:flex-1 py-3 px-5 text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${config.btnPrimary}`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Online Application</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto py-3 px-5 text-sm font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <span>Apply via WhatsApp</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 text-center pt-1">
                  * By submitting, you reserve your seat. All admissions include free bag &amp; ID card.
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
