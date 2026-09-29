import { Course, PlacementStory, InstituteNotice } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'adca',
    code: 'ADCA',
    name: 'Advanced Diploma in Computer Application',
    category: 'diploma',
    durationMonths: 12,
    admissionFee: 800,
    monthlyFee: 850,
    totalFee: 11000,
    fullPayDiscountPercent: 15,
    badge: 'Most Comprehensive',
    isPopular: true,
    description: 'Master complete IT, office automation, computer accounting with Tally, desktop graphic designing, and basic web technologies in our 1-year comprehensive diploma.',
    topics: [
      'Operating Systems (Windows 11 & Linux CLI basics)',
      'MS Office 365 Professional (Word, Excel, PowerPoint, Access)',
      'Advanced Excel (VLOOKUP, XLOOKUP, Pivot Tables, Macros & Dashboards)',
      'Nepali & English Fast Touch-Typing (Preeti & Unicode)',
      'Computer Accounting with Tally Prime & ERP 9 with VAT/GST',
      'Desktop Publishing (Adobe Photoshop, CorelDRAW, InDesign)',
      'Hardware Maintenance, Troubleshooting & Windows Installation',
      'HTML5, CSS3 & Responsive Web Design Fundamentals',
      'Internet, Cyber Security & Government Lok Sewa Portal Navigation'
    ],
    shifts: ['Morning: 7:00 AM - 8:30 AM', 'Day: 11:30 AM - 1:00 PM', 'Evening: 4:30 PM - 6:00 PM'],
    careerProspects: ['IT Assistant', 'Computer Operator', 'Accounts Officer', 'Graphic Designer', 'Government Office Executive'],
    certificateType: 'Govt. & ISO Certified Comprehensive 1-Year Diploma'
  },
  {
    id: 'dca',
    code: 'DCA',
    name: 'Diploma in Computer Application',
    category: 'diploma',
    durationMonths: 6,
    admissionFee: 800,
    monthlyFee: 825,
    totalFee: 5750,
    fullPayDiscountPercent: 10,
    badge: 'Popular for Lok Sewa',
    isPopular: true,
    description: 'The standard 6-month foundational computer diploma recognized across Nepal for government Lok Sewa Aayog examinations, banking, and private firms.',
    topics: [
      'Computer Architecture, Peripherals & Operating System',
      'Word Processing with Microsoft Word (Formulas, Tables, Mail Merge)',
      'Electronic Spreadsheets with Microsoft Excel (Formulas, Charts, Data Sorting)',
      'Presentation Graphics with Microsoft PowerPoint',
      'Nepali & English Touch Typing (30+ WPM target)',
      'Email Etiquette, Cloud Storage & Online Office Tools',
      'Digital Safety, Data Backup & Antivirus Management'
    ],
    shifts: ['Morning: 8:30 AM - 10:00 AM', 'Day: 1:00 PM - 2:30 PM', 'Evening: 3:00 PM - 4:30 PM'],
    careerProspects: ['Computer Operator', 'Data Entry Executive', 'Front Desk Officer', 'School/College Administrator'],
    certificateType: 'Recognized 6-Month Diploma Certificate'
  },
  {
    id: 'ccc',
    code: 'CCC',
    name: 'Course on Computer Concepts',
    category: 'foundation',
    durationMonths: 3,
    admissionFee: 800,
    monthlyFee: 800,
    totalFee: 3200,
    fullPayDiscountPercent: 10,
    badge: 'Quick Certification',
    description: 'An intensive 3-month foundational course designed to impart basic level digital literacy to students, shopkeepers, and job seekers.',
    topics: [
      'Introduction to Computer & Graphical User Interface (GUI)',
      'Elements of Word Processing & Document Preparation',
      'Making Small Spreadsheets & Formula Calculations',
      'Creating Presentations for Business & College',
      'Introduction to Internet, WWW and Web Browsers',
      'Digital Financial Services (eSewa, Khalti, Mobile Banking, ConnectIPS)'
    ],
    shifts: ['Morning: 6:30 AM - 7:30 AM', 'Day: 10:00 AM - 11:00 AM', 'Evening: 5:00 PM - 6:00 PM'],
    careerProspects: ['Office Assistant', 'Shop Billing Attendant', 'Cyber Cafe Manager'],
    certificateType: 'Basic Digital Literacy Certification'
  },
  {
    id: 'cca',
    code: 'CCA',
    name: 'Certificate in Computer Accounting',
    category: 'accounting',
    durationMonths: 5,
    admissionFee: 800,
    monthlyFee: 900,
    totalFee: 5300,
    fullPayDiscountPercent: 12,
    badge: 'Job Oriented',
    isPopular: true,
    description: 'Specialized 5-month vocational training designed for accounting careers in commercial banks, cooperatives, trading firms, and construction businesses.',
    topics: [
      'Accounting Principles, Journal Entries, Ledgers & Trial Balance',
      'Computerized Accounting in Tally Prime Latest Version',
      'Inventory Management, Multi-Godown & Stock Tracking',
      'Purchase Orders, Sales Invoicing with Nepal VAT / PAN Rules',
      'Bank Reconciliation Statement (BRS) & Cash Flow Analysis',
      'Payroll Management, TDS Deductions & Employee Records',
      'Balance Sheet, Profit & Loss Finalization & Audit Prep'
    ],
    shifts: ['Morning: 7:00 AM - 8:30 AM', 'Day: 2:00 PM - 3:30 PM', 'Evening: 5:00 PM - 6:30 PM'],
    careerProspects: ['Assistant Accountant', 'Billing In-Charge', 'Cooperative Cashier', 'Inventory Controller'],
    certificateType: 'Professional Computer Accounting Certificate'
  },
  {
    id: 'cfa',
    code: 'CFA',
    name: 'Computer Financial Accounting',
    category: 'accounting',
    durationMonths: 3,
    admissionFee: 800,
    monthlyFee: 850,
    totalFee: 3350,
    fullPayDiscountPercent: 10,
    badge: 'Express Accounting',
    description: 'Fast-track 3-month accounting curriculum for commerce students, retail business owners, and entry-level accounts clerks.',
    topics: [
      'Double Entry System Fundamentals & Chart of Accounts',
      'Tally ERP 9 and Tally Prime Essentials',
      'Voucher Entries: Payment, Receipt, Contra, Journal & Sales',
      'Generating Day Books, Ledger Books & Trial Balances',
      'Basics of Nepal Tax Structure and Bill Printing'
    ],
    shifts: ['Morning: 9:00 AM - 10:00 AM', 'Evening: 4:00 PM - 5:00 PM'],
    careerProspects: ['Junior Accountant', 'Retail Store Cashier', 'Billing Clerk'],
    certificateType: 'Financial Accounting Practitioner Certificate'
  },
  {
    id: 'dtp',
    code: 'DTP',
    name: 'Diploma in Desktop Publishing & Graphics',
    category: 'diploma',
    durationMonths: 5,
    admissionFee: 800,
    monthlyFee: 850,
    totalFee: 5050,
    fullPayDiscountPercent: 10,
    badge: 'Creative Career',
    isPopular: true,
    description: 'Hands-on graphic design training for flex printing, visiting cards, ID cards, book publications, photo retouching, and social media creative advertising.',
    topics: [
      'Adobe Photoshop (Photo Editing, Retouching, Layers & Effects)',
      'CorelDRAW (Vector Logos, Flex Banners, Visiting Cards, Stamps)',
      'Adobe InDesign (Book Typesetting, Magazines & Brochures)',
      'Nepali Calligraphy, Unicode & Preeti Typography in Design',
      'Print Production, Color Separation (CMYK vs RGB) & Plotter Cutting',
      'Digital Marketing Creatives for Facebook & WhatsApp'
    ],
    shifts: ['Morning: 10:00 AM - 11:30 AM', 'Day: 1:30 PM - 3:00 PM', 'Evening: 5:30 PM - 7:00 PM'],
    careerProspects: ['Graphic Designer', 'Flex Printing Specialist', 'Photo Studio Editor', 'Press Layout Designer'],
    certificateType: 'Certified Desktop Publishing Diploma'
  },
  {
    id: 'tally',
    code: 'TALLY',
    name: 'Tally Prime & ERP 9 with Nepal VAT/GST',
    category: 'accounting',
    durationMonths: 3,
    admissionFee: 800,
    monthlyFee: 900,
    totalFee: 3500,
    fullPayDiscountPercent: 10,
    badge: 'Industry Essential',
    isPopular: true,
    description: 'Practical, real-world case study based training on the most widely used accounting software across Nepal, India, and the Gulf.',
    topics: [
      'Company Creation, Security Control & User Roles',
      'Ledger Grouping & Hierarchy Configuration',
      'Inventory with Batch-wise Details & Expiry Dates',
      'Value Added Tax (VAT), Purchase Sales Registers & IRD Compliance',
      'E-Way Bill, TDS Reporting & Cost Centers',
      'Year-End Financial Year Closing & Data Backup'
    ],
    shifts: ['Morning: 6:30 AM - 8:00 AM', 'Day: 11:00 AM - 12:30 PM', 'Evening: 6:00 PM - 7:30 PM'],
    careerProspects: ['Tally Operator', 'Store Accountant', 'Billing Manager', 'Audit Assistant'],
    certificateType: 'Tally Prime Professional Proficiency Certificate'
  },
  {
    id: 'libre',
    code: 'LIBRE',
    name: 'LibreOffice Suite & Open Source Office',
    category: 'office',
    durationMonths: 5,
    admissionFee: 800,
    monthlyFee: 800,
    totalFee: 4800,
    fullPayDiscountPercent: 10,
    badge: 'Open Source',
    description: 'Complete training in LibreOffice Writer, Calc, Impress, and Base, perfect for government offices and organizations transitioning to open-source software.',
    topics: [
      'LibreOffice Writer for Government & Academic Documentation',
      'LibreOffice Calc for Data Sheets, Statistical Formulas & Plots',
      'LibreOffice Impress for Interactive Presentations',
      'LibreOffice Base for Relational Database Management',
      'File Export, PDF Form Generation & Cross-Platform Compatibility'
    ],
    shifts: ['Day: 12:30 PM - 2:00 PM', 'Evening: 3:30 PM - 5:00 PM'],
    careerProspects: ['Government Data Assistant', 'NGO Documentation Officer', 'Linux Office Operator'],
    certificateType: 'LibreOffice Suite Certified Specialist'
  },
  {
    id: 'spoken-english',
    code: 'ENG-PRO',
    name: 'Spoken English & Professional Personality',
    category: 'language',
    durationMonths: 3,
    admissionFee: 600,
    monthlyFee: 800,
    totalFee: 3000,
    fullPayDiscountPercent: 10,
    badge: 'Communication',
    description: 'Build unshakeable confidence in conversational English, interview mastery, workplace communication, and email drafting.',
    topics: [
      'Daily Conversational Fluency & Pronunciation Drills',
      'Grammar Made Practical: Tenses, Prepositions & Active Usage',
      'Job Interview Question & Answer Simulations',
      'Public Speaking, Extempore & Group Discussion',
      'Professional Email Etiquette, Resume & Cover Letter Writing'
    ],
    shifts: ['Morning: 6:30 AM - 7:30 AM', 'Evening: 5:00 PM - 6:00 PM'],
    careerProspects: ['Customer Support Specialist', 'Receptionist', 'Travel Coordinator', 'Sales Executive'],
    certificateType: 'Certificate in Professional English Fluency'
  },
  {
    id: 'spoken-arabic',
    code: 'ARB-GULF',
    name: 'Spoken Arabic & Gulf Job Preparation',
    category: 'language',
    durationMonths: 3,
    admissionFee: 800,
    monthlyFee: 950,
    totalFee: 3650,
    fullPayDiscountPercent: 10,
    badge: 'Foreign Employment',
    description: 'Practical Arabic conversational language course specifically structured for youth planning to work in Saudi Arabia, UAE, Qatar, and Kuwait.',
    topics: [
      'Arabic Alphabet, Phonetics & Essential Daily Expressions',
      'Airport, Immigration, Transport & Housing Vocabulary',
      'Workplace Dialogue (Stores, Supermarkets, Construction, Hospitals)',
      'Numbers, Money, Bargaining & Time Calculations in Arabic',
      'Gulf Cultural Norms, Workplace Safety Guidelines & Legal Basics'
    ],
    shifts: ['Morning: 7:30 AM - 8:30 AM', 'Evening: 6:00 PM - 7:00 PM'],
    careerProspects: ['Gulf Retail Associate', 'Hospitality Staff', 'Warehouse Supervisor', 'Driver / Logistics'],
    certificateType: 'Spoken Arabic Communication Certificate'
  }
];

