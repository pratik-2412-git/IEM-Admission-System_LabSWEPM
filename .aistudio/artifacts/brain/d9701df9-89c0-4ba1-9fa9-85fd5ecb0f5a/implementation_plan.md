# IEM Admission System — Application Form Enhancements, Admin Verification & Lifecycle Fixes

This plan establishes the concrete technical blueprint for expanding the student application form (comprehensive Class 10 & 12 qualifications, conditional entrance examination scores, and three distinct course preferences), implementing the persistent green tick submission confirmation, enforcing strict lifecycle checkmark criteria, building a read-only admin application scrutiny view with per-document verification, and restricting departmental seat allotments strictly to the candidate's three submitted preferences.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been confirmed via Phase 1 clarification:
>
> 1. **Green Tick Submission Indicator**: Displayed both beside the "Submit Application / Admission Status" navigation item in the sidebar and stepper, and prominently inside the review card once the application status is `submitted` or beyond (retrieved from the backend/Supabase, preventing frontend-only transient state).
> 2. **Department Allotment & Seat Codes**: The Admin seat allotment dropdown will restrict choices strictly to the candidate's three selected preferences (`preference_1`, `preference_2`, `preference_3`). The system will auto-suggest unique departmental seat codes (e.g. `CSE-2026-004`) while allowing the administrator to edit or customize the code, with automatic duplicate conflict validation.
> 3. **Strict Read-Only Admin Overview**: Admissions staff can review all candidate personal data, Class 10/12 academic marks, entrance exam percentiles/ranks, and course preferences in an un-editable inspection mode. Administrators verify documents, request corrections with remarks, approve applications, enter merit ranks, and allot seats, but cannot alter the student's submitted information.
> 4. **Exact Admission Lifecycle Logic**: Each of the 5 dashboard milestones ticks ONLY when its explicit backend conditions are fulfilled:
>    - *01 Registration*: Ticked when user profile is verified via OTP.
>    - *02 Form Entry*: Ticked only when mandatory personal, Class 10 & 12 academics, entrance exam, 3 preferences, documents, and final submission are completed.
>    - *03 Verification*: Ticked only when all mandatory documents are marked VERIFIED and the complete application is approved by the admin.
>    - *04 Merit Rank*: Ticked only when the admin has saved the candidate's actual allotted merit rank in Supabase.
>    - *05 Allotment*: Ticked only when the admin has allotted a programme from the candidate's 3 preferences and saved the seat allocation in Supabase.

---

## 1. Overview & Core Concept

- **What It Delivers**: 
  1. A rich, multi-tiered application form collecting granular Class 10 and Class 12 board marks with real-time percentage computation.
  2. Dynamic conditional entrance examination fields (JEE Main 2026 percentile & rank, WBJEE rank, IEMJEE rank) based on Yes/No selection.
  3. Ordered, mutually exclusive 3-course preference selection across all 18 institutional IEM departments, preventing duplicate choices.
  4. Authoritative backend-driven green tick confirmation for submitted applications.
  5. An unalterable, comprehensive read-only applicant scrutiny view for admissions administrators.
  6. Per-document verification (**VERIFIED** vs **SCRUTINIZE / REQUEST CORRECTION** with remarks).
  7. Merit rank entry and preference-bound departmental seat allocation.
  8. Synchronized real-time lifecycle tracking across student and administrator dashboards.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                      STUDENT APPLICATION WORKFLOW                      │
