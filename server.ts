import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Persistent Data File Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'iem_admission.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: Array<{
    id: string;
    email: string;
    password?: string;
    name: string;
    role: 'candidate' | 'admin';
    applicationId: string;
    avatar: string;
    phone: string;
    createdAt: string;
  }>;
  applications: Array<{
    id: string;
    userId: string;
    status: 'draft' | 'under_review' | 'docs_verified' | 'merit_qualified' | 'seat_allotted' | 'rejected';
    currentStep: 1 | 2 | 3 | 4;
    personal: {
      fullName: string;
      dob: string;
      email: string;
      phone: string;
      gender: string;
      category: string;
      bloodGroup: string;
      guardianName: string;
      guardianPhone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
    academic: {
      previousInstitution: string;
      yearOfPassing: string;
      percentageCgpa: string;
      boardUniversity: string;
      stream: string;
      rollNumber: string;
      entranceExam: string;
      entranceScore: string;
      entranceRank: string;
    };
    course: {
      primaryCourse: string;
      secondaryCourse: string;
      campusPreference: string;
    };
    submittedAt: string | null;
    updatedAt: string;
  }>;
  documents: Array<{
    id: string;
    applicationId: string;
    type: string;
    title: string;
    description: string;
    fileName: string;
    fileSize: string;
    fileUrl: string;
    status: 'uploaded' | 'verified' | 'rejected' | 'pending';
    uploadedAt: string;
    verifiedAt?: string;
    remarks?: string;
  }>;
  payments: Array<{
    id: string;
    applicationId: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: 'success' | 'pending' | 'failed';
    method: 'card' | 'upi' | 'netbanking';
    paidAt: string;
    invoiceNumber: string;
    details: {
      cardLast4?: string;
      upiId?: string;
      bankName?: string;
    };
  }>;
  meritList: Array<{
    id: string;
    rank: number;
    applicationId: string;
    candidateName: string;
    category: string;
    meritScore: number;
    course: string;
    allottedSeat: string | null;
    status: 'Allotted' | 'Waiting List' | 'Confirmed' | 'Review';
  }>;
  notifications: Array<{
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'payment' | 'document' | 'status' | 'announcement';
    createdAt: string;
    read: boolean;
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    actor: string;
    entity: string;
    entityId: string;
    timestamp: string;
    details: string;
  }>;
}

