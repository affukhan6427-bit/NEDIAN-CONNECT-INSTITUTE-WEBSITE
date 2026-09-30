import React, { useState, useEffect } from 'react';
import { 
  INITIAL_COURSES, 
  INITIAL_PLACEMENTS, 
  INITIAL_NOTICES, 
  INITIAL_INQUIRIES,
  DEFAULT_INSTITUTE_INFO
} from './data/instituteData';
import { Course, PlacementStory, InstituteNotice, StudentInquiry, InstituteInfo } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeeAndCoursesSection } from './components/FeeAndCoursesSection';
import { PlacementSection } from './components/PlacementSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { InquirySection } from './components/InquirySection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';
import { VerifyCertificateModal } from './components/VerifyCertificateModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  // Institute Info state with local persistence
  const [instituteInfo, setInstituteInfo] = useState<InstituteInfo>(() => {
    const saved = localStorage.getItem('nedian_institute_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing instituteInfo from localStorage', e);
      }
    }
    return DEFAULT_INSTITUTE_INFO;
  });

  // Courses state with local persistence
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('nedian_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing courses from localStorage', e);
      }
    }
    return INITIAL_COURSES;
  });

  // Placements state with local persistence
  const [placements, setPlacements] = useState<PlacementStory[]>(() => {
    const saved = localStorage.getItem('nedian_placements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing placements from localStorage', e);
      }
    }
    return INITIAL_PLACEMENTS;
  });

  // Notices state with local persistence
  const [notices, setNotices] = useState<InstituteNotice[]>(() => {
    const saved = localStorage.getItem('nedian_notices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing notices from localStorage', e);
      }
    }
    return INITIAL_NOTICES;
  });

  // Inquiries / Leads state with local persistence
  const [inquiries, setInquiries] = useState<StudentInquiry[]>(() => {
    const saved = localStorage.getItem('nedian_inquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing inquiries from localStorage', e);
      }
    }
    return INITIAL_INQUIRIES;
  });

  // Admin, Verify & Drive Modal states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [selectedCourseForInquiry, setSelectedCourseForInquiry] = useState<string>('ADCA');

  // Persistence effects
  const handleUpdateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem('nedian_courses', JSON.stringify(newCourses));
  };

  const handleUpdatePlacements = (newPlacements: PlacementStory[]) => {
    setPlacements(newPlacements);
    localStorage.setItem('nedian_placements', JSON.stringify(newPlacements));
  };

  const handleUpdateNotices = (newNotices: InstituteNotice[]) => {
    setNotices(newNotices);
    localStorage.setItem('nedian_notices', JSON.stringify(newNotices));
  };

  const handleUpdateInquiries = (newInquiries: StudentInquiry[]) => {
    setInquiries(newInquiries);
    localStorage.setItem('nedian_inquiries', JSON.stringify(newInquiries));
  };

  const handleUpdateInstituteInfo = (newInfo: InstituteInfo) => {
    setInstituteInfo(newInfo);
    localStorage.setItem('nedian_institute_info', JSON.stringify(newInfo));
  };

  const handleNewInquirySubmitted = (newInquiry: StudentInquiry) => {
    const updated = [newInquiry, ...inquiries];
    handleUpdateInquiries(updated);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenInquiryWithCourse = (courseCode?: string) => {
    if (courseCode) {
      setSelectedCourseForInquiry(courseCode);
    }
    scrollToSection('contact');
  };

  // Secret Admin Access Triggers: Keyboard shortcut (Ctrl+Shift+A) & URL Hash (#admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination: Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    const checkHashTrigger = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#portal') {
        setIsAdminOpen(true);
      }
    };

    checkHashTrigger();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkHashTrigger);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHashTrigger);
    };
  }, []);

  // Find active urgent notice for the top ribbon
  const activeNotice = notices.find((n) => n.isActive);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white transition-colors duration-300">
        {/* Official Top Navigation Bar */}
        <Navbar
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenInquiry={handleOpenInquiryWithCourse}
          onOpenVerify={() => setIsVerifyOpen(true)}
          onOpenDrive={() => setIsDriveOpen(true)}
          urgentNotice={activeNotice ? `${activeNotice.title}: ${activeNotice.content}` : undefined}
          instituteInfo={instituteInfo}
        />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection
            onExploreCourses={() => scrollToSection('courses')}
            onOpenInquiry={() => scrollToSection('contact')}
            instituteInfo={instituteInfo}
          />

          {/* Exact Fee Chart & Courses Catalog with Interactive Fee Calculator & Modal */}
          <FeeAndCoursesSection
            courses={courses}
            onApplyForCourse={handleOpenInquiryWithCourse}
          />

          {/* Verified Placement Success Stories */}
          <PlacementSection stories={placements} />

          {/* Why Choose Us & Lab Facilities */}
          <WhyChooseUs instituteInfo={instituteInfo} />

          {/* Student Online Admission Inquiry Form */}
          <InquirySection
            courses={courses}
            preselectedCourseCode={selectedCourseForInquiry}
            onInquirySubmitted={handleNewInquirySubmitted}
            instituteInfo={instituteInfo}
          />

          {/* Frequently Asked Questions */}
          <FaqSection instituteInfo={instituteInfo} />
        </main>

        {/* Footer & Floating Quick Action Access */}
        <Footer
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenInquiry={handleOpenInquiryWithCourse}
          instituteInfo={instituteInfo}
        />

        {/* PIN-Protected Administrative Management Portal */}
        <AdminPortal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          courses={courses}
          onUpdateCourses={handleUpdateCourses}
          placements={placements}
          onUpdatePlacements={handleUpdatePlacements}
          notices={notices}
          onUpdateNotices={handleUpdateNotices}
          inquiries={inquiries}
          onUpdateInquiries={handleUpdateInquiries}
          instituteInfo={instituteInfo}
          onUpdateInstituteInfo={handleUpdateInstituteInfo}
        />

        {/* Student ID & Certificate Verification Portal */}
        <VerifyCertificateModal
          isOpen={isVerifyOpen}
          onClose={() => setIsVerifyOpen(false)}
        />

        {/* Google Drive Workspace File Hub */}
        <GoogleDriveModal
          isOpen={isDriveOpen}
          onClose={() => setIsDriveOpen(false)}
          instituteBackupData={{
            courses,
            inquiries,
            placements,
            notices,
          }}
        />
      </div>
    </ThemeProvider>
  );
}
