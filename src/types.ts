export type UserRole = 'student' | 'admin' | 'candidate';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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

export interface Class10Details {
  schoolName: string;
  board: 'CBSE' | 'ICSE' | 'WBCHSE' | 'Other' | string;
  yearOfPassing: string;
  fullMarks: number | string;
  marksObtained: number | string;
  percentage: number | string;
}

export interface Class12Details {
  schoolName: string;
  board: 'CBSE' | 'ISC' | 'WBCHSE' | 'Other' | string;
  yearOfPassing: string;
  stream: 'Science' | 'Commerce' | 'Arts' | 'Other' | string;
  fullMarks: number | string;
  marksObtained: number | string;
  percentage: number | string;
}

export interface ExamEntry {
  appeared: boolean;
  percentile?: string;
  rank?: string;
}

export interface EntranceExamDetails {
  jeeMain: ExamEntry;
  wbjee: ExamEntry;
  iemjee: ExamEntry;
}

export interface CoursePreferences {
  preference_1: string;
  preference_2: string;
  preference_3: string;
}

export interface AcademicDetails {
  previousInstitution?: string;
  yearOfPassing?: string;
  percentageCgpa?: string;
  boardUniversity?: string;
  stream?: string;
  rollNumber?: string;
  entranceExam?: string;
  entranceScore?: string;
  entranceRank?: string;
  class10?: Class10Details;
  class12?: Class12Details;
  entranceExams?: EntranceExamDetails;
}

export interface CourseSelection {
  primaryCourse: string;
  secondaryCourse?: string;
  campusPreference?: string;
  preferences?: CoursePreferences;
  preference_1?: string;
  preference_2?: string;
  preference_3?: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'correction_required'
  | 'resubmitted'
  | 'approved'
  | 'rejected'
  | 'seat_allotted'
  | 'admission_confirmed'
  | 'docs_verified'
  | 'merit_qualified';

export interface Application {
  id: string;
  userId: string;
  studentId?: string;
  applicationNumber?: string;
  status: ApplicationStatus;
  currentStep: 1 | 2 | 3 | 4;
  personal: PersonalDetails;
  academic: AcademicDetails;
  class10?: Class10Details;
  class12?: Class12Details;
  entranceExams?: EntranceExamDetails;
  course: CourseSelection;
  preferences?: CoursePreferences;
  adminRemarks?: string;
  submittedAt: string | null;
  updatedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type DocumentType = 
  | 'marksheet_10th'
  | 'marksheet_12th'
  | 'id_proof'
  | 'photo'
  | 'signature'
  | 'entrance_scorecard'
  | 'other';

export type DocumentStatus = 'pending' | 'approved' | 'correction_required' | 'rejected' | 'uploaded' | 'verified';

export interface DocumentItem {
  id: string;
  applicationId: string;
  type: DocumentType | string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  filePath?: string;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  remarks?: string;
  adminRemarks?: string;
  previousRemarks?: string;
}

export interface PaymentRecord {
  id: string;
  applicationId: string;
  studentId?: string;
  transactionId: string;
  transactionReference?: string;
  amount: number;
  currency: string;
  status: 'paid' | 'success' | 'pending' | 'failed';
  paymentStatus?: 'paid' | 'pending' | 'failed';
  method?: string;
  paymentMethod?: string;
  paidAt: string;
  paymentDate?: string;
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
  status: 'Allotted' | 'Waiting List' | 'Confirmed' | 'Review' | 'Pending';
}

export interface SeatAllocation {
  id: string;
  applicationId: string;
  studentId: string;
  candidateName?: string;
  course: string;
  department: string;
  campus: string;
  seatNumber: string;
  allocationStatus: 'allotted' | 'confirmed' | 'cancelled';
  allottedAt: string;
  allocatedBy?: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  recipientId?: string;
  title: string;
  message: string;
  type: 'payment' | 'document' | 'status' | 'announcement' | string;
  createdAt?: string;
  timestamp?: string;
  read: boolean;
  isRead?: boolean;
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
  databaseFile?: string;
  fileSizeBytes?: number;
  lastModified?: string;
  totalUsers?: number;
  totalApplications?: number;
  totalDocuments?: number;
  totalPayments?: number;
  meritListCount?: number;
  verifiedDocsCount?: number;
  totalRevenue?: number;
  isSupabaseConfigured?: boolean;
  counts?: {
    users: number;
    applications: number;
    documents: number;
    payments: number;
    meritList: number;
    notifications: number;
    auditLogs: number;
  };
}