function getInitialDatabase(): DatabaseSchema {
  const candidateAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdgDcW0tVbFbIuOWUVdbU8cYPLCHGs6Enk-tp5dwoWiQpulHBGDQ0ChR4bY97svyjwKzN9QolMlzSHo4nCVS1YOhe_2Z588RSMBWXrNrZlKKHeW32K7HHX7APn0BaBw8MkLrSX32IjzZEfYZ-ydgxsr5VgVDQAu_CwyzBiZf65M3JFIOObFqioMGrvf6X7VUX1YqeD_yu_9NQkCKHA-HN_FGII2yB7LV_W0iL6V4g_WSC8QFoYDhLu';
  const adminAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return {
    users: [
      {
        id: 'usr_candidate_001',
        email: 'candidate@example.com',
        password: 'password123',
        name: 'Aanya Sharma',
        role: 'candidate',
        applicationId: 'IEM-2024-001',
        avatar: candidateAvatar,
        phone: '+1 (555) 000-0000',
        createdAt: '2026-08-20T10:00:00Z',
      },
      {
        id: 'usr_candidate_002',
        email: 'rahul.verma@example.com',
        password: 'password123',
        name: 'Rahul Verma',
        role: 'candidate',
        applicationId: 'IEM-2024-002',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        phone: '+1 (555) 234-5678',
        createdAt: '2026-08-21T08:30:00Z',
      },
      {
        id: 'usr_admin_001',
        email: 'admin@iem.edu.in',
        password: 'admin123',
        name: 'Dr. S. Chatterjee (Admissions Dean)',
        role: 'admin',
        applicationId: 'IEM-STAFF-01',
        avatar: adminAvatar,
        phone: '+91 33 2357 2059',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ],
    applications: [
      {
        id: 'IEM-2024-001',
        userId: 'usr_candidate_001',
        status: 'under_review',
        currentStep: 3,
        personal: {
          fullName: 'Aanya Sharma',
          dob: '2005-06-15',
          email: 'candidate@example.com',
          phone: '+1 (555) 000-0000',
          gender: 'Female',
          category: 'General',
          bloodGroup: 'O+',
          guardianName: 'Rajesh Sharma',
          guardianPhone: '+1 (555) 987-6543',
          address: '42 Academic Avenue, Salt Lake Sector V',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700091',
        },
        academic: {
          previousInstitution: 'Delhi Public School, Ruby Park',
          yearOfPassing: '2025',
          percentageCgpa: '94.6',
          boardUniversity: 'CBSE',
          stream: 'Science (PCM + CS)',
          rollNumber: 'CBSE-2025-98214',
          entranceExam: 'WBJEE / JEE Main',
          entranceScore: '98.4 Percentile',
          entranceRank: 'AIR 1420',
        },
        course: {
          primaryCourse: 'B.Tech in Computer Science & Engineering (CSE)',
          secondaryCourse: 'B.Tech in Artificial Intelligence & Data Science',
          campusPreference: 'IEM Kolkata - Main Campus (Salt Lake)',
        },
        submittedAt: '2026-08-21T14:30:00Z',
        updatedAt: '2026-08-22T04:00:00Z',
      },
      {
        id: 'IEM-2024-002',
        userId: 'usr_candidate_002',
        status: 'merit_qualified',
        currentStep: 4,
        personal: {
          fullName: 'Rahul Verma',
          dob: '2005-09-22',
          email: 'rahul.verma@example.com',
          phone: '+1 (555) 234-5678',
          gender: 'Male',
          category: 'OBC',
          bloodGroup: 'B+',
          guardianName: 'Manoj Verma',
          guardianPhone: '+1 (555) 456-7890',
          address: '18 Park Circus Avenue',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700017',
        },
        academic: {
          previousInstitution: 'South Point High School',
          yearOfPassing: '2025',
          percentageCgpa: '96.2',
          boardUniversity: 'WBCHSE',
          stream: 'Science (Pure)',
          rollNumber: 'WB-2025-10492',
          entranceExam: 'WBJEE',
          entranceScore: '99.1 Percentile',
          entranceRank: 'State Rank 412',
        },
        course: {
          primaryCourse: 'B.Tech in Computer Science & Engineering (CSE)',
          secondaryCourse: 'B.Tech in Information Technology',
          campusPreference: 'IEM Kolkata - Main Campus',
        },
        submittedAt: '2026-08-20T11:20:00Z',
        updatedAt: '2026-08-22T03:00:00Z',
      },
    ],
    documents: [
      {
        id: 'doc_001',
        applicationId: 'IEM-2024-001',
        type: 'marksheet_12th',
        title: 'Class 12th Marksheet',
        description: 'Final board examination results.',
        fileName: 'marksheet_12th_2023.pdf',
        fileSize: '2.4MB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        status: 'verified',
        uploadedAt: '2026-08-21T14:15:00Z',
        verifiedAt: '2026-08-21T18:00:00Z',
        remarks: 'CBSE marksheet verified with official digilocker repository.',
      },
      {
        id: 'doc_002',
        applicationId: 'IEM-2024-001',
        type: 'id_proof',
        title: 'Government ID Proof',
        description: 'Aadhaar, PAN, or Passport.',
        fileName: 'aadhaar_card_front_back.pdf',
        fileSize: '1.8MB',
        fileUrl: '',
        status: 'uploaded',
        uploadedAt: '2026-08-21T14:20:00Z',
        remarks: 'Pending reviewer verification.',
      },
      {
        id: 'doc_003',
        applicationId: 'IEM-2024-001',
        type: 'photo',
        title: 'Recent Photograph',
        description: 'Passport size, white background.',
        fileName: 'candidate_photo_passport.jpg',
        fileSize: '650KB',
        fileUrl: candidateAvatar,
        status: 'verified',
        uploadedAt: '2026-08-21T14:22:00Z',
        verifiedAt: '2026-08-21T18:00:00Z',
      },
    ],
    payments: [
      {
        id: 'pay_001',
        applicationId: 'IEM-2024-001',
        transactionId: 'TXN987654321',
        amount: 50,
        currency: 'USD',
        status: 'success',
        method: 'card',
        paidAt: '2026-08-22T02:48:00Z',
        invoiceNumber: 'INV-IEM-2024-0892',
        details: {
          cardLast4: '4242',
        },
      },
    ],
    meritList: [
      {
        id: 'merit_001',
        rank: 1,
        applicationId: 'IEM-2024-019',
        candidateName: 'Sourav Ganguly Mukherjee',
        category: 'General',
        meritScore: 99.8,
        course: 'B.Tech in Computer Science & Engineering (CSE)',
        allottedSeat: 'CSE-A-001 (Round 1 Allotment)',
        status: 'Confirmed',
      },
      {
        id: 'merit_002',
        rank: 2,
        applicationId: 'IEM-2024-002',
        candidateName: 'Rahul Verma',
        category: 'OBC',
        meritScore: 99.1,
        course: 'B.Tech in Computer Science & Engineering (CSE)',
        allottedSeat: 'CSE-A-002 (Round 1 Allotment)',
        status: 'Allotted',
      },
      {
        id: 'merit_003',
        rank: 3,
        applicationId: 'IEM-2024-054',
        candidateName: 'Debasmita Roy',
        category: 'General',
        meritScore: 98.9,
        course: 'B.Tech in Artificial Intelligence & Data Science',
        allottedSeat: 'AIDS-001 (Round 1 Allotment)',
        status: 'Confirmed',
      },
      {
        id: 'merit_004',
        rank: 4,
        applicationId: 'IEM-2024-001',
        candidateName: 'Aanya Sharma',
        category: 'General',
        meritScore: 98.4,
        course: 'B.Tech in Computer Science & Engineering (CSE)',
        allottedSeat: 'CSE-A-004 (Provisional / Pending Docs)',
        status: 'Allotted',
      },
      {
        id: 'merit_005',
        rank: 5,
        applicationId: 'IEM-2024-077',
        candidateName: 'Arjun Sen',
        category: 'SC',
        meritScore: 97.8,
        course: 'B.Tech in Electronics & Communication (ECE)',
        allottedSeat: 'ECE-001 (Round 1 Allotment)',
        status: 'Allotted',
      },
      {
        id: 'merit_006',
        rank: 6,
        applicationId: 'IEM-2024-112',
        candidateName: 'Priyanka Ghosh',
        category: 'General',
        meritScore: 97.2,
        course: 'B.Tech in Information Technology',
        allottedSeat: 'IT-001 (Round 1 Allotment)',
        status: 'Waiting List',
      },
      {
        id: 'merit_007',
        rank: 7,
        applicationId: 'IEM-2024-143',
        candidateName: 'Tanmay Das',
        category: 'ST',
        meritScore: 96.5,
        course: 'B.Tech in Computer Science & Engineering (CSE)',
        allottedSeat: 'CSE-B-001 (Reserved Quota)',
        status: 'Allotted',
      },
    ],
    notifications: [
      {
        id: 'notif_001',
        userId: 'usr_candidate_001',
        title: 'Fee Payment Successful',
        message: 'Your application fee of $50 has been successfully processed. Transaction ID: TXN987654321.',
        type: 'payment',
        createdAt: '2026-08-22T02:48:00Z',
        read: false,
      },
      {
        id: 'notif_002',
        userId: 'usr_candidate_001',
        title: 'Documents Uploaded',
        message: 'High School Transcripts and ID Proof have been uploaded and are pending verification.',
        type: 'document',
        createdAt: '2026-08-21T14:22:00Z',
        read: true,
      },
      {
        id: 'notif_003',
        userId: 'usr_candidate_001',
        title: 'Admission Portal Open for 2026 Cycle',
        message: 'Welcome to the IEM 2026 Admissions. Complete all 4 phases before the priority cutoff date.',
        type: 'announcement',
        createdAt: '2026-08-20T10:00:00Z',
        read: true,
      },
    ],
    auditLogs: [
      {
        id: 'log_001',
        action: 'USER_LOGIN',
        actor: 'candidate@example.com',
        entity: 'auth',
        entityId: 'usr_candidate_001',
        timestamp: '2026-08-22T04:45:00Z',
        details: 'Candidate logged in successfully from client session.',
      },
      {
        id: 'log_002',
        action: 'PAYMENT_PROCESSED',
        actor: 'PAYMENT_GATEWAY',
        entity: 'payments',
        entityId: 'pay_001',
        timestamp: '2026-08-22T02:48:00Z',
        details: 'Transaction TXN987654321 captured for $50 via Stripe/Card simulation.',
      },
      {
        id: 'log_003',
        action: 'DOC_VERIFIED',
        actor: 'admin@iem.edu.in',
        entity: 'documents',
        entityId: 'doc_001',
        timestamp: '2026-08-21T18:00:00Z',
        details: 'Class 12th marksheet marked as Verified by Admissions Staff.',
      },
    ],
  };
}

// Database helper functions
function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database, restoring seed:', error);
    const initial = getInitialDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeDatabase(db: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

function addAuditLog(action: string, actor: string, entity: string, entityId: string, details: string) {
  const db = readDatabase();
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    action,
    actor,
    entity,
    entityId,
    timestamp: new Date().toISOString(),
    details,
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 200) db.auditLogs.pop();
  writeDatabase(db);
}

// ==========================================
// REST API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0-iem-portal' });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'User not found with this email address' });
  }

  if (user.password && password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid password. Try "password123" for candidate or "admin123" for admin.' });
  }

  addAuditLog('USER_LOGIN', user.email, 'users', user.id, `User logged in as ${user.role}`);
  
  const application = db.applications.find(a => a.userId === user.id || a.id === user.applicationId);
  const { password: _, ...userSafe } = user;

  res.json({
    user: userSafe,
    application,
    token: `iem_token_${user.id}_${Date.now()}`,
  });
});

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password, phone, coursePreference } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: 'Full name and email are required.' });
  }

  const db = readDatabase();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newAppNumber = db.applications.length + 1;
  const appId = `IEM-2026-${String(newAppNumber).padStart(3, '0')}`;
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newUser = {
    id: userId,
    email,
    password: password || 'password123',
    name: fullName,
    role: 'candidate' as const,
    applicationId: appId,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdgDcW0tVbFbIuOWUVdbU8cYPLCHGs6Enk-tp5dwoWiQpulHBGDQ0ChR4bY97svyjwKzN9QolMlzSHo4nCVS1YOhe_2Z588RSMBWXrNrZlKKHeW32K7HHX7APn0BaBw8MkLrSX32IjzZEfYZ-ydgxsr5VgVDQAu_CwyzBiZf65M3JFIOObFqioMGrvf6X7VUX1YqeD_yu_9NQkCKHA-HN_FGII2yB7LV_W0iL6V4g_WSC8QFoYDhLu',
    phone: phone || '+1 (555) 000-0000',
    createdAt: new Date().toISOString(),
  };

  const newApp = {
    id: appId,
    userId,
    status: 'draft' as const,
    currentStep: 1 as const,
    personal: {
      fullName,
      dob: '2006-01-01',
      email,
      phone: phone || '',
      gender: 'Not Specified',
      category: 'General',
      bloodGroup: 'O+',
      guardianName: '',
      guardianPhone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
    academic: {
      previousInstitution: '',
      yearOfPassing: '2025',
      percentageCgpa: '',
      boardUniversity: 'CBSE',
      stream: 'Science',
      rollNumber: '',
      entranceExam: 'JEE / WBJEE',
      entranceScore: '',
      entranceRank: '',
    },
    course: {
      primaryCourse: coursePreference || 'B.Tech in Computer Science & Engineering (CSE)',
      secondaryCourse: 'B.Tech in Artificial Intelligence & Data Science',
      campusPreference: 'IEM Kolkata - Main Campus',
    },
    submittedAt: null,
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  db.applications.push(newApp);

  // Add welcome notification
  db.notifications.push({
    id: `notif_${Date.now()}`,
    userId,
    title: 'Registration Successful',
    message: `Welcome ${fullName}! Your Application ID is ${appId}. Please fill in your profile details to proceed.`,
    type: 'announcement',
    createdAt: new Date().toISOString(),
    read: false,
  });

  writeDatabase(db);
  addAuditLog('USER_REGISTERED', email, 'users', userId, `Registered with Application ID ${appId}`);

  const { password: _, ...userSafe } = newUser;
  res.json({
    user: userSafe,
    application: newApp,
    token: `iem_token_${userId}_${Date.now()}`,
  });
});

