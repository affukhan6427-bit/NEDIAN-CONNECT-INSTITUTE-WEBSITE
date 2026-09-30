export type CourseCategory = 'all' | 'diploma' | 'accounting' | 'office' | 'language' | 'foundation';

export interface Course {
  id: string;
  code: string;
  name: string;
  category: CourseCategory;
  durationMonths: number;
  admissionFee: number;
  monthlyFee: number;
  totalFee: number;
  fullPayDiscountPercent: number;
  badge?: string;
  description: string;
  topics: string[];
  shifts: string[];
  careerProspects: string[];
  certificateType: string;
  isPopular?: boolean;
}

export interface PlacementStory {
  id: string;
  studentName: string;
  courseTaken: string;
  completionYear: number;
  role: string;
  company: string;
  salaryMonthly: string;
  location: string;
  quote: string;
  verified: boolean;
  avatarSeed: string;
}

export interface StudentInquiry {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  courseId: string;
  preferredShift: 'Morning (6:30 AM - 9:30 AM)' | 'Day (10:00 AM - 2:00 PM)' | 'Evening (3:00 PM - 7:00 PM)';
  educationLevel: string;
  address: string;
  message?: string;
  status: 'new' | 'contacted' | 'enrolled';
  createdAt: string;
}

export interface InstituteNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  isUrgent: boolean;
  isActive: boolean;
}

export interface StudentCertificateRecord {
  id: string;
  studentId: string;
  name: string;
  course: string;
  duration: string;
  completionDate: string;
  grade: string;
  shift: string;
  location: string;
  status: string;
  issueDate: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface InstituteInfo {
  name: string;
  tagline: string;
  division: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingDays: string;
  sundayNotice: string;
  directorName: string;
  registeredNotice: string;

  // Hero Section Customization
  heroHeadline?: string;
  heroHighlightWord?: string;
  heroDescription?: string;
  heroKicker?: string;
  heroSubKicker?: string;

  // Institute Stats
  studentsTrainedCount?: number;
  batchesCompletedCount?: number;
  workstationsCount?: number;
  hiringPartnersCount?: number;

  // Shifts
  morningShift?: string;
  dayShift?: string;
  eveningShift?: string;
}

