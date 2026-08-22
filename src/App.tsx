import React, { useState, useEffect } from 'react';
import { 
  Sidebar 
} from './components/Sidebar';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { ApplicationFormView } from './components/ApplicationFormView';
import { DocumentUploadView } from './components/DocumentUploadView';
import { FeePaymentView } from './components/FeePaymentView';
import { SubmitReviewView } from './components/SubmitReviewView';
import { MeritListModal } from './components/MeritListModal';
import { DatabaseExplorer } from './components/DatabaseExplorer';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { ReceiptModal } from './components/ReceiptModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AllotmentLetterModal } from './components/AllotmentLetterModal';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { IEMLogo } from './components/IEMLogo';
import { User, Application, DocumentItem, PaymentRecord, MeritItem, NotificationItem } from './types';
import { Menu, Database, Award, Bell, ShieldCheck } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [meritItem, setMeritItem] = useState<MeritItem | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals
  const [meritModalOpen, setMeritModalOpen] = useState(false);
  const [dbExplorerOpen, setDbExplorerOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [allotmentModalOpen, setAllotmentModalOpen] = useState(false);

  // Initial loading
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchAppData = async (appId: string) => {
    try {
      const [appRes, docsRes, paymentsRes, meritRes, notifsRes] = await Promise.all([
        fetch(`/api/applications/${appId}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/documents/${appId}`).then(r => r.ok ? r.json() : []),
        fetch(`/api/payments/${appId}`).then(r => r.ok ? r.json() : []),
        fetch(`/api/merit-list?search=${appId}`).then(r => r.ok ? r.json() : []),
        fetch('/api/notifications').then(r => r.ok ? r.json() : []),
      ]);

      if (appRes) setApplication(appRes);
      if (Array.isArray(docsRes)) setDocuments(docsRes);
      if (Array.isArray(paymentsRes)) setPayments(paymentsRes);
      if (Array.isArray(meritRes) && meritRes.length > 0) {
        setMeritItem(meritRes[0]);
      }
      if (Array.isArray(notifsRes)) setNotifications(notifsRes);
    } catch (err) {
      console.error('Failed to sync application data from DB:', err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setApplication(data.application);
          if (data.application?.id) {
            await fetchAppData(data.application.id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setInitialLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = async (loggedInUser: User, loggedInApp: Application) => {
    setUser(loggedInUser);
    setApplication(loggedInApp);
    setCurrentView('dashboard');
    if (loggedInApp?.id) {
      await fetchAppData(loggedInApp.id);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    setApplication(null);
  };

  const handleSaveFormProgress = async (updated: Partial<Application>) => {
    if (!application) return;
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setApplication(saved);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadDocument = async (type: string, title: string, fileName: string, fileSize: string, fileUrl?: string) => {
    if (!application) return;
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          type,
          title,
          fileName,
          fileSize,
          fileUrl,
        }),
      });
      if (res.ok) {
        const newDoc = await res.json();
        setDocuments(prev => [...prev.filter(d => d.type !== type), newDoc]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProcessPayment = async (amount: number, method: string, details?: any) => {
    if (!application) throw new Error('No active application');
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: application.id,
        amount,
        paymentMethod: method,
        details,
      }),
    });
    if (!res.ok) throw new Error('Payment failed');
    const payment = await res.json();
    setPayments(prev => [...prev, payment]);
    await fetchAppData(application.id);
    return payment;
  };

  const handleSubmitApplication = async () => {
    if (!application) return;
    const res = await fetch(`/api/applications/${application.id}/submit`, {
      method: 'POST',
    });
    if (res.ok) {
      const updated = await res.json();
      setApplication(updated);
      await fetchAppData(application.id);
    }
  };

  const handleMarkNotificationRead = async (notifId: string) => {
    try {
      await fetch(`/api/notifications/${notifId}/read`, { method: 'POST' });
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (e) {}
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {}
  };

  const handleUpdateUser = async (updated: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updated } : null);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] text-slate-100 font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <p className="font-mono text-xs text-slate-400 tracking-wider uppercase">Loading Admission Stack...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, render AuthScreen
  if (!user) {
    return (
      <>
        <AuthScreen 
          onLoginSuccess={handleLoginSuccess}
          onOpenDatabaseExplorer={() => setDbExplorerOpen(true)}
        />
        <DatabaseExplorer
          isOpen={dbExplorerOpen}
          onClose={() => setDbExplorerOpen(false)}
          onDbModified={() => {}}
        />
      </>
    );
  }

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const paymentRecord = payments.find(p => p.status === 'success');

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col md:flex-row font-sans selection:bg-teal-500/20 selection:text-teal-300">
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        application={application}
        unreadNotifsCount={unreadNotifsCount}
        onOpenMeritList={() => setMeritModalOpen(true)}
        onOpenDatabaseExplorer={() => setDbExplorerOpen(true)}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-x-hidden bg-[#020617]">
        {/* Top App Bar (Mobile toggle & Database Status chip) */}
        <header className="sticky top-0 z-30 bg-[#030712]/80 backdrop-blur-md border-b border-[#1E293B] px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg border border-[#1E293B]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex md:hidden items-center gap-2">
              <IEMLogo size="sm" variant="icon" />
              <span className="font-headline font-bold text-xs text-[#F8FAFC]">IEM KOLKATA</span>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Cycle</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-[#1E293B]">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                <span className="text-xs font-mono text-teal-400">2026-2027 Admissions</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Database Explorer Quick Indicator */}
            <button
              id="header-live-db-btn"
              onClick={() => setDbExplorerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Inspect backend JSON Database"
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden xs:inline font-mono text-[11px]">DB_ACTIVE</span>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            </button>

            <button
              id="header-merit-list-btn"
              onClick={() => setMeritModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] rounded-lg text-xs font-bold shadow-sm shadow-teal-500/10 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#020617]" />
              <span className="hidden sm:inline">Merit List</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <div className="flex-1 p-4 md:p-8 lg:p-10">
          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              application={application}
              documents={documents}
              payments={payments}
              meritItem={meritItem}
              notifications={notifications}
              onNavigate={setCurrentView}
              onOpenReceipt={() => setReceiptModalOpen(true)}
              onOpenInvoice={() => setInvoiceModalOpen(true)}
              onOpenAllotmentLetter={() => setAllotmentModalOpen(true)}
            />
          )}

          {currentView === 'form' && (
            <ApplicationFormView
              application={application}
              onSaveProgress={handleSaveFormProgress}
              onNextStep={() => setCurrentView('documents')}
              onStepClick={(s) => {
                if (s === 1) setCurrentView('form');
                if (s === 2) setCurrentView('documents');
                if (s === 3) setCurrentView('payment');
                if (s === 4) setCurrentView('status');
              }}
            />
          )}

          {currentView === 'documents' && (
            <DocumentUploadView
              documents={documents}
              applicationId={application?.id || 'IEM-2024-001'}
              onUploadDocument={handleUploadDocument}
              onDeleteDocument={handleDeleteDocument}
              onPreviousStep={() => setCurrentView('form')}
              onSaveAndContinue={() => setCurrentView('payment')}
              onPreviewDoc={(doc) => setPreviewDoc(doc)}
            />
          )}

          {currentView === 'payment' && (
            <FeePaymentView
              application={application}
              payments={payments}
              onProcessPayment={handleProcessPayment}
              onPreviousStep={() => setCurrentView('documents')}
              onContinueToSubmit={() => setCurrentView('status')}
              onViewInvoice={() => setInvoiceModalOpen(true)}
            />
          )}

          {currentView === 'status' && (
            <SubmitReviewView
              application={application}
              documents={documents}
              payments={payments}
              onSubmitApplication={handleSubmitApplication}
              onPreviousStep={() => setCurrentView('payment')}
              onGoToDashboard={() => setCurrentView('dashboard')}
              onOpenReceipt={() => setReceiptModalOpen(true)}
            />
          )}

          {currentView === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              user={user}
              application={application}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <MeritListModal
        isOpen={meritModalOpen}
        onClose={() => setMeritModalOpen(false)}
        user={user}
      />

      <DatabaseExplorer
        isOpen={dbExplorerOpen}
        onClose={() => setDbExplorerOpen(false)}
        onDbModified={() => {
          if (application?.id) fetchAppData(application.id);
        }}
      />

      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        application={application}
        user={user}
        payment={paymentRecord}
      />

      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        application={application}
        payment={paymentRecord}
      />

      <AllotmentLetterModal
        isOpen={allotmentModalOpen}
        onClose={() => setAllotmentModalOpen(false)}
        application={application}
        user={user}
        meritItem={meritItem}
      />
    </div>
  );
}

export default App;
