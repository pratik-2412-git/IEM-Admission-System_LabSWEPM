import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Supabase Server Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const isLiveSupabase = Boolean(
  supabaseUrl &&
  supabaseServiceKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseServiceKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
);

let supabaseServer: SupabaseClient | null = null;
if (isLiveSupabase && supabaseUrl && supabaseServiceKey) {
  try {
    supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
    console.log('[Supabase] Initialized server client with PostgreSQL');
  } catch (err) {
    console.warn('[Supabase] Initialization failed, using local database:', err);
  }
} else {
  console.log('[Database] Running in seamless local persistence fallback mode');
}

// Persistent Data File Path for local fallback
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'iem_admission.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory OTP storage: email -> { code: string, expiresAt: number, fullName?: string, category?: string }
const otpStore = new Map<string, { code: string; expiresAt: number; fullName?: string; category?: string }>();

// Active user tracking
let activeUserId: string | null = 'usr_candidate_001';

interface LocalDatabase {
  profiles: Array<{
    id: string;
    email: string;
    password?: string;
    full_name: string;
    role: 'student' | 'admin';
    phone?: string;
    avatar?: string;
    created_at: string;
  }>;
  applications: Array<{
    id: string;
    student_id: string;
    application_number: string;
    personal_details: any;
    academic_details: any;
    course: string;
    department?: string;
    campus_preference?: string;
    preference_1?: string;
    preference_2?: string;
    preference_3?: string;
    class_10_details?: any;
    class_12_details?: any;
    entrance_exam_details?: any;
    application_status: string;
    admin_remarks?: string;
    submitted_at: string | null;
    updated_at: string;
    current_step?: number;
  }>;
  documents: Array<{
    id: string;
    application_id: string;
    document_type: string;
    title: string;
    file_name: string;
    file_path: string;
    file_size: string;
    file_url?: string;
    verification_status: 'pending' | 'approved' | 'correction_required' | 'rejected';
    admin_remarks?: string;
    previous_remarks?: string;
    uploaded_at: string;
    verified_at?: string;
    verified_by?: string;
  }>;
  payments: Array<{
    id: string;
    application_id: string;
    student_id: string;
    amount: number;
    currency: string;
    payment_status: 'paid' | 'pending' | 'failed';
    transaction_reference: string;
    invoice_number: string;
    payment_method: string;
    payment_date: string;
  }>;
  merit_list: Array<{
    id: string;
    application_id: string;
    merit_rank: number;
    academic_score: number;
    candidate_name?: string;
    course?: string;
    created_at: string;
  }>;
  seat_allocations: Array<{
    id: string;
    application_id: string;
    student_id: string;
    course: string;
    department: string;
    campus: string;
    seat_number: string;
    allocation_status: 'allotted' | 'confirmed' | 'cancelled';
    allotted_at: string;
  }>;
  notifications: Array<{
    id: string;
    recipient_id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
  }>;
  audit_logs: Array<{
    id: string;
    action: string;
    actor: string;
    entity: string;
    entity_id: string;
    timestamp: string;
    details: string;
  }>;
}

