import React from 'react';
import { X, Printer, Award, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { Application, User, MeritItem } from '../types';
import { IEMLogo } from './IEMLogo';

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

  const iemLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuAhk-GeFs0zS-XHK3_pNbQxmaT2TKcUQhSfLrPNJpAwwmuiLTcaP9i6-FiW8cF4I740leSDyWe0Vuil2odmfLPIkJnd4R3NOFBjYfrww-y_dhdrtVF9yVus69KtP0rV7noIVq4REnrQw7V0-LdwzBCocnd5BFge_80nYtDh1RjG8IhgLPxPBWWW3t5s_FE9aD3zMj_TNG9KILh3YX3JQeD7JosJAma2W_mLRFxFLIdyIW394TlfjloqjdH77eTV9VT6aQ";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#F8FAFC]">
      <div 
        id="provisional-allotment-modal"
        className="bg-[#0F172A] max-w-2xl w-full rounded-xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-[#1E293B] bg-[#030712] flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-400" />
            <h3 className="font-headline font-bold text-sm text-[#F8FAFC]">Provisional Admission Allotment Letter</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg border border-[#1E293B] bg-[#0F172A] text-teal-400 hover:bg-slate-800 text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT_LETTER</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-[#F8FAFC]">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div className="flex items-center gap-3.5">
              <IEMLogo size="lg" variant="icon" />
              <div>
                <h2 className="font-headline font-bold text-base text-[#F8FAFC]">Institute of Engineering &amp; Management</h2>
                <p className="text-[11px] text-slate-400">Office of the Dean of Academic Admissions • Kolkata</p>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block">PROVISIONAL OFFER</span>
              <span className="font-bold text-teal-400 text-sm">CONFIRMED</span>
            </div>
          </div>

          <div className="bg-[#030712] border border-[#1E293B] p-4 rounded-lg text-xs space-y-3 font-mono">
            <p className="text-slate-200"><strong>Dear {application?.personal.fullName || user?.name},</strong></p>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              We are pleased to inform you that based on your performance in the academic qualifying exams and centralized institutional merit screening (Rank #{meritItem?.rank || 4}), you have been provisionally allotted a seat for the Academic Session 2026-2027:
            </p>

            <div className="bg-[#0F172A] p-3.5 rounded-lg border border-[#1E293B] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Program Allotted:</span>
                <span className="font-bold text-teal-300">{application?.course.primaryCourse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seat Number / Code:</span>
                <span className="font-bold text-slate-100">{meritItem?.allottedSeat || 'CSE-A-004'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Campus:</span>
                <span className="font-medium text-slate-200">IEM Main Campus (Salt Lake Sector V)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Physical Reporting Window:</span>
                <span className="font-medium text-teal-400">July 15 - July 22, 2026</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1E293B] pt-4 flex justify-between items-center text-xs font-mono">
            <div>
              <p className="font-semibold text-slate-200">Prof. (Dr.) S. Chatterjee</p>
              <p className="text-[11px] text-slate-400">Dean of Admissions &amp; Academic Affairs</p>
            </div>
            <div className="text-right">
              <div className="w-24 h-10 border border-[#1E293B] bg-[#030712] rounded flex items-center justify-center text-[10px] text-teal-400 font-mono">
                [DEAN_SEAL]
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#1E293B] bg-[#030712] flex justify-end print:hidden font-mono">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2DD4BF] text-[#020617] text-xs font-bold rounded-lg hover:bg-teal-400 cursor-pointer transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