export const INITIAL_PLACEMENTS: PlacementStory[] = [
  {
    id: 'place-1',
    studentName: 'Ramesh Kumar Yadav',
    courseTaken: 'ADCA (12 Months)',
    completionYear: 2024,
    role: 'Assistant Accounts Officer',
    company: 'Global IME Bank Ltd., Chakarchauda Branch',
    salaryMonthly: 'NPR 38,500 / month',
    location: 'Chakarchauda, Nepal',
    quote: 'The 1-on-1 practical lab time and Tally Prime with VAT training at Nedian Connect gave me the edge during my interview. I received my appointment letter just 2 weeks after course completion.',
    verified: true,
    avatarSeed: 'ramesh'
  },
  {
    id: 'place-2',
    studentName: 'Sunita Kumari Sah',
    courseTaken: 'DCA (6 Months) + Fast Typing',
    completionYear: 2025,
    role: 'Computer Operator',
    company: 'District Administration Office (Lok Sewa)',
    salaryMonthly: 'NPR 32,500 / month',
    location: 'Madhesh Province, Nepal',
    quote: 'The typing speed drills in Nepali Unicode and Preeti at Nedian Connect were crucial for passing my government Lok Sewa practical typing test on the very first attempt.',
    verified: true,
    avatarSeed: 'sunita'
  },
  {
    id: 'place-3',
    studentName: 'Mohammad Irfan Ansari',
    courseTaken: 'Tally Prime & ERP 9 with GST',
    completionYear: 2025,
    role: 'Chief Accountant',
    company: 'Al-Madina Agro Trading & Logistics',
    salaryMonthly: 'NPR 44,000 / month',
    location: 'Birgunj / Chakarchauda corridor',
    quote: 'The institute taught us real inventory and billing vouchers rather than just textbook theory. Now I handle company billing of over 20 Lakhs every week with complete confidence.',
    verified: true,
    avatarSeed: 'irfan'
  },
  {
    id: 'place-4',
    studentName: 'Pratima Chaudhary',
    courseTaken: 'DTP (Desktop Publishing & Graphics)',
    completionYear: 2024,
    role: 'Senior Graphic Designer',
    company: 'Mithila Media & Flex Offset Press',
    salaryMonthly: 'NPR 34,000 / month',
    location: 'Janakpurdham, Nepal',
    quote: 'From designing wedding cards to massive hoarding boards in Photoshop and CorelDRAW, Nedian Connect teachers spent hours reviewing my designs until they met printing press standards.',
    verified: true,
    avatarSeed: 'pratima'
  },
  {
    id: 'place-5',
    studentName: 'Bikash Kumar Shrestha',
    courseTaken: 'ADCA (12 Months)',
    completionYear: 2024,
    role: 'IT Support & CBS Operator',
    company: 'Shree Sumeru Multipurpose Cooperative',
    salaryMonthly: 'NPR 36,000 / month',
    location: 'Chakarchauda, Nepal',
    quote: 'Learning hardware troubleshooting along with software saved our branch during network outages. Nedian Connect is truly the best institute in our area.',
    verified: true,
    avatarSeed: 'bikash'
  },
  {
    id: 'place-6',
    studentName: 'Fatima Khatun',
    courseTaken: 'CCA (Computer Accounting)',
    completionYear: 2025,
    role: 'Billing & Front Desk Officer',
    company: 'Chakarchauda Community Health Center',
    salaryMonthly: 'NPR 29,500 / month',
    location: 'Chakarchauda, Nepal',
    quote: 'Coming from a non-tech background, the patient instructors taught me step-by-step. The free institute bag and ID card on my first day made me feel like a valued scholar.',
    verified: true,
    avatarSeed: 'fatima'
  }
];

