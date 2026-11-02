import React from 'react';
import { X, Printer, Award, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { Application, User, MeritItem } from '../types';

interface AllotmentLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  user: User | null;
  meritItem?: MeritItem | null;
}

export const AllotmentLetterModal: React.FC<AllotmentLetterModalProps> = ({
  isOpen,
  onClose,
  application,
  user,
  meritItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#1e1c17]">
      <div 
        id="provisional-allotment-modal"
        className="bg-white max-w-2xl w-full rounded-2xl border border-[#ded9cf] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-[#ded9cf] bg-[#fdfbf5] flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#33253c]" />
            <h3 className="font-headline font-semibold text-sm text-[#33253c]">Provisional Admission Allotment Letter</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#4a454c] hover:text-[#1e1c17] hover:bg-[#f0eee6] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-[#1e1c17]">
          <div className="flex items-center justify-between border-b border-[#ded9cf] pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#33253c] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                IEM
              </div>
              <div>
                <h2 className="font-headline font-semibold text-base text-[#33253c]">Institute of Engineering &amp; Management</h2>
                <p className="text-xs text-[#4a454c]">Office of the Dean of Academic Admissions • Kolkata</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#4a454c] uppercase block">Ref No:</span>
              <span className="font-bold text-[#33253c] font-mono text-xs">IEM/ADM/2026/ALLOT-849</span>
            </div>
          </div>

          <div className="text-center py-3 bg-[#f9f6ed] rounded-xl border border-[#ded9cf]">
            <h3 className="font-headline font-bold text-sm text-[#33253c] uppercase">
              Provisional Seat Allotment Confirmation (Round 1)
            </h3>
            <p className="text-xs text-[#4a454c] mt-0.5">Academic Session 2026-2030</p>
          </div>

          <div className="text-xs leading-relaxed space-y-3">
            <p>
              Dear <strong className="text-[#33253c]">{application?.personal.fullName || user?.name || 'Candidate'}</strong> (Application ID: <span className="font-mono font-semibold">{application?.id || 'IEM-2026-001'}</span>),
            </p>
            <p className="text-[#4a454c]">
              We are pleased to inform you that on the basis of your academic performance and counseling evaluation, you have been provisionally allotted a seat in the following undergraduate engineering program:
            </p>

            <div className="p-4 bg-[#f9f6ed] rounded-xl border border-[#ded9cf] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Allotted Department:</span>
                <span className="font-bold text-[#33253c] text-sm">{meritItem?.course || application?.course.primaryCourse || 'B.Tech Computer Science & Engineering'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Allotted Category / Seat:</span>
                <span className="font-semibold text-emerald-800">{meritItem?.allottedSeat || 'Open Merit - General Category'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Merit Rank:</span>
                <span className="font-bold text-[#33253c]">#{meritItem?.rank || 14} (Score: {meritItem?.meritScore || 96.5}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Reporting Campus:</span>
                <span className="font-semibold text-[#1e1c17]">Salt Lake Electronics Complex, Kolkata</span>
              </div>
            </div>

            <p className="text-[#4a454c]">
              To finalize this allotment, please complete physical document verification at the admissions desk between the scheduled counseling dates with all original credentials.
            </p>
          </div>

          <div className="pt-4 border-t border-[#ded9cf] flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Official Institutional Registrar Seal</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-serif italic text-[#33253c] font-bold">Prof. Dr. A. K. Banerjee</div>
              <div className="text-[10px] text-[#4a454c]">Dean of Admissions, IEM Kolkata</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#ded9cf] bg-[#fdfbf5] flex justify-end gap-2 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#33253c] text-white text-xs font-semibold rounded-lg hover:bg-[#4a3b53] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
