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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#1e1c17]">
      <div 
        id="application-receipt-modal"
        className="bg-white max-w-2xl w-full rounded-2xl border border-[#ded9cf] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Toolbar */}
        <div className="p-4 border-b border-[#ded9cf] bg-[#fdfbf5] flex justify-between items-center print:hidden">
          <h3 className="font-headline font-semibold text-sm text-[#33253c]">Official Application Acknowledgement</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#4a454c] hover:text-[#1e1c17] hover:bg-[#f0eee6] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate / Receipt Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-[#1e1c17]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ded9cf] pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#33253c] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                IEM
              </div>
              <div>
                <h2 className="font-headline font-semibold text-base text-[#33253c]">Institute of Engineering &amp; Management</h2>
                <p className="text-xs text-[#4a454c]">Central Admissions Registry • Salt Lake, Sector V, Kolkata</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#4a454c] font-medium uppercase block">Application ID</span>
              <span className="font-bold text-[#33253c] text-sm font-mono">{application?.id || 'IEM-2026-001'}</span>
            </div>
          </div>

          <div className="text-center py-2.5 bg-[#f9f6ed] rounded-lg border border-[#ded9cf]">
            <h4 className="font-headline font-semibold text-xs text-[#33253c] tracking-wider uppercase">
              Application Submission Acknowledgement (2026-2027)
            </h4>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#f9f6ed] rounded-xl border border-[#ded9cf]">
              <span className="text-[10px] text-[#4a454c] font-medium uppercase block">Applicant Full Name</span>
              <span className="font-bold text-sm text-[#1e1c17]">{application?.personal.fullName || user?.name}</span>
            </div>

            <div className="p-3.5 bg-[#f9f6ed] rounded-xl border border-[#ded9cf]">
              <span className="text-[10px] text-[#4a454c] font-medium uppercase block">Registered Email</span>
              <span className="font-semibold text-xs text-[#1e1c17]">{application?.personal.email || user?.email}</span>
            </div>

            <div className="p-3.5 bg-[#f9f6ed] rounded-xl border border-[#ded9cf]">
              <span className="text-[10px] text-[#4a454c] font-medium uppercase block">Target Program Choice</span>
              <span className="font-bold text-xs text-[#33253c]">{application?.course.primaryCourse}</span>
            </div>

            <div className="p-3.5 bg-[#f9f6ed] rounded-xl border border-[#ded9cf]">
              <span className="text-[10px] text-[#4a454c] font-medium uppercase block">Qualifying Academic Score</span>
              <span className="font-semibold text-xs text-[#1e1c17]">{application?.academic.percentageCgpa}% / CGPA</span>
            </div>
          </div>

          {/* Verification Barcode & Seal */}
          <div className="p-4 rounded-xl border border-[#ded9cf] bg-[#f9f6ed] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#1e1c17]">Application Status: <span className="text-emerald-800 font-bold uppercase">{application?.status || 'SUBMITTED'}</span></p>
              <p className="text-[11px] text-[#4a454c] mt-0.5">Submitted On: {new Date(application?.updatedAt || Date.now()).toLocaleDateString()}</p>
              <p className="text-[10px] text-[#7b776d] font-mono mt-1">SHA256 Checksum: 98b4f128c74a0092e01fa8</p>
            </div>

            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#33253c]/40 flex items-center justify-center text-center p-1 text-[#33253c]">
              <span className="text-[8px] font-bold uppercase leading-tight">IEM ADMISSIONS SEAL</span>
            </div>
          </div>
        </div>

        {/* Footer */}
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
