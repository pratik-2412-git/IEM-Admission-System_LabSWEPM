import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileCheck2, 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Download, 
  LogOut, 
  ShieldCheck, 
  GraduationCap, 
  Eye, 
  Building2,
  RefreshCw,
  X,
  Send,
  Check,
  Edit3
} from 'lucide-react';
import { User, DocumentItem } from '../types';
import { IEM_COURSE_LABELS } from './ApplicationFormView';

interface AdminApplicant {
  id: string;
  applicationNumber: string;
  studentId: string;
  candidateName: string;
  email: string;
  phone: string;
  course: string;
  department: string;
  preference1?: string;
  preference2?: string;
  preference3?: string;
  preferences?: string[];
  class10?: any;
  class12?: any;
  entranceExams?: any;
  status: string;
  submittedAt: string | null;
  updatedAt: string;
  totalDocs: number;
  pendingDocs: number;
  approvedDocs: number;
  rejectedDocs: number;
  isPaid: boolean;
  meritRank: number | null;
  meritScore: number | null;
  allottedSeat: string | null;
  adminRemarks?: string;
}

interface AdminPortalViewProps {
  user: User;
  onLogout: () => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  onOpenDatabaseExplorer?: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  user,
  onLogout,
  onPreviewDocument,
  onOpenDatabaseExplorer,
}) => {
  const [activeTab, setActiveTab] = useState<'applicants' | 'merit_allotment'>('applicants');
  const [applicants, setApplicants] = useState<AdminApplicant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Selected applicant for scrutiny drawer
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [applicantDetail, setApplicantDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Document scrutiny / reject modal
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [docRejectRemarks, setDocRejectRemarks] = useState('');
  const [rejectingAppModal, setRejectingAppModal] = useState(false);
  const [appRejectRemarks, setAppRejectRemarks] = useState('');

  // Merit Rank assignment modal
  const [meritModalApp, setMeritModalApp] = useState<AdminApplicant | null>(null);
  const [inputMeritRank, setInputMeritRank] = useState<string>('');
  const [inputMeritScore, setInputMeritScore] = useState<string>('');
  const [meritSaving, setMeritSaving] = useState(false);

  // Seat Allotment modal state
  const [allottingApp, setAllottingApp] = useState<AdminApplicant | null>(null);
  const [allotCourse, setAllotCourse] = useState('CSE');
  const [allotSeatCode, setAllotSeatCode] = useState('CSE-2026-001');
  const [allotCampus, setAllotCampus] = useState('IEM Kolkata Main Campus (Salt Lake)');
  const [allotError, setAllotError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/applicants', window.location.origin);
      if (searchQuery) url.searchParams.set('q', searchQuery);
      if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicantDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/applicants/${id}`);
      if (res.ok) {
        const data = await res.json();
        setApplicantDetail(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    if (selectedAppId) {
      fetchApplicantDetail(selectedAppId);
    } else {
      setApplicantDetail(null);
    }
  }, [selectedAppId]);

  // Handle document scrutiny action (VERIFIED or SCRUTINIZE / REQUEST CORRECTION)
  const handleVerifyDocument = async (
    docId: string, 
    status: 'approved' | 'rejected' | 'correction_required', 
    remarks?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/documents/${docId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          remarks, 
          adminId: user?.id || 'usr_admin_001' 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update document status');

      setActionSuccess(
        status === 'approved' 
          ? 'Document officially marked as APPROVED.' 
          : 'Document marked as CORRECTION REQUIRED.'
      );
      setTimeout(() => setActionSuccess(null), 3500);

      if (selectedAppId) {
        await fetchApplicantDetail(selectedAppId);
      }
      await fetchApplicants();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle application level approval
  const handleApproveApplication = async (appId: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approval failed');

      setActionSuccess(`Application ${appId} credentials officially approved!`);
      setTimeout(() => setActionSuccess(null), 3500);

      if (selectedAppId) await fetchApplicantDetail(selectedAppId);
      await fetchApplicants();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle application level rejection
  const handleRejectApplication = async (appId: string) => {
    if (!appRejectRemarks.trim()) {
      alert('Please enter a clear administrative reason for rejecting this application.');
      return;
    }
    try {
      const res = await fetch(`/api/admin/applications/${appId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks: appRejectRemarks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');

      setRejectingAppModal(false);
      setAppRejectRemarks('');
      setActionSuccess('Application marked as rejected.');
      setTimeout(() => setActionSuccess(null), 3500);

      if (selectedAppId) await fetchApplicantDetail(selectedAppId);
      await fetchApplicants();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Merit Rank assignment
  const handleSaveMeritRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meritModalApp || !inputMeritRank) return;

    setMeritSaving(true);
    try {
      const res = await fetch(`/api/admin/applications/${meritModalApp.id}/merit-rank`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meritRank: Number(inputMeritRank),
          academicScore: inputMeritScore ? Number(inputMeritScore) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save merit rank');

      setActionSuccess(`Merit Rank #${inputMeritRank} recorded for ${meritModalApp.applicationNumber}`);
      setTimeout(() => setActionSuccess(null), 3500);

      setMeritModalApp(null);
      if (selectedAppId) await fetchApplicantDetail(selectedAppId);
      await fetchApplicants();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setMeritSaving(false);
    }
  };

  // Open Seat Allotment modal constrained strictly to candidate's 3 preferences
  const openSeatAllotment = (app: AdminApplicant, defaultRank = 1) => {
    setAllottingApp(app);
    setAllotError(null);

    // Extract strictly the candidate's three preferences
    const candidatePrefs = (app.preferences && app.preferences.length > 0)
      ? app.preferences
      : [app.preference1 || app.course, app.preference2, app.preference3].filter(Boolean) as string[];

    const firstPref = candidatePrefs[0] || 'CSE';
    setAllotCourse(firstPref);

    const rankForSeat = app.meritRank || defaultRank;
    const suggestedSeatCode = `${firstPref}-2026-${String(rankForSeat).padStart(3, '0')}`;
    setAllotSeatCode(app.allottedSeat || suggestedSeatCode);
  };

  // When admin switches between the candidate's preferences in the allotment dropdown, auto-suggest the departmental code
  const handleAllotCourseSelect = (selectedPref: string) => {
    setAllotCourse(selectedPref);
    if (allottingApp) {
      const rankForSeat = allottingApp.meritRank || 1;
      setAllotSeatCode(`${selectedPref}-2026-${String(rankForSeat).padStart(3, '0')}`);
    }
  };

  // Handle seat allotment submission
  const handleAllotSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allottingApp) return;
    setAllotError(null);

    try {
      const res = await fetch('/api/admin/seat-allotment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: allottingApp.id,
          course: allotCourse,
          department: allotCourse,
          campus: allotCampus,
          seatNumber: allotSeatCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Seat allotment failed');

      setAllottingApp(null);
      setActionSuccess(`Seat ${allotSeatCode} in ${allotCourse} allotted to ${allottingApp.applicationNumber}`);
      setTimeout(() => setActionSuccess(null), 3500);

      if (selectedAppId) await fetchApplicantDetail(selectedAppId);
      await fetchApplicants();
    } catch (err: any) {
      setAllotError(err.message || 'Seat allotment failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf5] text-[#1e1c17] flex flex-col font-sans">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#fdfbf5] border-b border-[#ded9cf] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#33253c] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            IEM
          </div>
          <div>
            <h1 className="font-headline font-semibold text-base text-[#33253c]">
              Admissions Scrutiny &amp; Allotment Console
            </h1>
            <p className="text-xs text-[#4a454c]">
              Office of the Dean of Academic Admissions • Academic Year 2026-2027
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenDatabaseExplorer && (
            <button
              onClick={onOpenDatabaseExplorer}
              className="px-3 py-1.5 rounded-lg border border-[#ded9cf] bg-white text-xs font-semibold text-[#4a454c] hover:bg-[#f0eee6] cursor-pointer"
            >
              Live Relational DB
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f9f6ed] border border-[#ded9cf] rounded-lg text-xs">
            <span className="font-semibold text-[#33253c]">{user.name}</span>
            <span className="bg-[#33253c] text-white font-bold text-[10px] px-1.5 py-0.5 rounded">ADMIN</span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-red-700 hover:bg-red-50 border border-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Success Alert */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex justify-between items-center border-b border-[#ded9cf] pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('applicants')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                activeTab === 'applicants'
                  ? 'bg-[#33253c] text-white'
                  : 'bg-[#f0eee6] text-[#4a454c] hover:text-[#1e1c17]'
              }`}
            >
              Applicant Directory &amp; Document Scrutiny ({applicants.length})
            </button>
            <button
              onClick={() => setActiveTab('merit_allotment')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                activeTab === 'merit_allotment'
                  ? 'bg-[#33253c] text-white'
                  : 'bg-[#f0eee6] text-[#4a454c] hover:text-[#1e1c17]'
              }`}
            >
              Merit List &amp; Seat Allotment Management
            </button>
          </div>

          <button
            onClick={fetchApplicants}
            className="p-2 rounded-lg border border-[#ded9cf] bg-white text-[#4a454c] hover:bg-[#f0eee6] cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TAB 1: APPLICANT DIRECTORY & DOCUMENT SCRUTINY */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-xl border border-[#ded9cf] shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#7b776d] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#ded9cf] rounded-lg bg-[#fdfbf5] text-[#1e1c17] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#7b776d]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-[#ded9cf] rounded-lg p-2 bg-[#fdfbf5] text-[#1e1c17] outline-none cursor-pointer"
                >
                  <option value="all">All Application Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="correction_required">Correction Required</option>
                  <option value="seat_allotted">Seat Allotted</option>
                  <option value="admission_confirmed">Admission Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applicants Table */}
            <div className="bg-white rounded-xl border border-[#ded9cf] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9f6ed] border-b border-[#ded9cf] text-[#4a454c] font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Top 3 Preferences</th>
                    <th className="py-3 px-4">Class 12 %</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Documents</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ded9cf]/60">
                  {applicants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-[#7b776d] italic">
                        No applicants found matching current filter.
                      </td>
                    </tr>
                  ) : (
                    applicants.map((app) => {
                      const prefList = app.preferences?.length
                        ? app.preferences
                        : [app.preference1 || app.course, app.preference2, app.preference3].filter(Boolean);

                      return (
                        <tr key={app.id} className="hover:bg-[#f9f6ed]/50">
                          <td className="py-3 px-4 font-mono font-semibold text-[#33253c]">
                            {app.applicationNumber}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-[#1e1c17] block">{app.candidateName}</span>
                            <span className="text-[11px] text-[#4a454c]">{app.email}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {prefList.map((p, idx) => (
                                <span key={idx} className="bg-[#f0eee6] border border-[#ded9cf] px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#33253c]">
                                  #{idx + 1}: {p}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-[#33253c]">
                            {app.class12?.percentage ? `${app.class12.percentage}%` : '94.6%'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                              app.status === 'approved' || app.status === 'admission_confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              app.status === 'seat_allotted' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                              app.status === 'correction_required' ? 'bg-red-50 text-red-800 border-red-200' :
                              app.status === 'rejected' ? 'bg-red-50 text-red-800 border-red-200' :
                              app.status === 'submitted' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] text-[#4a454c]">
                              {app.approvedDocs}/{app.totalDocs} Verified
                              {app.rejectedDocs > 0 && (
                                <span className="ml-1 text-red-700 font-semibold">({app.rejectedDocs} Deficient)</span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedAppId(app.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white font-semibold text-xs cursor-pointer shadow-xs"
                            >
                              Scrutinize
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MERIT LIST & SEAT ALLOTMENT MANAGEMENT */}
        {activeTab === 'merit_allotment' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#ded9cf] shadow-xs">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#ded9cf]">
                <div>
                  <h3 className="font-headline font-semibold text-sm text-[#33253c]">
                    Merit Ranking &amp; Departmental Allotment
                  </h3>
                  <p className="text-xs text-[#4a454c]">
                    Assign official merit ranks and allot engineering seats strictly from candidate preferences.
                  </p>
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9f6ed] border-b border-[#ded9cf] text-[#4a454c] font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Merit Rank</th>
                    <th className="py-3 px-4">App ID</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Candidate Preferences (In Order)</th>
                    <th className="py-3 px-4 text-right">Score %</th>
                    <th className="py-3 px-4">Allotted Seat Code</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ded9cf]/60">
                  {applicants
                    .filter(a => a.status !== 'draft')
                    .map((app, index) => {
                      const prefList = app.preferences?.length
                        ? app.preferences
                        : [app.preference1 || app.course, app.preference2, app.preference3].filter(Boolean);

                      return (
                        <tr key={app.id} className="hover:bg-[#f9f6ed]/50">
                          <td className="py-3 px-4 font-bold text-[#33253c]">
                            {app.meritRank ? `#${app.meritRank}` : <span className="text-[#7b776d] italic font-normal">Unranked</span>}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-[#4a454c]">
                            {app.applicationNumber}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#1e1c17]">
                            {app.candidateName}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {prefList.map((p, idx) => (
                                <span key={idx} className="bg-[#f0eee6] border border-[#ded9cf] px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#33253c]">
                                  {idx + 1}. {p}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-[#33253c]">
                            {app.meritScore ? `${app.meritScore}%` : `${app.class12?.percentage || '94.6'}%`}
                          </td>
                          <td className="py-3 px-4">
                            {app.allottedSeat ? (
                              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                                {app.allottedSeat}
                              </span>
                            ) : (
                              <span className="text-[#7b776d] italic text-xs">Unallocated</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setMeritModalApp(app);
                                  setInputMeritRank(app.meritRank ? String(app.meritRank) : String(index + 1));
                                  setInputMeritScore(app.meritScore ? String(app.meritScore) : String(app.class12?.percentage || '94.6'));
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold cursor-pointer"
                              >
                                {app.meritRank ? 'Edit Rank' : 'Assign Rank'}
                              </button>

                              <button
                                onClick={() => openSeatAllotment(app, index + 1)}
                                className="px-3 py-1.5 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold cursor-pointer"
                              >
                                {app.allottedSeat ? 'Modify Seat' : 'Allot Seat'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: APPLICANT SCRUTINY DETAIL DRAWER (STRICT READ-ONLY + ACTIONS)    */}
      {/* ========================================================================= */}
      {selectedAppId && applicantDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full rounded-2xl border border-[#ded9cf] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#ded9cf] bg-[#fdfbf5] flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-semibold text-lg text-[#33253c]">
                    Application Scrutiny: {applicantDetail.application.id}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#e7dcea] text-[#33253c] uppercase">
                    {applicantDetail.application.status}
                  </span>
                </div>
                <p className="text-xs text-[#4a454c] mt-0.5">
                  Candidate: <strong className="text-[#1e1c17]">{applicantDetail.profile?.fullName || applicantDetail.application.personal.fullName}</strong> ({applicantDetail.profile?.email || applicantDetail.application.personal.email})
                </p>
              </div>

              <button
                onClick={() => setSelectedAppId(null)}
                className="p-1.5 text-[#4a454c] hover:text-[#1e1c17] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content (Strictly Read-Only Inspection) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* 1. Candidate Personal Details (Read-only) */}
              <div className="bg-[#f9f6ed] p-4 rounded-xl border border-[#ded9cf] space-y-2">
                <span className="text-[#33253c] font-bold text-xs uppercase block border-b border-[#ded9cf]/60 pb-1.5">
                  1. Candidate Personal Details (Read-Only)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div><span className="text-[#4a454c]">Full Legal Name:</span> <strong className="text-[#1e1c17] block">{applicantDetail.application.personal.fullName}</strong></div>
                  <div><span className="text-[#4a454c]">Date of Birth:</span> <strong className="text-[#1e1c17] block">{applicantDetail.application.personal.dob}</strong></div>
                  <div><span className="text-[#4a454c]">Gender &amp; Category:</span> <strong className="text-[#1e1c17] block">{applicantDetail.application.personal.gender || 'Not specified'} • {applicantDetail.application.personal.category || 'General'}</strong></div>
                  <div><span className="text-[#4a454c]">Email Address:</span> <strong className="text-[#1e1c17] block">{applicantDetail.application.personal.email}</strong></div>
                  <div><span className="text-[#4a454c]">Phone Number:</span> <strong className="text-[#1e1c17] block">{applicantDetail.application.personal.phone}</strong></div>
                  <div><span className="text-[#4a454c]">Blood Group:</span> <strong className="text-[#1e1c17] block">{applicantDetail.application.personal.bloodGroup || 'O+'}</strong></div>
                  <div className="md:col-span-3"><span className="text-[#4a454c]">Guardian Contact:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.personal.guardianName || 'N/A'} ({applicantDetail.application.personal.guardianPhone || 'N/A'})</strong></div>
                </div>
              </div>

              {/* 2. Academic Qualifications (Class 10 & Class 12 - Read-only) */}
              <div className="bg-[#f9f6ed] p-4 rounded-xl border border-[#ded9cf] space-y-3">
                <span className="text-[#33253c] font-bold text-xs uppercase block border-b border-[#ded9cf]/60 pb-1.5">
                  2. Academic Qualifications (Class 10 &amp; Class 12 - Read-Only)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Class 10 */}
                  <div className="bg-white p-3 rounded-lg border border-[#ded9cf] space-y-1">
                    <span className="font-semibold text-xs text-[#33253c] block">Class 10 (Secondary)</span>
                    <p><span className="text-[#4a454c]">School:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.class10?.schoolName || 'Delhi Public School'}</strong></p>
                    <p><span className="text-[#4a454c]">Board:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.class10?.board || 'CBSE'}</strong></p>
                    <p><span className="text-[#4a454c]">Year of Passing:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.class10?.yearOfPassing || '2023'}</strong></p>
                    <p><span className="text-[#4a454c]">Marks:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.class10?.marksObtained} / {applicantDetail.application.class10?.fullMarks}</strong> ({applicantDetail.application.class10?.percentage}%)</p>
                  </div>

                  {/* Class 12 */}
                  <div className="bg-white p-3 rounded-lg border border-[#ded9cf] space-y-1">
                    <span className="font-semibold text-xs text-[#33253c] block">Class 12 (Higher Secondary)</span>
                    <p><span className="text-[#4a454c]">School:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.class12?.schoolName || applicantDetail.application.academic?.previousInstitution}</strong></p>
                    <p><span className="text-[#4a454c]">Board &amp; Stream:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.class12?.board || 'CBSE'} • {applicantDetail.application.class12?.stream || 'Science'}</strong></p>
                    <p><span className="text-[#4a454c]">Year of Passing:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.class12?.yearOfPassing || '2025'}</strong></p>
                    <p><span className="text-[#4a454c]">Marks:</span> <strong className="text-[#1e1c17]">{applicantDetail.application.class12?.marksObtained} / {applicantDetail.application.class12?.fullMarks}</strong> ({applicantDetail.application.class12?.percentage || applicantDetail.application.academic?.percentageCgpa}%)</p>
                  </div>
                </div>
              </div>

              {/* 3. Entrance Examination Details (Read-only) */}
              <div className="bg-[#f9f6ed] p-4 rounded-xl border border-[#ded9cf] space-y-2">
                <span className="text-[#33253c] font-bold text-xs uppercase block border-b border-[#ded9cf]/60 pb-1.5">
                  3. Entrance Examination Scores (Read-Only)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-[#ded9cf]">
                    <span className="font-semibold text-[#33253c] block text-xs">JEE Main 2026:</span>
                    {applicantDetail.application.entranceExams?.jeeMain?.appeared ? (
                      <p className="mt-1">
                        Percentile: <strong>{applicantDetail.application.entranceExams.jeeMain.percentile}</strong> • AIR: <strong>{applicantDetail.application.entranceExams.jeeMain.rank}</strong>
                      </p>
                    ) : (
                      <p className="text-[#7b776d] italic mt-1">Did not appear</p>
                    )}
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#ded9cf]">
                    <span className="font-semibold text-[#33253c] block text-xs">WBJEE:</span>
                    {applicantDetail.application.entranceExams?.wbjee?.appeared ? (
                      <p className="mt-1">
                        General Merit Rank: <strong>{applicantDetail.application.entranceExams.wbjee.rank}</strong>
                      </p>
                    ) : (
                      <p className="text-[#7b776d] italic mt-1">Did not appear</p>
                    )}
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#ded9cf]">
                    <span className="font-semibold text-[#33253c] block text-xs">IEMJEE:</span>
                    {applicantDetail.application.entranceExams?.iemjee?.appeared ? (
                      <p className="mt-1">
                        Rank: <strong>{applicantDetail.application.entranceExams.iemjee.rank}</strong>
                      </p>
                    ) : (
                      <p className="text-[#7b776d] italic mt-1">Did not appear</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Three Ordered Course Preferences (Read-only) */}
              <div className="bg-[#f9f6ed] p-4 rounded-xl border border-[#ded9cf] space-y-2">
                <span className="text-[#33253c] font-bold text-xs uppercase block border-b border-[#ded9cf]/60 pb-1.5">
                  4. Ordered Program Preferences (Read-Only)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border-2 border-[#33253c]/40">
                    <span className="text-[10px] uppercase font-bold text-[#33253c] bg-[#e7dcea] px-1.5 py-0.5 rounded">Preference 1 (First Choice)</span>
                    <p className="font-bold text-[#33253c] text-sm mt-1">
                      {applicantDetail.application.preferences?.preference_1 || applicantDetail.application.course?.preference_1 || applicantDetail.application.course?.primaryCourse}
                    </p>
                    <p className="text-[11px] text-[#4a454c]">{IEM_COURSE_LABELS[applicantDetail.application.preferences?.preference_1 || applicantDetail.application.course?.primaryCourse] || ''}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#ded9cf]">
                    <span className="text-[10px] uppercase font-bold text-[#4a454c] bg-[#f0eee6] px-1.5 py-0.5 rounded">Preference 2 (Second Choice)</span>
                    <p className="font-bold text-[#33253c] text-sm mt-1">
                      {applicantDetail.application.preferences?.preference_2 || applicantDetail.application.course?.preference_2 || applicantDetail.application.course?.secondaryCourse || 'IT'}
                    </p>
                    <p className="text-[11px] text-[#4a454c]">{IEM_COURSE_LABELS[applicantDetail.application.preferences?.preference_2 || 'IT'] || ''}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#ded9cf]">
                    <span className="text-[10px] uppercase font-bold text-[#4a454c] bg-[#f0eee6] px-1.5 py-0.5 rounded">Preference 3 (Third Choice)</span>
                    <p className="font-bold text-[#33253c] text-sm mt-1">
                      {applicantDetail.application.preferences?.preference_3 || applicantDetail.application.course?.preference_3 || 'AIML'}
                    </p>
                    <p className="text-[11px] text-[#4a454c]">{IEM_COURSE_LABELS[applicantDetail.application.preferences?.preference_3 || 'AIML'] || ''}</p>
                  </div>
                </div>
              </div>

              {/* 5. Uploaded Documents Scrutiny Grid */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-[#ded9cf] pb-2">
                  <h4 className="font-headline font-semibold text-xs text-[#33253c] uppercase tracking-wider">
                    Uploaded Document Scrutiny ({applicantDetail.documents?.length || 0})
                  </h4>
                  <span className="text-[11px] text-[#4a454c]">
                    Mark each document as VERIFIED or SCRUTINIZE / REQUEST CORRECTION
                  </span>
                </div>

                {applicantDetail.documents?.length === 0 ? (
                  <p className="text-xs text-[#7b776d] italic py-4">No documents uploaded by applicant yet.</p>
                ) : (
                  <div className="space-y-3">
                    {applicantDetail.documents.map((doc: DocumentItem) => (
                      <div 
                        key={doc.id}
                        className="p-4 rounded-xl border border-[#ded9cf] bg-white flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-lg bg-[#f9f6ed] border border-[#ded9cf] text-[#33253c] shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-xs text-[#1e1c17]">{doc.title}</h5>
                              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                                doc.status === 'approved' || doc.status === 'verified'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : doc.status === 'rejected' || doc.status === 'correction_required'
                                  ? 'bg-red-50 text-red-800 border-red-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {doc.status === 'approved' || doc.status === 'verified' 
                                  ? 'APPROVED' 
                                  : doc.status === 'correction_required' 
                                  ? 'CORRECTION REQUIRED' 
                                  : doc.status === 'rejected' 
                                  ? 'REJECTED' 
                                  : 'PENDING'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#4a454c] mt-0.5">
                              {doc.fileName} • {doc.fileSize} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              {doc.verifiedAt && ` • Verified on ${new Date(doc.verifiedAt).toLocaleDateString()}`}
                            </p>
                            {doc.adminRemarks && (
                              <p className="text-[11px] text-red-700 mt-1 bg-red-50 p-1.5 rounded border border-red-200 font-medium">
                                Remark: {doc.adminRemarks}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons per document */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => onPreviewDocument(doc)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#ded9cf] text-xs font-semibold text-[#4a454c] hover:bg-[#f0eee6] flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          {/* VERIFIED BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleVerifyDocument(doc.id, 'approved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>VERIFIED</span>
                          </button>

                          {/* SCRUTINIZE / REQUEST CORRECTION BUTTON */}
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingDocId(doc.id);
                              setDocRejectRemarks('');
                            }}
                            className="px-3 py-1.5 rounded-lg border border-red-600 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>SCRUTINIZE</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Decision Footer */}
            <div className="p-4 border-t border-[#ded9cf] bg-[#fdfbf5] flex flex-wrap justify-between items-center gap-3">
              <div>
                <span className="text-xs text-[#4a454c]">
                  Application ID: <strong className="font-mono text-[#33253c]">{applicantDetail.application.id}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingAppModal(true);
                    setAppRejectRemarks('');
                  }}
                  className="px-4 py-2 rounded-lg border border-red-600 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                >
                  Reject Application
                </button>

                <button
                  type="button"
                  onClick={() => handleApproveApplication(applicantDetail.application.id)}
                  className="px-5 py-2 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Approve Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DOCUMENT REJECT / SCRUTINIZE REMARKS PROMPT                      */}
      {/* ========================================================================= */}
      {rejectingDocId && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#ded9cf] p-6 space-y-4 shadow-xl">
            <h4 className="font-headline font-semibold text-sm text-[#ba1a1a] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Scrutinize Document &amp; Request Correction
            </h4>
            <p className="text-xs text-[#4a454c]">
              Please state the specific correction requirement. This remark will be sent to the candidate and they will be prompted to re-upload.
            </p>

            <textarea
              required
              rows={3}
              value={docRejectRemarks}
              onChange={(e) => setDocRejectRemarks(e.target.value)}
              placeholder="e.g. Please re-upload a clear, non-blurred color scan of the Class 12th board marksheet showing all subjects."
              className="w-full text-xs p-3 rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-[#1e1c17] outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingDocId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#4a454c] hover:bg-[#f0eee6] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!docRejectRemarks.trim()}
                onClick={() => {
                  handleVerifyDocument(rejectingDocId, 'rejected', docRejectRemarks);
                  setRejectingDocId(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white rounded-lg cursor-pointer shadow-xs"
              >
                Request Correction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: APPLICATION REJECT PROMPT                                        */}
      {/* ========================================================================= */}
      {rejectingAppModal && selectedAppId && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#ded9cf] p-6 space-y-4 shadow-xl">
            <h4 className="font-headline font-semibold text-sm text-[#ba1a1a]">
              Reject Complete Application
            </h4>
            <p className="text-xs text-[#4a454c]">
              State the official administrative reason for rejecting this admission application.
            </p>

            <textarea
              required
              rows={3}
              value={appRejectRemarks}
              onChange={(e) => setAppRejectRemarks(e.target.value)}
              placeholder="e.g. Candidate does not meet minimum eligibility criteria for counseling."
              className="w-full text-xs p-3 rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-[#1e1c17] outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingAppModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#4a454c] hover:bg-[#f0eee6] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectApplication(selectedAppId)}
                className="px-4 py-2 text-xs font-semibold bg-red-700 hover:bg-red-800 text-white rounded-lg cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ASSIGN MERIT RANK                                                */}
      {/* ========================================================================= */}
      {meritModalApp && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveMeritRank} className="bg-white max-w-md w-full rounded-2xl border border-[#ded9cf] p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#ded9cf] pb-3">
              <div>
                <h4 className="font-headline font-semibold text-sm text-[#33253c]">
                  Assign Official Merit Rank
                </h4>
                <p className="text-xs text-[#4a454c]">
                  Candidate: <strong>{meritModalApp.candidateName}</strong> ({meritModalApp.applicationNumber})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMeritModalApp(null)}
                className="p-1 text-[#7b776d] hover:text-[#1e1c17]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1e1c17] mb-1">
                  Merit Rank (Numerical Order) <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={inputMeritRank}
                  onChange={(e) => setInputMeritRank(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full p-2.5 rounded-lg border border-[#ded9cf] bg-[#fdfbf5] font-mono font-bold text-sm text-[#33253c] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1e1c17] mb-1">
                  Evaluated Academic Merit Score (%)
                </label>
                <input
                  type="text"
                  value={inputMeritScore}
                  onChange={(e) => setInputMeritScore(e.target.value)}
                  placeholder="e.g. 96.5"
                  className="w-full p-2.5 rounded-lg border border-[#ded9cf] bg-[#fdfbf5] font-mono text-sm text-[#1e1c17] outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#ded9cf] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMeritModalApp(null)}
                className="px-4 py-2 text-xs font-semibold text-[#4a454c] hover:bg-[#f0eee6] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={meritSaving || !inputMeritRank}
                className="px-5 py-2 bg-[#33253c] hover:bg-[#4a3b53] disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                {meritSaving ? 'Saving Rank...' : 'Save Merit Rank'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: SEAT ALLOTMENT (STRICTLY CONSTRAINED TO CANDIDATE'S 3 PREFS)      */}
      {/* ========================================================================= */}
      {allottingApp && (() => {
        const candidatePrefs = (allottingApp.preferences && allottingApp.preferences.length > 0)
          ? allottingApp.preferences
          : [allottingApp.preference1 || allottingApp.course, allottingApp.preference2, allottingApp.preference3].filter(Boolean) as string[];

        return (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <form onSubmit={handleAllotSeat} className="bg-white max-w-lg w-full rounded-2xl border border-[#ded9cf] p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-[#ded9cf] pb-3">
                <div>
                  <h4 className="font-headline font-semibold text-sm text-[#33253c]">
                    Allot Official Engineering Seat
                  </h4>
                  <p className="text-xs text-[#4a454c]">
                    Candidate: <strong>{allottingApp.candidateName}</strong> ({allottingApp.applicationNumber})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllottingApp(null)}
                  className="p-1 text-[#7b776d] hover:text-[#1e1c17]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {allotError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {allotError}
                </div>
              )}

              <div className="space-y-4 text-xs">
                {/* STRICT DROPDOWN CONSTRAINED TO CANDIDATE'S 3 PREFERENCES */}
                <div>
                  <label className="block font-semibold text-[#1e1c17] mb-1">
                    Allotted Department (Strictly Candidate's 3 Preferences) <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <select
                    value={allotCourse}
                    onChange={(e) => handleAllotCourseSelect(e.target.value)}
                    className="w-full p-2.5 rounded-lg border-2 border-[#33253c] bg-[#fcfaf2] text-[#1e1c17] font-semibold outline-none cursor-pointer"
                  >
                    {candidatePrefs.map((prefCode, idx) => (
                      <option key={prefCode} value={prefCode}>
                        Choice #{idx + 1}: {prefCode} — {IEM_COURSE_LABELS[prefCode] || prefCode}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#4a454c] mt-1">
                    * Policy Enforced: Only programs selected in the candidate's three preferences can be allotted.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#1e1c17] mb-1">
                    Departmental Seat Code (Auto-suggested, Admin Editable) <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={allotSeatCode}
                    onChange={(e) => setAllotSeatCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CSE-2026-001"
                    className="w-full p-2.5 rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-[#33253c] font-mono font-bold outline-none"
                  />
                  <p className="text-[11px] text-[#7b776d] mt-0.5">
                    Unique seat identifier. Duplicates are strictly blocked across the registry.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#1e1c17] mb-1">
                    Allocated Campus Venue
                  </label>
                  <input
                    type="text"
                    value={allotCampus}
                    onChange={(e) => setAllotCampus(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#ded9cf] bg-[#fdfbf5] text-[#1e1c17] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#ded9cf] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAllottingApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#4a454c] hover:bg-[#f0eee6] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Seat Allotment
                </button>
              </div>
            </form>
          </div>
        );
      })()}

    </div>
  );
};
