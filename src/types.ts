export interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'admin';
  applicationId: string;
  avatar: string;
  phone?: string;
  createdAt: string;
}

export interface PersonalDetails {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  gender?: string;
  category?: string;
  bloodGroup?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface AcademicDetails {
  previousInstitution: string;
  yearOfPassing: string;
  percentageCgpa: string;
  boardUniversity?: string;
  stream?: string;
  rollNumber?: string;
  entranceExam?: string;
  entranceScore?: string;
  entranceRank?: string;
}

export interface CourseSelection {
  primaryCourse: string;
  secondaryCourse?: string;
  campusPreference?: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'under_review'
  | 'docs_verified'
  | 'merit_qualified'
  | 'seat_allotted'
  | 'rejected';

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  currentStep: 1 | 2 | 3 | 4;
  personal: PersonalDetails;
  academic: AcademicDetails;
  course: CourseSelection;
  submittedAt: string | null;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  applicationId: string;
  type: 'id_proof' | 'marksheet_12th' | 'photo' | 'marksheet_10th' | 'entrance_scorecard';
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  status: 'uploaded' | 'verified' | 'rejected' | 'pending';
  uploadedAt: string;
  verifiedAt?: string;
  remarks?: string;
}

export interface PaymentRecord {
  id: string;
  applicationId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  method?: 'card' | 'upi' | 'netbanking' | string;
  paymentMethod?: 'card' | 'upi' | 'netbanking' | string;
  paidAt: string;
  invoiceNumber: string;
  details?: {
    cardLast4?: string;
    upiId?: string;
    bankName?: string;
  };
}

export interface MeritItem {
  id: string;
  rank: number;
  applicationId: string;
  candidateName: string;
  category: string;
  meritScore: number;
  course: string;
  allottedSeat: string | null;
  status: 'Allotted' | 'Waiting List' | 'Confirmed' | 'Review';
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'payment' | 'document' | 'status' | 'announcement' | string;
  createdAt?: string;
  timestamp?: string;
  read: boolean;
  timeAgo?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}

export interface DatabaseStats {
  totalUsers: number;
  totalApplications: number;
  totalDocuments: number;
  totalPayments: number;
  meritListCount: number;
  verifiedDocsCount: number;
  totalRevenue: number;
}

export interface DatabaseSummary {
  databaseFile: string;
  fileSizeBytes: number;
  lastModified: string;
  counts: {
    users: number;
    applications: number;
    documents: number;
    payments: number;
    meritList: number;
    notifications: number;
    auditLogs: number;
  };
}
