import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  X, 
  CheckCircle, 
  Download, 
  ChevronRight, 
  GraduationCap, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { MeritItem, User } from '../types';
import { IEMLogo } from './IEMLogo';

interface MeritListModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAllotSeat?: (applicationId: string, course: string, seat: string) => void;
}

export const MeritListModal: React.FC<MeritListModalProps> = ({
  isOpen,
  onClose,
  user,
  onAllotSeat,
}) => {
  const [meritItems, setMeritItems] = useState<MeritItem[]>([]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchMeritList = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/merit-list', window.location.origin);
      if (courseFilter !== 'all') url.searchParams.set('course', courseFilter);
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url.toString());
      const data = await res.json();
      setMeritItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMeritList();
    }
  }, [isOpen, courseFilter, search]);

  if (!isOpen) return null;

  const candidateRank = meritItems.find(m => m.applicationId === user?.applicationId || m.candidateName.toLowerCase() === (user?.name || '').toLowerCase());

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#F8FAFC]">
      <div 
        id="merit-list-modal"
        className="bg-[#0F172A] max-w-4xl w-full rounded-xl border border-[#1E293B] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1E293B] flex justify-between items-center bg-[#030712]">
          <div className="flex items-center gap-3">
            <IEMLogo size="lg" variant="icon" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Admissions Scrutiny</span>
              <h3 className="font-headline font-bold text-lg text-[#F8FAFC]">
                Official 2026 Merit List &amp; Seat Allotments
              </h3>
              <p className="text-xs text-slate-400">
                Institute of Engineering &amp; Management Central Allotment Round 1
              </p>
            </div>
          </div>

          <button
            id="close-merit-list-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Highlight Banner (if in list) */}
        {candidateRank && (
          <div className="bg-teal-500/10 border-b border-teal-500/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-400 text-[#020617] font-bold text-xs flex items-center justify-center">
                #{candidateRank.rank}
              </div>
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">
                  Your Ranking: Rank #{candidateRank.rank} ({candidateRank.meritScore} Percentile)
                </p>
                <p className="text-[11px] text-slate-300">
                  Allotted: <span className="font-semibold text-teal-300">{candidateRank.allottedSeat || 'Round 1 Pending'}</span> in {candidateRank.course}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded self-start sm:self-auto">
              {candidateRank.status}
            </span>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-[#1E293B] bg-[#030712] flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#0F172A] text-slate-100 outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#0F172A] text-slate-200 outline-none"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science &amp; Eng (CSE)</option>
              <option value="Artificial Intelligence">AI &amp; Data Science</option>
              <option value="Electronics">Electronics &amp; Communication (ECE)</option>
              <option value="Information Technology">Information Technology (IT)</option>
            </select>

            <button
              onClick={fetchMeritList}
              className="p-2 rounded-lg border border-[#1E293B] bg-[#0F172A] text-slate-300 hover:bg-slate-800"
              title="Refresh list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0F172A]">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#030712] text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-[#1E293B]">
                <th className="py-2.5 px-3 rounded-l-lg">Rank</th>
                <th className="py-2.5 px-3">App ID</th>
                <th className="py-2.5 px-3">Candidate Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Merit Score</th>
                <th className="py-2.5 px-3">Allotted Seat</th>
                <th className="py-2.5 px-3 rounded-r-lg text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {meritItems.map((item) => {
                const isCurrentUser = item.applicationId === user?.applicationId;
                return (
                  <tr 
                    key={item.id}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      isCurrentUser ? 'bg-teal-500/10 font-bold text-teal-300' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold ${
                        item.rank <= 3 ? 'bg-teal-400 text-[#020617]' : 'bg-[#030712] border border-[#1E293B] text-slate-300'
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-400">
                      {item.applicationId}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#F8FAFC]">
                        {item.candidateName}
                        {isCurrentUser && (
                          <span className="ml-1.5 text-[9px] bg-teal-400 text-[#020617] font-bold px-1.5 py-0.2 rounded">YOU</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.course}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{item.category}</td>
                    <td className="py-3 px-3 text-right font-semibold text-teal-400">
                      {item.meritScore.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {item.allottedSeat || 'Under Round 1 Pool'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.status === 'Confirmed' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                        item.status === 'Allotted' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#030712] flex justify-between items-center font-mono">
          <span className="text-xs text-slate-400">
            Showing {meritItems.length} shortlisted candidate records
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold cursor-pointer transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