│                                                                        │
│  [ Step 1: Personal Details ]                                          │
│       │                                                                │
│       ▼                                                                │
│  [ Step 2: Academic Qualifications ]                                   │
│       • Class 10: School, Board, Year, Full Marks, Marks Obtained, %   │
│       • Class 12: School, Board, Stream, Year, Marks, Marks Obtained,%│
│       │ (Auto-calculated percentage & marks validation)                │
│       ▼                                                                │
│  [ Step 3: Entrance Examination Details ]                              │
│       • JEE Main 2026? [Yes/No] ──► (If Yes: Percentile & AIR Rank)    │
│       • WBJEE? [Yes/No] ──────────► (If Yes: WBJEE Rank)               │
│       • IEMJEE? [Yes/No] ─────────► (If Yes: IEMJEE Rank)              │
│       │                                                                │
│       ▼                                                                │
│  [ Step 4: Course Selection — 3 Preferences ]                          │
│       • First Preference:  [ Select from 18 IEM Departments ]          │
│       • Second Preference: [ Remaining 17 options (No duplicates) ]    │
│       • Third Preference:  [ Remaining 16 options (No duplicates) ]    │
│       │                                                                │
│       ▼                                                                │
│  [ Step 5: Document Upload ]                                           │
│       • Class 10 & 12 Marksheets, ID Proof, Photo                      │
│       │                                                                │
│       ▼                                                                │
│  [ Step 6: Fee & Final Submission ] ──► [ GREEN TICK CONFIRMATION ]    │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Submitted to Supabase
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ADMIN SCRUTINY WORKFLOW                         │
│                                                                        │
│  [ 1. Read-Only Applicant Inspection ]                                 │
│       • Personal Data (Read-only)                                      │
│       • Class 10 & 12 Marks, Boards, Percentages (Read-only)           │
│       • Entrance Exam Percentiles & Ranks (Read-only)                  │
│       • 3 Preferences in Exact Order (Read-only)                       │
│                                                                        │
│  [ 2. Per-Document Scrutiny ]                                          │
│       • [ VERIFIED ] ──► Green verified status & timestamp             │
│       • [ SCRUTINIZE ] ──► Prompts for remarks, notifies student to fix│
│                                                                        │
│  [ 3. Application Approval ]                                           │
│       • Enabled only once all mandatory documents are VERIFIED         │
│                                                                        │
│  [ 4. Merit Rank & Seat Allotment ]                                    │
│       • Enter Allotted Merit Rank (completes Stage 04)                 │
│       • Allot Department: DROPDOWN CONSTRAINED TO CANDIDATE'S 3 CHOICES│
│       • Auto-suggested seat code with conflict check (completes Step 05│
└────────────────────────────────────────────────────────────────────────┘
```

1. **Student Application Form**:
   - **Academic Qualifications Card**: Clean tabular input sections for Class 10 and Class 12. Real-time percentage math ($(\text{Marks Obtained} / \text{Full Marks}) \times 100$). Validation prevents marks obtained exceeding full marks.
   - **Entrance Exam Card**: Distinct toggle blocks for JEE Main 2026, WBJEE, and IEMJEE. Selecting "Yes" opens percentile and rank inputs. Selecting "No" cleanly clears and hides those fields.
   - **Three Preferences Card**: Dropdowns populated with all 18 official IEM engineering programs:
     `CSE`, `ECE`, `IT`, `EE`, `EEE`, `ME`, `AI`, `AIML`, `IOT`, `IOT CSBT`, `CSBS`, `DATA SCIENCE`, `CSIT`, `CST`, `CSE CYBERSECURITY`, `CSE NETWORKS`, `ROBOTICS & AI`, `BIOTECHNOLOGY`.
     Selecting Preference 1 removes that item from Preference 2; selecting Preference 2 removes both from Preference 3.
   - **Submission Confirmation**: Green tick rendered in the sidebar navigation item (`Admission Status ✓`), stepper badge, and review view once status is `submitted` or higher.

2. **Admin Scrutiny & Allotment Console**:
   - **Read-Only Inspection**: Candidate profile, Class 10/12 marks, entrance exam scores, and 3 preferences are presented in structured review cards without input fields or edit buttons.
   - **Document Review**: Individual buttons for **VERIFIED** and **SCRUTINIZE**. Scrutinize opens a remark dialog; submitted remarks set document status to `correction_required` and application to `correction_required`, prompting student re-upload.
   - **Merit Rank & Seat Allotment Section**:
     - *Allotted Merit Rank*: Numeric rank entry.
     - *Allotted Department*: Dropdown containing **only** Preference 1, Preference 2, and Preference 3 of that candidate.
     - *Seat Code*: Auto-suggests `[DEPT]-2026-[RANK]` with manual edit option. Prevents duplicate seat allocations.
     - *Save Allotment Button*: Writes records to Supabase, updating student lifecycle Stage 04 (Merit Rank) and Stage 05 (Seat Allotment).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Course Preference Storage Schema
- **Chosen Approach**: Store preferences both as structured database columns (`preference_1`, `preference_2`, `preference_3` in `applications`) and in the `course` JSON/object (`preferences: [pref1, pref2, pref3]`), with `course.primaryCourse = preference_1`.
- **Why**: Ensures backward compatibility with existing views while providing first-class columns for SQL queries and Supabase schema constraints.

### Decision 2: Academic & Exam Schema Extension
- **Chosen Approach**: Add `class_10_details`, `class_12_details`, and `entrance_exam_details` JSONB fields/columns to `public.applications` in `supabase/schema.sql`, alongside normalized JSON persistence in `server.ts`.
- **Why**: Allows arbitrary board structures and conditional exam scores without altering existing baseline application schemas or breaking earlier submissions.

### Decision 3: Department Allotment Restriction
- **Chosen Approach**: Filter the department allotment select box to strictly:
  `[application.preferences.preference_1, application.preferences.preference_2, application.preferences.preference_3]`.
  Enforce this constraint on both the frontend UI and the backend API (`/api/admin/seat-allotment`), returning an error if an administrator attempts to allot a programme outside the candidate's chosen three preferences.
- **Why**: Strictly adheres to the institutional admissions rule that candidates can only be seated in programmes they selected.

---

## 4. Technical Architecture & Data Strategy

### Extended Schema Definitions

```sql
-- 1. Extend public.applications in Supabase
ALTER TABLE public.applications 
  ADD COLUMN IF NOT EXISTS class_10_details JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS class_12_details JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS entrance_exam_details JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS preference_1 TEXT,
  ADD COLUMN IF NOT EXISTS preference_2 TEXT,
  ADD COLUMN IF NOT EXISTS preference_3 TEXT,
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- 2. Ensure documents table supports admin remarks and scrutiny timestamps
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id);
```

### Data Structures (`src/types.ts`)

```typescript
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

