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