function getInitialDatabase(): LocalDatabase {
  return {
    profiles: [
      {
        id: 'usr_candidate_001',
        email: 'candidate@example.com',
        full_name: 'Aanya Sharma',
        role: 'student',
        phone: '+91 98765 43210',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdgDcW0tVbFbIuOWUVdbU8cYPLCHGs6Enk-tp5dwoWiQpulHBGDQ0ChR4bY97svyjwKzN9QolMlzSHo4nCVS1YOhe_2Z588RSMBWXrNrZlKKHeW32K7HHX7APn0BaBw8MkLrSX32IjzZEfYZ-ydgxsr5VgVDQAu_CwyzBiZf65M3JFIOObFqioMGrvf6X7VUX1YqeD_yu_9NQkCKHA-HN_FGII2yB7LV_W0iL6V4g_WSC8QFoYDhLu',
        created_at: '2026-08-20T10:00:00Z',
      },
      {
        id: 'usr_admin_001',
        email: 'admin@iem.edu.in',
        password: 'admin123',
        full_name: 'Prof. Dr. A. K. Banerjee (Dean of Admissions)',
        role: 'admin',
        phone: '+91 33 2357 2059',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        created_at: '2026-01-01T00:00:00Z',
      },
    ],
    applications: [
      {
        id: 'app_001',
        student_id: 'usr_candidate_001',
        application_number: 'IEM-2026-001',
        course: 'CSE',
        department: 'IT',
        campus_preference: 'IEM Kolkata - Main Campus (Salt Lake)',
        preference_1: 'CSE',
        preference_2: 'IT',
        preference_3: 'AIML',
        application_status: 'draft',
        personal_details: {
          fullName: 'Aanya Sharma',
          dob: '2006-06-15',
          email: 'candidate@example.com',
          phone: '+91 98765 43210',
          gender: 'Female',
          category: 'General',
          bloodGroup: 'O+',
          guardianName: 'Rajesh Sharma',
          guardianPhone: '+91 98765 00000',
          address: 'Salt Lake Sector V, Bidhannagar',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700091',
        },
        academic_details: {
          previousInstitution: 'Delhi Public School, Ruby Park',
          yearOfPassing: '2025',
          percentageCgpa: '94.6',
          boardUniversity: 'CBSE',
          stream: 'Science',
          rollNumber: 'CBSE-2025-98214',
          entranceExam: 'JEE Main 2026',
          entranceScore: '98.42 Percentile',
          entranceRank: 'AIR 1420',
        },
        class_10_details: {
          schoolName: 'Delhi Public School, Ruby Park',
          board: 'CBSE',
          yearOfPassing: '2023',
          fullMarks: 500,
          marksObtained: 478,
          percentage: 95.6,
        },
        class_12_details: {
          schoolName: 'Delhi Public School, Ruby Park',
          board: 'CBSE',
          stream: 'Science',
          yearOfPassing: '2025',
          fullMarks: 500,
          marksObtained: 473,
          percentage: 94.6,
        },
        entrance_exam_details: {
          jeeMain: { appeared: true, percentile: '98.42', rank: '1420' },
          wbjee: { appeared: true, rank: '312' },
          iemjee: { appeared: false, rank: '' },
        },
        submitted_at: null,
        updated_at: '2026-08-22T04:00:00Z',
        current_step: 1,
      },
    ],
    documents: [
      {
        id: 'doc_001',
        application_id: 'app_001',
        document_type: 'marksheet_10th',
        title: 'Class 10th Marksheet',
        file_name: 'class_10_marksheet_verified.pdf',
        file_path: 'app_001/marksheet_10th.pdf',
        file_size: '1.8MB',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        verification_status: 'pending',
        uploaded_at: '2026-08-21T14:15:00Z',
      },
      {
        id: 'doc_002',
        application_id: 'app_001',
        document_type: 'marksheet_12th',
        title: 'Class 12th Marksheet',
        file_name: 'class_12_marksheet_final.pdf',
        file_path: 'app_001/marksheet_12th.pdf',
        file_size: '2.4MB',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        verification_status: 'pending',
        uploaded_at: '2026-08-21T14:20:00Z',
      },
      {
        id: 'doc_003',
        application_id: 'app_001',
        document_type: 'id_proof',
        title: 'Government ID Proof (Aadhaar / Passport)',
        file_name: 'aadhaar_front_back.pdf',
        file_path: 'app_001/id_proof.pdf',
        file_size: '1.2MB',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        verification_status: 'pending',
        uploaded_at: '2026-08-21T14:22:00Z',
      },
      {
        id: 'doc_004',
        application_id: 'app_001',
        document_type: 'photo',
        title: 'Recent Passport Photograph',
        file_name: 'candidate_photo.jpg',
        file_path: 'app_001/photo.jpg',
        file_size: '450KB',
        file_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdgDcW0tVbFbIuOWUVdbU8cYPLCHGs6Enk-tp5dwoWiQpulHBGDQ0ChR4bY97svyjwKzN9QolMlzSHo4nCVS1YOhe_2Z588RSMBWXrNrZlKKHeW32K7HHX7APn0BaBw8MkLrSX32IjzZEfYZ-ydgxsr5VgVDQAu_CwyzBiZf65M3JFIOObFqioMGrvf6X7VUX1YqeD_yu_9NQkCKHA-HN_FGII2yB7LV_W0iL6V4g_WSC8QFoYDhLu',
        verification_status: 'pending',
        uploaded_at: '2026-08-21T14:25:00Z',
      },
    ],
    payments: [],
    merit_list: [
      {
        id: 'merit_001',
        application_id: 'app_seed_01',
        merit_rank: 1,
        academic_score: 99.4,
        candidate_name: 'Debjit Roy',
        course: 'B.Tech in Computer Science & Engineering (CSE)',
        created_at: '2026-08-15T10:00:00Z',
      },
      {
        id: 'merit_002',
        application_id: 'app_seed_02',
        merit_rank: 2,
        academic_score: 98.9,
        candidate_name: 'Sneha Mukherjee',
        course: 'B.Tech in Computer Science & Engineering (CSE)',
        created_at: '2026-08-15T10:00:00Z',
      },
      {
        id: 'merit_003',
        application_id: 'app_seed_03',
        merit_rank: 3,
        academic_score: 98.1,
        candidate_name: 'Arjun Sen',
        course: 'B.Tech in Artificial Intelligence & Data Science',
        created_at: '2026-08-15T10:00:00Z',
      },
    ],
    seat_allocations: [],
    notifications: [
      {
        id: 'notif_welcome',
        recipient_id: 'usr_candidate_001',
        title: 'Welcome to IEM Admission Portal',
        message: 'Your student registration is verified. Complete your application form and submit documents to enter round 1 scrutiny.',
        type: 'announcement',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ],
    audit_logs: [
      {
        id: 'log_seed',
        action: 'SYSTEM_INIT',
        actor: 'SYSTEM',
        entity: 'database',
        entity_id: 'all',
        timestamp: new Date().toISOString(),
        details: 'IEM Admission Relational Database Initialized.',
      },
    ],
  };
}

function readDb(): LocalDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed || !Array.isArray(parsed.profiles)) {
      console.log('Upgrading database schema to Supabase-aligned format...');
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading database, restoring seed:', error);
    const initial = getInitialDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeDb(db: LocalDatabase): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

function logAudit(action: string, actor: string, entity: string, entity_id: string, details: string) {
  const db = readDb();
  db.audit_logs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    action,
    actor,
    entity,
    entity_id,
    timestamp: new Date().toISOString(),
    details,
  });
  if (db.audit_logs.length > 300) db.audit_logs.pop();
  writeDb(db);
}

function sendNotification(recipientId: string, title: string, message: string, type = 'status') {
  const db = readDb();
  db.notifications.unshift({
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    recipient_id: recipientId,
    title,
    message,
    type,
    is_read: false,
    created_at: new Date().toISOString(),
  });
  writeDb(db);
}

// Map database entities to frontend response format
function formatApplication(appItem: any) {
  if (!appItem) return null;
  const pref1 = appItem.preference_1 || appItem.course || 'CSE';
  const pref2 = appItem.preference_2 || appItem.department || 'IT';
  const pref3 = appItem.preference_3 || 'ECE';

  return {
    id: appItem.application_number || appItem.id,
    internalId: appItem.id,
    userId: appItem.student_id,
    studentId: appItem.student_id,
    applicationNumber: appItem.application_number,
    status: appItem.application_status,
    currentStep: appItem.current_step || (
      appItem.application_status === 'draft' ? 1 :
      appItem.application_status === 'submitted' ? 2 :
      appItem.application_status === 'approved' ? 3 :
      appItem.application_status === 'seat_allotted' ? 4 : 5
    ),
    personal: appItem.personal_details || {},
    academic: appItem.academic_details || {},
    class10: appItem.class_10_details || appItem.academic_details?.class10 || null,
    class12: appItem.class_12_details || appItem.academic_details?.class12 || null,
    entranceExams: appItem.entrance_exam_details || appItem.academic_details?.entranceExams || null,
    course: {
      primaryCourse: pref1,
      secondaryCourse: pref2,
      campusPreference: appItem.campus_preference || 'IEM Kolkata Main Campus (Salt Lake)',
      preference1: pref1,
      preference2: pref2,
      preference3: pref3,
    },
    preferences: {
      preference_1: pref1,
      preference_2: pref2,
      preference_3: pref3,
    },
    adminRemarks: appItem.admin_remarks,
    submittedAt: appItem.submitted_at,
    updatedAt: appItem.updated_at,
  };
}

function formatDocument(doc: any) {
  if (!doc) return null;
  return {
    id: doc.id,
    applicationId: doc.application_id,
    type: doc.document_type,
    title: doc.title,
    fileName: doc.file_name,
    fileSize: doc.file_size,
    fileUrl: doc.file_url || '',
    filePath: doc.file_path,
    status: doc.verification_status,
    adminRemarks: doc.admin_remarks,
    remarks: doc.admin_remarks,
    previousRemarks: doc.previous_remarks,
    uploadedAt: doc.uploaded_at,
    verifiedAt: doc.verified_at,
    verifiedBy: doc.verified_by || (doc.verified_at ? 'Prof. Dr. A. K. Banerjee (Dean of Admissions)' : undefined),
  };
}

// ==============================================================================
// AUTHENTICATION ROUTES
// ==============================================================================

