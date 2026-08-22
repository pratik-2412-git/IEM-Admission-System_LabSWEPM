import React from 'react';
import { X, Download, Printer, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Application, User, PaymentRecord } from '../types';
import { IEMLogo } from './IEMLogo';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  user: User | null;
  payment?: PaymentRecord | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  application,
  user,
  payment,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const iemLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuAhk-GeFs0zS-XHK3_pNbQxmaT2TKcUQhSfLrPNJpAwwmuiLTcaP9i6-FiW8cF4I740leSDyWe0Vuil2odmfLPIkJnd4R3NOFBjYfrww-y_dhdrtVF9yVus69KtP0rV7noIVq4REnrQw7V0-LdwzBCocnd5BFge_80nYtDh1RjG8IhgLPxPBWWW3t5s_FE9aD3zMj_TNG9KILh3YX3JQeD7JosJAma2W_mLRFxFLIdyIW394TlfjloqjdH77eTV9VT6aQ";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#F8FAFC]">
      <div 
        id="application-receipt-modal"
        className="bg-[#0F172A] max-w-2xl w-full rounded-xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Toolbar */}
        <div className="p-4 border-b border-[#1E293B] bg-[#030712] flex justify-between items-center print:hidden">
          <h3 className="font-headline font-bold text-sm text-[#F8FAFC]">Official Application Acknowledgement</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg border border-[#1E293B] bg-[#0F172A] text-teal-400 hover:bg-slate-800 text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate / Receipt Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-[#F8FAFC]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div className="flex items-center gap-3.5">
              <IEMLogo size="lg" variant="icon" />
              <div>
                <h2 className="font-headline font-bold text-base text-[#F8FAFC]">Institute of Engineering &amp; Management</h2>
                <p className="text-[11px] text-slate-400">Central Admissions Cell • Salt Lake, Sector V, Kolkata</p>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block">APPLICATION ID</span>
              <span className="font-bold text-teal-400 text-sm">{application?.id || 'IEM-2026-001'}</span>
            </div>
          </div>

          <div className="text-center py-2.5 bg-[#030712] rounded-lg border border-[#1E293B]">
            <h4 className="font-headline font-bold text-xs text-teal-300 tracking-wider uppercase font-mono">
              Application Submission Acknowledgement (2026-2027)
            </h4>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#030712] rounded-lg border border-[#1E293B]">
              <span className="text-[10px] text-slate-400 uppercase block">Applicant Name</span>
              <span className="font-bold text-sm text-[#F8FAFC]">{application?.personal.fullName || user?.name}</span>
            </div>

            <div className="p-3 bg-[#030712] rounded-lg border border-[#1E293B]">
              <span className="text-[10px] text-slate-400 uppercase block">Registered Email</span>
              <span className="font-medium text-xs text-slate-300">{application?.personal.email || user?.email}</span>
            </div>

            <div className="p-3 bg-[#030712] rounded-lg border border-[#1E293B]">
              <span className="text-[10px] text-slate-400 uppercase block">Target Program</span>
              <span className="font-bold text-xs text-teal-300">{application?.course.primaryCourse}</span>
            </div>

            <div className="p-3 bg-[#030712] rounded-lg border border-[#1E293B]">
              <span className="text-[10px] text-slate-400 uppercase block">Qualifying Score</span>
              <span className="font-medium text-xs text-slate-200">{application?.academic.percentageCgpa}% / CGPA</span>
            </div>
          </div>

          {/* Verification Barcode & Seal */}
          <div className="p-4 rounded-lg border border-[#1E293B] bg-[#030712] flex items-center justify-between font-mono">
            <div>
              <p className="text-[11px] font-semibold text-slate-200">Application Status: <span className="text-teal-400 font-bold uppercase">{application?.status || 'SUBMITTED'}</span></p>
              <p className="text-[10px] text-slate-400 mt-0.5">Submitted On: {new Date(application?.updatedAt || Date.now()).toLocaleDateString()}</p>
              <p className="text-[9px] text-slate-400 mt-1">SHA256: 98b4f128c74a0092e01fa8</p>
            </div>

            <div className="w-16 h-16 rounded-full border border-dashed border-teal-400/50 flex items-center justify-center text-center p-1 text-teal-400">
              <span className="text-[8px] font-bold uppercase leading-tight">IEM KOLKATA ADMISSIONS SEAL</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#030712] flex justify-end gap-2 print:hidden font-mono">
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