export const INITIAL_NOTICES: InstituteNotice[] = [
  {
    id: 'notice-1',
    title: 'Admissions Open 2026–2027 Academic Session',
    content: 'Enrollments are now live for Morning, Day, and Evening batches for ADCA, DCA, Tally Prime, and Spoken Languages. Every new student receives an official Institute Bag and Smart ID Card upon registration.',
    date: 'March 2026',
    isUrgent: true,
    isActive: true
  },
  {
    id: 'notice-2',
    title: 'Free Sunday Career Counseling & Practical Demo Lab',
    content: 'Join our free 2-hour practical demo class every Sunday at 10:00 AM. Experience our 1:1 computer workstation lab and get personalized guidance on which course aligns with your career goals.',
    date: 'Weekly',
    isUrgent: false,
    isActive: true
  },
  {
    id: 'notice-3',
    title: 'Special 15% Full-Payment Concession',
    content: 'Students opting to clear their full course fee in a single upfront payment are eligible for up to 15% discount on total fees across 1-year and 6-month diploma programs.',
    date: 'Ongoing Offer',
    isUrgent: false,
    isActive: true
  }
];

export const INITIAL_INQUIRIES: any[] = [
  {
    id: 'inq-1',
    fullName: 'Anil Kumar Mandal',
    phone: '9812345678',
    whatsapp: '9812345678',
    courseId: 'adca',
    preferredShift: 'Morning (6:30 AM - 9:30 AM)',
    educationLevel: '10+2 / Intermediate Passed',
    address: 'Chakarchauda Ward 3',
    message: 'Interested in Lok Sewa preparation and banking software training.',
    status: 'contacted',
    createdAt: '2026-03-24'
  },
  {
    id: 'inq-2',
    fullName: 'Pooja Kumari Das',
    phone: '9808765432',
    whatsapp: '9808765432',
    courseId: 'cca',
    preferredShift: 'Day (10:00 AM - 2:00 PM)',
    educationLevel: 'BBS Running',
    address: 'Near Central Chowk, Chakarchauda',
    message: 'Want to learn Tally Prime with VAT for cooperative job vacancies.',
    status: 'new',
    createdAt: '2026-03-27'
  }
];