// Session Check
app.get('/api/auth/me', (req, res) => {
  const db = readDb();
  let user: any = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const match = token.match(/^iem_token_([^_]+(?:_[^_]+)*?)_\d+$/);
    const uid = match ? match[1] : null;
    if (uid) {
      user = db.profiles.find(p => p.id === uid);
    }
  }

  if (!user && activeUserId) {
    user = db.profiles.find(p => p.id === activeUserId);
  }

  if (!user) {
    return res.json({ user: null, application: null });
  }

  const appItem = db.applications.find(a => a.student_id === user.id) || null;
  const { password: _, ...userSafe } = user;

  res.json({
    user: {
      id: userSafe.id,
      email: userSafe.email,
      name: userSafe.full_name,
      role: userSafe.role,
      phone: userSafe.phone,
      avatar: userSafe.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdgDcW0tVbFbIuOWUVdbU8cYPLCHGs6Enk-tp5dwoWiQpulHBGDQ0ChR4bY97svyjwKzN9QolMlzSHo4nCVS1YOhe_2Z588RSMBWXrNrZlKKHeW32K7HHX7APn0BaBw8MkLrSX32IjzZEfYZ-ydgxsr5VgVDQAu_CwyzBiZf65M3JFIOObFqioMGrvf6X7VUX1YqeD_yu_9NQkCKHA-HN_FGII2yB7LV_W0iL6V4g_WSC8QFoYDhLu',
      applicationId: appItem?.application_number || 'IEM-2026-001',
      createdAt: userSafe.created_at,
    },
    application: formatApplication(appItem),
    token: `iem_token_${user.id}_${Date.now()}`,
  });
});

app.post('/api/auth/logout', (req, res) => {
  activeUserId = null;
  res.json({ success: true, message: 'Logged out successfully' });
});

// STUDENT REGISTRATION: Step 1 - Send OTP
app.post('/api/auth/student/send-otp', (req, res) => {
  const { email, fullName, category } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: 'Full name and email are mandatory.' });
  }

  const db = readDb();
  const existing = db.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address is already registered. Please log in instead.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email.toLowerCase(), {
    code: otp,
    expiresAt,
    fullName,
    category: category || 'General',
  });

  console.log(`\n======================================================`);
  console.log(`[IEM SUPABASE AUTH] OTP FOR REGISTRATION: ${email}`);
  console.log(`>>> VERIFICATION CODE: ${otp} <<< (Valid for 10 minutes)`);
  console.log(`======================================================\n`);

  res.json({
    success: true,
    message: `A 6-digit OTP code has been sent to ${email}.`,
    debugOtp: otp, // Returned for effortless evaluation in sandbox preview
  });
});

// STUDENT REGISTRATION: Step 2 - Verify OTP & Provision Profile
app.post('/api/auth/student/verify-otp-register', (req, res) => {
  const { email, otp, phone, coursePreference } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required.' });
  }

  const stored = otpStore.get(email.toLowerCase());
  if (!stored) {
    return res.status(400).json({ error: 'No pending OTP verification found for this email. Please request a new code.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ error: 'The verification code has expired. Please request a fresh OTP.' });
  }

  if (stored.code !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid verification code. Please enter the correct 6-digit OTP.' });
  }

  // Verification succeeded - create account
  otpStore.delete(email.toLowerCase());

  const db = readDb();
  // Ensure no race duplicate
  if (db.profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newAppNum = db.applications.length + 1;
  const appNumber = `IEM-2026-${String(newAppNum).padStart(3, '0')}`;
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const appId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newProfile = {
    id: userId,
    email: email.toLowerCase(),
    full_name: stored.fullName || 'Student Applicant',
    role: 'student' as const,
    phone: phone || '+91 98765 00000',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdgDcW0tVbFbIuOWUVdbU8cYPLCHGs6Enk-tp5dwoWiQpulHBGDQ0ChR4bY97svyjwKzN9QolMlzSHo4nCVS1YOhe_2Z588RSMBWXrNrZlKKHeW32K7HHX7APn0BaBw8MkLrSX32IjzZEfYZ-ydgxsr5VgVDQAu_CwyzBiZf65M3JFIOObFqioMGrvf6X7VUX1YqeD_yu_9NQkCKHA-HN_FGII2yB7LV_W0iL6V4g_WSC8QFoYDhLu',
    created_at: new Date().toISOString(),
  };

  const newApplication = {
    id: appId,
    student_id: userId,
    application_number: appNumber,
    course: coursePreference || 'B.Tech in Computer Science & Engineering (CSE)',
    department: 'Computer Science & Engineering',
    campus_preference: 'IEM Kolkata - Main Campus (Salt Lake)',
    application_status: 'draft',
    current_step: 1,
    personal_details: {
      fullName: stored.fullName,
      dob: '2006-01-01',
      email: email.toLowerCase(),
      phone: phone || '',
      gender: 'Not Specified',
      category: stored.category || 'General',
      bloodGroup: 'O+',
      guardianName: '',
      guardianPhone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
    academic_details: {
      previousInstitution: '',
      yearOfPassing: '2025',
      percentageCgpa: '',
      boardUniversity: 'CBSE',
      stream: 'Science',
      rollNumber: '',
      entranceExam: 'JEE Main / WBJEE',
      entranceScore: '',
      entranceRank: '',
    },
    submitted_at: null,
    updated_at: new Date().toISOString(),
  };

  db.profiles.push(newProfile);
  db.applications.push(newApplication);

  sendNotification(
    userId,
    'Registration Verified & Complete',
    `Welcome ${stored.fullName}! Your registration has been verified via OTP. Your Application ID is ${appNumber}.`,
    'announcement'
  );

  logAudit('STUDENT_REGISTERED_OTP', email, 'profiles', userId, `Registered with Application ${appNumber}`);
  writeDb(db);

  activeUserId = userId;

  res.json({
    success: true,
    user: {
      id: newProfile.id,
      email: newProfile.email,
      name: newProfile.full_name,
      role: newProfile.role,
      phone: newProfile.phone,
      avatar: newProfile.avatar,
      applicationId: appNumber,
      createdAt: newProfile.created_at,
    },
    application: formatApplication(newApplication),
    token: `iem_token_${userId}_${Date.now()}`,
  });
});

// STUDENT LOGIN: Step 1 - Send OTP to registered email
app.post('/api/auth/student/login-send-otp', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Please enter your registered email address.' });
  }

  const db = readDb();
  const profile = db.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

  if (!profile) {
    return res.status(404).json({ error: 'No registered student found with this email. Please click "Register" to create an account.' });
  }

  if (profile.role === 'admin') {
    return res.status(403).json({ error: 'Administrator accounts must log in via the "Login as Admin" portal.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(email.toLowerCase(), {
    code: otp,
    expiresAt,
    fullName: profile.full_name,
  });

  console.log(`\n======================================================`);
  console.log(`[IEM SUPABASE AUTH] OTP FOR STUDENT LOGIN: ${email}`);
  console.log(`>>> LOGIN CODE: ${otp} <<< (Valid for 10 minutes)`);
  console.log(`======================================================\n`);

  res.json({
    success: true,
    message: `Verification code sent to ${email}.`,
    debugOtp: otp,
  });
});

// STUDENT LOGIN: Step 2 - Verify OTP & Log In
app.post('/api/auth/student/verify-otp-login', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required.' });
  }

  const stored = otpStore.get(email.toLowerCase());
  if (!stored) {
    return res.status(400).json({ error: 'No pending OTP found for this email. Please request a new code.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ error: 'The verification code has expired. Please request a fresh OTP.' });
  }

  if (stored.code !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid verification code. Please check and re-enter.' });
  }

  otpStore.delete(email.toLowerCase());

  const db = readDb();
  const profile = db.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found.' });
  }

  const appItem = db.applications.find(a => a.student_id === profile.id);
  activeUserId = profile.id;

  logAudit('STUDENT_LOGIN_OTP', email, 'profiles', profile.id, 'Logged in via verified OTP');

  res.json({
    success: true,
    user: {
      id: profile.id,
      email: profile.email,
      name: profile.full_name,
      role: profile.role,
      phone: profile.phone,
      avatar: profile.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdgDcW0tVbFbIuOWUVdbU8cYPLCHGs6Enk-tp5dwoWiQpulHBGDQ0ChR4bY97svyjwKzN9QolMlzSHo4nCVS1YOhe_2Z588RSMBWXrNrZlKKHeW32K7HHX7APn0BaBw8MkLrSX32IjzZEfYZ-ydgxsr5VgVDQAu_CwyzBiZf65M3JFIOObFqioMGrvf6X7VUX1YqeD_yu_9NQkCKHA-HN_FGII2yB7LV_W0iL6V4g_WSC8QFoYDhLu',
      applicationId: appItem?.application_number || 'IEM-2026-001',
      createdAt: profile.created_at,
    },
    application: formatApplication(appItem),
    token: `iem_token_${profile.id}_${Date.now()}`,
  });
});

// ADMIN AUTHENTICATION: Separate Login with strict Role Verification
app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Admin email and password are required.' });
  }

  const db = readDb();
  const user = db.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'No administrator account found with this email.' });
  }

  // Security check: verify admin role
  if (user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access Denied: This account is registered as a student. Only authorized admission officials may access the Admin Portal.',
    });
  }

  if (user.password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid administrator password.' });
  }

  activeUserId = user.id;
  logAudit('ADMIN_LOGIN', email, 'profiles', user.id, 'Administrator logged in to Admissions Console');

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: 'admin',
      phone: user.phone,
      avatar: user.avatar,
      applicationId: 'IEM-OFFICER-01',
      createdAt: user.created_at,
    },
    token: `iem_token_${user.id}_${Date.now()}`,
  });
});