export interface EntranceExamDetails {
  jeeMain: {
    appeared: boolean;
    percentile?: string;
    rank?: string;
  };
  wbjee: {
    appeared: boolean;
    rank?: string;
  };
  iemjee: {
    appeared: boolean;
    rank?: string;
  };
}

export interface CoursePreferences {
  preference_1: string;
  preference_2: string;
  preference_3: string;
}
```

---

## 5. Implementation Sequence & Testing Plan

1. **Schema & Backend Updates (`supabase/schema.sql`, `server.ts`, `src/types.ts`)**:
   - Update `types.ts` with Class 10, Class 12, Entrance Exams, and 3 Course Preferences.
   - Update `server.ts` to store and format `class_10_details`, `class_12_details`, `entrance_exam_details`, and `preference_1/2/3`.
   - Update `/api/admin/seat-allotment` to enforce that allotted course must be one of `[preference_1, preference_2, preference_3]`.
   - Add verification timestamp and admin ID tracking.

2. **Application Form Component (`src/components/ApplicationFormView.tsx`)**:
   - Build Class 10 Qualification block with auto-calculated percentage.
   - Build Class 12 Qualification block with auto-calculated percentage.
   - Build Entrance Examination Details block with conditional Yes/No visibility for JEE Main, WBJEE, and IEMJEE.
   - Build 3 Course Preferences dropdowns using the 18 specified IEM departments with dynamic mutual exclusion (disabling already chosen options).
   - Ensure draft save and next step persist all fields cleanly.

3. **Green Tick Confirmation (`src/components/Sidebar.tsx`, `src/components/SubmitReviewView.tsx`, `src/components/DashboardView.tsx`)**:
   - Check if `application.status !== 'draft'` (e.g. `submitted`, `under_review`, `approved`, `seat_allotted`, `admission_confirmed`).
   - If confirmed by backend, render a green tick badge beside "Admission Status / Submit" in Sidebar, Stepper, and Review view.

4. **Strict Read-Only Admin Overview (`src/components/AdminPortalView.tsx`)**:
   - Display applicant Personal Details, Class 10, Class 12, Entrance Exams, and 3 Preferences in clean read-only inspection cards.
   - Implement **VERIFIED** and **SCRUTINIZE** buttons per document.
   - Add Merit Rank & Seat Allotment section inside the applicant inspection drawer with department dropdown restricted strictly to the candidate's 3 preferences.

5. **Lifecycle Stepper Logic (`src/components/DashboardView.tsx`)**:
   - Stage 01 (Registration): Checked if user exists and OTP verified.
   - Stage 02 (Form Entry): Checked only when application status is `submitted` or beyond.
   - Stage 03 (Verification): Checked only when all documents are verified and application is `approved` or beyond.
   - Stage 04 (Merit Rank): Checked only when candidate has a merit rank recorded in Supabase.
   - Stage 05 (Allotment): Checked only when candidate has a seat allotted in Supabase.

6. **Verification & Testing**:
   - Run `compile_applet` and `lint_applet`.
   - Test full student submission $\rightarrow$ check green tick $\rightarrow$ check read-only admin inspection $\rightarrow$ verify documents $\rightarrow$ assign merit rank $\rightarrow$ allot department from the 3 preferences $\rightarrow$ verify student dashboard lifecycle completion.
