import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Table, 
  Terminal, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  X, 
  Server, 
  FileCode, 
  Layers, 
  Activity, 
  PlusCircle, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { DatabaseSummary } from '../types';

interface DatabaseExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onDbModified: () => void;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({
  isOpen,
  onClose,
  onDbModified,
}) => {
  const [summary, setSummary] = useState<DatabaseSummary | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('applications');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

  // SQL Terminal State
  const [queryInput, setQueryInput] = useState<string>('SELECT * FROM applications WHERE status = "under_review"');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryExecutionTime, setQueryExecutionTime] = useState<number | null>(null);
  const [executingQuery, setExecutingQuery] = useState(false);

  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'actions' | 'schema'>('tables');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/database/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setLoadingTable(true);
    try {
      const res = await fetch(`/api/database/tables/${tableName}`);
      const data = await res.json();
      setTableData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleRunQuery = async () => {
    setExecutingQuery(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryInput }),
      });
      const data = await res.json();
      const end = performance.now();
      setQueryExecutionTime(Math.round(end - start));
      setQueryResult(data);
    } catch (err: any) {
      setQueryResult({ error: err.message });
    } finally {
      setExecutingQuery(false);
    }
  };

  const handleAdminAction = async (action: 'verify_docs' | 'allot_seat' | 'simulate_applicant' | 'reset_db') => {
    setActionMessage('Executing database transaction...');
    try {
      if (action === 'verify_docs') {
        const res = await fetch('/api/admin/verify-documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId: 'IEM-2024-001' }),
        });
        const d = await res.json();
        setActionMessage(d.message);
      } else if (action === 'allot_seat') {
        const res = await fetch('/api/admin/allot-seat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationId: 'IEM-2024-001',
            course: 'B.Tech in Computer Science & Engineering (CSE)',
            seat: 'CSE-A-004',
          }),
        });
        const d = await res.json();
        setActionMessage(d.message);
      } else if (action === 'simulate_applicant') {
        const randId = Math.floor(100 + Math.random() * 900);
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: `Applicant ${randId}`,
            email: `candidate${randId}@test.com`,
            password: 'password123',
            phone: `+91 98765 00${randId}`,
            coursePreference: 'B.Tech in Computer Science & Engineering (CSE)',
          }),
        });
        setActionMessage(`Successfully inserted new applicant (Candidate ${randId}) into database!`);
      } else if (action === 'reset_db') {
        await fetch('/api/admin/reset-database', { method: 'POST' });
        setActionMessage('Database successfully re-seeded to factory default state.');
      }

      await fetchSummary();
      await fetchTableData(selectedTable);
      onDbModified();
    } catch (err: any) {
      setActionMessage(`Failed: ${err.message}`);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSummary();
      fetchTableData(selectedTable);
    }
  }, [isOpen, selectedTable]);

  if (!isOpen) return null;

  const tables = ['applications', 'users', 'documents', 'payments', 'meritList', 'notifications', 'auditLogs'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div 
        id="database-explorer-modal"
        className="bg-white max-w-5xl w-full rounded-2xl border border-[#ccc4cc] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e7e1e3] bg-[#f8f2f4] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4d3e56] text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-lg text-[#1d1b1d]">
                  Live Database Working &amp; Storage Engine
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  PERSISTENT &amp; ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#4a454c]">
                Backend: Express REST API | Storage: Server-Side JSON Database Engine (`/data/iem_admission.json`)
              </p>
            </div>
          </div>

          <button
            id="close-db-explorer-modal"
            onClick={onClose}
            className="p-1.5 text-[#7b757c] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Metrics Row */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 p-4 bg-[#f8f2f4]/60 border-b border-[#ccc4cc] text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-[#ccc4cc]">
              <span className="text-[#7b757c] block text-[10px]">Users</span>
              <span className="font-bold text-[#1d1b1d] text-base">{summary.counts.users}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#ccc4cc]">
              <span className="text-[#7b757c] block text-[10px]">Applications</span>
              <span className="font-bold text-[#4d3e56] text-base">{summary.counts.applications}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#ccc4cc]">
              <span className="text-[#7b757c] block text-[10px]">Documents</span>
              <span className="font-bold text-[#1d1b1d] text-base">{summary.counts.documents}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#ccc4cc]">
              <span className="text-[#7b757c] block text-[10px]">Payments</span>
              <span className="font-bold text-emerald-700 text-base">{summary.counts.payments}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#ccc4cc]">
              <span className="text-[#7b757c] block text-[10px]">Merit Ranks</span>
              <span className="font-bold text-indigo-700 text-base">{summary.counts.meritList}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#ccc4cc]">
              <span className="text-[#7b757c] block text-[10px]">Audit Logs</span>
              <span className="font-bold text-[#1d1b1d] text-base">{summary.counts.auditLogs}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e7e1e3] px-4 bg-white">
          <button
            onClick={() => setActiveTab('tables')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tables'
                ? 'border-[#4d3e56] text-[#4d3e56]'
                : 'border-transparent text-[#7b757c] hover:text-[#1d1b1d]'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Table Browser</span>
          </button>

          <button
            onClick={() => setActiveTab('query')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'query'
                ? 'border-[#4d3e56] text-[#4d3e56]'
                : 'border-transparent text-[#7b757c] hover:text-[#1d1b1d]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Query Console (SQL-like)</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'actions'
                ? 'border-[#4d3e56] text-[#4d3e56]'
                : 'border-transparent text-[#7b757c] hover:text-[#1d1b1d]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live DB Triggers &amp; Admin Ops</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'schema'
                ? 'border-[#4d3e56] text-[#4d3e56]'
                : 'border-transparent text-[#7b757c] hover:text-[#1d1b1d]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Schema &amp; Relational Map</span>
          </button>
        </div>

        {/* Action Message Banner */}
        {actionMessage && (
          <div className="bg-[#e8dce9] text-[#4d3e56] p-3 text-xs flex justify-between items-center border-b border-[#ccc4cc]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-[#4d3e56] hover:text-black">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'tables' && (
            <div className="space-y-4">
              {/* Table Selector Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#1d1b1d] mr-1">Select Table:</span>
                {tables.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTable(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedTable === t
                        ? 'bg-[#4d3e56] text-white font-semibold shadow-xs'
                        : 'bg-[#f8f2f4] text-[#4a454c] hover:bg-[#ece7e9]'
                    }`}
                  >
                    {t} ({summary?.counts[t as keyof typeof summary.counts] ?? '?'})
                  </button>
                ))}
                <button
                  onClick={() => fetchTableData(selectedTable)}
                  className="p-1.5 text-[#7b757c] hover:bg-[#f8f2f4] rounded-lg ml-auto"
                  title="Reload table"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingTable ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Table View */}
              <div className="border border-[#ccc4cc] rounded-xl overflow-hidden">
                <div className="max-h-[360px] overflow-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#f8f2f4] text-[#1d1b1d] sticky top-0 border-b border-[#ccc4cc]">
                      <tr>
                        {tableData.length > 0 && Object.keys(tableData[0]).map((col) => (
                          <th key={col} className="py-2.5 px-3 font-semibold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ece7e9]">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#f8f2f4]/60">
                          {Object.entries(row).map(([key, val], cIdx) => (
                            <td key={cIdx} className="py-2 px-3 max-w-xs truncate text-[#4a454c]">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {tableData.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#7b757c] font-sans">
                            No records present in table `{selectedTable}`
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'query' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#1d1b1d]">
                  Execute Query (e.g. `SELECT * FROM applications`, `SELECT * FROM payments WHERE status = "success"`)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs font-mono rounded-lg border border-[#ccc4cc] focus:border-[#4d3e56] bg-[#1c2938] text-emerald-400 outline-none"
                  />
                  <button
                    onClick={handleRunQuery}
                    disabled={executingQuery}
                    className="px-5 py-2 bg-[#4d3e56] hover:bg-[#65556e] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Query</span>
                  </button>
                </div>
              </div>

              {/* Sample Queries */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="text-[#7b757c]">Presets:</span>
                <button
                  onClick={() => setQueryInput('SELECT * FROM applications')}
                  className="bg-[#f8f2f4] hover:bg-[#ece7e9] px-2 py-0.5 rounded text-[#4d3e56] font-mono"
                >
                  All Applications
                </button>
                <button
                  onClick={() => setQueryInput('SELECT * FROM meritList WHERE rank <= 5')}
                  className="bg-[#f8f2f4] hover:bg-[#ece7e9] px-2 py-0.5 rounded text-[#4d3e56] font-mono"
                >
                  Top 5 Merit List
                </button>
                <button
                  onClick={() => setQueryInput('SELECT * FROM payments WHERE amount >= 50')}
                  className="bg-[#f8f2f4] hover:bg-[#ece7e9] px-2 py-0.5 rounded text-[#4d3e56] font-mono"
                >
                  Completed Payments
                </button>
              </div>

              {/* Result Preview */}
              {queryResult && (
                <div className="border border-[#ccc4cc] rounded-xl overflow-hidden bg-[#1c2938] text-white p-4 font-mono text-xs max-h-72 overflow-auto">
                  <div className="flex justify-between items-center text-[#7b757c] border-b border-white/10 pb-2 mb-2">
                    <span>
                      Returned {Array.isArray(queryResult) ? queryResult.length : 0} rows
                    </span>
                    {queryExecutionTime !== null && (
                      <span className="text-emerald-400">Execution time: {queryExecutionTime}ms</span>
                    )}
                  </div>
                  <pre className="text-emerald-300">{JSON.stringify(queryResult, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <p className="text-xs text-[#4a454c]">
                Trigger live server database mutations to observe state changes across the candidate portal in real time:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f8f2f4] border border-[#ccc4cc] rounded-xl space-y-2">
                  <h4 className="font-semibold text-xs text-[#1d1b1d] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Verify Candidate Documents
                  </h4>
                  <p className="text-[11px] text-[#4a454c]">
                    Executes administrative verification in the database for candidate `IEM-2024-001`. Sets `documents.status = 'verified'` and `application.status = 'docs_verified'`.
                  </p>
                  <button
                    onClick={() => handleAdminAction('verify_docs')}
                    className="w-full bg-[#4d3e56] text-white text-xs py-2 rounded-lg font-semibold hover:bg-[#65556e] cursor-pointer"
                  >
                    Execute Verification
                  </button>
                </div>

                <div className="p-4 bg-[#f8f2f4] border border-[#ccc4cc] rounded-xl space-y-2">
                  <h4 className="font-semibold text-xs text-[#1d1b1d] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-700" />
                    Allot Official Seat
                  </h4>
                  <p className="text-[11px] text-[#4a454c]">
                    Executes institutional seat allotment for candidate `IEM-2024-001` in the database. Generates provisional offer and unlocks the Allotment Letter.
                  </p>
                  <button
                    onClick={() => handleAdminAction('allot_seat')}
                    className="w-full bg-[#4d3e56] text-white text-xs py-2 rounded-lg font-semibold hover:bg-[#65556e] cursor-pointer"
                  >
                    Allot Seat `CSE-A-004`
                  </button>
                </div>

                <div className="p-4 bg-[#f8f2f4] border border-[#ccc4cc] rounded-xl space-y-2">
                  <h4 className="font-semibold text-xs text-[#1d1b1d] flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-[#4d3e56]" />
                    Simulate New Applicant
                  </h4>
                  <p className="text-[11px] text-[#4a454c]">
                    Generates a random candidate registration and writes new rows into the `users` and `applications` database tables.
                  </p>
                  <button
                    onClick={() => handleAdminAction('simulate_applicant')}
                    className="w-full border border-[#4d3e56] text-[#4d3e56] bg-white text-xs py-2 rounded-lg font-semibold hover:bg-[#ece7e9] cursor-pointer"
                  >
                    Insert New Applicant Record
                  </button>
                </div>

                <div className="p-4 bg-[#f8f2f4] border border-[#ccc4cc] rounded-xl space-y-2">
                  <h4 className="font-semibold text-xs text-[#ba1a1a] flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-[#ba1a1a]" />
                    Reset Database to Factory Demo
                  </h4>
                  <p className="text-[11px] text-[#4a454c]">
                    Re-seeds `/data/iem_admission.json` with fresh initial candidate records, demo payments, and sample merit ranks.
                  </p>
                  <button
                    onClick={() => handleAdminAction('reset_db')}
                    className="w-full bg-[#ffdad6] text-[#93000a] text-xs py-2 rounded-lg font-semibold hover:bg-[#ffb4ab] cursor-pointer"
                  >
                    Reset &amp; Re-seed JSON Database
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#f8f2f4] border border-[#ccc4cc] rounded-xl space-y-3">
                <h4 className="font-semibold text-[#1d1b1d]">Database Entity Relations</h4>
                <div className="font-mono bg-white p-3 rounded-lg border border-[#ccc4cc] space-y-1.5 text-[#4a454c]">
                  <p><strong className="text-[#4d3e56]">users</strong> (id, email, password, name, role, applicationId, createdAt)</p>
                  <p className="pl-4 text-[11px] text-[#7b757c]">└── 1:1 ── <strong className="text-[#4d3e56]">applications</strong> (id, userId, personal, academic, course, status, updatedAt)</p>
                  <p className="pl-10 text-[11px] text-[#7b757c]">├── 1:N ── <strong className="text-[#4d3e56]">documents</strong> (id, applicationId, type, title, fileName, status)</p>
                  <p className="pl-10 text-[11px] text-[#7b757c]">├── 1:N ── <strong className="text-[#4d3e56]">payments</strong> (id, applicationId, amount, status, transactionId)</p>
                  <p className="pl-10 text-[11px] text-[#7b757c]">└── 1:1 ── <strong className="text-[#4d3e56]">meritList</strong> (id, applicationId, rank, meritScore, allottedSeat)</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#ccc4cc] rounded-xl space-y-2">
                <h4 className="font-semibold text-[#1d1b1d]">Persistence Specifications</h4>
                <p className="text-[#4a454c]">
                  All mutations written to the database are instantly synced to disk storage on the container filesystem (`/data/iem_admission.json`). This ensures zero data loss between browser reloads or test sessions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e7e1e3] bg-[#f8f2f4] flex justify-between items-center">
          <span className="text-xs text-[#7b757c]">
            Database file location: <code className="font-mono text-[#4d3e56]">data/iem_admission.json</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#4d3e56] text-white text-xs font-semibold hover:bg-[#65556e] cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