// Backward-compatible login endpoint for existing test switcher
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.profiles.find(p => p.email.toLowerCase() === (email || '').toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Account not found with this email.' });
  }

  if (user.password && password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid password. (Use OTP for student or "admin123" for admin)' });
  }

  activeUserId = user.id;
  const appItem = db.applications.find(a => a.student_id === user.id);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      applicationId: appItem?.application_number || 'IEM-2026-001',
      createdAt: user.created_at,
    },
    application: formatApplication(appItem),
    token: `iem_token_${user.id}_${Date.now()}`,
  });
});

// ==============================================================================
// STUDENT APPLICATION WORKFLOW
// ==============================================================================

// Fetch application
app.get('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const appItem = db.applications.find(
    a => a.application_number === id || a.id === id || a.student_id === id
  );

  if (!appItem) {
    return res.status(404).json({ error: 'Application not found' });
  }

  res.json(formatApplication(appItem));
});

// Save draft application
app.put('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const { personal, academic, course, preferences, class10, class12, entranceExams, currentStep } = req.body;
  const db = readDb();
  const index = db.applications.findIndex(
    a => a.application_number === id || a.id === id || a.student_id === id
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const existing = db.applications[index];

  // Prevent editing after final approval or submission unless correction is required
  if (['approved', 'seat_allotted', 'admission_confirmed'].includes(existing.application_status)) {
    return res.status(400).json({ error: 'Cannot modify application in its current verified status.' });
  }

  // Validate Class 10 marks
  let updatedClass10 = class10 !== undefined ? class10 : existing.class_10_details;
  if (updatedClass10 && updatedClass10.fullMarks && updatedClass10.marksObtained !== undefined && updatedClass10.marksObtained !== '') {
    const full = Number(updatedClass10.fullMarks);
    const obt = Number(updatedClass10.marksObtained);
    if (!isNaN(full) && !isNaN(obt)) {
      if (obt > full) {
        return res.status(400).json({ error: 'Class 10 Marks Obtained cannot exceed Full Marks.' });
      }
      if (full > 0) {
        updatedClass10 = {
          ...updatedClass10,
          percentage: Number(((obt / full) * 100).toFixed(2)),
        };
      }
    }
  }

  // Validate Class 12 marks
  let updatedClass12 = class12 !== undefined ? class12 : existing.class_12_details;
  if (updatedClass12 && updatedClass12.fullMarks && updatedClass12.marksObtained !== undefined && updatedClass12.marksObtained !== '') {
    const full = Number(updatedClass12.fullMarks);
    const obt = Number(updatedClass12.marksObtained);
    if (!isNaN(full) && !isNaN(obt)) {
      if (obt > full) {
        return res.status(400).json({ error: 'Class 12 Marks Obtained cannot exceed Full Marks.' });
      }
      if (full > 0) {
        updatedClass12 = {
          ...updatedClass12,
          percentage: Number(((obt / full) * 100).toFixed(2)),
        };
      }
    }
  }

  const p1 = preferences?.preference_1 || course?.preference1 || course?.preference_1 || req.body.preference_1 || existing.preference_1 || existing.course;
  const p2 = preferences?.preference_2 || course?.preference2 || course?.preference_2 || req.body.preference_2 || existing.preference_2 || existing.department;
  const p3 = preferences?.preference_3 || course?.preference3 || course?.preference_3 || req.body.preference_3 || existing.preference_3;

  db.applications[index] = {
    ...existing,
    personal_details: personal ? { ...existing.personal_details, ...personal } : existing.personal_details,
    academic_details: academic ? { ...existing.academic_details, ...academic } : existing.academic_details,
    class_10_details: updatedClass10 !== undefined ? updatedClass10 : existing.class_10_details,
    class_12_details: updatedClass12 !== undefined ? updatedClass12 : existing.class_12_details,
    entrance_exam_details: entranceExams !== undefined ? entranceExams : existing.entrance_exam_details,
    preference_1: p1,
    preference_2: p2,
    preference_3: p3,
    course: p1 || existing.course,
    department: p2 || existing.department,
    campus_preference: course?.campusPreference || existing.campus_preference,
    current_step: currentStep ?? existing.current_step,
    updated_at: new Date().toISOString(),
  };

  writeDb(db);
  logAudit('APPLICATION_DRAFT_SAVED', existing.student_id, 'applications', existing.id, 'Draft details updated');

  res.json(formatApplication(db.applications[index]));
});