// Application details
app.get('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const appData = db.applications.find(a => a.id === id || a.userId === id);
  if (!appData) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json(appData);
});

app.put('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const { personal, academic, course, currentStep, status } = req.body;
  const db = readDatabase();
  const index = db.applications.findIndex(a => a.id === id || a.userId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const existing = db.applications[index];
  db.applications[index] = {
    ...existing,
    personal: personal ? { ...existing.personal, ...personal } : existing.personal,
    academic: academic ? { ...existing.academic, ...academic } : existing.academic,
    course: course ? { ...existing.course, ...course } : existing.course,
    currentStep: currentStep ?? existing.currentStep,
    status: status ?? existing.status,
    updatedAt: new Date().toISOString(),
  };

  writeDatabase(db);
  addAuditLog('APPLICATION_UPDATED', existing.userId, 'applications', existing.id, 'Application form details updated');
  res.json(db.applications[index]);
});

app.post('/api/applications/submit', (req, res) => {
  const { applicationId } = req.body;
  const db = readDatabase();
  const index = db.applications.findIndex(a => a.id === applicationId);

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  db.applications[index].status = 'under_review';
  db.applications[index].submittedAt = new Date().toISOString();
  db.applications[index].updatedAt = new Date().toISOString();

  // Add notification
  db.notifications.push({
    id: `notif_${Date.now()}`,
    userId: db.applications[index].userId,
    title: 'Application Submitted for Review',
    message: `Your application ${applicationId} is now Under Review by our admissions committee.`,
    type: 'status',
    createdAt: new Date().toISOString(),
    read: false,
  });

  writeDatabase(db);
  addAuditLog('APPLICATION_SUBMITTED', db.applications[index].userId, 'applications', applicationId, 'Application submitted for official review');
  res.json({ success: true, application: db.applications[index] });
});

