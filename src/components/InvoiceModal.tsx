import React from 'react';
import { X, Printer, Receipt, CheckCircle2 } from 'lucide-react';
import { Application, PaymentRecord } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  payment?: PaymentRecord | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  application,
  payment,
}) => {
  if (!isOpen) return null;

  const txnId = payment?.transactionId || payment?.transactionReference || 'TXN-IEM-98214';
  const invoiceNum = payment?.invoiceNumber || 'INV-IEM-2026-001';
  const amount = 0.00; // Strictly ₹0.00

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#1e1c17]">
      <div 
        id="fee-invoice-modal"
        className="bg-white max-w-2xl w-full rounded-2xl border border-[#ded9cf] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-[#ded9cf] bg-[#fdfbf5] flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#33253c]" />
            <h3 className="font-headline font-semibold text-sm text-[#33253c]">Fee Payment Tax Invoice</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#4a454c] hover:text-[#1e1c17] rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-[#1e1c17]">
          <div className="flex justify-between items-start border-b border-[#ded9cf] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#33253c] text-white flex items-center justify-center font-bold text-xs">
                IEM
              </div>
              <div>
                <h2 className="font-headline font-semibold text-base text-[#33253c]">IEM Admission Processing Cell</h2>
                <p className="text-xs text-[#4a454c]">Salt Lake Campus, Sector V, Bidhannagar, Kolkata 700091</p>
                <p className="text-[11px] text-[#7b776d]">GSTIN: 19AAATI9982D1Z5</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#4a454c] uppercase block">Official Tax Invoice</span>
              <span className="font-bold text-[#33253c] font-mono text-sm">{invoiceNum}</span>
              <span className="text-[11px] text-[#4a454c] block mt-0.5">Date: {new Date(payment?.paidAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#f9f6ed] p-4 rounded-xl border border-[#ded9cf]">
            <div>
              <span className="text-[10px] font-semibold text-[#4a454c] uppercase block">Billed To (Candidate):</span>
              <p className="font-bold text-sm text-[#1e1c17] mt-0.5">{application?.personal.fullName || 'Registered Candidate'}</p>
              <p className="text-[#4a454c] mt-0.5 font-mono">App ID: {application?.id || 'IEM-2026-001'}</p>
              <p className="text-[#4a454c]">{application?.personal.email}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-[#4a454c] uppercase block">Payment Method:</span>
              <p className="font-bold text-sm text-[#1e1c17] mt-0.5">{payment?.paymentMethod || 'IEM Online Gateway'}</p>
              <p className="text-[#4a454c] font-mono text-[11px]">Txn Ref: {txnId}</p>
              <p className="text-emerald-700 font-semibold mt-1">STATUS: COMPLETED (₹0.00)</p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f9f6ed] text-[#4a454c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#ded9cf]">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">HSN/SAC</th>
                  <th className="py-2.5 px-3 text-right">Standard Fee</th>
                  <th className="py-2.5 px-3 text-right">Academic Waiver</th>
                  <th className="py-2.5 px-3 text-right">Net Charged (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ded9cf]/60">
                <tr>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-[#1e1c17]">IEM Admission Processing &amp; Scrutiny Fee</p>
                    <p className="text-[11px] text-[#4a454c]">Session 2026-2027 Counseling Evaluation</p>
                  </td>
                  <td className="py-3 px-3 text-center text-[#4a454c] font-mono">999293</td>
                  <td className="py-3 px-3 text-right font-mono line-through text-[#7b776d]">₹1,500.00</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-800">- ₹1,500.00</td>
                  <td className="py-3 px-3 text-right font-bold font-mono">₹0.00</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-[#ded9cf] font-semibold">
                  <td colSpan={4} className="py-3 px-3 text-right text-xs">Total Amount Paid by Candidate:</td>
                  <td className="py-3 px-3 text-right text-sm font-bold text-emerald-800 font-mono">₹0.00</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Electronic Receipt Certified &amp; Archived in University Database
            </span>
            <span className="font-mono text-[11px]">GATEWAY: IEM_PORTAL_₹0</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#ded9cf] bg-[#fdfbf5] flex justify-end gap-2 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#33253c] text-white text-xs font-semibold rounded-lg hover:bg-[#4a3b53] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