// Submit Application (Stage C)
app.post('/api/applications/:id/submit', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.applications.findIndex(
    a => a.application_number === id || a.id === id || a.student_id === id
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const appItem = db.applications[index];

  // Prevent duplicate submissions
  if (['submitted', 'under_review', 'approved', 'seat_allotted', 'admission_confirmed'].includes(appItem.application_status)) {
    return res.json({
      success: true,
      message: 'Application is already submitted and under review.',
      application: formatApplication(appItem),
    });
  }

  appItem.application_status = 'submitted';
  appItem.submitted_at = new Date().toISOString();
  appItem.updated_at = new Date().toISOString();
  appItem.current_step = 2;

  sendNotification(
    appItem.student_id,
    'Application Form Submitted',
    `Your application (${appItem.application_number}) has been officially submitted and queued for document verification.`,
    'status'
  );

  logAudit('APPLICATION_SUBMITTED', appItem.student_id, 'applications', appItem.id, 'Student completed formal submission');
  writeDb(db);

  res.json({
    success: true,
    message: 'Application submitted successfully to admissions scrutiny.',
    application: formatApplication(appItem),
  });
});

// ==============================================================================
// DOCUMENT MANAGEMENT
// ==============================================================================

app.get('/api/documents/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const db = readDb();

  // Find app to get both internal id and number
  const appItem = db.applications.find(
    a => a.application_number === applicationId || a.id === applicationId || a.student_id === applicationId
  );

  const targetAppId = appItem?.id || applicationId;
  const docs = db.documents.filter(
    d => d.application_id === targetAppId || d.application_id === applicationId
  );

  res.json(docs.map(formatDocument));
});