export const INITIAL_CERTIFICATES = [
  {
    id: 'cert-1',
    studentId: 'NED-2026-101',
    name: 'Binod Kumar Chaudhary',
    course: 'ADCA (Advanced Diploma in Computer Applications)',
    duration: '12 Months',
    completionDate: 'March 2026',
    grade: 'Distinction (A+)',
    shift: 'Morning (6:30 AM)',
    location: 'Chakarchauda Central Campus',
    status: 'Certified & Verified',
    issueDate: '2026-03-15',
  },
  {
    id: 'cert-2',
    studentId: 'NED-2026-102',
    name: 'Sunita Sharma',
    course: 'Tally Prime with GST & VAT',
    duration: '3 Months',
    completionDate: 'February 2026',
    grade: 'A Grade',
    shift: 'Day (10:00 AM)',
    location: 'Chakarchauda Central Campus',
    status: 'Certified & Verified',
    issueDate: '2026-02-28',
  },
  {
    id: 'cert-3',
    studentId: 'NED-2026-103',
    name: 'Deepak Thapa',
    course: 'Diploma in Computer Application (DCA)',
    duration: '6 Months',
    completionDate: 'Active Student',
    grade: 'Ongoing',
    shift: 'Evening (3:00 PM)',
    location: 'Chakarchauda Central Campus',
    status: 'Currently Enrolled (Active ID)',
    issueDate: '2026-01-10',
  },
];