// Document endpoints
app.get('/api/documents/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const db = readDatabase();
  const docs = db.documents.filter(d => d.applicationId === applicationId);
  res.json(docs);
});

app.post('/api/documents/upload', (req, res) => {
  const { applicationId, type, title, description, fileName, fileSize, fileUrl } = req.body;
  if (!applicationId || !type || !fileName) {
    return res.status(400).json({ error: 'Missing required document fields' });
  }

  const db = readDatabase();
  // Check if replacing an existing doc of same type
  const existingIdx = db.documents.findIndex(d => d.applicationId === applicationId && d.type === type);
  
  const newDoc = {
    id: existingIdx >= 0 ? db.documents[existingIdx].id : `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    applicationId,
    type,
    title: title || type,
    description: description || '',
    fileName,
    fileSize: fileSize || '1.5MB',
    fileUrl: fileUrl || '',
    status: 'uploaded' as const,
    uploadedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    db.documents[existingIdx] = newDoc;
  } else {
    db.documents.push(newDoc);
  }

  // Update application timestamp
  const appIdx = db.applications.findIndex(a => a.id === applicationId);
  if (appIdx >= 0) {
    db.applications[appIdx].updatedAt = new Date().toISOString();
  }

  writeDatabase(db);
  addAuditLog('DOCUMENT_UPLOADED', applicationId, 'documents', newDoc.id, `Uploaded ${fileName} (${type})`);
  res.json({ success: true, document: newDoc });
});

app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const doc = db.documents.find(d => d.id === id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  db.documents = db.documents.filter(d => d.id !== id);
  writeDatabase(db);
  addAuditLog('DOCUMENT_DELETED', doc.applicationId, 'documents', id, `Removed document ${doc.fileName}`);
  res.json({ success: true, message: 'Document removed' });
});

app.post('/api/documents/:id/verify', (req, res) => {
  const { id } = req.params;
  const { status, remarks, reviewer } = req.body;
  const db = readDatabase();
  const doc = db.documents.find(d => d.id === id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  doc.status = status || 'verified';
  doc.verifiedAt = new Date().toISOString();
  if (remarks) doc.remarks = remarks;

  writeDatabase(db);
  addAuditLog('DOCUMENT_VERIFIED', reviewer || 'admin', 'documents', id, `Status updated to ${doc.status}`);
  res.json({ success: true, document: doc });
});

// Payments
app.get('/api/payments/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const db = readDatabase();
  const paymentList = db.payments.filter(p => p.applicationId === applicationId);
  res.json(paymentList);
});

app.post('/api/payments/pay', (req, res) => {
  const { applicationId, amount = 50, method = 'card', details = {} } = req.body;
  if (!applicationId) {
    return res.status(400).json({ error: 'applicationId is required' });
  }

  const db = readDatabase();
  const txnId = `TXN${Math.floor(100000000 + Math.random() * 900000000)}`;
  const invNumber = `INV-IEM-2024-${Math.floor(1000 + Math.random() * 9000)}`;

  const paymentRecord = {
    id: `pay_${Date.now()}`,
    applicationId,
    transactionId: txnId,
    amount: Number(amount),
    currency: 'USD',
    status: 'success' as const,
    method: method as any,
    paidAt: new Date().toISOString(),
    invoiceNumber: invNumber,
    details: details || { cardLast4: '4242' },
  };

  db.payments.push(paymentRecord);

  // Notify candidate
  const appObj = db.applications.find(a => a.id === applicationId);
  if (appObj) {
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: appObj.userId,
      title: 'Fee Payment Successful',
      message: `Your application fee of $${amount} has been successfully processed. Transaction ID: ${txnId}.`,
      type: 'payment',
      createdAt: new Date().toISOString(),
      read: false,
    });
  }

  writeDatabase(db);
  addAuditLog('PAYMENT_PROCESSED', applicationId, 'payments', paymentRecord.id, `Payment $${amount} verified via ${method}`);
  res.json({ success: true, payment: paymentRecord });
});

// Merit List
app.get('/api/merit-list', (req, res) => {
  const { course, search } = req.query;
  const db = readDatabase();
  let list = [...db.meritList];

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

// Notifications
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDatabase();
  const notifs = db.notifications.filter(n => n.userId === userId || n.userId === 'all');
  res.json(notifs);
});

app.post('/api/notifications/mark-read', (req, res) => {
  const { id, userId } = req.body;
  const db = readDatabase();
  if (id) {
    const n = db.notifications.find(x => x.id === id);
    if (n) n.read = true;
  } else if (userId) {
    db.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
  }
  writeDatabase(db);
  res.json({ success: true });
});

// ==========================================
// DATABASE WORKING & EXPLORER API
// ==========================================

app.get('/api/database/summary', (req, res) => {
  const db = readDatabase();
  const stats = {
    totalUsers: db.users.length,
    totalApplications: db.applications.length,
    totalDocuments: db.documents.length,
    totalPayments: db.payments.length,
    meritListCount: db.meritList.length,
    verifiedDocsCount: db.documents.filter(d => d.status === 'verified').length,
    totalRevenue: db.payments.reduce((acc, p) => acc + (p.status === 'success' ? p.amount : 0), 0),
    fileSizeKB: Math.round(JSON.stringify(db).length / 1024),
  };
  res.json(stats);
});

app.get('/api/database/tables', (req, res) => {
  const db = readDatabase();
  const tables = [
    { name: 'users', rowCount: db.users.length, primaryKey: 'id', description: 'Registered applicant & administrator credentials and roles' },
    { name: 'applications', rowCount: db.applications.length, primaryKey: 'id', description: 'Academic, personal, and course preference records' },
    { name: 'documents', rowCount: db.documents.length, primaryKey: 'id', description: 'Uploaded candidate identity proofs, marksheets, and photos' },
    { name: 'payments', rowCount: db.payments.length, primaryKey: 'id', description: 'Processed application fee transactions and invoices' },
    { name: 'meritList', rowCount: db.meritList.length, primaryKey: 'id', description: 'Published rank orders, percentile scores, and seat allotments' },
    { name: 'notifications', rowCount: db.notifications.length, primaryKey: 'id', description: 'Candidate action notifications and admissions bulletins' },
    { name: 'auditLogs', rowCount: db.auditLogs.length, primaryKey: 'id', description: 'Immutable transaction and modification event history' },
  ];
  res.json(tables);
});

app.get('/api/database/tables/:name', (req, res) => {
  const { name } = req.params;
  const db = readDatabase();
  if (name in db) {
    res.json((db as any)[name]);
  } else {
    res.status(404).json({ error: `Table '${name}' not found` });
  }
});

// Interactive SQL & Query Runner Simulation for Database Demonstrations
app.post('/api/database/query', (req, res) => {
  const { query } = req.body;
  const db = readDatabase();
  const startTime = Date.now();

  const q = (query || '').trim();
  let result: any = [];
  let affectedRows = 0;

  try {
    const lower = q.toLowerCase();
    if (lower.startsWith('select * from users')) {
      result = db.users.map(({ password, ...rest }) => rest);
    } else if (lower.startsWith('select * from applications')) {
      result = db.applications;
    } else if (lower.startsWith('select * from documents')) {
      result = db.documents;
    } else if (lower.startsWith('select * from payments')) {
      result = db.payments;
    } else if (lower.startsWith('select * from meritlist') || lower.startsWith('select * from merit_list')) {
      result = db.meritList;
    } else if (lower.startsWith('select * from auditlogs') || lower.startsWith('select * from audit_logs')) {
      result = db.auditLogs;
    } else if (lower.includes('where status =') || lower.includes("where status='")) {
      // Basic filter simulation
      const tableName = Object.keys(db).find(t => lower.includes(`from ${t.toLowerCase()}`));
      if (tableName) {
        const rows: any[] = (db as any)[tableName];
        result = rows;
      } else {
        result = db.applications;
      }
    } else {
      // General match
      const tableName = Object.keys(db).find(t => lower.includes(t.toLowerCase()));
      if (tableName) {
        result = (db as any)[tableName];
      } else {
        result = {
          message: 'Query executed against IEM Central Relational Store',
          availableTables: Object.keys(db),
          quickQueries: [
            'SELECT * FROM applications WHERE status = "under_review"',
            'SELECT * FROM documents WHERE status = "verified"',
            'SELECT * FROM payments ORDER BY paidAt DESC',
            'SELECT * FROM meritList ORDER BY rank ASC',
          ],
        };
      }
    }

    const executionTimeMs = Date.now() - startTime;
    res.json({
      query: q,
      executionTimeMs,
      rowCount: Array.isArray(result) ? result.length : 1,
      rows: result,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin state transition & DB actions
app.post('/api/database/admin/action', (req, res) => {
  const { action, payload } = req.body;
  const db = readDatabase();

  switch (action) {
    case 'CHANGE_APPLICATION_STATUS': {
      const { applicationId, status } = payload;
      const appItem = db.applications.find(a => a.id === applicationId);
      if (appItem) {
        appItem.status = status;
        appItem.updatedAt = new Date().toISOString();
        addAuditLog('STATUS_CHANGE', 'Admissions Dean', 'applications', applicationId, `Status moved to ${status}`);
        writeDatabase(db);
        return res.json({ success: true, message: `Application ${applicationId} status updated to ${status}` });
      }
      return res.status(404).json({ error: 'Application not found' });
    }

    case 'VERIFY_ALL_DOCUMENTS': {
      const { applicationId } = payload;
      db.documents.forEach(d => {
        if (d.applicationId === applicationId) {
          d.status = 'verified';
          d.verifiedAt = new Date().toISOString();
        }
      });
      const appItem = db.applications.find(a => a.id === applicationId);
      if (appItem) {
        appItem.status = 'docs_verified';
      }
      addAuditLog('DOCS_VERIFIED_ALL', 'Admissions Dean', 'applications', applicationId, 'All uploaded documents verified');
      writeDatabase(db);
      return res.json({ success: true, message: `All documents for ${applicationId} have been verified!` });
    }

    case 'ALLOT_SEAT': {
      const { applicationId, course, seatNumber } = payload;
      const meritItem = db.meritList.find(m => m.applicationId === applicationId);
      if (meritItem) {
        meritItem.allottedSeat = seatNumber;
        meritItem.status = 'Allotted';
      }
      const appItem = db.applications.find(a => a.id === applicationId);
      if (appItem) {
        appItem.status = 'seat_allotted';
      }
      addAuditLog('SEAT_ALLOTTED', 'Admissions Committee', 'meritList', applicationId, `Seat ${seatNumber} allocated for ${course}`);
      writeDatabase(db);
      return res.json({ success: true, message: `Seat ${seatNumber} allotted to ${applicationId}` });
    }

    case 'RESET_DATABASE': {
      const initial = getInitialDatabase();
      writeDatabase(initial);
      addAuditLog('DATABASE_RESET', 'SYSTEM_ADMIN', 'database', 'all', 'Database restored to clean default seed state');
      return res.json({ success: true, message: 'Database reset to initial demo state successfully' });
    }

    default:
      return res.status(400).json({ error: `Unknown action: ${action}` });
  }
});

// ==========================================
// VITE / STATIC SERVING
// ==========================================
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
    console.log(`IEM Admission Portal Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