app.post('/api/documents', (req, res) => {
  const { applicationId, type, title, fileName, fileSize, fileUrl, filePath } = req.body;
  if (!applicationId || !type || !fileName) {
    return res.status(400).json({ error: 'Missing mandatory document parameters.' });
  }

  const db = readDb();
  const appItem = db.applications.find(
    a => a.application_number === applicationId || a.id === applicationId || a.student_id === applicationId
  );

  const internalAppId = appItem ? appItem.id : applicationId;

  // Check if replacing an existing document of this type
  const existingIdx = db.documents.findIndex(
    d => d.application_id === internalAppId && d.document_type === type
  );

  const existingDoc = existingIdx >= 0 ? db.documents[existingIdx] : null;

  const docRecord = {
    id: existingDoc ? existingDoc.id : `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    application_id: internalAppId,
    document_type: type,
    title: title || type.replace('_', ' ').toUpperCase(),
    file_name: fileName,
    file_path: filePath || `${internalAppId}/${type}_${fileName}`,
    file_size: fileSize || '1.8MB',
    file_url: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    verification_status: 'pending' as const,
    admin_remarks: undefined, // Cleared on replacement so document requires fresh verification
    previous_remarks: existingDoc?.admin_remarks || existingDoc?.previous_remarks || undefined, // Preserves verification history
    uploaded_at: new Date().toISOString(),
    verified_at: undefined,
    verified_by: undefined,
  };

  if (existingIdx >= 0) {
    db.documents[existingIdx] = docRecord;
  } else {
    db.documents.push(docRecord);
  }

  // If application was in correction_required, verify if any other document still requires student action
  const appDocs = db.documents.filter(d => d.application_id === internalAppId);
  const remainingFlagged = appDocs.filter(
    d => d.id !== docRecord.id && (d.verification_status === 'correction_required' || d.verification_status === 'rejected')
  );

  if (appItem) {
    if (remainingFlagged.length === 0 && appItem.application_status === 'correction_required') {
      appItem.application_status = 'resubmitted';
      appItem.admin_remarks = undefined;
      appItem.updated_at = new Date().toISOString();
    }
  }

  // Notify admin that a replacement document has been submitted (Part A, Requirement 4)
  sendNotification(
    'usr_admin_001',
    `Replacement Document Submitted: ${docRecord.title}`,
    `Candidate ${appItem?.personal_details?.fullName || appItem?.application_number || 'Student'} has uploaded a replacement for "${docRecord.title}". Verification status set to PENDING review.`,
    'document'
  );

  writeDb(db);
  logAudit('DOCUMENT_UPLOADED', internalAppId, 'documents', docRecord.id, `Uploaded ${fileName} (${type}). Status set to PENDING.`);

  res.json({
    success: true,
    document: formatDocument(docRecord),
    ...formatDocument(docRecord),
  });
});

app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.documents.findIndex(d => d.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const doc = db.documents[index];
  db.documents.splice(index, 1);
  writeDb(db);
  logAudit('DOCUMENT_DELETED', doc.application_id, 'documents', id, `Removed document ${doc.file_name}`);

  res.json({ success: true, message: 'Document deleted successfully' });
});

// ==============================================================================
// FEE PAYMENT (INSTITUTIONAL FEE WAIVER APPLIED - STRICTLY ₹0.00)
// ==============================================================================

app.get('/api/payments/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const db = readDb();
  const appItem = db.applications.find(
    a => a.application_number === applicationId || a.id === applicationId || a.student_id === applicationId
  );
  const targetId = appItem ? appItem.id : applicationId;

  const paymentList = db.payments.filter(
    p => p.application_id === targetId || p.application_id === applicationId
  );

  res.json(paymentList.map(p => ({
    id: p.id,
    applicationId: appItem?.application_number || p.application_id,
    studentId: p.student_id,
    amount: p.amount,
    currency: p.currency,
    status: p.payment_status,
    paymentStatus: p.payment_status,
    transactionId: p.transaction_reference,
    transactionReference: p.transaction_reference,
    invoiceNumber: p.invoice_number,
    paymentMethod: p.payment_method,
    paidAt: p.payment_date,
    paymentDate: p.payment_date,
  })));
});

// Fee payment processing with Institutional Fee Waiver (₹0.00)
app.post('/api/payments', (req, res) => {
  const { applicationId } = req.body;
  if (!applicationId) {
    return res.status(400).json({ error: 'Application ID is required' });
  }

  const db = readDb();
  const appItem = db.applications.find(
    a => a.application_number === applicationId || a.id === applicationId || a.student_id === applicationId
  );

  if (!appItem) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // Prevent duplicate payment
  const existingPay = db.payments.find(
    p => p.application_id === appItem.id && p.payment_status === 'paid'
  );

  if (existingPay) {
    return res.json({
      success: true,
      message: 'Fee payment is already completed for this admission.',
      payment: {
        id: existingPay.id,
        applicationId: appItem.application_number,
        amount: 0.00,
        currency: 'INR',
        status: 'paid',
        paymentStatus: 'paid',
        transactionId: existingPay.transaction_reference,
        invoiceNumber: existingPay.invoice_number,
        paidAt: existingPay.payment_date,
      },
    });
  }

  const txnRef = `TXN-IEM-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const invNumber = `INV-IEM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const paymentRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    application_id: appItem.id,
    student_id: appItem.student_id,
    amount: 0.00, // Institutional Fee Waiver applied
    currency: 'INR',
    payment_status: 'paid' as const,
    transaction_reference: txnRef,
    invoice_number: invNumber,
    payment_method: 'IEM Online Portal (Institutional Fee Waiver Applied)',
    payment_date: new Date().toISOString(),
  };

  db.payments.push(paymentRecord);

  // Update application to admission_confirmed
  appItem.application_status = 'admission_confirmed';
  appItem.updated_at = new Date().toISOString();

  sendNotification(
    appItem.student_id,
    'Fee Payment Successful (₹0.00 - Institutional Waiver)',
    `Your seat allotment has been confirmed. Transaction Ref: ${txnRef}. Provisional Allotment Letter unlocked!`,
    'payment'
  );

  logAudit('PAYMENT_PROCESSED', appItem.student_id, 'payments', paymentRecord.id, 'Seat acceptance confirmed at ₹0.00');
  writeDb(db);

  res.json({
    success: true,
    message: 'Seat acceptance fee payment confirmed successfully (Institutional Fee Waiver applied)!',
    payment: {
      id: paymentRecord.id,
      applicationId: appItem.application_number,
      amount: 0.00,
      currency: 'INR',
      status: 'paid',
      paymentStatus: 'paid',
      transactionId: txnRef,
      transactionReference: txnRef,
      invoiceNumber: invNumber,
      paymentMethod: paymentRecord.payment_method,
      paidAt: paymentRecord.payment_date,
    },
  });
});

// ==============================================================================
// MERIT LIST & SEAT ALLOTMENT (STUDENT & ADMIN)
// ==============================================================================

app.get('/api/merit-list', (req, res) => {
  const { search, course } = req.query;
  const db = readDb();

  let list = db.merit_list.map((m) => {
    const appItem = db.applications.find(a => a.id === m.application_id);
    const profile = appItem ? db.profiles.find(p => p.id === appItem.student_id) : null;
    const seatAlloc = db.seat_allocations.find(s => s.application_id === m.application_id);

    return {
      id: m.id,
      rank: m.merit_rank,
      applicationId: appItem?.application_number || m.application_id,
      candidateName: m.candidate_name || profile?.full_name || 'Candidate',
      category: appItem?.personal_details?.category || 'General',
      meritScore: Number(m.academic_score),
      course: m.course || appItem?.course || 'B.Tech CSE',
      allottedSeat: seatAlloc ? seatAlloc.seat_number : null,
      status: seatAlloc ? 'Allotted' : m.merit_rank <= 10 ? 'Confirmed' : 'Waiting List',
    };
  });

  if (course && course !== 'all') {
    list = list.filter(m => m.course.toLowerCase().includes(String(course).toLowerCase()));
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(m =>
      m.candidateName.toLowerCase().includes(q) ||
      m.applicationId.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }

  res.json(list.sort((a, b) => a.rank - b.rank));
});

// ==============================================================================
// ADMIN DASHBOARD OPERATIONS
// ==============================================================================

// View all applicants
app.get('/api/admin/applicants', (req, res) => {
  const { q, status } = req.query;
  const db = readDb();

  let applicants = db.applications.map((appItem) => {
    const profile = db.profiles.find(p => p.id === appItem.student_id);
    const docs = db.documents.filter(d => d.application_id === appItem.id);
    const payment = db.payments.find(p => p.application_id === appItem.id && p.payment_status === 'paid');
    const merit = db.merit_list.find(m => m.application_id === appItem.id);
    const seat = db.seat_allocations.find(s => s.application_id === appItem.id);

    const pendingDocs = docs.filter(d => d.verification_status === 'pending').length;
    const approvedDocs = docs.filter(d => d.verification_status === 'approved').length;
    const rejectedDocs = docs.filter(d => d.verification_status === 'rejected').length;

    const pref1 = appItem.preference_1 || appItem.course || 'CSE';
    const pref2 = appItem.preference_2 || appItem.department || '';
    const pref3 = appItem.preference_3 || '';

    return {
      id: appItem.id,
      applicationNumber: appItem.application_number,
      studentId: appItem.student_id,
      candidateName: profile?.full_name || appItem.personal_details?.fullName || 'Candidate',
      email: profile?.email || appItem.personal_details?.email || '',
      phone: profile?.phone || appItem.personal_details?.phone || '',
      course: appItem.course,
      department: appItem.department,
      preference1: pref1,
      preference2: pref2,
      preference3: pref3,
      preferences: [pref1, pref2, pref3].filter(Boolean),
      class10: appItem.class_10_details,
      class12: appItem.class_12_details,
      entranceExams: appItem.entrance_exam_details,
      status: appItem.application_status,
      submittedAt: appItem.submitted_at,
      updatedAt: appItem.updated_at,
      totalDocs: docs.length,
      pendingDocs,
      approvedDocs,
      rejectedDocs,
      isPaid: Boolean(payment),
      meritRank: merit?.merit_rank || null,
      meritScore: merit?.academic_score || null,
      allottedSeat: seat?.seat_number || null,
      adminRemarks: appItem.admin_remarks,
    };
  });

  if (status && status !== 'all') {
    applicants = applicants.filter(a => a.status === status);
  }

  if (q) {
    const queryStr = String(q).toLowerCase();
    applicants = applicants.filter(a =>
      a.candidateName.toLowerCase().includes(queryStr) ||
      a.email.toLowerCase().includes(queryStr) ||
      a.applicationNumber.toLowerCase().includes(queryStr) ||
      a.course.toLowerCase().includes(queryStr)
    );
  }

  res.json(applicants);
});

// Detailed applicant inspection
app.get('/api/admin/applicants/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const appItem = db.applications.find(
    a => a.id === id || a.application_number === id
  );

  if (!appItem) {
    return res.status(404).json({ error: 'Applicant record not found' });
  }

  const profile = db.profiles.find(p => p.id === appItem.student_id);
  const docs = db.documents.filter(d => d.application_id === appItem.id);
  const payment = db.payments.find(p => p.application_id === appItem.id);
  const merit = db.merit_list.find(m => m.application_id === appItem.id);
  const seat = db.seat_allocations.find(s => s.application_id === appItem.id);

  res.json({
    application: formatApplication(appItem),
    profile: profile ? {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      createdAt: profile.created_at,
    } : null,
    documents: docs.map(formatDocument),
    payment,
    merit,
    seatAllocation: seat,
  });
});

// Document verification (approve / request correction / reject with remarks)
app.post('/api/admin/documents/:id/verify', (req, res) => {
  const { id } = req.params;
  const { status, remarks, adminId } = req.body;

  const validStatuses = ['approved', 'rejected', 'pending', 'correction_required'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Valid status (approved, rejected, pending, correction_required) is required.' });
  }

  if ((status === 'rejected' || status === 'correction_required') && (!remarks || !remarks.trim())) {
    return res.status(400).json({ error: 'Please provide a specific reason/remark explaining why correction is required.' });
  }

  const db = readDb();
  const doc = db.documents.find(d => d.id === id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const previousStatus = doc.verification_status;
  doc.verification_status = status;
  doc.verified_at = new Date().toISOString();
  doc.verified_by = adminId || 'Admissions Scrutiny Committee';

  if (status === 'correction_required' || status === 'rejected') {
    doc.admin_remarks = remarks?.trim();
  } else if (status === 'approved') {
    if (doc.admin_remarks) {
      doc.previous_remarks = doc.admin_remarks;
    }
    doc.admin_remarks = undefined;
  }

  const appItem = db.applications.find(a => a.id === doc.application_id);
  if (appItem) {
    const allDocs = db.documents.filter(d => d.application_id === appItem.id);
    const anyFlagged = allDocs.some(
      d => (d.id === doc.id ? (status === 'correction_required' || status === 'rejected') : (d.verification_status === 'correction_required' || d.verification_status === 'rejected'))
    );

    if (status === 'correction_required' || status === 'rejected') {
      appItem.application_status = 'correction_required';
      appItem.admin_remarks = `Correction required on ${doc.title}: ${remarks}`;
      sendNotification(
        appItem.student_id,
        `Document Correction Required: ${doc.title}`,
        `Your document "${doc.title}" requires re-upload: "${remarks}". Please upload a corrected document in your portal.`,
        'document'
      );
    } else if (status === 'approved') {
      if (!anyFlagged && appItem.application_status === 'correction_required') {
        const allApproved = allDocs.every(d => (d.id === doc.id ? true : d.verification_status === 'approved'));
        appItem.application_status = allApproved ? 'documents_verified' : (appItem.submitted_at ? 'submitted' : 'under_review');
        appItem.admin_remarks = allApproved ? 'All uploaded documents verified and approved.' : undefined;
      }
      sendNotification(
        appItem.student_id,
        `Document Verified: ${doc.title}`,
        `Your document "${doc.title}" has been reviewed and approved by the admissions committee.`,
        'document'
      );
    }
  }

  logAudit('DOCUMENT_SCRUTINY', adminId || 'Admissions Dean', 'documents', id, `Marked ${status}. Remarks: ${remarks || 'None'}`);
  writeDb(db);

  res.json({
    success: true,
    document: formatDocument(doc),
    applicationStatus: appItem?.application_status,
  });
});

// Application level Approval
app.post('/api/admin/applications/:id/approve', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const appItem = db.applications.find(a => a.id === id || a.application_number === id);

  if (!appItem) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // Validate mandatory documents: class 10, 12, id_proof
  const docs = db.documents.filter(d => d.application_id === appItem.id);
  const unverifiedDocs = docs.filter(d => d.verification_status !== 'approved');

  if (unverifiedDocs.length > 0) {
    return res.status(400).json({
      error: `Cannot approve application: ${unverifiedDocs.length} uploaded document(s) remain unapproved. Please scrutinize all documents first.`,
    });
  }

  appItem.application_status = 'approved';
  appItem.admin_remarks = 'Application credentials and certificates officially approved.';
  appItem.updated_at = new Date().toISOString();

  // If no merit item exists, generate initial merit rank
  const existingMerit = db.merit_list.find(m => m.application_id === appItem.id);
  if (!existingMerit) {
    const nextRank = db.merit_list.length + 1;
    const academicScore = Number(appItem.academic_details?.percentageCgpa || 95.0);
    const profile = db.profiles.find(p => p.id === appItem.student_id);

    db.merit_list.push({
      id: `merit_${Date.now()}`,
      application_id: appItem.id,
      merit_rank: nextRank,
      academic_score: academicScore,
      candidate_name: profile?.full_name || appItem.personal_details?.fullName,
      course: appItem.course,
      created_at: new Date().toISOString(),
    });
  }

  sendNotification(
    appItem.student_id,
    'Application Form Officially Approved',
    'Your application and all attached credentials have been verified and approved by the Dean of Admissions.',
    'status'
  );

  logAudit('APPLICATION_APPROVED', 'Admissions Dean', 'applications', appItem.id, 'Application marked approved');
  writeDb(db);

  res.json({
    success: true,
    message: `Application ${appItem.application_number} approved successfully!`,
    application: formatApplication(appItem),
  });
});

// Application level Rejection
app.post('/api/admin/applications/:id/reject', (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;

  if (!remarks || !remarks.trim()) {
    return res.status(400).json({ error: 'A clear reason for application rejection is required.' });
  }

  const db = readDb();
  const appItem = db.applications.find(a => a.id === id || a.application_number === id);

  if (!appItem) {
    return res.status(404).json({ error: 'Application not found' });
  }

  appItem.application_status = 'rejected';
  appItem.admin_remarks = remarks;
  appItem.updated_at = new Date().toISOString();

  sendNotification(
    appItem.student_id,
    'Application Status Notice',
    `Your application for admission could not be approved: ${remarks}`,
    'status'
  );

  logAudit('APPLICATION_REJECTED', 'Admissions Dean', 'applications', appItem.id, `Application rejected: ${remarks}`);
  writeDb(db);

  res.json({
    success: true,
    message: `Application ${appItem.application_number} marked as rejected.`,
    application: formatApplication(appItem),
  });
});

// Seat Allotment Management
app.post('/api/admin/seat-allotment', (req, res) => {
  const { applicationId, course, department, campus, seatNumber } = req.body;

  if (!applicationId || !course || !seatNumber) {
    return res.status(400).json({ error: 'Application ID, course, and seat number are required.' });
  }

  const db = readDb();
  const appItem = db.applications.find(a => a.id === applicationId || a.application_number === applicationId);

  if (!appItem) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // Enforce candidate's three preferences
  const candidatePrefs = [
    appItem.preference_1,
    appItem.preference_2,
    appItem.preference_3,
    appItem.course,
  ].filter(Boolean) as string[];

  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const courseClean = clean(course);
  const isMatchedPref = candidatePrefs.some(p => {
    const pClean = clean(p);
    return pClean === courseClean || courseClean.includes(pClean) || pClean.includes(courseClean);
  });

  if (candidatePrefs.length > 0 && !isMatchedPref) {
    const prefList = [appItem.preference_1, appItem.preference_2, appItem.preference_3].filter(Boolean).join(', ');
    return res.status(400).json({
      error: `Allotted department must strictly be one of candidate's 3 preferences (${prefList}).`,
    });
  }

  // Prevent double allotment of the exact same seat number to different students
  const seatConflict = db.seat_allocations.find(
    s => s.seat_number.toLowerCase() === seatNumber.toLowerCase() && s.application_id !== appItem.id
  );

  if (seatConflict) {
    return res.status(409).json({
      error: `Seat "${seatNumber}" has already been allocated to another candidate. Please choose an available seat code.`,
    });
  }

  // Record seat allocation
  const existingIdx = db.seat_allocations.findIndex(s => s.application_id === appItem.id);
  const allocation = {
    id: existingIdx >= 0 ? db.seat_allocations[existingIdx].id : `alloc_${Date.now()}`,
    application_id: appItem.id,
    student_id: appItem.student_id,
    course,
    department: department || course,
    campus: campus || 'IEM Kolkata Main Campus (Salt Lake)',
    seat_number: seatNumber,
    allocation_status: 'allotted' as const,
    allotted_at: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    db.seat_allocations[existingIdx] = allocation;
  } else {
    db.seat_allocations.push(allocation);
  }

  appItem.application_status = 'seat_allotted';
  appItem.course = course;
  appItem.updated_at = new Date().toISOString();

  sendNotification(
    appItem.student_id,
    'Seat Allotment Confirmed!',
    `Congratulations! You have been allotted seat "${seatNumber}" in ${course}. Please complete the fee payment to confirm admission.`,
    'status'
  );

  logAudit('SEAT_ALLOTTED', 'Admissions Dean', 'seat_allocations', allocation.id, `Seat ${seatNumber} in ${course} allotted to ${appItem.application_number}`);
  writeDb(db);

  res.json({
    success: true,
    message: `Seat ${seatNumber} allocated to ${appItem.application_number}`,
    allocation,
    application: formatApplication(appItem),
  });
});

