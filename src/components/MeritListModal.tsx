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
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMeritItems(data);
        }
      }
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#1e1c17]">
      <div 
        id="merit-list-modal"
        className="bg-white max-w-4xl w-full rounded-2xl border border-[#ded9cf] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#ded9cf] flex justify-between items-center bg-[#fdfbf5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#33253c] text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-headline font-semibold text-lg text-[#33253c]">
                Official 2026 Merit List &amp; Seat Allotments
              </h3>
              <p className="text-xs text-[#4a454c]">
                Institute of Engineering &amp; Management Central Counseling Round 1
              </p>
            </div>
          </div>

          <button
            id="close-merit-list-modal"
            onClick={onClose}
            className="p-1.5 text-[#4a454c] hover:text-[#1e1c17] hover:bg-[#f0eee6] rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Highlight Banner (if in list) */}
        {candidateRank && (
          <div className="bg-[#e7dcea]/40 border-b border-[#ded9cf] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#33253c] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                #{candidateRank.rank}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#33253c]">
                  Your Ranking: Rank #{candidateRank.rank} ({candidateRank.meritScore} Score)
                </p>
                <p className="text-[11px] text-[#4a454c]">
                  Allotted: <span className="font-semibold text-[#1e1c17]">{candidateRank.allottedSeat || 'Round 1 Pending'}</span> in {candidateRank.course}
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
              {candidateRank.status}
            </span>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-[#ded9cf] bg-[#f9f6ed]/60 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#7b776d] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-white text-[#1e1c17] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#33253c]" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-white text-[#1e1c17] outline-none"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science &amp; Eng (CSE)</option>
              <option value="Artificial Intelligence">AI &amp; Data Science</option>
              <option value="Electronics">Electronics &amp; Communication (ECE)</option>
              <option value="Information Technology">Information Technology (IT)</option>
            </select>

            <button
              onClick={fetchMeritList}
              className="p-2 rounded-lg border border-[#ded9cf] bg-white text-[#4a454c] hover:bg-[#f0eee6] cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9f6ed] text-[#4a454c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#ded9cf]">
                <th className="py-2.5 px-3 rounded-l-lg">Rank</th>
                <th className="py-2.5 px-3">App ID</th>
                <th className="py-2.5 px-3">Candidate Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Merit Score</th>
                <th className="py-2.5 px-3">Allotted Seat</th>
                <th className="py-2.5 px-3 rounded-r-lg text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded9cf]/60">
              {meritItems.map((item) => {
                const isCurrentUser = item.applicationId === user?.applicationId;
                return (
                  <tr 
                    key={item.id}
                    className={`hover:bg-[#f9f6ed]/60 transition-colors ${
                      isCurrentUser ? 'bg-[#e7dcea]/30 font-semibold' : 'text-[#1e1c17]'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold ${
                        item.rank <= 3 ? 'bg-[#33253c] text-white shadow-2xs' : 'bg-[#f0eee6] text-[#4a454c]'
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-[#4a454c] font-mono">
                      {item.applicationId}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#1e1c17] font-medium">
                        {item.candidateName}
                        {isCurrentUser && (
                          <span className="ml-1.5 text-[9px] bg-[#33253c] text-white font-bold px-1.5 py-0.5 rounded">YOU</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#4a454c]">{item.course}</div>
                    </td>
                    <td className="py-3 px-3 text-[#4a454c]">{item.category}</td>
                    <td className="py-3 px-3 text-right font-semibold text-[#33253c]">
                      {item.meritScore.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-[#1e1c17]">
                      {item.allottedSeat || 'Round 1 Pool'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        item.status === 'Allotted' ? 'bg-[#e7dcea] text-[#33253c] border border-[#e7dcea]' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
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
        <div className="p-4 border-t border-[#ded9cf] bg-[#fdfbf5] flex justify-between items-center">
          <span className="text-xs text-[#4a454c]">
            Showing {meritItems.length} shortlisted candidate entries
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