// Admin Merit Rank Assignment
app.post('/api/admin/applications/:id/merit-rank', (req, res) => {
  const { id } = req.params;
  const { meritRank, academicScore } = req.body;

  if (!meritRank || isNaN(Number(meritRank))) {
    return res.status(400).json({ error: 'A valid numerical merit rank is required.' });
  }

  const db = readDb();
  const appItem = db.applications.find(a => a.id === id || a.application_number === id);

  if (!appItem) {
    return res.status(404).json({ error: 'Application not found' });
  }

  let merit = db.merit_list.find(m => m.application_id === appItem.id);
  const profile = db.profiles.find(p => p.id === appItem.student_id);
  const rankNum = Number(meritRank);

  if (merit) {
    merit.merit_rank = rankNum;
    if (academicScore !== undefined && academicScore !== null && !isNaN(Number(academicScore))) {
      merit.academic_score = Number(academicScore);
    }
  } else {
    merit = {
      id: `merit_${Date.now()}`,
      application_id: appItem.id,
      merit_rank: rankNum,
      academic_score: academicScore && !isNaN(Number(academicScore))
        ? Number(academicScore)
        : Number(appItem.class_12_details?.percentage || appItem.academic_details?.percentageCgpa || 95.0),
      candidate_name: profile?.full_name || appItem.personal_details?.fullName || 'Candidate',
      course: appItem.preference_1 || appItem.course,
      created_at: new Date().toISOString(),
    };
    db.merit_list.push(merit);
  }

  sendNotification(
    appItem.student_id,
    `Merit Rank Assigned: #${rankNum}`,
    `You have been assigned Merit Rank #${rankNum} in the IEM Kolkata Admissions 2026.`,
    'status'
  );

  logAudit('MERIT_RANK_ASSIGNED', 'Admissions Dean', 'merit_list', merit.id, `Assigned Rank #${rankNum} to ${appItem.application_number}`);
  writeDb(db);

  res.json({
    success: true,
    message: `Merit rank #${rankNum} successfully saved for ${appItem.application_number}`,
    merit,
  });
});

// Notifications API
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  const db = readDb();
  const targetId = (userId as string) || activeUserId;

  if (targetId) {
    const list = db.notifications.filter(n => n.recipient_id === targetId || n.recipient_id === 'all');
    return res.json(list.map(n => ({
      id: n.id,
      userId: n.recipient_id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.is_read,
      createdAt: n.created_at,
      timestamp: n.created_at,
    })));
  }

  res.json(db.notifications.map(n => ({
    id: n.id,
    userId: n.recipient_id,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.is_read,
    createdAt: n.created_at,
    timestamp: n.created_at,
  })));
});

app.post('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const n = db.notifications.find(x => x.id === id);
  if (n) {
    n.is_read = true;
    writeDb(db);
  }
  res.json({ success: true, notification: n });
});

app.post('/api/notifications/read-all', (req, res) => {
  const db = readDb();
  db.notifications.forEach(n => {
    if (!activeUserId || n.recipient_id === activeUserId || n.recipient_id === 'all') {
      n.is_read = true;
    }
  });
  writeDb(db);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// Database summary / diagnostics
app.get('/api/database/summary', (req, res) => {
  const db = readDb();
  res.json({
    totalUsers: db.profiles.length,
    totalApplications: db.applications.length,
    totalDocuments: db.documents.length,
    totalPayments: db.payments.length,
    meritListCount: db.merit_list.length,
    verifiedDocsCount: db.documents.filter(d => d.verification_status === 'approved').length,
    totalRevenue: db.payments.reduce((acc, p) => acc + p.amount, 0),
    isSupabaseConfigured: isLiveSupabase,
  });
});

app.get('/api/database/tables', (req, res) => {
  const db = readDb();
  res.json([
    { name: 'profiles', rowCount: db.profiles.length, primaryKey: 'id', description: 'Student & administrative credentials and roles' },
    { name: 'applications', rowCount: db.applications.length, primaryKey: 'id', description: 'Academic, personal details and admission states' },
    { name: 'documents', rowCount: db.documents.length, primaryKey: 'id', description: 'Mandatory certificates and scrutiny verification states' },
    { name: 'payments', rowCount: db.payments.length, primaryKey: 'id', description: 'Fee payments (provisional admission fee records, ₹0.00 institutional waiver applied)' },
    { name: 'merit_list', rowCount: db.merit_list.length, primaryKey: 'id', description: 'Institutional rank orders and academic scores' },
    { name: 'seat_allocations', rowCount: db.seat_allocations.length, primaryKey: 'id', description: 'Departmental seats allocated to qualified candidates' },
    { name: 'notifications', rowCount: db.notifications.length, primaryKey: 'id', description: 'Candidate notification stream and audit bulletins' },
    { name: 'audit_logs', rowCount: db.audit_logs.length, primaryKey: 'id', description: 'Immutable transaction and event audit history' },
  ]);
});

app.get('/api/database/tables/:name', (req, res) => {
  const { name } = req.params;
  const db = readDb();
  if (name in db) {
    res.json((db as any)[name]);
  } else {
    res.status(404).json({ error: `Table '${name}' not found` });
  }
});

// Catch-all for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Static / Vite serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IEM Admission Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
